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

function getModuleVersions () {
  const filter = {
    "where": {
      "deps_licenses_count": null
    },
    "include": ["Module"]
  };
  return request.get({
    url: `http://${HOST}/api/ModuleVersions`,
    followAllRedirects: true,
    headers: {
      filter: JSON.stringify(filter)
    },
    json: true // Automatically stringifies the body to JSON
  }, (err, res, body) => {
    if (err || res.statusCode !== 200) {
      console.error(body.error);
      process.exit(1);
    } else {
      return body;
    }
  });
}

async function missingLicenseCheck () {
  const params = [];
  const moduleVersions = await getModuleVersions();
  moduleVersions.forEach(moduleVersion => {
    params.push(`${moduleVersion.Module.name},${moduleVersion.module_version}`);
  });
  console.log(params.join("%"));
}
missingLicenseCheck();
