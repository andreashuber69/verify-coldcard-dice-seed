// https://github.com/andreashuber69/verify-coldcard-dice-seed/blob/develop/README.md#----verify-coldcard-dice-seed

import { wordlists } from "bip39";
import { describe, expect, it } from "vitest";

import { calculateBip39Mnemonic } from "./calculateBip39Mnemonic.js";

const wordlist = wordlists["english"];

if (!wordlist) {
    throw new Error("Missing english wordlist.");
}

const expectError = (entropy: string, newWordlist: readonly string[], errorMessage: string) => it(
    entropy,
    async () => {
        try {
            await calculateBip39Mnemonic(entropy, Math.floor(entropy.length / 8) * 3, newWordlist);
            expect(false, "Expected error to be thrown!");
        } catch (error: unknown) {
            expect(error instanceof RangeError && error.message === errorMessage);
        }
    },
);

describe(calculateBip39Mnemonic.name, () => {
    describe("should throw the expected exception", () => {
        expectError("ffffffff", wordlist.slice(1), "wordlist.length is invalid: 2047");
        expectError("ffffffff", wordlist.slice(1024), "wordlist.length is invalid: 1024");
        const invalidWordlist = wordlist.slice(-1);
        invalidWordlist.push("");
        expectError("ffffffff", invalidWordlist, "wordlist is invalid");
    });
});
