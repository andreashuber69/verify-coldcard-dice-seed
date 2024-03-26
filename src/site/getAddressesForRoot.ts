// https://github.com/andreashuber69/verify-coldcard-dice-seed/blob/develop/README.md#----verify-coldcard-dice-seed
import { getAddresses } from "../common/getAddresses.js";
import { getRoot } from "../common/getRoot.js";
import type { GetAddressesParams } from "./GetAddressesParams.js";

export const getAddressesForRoot = async (
    { mnemonic, passphrase, accountRootPath }: GetAddressesParams,
): Promise<Array<[string, string]>> =>
    getAddresses(await getRoot(mnemonic.join(" "), passphrase), accountRootPath, 0, 50);
