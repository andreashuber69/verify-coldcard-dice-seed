import { getKey } from "./getKey";
import type { IStdStreams } from "./IStdStreams";

export const waitForUser = async ({ stdin, stdout }: IStdStreams, prompt?: string) => {
    stdout.write(prompt ?? "Press any key to continue or CTRL-C to abort: ");
    const key = await getKey(stdin);
    stdout.write("\r\n\r\n");

    return key;
};
