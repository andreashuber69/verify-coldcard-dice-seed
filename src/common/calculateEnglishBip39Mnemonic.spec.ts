// https://github.com/andreashuber69/verify-coldcard-dice-seed/blob/develop/README.md#----verify-coldcard-dice-seed

import fetch from "node-fetch";
import { describe, expect, it } from "vitest";

import { calculateEnglishBip39Mnemonic } from "./calculateEnglishBip39Mnemonic.js";

const expectWords = (entropy: string, words: string) => {
    const wordCount = words.length === 0 ? 0 : words.split(" ").length;

    it(
        entropy,
        async () => expect((await calculateEnglishBip39Mnemonic(entropy, wordCount)).join(" ") === words),
    );
};

const response = await fetch("https://raw.githubusercontent.com/trezor/python-mnemonic/master/vectors.json");

if (!response.ok) {
    throw new Error("Unexpected response");
}

const vectors = JSON.parse(await response.text()) as unknown;

describe(calculateEnglishBip39Mnemonic.name, () => {
    describe("should calculate the expected words", () => {
        if (!vectors || (typeof vectors !== "object") || !("english" in vectors) || !Array.isArray(vectors.english)) {
            throw new Error("Unexpected response");
        }

        for (const vector of vectors.english) {
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
        it("ffffffff", async () => {
            try {
                await calculateEnglishBip39Mnemonic("ffffffff", 2);
                expect(false, "Expected error to be thrown!");
            } catch (error: unknown) {
                expect(error instanceof RangeError && error.message === "wordCount must be a multiple of 3");
            }
        });

        it("fffffff", async () => {
            try {
                await calculateEnglishBip39Mnemonic("fffffff", 3);
                expect(false, "Expected error to be thrown!");
            } catch (error: unknown) {
                expect(error instanceof RangeError && error.message === "hexEntropy length must be >= 8");
            }
        });
    });
});
