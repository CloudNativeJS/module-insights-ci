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

const { spawnSync } = require("child_process");
const packageName = require(process.cwd() + "/package.json").name;

const nyc = (process.env.OS === "win") ? "nyc.cmd" : "nyc";

const result = spawnSync(nyc, ["--reporter=json-summary",
  `--report-dir=${process.env.WORKSPACE}/${packageName}`, "npm", "test"
]);

process.exit(result.status);
