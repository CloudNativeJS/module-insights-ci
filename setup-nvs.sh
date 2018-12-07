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

if [ -z $NVS_HOME ]; then
  export NVS_HOME="$HOME/.nvs"
fi

[ -s "$NVS_HOME/nvs.sh" ] && . "$NVS_HOME/nvs.sh"
export NVS_HOME=$HOME/.nvs

if ! [ $(command -v nvs) ]; then
  echo Please install nvs
  exit 1
fi
