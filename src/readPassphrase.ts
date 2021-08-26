import { createInterface } from "readline";
import { AbortError } from "./AbortError";

export const readPassphrase = async () => await new Promise<string>((resolve, reject) => {
    const { stdin, stdout } = process;
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
