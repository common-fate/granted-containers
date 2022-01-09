#!/bin/bash

function keychain-environment-variable () {
    security find-generic-password -w -a ${USER} -s "${1}"
}

WEB_EXT_API_KEY=$(keychain-environment-variable commonfate.granted.firefox_extensions.api_key)
WEB_EXT_API_SECRET=$(keychain-environment-variable commonfate.granted.firefox_extensions.api_secret)

yarn web-ext sign --api-key=$WEB_EXT_API_KEY --api-secret=$WEB_EXT_API_SECRET --channel=unlisted --source-dir ./dist/