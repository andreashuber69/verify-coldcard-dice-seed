import { getKey } from "./getKey";

export const waitForUser = async (prompt?: string) => {
    const { stdin, stdout } = process;
    stdout.write(prompt ?? "Press any key to continue or CTRL-C to abort: ");
    const key = await getKey(stdin);
    stdout.write("\r\n\r\n");

    return key;
};
