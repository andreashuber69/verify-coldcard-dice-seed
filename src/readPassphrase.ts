// https://github.com/andreashuber69/verify-coldcard-dice-seed#--
import { createInterface } from "readline";
import { AbortError } from "./AbortError.js";
import type { IGenericInOut } from "./IInOut.js";

type IInOut = IGenericInOut<NodeJS.ReadableStream & Pick<NodeJS.ReadStream, "setRawMode">, NodeJS.WritableStream>;

export const readPassphrase = async ({ stdin, stdout }: IInOut) => await new Promise<string>((resolve, reject) => {
    const readlineInterface = createInterface(stdin, stdout);
    readlineInterface.question(
        "Wallet passphrase (press Return for none): ",
        (l) => {
            readlineInterface.close();
            stdin.setRawMode(true);
            resolve(l);
        },
    );

    readlineInterface.once(
        "SIGINT",
        () => {
            readlineInterface.close();
            reject(new AbortError());
        },
    );

    readlineInterface.on("SIGTSTP", () => undefined);
});
