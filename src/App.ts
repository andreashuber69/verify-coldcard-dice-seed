import sha256 from "crypto-js/sha256";

class App {
    public static async main() {
        try {
            const input = await this.requestInput("Dice rolls: ");
            const entropy = sha256(input);
            const hexEntropy = entropy.toString();
            console.log(`Entropy: ${hexEntropy}`);

            // The following operations implement https://en.bitcoin.it/wiki/BIP_0039:
            // 1. Calculate checksum: take the first byte (2 hex digits) of the sha256
            const hexChecksum = sha256(entropy).toString().slice(0, 2);
            // 2. Append checksum to the end of entropy
            const hexEntropyWithChecksum = hexEntropy + hexChecksum;
            console.log(`Entropy with checksum: ${hexEntropyWithChecksum}`);

            return 0;
        } catch (ex: unknown) {
            console.error(`${ex}`);

            return 1;
        }
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    private static async requestInput(prompt: string) {
        process.stdout.write(prompt);

        return await App.getConsoleInput();
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

export {};
