// https://github.com/andreashuber69/verify-coldcard-dice-seed#--
import { AbortError } from "./AbortError";
import type { IIn } from "./IInOut";

export const getKey = async (stdin: IIn) => await new Promise<string>((resolve, reject) => {
    stdin.resume();

    stdin.once("data", (key: unknown) => {
        stdin.pause();

        if (key === "\u0003") {
            reject(new AbortError());
        } else {
            resolve(`${key}`);
        }
    });
});
