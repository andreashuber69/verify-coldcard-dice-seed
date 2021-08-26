import { getKey } from "./getKey";
import { sha256 } from "./sha256";

export const processKey = async (input: string): Promise<[string, string]> => {
    const { stdin, stdout } = process;
    stdout.write(`${input.length} rolls\r\n`);
    stdout.write(`${sha256(Buffer.from(input))}\r\n\r\n`);
    const key = await getKey(stdin);

    return [`${input}${key >= "1" && key <= "6" ? key : ""}`, key];
};
