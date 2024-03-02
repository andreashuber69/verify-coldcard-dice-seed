import { BIP32Factory } from "bip32";
import { mnemonicToSeed } from "bip39";
// eslint-disable-next-line import/no-namespace
import * as ecc from "tiny-secp256k1";
import { getAddresses } from "./getAddresses.js";

const getElement = <T extends HTMLElement>(ctor: abstract new () => T, selector: string) => {
    const result = document.querySelector(selector);

    if (!(result instanceof ctor)) {
        throw new TypeError(`The selector ${selector} does not match an element of type ${ctor}.`);
    }

    return result;
};

const words = "abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about";
const root = BIP32Factory(ecc).fromSeed(await mnemonicToSeed(words, ""));
const batch = getAddresses(root, "m/84'/0'/0'/0", 0);

const listElement = getElement(HTMLElement, "#list");
listElement.innerHTML = batch.map(([_, address]) => `<p class="monospace">${address}</li>`).join("");
