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

const expectWords = async (entropy: string, words: string) =>
    await it(entropy, () => assert(calculateBip39Mnemonic(entropy, wordlist).join(" ") === words));


const expectError = async (entropy: string, newWordlist: readonly string[], errorMessage: string) => await it(
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

await describe(calculateBip39Mnemonic.name, async () => {
    await describe("should calculate the expected words", async () => {
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
            // eslint-disable-next-line no-await-in-loop
            await expectWords(entropy, words);
        }

        await expectWords("", "");
        await expectWords("00000000", "abandon abandon ability");
        await expectWords("ffffffff", "zoo zoo zoo");
    });

    await describe("should throw the expected exception", async () => {
        await expectError("3", wordlist, "hexEntropy length must be a multiple of 8");
        await expectError("777777777", wordlist, "hexEntropy length must be a multiple of 8");
        await expectError("ffffffff", wordlist.slice(1), "wordlist.length is invalid: 2047");
        await expectError("ffffffff", wordlist.slice(1024), "wordlist.length is invalid: 1024");
        const invalidWordlist = wordlist.slice(-1);
        invalidWordlist.push("");
        await expectError("ffffffff", invalidWordlist, "wordlist is invalid");
    });
});
