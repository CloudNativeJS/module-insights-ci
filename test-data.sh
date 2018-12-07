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

export TOKEN=$(node fetch-token.js);

# This is done by node initialise.js

# curl -X POST --header 'Content-Type: application/json' --header "Authorization: ${TOKEN}" \
# -d '{"arch": "x64"}' "http://${HOST}/api/Architectures"

# curl -X POST --header 'Content-Type: application/json' --header "Authorization: ${TOKEN}" \
# -d '{"distro": "ubuntu-16.04"}' "http://${HOST}/api/Distributions"

# curl -X POST --header 'Content-Type: application/json' --header "Authorization: ${TOKEN}" \
# -d '{"os": "linux"}' "http://${HOST}/api/OperatingSystems"

# curl -X POST --header 'Content-Type: application/json' --header "Authorization: ${TOKEN}" \
# -d '{"os": "linux","arch": "x64","distro": "ubuntu-16.04"}' "http://${HOST}/api/ValidPlatforms"

# curl -X POST --header 'Content-Type: application/json' --header "Authorization: ${TOKEN}" \
# -d '{"node_version": "v6.14.3","lts_version_id": 1}' "http://${HOST}/api/NodeVersions"

# curl -X POST --header 'Content-Type: application/json' --header "Authorization: ${TOKEN}" \
# -d '{"node_version": "v8.11.3","lts_version_id": 2}' "http://${HOST}/api/NodeVersions"

# curl -X POST --header 'Content-Type: application/json' --header "Authorization: ${TOKEN}" \
# -d '{"lts_version": 6}' "http://${HOST}/api/LTSVersions"

# curl -X POST --header 'Content-Type: application/json' --header "Authorization: ${TOKEN}" \
# -d '{"lts_version": 8}' "http://${HOST}/api/LTSVersions"

echo "#-------------------------------     New Node Versions      -------------------------------\n"

curl -X POST --header 'Content-Type: application/json' --header "Authorization: ${TOKEN}" \
-d '{"node_version": "v6.14.4","lts_version_id": 1}' "http://${HOST}/api/NodeVersions"

curl -X POST --header 'Content-Type: application/json' --header "Authorization: ${TOKEN}" \
-d '{"node_version": "v8.12.0","lts_version_id": 2}' "http://${HOST}/api/NodeVersions"

echo "\n\nAdded New Node Versions"

echo "#-------------------------------     @Cloudant/cloudant      -------------------------------\n"

curl -X POST --header 'Content-Type: application/json' -H "Authorization: ${TOKEN}" \
-d '{"name":"@cloudant/cloudant","stability":"LTS Adopted","commercial_support":["IBM"]}' "http://${HOST}/api/Modules"

curl -X POST --header 'Content-Type: application/json' --header "Authorization: ${TOKEN}" \
-d '{"module": "@cloudant/cloudant","module_major_version": "2.x","module_version": "2.4.0","license": "Apache-2.0","deps_ids": "string","deps_licenses": "string","deps_licenses_count": 0,"timestamp": "2018-08-22T12:43:53.871Z"}' "http://${HOST}/api/ModuleVersions"

curl -X POST --header 'Content-Type: application/json' --header "Authorization: ${TOKEN}" \
-d '{"module": "@cloudant/cloudant","module_major_version": "2.x","module_version": "2.3.0","license": "Apache-2.0","deps_ids": "string","deps_licenses": "string","deps_licenses_count": 0,"timestamp": "2018-08-22T12:43:53.871Z"}' "http://${HOST}/api/ModuleVersions"

curl -X POST --header 'Content-Type: application/json' --header  "Authorization: ${TOKEN}" \
-d '{"arch_id": 1,"distro_id": 2,"os_id": 2,"node_version_id": 3,"module": "@cloudant/cloudant","module_version": "2.4.0","code_coverage": 92,"passed": false}' "http://${HOST}/api/ModuleVersionTests"

