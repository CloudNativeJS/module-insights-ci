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

const {
  spawnSync
} = require("child_process");
const request = require("request-promise");
const fs = require("fs");
const path = require("path");
const lookup = JSON.parse(fs.readFileSync(
  path.join(__dirname, "/lookup.json")
));
const HOST = process.env.HOST;
const TOKEN = process.env.TOKEN;
const TIMESTAMP = new Date();
let params = [];

if (TOKEN === null || TOKEN === "Incorrect Credentials") {
  console.error("TOKEN is not defined");
  process.exit(1);
}

function check(e, r, b) {
  if (e || r.statusCode !== 200) {
    console.error(b.error);
    process.exit(1);
  } else {
    return b;
  }
}

/*
Find missing test results for the latest module_version and
latest node_version (per LTS).
*/
function getLatestNodeVersion() {
  return request.get({
    url: `http://${HOST}/api/LTSVersions/latestNodeVersion`,
    followAllRedirects: true
  }, (err, res, body) => {
    check(err, res, body);
  });
}

// Fetch the list of valid platforms
function getValidPlatforms() {
  return request.get({
    url: `http://${HOST}/api/ValidPlatforms`,
    followAllRedirects: true
  }, (err, res, body) => {
    check(err, res, body);
  });
}

// Adds a new node version to the DB
function addNodeVersion(nodeVersion) {
  let LTSVersion = nodeVersion.split(".")[0].replace("v", "");
  request.post({
    url: `http://${HOST}/api/NodeVersions`,
    followAllRedirects: true,
    headers: {
      "Authorization": TOKEN
    },
    body: {
      "node_version": nodeVersion,
      "lts_version": LTSVersion
    },
    json: true // Automatically stringifies the body to JSON
  }, (err, res, body) => {
    check(err, res, body);
  });
}

function getModule(moduleName) {
  return request.get({
    url: `http://${HOST}/api/Modules`,
    headers: {
      filter: JSON.stringify({
        "where": {
          "name": moduleName
        }
      })
    },
    followAllRedirects: true
  }, (err, res, body) => {
    check(err, res, body);
  });
}

// Adds a new module version to the DB
function addModule(moduleName) {
  return request.post({
    url: `http://${HOST}/api/Modules`,
    followAllRedirects: true,
    headers: {
      "Authorization": TOKEN
    },
    body: {
      "name": moduleName
    },
    json: true // Automatically stringifies the body to JSON
  }, (err, res, body) => {
    check(err, res, body);
  });
}

async function getModuleVersion(moduleName, moduleVersion) {
  const module = await getModule(moduleName);
  const moduleID = (module) ? JSON.parse(module)[0].id : null;
  return request.get({
    url: `http://${HOST}/api/ModuleVersions`,
    headers: {
      filter: JSON.stringify({
        "where": {
          "module_id": moduleID,
          "module_version": moduleVersion
        }
      })
    },
    followAllRedirects: true,
    json: true
  }, (err, res, body) => {
    check(err, res, body);
  });
}

function addModuleVersion(moduleName, moduleVersion) {
  let license = spawnSync("npm", ["view", moduleName,
    "license"
  ]).stdout.toString().trim();
  return request.post({
    url: `http://${HOST}/api/ModuleVersions`,
    followAllRedirects: true,
    headers: {
      "Authorization": TOKEN
    },
    body: {
      "module": moduleName,
      "module_version": moduleVersion,
      "license": license || null,
      "min_dep_license": license || null,
      "timestamp": TIMESTAMP
    },
    json: true // Automatically stringifies the body to JSON
  }, (err, res, body) => {
    check(err, res, body);
  });
}

function addRecommendedVersions(moduleName) {
  let recMajorVersions = lookup[moduleName]["recommended-major-versions"];
  for (let recVersion in recMajorVersions) {
    let ltsVersion = recVersion.split(".")[0];
    request.post({
      url: `http://${HOST}/api/ModuleRecommendedLTSs`,
      followAllRedirects: true,
      headers: {
        "Authorization": TOKEN
      },
      body: {
        "lts_version": ltsVersion,
        "module": moduleName,
        "recommended_version": recMajorVersions[recVersion]
      },
      json: true // Automatically stringifies the body to JSON
    }, (err) => {
      if (err) {
        return console.error(err);
      }
    });
  }
}

