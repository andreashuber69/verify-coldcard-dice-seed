// https://github.com/andreashuber69/verify-coldcard-dice-seed/blob/develop/README.md#----verify-coldcard-dice-seed
import { once } from "node:events";

import { AbortError } from "./AbortError.js";
import type { In } from "./InOut.js";

export const getKey = async (stdin: In) => {
    using cleanup = new DisposableStack();
    stdin.resume();
    cleanup.defer(() => stdin.pause());
    const key = `${await once(stdin, "data")}`;

    if (key === "\u0003") {
        throw new AbortError();
    }

    return key;
};