curl -X POST --header 'Content-Type: application/json' --header  "Authorization: ${TOKEN}" \
-d '{"arch_id": 3,"distro_id": 1,"os_id": 1,"node_version_id": 3,"module": "@cloudant/cloudant","module_version": "2.4.0","code_coverage": 92,"passed": false}' "http://${HOST}/api/ModuleVersionTests"

curl -X POST --header 'Content-Type: application/json' --header  "Authorization: ${TOKEN}" \
-d '{"arch_id": 2,"distro_id": 1,"os_id": 1,"node_version_id": 3,"module": "@cloudant/cloudant","module_version": "2.4.0","code_coverage": 92,"passed": false}' "http://${HOST}/api/ModuleVersionTests"

curl -X POST --header 'Content-Type: application/json' --header  "Authorization: ${TOKEN}" \
-d '{"arch_id": 1,"distro_id": 1,"os_id": 1,"node_version_id": 3,"module": "@cloudant/cloudant","module_version": "2.4.0","code_coverage": 92,"passed": false}' "http://${HOST}/api/ModuleVersionTests"

curl -X POST --header 'Content-Type: application/json' --header  "Authorization: ${TOKEN}" \
-d '{"arch_id": 1,"distro_id": 1,"os_id": 1,"node_version_id": 4,"module": "@cloudant/cloudant","module_version": "2.4.0","code_coverage": 92,"passed": true}' "http://${HOST}/api/ModuleVersionTests"

curl -X POST --header 'Content-Type: application/json' --header  "Authorization: ${TOKEN}" \
-d '{"arch_id": 1,"distro_id": 2,"os_id": 2,"node_version_id": 3,"module": "@cloudant/cloudant","module_version": "2.3.0","code_coverage": 92,"passed": false}' "http://${HOST}/api/ModuleVersionTests"

curl -X POST --header 'Content-Type: application/json' --header "Authorization: ${TOKEN}" \
-d '{"lts_version_id": 1,"module": "@cloudant/cloudant","recommended_version": "2.x"}' "http://${HOST}/api/ModuleRecommendedLTSs"

curl -X POST --header 'Content-Type: application/json' --header "Authorization: ${TOKEN}" \
-d '{"lts_version_id": 2,"module": "@cloudant/cloudant","recommended_version": "2.x"}' "http://${HOST}/api/ModuleRecommendedLTSs"

echo "\n\nAdded @cloudant/cloudant"

echo "#-------------------------------     Appmetrics      -------------------------------\n"

curl -X POST --header 'Content-Type: application/json' -H "Authorization: ${TOKEN}" \
-d '{"name":"appmetrics","stability":"LTS Adopted","commercial_support":["IBM"]}' "http://${HOST}/api/Modules"

curl -X POST --header 'Content-Type: application/json' --header "Authorization: ${TOKEN}" \
-d '{"module": "appmetrics","module_major_version": "4.x","module_version": "4.0.0","license": "Apache-2.0","deps_ids": "string","deps_licenses": "string","deps_licenses_count": 0,"timestamp": "2018-08-22T12:43:53.871Z"}' "http://${HOST}/api/ModuleVersions"

curl -X POST --header 'Content-Type: application/json' --header  "Authorization: ${TOKEN}" \
-d '{"arch_id": 1,"distro_id": 1,"os_id": 1,"node_version_id": 3,"module": "appmetrics","module_version": "4.0.0","code_coverage": 50,"passed": true}' "http://${HOST}/api/ModuleVersionTests"

curl -X POST --header 'Content-Type: application/json' --header  "Authorization: ${TOKEN}" \
-d '{"arch_id": 1,"distro_id": 1,"os_id": 1,"node_version_id": 4,"module": "appmetrics","module_version": "4.0.0","code_coverage": 50,"passed": true}' "http://${HOST}/api/ModuleVersionTests"

