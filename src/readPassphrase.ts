// https://github.com/andreashuber69/verify-coldcard-dice-seed#--
import { createInterface } from "node:readline";
import { AbortError } from "./AbortError.js";
import type { GenericInOut } from "./InOut.js";

type InOut = GenericInOut<NodeJS.ReadableStream & Pick<NodeJS.ReadStream, "setRawMode">, NodeJS.WritableStream>;

export const readPassphrase = async ({ stdin, stdout }: InOut) => await new Promise<string>((resolve, reject) => {
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
