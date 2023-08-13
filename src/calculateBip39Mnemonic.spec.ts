// https://github.com/andreashuber69/verify-coldcard-dice-seed/blob/develop/README.md#----verify-coldcard-dice-seed
import assert from "node:assert";
import { describe, it } from "node:test";
import { wordlists } from "bip39";
import fetch from "node-fetch";

import { calculateBip39Mnemonic } from "./calculateBip39Mnemonic.js";

const wordlist = wordlists["english"];

if (!wordlist) {
    // cSpell: ignore wordlist
    throw new Error("Missing english wordlist.");
}

const expectWords = (entropy: string, words: string) =>
    it(entropy, () => assert(calculateBip39Mnemonic(entropy, wordlist).join(" ") === words));


const expectError = (entropy: string, newWordlist: readonly string[], errorMessage: string) => it(
    entropy,
    () => {
        try {
            calculateBip39Mnemonic(entropy, newWordlist);
            assert(false, "Expected error to be thrown!");
        } catch (error: unknown) {
            assert(error instanceof RangeError && error.message === errorMessage);
        }
    },
);


const response = await fetch("https://raw.githubusercontent.com/trezor/python-mnemonic/master/vectors.json");

if (!response.ok) {
    throw new Error("Unexpected response");
}

const vectors = JSON.parse(await response.text()) as Record<string, unknown>;

describe(calculateBip39Mnemonic.name, () => {
    describe("should calculate the expected words", () => {
        if (!("english" in vectors) || !Array.isArray(vectors["english"])) {
            throw new Error("Unexpected response");
        }

        for (const vector of vectors["english"]) {
            if (!Array.isArray(vector) || (vector.length < 2) ||
                (typeof vector[0] !== "string") || (typeof vector[1] !== "string")) {
                throw new Error("Unexpected response");
            }

            // https://github.com/typescript-eslint/typescript-eslint/issues/7464
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            const [entropy, words] = vector;
            expectWords(entropy, words);
        }

        expectWords("", "");
        expectWords("00000000", "abandon abandon ability");
        expectWords("ffffffff", "zoo zoo zoo");
    });

    describe("should throw the expected exception", () => {
        expectError("3", wordlist, "hexEntropy length must be a multiple of 8");
        expectError("777777777", wordlist, "hexEntropy length must be a multiple of 8");
        expectError("ffffffff", wordlist.slice(1), "wordlist.length is invalid: 2047");
        expectError("ffffffff", wordlist.slice(1024), "wordlist.length is invalid: 1024");
        const invalidWordlist = wordlist.slice(-1);
        invalidWordlist.push("");
        expectError("ffffffff", invalidWordlist, "wordlist is invalid");
    });
});
