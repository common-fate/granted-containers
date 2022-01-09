import { OpenerParamsSchema } from "./parser";

export function sanitizeURLSearchParams(
    qs: URLSearchParams,
    schema: OpenerParamsSchema,
) {
    let params = {};

    // validate each key from the schema
    // except the __validators one
    for (let k of Object.keys(schema)) {
        if (k === "__validators") {
            continue;
        }

        // apply each validator
        let param = qs.get(k);
        for (let v of (schema as any)[k]) {
            param = v(param, k);
        }

        // skip empty params
        if (isEmpty(param)) {
            continue;
        }

        (params as any)[k] = param;
    }

    // apply global validators
    for (let v of schema.__validators || []) {
        params = v(params);
    }

    return params;
}

function isEmpty(v: string | null | undefined) {
    return v === null || v === undefined || v === "";
}

export function url(p: string) {
    if (isEmpty(p)) {
        return p;
    }

    try {
        return new URL(p).toString();
    } catch {} // eslint-disable-line no-empty

    // let's try to add 'https://' prefix and try again
    p = "https://" + p;
    return new URL(p).toString();
}

export function required(p: any, name: any) {
    if (isEmpty(p)) {
        throw new Error(`"${name}" parameter is missing`);
    }
    return p;
}

export function integer(p: string, name: any) {
    if (isEmpty(p)) {
        return p;
    }

    if (!/^[-+]?(\d+|Infinity)$/.test(p)) {
        throw new Error(`"${name}" parameter should be an integer`);
    }

    return Number(p);
}

export function boolean(p: string, name: any) {
    if (isEmpty(p)) {
        return p;
    }

    switch (p.toLowerCase()) {
        case "true":
        case "yes":
        case "on":
        case "1":
            return true;
        case "false":
        case "no":
        case "off":
        case "0":
            return false;
    }

    throw new Error(
        `"${name}" parameter should be a boolean (true/false, yes/no, on/off, 1/0)`,
    );
}

export function fallback(val: any) {
    return function (p: any) {
        if (isEmpty(p)) {
            return val;
        }

        return p;
    };
}

export function oneOf(vals: any) {
    return function (p: any, name: any) {
        if (vals.indexOf(p) === -1) {
            throw new Error(
                `"${name}" parameter should be a in a list ${vals}`,
            );
        }

        return p;
    };
}

export function oneOfOrEmpty(vals: any) {
    const oneOfFunc = oneOf(vals);
    return function (p: any, name: any) {
        if (isEmpty(p)) {
            return p;
        }

        return oneOfFunc(p, name);
    };
}

export function atLeastOneRequired(requiredParams: any) {
    return function (params: any) {
        let valid = false;
        for (let p of requiredParams) {
            if (!isEmpty(params[p])) {
                valid = true;
                break;
            }
        }

        if (!valid) {
            throw new Error(
                `at least one of "${requiredParams.join(
                    '", "',
                )}" should be specified`,
            );
        }

        return params;
    };
}
