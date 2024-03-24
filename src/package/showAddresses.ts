// https://github.com/andreashuber69/verify-coldcard-dice-seed/blob/develop/README.md#----verify-coldcard-dice-seed
import { BIP32Factory } from "bip32";
import { mnemonicToSeed } from "bip39";
// eslint-disable-next-line import/no-namespace
import * as ecc from "tiny-secp256k1";
import { getAddresses } from "../common/getAddresses.js";
import type { InOut } from "./InOut.js";
import { waitForUser } from "./waitForUser.js";

const bip32 = BIP32Factory(ecc);

export const showAddresses = async ({ stdin, stdout }: InOut, words: readonly string[], passphrase: string) => {
    stdout.write("Select 'Address Explorer' and press the 4 button on your COLDCARD.\r\n");
    await waitForUser({ stdin, stdout });
    const root = bip32.fromSeed(await mnemonicToSeed(words.join(" "), passphrase));
    const getBatch = (startIndex: number) => getAddresses(root, "m/84'/0'/0'/0", startIndex, 10);

    let batchStart = 0;
    let batch = getBatch(batchStart);
    const [[, firstAddress]] = batch;
    stdout.write(`Select '${firstAddress.slice(0, 6)}-${firstAddress.slice(-6)}' on your COLDCARD.\r\n`);
    await waitForUser({ stdin, stdout });
    stdout.write("You can now verify as many addresses as you like and stop whenever\r\n");
    stdout.write("you're comfortable.\r\n");
    let showNextBatch = true;

    while (showNextBatch) {
        if (batchStart > 0) {
            stdout.write("Press the 9 button on your COLDCARD.\r\n");
        }

        stdout.write(`Addresses ${batchStart}..${batchStart + batch.length - 1}:\r\n`);
        stdout.write("\r\n");
        stdout.write(batch.reduce((p, [path, addr]) => `${p}${path} => ${addr}\r\n`, ""));
        stdout.write("\r\n");
        const prompt = "Press p for new passphrase, CTRL-C to stop or any other key to continue: ";
        // eslint-disable-next-line no-await-in-loop
        showNextBatch = await waitForUser({ stdin, stdout }, prompt) !== "p";
        batchStart += batch.length;
        batch = getBatch(batchStart);
    }

    stdout.write("On your COLDCARD, press the X button twice.\r\n");
};
