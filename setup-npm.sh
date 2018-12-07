#!/bin/bash -ex

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

# Redirects npm directories into the WORKSPACE and sets up artifactory.
# Script should be sourced.
rm -rf "$WORKSPACE"/npm

export npm_config_userconfig="$WORKSPACE"/npm/npmrc
mkdir -p "$WORKSPACE"/npm/npm-{cache,devdir,tmp}

cat <<!!EOF >$WORKSPACE/npm/npmrc
tmpdir=$WORKSPACE/npm/npm-tmp
cache=$WORKSPACE/npm/npm-cache
devdir=$WORKSPACE/npm/npm-devdir
@wicked:registry=https://na.artifactory.swg-devops.com/artifactory/api/npm/wicked-npm-local/
//na.artifactory.swg-devops.com/artifactory/api/npm/wicked-npm-local/:_password="\${NPM_TOKEN}"
//na.artifactory.swg-devops.com/artifactory/api/npm/wicked-npm-local/:username=jsbuild@ca.ibm.com
//na.artifactory.swg-devops.com/artifactory/api/npm/wicked-npm-local/:email=jsbuild@ca.ibm.com
//na.artifactory.swg-devops.com/artifactory/api/npm/wicked-npm-local/:always-auth=true
!!EOF
