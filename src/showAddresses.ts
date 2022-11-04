// https://github.com/andreashuber69/verify-coldcard-dice-seed#--
import { BIP32Factory } from "bip32";
import { mnemonicToSeed } from "bip39";
// cSpell: ignore secp
// eslint-disable-next-line import/no-namespace
import * as ecc from "tiny-secp256k1";
import { getAddresses } from "./getAddresses";
import type { IInOut } from "./IInOut";
import { waitForUser } from "./waitForUser";

const bip32 = BIP32Factory(ecc);

export const showAddresses = async ({ stdin, stdout }: IInOut, words: readonly string[], passphrase: string) => {
    stdout.write("Select 'Address Explorer' and press the 4 button on your COLDCARD.\r\n");
    await waitForUser({ stdin, stdout });
    const root = bip32.fromSeed(await mnemonicToSeed(words.join(" "), passphrase));
    const batchLength = 10;
    const getBatch = (startIndex: number) => getAddresses(root, "m/84'/0'/0'/0", startIndex, batchLength);

    let batchStart = 0;
    let batch = getBatch(batchStart);
    const [[, firstAddress]] = batch;
    stdout.write(`Select '${firstAddress.slice(0, 8)}-${firstAddress.slice(-7)}' on your COLDCARD.\r\n`);
    await waitForUser({ stdin, stdout });
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
        // eslint-disable-next-line no-await-in-loop
        showNextBatch = await waitForUser({ stdin, stdout }, prompt) !== "p";
        batchStart += batchLength;
        batch = getBatch(batchStart);
    }

    stdout.write("On your COLDCARD, press the X button twice.\r\n");
};
