// https://github.com/andreashuber69/verify-coldcard-dice-seed#--
import type { BIP32Interface } from "bip32";
import { toBech32Address } from "./toBech32Address.js";

export const getAddresses = (rootNode: BIP32Interface, accountRootPath: string, startIndex: number, length: number) => {
    const accountRoot = rootNode.derivePath(accountRootPath);
    const result = new Array<[string, string]>();

    for (let index = startIndex; index < startIndex + length; ++index) {
        result.push([`${accountRootPath}/${index}`, toBech32Address(accountRoot.derive(index))]);
    }

    return result;
};
