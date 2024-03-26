// https://github.com/andreashuber69/verify-coldcard-dice-seed/blob/develop/README.md#----verify-coldcard-dice-seed
import { getAddressesForMnemonicAndPassphraseImpl } from "./getAddressesForMnemonicAndPassphraseImpl.js";
import type { GetAddressesParams } from "./GetAddressesParams.js";

export const getAddressesForMnemonicAndPassphrase = async (
    params: GetAddressesParams,
): Promise<Array<[string, string]>> => (
    params.mnemonic.length > 0 ? await getAddressesForMnemonicAndPassphraseImpl(params) : []
);
