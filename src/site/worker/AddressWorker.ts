// https://github.com/andreashuber69/verify-coldcard-dice-seed/blob/develop/README.md#----verify-coldcard-dice-seed
import { implementWorker } from "kiss-worker";
import type { getAddressesForMnemonicAndPassphraseImpl } from "./getAddressesForMnemonicAndPassphraseImpl.js";

export const AddressWorker = implementWorker<typeof getAddressesForMnemonicAndPassphraseImpl>(
    () => new Worker(new URL("worker.js", import.meta.url), { type: "module" }),
);
