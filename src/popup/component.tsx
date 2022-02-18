import React, { FunctionComponent, useEffect, useState } from "react";
import { browser, ContextualIdentities } from "webextension-polyfill-ts";

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
        const [identities, containers] = await Promise.all([
            browser.contextualIdentities.query({}),
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
                    <p
                        className="delete-warning"
                        id="delete-container-tab-warning"
                    >
                        Are you sure you want to clear all Granted containers?
                    </p>
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
            <hr />
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