curl -X POST --header 'Content-Type: application/json' --header  "Authorization: ${TOKEN}" \
-d '{"arch_id": 2,"distro_id": 1,"os_id": 1,"node_version_id": 3,"module": "appmetrics","module_version": "4.0.0","code_coverage": 50,"passed": true}' "http://${HOST}/api/ModuleVersionTests"

curl -X POST --header 'Content-Type: application/json' --header  "Authorization: ${TOKEN}" \
-d '{"arch_id": 2,"distro_id": 1,"os_id": 1,"node_version_id": 4,"module": "appmetrics","module_version": "4.0.0","code_coverage": 50,"passed": true}' "http://${HOST}/api/ModuleVersionTests"

curl -X POST --header 'Content-Type: application/json' --header "Authorization: ${TOKEN}" \
-d '{"lts_version_id": 1,"module": "appmetrics","recommended_version": "4.x"}' "http://${HOST}/api/ModuleRecommendedLTSs"

curl -X POST --header 'Content-Type: application/json' --header "Authorization: ${TOKEN}" \
-d '{"lts_version_id": 2,"module": "appmetrics","recommended_version": "4.x"}' "http://${HOST}/api/ModuleRecommendedLTSs"

echo "\n\nAdded Appmetrics"

echo "# -------------------------------     Commander      -------------------------------\n"

curl -X POST --header 'Content-Type: application/json' -H "Authorization: ${TOKEN}" \
-d '{"name":"commander","stability":"","commercial_support":"[]"}' "http://${HOST}/api/Modules"

curl -X POST --header 'Content-Type: application/json' --header "Authorization: ${TOKEN}" \
-d '{"module": "commander","module_major_version": "2.x","module_version": "2.16.0","license": "MIT","deps_ids": "string","deps_licenses": "string","deps_licenses_count": 0,"timestamp": "2018-08-22T12:43:53.871Z"}' "http://${HOST}/api/ModuleVersions"

curl -X POST --header 'Content-Type: application/json' --header "Authorization: ${TOKEN}" \
-d '{"module": "commander","module_major_version": "2.x","module_version": "2.17.1","license": "MIT","deps_ids": "string","deps_licenses": "string","deps_licenses_count": 0,"timestamp": "2018-08-22T12:43:53.871Z"}' "http://${HOST}/api/ModuleVersions"

curl -X POST --header 'Content-Type: application/json' --header  "Authorization: ${TOKEN}" \
-d '{"arch_id": 1,"distro_id": 1,"os_id": 1,"node_version_id": 3,"module": "commander","module_version": "2.16.0","code_coverage": 94,"passed": true}' "http://${HOST}/api/ModuleVersionTests"

curl -X POST --header 'Content-Type: application/json' --header  "Authorization: ${TOKEN}" \
-d '{"arch_id": 1,"distro_id": 1,"os_id": 1,"node_version_id": 4,"module": "commander","module_version": "2.16.0","code_coverage": 94,"passed": true}' "http://${HOST}/api/ModuleVersionTests"

curl -X POST --header 'Content-Type: application/json' --header  "Authorization: ${TOKEN}" \
-d '{"arch_id": 3,"distro_id": 1,"os_id": 1,"node_version_id": 3,"module": "commander","module_version": "2.17.1","code_coverage": 87,"passed": true}' "http://${HOST}/api/ModuleVersionTests"

curl -X POST --header 'Content-Type: application/json' --header  "Authorization: ${TOKEN}" \
-d '{"arch_id": 3,"distro_id": 1,"os_id": 1,"node_version_id": 4,"module": "commander","module_version": "2.17.1","code_coverage": 87,"passed": true}' "http://${HOST}/api/ModuleVersionTests"

curl -X POST --header 'Content-Type: application/json' --header "Authorization: ${TOKEN}" \
-d '{"lts_version_id": 1,"module": "commander","recommended_version": "2.x"}' "http://${HOST}/api/ModuleRecommendedLTSs"

curl -X POST --header 'Content-Type: application/json' --header "Authorization: ${TOKEN}" \
-d '{"lts_version_id": 2,"module": "commander","recommended_version": "2.x"}' "http://${HOST}/api/ModuleRecommendedLTSs"

