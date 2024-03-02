
import { exec as nodeExec } from "node:child_process";
import { writeFile } from "node:fs/promises";
import { promisify } from "node:util";
import { version } from "./package.json";

const exec = async (command: string) => {
    const { stdout, stderr } = await promisify(nodeExec)(command, { encoding: "utf8" });
    console.log(stdout);
    console.error(stderr);
};

await exec("git checkout develop");
await exec("git push");
await exec("git pull");
await writeFile("previousVersion.txt", version, { encoding: "utf8" });
