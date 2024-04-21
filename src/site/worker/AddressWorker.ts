// https://github.com/andreashuber69/verify-coldcard-dice-seed/blob/develop/README.md#----verify-coldcard-dice-seed
import { implementWorkerExternal } from "kiss-worker";
import type { GetAddressesForMnemonicAndPassphraseImpl } from "./getAddressesForMnemonicAndPassphraseImpl.js";

export const AddressWorker = implementWorkerExternal<GetAddressesForMnemonicAndPassphraseImpl>(
    () => new Worker(new URL("getAddressesForMnemonicAndPassphraseImpl.js", import.meta.url), { type: "module" }),
);
