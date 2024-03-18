import { BIP32Factory } from "bip32";
import { mnemonicToSeed, wordlists } from "bip39";
// eslint-disable-next-line import/no-namespace
import * as ecc from "tiny-secp256k1";
import { calculateBip39Mnemonic } from "./calculateBip39Mnemonic.js";
import { getAddresses } from "./getAddresses.js";
import { sha256 } from "./sha256.js";

const wordlist = wordlists["english"];

if (!wordlist) {
    // cSpell: ignore wordlist
    throw new Error("Missing english wordlist.");
}


const getElement = <T extends HTMLElement>(ctor: abstract new () => T, selector: string) => {
    const result = document.querySelector(selector);

    if (!(result instanceof ctor)) {
        throw new TypeError(`The selector ${selector} does not match an element of type ${ctor}.`);
    }

    return result;
};

const generate24WordsElement = getElement(HTMLInputElement, "#generate-24-words");
const diceRollsElement = getElement(HTMLInputElement, "#dice-rolls");
const passphraseElement = getElement(HTMLInputElement, "#passphrase");
const rollsCountElement = getElement(HTMLDivElement, "#rolls-count");
const hashElement = getElement(HTMLDivElement, "#hash");
const addressesElement = getElement(HTMLDivElement, "#addresses");

const getMnemonic = async (rolls: string) => {
    rollsCountElement.textContent = `${rolls.length} rolls`;
    hashElement.textContent = await sha256(new TextEncoder().encode(rolls));

    if (diceRollsElement.ariaInvalid === "true") {
        return undefined;
    }

    const wordCount = generate24WordsElement.checked ? 24 : 12;
    return await calculateBip39Mnemonic(hashElement.textContent, wordCount, wordlist);
};

const showMnemonic = (mnemonic: string[] | undefined = undefined) => {
    for (const [index, word] of (mnemonic ?? new Array<undefined>(24)).entries()) {
        const wordNumber = `${index + 1}`.padStart(2, "0");
        const element = getElement(HTMLElement, `#word${wordNumber}`);
        element.textContent = word ? `${wordNumber}. ${word}` : "";
    }
};

const bip32 = BIP32Factory(ecc);

const onInput = async () => {
    diceRollsElement.minLength = generate24WordsElement.checked ? 99 : 50;
    const rolls = diceRollsElement.value;
    const { tooShort, patternMismatch, valueMissing } = diceRollsElement.validity;
    diceRollsElement.ariaInvalid = `${tooShort || patternMismatch || valueMissing}`;
    const mnemonic = await getMnemonic(rolls);

    showMnemonic();
    addressesElement.innerHTML = "";

    if (mnemonic) {
        showMnemonic(mnemonic);

        const root = bip32.fromSeed(await mnemonicToSeed(mnemonic.join(" "), passphraseElement.value));
        let batch: ReturnType<typeof getAddresses>;
        let addressesHtml = "";

        for (let startIndex = 0; startIndex < 50; startIndex += batch.length) {
            batch = getAddresses(root, "m/84'/0'/0'/0", startIndex);
            addressesHtml += batch.reduce((p, [path, addr]) => `${p}${path} => ${addr}<br>`, "");
        }

        addressesElement.innerHTML = addressesHtml;
    }
};

generate24WordsElement.addEventListener("input", () => void onInput());
diceRollsElement.addEventListener("input", () => void onInput());
passphraseElement.addEventListener("input", () => void onInput());
await onInput();
