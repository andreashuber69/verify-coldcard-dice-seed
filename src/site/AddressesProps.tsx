import { getAddresses } from "../common/getAddresses.js";
import { getRoot } from "../common/getRoot.js";

export interface AddressesParams {
    readonly mnemonic: readonly string[];
    readonly passphrase: string;
    readonly accountRootPath: string;
}

export const getAddressesForMnemonicAndPassphrase = async (
    { mnemonic, passphrase, accountRootPath }: AddressesParams,
): Promise<Array<[string, string]>> => (
    mnemonic.length > 0 ? getAddresses(await getRoot(mnemonic.join(" "), passphrase), accountRootPath, 0, 50) : []
);
