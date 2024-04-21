// https://github.com/andreashuber69/verify-coldcard-dice-seed/blob/develop/README.md#----verify-coldcard-dice-seed
import { AddressWorker } from "./worker/AddressWorker.js";

const worker = new AddressWorker();

export const getAddresses = async (...args: Parameters<typeof worker["execute"]>) => (
    args[0].length > 0 ? await worker.execute(...args) : new Array<[string, string]>()
);
