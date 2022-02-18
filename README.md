# granted-containers

A Firefox extension to open cloud profiles in separate containers.

## How does it work?

Granted uses [Multi-Account Containers](https://support.mozilla.org/en-US/kb/containers), a privacy feature built in to Firefox which allows groups of browser tabs to be isolated from one another. Granted exposes a custom protocol handler `ext+granted-containers` which allows the extension to be triggered from the [Granted CLI](https://github.com/common-fate/granted).

## Security

This extension operates with the minimum possible permissions and does not have the ability to read information from any web pages. By design, the extension does not have permission to read any information from the DOM when you are accessing cloud provider consoles. The extension uses a [Background Script](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Anatomy_of_a_WebExtension#background_scripts) which can't directly access web page content.

The permissions that this extension requires are:

| Permission           | Reason                                                                                                                                                                                          |
| -------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| contextualIdentities | used to manage tab containers via the [contextualIdentity API](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/contextualIdentities)                                 |
| cookies              | required to access [container tab stores](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Work_with_the_Cookies_API#cookie_stores) in order to list available identities |
| tabs                 | required to open a new tab in a container                                                                                                                                                       |
| storage              | required to store information on the list of available containers                                                                                                                               |

## Building

Requirements:

-   [NodeJS LTS v16](https://nodejs.org/)
-   [Yarn 1.22](https://classic.yarnpkg.com/lang/en/docs/install/)

1. Clone this repository: https://github.com/common-fate/granted-containers

2. Install dependencies

    ```
    yarn install --frozen-lockfile
    ```

3. Build the extension

    ```
    yarn build
    ```

The extension is transpiled into the `dist` folder, and additionally zipped up and placed in the `web-ext-artifacts` folder.

## Releasing for internal testing

We have a couple of Bash scripts set up to make internal distribution and testing of the extension simple. These scripts are written for MacOS.

1. Setup signing credentials for internal testing (this will load Firefox API credentials into the MacOS keychain)

    ```
    ./set_signing_credentials.sh
    ```

2. Build the extension

    ```
    yarn build
    ```

3. Sign the extension

    ```
    ./sign.sh
    ```
