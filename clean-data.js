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

const HOST = process.env.HOST;
const TOKEN = process.env.TOKEN;

const LOOKUP = require("./lookup.json");

function getReq (url, filterList) {
  return request.get({
    uri: url,
    headers: {
      filter: JSON.stringify(filterList) || null
    },
    followAllRedirects: true
  }, (err, res, body) => {
    if (err || res.statusCode !== 200) {
      process.exit(1);
    } else {
      return body;
    }
  });
}

function deleteReq(url) {
  return request.del({
    uri: url,
    headers: {
      Authorization: TOKEN
    },
    followAllRedirects: true,
    json: true
  }, (err, res) => {
    if (err) {
      return process.exit(1);

    } else {
      return res.statusCode;
    }
  });
}

// ID's to delete
let modules = new Set();
let moduleVersions = new Set();
let moduleVersionTests = new Set();
let moduleRecommendedLTSs = new Set();

function runDeletes () {
  console.log(`Deleting ${moduleVersions.size} modules`);
  modules.forEach((id) => {
    deleteReq(`http://${HOST}/api/Modules/${id}`);
  });
  console.log(`Deleting ${moduleVersions.size} orphan module versions`);
  moduleVersions.forEach((id) => {
    deleteReq(`http://${HOST}/api/ModuleVersions/${id}`);
  });
  console.log(`Deleting ${moduleVersionTests.size} ` +
    "orphan module version tests");
  moduleVersionTests.forEach((id) => {
    deleteReq(`http://${HOST}/api/ModuleVersionTests/${id}`);
  });
  console.log(`Deleting ${moduleRecommendedLTSs.size} ` +
    "orphan module recommended LTSs");
  moduleRecommendedLTSs.forEach((id) => {
    deleteReq(`http://${HOST}/api/ModuleRecommendedLTSs/${id}`);
  });
}

const filter = {
  "include": [
    {"ModuleVersion": "Module"},
    "Architecture",
    "Distribution",
    "OperatingSystem"
  ]
};

async function cleanup () {
  const MVTS = JSON.parse(await getReq(`http://${HOST}/api/ModuleVersionTests`,
    filter));
  for (let mvt of MVTS) {
    // Check ModuleVersion and Module
    if (!mvt.ModuleVersion) {
      if (!moduleVersionTests.has(mvt.id)) {
        moduleVersionTests.add(mvt.id);
      }
    } else {
      if (!mvt.ModuleVersion.Module) {
        if (!moduleVersionTests.has(mvt.id)) {
          moduleVersionTests.add(mvt.id);
        }
        if (!moduleVersions.has(mvt.ModuleVersion.id)) {
          moduleVersions.add(mvt.ModuleVersion.id);
        }
      }
    }
    // Check Architecture
    if (!mvt.Architecture) {
      if (!moduleVersionTests.has(mvt.id)) {
        moduleVersionTests.add(mvt.id);
      }
    }
    // Check Distribution
    if (!mvt.Distribution) {
      if (!moduleVersionTests.has(mvt.id)) {
        moduleVersionTests.add(mvt.id);
      }
    }
    // Check OperatingSystem
    if (!mvt.OperatingSystem) {
      if (!moduleVersionTests.has(mvt.id)) {
        moduleVersionTests.add(mvt.id);
      }
    }
  }

  // Find orphan ModuleVersions
  const MODULE_VERSIONS = JSON.parse(
    await getReq(`http://${HOST}/api/ModuleVersions`, {"include": "Module"})
  );

  for (let moduleVersion of MODULE_VERSIONS) {
    if (!moduleVersion.Module) {
      if (!moduleVersions.has(moduleVersion.id)) {
        moduleVersions.add(moduleVersion.id);
      }
    }
  }

  const MODULE_REC_LTS = JSON.parse(
    await getReq(`http://${HOST}/api/ModuleRecommendedLTSs`,
      {"include":"Module"}));
  for (let mrlts of MODULE_REC_LTS) {
    // Check Module
    if (!mrlts.Module) {
      if (!moduleRecommendedLTSs.has(mrlts.id)) {
        moduleRecommendedLTSs.add(mrlts.id);
      }
    }
  }

  const MODULES = JSON.parse(
    await getReq(`http://${HOST}/api/Modules`));
  MODULES.forEach(module => {
    if (!LOOKUP[module.name]) {
      if (!modules.has(module.id)) {
        modules.add(module.id);
      }
    }
  });
  runDeletes();
}

cleanup();
