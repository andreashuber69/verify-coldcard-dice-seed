// https://github.com/andreashuber69/verify-coldcard-dice-seed/blob/develop/README.md#----verify-coldcard-dice-seed
import { wordlists } from "bip39";
import { calculateBip39Mnemonic } from "./calculateBip39Mnemonic.js";

const wordlist = wordlists["english"];

if (!wordlist) {
    throw new Error("Missing english wordlist.");
}

export const calculateEnglishBip39Mnemonic = async (hexEntropy: string, wordCount: number) =>
    await calculateBip39Mnemonic(hexEntropy, wordCount, wordlist);
