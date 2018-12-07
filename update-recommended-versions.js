"use strict";

/***************************************************************************
 *
 * (C) Copyright IBM Corp. 2018
 *
 *  This program and the accompanying materials are made available
 *  under the terms of the Apache License v2.0 which accompanies
 *  this distribution.
 *
 *      The Apache License v2.0 is available at
 *      http://www.opensource.org/licenses/apache2.0.php
 *
 * Contributors:
 *   Multiple authors (IBM Corp.) - initial implementation and documentation
 ***************************************************************************/

const request = require("request-promise");
const lookup = require("./lookup.json");

const HOST = process.env.HOST;
const TOKEN = process.env.TOKEN;

function getModule(moduleName) {
  return request.get({
    url: `http://${HOST}/api/Modules`,
    followAllRedirects: true,
    json: true,
    headers: {
      "filter": JSON.stringify({
        "where": {
          "name": moduleName
        }
      })
    }
  }, (err, res, body) => {
    if (err || res.statusCode !== 200) {
      console.error(body.error);
      process.exit(1);
    }
  });
}

function getLTSs() {
  return request.get({
    url: `http://${HOST}/api/LTSVersions`,
    followAllRedirects: true,
    json: true
  }, (err, res, body) => {
    if (err || res.statusCode !== 200) {
      console.error(body.error);
      process.exit(1);
    }
  });
}

function getRecommendedVersion(lts_version_id, module_id) {
  return request.get({
    url: `http://${HOST}/api/ModuleRecommendedLTSs`,
    followAllRedirects: true,
    json: true,
    headers: {
      "filter": JSON.stringify({
        "where": {
          "lts_version_id": lts_version_id,
          "module_id": module_id
        }
      })
    }
  }, (err, res, body) => {
    if (err || res.statusCode !== 200) {
      console.error(body.error);
      process.exit(1);
    }
    return body;
  });
}

function getCurrentRecommendedVersions() {
  return request.get({
    url: `http://${HOST}/api/ModuleRecommendedLTSs`,
    followAllRedirects: true,
    headers: {
      "filter": JSON.stringify({
        "include": [
          "LTSVersion",
          "Module"
        ]
      })
    }
  }, (err, res, body) => {
    if (err || res.statusCode !== 200) {
      console.error(body.error);
      process.exit(1);
    }
    return body;
  });
}

function addRecommendedVersion(data) {
  return request.post({
    url: `http://${HOST}/api/ModuleRecommendedLTSs`,
    followAllRedirects: true,
    headers: {
      "Authorization": TOKEN
    },
    body: data,
    json: true // Automatically stringifies the body to JSON
  }, (err, res) => {
    if (err || res.statusCode !== 200) {
      process.exit(1);
    }
  });
}

function patchRecommendedVersion(data) {
  return request.patch({
    url: `http://${HOST}/api/ModuleRecommendedLTSs`,
    followAllRedirects: true,
    headers: {
      "Authorization": TOKEN
    },
    body: data,
    json: true // Automatically stringifies the body to JSON
  }, (err, res) => {
    if (err || res.statusCode !== 200) {
      process.exit(1);
    }
  });
}

async function updateRecommendedVersions() {
  const recommendedVersions = await getCurrentRecommendedVersions();
  JSON.parse(recommendedVersions).forEach((recommendedVersion) => {
    const moduleName = recommendedVersion.Module.name;
    const recMajorVersion = "recommended-major-versions";
    const recLTSVersion =
    `${recommendedVersion.LTSVersion.lts_version}.x`;
    const lookupVersion = lookup[moduleName][recMajorVersion][recLTSVersion];
    if (recommendedVersion.recommended_version !== lookupVersion) {
      patchRecommendedVersion({
        "lts_version_id": recommendedVersion.lts_version_id,
        "module_id": recommendedVersion.module_id,
        "recommended_version": lookupVersion,
        "id": recommendedVersion.id
      });
    }
  });
}

async function addMissingRecommendedVersions() {
  const ltsVersions = await getLTSs();
  Object.keys(lookup).forEach(async (moduleName) => {
    ltsVersions.forEach(async (lts) => {
      const ltsMajor = `${lts.lts_version}.x`
      const recMajorVersion = lookup[moduleName]["recommended-major-versions"][ltsMajor];
      if (recMajorVersion) {
        const module = await getModule(moduleName);
        const module_id = module[0].id;
        const currentRecommended = await getRecommendedVersion(lts.id, module_id);
        if (currentRecommended.length == 0) {
          addRecommendedVersion({
            "lts_version_id": lts.id,
            "module_id": module_id,
            "recommended_version": recMajorVersion
          });
        }
      } else {
        console.log(`${moduleName} doesn't have a recommended major version for node ${ltsMajor} in the lookup`);
      }
    });
  });
}

updateRecommendedVersions();
addMissingRecommendedVersions();

