import sha256 from "crypto-js/sha256";
import { calculateBip39Mnemonic } from "./calculateBip39Mnemonic";

const getConsoleInput = async () => await new Promise<string>((resolve) => {
    const stdin = process.openStdin();
    stdin.once("data", (args: { readonly toString: () => string }) => {
        resolve(args.toString().trim());
        stdin.pause();
    });
});

const requestInput = async (prompt: string) => {
    process.stdout.write(prompt);

    return await getConsoleInput();
};

const main = async () => {
    try {
        const input = await requestInput("Dice rolls: ");
        const words = calculateBip39Mnemonic(sha256(input).toString());
        console.log(words);

        return 0;
    } catch (ex: unknown) {
        console.error(`${ex}`);

        return 1;
    }
};

// The catch should never be reached (because we handle all errors in main). If it does, we let the whole thing fail.
main().then((exitCode) => (process.exitCode = exitCode)).catch(() => (process.exitCode = 1));
