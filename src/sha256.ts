// https://github.com/andreashuber69/verify-coldcard-dice-seed#--
import { crypto } from "bitcoinjs-lib";

export const sha256 = (buffer: Buffer) => crypto.sha256(buffer).toString("hex");
