import { browser } from "webextension-polyfill-ts";

const defaultIcon = "fingerprint";
const availableContainerColors = [
    "blue",
    "turquoise",
    "green",
    "yellow",
    "orange",
    "red",
    "pink",
    "purple",
];

function randomColor() {
    return availableContainerColors[
        (Math.random() * availableContainerColors.length) | 0
    ];
}

async function lookupContainer(name: string) {
    const containers = await browser.contextualIdentities.query({
        name: name,
    });

    if (containers.length >= 1) {
        return containers[0];
    }

    return null;
}

export interface Container {
    name: string;
    url: string;
    color?: string;
    icon?: string;
}

function hashCode(str: string) {
    var hash = 0,
        i,
        chr,
        len;
    if (str.length == 0) return hash;
    for (i = 0, len = str.length; i < len; i++) {
        chr = str.charCodeAt(i);
        hash = (hash << 5) - hash + chr;
        hash |= 0; // Convert to 32bit integer
    }
    return hash;
}

export const colorFromContainerName = (name: string): string => {
    const hash = Math.abs(hashCode(name));
    const index = hash % (availableContainerColors.length - 1);
    return availableContainerColors[index];
};

export async function prepareContainer({ name, color, icon }: Container) {
    const container = await lookupContainer(name);
    if (!container) {
        const created = await browser.contextualIdentities.create({
            name: name,
            color: color || colorFromContainerName(name),
            icon: icon || defaultIcon,
        });
        await saveContainerId(created.cookieStoreId);
        return created;
    } else {
        // update the existing container if the color or icon have changed
        browser.contextualIdentities.update(container.cookieStoreId, {
            color: color || container.color,
            icon: icon || container.icon,
        });
    }

    return container;
}

const saveContainerId = async (id: string) => {
    const obj = await browser.storage.local.get("containers");
    const exists = "containers" in obj;
    if (exists) {
        await browser.storage.local.set({
            containers: [...obj.containers, id],
        });
    } else {
        await browser.storage.local.set({ containers: [id] });
    }
};
