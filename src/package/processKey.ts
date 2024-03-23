// https://github.com/andreashuber69/verify-coldcard-dice-seed/blob/develop/README.md#----verify-coldcard-dice-seed
import { sha256 } from "../common/sha256.js";
import { getKey } from "./getKey.js";
import type { InOut } from "./InOut.js";

export const processKey = async ({ stdin, stdout }: InOut, input: string, requiredRolls: number) => {
    stdout.write(`${input.length} rolls\r\n`);
    stdout.write(`${await sha256(new TextEncoder().encode(input))}\r\n`);
    const canFinish = input.length >= requiredRolls;
    stdout.write(`Press 1-6 for each roll to mix in${canFinish ? ", ENTER to finish" : ""} or CTRL-C to abort.\r\n`);
    const key = await getKey(stdin);
    return [`${input}${key >= "1" && key <= "6" ? key : ""}`, canFinish ? key : ""] as const;
};
