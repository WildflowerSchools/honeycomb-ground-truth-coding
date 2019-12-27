#!/bin/sh

echo "Replacing ENV placeholders with ENV vars..."
for file in "/usr/share/nginx/html/*.js"
do
  echo "Updating $file"
  list="$(cat /proc/self/environ | awk -F= '{print $1}')"
  echo "$list" | while read -r line; do
    export REPLACE="ENV_VAR_$line"
    export VALUE=$(eval "echo \"\$$line\"")
    # for debugging use (DO NOT ENABLE IN PRODUCTION):
    # echo "replacing ${REPLACE} with ${VALUE} in $file"
    sed -i "s~${REPLACE}~${VALUE}~g" $file
    unset REPLACE
    unset VALUE
  done
done
echo "ENV var update complete"

echo "Starting server..."
# Start server
exec nginx -g "daemon off;"
