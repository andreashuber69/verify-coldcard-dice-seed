#!/usr/bin/env node
// https://github.com/andreashuber69/verify-coldcard-dice-seed/blob/develop/README.md#----verify-coldcard-dice-seed
import { createRequire } from "node:module";
import { ReadStream } from "node:tty";
import { AbortError } from "./AbortError.js";
import { readDiceRolls } from "./readDiceRolls.js";
import { readPassphrase } from "./readPassphrase.js";
import { showAddresses } from "./showAddresses.js";
import { verifyWords } from "./verifyWords.js";
import { waitForUser } from "./waitForUser.js";

const { stdin, stdout } = process;

try {
    // Simple typescript alternatives to calling require below lead to the outDir containing the file package.json and
    // the directory src with all the code. This is due to how the ts compiler automatically determines the rootDir from
    // imports. There are alternatives to calling require, but these seem overly complicated:
    // https://stackoverflow.com/questions/58172911/typescript-compiler-options-trying-to-get-flat-output-to-outdir
    const { version } = createRequire(import.meta.url)("../package.json") as { readonly version: string };

    if (!(stdin instanceof ReadStream)) {
        throw new TypeError("stdin is not an instance of tty.ReadStream");
    }

    stdin.pause();
    stdin.setRawMode(true);
    stdin.setEncoding("utf8");

    stdout.write(`*** Verify COLDCARD Dice Seed v${version} ***\r\n`);
    stdout.write("(tested with COLDCARD Mk4 firmware v5.2.0)\r\n");
    stdout.write("\r\n");
    stdout.write("This application guides you through verifying that your COLDCARD\r\n");
    stdout.write("correctly derives seeds and addresses from dice rolls.\r\n");
    stdout.write("\r\n");
    stdout.write("CAUTION: The very point of a COLDCARD is that the seed of a real wallet\r\n");
    stdout.write("is never entered outside of a coldcard. You should therefore only use\r\n");
    stdout.write("this application to verify the seed and address derivation of your\r\n");
    stdout.write("COLDCARD. Once you are convinced that your COLDCARD works correctly, you\r\n");
    stdout.write("should then generate the seed of your real wallet on your COLDCARD only.\r\n");
    stdout.write("\r\n");
    stdout.write("Log into your COLDCARD, select 'New Seed Words', '24 Word Dice Roll'.\r\n");
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
} catch (error: unknown) {
    if (!(error instanceof AbortError)) {
        console.error(error);
        process.exitCode = 1;
    }
} finally {
    stdout.write("\r\n\r\n");
    stdout.write("CAUTION: If you've set up your COLDCARD with a seed please clear it now\r\n");
    stdout.write("by first going back to the main menu (press the X button as many times\r\n");
    stdout.write("as necessary) and then selecting 'Advanced/Tools', 'Danger Zone',\r\n");
    stdout.write("'Seed Functions', 'Destroy Seed'.\r\n");
}
