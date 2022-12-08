// https://github.com/andreashuber69/verify-coldcard-dice-seed#--
import { once } from "events";

import { AbortError } from "./AbortError.js";
import type { IIn } from "./IInOut.js";

export const getKey = async (stdin: IIn) => {
    stdin.resume();

    try {
        const key = `${await once(stdin, "data")}`;

        if (key === "\u0003") {
            throw new AbortError();
        }

        return key;
    } finally {
        stdin.pause();
    }
};
