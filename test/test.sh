#!/bin/bash

############################################################################
#
# (C) Copyright IBM Corp. 2018
#
#  This program and the accompanying materials are made available
#  under the terms of the Apache License v2.0 which accompanies
#  this distribution.
#
#      The Apache License v2.0 is available at
#      http://www.opensource.org/licenses/apache2.0.php
#
# Contributors:
#   Multiple authors (IBM Corp.) - initial implementation and documentation
############################################################################

export HOST=module-curation-staging.eu-gb.mybluemix.net
export API_USERNAME=admin
export WORKSPACE=$PWD
export NVS_HOME=$HOME/.nvs

if [ -z $PASSWORD ]; then
  echo PASSWORD is not defined so skipping the test suite
  exit 0
else
  . ./setup-nvs.sh
  nvs add 6
  nvs add 8

  #####################################
  echo "\n##### Testing fetch-token.js #####"
  nvs use 8
  npm install >/dev/null
  export TOKEN=$(node fetch-token.js)

  if [ "$TOKEN" == null ] || [ "$TOKEN" == "Incorrect Credentials" ]; then
    echo "✘ fetch-token.js failed with non-zero exit code"
    FAILED="true"
  else
    echo "✓ Test Passed!"
  fi
  #####################################
  echo "\n##### Testing missing-test.sh #####"
  . ./missing-test.sh
  if [ $? != 0 ]; then
    echo "✘ missing-test.sh failed with non-zero exit code"
    FAILED="true"
  else
    echo "✓ Test Passed!"
  fi
  unset node6
  unset node8
  #####################################
  echo "\n##### Testing citgm-check.sh #####"

  export OS=linux
  export ARCH=x64
  export DISTRO=ubuntu-16.04
  export MODULE=async
  export MODULE_VERSION=2.6.1
  export NODE_VERSION=v8.12.0

  . ./citgm-check.sh
  if [ $? != 0 ]; then
    echo "✘ citgm-check.sh failed with non-zero exit code"
    FAILED="true"
  else
    echo "✓ Test Passed!"
  fi
  unset OS ARCH DISTRO MODULE MODULE_VERSION NODE_VERSION
  #####################################
  echo "\n##### Testing clean-data.sh #####"

  . ./clean-data.sh
  if [ $? != 0 ]; then
    echo "✘ clean-data.sh failed with non-zero exit code"
    FAILED="true"
  else
    echo "✓ Test Passed!"
  fi
  #####################################
  echo "\n##### Testing failed-test.sh #####"

  . ./failed-test.sh
  if [ $? != 0 ]; then
    echo "✘ failed-test.sh failed with non-zero exit code"
    FAILED="true"
  else
    echo "✓ Test Passed!"
  fi
  #####################################
  echo "\n##### Testing missing-license.sh #####"

  . ./missing-license.sh
  if [ $? != 0 ]; then
    echo "✘ missing-license.sh failed with non-zero exit code"
    FAILED="true"
  else
    echo "✓ Test Passed!"
  fi
  #####################################
  echo "\n##### Testing license-check.sh #####"

  export MODULE=@cloudnative/health
  export MODULE_VERSION=1.0.0
  export NODE_VERSION=v6.14.3

  . ./license-check.sh
  if [ $? != 0 ]; then
    echo "✘ license-check.sh failed with non-zero exit code"
    FAILED="true"
  else
    echo "✓ Test Passed!"
  fi
  unset MODULE MODULE_VERSION NODE_VERSION
  #####################################
  echo "\n##### Testing update-recommended-versions.sh #####"

  . ./update-recommended-versions.sh
  if [ $? != 0 ]; then
    echo "✘ update-recommended-versions.sh failed with non-zero exit code"
    FAILED="true"
  else
    echo "✓ Test Passed!"
  fi

  if [ $FAILED == "true" ]; then
    echo "\nTests failed"
    exit 1
  else
    echo "\n✓ All tests passed"
  fi
fi
