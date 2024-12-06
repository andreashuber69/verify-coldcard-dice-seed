// https://github.com/andreashuber69/verify-coldcard-dice-seed/blob/develop/README.md#----verify-coldcard-dice-seed

import { writeFile } from "node:fs/promises";
import packageJson from "../package.json" with { type: "json" };
import { encoding } from "./encoding.js";
import { exec } from "./exec.js";

await exec("git checkout develop");
await exec("git push");
await exec("git pull");
await writeFile("previousVersion.txt", packageJson.version, encoding);
