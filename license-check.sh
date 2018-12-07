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

### Use CitGM to run custom-license-test.js on a module. ###

echo -e "\n\nParameters:\n
WORKSPACE: $WORKSPACE\n
NODE_VERSION: $NODE_VERSION\n
MODULE: $MODULE\n
MODULE_VERSION: $MODULE_VERSION\n\n"

[ -z "$NODE_VERSION" ]   && echo "NODE_VERSION is undefined, bailing..."   && exit 1
[ -z "$MODULE_VERSION" ] && echo "MODULE_VERSION is undefined, bailing..." && exit 1
[ -z "$MODULE" ]         && echo "MODULE is undefined, bailing..."         && exit 1
[ -z "$CITGM_LOGLEVEL" ] && CITGM_LOGLEVEL=info

nvs add $NODE_VERSION >/dev/null
nvs use $NODE_VERSION >/dev/null

npm install -g citgm >/dev/null

mkdir -p "$WORKSPACE/deps/node_modules"
(cd "$WORKSPACE/deps"; npm install "$WORKSPACE/deps" license-checker)

citgm --verbose "$CITGM_LOGLEVEL" --customTest "$WORKSPACE/custom-license-test.js" --lookup "$WORKSPACE/lookup.json" "$MODULE@$MODULE_VERSION"
EXIT_STATUS="$?"

if [ "$EXIT_STATUS" = "0" ]; then
  nvs add 8 >/dev/null
  nvs use 8 >/dev/null
  npm install >/dev/null
  export TOKEN=$(node fetch-token.js)
  node update-license.js
else
  echo -e "\n\nEXIT_STATUS: $EXIT_STATUS.\nCITGM exited with a non-zero exit code.\n\n"
  exit 1
fi
