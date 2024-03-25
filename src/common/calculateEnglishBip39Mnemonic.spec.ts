// https://github.com/andreashuber69/verify-coldcard-dice-seed/blob/develop/README.md#----verify-coldcard-dice-seed
import assert from "node:assert";
import { describe, it } from "node:test";
import fetch from "node-fetch";

import { calculateEnglishBip39Mnemonic } from "./calculateEnglishBip39Mnemonic.js";

const expectWords = async (entropy: string, words: string) => {
    const wordCount = words.length === 0 ? 0 : words.split(" ").length;

    await it(
        entropy,
        async () => assert((await calculateEnglishBip39Mnemonic(entropy, wordCount)).join(" ") === words),
    );
};

const response = await fetch("https://raw.githubusercontent.com/trezor/python-mnemonic/master/vectors.json");

if (!response.ok) {
    throw new Error("Unexpected response");
}

const vectors = JSON.parse(await response.text()) as Record<string, unknown>;

await describe(calculateEnglishBip39Mnemonic.name, async () => {
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
        await it("ffffffff", async () => {
            try {
                await calculateEnglishBip39Mnemonic("ffffffff", 2);
                assert(false, "Expected error to be thrown!");
            } catch (error: unknown) {
                assert(error instanceof RangeError && error.message === "wordCount must be a multiple of 3");
            }
        });

        await it("fffffff", async () => {
            try {
                await calculateEnglishBip39Mnemonic("fffffff", 3);
                assert(false, "Expected error to be thrown!");
            } catch (error: unknown) {
                assert(error instanceof RangeError && error.message === "hexEntropy length must be >= 8");
            }
        });
    });
});
