#!/bin/bash

function set-keychain-environment-variable () {
    [ -n "$1" ] || print "Missing environment variable name"
    
    # Note: if using bash, use `-p` to indicate a prompt string, rather than the leading `?`
    read -p "Enter Value for ${1}: " secret
    
    ( [ -n "$1" ] && [ -n "$secret" ] ) || return 1
    security add-generic-password -U -a ${USER} -D "environment variable" -s "${1}" -w "${secret}"
}

set-keychain-environment-variable commonfate.granted.firefox_extensions.api_key
set-keychain-environment-variable commonfate.granted.firefox_extensions.api_secret