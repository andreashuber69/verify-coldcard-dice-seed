// https://github.com/andreashuber69/verify-coldcard-dice-seed#--
import { getKey } from "./getKey";
import type { IInOut } from "./IInOut";

export const waitForUser = async ({ stdin, stdout }: IInOut, prompt?: string) => {
    stdout.write(prompt ?? "Press any key to continue or CTRL-C to abort: ");
    const key = await getKey(stdin);
    stdout.write("\r\n\r\n");

    return key;
};
