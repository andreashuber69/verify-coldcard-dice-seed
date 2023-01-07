// https://github.com/andreashuber69/verify-coldcard-dice-seed#--
import type { BIP32Interface } from "bip32";
import { toBech32Address } from "./toBech32Address.js";

type Batch = [readonly [string, string], ...Array<readonly [string, string]>];

export const getAddresses = (root: BIP32Interface, accountRootPath: string, startIndex: number): Readonly<Batch> => {
    const accountRoot = root.derivePath(accountRootPath);
    const length = 10;
    const result: Batch = [["", ""], ...new Array<[string, string]>(length - 1)];

    for (let index = startIndex; index < startIndex + length; ++index) {
        result[index - startIndex] = [`${accountRootPath}/${index}`, toBech32Address(accountRoot.derive(index))];
    }

    return result;
};