echo "\n\nAdded Commander"

echo "#-------------------------------     Bluebird      -------------------------------\n"

curl -X POST --header 'Content-Type: application/json' -H "Authorization: ${TOKEN}" \
-d '{"name":"bluebird","stability":"","commercial_support":"[]"}' "http://${HOST}/api/Modules"

curl -X POST --header 'Content-Type: application/json' --header "Authorization: ${TOKEN}" \
-d '{"module": "bluebird","module_major_version": "3.x","module_version": "3.5.1","license": "MIT","deps_ids": "string","deps_licenses": "string","deps_licenses_count": 0,"timestamp": "2018-08-22T12:43:53.871Z"}' "http://${HOST}/api/ModuleVersions"

curl -X POST --header 'Content-Type: application/json' --header  "Authorization: ${TOKEN}" \
-d '{"arch_id": 1,"distro_id": 1,"os_id": 1,"node_version_id": 3,"module": "bluebird","module_version": "3.5.1","code_coverage": 25,"passed": false}' "http://${HOST}/api/ModuleVersionTests"

curl -X POST --header 'Content-Type: application/json' --header  "Authorization: ${TOKEN}" \
-d '{"arch_id": 1,"distro_id": 1,"os_id": 1,"node_version_id": 4,"module": "bluebird","module_version": "3.5.1","code_coverage": 25,"passed": false}' "http://${HOST}/api/ModuleVersionTests"

curl -X POST --header 'Content-Type: application/json' --header "Authorization: ${TOKEN}" \
-d '{"lts_version_id": 1,"module": "bluebird","recommended_version": "3.x"}' "http://${HOST}/api/ModuleRecommendedLTSs"

curl -X POST --header 'Content-Type: application/json' --header "Authorization: ${TOKEN}" \
-d '{"lts_version_id": 2,"module": "bluebird","recommended_version": "3.x"}' "http://${HOST}/api/ModuleRecommendedLTSs"

echo "\n\nAdded Bluebird"

echo "#-------------------------------     Async      -------------------------------\n"

curl -X POST --header 'Content-Type: application/json' -H "Authorization: ${TOKEN}" \
-d '{"name":"async","stability":"","commercial_support":"[]"}' "http://${HOST}/api/Modules"

curl -X POST --header 'Content-Type: application/json' --header "Authorization: ${TOKEN}" \
-d '{"module": "async","module_major_version": "2.x","module_version": "2.6.1","license": "MIT","deps_ids": "string","deps_licenses": "string","deps_licenses_count": 0,"timestamp": "2018-08-22T12:43:53.871Z"}' "http://${HOST}/api/ModuleVersions"

curl -X POST --header 'Content-Type: application/json' --header  "Authorization: ${TOKEN}" \
-d '{"arch_id": 1,"distro_id": 1,"os_id": 1,"node_version_id": 3,"module": "async","module_version": "2.6.1","code_coverage": 98,"passed": true}' "http://${HOST}/api/ModuleVersionTests"

curl -X POST --header 'Content-Type: application/json' --header  "Authorization: ${TOKEN}" \
-d '{"arch_id": 1,"distro_id": 1,"os_id": 1,"node_version_id": 4,"module": "async","module_version": "2.6.1","code_coverage": 98,"passed": true}' "http://${HOST}/api/ModuleVersionTests"

curl -X POST --header 'Content-Type: application/json' --header "Authorization: ${TOKEN}" \
-d '{"lts_version_id": 1,"module": "async","recommended_version": "2.x"}' "http://${HOST}/api/ModuleRecommendedLTSs"

curl -X POST --header 'Content-Type: application/json' --header "Authorization: ${TOKEN}" \
-d '{"lts_version_id": 2,"module": "async","recommended_version": "2.x"}' "http://${HOST}/api/ModuleRecommendedLTSs"

echo "\n\nAdded Async"
