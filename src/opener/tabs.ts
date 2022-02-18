import { browser, ContextualIdentities } from "webextension-polyfill-ts";

export async function newTab(
    container: ContextualIdentities.ContextualIdentity,
    params: { url: any },
) {
    try {
        let browserInfo = await browser.runtime.getBrowserInfo();
        let currentTab = await browser.tabs.getCurrent();

        let createTabParams = {
            cookieStoreId: container.cookieStoreId,
            url: params.url,
            index: currentTab.index + 1,
        };

        await browser.tabs.create(createTabParams);
        currentTab.id && (await browser.tabs.remove(currentTab.id));
    } catch (e) {
        throw new Error(`creating new tab: ${e}`);
    }
}

export async function closeCurrentTab() {
    let currentTab = await browser.tabs.getCurrent();
    currentTab.id && (await browser.tabs.remove(currentTab.id));
}

export async function getActiveTab() {
    return (
        await browser.tabs.query({
            active: true,
            windowId: browser.windows.WINDOW_ID_CURRENT,
        })
    )[0];
}
