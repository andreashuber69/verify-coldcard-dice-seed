// https://github.com/andreashuber69/verify-coldcard-dice-seed/blob/develop/README.md#----verify-coldcard-dice-seed
import type { getAddressesForMnemonicAndPassphraseImpl } from "./getAddressesForMnemonicAndPassphraseImpl.js";
import { SimpleWorker } from "./SimpleWorker.js";

const simpleWorker = new SimpleWorker<typeof getAddressesForMnemonicAndPassphraseImpl>(
    new Worker(new URL("worker.js", import.meta.url), { type: "module" }),
);

export const getAddressesForMnemonicAndPassphrase = async (
    ...args: Parameters<typeof getAddressesForMnemonicAndPassphraseImpl>
) => (
    args[0].mnemonic.length > 0 ? await simpleWorker.execute(...args) : new Array<[string, string]>()
);
