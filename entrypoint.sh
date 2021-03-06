#!/bin/sh

JSON_STRING='window.configs = { \
  "VUE_APP_CCR_BACKEND_URL":"'"${VUE_APP_CCR_BACKEND_URL}"'", \
  "VUE_APP_AUTH_SERVER_URL":"'"${VUE_APP_AUTH_SERVER_URL}"'", \
  "VUE_APP_AUTH_REALM":"'"${VUE_APP_AUTH_REALM}"'", \
  "VUE_APP_AUTH_CLIENT_ID" :"'"${VUE_APP_AUTH_CLIENT_ID}"'", \
  "VUE_APP_AUTH_CLIENT_ROLES":"'"${VUE_APP_AUTH_CLIENT_ROLES}"'", \
}'
sed -i "s@// CONFIGURATIONS_PLACEHOLDER@${JSON_STRING}@" /usr/share/nginx/html/index.html

exec "$@"