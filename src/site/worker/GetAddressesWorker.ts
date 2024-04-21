// https://github.com/andreashuber69/verify-coldcard-dice-seed/blob/develop/README.md#----verify-coldcard-dice-seed
import { implementWorkerExternal } from "kiss-worker";
import type { GetAddresses } from "./getAddresses.js";

export const GetAddressesWorker = implementWorkerExternal<GetAddresses>(
    () => new Worker(new URL("getAddresses.js", import.meta.url), { type: "module" }),
);
