import { createInterface } from "readline";
import { AbortError } from "./AbortError";
import type { IStdStreams } from "./IStdStreams";

export const readPassphrase = async ({ stdin, stdout }: IStdStreams) => await new Promise<string>((resolve, reject) => {
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
