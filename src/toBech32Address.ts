// https://github.com/andreashuber69/verify-coldcard-dice-seed#--
import type { HDNode } from "@bitgo/utxo-lib";
import { address, crypto, script } from "@bitgo/utxo-lib";

export const toBech32Address = (node: HDNode) =>
    address.fromOutputScript(script.witnessPubKeyHash.output.encode(crypto.hash160(node.getPublicKeyBuffer())));
