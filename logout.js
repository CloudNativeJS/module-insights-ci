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

if (TOKEN === null || TOKEN === "Incorrect Credentials") {
  console.log("TOKEN is not defined");
  process.exit(1);
}

request.post({
  uri: `http://${HOST}/api/Users/logout`,
  followAllRedirects: true,
  headers: {
    "Authorization": TOKEN
  }
}, (err, res) => {
  if (err || res.statusCode !== 204) {
    process.exit(1);
  }
});
