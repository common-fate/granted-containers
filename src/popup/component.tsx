import React, { FunctionComponent, useEffect, useState } from "react";
import { browser, ContextualIdentities } from "webextension-polyfill-ts";
// import "./styles.scss";

export const Popup: FunctionComponent = () => {
    const [identities, setIdentities] = useState<
        ContextualIdentities.ContextualIdentity[]
    >([]);
    const [isRemoving, setIsRemoving] = useState(false);

    React.useEffect(() => {
        browser.runtime.sendMessage({ popupMounted: true });
    }, []);

    useEffect(() => {
        refreshIdentities();
    }, []);

    const refreshIdentities = async () => {
        const [
            identities,
            containers,
            // state,
            // containerOrderStorage,
        ] = await Promise.all([
            browser.contextualIdentities.query({}),
            // browser.runtime.sendMessage({
            //     method: "queryIdentitiesState",
            //     message: {
            //         windowId: browser.windows.WINDOW_ID_CURRENT,
            //     },
            // }),
            browser.storage.local.get("containers"),
        ]);
        const containerIds: string[] =
            "containers" in containers ? containers.containers : [];

        setIdentities(
            identities.filter((i) => containerIds.includes(i.cookieStoreId)),
        );
    };

    const clearContainers = async () => {
        await Promise.all(
            identities.map((identity) =>
                browser.contextualIdentities.remove(identity.cookieStoreId),
            ),
        );
        await refreshIdentities();
        setIsRemoving(false);
    };

    if (isRemoving) {
        return (
            <div
                className="panel delete-container-panel"
                id="delete-container-panel"
            >
                <h3
                    className="title"
                    id="container-delete-title"
                    data-i18n-message-id="default"
                >
                    Clear Containers
                </h3>

                <button
                    className="btn-return arrow-left controller"
                    id="close-container-delete-panel"
                    onClick={() => setIsRemoving(false)}
                ></button>
                <hr />
                <div className="panel-content delete-container-confirm">
                    {/* <h4
                        className="delete-container-confirm-title"
                        data-i18n-message-id="removeThisContainer"
                    ></h4> */}
                    <p
                        className="delete-warning"
                        id="delete-container-tab-warning"
                    >
                        Are you sure you want to clear all Granted containers?
                    </p>
                    {/* <p
                        className="delete-warning"
                        data-i18n-message-id="removeThisContainerConfirmation"
                    ></p> */}
                </div>
                <div className="panel-footer">
                    <a
                        href="#"
                        className="button expanded secondary footer-button cancel-button"
                        data-i18n-message-id="cancel"
                        id="delete-container-cancel-link"
                        onClick={() => setIsRemoving(false)}
                    >
                        Back
                    </a>
                    <a
                        href="#"
                        className="button expanded primary footer-button"
                        data-i18n-message-id="ok"
                        id="delete-container-ok-link"
                        onClick={clearContainers}
                    >
                        Confirm
                    </a>
                </div>
            </div>
        );
    }

    return (
        <div className="panel menu-panel container-panel" id="container-panel">
            <h3 className="title">Granted Containers</h3>
            {/* <a href="#" className="info-icon" id="info-icon" tabIndex={10}>
                <img
                    data-i18n-attribute-message-id="info"
                    data-i18n-attribute="alt"
                    alt=""
                    src="/img/info.svg"
                />
            </a> */}
            <hr />
            {/* <table className="menu">
                <tr
                    className="menu-item hover-highlight keyboard-nav"
                    id="open-new-tab-in"
                    tabIndex={0}
                >
                    <td>
                        <img
                            className="menu-icon"
                            alt=""
                            src="/img/tab-new-16.svg"
                        />
                        <span
                            className="menu-text"
                            data-i18n-message-id="openInNewTabTitle"
                        ></span>
                        <span className="menu-arrow">
                            <img alt="" src="/img/arrow-icon-right.svg" />
                        </span>
                    </td>
                </tr>
                <tr
                    className="menu-item hover-highlight keyboard-nav"
                    id="reopen-site-in"
                    tabIndex={0}
                >
                    <td>
                        <img
                            className="menu-icon"
                            alt=""
                            src="/img/refresh-16.svg"
                        />
                        <span
                            data-i18n-message-id="reopenThisSiteIn"
                            className="menu-text"
                        ></span>
                        <span className="menu-arrow">
                            <img alt="" src="/img/arrow-icon-right.svg" />
                        </span>
                    </td>
                </tr>
                <tr
                    className="menu-item hover-highlight keyboard-nav"
                    id="sort-containers-link"
                    tabIndex={0}
                >
                    <td>
                        <img
                            className="menu-icon"
                            alt=""
                            src="/img/sort-16_1.svg"
                        />
                        <span
                            className="menu-text"
                            data-i18n-message-id="sortTabsByContainer"
                        ></span>
                        <span className="menu-arrow"> </span>
                    </td>
                </tr>
                <tr
                    className="menu-item hover-highlight keyboard-nav"
                    id="always-open-in"
                    tabIndex={0}
                >
                    <td>
                        <img
                            className="menu-icon"
                            alt=""
                            src="/img/container-openin-16.svg"
                        />
                        <span
                            className="menu-text"
                            data-i18n-message-id="alwaysOpenThisSiteIn"
                        ></span>
                        <span className="menu-arrow">
                            <img alt="" src="/img/arrow-icon-right.svg" />
                        </span>
                    </td>
                </tr>
            </table>
            <hr />
            <div className="sub-header-wrapper flx-row flx-space-between">
                <div
                    className="sub-header"
                    data-i18n-message-id="containers"
                ></div>
                <h4 className="moz-vpn-logotype vpn-status-container-list display-none">
                    Mozilla VPN
                    <span className="moz-vpn-connection-status-indicator container-list-status-icon">
                        <span className="tooltip"></span>
                    </span>
                </h4>
            </div> */}
            <div className="scrollable identities-list">
                <table className="menu" id="identities-list">
                    {identities.map((identity) => (
                        <tr className="menu-item hover-highlight">
                            <td>
                                <div className="menu-icon hover-highlight">
                                    <div
                                        className="usercontext-icon"
                                        data-identity-icon={identity.icon}
                                        data-identity-color={identity.color}
                                    ></div>
                                </div>
                                <span className="menu-text">
                                    {identity.name}
                                </span>
                                {/* <img
                                    alt=""
                                    className="flag-img manage-containers-list-flag"
                                    src="/img/flags/.png"
                                />
                                <span className="move-button">
                                    <img
                                        className="pop-button-image"
                                        src="/img/container-move.svg"
                                    />
                                </span> */}
                            </td>
                        </tr>
                    ))}
                </table>
            </div>
            <div className="v-padding-hack-footer" />
            <div
                className="bottom-btn keyboard-nav controller"
                id="manage-containers-link"
                tabIndex={0}
                data-i18n-message-id="manageContainers"
                onClick={() => setIsRemoving(true)}
            >
                Clear Containers
            </div>
        </div>
    );
};
