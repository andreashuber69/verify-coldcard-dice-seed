import { getAddressesForMnemonicAndPassphraseImpl } from "./getAddressesForMnemonicAndPassphraseImpl.js";
import type { GetAddressesParams } from "./GetAddressesParams.js";

onmessage = async (ev: MessageEvent<GetAddressesParams>) =>
    postMessage(await getAddressesForMnemonicAndPassphraseImpl(ev.data));
