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

const IBMCloudObjectStore = require("ibm-cos-sdk");
const fs = require('fs');

const BUCKET = "module-insights-logs";
const API_KEY = process.env.API_KEY;
const INSTANCE_ID = process.env.INSTANCE_ID;
const MODULE = process.env.MODULE;
const MODULE_VERSION = process.env.MODULE_VERSION;
const OS = process.env.OS;
const ARCH = process.env.ARCH;
const NODE_VERSION = process.env.NODE_VERSION;
const WORKSPACE = process.env.WORKSPACE;
const LOG_FILE = `${WORKSPACE}/${MODULE}.tap`;
const FILE_NAME= `${MODULE}@${MODULE_VERSION}-${OS}-${ARCH}-${NODE_VERSION}.txt`;

const config = {
  endpoint: "s3-api.us-geo.objectstorage.softlayer.net",
  apiKeyId: API_KEY,
  ibmAuthEndpoint: "https://iam.bluemix.net/identity/token",
  serviceInstanceId: INSTANCE_ID
};

const objectStoreClient = new IBMCloudObjectStore.S3(config);

function createLogFile(BUCKET, FILE_NAME, LOG_FILE) {
  console.log(`\nCreating new item: ${FILE_NAME}`);
  const body = fs.readFileSync(LOG_FILE, 'utf8')
  return objectStoreClient.putObject({
    Bucket: BUCKET,
    Key: FILE_NAME,
    Body: body,
    ACL: "public-read"
  }).promise()
    .then(() => {
      return console.log(`Item: ${FILE_NAME} created!`);
    })
    .catch((e) => {
      return console.log(`ERROR: ${e.code} - ${e.message}\n`);
    });
}

async function creating(){
  await createLogFile(BUCKET, FILE_NAME, LOG_FILE);
  console.log("Finshed Adding Logs");
  process.exit(0);
}
creating();
