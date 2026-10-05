// https://github.com/andreashuber69/verify-coldcard-dice-seed/blob/develop/README.md#----verify-coldcard-dice-seed

import { exec as nodeExec } from "node:child_process";
import { promisify } from "node:util";
import { encoding } from "./encoding.js";

export const exec = async (command: string) => {
    // The alternative would add ~8 lines of code, hurting readability
    // eslint-disable-next-line @typescript-eslint/strict-void-return
    const { stdout, stderr } = await promisify(nodeExec)(command, encoding);
    console.log(stdout);
    console.error(stderr);
};
