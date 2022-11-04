// https://github.com/andreashuber69/verify-coldcard-dice-seed#--
import { crypto } from "@bitgo/utxo-lib";
import { bech32 } from "bech32";
import type { BIP32Interface } from "bip32";

export const toBech32Address = (node: BIP32Interface) => {
    const hash160 = crypto.hash160(node.publicKey);
    const bech32Words = bech32.toWords(hash160);
    const words = new Uint8Array([0, ...bech32Words]);

    return bech32.encode("bc", words);
};
