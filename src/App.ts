import sha256 from "crypto-js/sha256";
import { calculateBip39Mnemonic } from "./calculateBip39Mnemonic";

class App {
    public static async main() {
        try {
            const input = await this.requestInput("Dice rolls: ");
            const words = calculateBip39Mnemonic(sha256(input).toString());
            console.log(words);

            return 0;
        } catch (ex: unknown) {
            console.error(`${ex}`);

            return 1;
        }
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    private static async requestInput(prompt: string) {
        process.stdout.write(prompt);

        return await this.getConsoleInput();
    }

    private static async getConsoleInput() {
        return await new Promise<string>((resolve) => {
            const stdin = process.openStdin();
            stdin.once("data", (args: { readonly toString: () => string }) => {
                resolve(args.toString().trim());
                stdin.pause();
            });
        });
    }
}

// The catch should never be reached (because we handle all errors in main). If it does, we let the whole thing fail.
App.main().then((exitCode) => (process.exitCode = exitCode)).catch(() => (process.exitCode = 1));
