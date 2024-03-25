import { BIP32Factory } from "bip32";
import { mnemonicToSeed } from "bip39";
// eslint-disable-next-line import/no-namespace
import * as ecc from "tiny-secp256k1";

const bip32 = BIP32Factory(ecc);

export const getRoot = async (mnemonic: string, passphrase: string) =>
    bip32.fromSeed(await mnemonicToSeed(mnemonic, passphrase));
