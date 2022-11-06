#!/usr/bin/env node
// https://github.com/andreashuber69/verify-coldcard-dice-seed#--
import { createRequire } from "module";
import { ReadStream } from "tty";
import { AbortError } from "./AbortError.js";
import { readDiceRolls } from "./readDiceRolls.js";
import { readPassphrase } from "./readPassphrase.js";
import { showAddresses } from "./showAddresses.js";
import { verifyWords } from "./verifyWords.js";
import { waitForUser } from "./waitForUser.js";

// Simple typescript alternatives to calling require below lead to the outDir containing the file package.json and the
// directory src with all the code. This is due to how the ts compiler automatically determines the rootDir from
// imports. There are alternatives to calling require, but these seem overly complicated:
// https://stackoverflow.com/questions/58172911/typescript-compiler-options-trying-to-get-flat-output-to-outdir
const { version } = createRequire(import.meta.url)("../package.json") as { readonly version: string };

const main = async () => {
    const { stdin, stdout } = process;

    try {
        if (!(stdin instanceof ReadStream)) {
            throw new Error("stdin is not an instance of tty.ReadStream");
        }

        stdin.pause();
        stdin.setRawMode(true);
        stdin.setEncoding("utf-8");

        stdout.write(`Verify COLDCARD Dice Seed v${version} (tested with COLDCARD firmware v4.1.2)\r\n`);
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
        const words = await verifyWords(process, await readDiceRolls(process));
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

            await showAddresses(process, words, currentPassphrase);
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
