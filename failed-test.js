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

function getModuleVersionTests(){
  return request.get({
    uri: `http://${HOST}/api/ModuleVersionTests`,
    followAllRedirects: true,
    headers: {
      "filter": JSON.stringify({
        "include": [
          {"ModuleVersion":"Module"},
          "Architecture",
          "Distribution",
          "OperatingSystem",
          "NodeVersion"
        ],
        "where": {
          "passed": "false"
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

async function findFailedTests () {
  let mvts = await getModuleVersionTests();
  let params = [];
  for (let mvt of mvts) {
    if (mvt.ModuleVersion && mvt.ModuleVersion.Module) {
      params.push([
        mvt.ModuleVersion.Module.name,
        mvt.ModuleVersion.module_version,
        mvt.NodeVersion.node_version,
        mvt.OperatingSystem.os,
        mvt.Architecture.arch,
        mvt.Distribution.distro
      ]);
    }
  }
  console.log(params.join("%"));
}

findFailedTests();
