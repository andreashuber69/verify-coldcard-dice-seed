// https://github.com/andreashuber69/verify-coldcard-dice-seed/blob/develop/README.md#----verify-coldcard-dice-seed
import { getKey } from "./getKey.js";
import type { InOut } from "./InOut.js";
import { sha256 } from "./sha256.js";

export const processKey = async ({ stdin, stdout }: InOut, input: string): Promise<[string, string]> => {
    stdout.write(`${input.length} rolls\r\n`);
    stdout.write(`${sha256(Buffer.from(input))}\r\n`);
    const canFinish = input.length >= 99;
    stdout.write(`Press 1-6 for each roll to mix in${canFinish ? ", ENTER to finish" : ""} or CTRL-C to abort.\r\n`);
    const key = await getKey(stdin);
    return [`${input}${key >= "1" && key <= "6" ? key : ""}`, canFinish ? key : ""];
};
