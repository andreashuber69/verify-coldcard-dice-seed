// https://github.com/andreashuber69/verify-coldcard-dice-seed/blob/develop/README.md#----verify-coldcard-dice-seed
import { FunctionInfo, implementFunctionWorkerExternal } from "kiss-worker";
import type { getAddresses } from "./getAddresses.js";

export const createGetAddressesWorker = implementFunctionWorkerExternal(
    () => new Worker(new URL("getAddresses.js", import.meta.url), { type: "module" }),
    new FunctionInfo<typeof getAddresses>(),
);
