// https://github.com/andreashuber69/verify-coldcard-dice-seed/blob/develop/README.md#----verify-coldcard-dice-seed
import { getAddressesForRoot } from "../../common/getAddressesForRoot.js";
import { getRoot } from "../../common/getRoot.js";

export const getAddressesForMnemonicAndPassphraseImpl = async (
    mnemonic: readonly string[],
    passphrase: string,
    accountRootPath: string,
): Promise<Array<[string, string]>> =>
    getAddressesForRoot(await getRoot(mnemonic.join(" "), passphrase), accountRootPath, 0, 50);
