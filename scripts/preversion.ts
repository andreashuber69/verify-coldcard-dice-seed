import { writeFile } from "node:fs/promises";
import { version } from "../package.json";
import { encoding } from "./encoding.js";
import { exec } from "./exec.js";

await exec("git checkout develop");
await exec("git push");
await exec("git pull");
await writeFile("previousVersion.txt", version, encoding);
