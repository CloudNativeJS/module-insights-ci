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

const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");
const packageName = require(path.join(process.cwd(),
  "/package.json")).name.replace(/\//, "%2F");

const dir = path.join(process.env.WORKSPACE, packageName);
const checker = require(path.join(process.env.WORKSPACE,
  "deps", "node_modules", "license-checker"));

spawnSync("npm", ["prune", "--production"]);

// Generate License Report
checker.init({start: process.cwd()}, function (err, json) {
  if (err) {
    throw err;
  }
  try {
    fs.mkdirSync(dir);
  } catch (err) {
    if (err.code !== "EEXIST") {
      throw err;
    }
  }
  fs.writeFileSync(path.join(dir, "license.json"),
    JSON.stringify(json, null, 2));
});
