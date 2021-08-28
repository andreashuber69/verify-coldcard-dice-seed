import { getKey } from "./getKey";
import type { IStdStreams } from "./IStdStreams";
import { sha256 } from "./sha256";

export const processKey = async ({ stdin, stdout }: IStdStreams, input: string): Promise<[string, string]> => {
    stdout.write(`${input.length} rolls\r\n`);
    stdout.write(`${sha256(Buffer.from(input))}\r\n\r\n`);
    const key = await getKey(stdin);

    return [`${input}${key >= "1" && key <= "6" ? key : ""}`, key];
};
