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
const USERNAME = process.env.API_USERNAME;
const PASSWORD = process.env.PASSWORD;

const DAY = 60 * 60 * 24; // Seconds * Minutes * Hours
async function userLogin() {
  async function login() {
    return request.post({
      url: `http://${HOST}/api/Users/Login`,
      followAllRedirects: true,
      body: {
        "username": USERNAME,
        "password": PASSWORD,
        "ttl": DAY
      },
      json: true // Automatically stringifies the body to JSON
    }, (err, res, body) => {
      if (err || res.statusCode !== 200) {
        console.log("Incorrect Credentials");
        process.exit(1);
      } else {
        return body;
      }
    });

  }

  const TOKEN = await login();
  console.log(TOKEN.id);
}

userLogin();
