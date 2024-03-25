// https://github.com/andreashuber69/verify-coldcard-dice-seed/blob/develop/README.md#----verify-coldcard-dice-seed
import assert from "node:assert";
import { describe, it } from "node:test";
import { wordlists } from "bip39";

import { calculateBip39Mnemonic } from "./calculateBip39Mnemonic.js";

const wordlist = wordlists["english"];

if (!wordlist) {
    throw new Error("Missing english wordlist.");
}

const expectError = async (entropy: string, newWordlist: readonly string[], errorMessage: string) => await it(
    entropy,
    async () => {
        try {
            await calculateBip39Mnemonic(entropy, Math.floor(entropy.length / 8) * 3, newWordlist);
            assert(false, "Expected error to be thrown!");
        } catch (error: unknown) {
            assert(error instanceof RangeError && error.message === errorMessage);
        }
    },
);

await describe(calculateBip39Mnemonic.name, async () => {
    await describe("should throw the expected exception", async () => {
        await expectError("ffffffff", wordlist.slice(1), "wordlist.length is invalid: 2047");
        await expectError("ffffffff", wordlist.slice(1024), "wordlist.length is invalid: 1024");
        const invalidWordlist = wordlist.slice(-1);
        invalidWordlist.push("");
        await expectError("ffffffff", invalidWordlist, "wordlist is invalid");
    });
});
