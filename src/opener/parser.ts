import { Container } from "./containers";
import {
    sanitizeURLSearchParams,
    required,
    url,
    integer,
    boolean,
    atLeastOneRequired,
    oneOfOrEmpty,
} from "./validator";

const customProtocolPrefix = "ext+granted-containers:";

const allowedContainerColors = [
    "blue",
    "turquoise",
    "green",
    "yellow",
    "orange",
    "red",
    "pink",
    "purple",
];

const allowedContainerIcons = [
    "fingerprint",
    "briefcase",
    "dollar",
    "cart",
    "circle",
    "gift",
    "vacation",
    "food",
    "fruit",
    "pet",
    "tree",
    "chill",
];

export interface OpenerParamsSchema {
    signature: string[];
    id: string[];
    name: string[];
    color: ((p: any, name: any) => any)[];
    icon: ((p: any, name: any) => any)[];
    url: ((p: any, name: any) => any)[];
    index: ((p: any, name: any) => any)[];
    pinned: ((p: any, name: any) => any)[];
    openInReaderMode: ((p: any, name: any) => any)[];
    __validators: ((params: any) => any)[];
}

const openerParamsSchema = {
    // signature
    signature: [],

    // container params
    id: [],
    name: [],
    color: [oneOfOrEmpty(allowedContainerColors)],
    icon: [oneOfOrEmpty(allowedContainerIcons)],

    // url params
    url: [required, url],
    index: [integer],
    pinned: [boolean],
    openInReaderMode: [boolean],

    // global validators
    __validators: [atLeastOneRequired(["id", "name"])],
};

export function parseOpenerParams(rawHash: string): Container {
    if (rawHash[0] != "#") {
        throw new Error("not a valid location hash");
    }

    const uri = decodeURIComponent(rawHash.substring(1));

    if (!uri.startsWith(customProtocolPrefix)) {
        throw new Error("unknown URI protocol");
    }

    const qs = new URLSearchParams(uri.substring(customProtocolPrefix.length));
    const name = qs.get("name");
    if (name == null) {
        throw new Error("container name is required");
    }
    const urlString = qs.get("url");
    if (urlString == null) {
        throw new Error("container name is required");
    }
    // ensure that the URL is valid, by parsing it as a URL
    const url = new URL(urlString).toString();
    const color = qs.get("color");
    const icon = qs.get("icon");

    const container: Container = {
        name,
        url,
        color: color && allowedContainerColors.indexOf(color) !== -1 ? color : undefined,
        icon: icon && allowedContainerIcons.indexOf(icon) !== -1 ? icon : undefined,
    };

    return container;
}
