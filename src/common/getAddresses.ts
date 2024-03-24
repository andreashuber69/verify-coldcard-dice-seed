// https://github.com/andreashuber69/verify-coldcard-dice-seed/blob/develop/README.md#----verify-coldcard-dice-seed
import type { BIP32Interface } from "bip32";
import { toBech32Address } from "./toBech32Address.js";

type GrowToSize<T, N extends number, A extends T[]> = A["length"] extends N ? A : GrowToSize<T, N, [...A, T]>;

type Batch<N extends number> = GrowToSize<[string, string], N, []>;

export const getAddresses = <N extends number>(
    root: BIP32Interface,
    accountRootPath: string,
    startIndex: number,
    length: N,
) => {
    const accountRoot = root.derivePath(accountRootPath);
    const result = new Array<[string, string]>(length);

    for (let index = startIndex; index < startIndex + length; ++index) {
        result[index - startIndex] = [`${accountRootPath}/${index}`, toBech32Address(accountRoot.derive(index))];
    }

    return result as Batch<N>;
};
