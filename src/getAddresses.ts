// https://github.com/andreashuber69/verify-coldcard-dice-seed#--
import type { HDNode } from "@bitgo/utxo-lib";
import { toBech32Address } from "./toBech32Address";

export const getAddresses = (rootNode: HDNode, accountRootPath: string, startIndex: number, length: number) => {
    const accountRoot = rootNode.derivePath(accountRootPath);
    const result = new Array<[string, string]>();

    for (let index = startIndex; index < startIndex + length; ++index) {
        result.push([`${accountRootPath}/${index}`, toBech32Address(accountRoot.derive(index))]);
    }

    return result;
};
