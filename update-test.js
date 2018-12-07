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

const [OS, ARCH, DISTRO] = [process.env.OS, process.env.ARCH,
  process.env.DISTRO];
const [moduleName, moduleVersion] = [process.env.MODULE,
  process.env.MODULE_VERSION];
const nodeVersion = process.env.NODE_VERSION;
const HOST = process.env.HOST;
const TOKEN = process.env.TOKEN;
const passResult = (parseInt(process.env.EXIT_STATUS) === 0);

if (TOKEN === null || TOKEN === "Incorrect Credentials") {
  console.error("TOKEN is not defined");
  process.exit(1);
}

console.log(`\nUpdating HOST: ${HOST}` +
  `\nModule: ${moduleName},` +
  `Module Verison: ${moduleVersion},` +
  `Node Version: ${nodeVersion}` +
  `\nPass: ${passResult}`
);

/*
Catch an error if coverage-summary.json
doesn't exist and set codeCoverage to 0
*/
let codeCoverage;
try {
  const coverageSummary = require(`${process.env.WORKSPACE}/` +
    `${moduleName}/coverage-summary.json`);
  codeCoverage = parseInt(
    coverageSummary.total.lines.pct.toString().split(".")[0]
  );
  console.log("Coverage summary:", coverageSummary);
} catch (e) {
  codeCoverage = 0;
}

function getModuleVersionTestID() {
  return request.get({
    url: `http://${HOST}/api/ModuleVersionTests`,
    followAllRedirects: true,
    headers: {
      filter: JSON.stringify({
        "where": {
          "module": moduleName,
          "module_version": moduleVersion,
          "node_version": nodeVersion,
          "os": OS,
          "arch": ARCH,
          "distro": DISTRO
        }
      })
    },
    json: true
  }, (err, res, body) => {
    if (err || res.statusCode !== 200) {
      console.error(body.error);
      process.exit(1);
    } else {
      return body;
    }
  });
}

async function patchModuleVersionTest () {
  const id = await getModuleVersionTestID();
  let data = {
    "module": moduleName,
    "module_version": moduleVersion,
    "node_version": nodeVersion,
    "os": OS,
    "arch": ARCH,
    "distro": DISTRO,
    "passed": passResult,
    "code_coverage": codeCoverage || 0
  };
  if (id[0] && id[0].id) {
    data.id = id[0].id;
  }
  return request.patch({
    url: `http://${HOST}/api/ModuleVersionTests`,
    followAllRedirects: true,
    headers: {
      "Authorization": TOKEN
    },
    body: data,
    json: true // Automatically stringifies the body to JSON
  }, (err, res, body) => {
    if (err || res.statusCode !== 200) {
      console.error(body.error);
      process.exit(1);
    } else {
      console.log("Adding Module Version Test :", body);
      return body;
    }
  });
}

async function updateTest() {
  await patchModuleVersionTest();
}
updateTest();
