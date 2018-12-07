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
const [moduleName, moduleVersion] = [process.env.MODULE,
  process.env.MODULE_VERSION];
const HOST = process.env.HOST;
const TOKEN = process.env.TOKEN;

// Throw an error if license report doesn't exist
let json;
try {
  json = require(`${process.env.WORKSPACE}/`+
    `${moduleName.replace(/\//, "%2F")}/license.json`);
} catch (e) {
  throw e;
}

/* Create an object with all dependencies and their license
e.g {"request@2.85.0": "MIT", "appmetrics@4.0.0": "Apache2.0"} */
let obj = {};
Object.keys(json).forEach(depModule => {
  let depModuleName = depModule.split("@")[0];
  if (depModuleName !== moduleName) {
    obj[depModule] = json[depModule].licenses;
  } else {
    delete obj.depModule;
  }
});

function check (e, r, b) {
  if (e || r.statusCode !== 200) {
    console.error(b.error);
    process.exit(1);
  } else {
    return b;
  }
}

/* Posting an object (like above) to /api/DepModuleVersions/add:
 - adds all dep licenses at once if they don't exist
 - returns an object with all of the depIds and distinct depsLicenses. */
function updateDepModuleVersions () {
  return request.post({
    url: `http://${HOST}/api/DepModuleVersions/add`,
    followAllRedirects: true,
    headers: {
      "Authorization": TOKEN
    },
    body: {
      obj: obj
    },
    json: true // Automatically stringifies the body to JSON
  }, (err, res, body) => {
    licenseObj(body);
    check(err, res, body);
  });
}

function getModuleVersionID() {
  return request.get({
    url: `http://${HOST}/api/ModuleVersions`,
    followAllRedirects: true,
    headers: {
      filter: JSON.stringify({
        "where": {
          "module": moduleName,
          "module_version": moduleVersion
        }
      })
    },
    json: true
  }, (err, res, body) => {
    if (err || res.statusCode !== 200) {
      console.error(body.error);
      process.exit(1);
    }
    return body;
  });
}

async function patchLicense(licenseObj) {
  const id = await getModuleVersionID(licenseObj);
  if (id[0] && id[0].id) {
    licenseObj.id = id[0].id;
  }
  console.log(licenseObj);
  return request.patch({
    url: `http://${HOST}/api/ModuleVersions`,
    followAllRedirects: true,
    headers: {
      "Authorization": TOKEN
    },
    body: licenseObj,
    json: true
  }, (err, res) => {
    if (err || res.statusCode !== 200) {
      process.exit(1);
    }
  });
}

async function licenseObj (retObj) {
  const depsIds = retObj.ids || " ";
  const depsLicenses = retObj.licenses || " ";
  // Number of unique licenses
  const depsLicensesCount = retObj.licenses_count || " ";
  const licenseObj = {
    module: moduleName,
    module_version: moduleVersion,
    deps_ids: depsIds,
    deps_licenses: depsLicenses,
    deps_licenses_count: depsLicensesCount
  };
  await patchLicense(licenseObj);
}

async function updateLicense () {
  try {
    await updateDepModuleVersions();
  } catch (err) {
    console.log(err);
  }
}
updateLicense();
