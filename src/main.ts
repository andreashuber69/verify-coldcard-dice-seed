// https://github.com/andreashuber69/verify-coldcard-dice-seed#--
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

    try {
        if (!(stdin instanceof ReadStream)) {
            throw new Error("stdin is not an instance of tty.ReadStream");
        }

        stdin.pause();
        stdin.setRawMode(true);
        stdin.setEncoding("utf-8");

        stdout.write("Verify COLDCARD dice seed\r\n");
        stdout.write("\r\n");
        stdout.write("This application guides you through VERIFYING whether your COLDCARD correctly generates\r\n");
        stdout.write("24 word seeds from dice rolls.\r\n");
        stdout.write("CAUTION: The very point of a COLDCARD is that the 24 word seed of a real wallet is\r\n");
        stdout.write("NEVER entered outside of a coldcard.\r\n");
        stdout.write("So, once you have tested your COLDCARD successfully, you should then generate the\r\n");
        stdout.write("24 word seed for your real wallet on your COLDCARD only.\r\n\r\n");

        stdout.write("Log into your COLDCARD, select 'Import Existing', 'Dice Rolls'.\r\n");
        await waitForUser();
        stdout.write("To perform a realistic test you should enter exactly as many dice rolls as you will\r\n");
        stdout.write("enter for your real wallet. 99 or more rolls are recommended for maximum security.\r\n");
        stdout.write("Roll the dice and enter the value on your COLDCARD and here.\r\n");
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
        stdout.write(`Press the \u2713 button on your COLDCARD${suffix}.\r\n`);
        await waitForUser();

        const words = calculateBip39Mnemonic(sha256(Buffer.from(input)));
        stdout.write("Compare these 24 words to the ones calculated by your COLDCARD:\r\n");
        stdout.write(words.reduce((p, c, i) => `${p}${`0${i + 1}`.slice(-2)}: ${c}\r\n`, ""));
        stdout.write("\r\n");
        await waitForUser();
        stdout.write("Press the \u2713 button on your COLDCARD and answer the test questions.\r\n");
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
        stdout.write("You can now verify as many addresses as you like and abort whenever you're comfortable:\r\n");

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
        if (!(ex instanceof AbortError)) {
            console.error(ex);

            return 1;
        }

        return 0;
    } finally {
        stdout.write("\r\n\r\n");
        stdout.write("CAUTION: If you've set up your COLDCARD with a seed please clear it now by\r\n");
        stdout.write("first going back to the main menu by pressing the X button as many times as necessary\r\n");
        stdout.write("and then selecting 'Advanced', 'Danger Zone', 'Seed Functions', 'Destroy Seed'.\r\n");
    }
};

// The catch should never be reached (because we handle all errors in main). If it is, we let the whole thing fail.
main().then((exitCode) => (process.exitCode = exitCode)).catch(() => (process.exitCode = 1));
