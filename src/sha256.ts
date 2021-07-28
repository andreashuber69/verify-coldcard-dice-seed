import { crypto } from "@bitgo/utxo-lib";

export const sha256 = (buffer: Buffer) => crypto.sha256(buffer).toString("hex");
