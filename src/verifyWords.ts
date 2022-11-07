// https://github.com/andreashuber69/verify-coldcard-dice-seed#--
import { calculateBip39Mnemonic } from "./calculateBip39Mnemonic.js";
import type { IInOut } from "./IInOut.js";
import { sha256 } from "./sha256.js";
import { waitForUser } from "./waitForUser.js";

export const verifyWords = async ({ stdin, stdout }: IInOut, diceRolls: string) => {
    const words = calculateBip39Mnemonic(sha256(Buffer.from(diceRolls)));
    stdout.write("Compare these 24 words to the ones calculated by your COLDCARD:\r\n");
    stdout.write(words.reduce((p, c, i) => `${p}${`0${i + 1}`.slice(-2)}: ${c}\r\n`, ""));
    stdout.write("\r\n");
    await waitForUser({ stdin, stdout });
    stdout.write("Press the OK button on your COLDCARD and answer the test questions.\r\n");
    await waitForUser({ stdin, stdout });

    return words;
};
