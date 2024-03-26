// https://github.com/andreashuber69/verify-coldcard-dice-seed/blob/develop/README.md#----verify-coldcard-dice-seed
import { getAddressesForRoot } from "../common/getAddressesForRoot.js";
import { getRoot } from "../common/getRoot.js";
import type { GetAddressesParams } from "./GetAddressesParams.js";

const getAddressesForMnemonicAndPassphraseImpl = async (
    { mnemonic, passphrase, accountRootPath }: GetAddressesParams,
): Promise<Array<[string, string]>> =>
    getAddressesForRoot(await getRoot(mnemonic.join(" "), passphrase), accountRootPath, 0, 50);

onmessage = async (ev: MessageEvent<GetAddressesParams>) =>
    postMessage(await getAddressesForMnemonicAndPassphraseImpl(ev.data));


