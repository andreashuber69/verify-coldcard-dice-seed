// https://github.com/andreashuber69/verify-coldcard-dice-seed/blob/develop/README.md#----verify-coldcard-dice-seed
import { sha256 } from "./sha256.js";

const toBigInt = (hexNumber: string) => BigInt(`0x${hexNumber || "0"}`);

const calculateCheckSum = async (hexEntropy: string, cs: number) => {
    const buffer = new Uint8Array(hexEntropy.length / 2);

    for (let index = 0; index < hexEntropy.length; index += 2) {
        buffer[index / 2] = Number.parseInt(hexEntropy.slice(index, index + 2), 16);
    }

    const entropySha256 = await sha256(buffer);
    return toBigInt(entropySha256) >> BigInt((entropySha256.length * 4) - cs);
};

const getWords = (checkedEntropy: bigint, bits: number, wordlist: readonly string[]) => {
    const bitsPerWord = Math.log2(wordlist.length);

    if (!Number.isInteger(bitsPerWord) || (bits % bitsPerWord !== 0)) {
        throw new RangeError(`wordlist.length is invalid: ${wordlist.length}`);
    }

    const words = new Array<string>(bits / bitsPerWord);
    const divisor = BigInt(wordlist.length);

    for (let index = words.length - 1; index >= 0; --index) {
        const word = wordlist[Number(checkedEntropy % divisor)];

        if (!word) {
            throw new RangeError("wordlist is invalid");
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
 * @param wordCount The number of words the mnemonic must contain. Must be a multiple of 3.
 * @param wordlist The words to encode hexEntropy with.
 */
export const calculateBip39Mnemonic = async (hexEntropy: string, wordCount: number, wordlist: readonly string[]) => {
    // The following steps implement https://github.com/bitcoin/bips/blob/master/bip-0039.mediawiki:
    const cs = wordCount / 3;

    if (!Number.isInteger(cs)) {
        throw new RangeError("wordCount must be a multiple of 3");
    }

    const minLength = 8 * cs;

    if (hexEntropy.length < minLength) {
        throw new RangeError(`hexEntropy length must be >= ${minLength}`);
    }

    const trimmedHexEntropy = hexEntropy.slice(0, minLength);

    // Shift left by cs bits to make room for checksum
    const entropy = toBigInt(trimmedHexEntropy) << BigInt(cs);
    return getWords(entropy + await calculateCheckSum(trimmedHexEntropy, cs), 33 * cs, wordlist);
};
