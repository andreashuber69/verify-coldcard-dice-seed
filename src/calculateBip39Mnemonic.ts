// https://github.com/andreashuber69/verify-coldcard-dice-seed/blob/develop/README.md#----verify-coldcard-dice-seed
import { sha256 } from "./sha256.js";

const toBigInt = (hexNumber: string) => BigInt(`0x${hexNumber || "0"}`);

const calculateCheckSum = (hexEntropy: string, cs: number) => {
    const entropySha256 = sha256(Buffer.from(hexEntropy, "hex"));

    return toBigInt(entropySha256) >> BigInt((entropySha256.length * 4) - cs);
};

const getWords = (checkedEntropy: bigint, bits: number, wordlist: readonly string[]) => {
    const bitsPerWord = Math.log2(wordlist.length);

    if (bits % bitsPerWord !== 0) {
        throw new RangeError("checkedEntropy has an unexpected number of bits");
    }

    const words = new Array<string>(bits / bitsPerWord);
    const divisor = BigInt(wordlist.length);

    for (let index = words.length - 1; index >= 0; --index) {
        const word = wordlist[Number(checkedEntropy % divisor)];

        if (!word) {
            throw new Error("Invalid wordlist!");
        }

        words[index] = word;
        // eslint-disable-next-line no-param-reassign
        checkedEntropy /= divisor;
    }

    return words;
};

/**
 * Calculates the mnemonic from the given entropy according to BIP-0039
 * (https://github.com/bitcoin/bips/blob/master/bip-0039.mediawiki).
 * @param hexEntropy The entropy to use for the mnemonic as a hexadecimal string. Due to constraints imposed by
 * BIP-0039, the string length must be a multiple of 8. In violation of BIP-0039 however, for testing purposes it is
 * allowed to pass strings with lengths smaller than 32.
 * @param wordlist The words to encode hexEntropy with.
 */
export const calculateBip39Mnemonic = (hexEntropy: string, wordlist: readonly string[]) => {
    if (hexEntropy.length % 8 !== 0) {
        throw new RangeError("hexEntropy length must be a multiple of 8");
    }

    // The following steps implement https://github.com/bitcoin/bips/blob/master/bip-0039.mediawiki:
    const ent = hexEntropy.length * 4;
    const cs = ent / 32;
    // Shift left by cs bits to make room for checksum
    const entropy = toBigInt(hexEntropy) << BigInt(cs);

    return getWords(entropy + calculateCheckSum(hexEntropy, cs), ent + cs, wordlist);
};
