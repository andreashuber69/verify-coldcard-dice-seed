// https://github.com/andreashuber69/verify-coldcard-dice-seed/blob/develop/README.md#----verify-coldcard-dice-seed
import { wordlists } from "bip39";
import { calculateBip39Mnemonic } from "../common/calculateBip39Mnemonic.js";
import { sha256 } from "../common/sha256.js";
import type { InOut } from "./InOut.js";
import { waitForUser } from "./waitForUser.js";

export const verifyWords = async ({ stdin, stdout }: InOut, diceRolls: string, wordCount: number) => {
    const wordlist = wordlists["english"];

    if (!wordlist) {
        throw new Error("Missing english wordlist.");
    }

    const words = await calculateBip39Mnemonic(await sha256(new TextEncoder().encode(diceRolls)), wordCount, wordlist);
    stdout.write("Compare these words to the ones calculated by your COLDCARD:\r\n");
    stdout.write(words.reduce((p, c, i) => `${p}${`0${i + 1}`.slice(-2)}: ${c}\r\n`, ""));
    stdout.write("\r\n");
    await waitForUser({ stdin, stdout });
    stdout.write("Press the OK button on your COLDCARD and answer the test questions.\r\n");
    await waitForUser({ stdin, stdout });
    return words;
};
