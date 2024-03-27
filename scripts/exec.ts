// https://github.com/andreashuber69/verify-coldcard-dice-seed/blob/develop/README.md#----verify-coldcard-dice-seed
import { exec as nodeExec } from "node:child_process";
import { promisify } from "node:util";
import { encoding } from "./encoding.js";

export const exec = async (command: string) => {
    const { stdout, stderr } = await promisify(nodeExec)(command, encoding);
    console.log(stdout);
    console.error(stderr);
};
