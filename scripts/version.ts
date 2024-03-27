// https://github.com/andreashuber69/verify-coldcard-dice-seed/blob/develop/README.md#----verify-coldcard-dice-seed
import { readFile, rm, writeFile } from "node:fs/promises";
import { version } from "../package.json";
import { encoding } from "./encoding.js";
import { exec } from "./exec.js";

const previousVersionFilename = "previousVersion.txt";
const previousVersion = await readFile(previousVersionFilename, encoding);
await rm(previousVersionFilename);

const indexFilename = "src/site/main.tsx";
const index = await readFile(indexFilename, encoding);
const newIndex = index.replaceAll(`<span>v${previousVersion}</span>`, `<span>v${version}</span>`);
await writeFile(indexFilename, newIndex, encoding);

const readmeFilename = "README.md";
const readme = await readFile(readmeFilename, encoding);

const newReadme = readme.
    replaceAll(`verify-coldcard-dice-seed@${previousVersion}`, `verify-coldcard-dice-seed@${version}`).
    replaceAll(`Verify COLDCARD Dice Seed v${previousVersion}`, `Verify COLDCARD Dice Seed v${version}`);

await writeFile(readmeFilename, newReadme, encoding);

// The command `npm version` modifies package.json & package-lock.json before calling this script. At this point, we
// therefore have 4 modified files. Since `git flow release start` does not work with uncommitted changes, we first
// need to stash the changes and pop them afterwards.
await exec("git stash push");
await exec(`git flow release start v${version}`);
await exec("git stash pop");
