// https://github.com/andreashuber69/verify-coldcard-dice-seed/blob/develop/README.md#----verify-coldcard-dice-seed
import { getKey } from "./getKey.js";
import type { InOut } from "./InOut.js";

export const waitForUser = async ({ stdin, stdout }: InOut, prompt?: string) => {
    stdout.write(prompt ?? "Press any key to continue or CTRL-C to abort: ");
    const key = await getKey(stdin);
    stdout.write("\r\n\r\n");
    return key;
};
