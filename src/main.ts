#!/usr/bin/env node
// https://github.com/andreashuber69/verify-coldcard-dice-seed#--
import { ReadStream } from "tty";
import { HDNode } from "@bitgo/utxo-lib";
import { mnemonicToSeed } from "bip39";
import { AbortError } from "./AbortError";
import { calculateBip39Mnemonic } from "./calculateBip39Mnemonic";
import { getAddresses } from "./getAddresses";
import { processKey } from "./processKey";
import { readPassphrase } from "./readPassphrase";
import { sha256 } from "./sha256";
import { waitForUser } from "./waitForUser";

const main = async () => {
    const { stdin, stdout } = process;

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
        await waitForUser(process);
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
            [input, key] = await processKey(process, input);
        }

        stdout.write("\r\n");
        const suffix = `${input.length < 99 ? " twice" : ""}`;
        stdout.write(`Press the OK button on your COLDCARD${suffix}.\r\n`);
        await waitForUser(process);

        const words = calculateBip39Mnemonic(sha256(Buffer.from(input)));
        stdout.write("Compare these 24 words to the ones calculated by your COLDCARD:\r\n");
        stdout.write(words.reduce((p, c, i) => `${p}${`0${i + 1}`.slice(-2)}: ${c}\r\n`, ""));
        stdout.write("\r\n");
        await waitForUser(process);
        stdout.write("Press the OK button on your COLDCARD and answer the test questions.\r\n");
        await waitForUser(process);
        let currentPassphrase = "";

        // eslint-disable-next-line no-constant-condition
        while (true) {
            /* eslint-disable no-await-in-loop */
            const newPassphrase = await readPassphrase(process);
            stdout.write("\r\n");

            if (newPassphrase !== currentPassphrase) {
                currentPassphrase = newPassphrase;
                stdout.write("On your COLDCARD, select 'Passphrase', press the OK button and enter the\r\n");
                stdout.write("same passphrase. Select 'APPLY', and press the OK button.\r\n");
                await waitForUser(process);
            }

            stdout.write("Select 'Address Explorer' and press the 4 button on your COLDCARD.\r\n");
            await waitForUser(process);
            const root = HDNode.fromSeedBuffer(await mnemonicToSeed(words.join(" "), currentPassphrase));
            const batchLength = 10;
            const getBatch = (startIndex: number) => getAddresses(root, "m/84'/0'/0'/0", startIndex, batchLength);

            let batchStart = 0;
            let batch = getBatch(batchStart);
            const [[, firstAddress]] = batch;
            stdout.write(`Select '${firstAddress.slice(0, 8)}-${firstAddress.slice(-7)}' on your COLDCARD.\r\n`);
            await waitForUser(process);
            stdout.write("You can now verify as many addresses as you like and abort whenever you're\r\n");
            stdout.write("comfortable.\r\n");
            let showNextBatch = true;

            while (showNextBatch) {
                stdout.write(`Addresses ${batchStart}..${batchStart + batchLength - 1}:\r\n`);
                stdout.write("\r\n");
                stdout.write(batch.reduce((p, [path, addr]) => `${p}${path} => ${addr}\r\n`, ""));
                stdout.write("\r\n");
                stdout.write("Press the 9 button on your COLDCARD.\r\n");
                const prompt = "Press p for a new passphrase, CTRL-C to abort or any other key to continue: ";
                showNextBatch = await waitForUser(process, prompt) !== "p";
                batchStart += batchLength;
                batch = getBatch(batchStart);
            }

            stdout.write("On your COLDCARD, press the X button twice.\r\n");
            /* eslint-enable no-await-in-loop */
        }
    } catch (ex: unknown) {
        if (ex instanceof AbortError) {
            return 0;
        }

        console.error(ex);

        return 1;
    } finally {
        stdout.write("\r\n\r\n");
        stdout.write("CAUTION: If you've set up your COLDCARD with a seed please clear it now by\r\n");
        stdout.write("first going back to the main menu (press the X button as many times as\r\n");
        stdout.write("necessary) and then selecting 'Advanced', 'Danger Zone', 'Seed Functions',\r\n");
        stdout.write("'Destroy Seed'.\r\n");
    }
};

// The catch should never be reached (because we handle all errors in main). If it is, we let the whole thing fail.
main().then((exitCode) => (process.exitCode = exitCode)).catch(() => (process.exitCode = 1));
