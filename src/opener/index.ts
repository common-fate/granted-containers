import { Container, prepareContainer } from "./containers";
import { parseOpenerParams } from "./parser";
import { newTab } from "./tabs";

function error(e: any) {
    console.error(e);
    const errbody = document.getElementById("internalErrorBody");
    const errWrapper = document.getElementById("internalErrorContainer");
    if (errbody != null) {
        errbody.textContent = e;
    }
    if (errWrapper != null) {
        errWrapper.classList.remove("hidden");
    }
}

async function openTabInContainer(container: Container) {
    const preparedContainer = await prepareContainer(container);

    await newTab(preparedContainer, container);
}

async function main() {
    try {
        const container = parseOpenerParams(window.location.hash);
        await openTabInContainer(container);
    } catch (e) {
        error(e);
        return;
    }
}

main();
