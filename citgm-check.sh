#! /bin/bash -e

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

. ./setup-nvs.sh

#Cleanup npm log files
rm -rf /tmp/npm-*
### Use CitGM to run custom-citgm-test.js on a module. ###

echo -e "\n\nParameters:\n
WORKSPACE: $WORKSPACE\n
NODE_VERSION: $NODE_VERSION\n
OS: $OS\n
ARCH: $ARCH\n
MODULE: $MODULE\n
MODULE_VERSION: $MODULE_VERSION\n\n"

[ -z "$NODE_VERSION" ]     && echo "NODE_VERSION is undefined, bailing..."     && exit 1
[ -z "$MODULE_VERSION" ]   && echo "MODULE_VERSION is undefined, bailing..."   && exit 1
[ -z "$OS" ]               && echo "OS is undefined, bailing..."               && exit 1
[ -z "$ARCH" ]             && echo "ARCH is undefined, bailing..."             && exit 1
[ -z "$MODULE" ]           && echo "MODULE is undefined, bailing..."           && exit 1
[ -z "$CITGM_LOGLEVEL" ]   && CITGM_LOGLEVEL=info

nvs add $NODE_VERSION >/dev/null
nvs use $NODE_VERSION >/dev/null

npm install -g citgm nyc

set +e
citgm --verbose "$CITGM_LOGLEVEL" \
      --tap "$WORKSPACE/$MODULE.tap" \
      --customTest "$WORKSPACE/custom-citgm-test.js" \
      --lookup "$WORKSPACE/lookup.json" "$MODULE@$MODULE_VERSION"
EXIT_STATUS="$?"

if [ "$EXIT_STATUS" != "0" ]; then
  citgm --verbose "$CITGM_LOGLEVEL" \
        --tap "$WORKSPACE/$MODULE.tap" \
        --lookup "$WORKSPACE/lookup.json" "$MODULE@$MODULE_VERSION"
  EXIT_STATUS="$?"
fi
set -e

export EXIT_STATUS

nvs add 8 >/dev/null
nvs use 8 >/dev/null
npm install >/dev/null

export TOKEN=$(node fetch-token.js)

node "$WORKSPACE/update-test.js"
if [ $EXIT_STATUS -eq 1 ]; then
  node storing-logs.js
fi
node logout.js
#Cleanup npm log files
rm -rf /tmp/npm-*