// Fetch all tests for each module
function getModuleVersionTests(moduleName, moduleVersion, ltsVersion) {
  let filter = {
    "where": {
      "module": moduleName,
      "module_version": moduleVersion,
      "node_version": ltsVersion.latestNodeVersion
    },
    "include": ["Architecture", "Distribution", "OperatingSystem"]
  };
  return request.get({
    url: `http://${HOST}/api/ModuleVersionTests`,
    followAllRedirects: true,
    headers: {
      filter: JSON.stringify(filter)
    },
    json: true
  }, (err, res, body) => {
    check(err, res, body);
  });
}

async function missingTests() {

  const ltsVersions = JSON.parse(await getLatestNodeVersion());
  const validPlatforms = JSON.parse(await getValidPlatforms());

  // Add a new Node Versions
  if (ltsVersions[0].latestNodeVersion !== process.env.node6) {
    await addNodeVersion(process.env.node6);
  }
  if (ltsVersions[1].latestNodeVersion !== process.env.node8) {
    await addNodeVersion(process.env.node8);
  }
  if (ltsVersions[2].latestNodeVersion !== process.env.node10) {
    await addNodeVersion(process.env.node10);
  }

  async function checkModuleExists(moduleName, moduleVersion) {
    let moduleExists = await getModule(moduleName);
    if (JSON.parse(moduleExists).length === 0) {
      await addModule(moduleName);
      await addModuleVersion(moduleName, moduleVersion);
      await addRecommendedVersions(moduleName);
    }
  }

  // Add a new Module Versions
  let modules = [];

  for (let i in Object.keys(lookup)) {
    const moduleName = Object.keys(lookup)[i];
    const moduleData = lookup[moduleName];

    const moduleVersions = new Set();
    // Add Latest Module Version
    const latestModuleVersion =
      spawnSync("npm", ["view", moduleName, "version"])
        .stdout.toString().trim();
    moduleVersions.add(latestModuleVersion);

    // Add Latest Module Version for each recommended major version
    const recMajorVersions = moduleData["recommended-major-versions"];
    Object.keys(recMajorVersions).forEach(lts => {
      const recMajVersion = recMajorVersions[lts];
      const allVersionsForMajor =
        spawnSync("npm", ["view", `${moduleName}@${recMajVersion}`, "version"])
          .stdout.toString().trim().split(" ");
      // Latest Module Version for Major
      const moduleVersionForMajor =
        allVersionsForMajor[allVersionsForMajor.length - 1].replace(/'/g, "");

      // Add required module version is it isnt a duplicate
      if (!moduleVersions.has(moduleVersionForMajor)) {
        moduleVersions.add(moduleVersionForMajor);
      }
    });

    // Array.from() converts a set to an Array
    modules.push({
      name: moduleName,
      versions: Array.from(moduleVersions)
    });

    //Add ModuleVersions
    await checkModuleExists(moduleName, latestModuleVersion);
    moduleVersions.forEach(async moduleVersion => {
      const resp = await getModuleVersion(moduleName, moduleVersion);
      if (resp.length === 0) {
        await addModuleVersion(moduleName, moduleVersion);
      }
    });
  }

  await findMissingTests();
  console.log(params.join("%"));

  async function findMissingTests() {
    for (let i in modules) {
      let module = modules[i];
      for (let j in ltsVersions) {
        let ltsVersion = ltsVersions[j];
        for (let k in module.versions) {
          let moduleVersion = module.versions[k];
          const mvt =
            await getModuleVersionTests(module.name, moduleVersion, ltsVersion);
          if (mvt.length === 0) {
            // Run on all platforms
            params.push([module.name, moduleVersion,
              ltsVersion.latestNodeVersion, "all", "all", "all"
            ]);
          } else if (mvt.length !== validPlatforms.length) {
            /*
            Don't run if no missing files.
            IF there are => for each valid platform check if
            there is an existing test result
            */
            validPlatforms.forEach(plat => {
              let exist = false;
              try {
                mvt.forEach(test => {
                  if (test.OperatingSystem.os === plat.os &&
                    test.Architecture.arch === plat.arch &&
                    test.Distribution.distro === plat.distro) {
                    exist = true;
                  }
                });
              } catch (e) {
                console.error(e);
              }
              if (!exist) {
                params.push([module.name, moduleVersion,
                  ltsVersion.latestNodeVersion, plat.os, plat.arch, plat.distro
                ]);
              }
            });
          }
        }
      }
    }
  }
}
missingTests();
