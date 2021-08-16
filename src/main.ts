#!/usr/bin/env node
// https://github.com/andreashuber69/verify-coldcard-dice-seed#--
import { createInterface } from "readline";
import { ReadStream } from "tty";
import { address, crypto, HDNode, script } from "@bitgo/utxo-lib";
import { mnemonicToSeed } from "bip39";
import { AbortError } from "./AbortError";
import { calculateBip39Mnemonic } from "./calculateBip39Mnemonic";
import { sha256 } from "./sha256";

const getKey = async (stdin: ReadStream) => await new Promise<string>((resolve, reject) => {
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

const toBech32Address = (node: HDNode) =>
    address.fromOutputScript(script.witnessPubKeyHash.output.encode(crypto.hash160(node.getPublicKeyBuffer())));

const getAddresses = (rootNode: HDNode, accountRootPath: string, startIndex: number, length: number) => {
    const accountRoot = rootNode.derivePath(accountRootPath);
    const result = new Array<[string, string]>();

    for (let index = startIndex; index < startIndex + length; ++index) {
        result.push([`${accountRootPath}/${index}`, toBech32Address(accountRoot.derive(index))]);
    }

    return result;
};

const main = async () => {
    const { stdin, stdout } = process;

    const waitForUser = async () => {
        stdout.write("Press any key to continue or CTRL-C to abort: ");
        await getKey(stdin);
        stdout.write("\r\n\r\n");
    };

    const processKey = async (input: string): Promise<[string, string]> => {
        stdout.write(`${input.length} rolls\r\n`);
        stdout.write(`${sha256(Buffer.from(input))}\r\n\r\n`);
        const key = await getKey(stdin);

        return [`${input}${key >= "1" && key <= "6" ? key : ""}`, key];
    };

    const readline = async (prompt: string) => await new Promise<string>((resolve, reject) => {
        const readlineInterface = createInterface(stdin, stdout);
        readlineInterface.question(
            prompt,
            (l) => {
                readlineInterface.close();
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

    try {
        if (!(stdin instanceof ReadStream)) {
            throw new Error("stdin is not an instance of tty.ReadStream");
        }

        stdin.pause();
        stdin.setRawMode(true);
        stdin.setEncoding("utf-8");

        stdout.write("Verify COLDCARD v4.1.2 dice seed\r\n");
        stdout.write("\r\n");
        stdout.write("This application guides you through verifying that your COLDCARD correctly\r\n");
        stdout.write("derives seeds and addresses from dice rolls.\r\n");
        stdout.write("\r\n");
        stdout.write("CAUTION: The very point of a COLDCARD is that the seed of a real wallet is\r\n");
        stdout.write("never entered outside of a coldcard. You should therefore only use this\r\n");
        stdout.write("application to verify the seed and address derivation of your COLDCARD. Once\r\n");
        stdout.write("you are convinced that your COLDCARD works correctly, you should then generate\r\n");
        stdout.write("the seed of your real wallet on your COLDCARD only.\r\n");
        stdout.write("\r\n");
        stdout.write("Log into your COLDCARD, select 'Import Existing', 'Dice Rolls'.\r\n");
        await waitForUser();
        stdout.write("To perform a realistic test you should enter exactly as many dice rolls as you\r\n");
        stdout.write("will enter for your real wallet. 99 or more rolls are recommended for maximum\r\n");
        stdout.write("security. Roll the dice and enter the value on your COLDCARD and here.\r\n");
        stdout.write("\r\n\r\n\r\n");
        stdout.write("Press 1-6 for each roll to mix in, ENTER to finish or CTRL-C to abort.\r\n");
        let input = "";
        let key = "";

        while (key !== "\r") {
            stdout.moveCursor(0, -3);
            // eslint-disable-next-line no-await-in-loop
            [input, key] = await processKey(input);
        }

        stdout.write("\r\n");
        const suffix = `${input.length < 99 ? " twice" : ""}`;
        stdout.write(`Press the OK button on your COLDCARD${suffix}.\r\n`);
        await waitForUser();

        const words = calculateBip39Mnemonic(sha256(Buffer.from(input)));
        stdout.write("Compare these 24 words to the ones calculated by your COLDCARD:\r\n");
        stdout.write(words.reduce((p, c, i) => `${p}${`0${i + 1}`.slice(-2)}: ${c}\r\n`, ""));
        stdout.write("\r\n");
        await waitForUser();
        stdout.write("Press the OK button on your COLDCARD and answer the test questions.\r\n");
        await waitForUser();

        stdout.write("Select 'Address Explorer' and press the 4 button on your COLDCARD.\r\n");
        await waitForUser();
        const root = HDNode.fromSeedBuffer(await mnemonicToSeed(words.join(" ")));
        let batchStart = 0;
        const batchLength = 10;
        const getBatch = (startIndex: number) => getAddresses(root, "m/84'/0'/0'/0", startIndex, batchLength);

        let batch = getBatch(batchStart);
        const [[, firstAddress]] = batch;
        stdout.write(`Select '${firstAddress.slice(0, 8)}-${firstAddress.slice(-7)}' on your COLDCARD.\r\n`);
        await waitForUser();
        stdout.write("You can now verify as many addresses as you like and abort whenever you're\r\n");
        stdout.write("comfortable:\r\n");

        // eslint-disable-next-line no-constant-condition
        while (true) {
            stdout.write(`Addresses ${batchStart}..${batchStart + batchLength - 1}:\r\n`);
            stdout.write("\r\n");
            stdout.write(batch.reduce((p, [path, addr]) => `${p}${path} => ${addr}\r\n`, ""));
            stdout.write("\r\n");
            stdout.write("Press the 9 button on your COLDCARD.\r\n");
            // eslint-disable-next-line no-await-in-loop
            await waitForUser();
            batchStart += batchLength;
            batch = getBatch(batchStart);
        }
    } catch (ex: unknown) {
        if (ex instanceof AbortError) {
            return 0;
        }

        console.error(ex);

        return 1;
    } finally {
        stdout.write("\r\n\r\n");
        stdout.write("CAUTION: If you've set up your COLDCARD with a seed please clear it now by first\r\n");
        stdout.write("going back to the main menu (press the X button as many times as necessary) and\r\n");
        stdout.write("then selecting 'Advanced', 'Danger Zone', 'Seed Functions', 'Destroy Seed'.\r\n");
    }
};

// The catch should never be reached (because we handle all errors in main). If it is, we let the whole thing fail.
main().then((exitCode) => (process.exitCode = exitCode)).catch(() => (process.exitCode = 1));
