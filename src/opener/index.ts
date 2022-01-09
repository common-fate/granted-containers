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
        // get extension parameters
        const container = parseOpenerParams(window.location.hash);
        console.log({ container });
        // const openerParams = new OpenerParameters(parsedParams);

        // // verify input signature to prevent clickjacking
        // try {
        //     await openerParams.verify(
        //         await getSigningKey(),
        //         parsedParams.signature,
        //     );
        // } catch (e) {
        //     if (e instanceof SignatureError) {
        //         // require user confirmation if signature verification failed
        //         requestConfirmation(openerParams);
        //         return;
        //     }

        //     throw e;
        // }

        // // finally, open a new tab
        await openTabInContainer(container);
    } catch (e) {
        error(e);
        return;
    }
}

main();
