// https://github.com/andreashuber69/verify-coldcard-dice-seed/blob/develop/README.md#----verify-coldcard-dice-seed
import { bech32 } from "bech32";
import type { BIP32Interface } from "bip32";
import { crypto } from "bitcoinjs-lib";

export const toBech32Address = ({ publicKey }: BIP32Interface) =>
    bech32.encode("bc", new Uint8Array([0, ...bech32.toWords(crypto.hash160(publicKey))]));
