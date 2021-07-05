import { wordlists } from "bip39";
import sha256 from "crypto-js/sha256";

class App {
    public static async main() {
        try {
            const input = await this.requestInput("Dice rolls: ");
            const entropy = sha256(input);
            const hexEntropy = entropy.toString();
            console.log(`Entropy: ${hexEntropy}`);

            // The following steps implement https://en.bitcoin.it/wiki/BIP_0039:

            // 1. Calculate checksum: take the first byte (2 hexadecimal digits) of the sha256
            const hexChecksum = sha256(entropy).toString().slice(0, 2);

            // 2. Append checksum to the end of entropy
            const hexEntropyWithChecksum = hexEntropy + hexChecksum;

            // 3. Slice into 24 words, representing 11 bits each
            const words = this.toWords(hexEntropyWithChecksum);
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

    private static toWords(hexEntropy: string): readonly string[] {
        const allWords = wordlists.english;
        const words = new Array<string>(hexEntropy.length * 4 / Math.log2(allWords.length));
        const divisor = BigInt(allWords.length);
        let entropy = BigInt(`0x${hexEntropy}`);

        for (let index = words.length - 1; index >= 0; --index) {
            words[index] = allWords[Number(entropy % divisor)];
            entropy /= divisor;
        }

        return words;
    }
}

// The catch should never be reached (because we handle all errors in main). If it does, we let the whole thing fail.
App.main().then((exitCode) => (process.exitCode = exitCode)).catch(() => (process.exitCode = 1));
