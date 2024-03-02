
import { exec as nodeExec } from "node:child_process";
import { readFile, rm, writeFile } from "node:fs/promises";
import { promisify } from "node:util";
import { version } from "./package.json";

const encoding = { encoding: "utf8" } as const;

const exec = async (command: string) => {
    const { stdout, stderr } = await promisify(nodeExec)(command, encoding);
    console.log(stdout);
    console.error(stderr);
};

const previousVersionFilename = "previousVersion.txt";
const previousVersion = await readFile(previousVersionFilename, encoding);
await rm(previousVersionFilename);

const indexFilename = "index.html";
const index = await readFile(indexFilename, encoding);
const newIndex = index.replaceAll(`<span>v${previousVersion}</span>`, `<span>v${version}</span>`);
await writeFile(indexFilename, newIndex, encoding);

const readmeFilename = "README.md";
const readme = await readFile(readmeFilename, encoding);

const newReadme = readme.
    replaceAll(`verify-coldcard-dice-seed@${previousVersion}`, `verify-coldcard-dice-seed@${version}`).
    replaceAll(`Verify COLDCARD Dice Seed v${previousVersion}`, `Verify COLDCARD Dice Seed v${version}`);

await writeFile(readmeFilename, newReadme, encoding);
