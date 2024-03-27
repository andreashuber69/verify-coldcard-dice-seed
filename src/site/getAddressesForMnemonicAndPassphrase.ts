// https://github.com/andreashuber69/verify-coldcard-dice-seed/blob/develop/README.md#----verify-coldcard-dice-seed
import { once } from "node:events";
import type { GetAddressesParams } from "./GetAddressesParams.js";
import { PromiseQueue } from "./PromiseQueue.js";

const worker = new Worker(new URL("getAddressesForMnemonicAndPassphraseImpl.js", import.meta.url), { type: "module" });
const queue = new PromiseQueue();

const getAddressesForMnemonicAndPassphraseImpl = async (params: GetAddressesParams) =>
    await queue.execute(
        async () => {
            // eslint-disable-next-line unicorn/require-post-message-target-origin
            worker.postMessage(params);
            return ((await once(worker, "message"))[0] as MessageEvent<Array<[string, string]>>).data;
        },
    );

export const getAddressesForMnemonicAndPassphrase = async (params: GetAddressesParams) => (
    params.mnemonic.length > 0 ? await getAddressesForMnemonicAndPassphraseImpl(params) : new Array<[string, string]>()
);
