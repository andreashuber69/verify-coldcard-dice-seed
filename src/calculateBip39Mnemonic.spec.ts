import { expect } from "chai";
import Mocha from "mocha";

import fetch from "node-fetch";
import { calculateBip39Mnemonic } from "./calculateBip39Mnemonic";

const execute = async () => {
    const response = await fetch("https://raw.githubusercontent.com/trezor/python-mnemonic/master/vectors.json");

    if (!response.ok) {
        throw new Error("Unexpected response");
    }

    const vectors = JSON.parse(await response.text()) as Record<string, unknown>;

    if (!("english" in vectors) || !(vectors.english instanceof Array)) {
        throw new Error("Unexpected response");
    }

    const mochaInstance = new Mocha();
    const suiteInstance = Mocha.Suite.create(mochaInstance.suite, "calculateBip39Mnemonic");

    for (const vector of vectors.english) {
        if (!(vector instanceof Array) || (vector.length < 2) ||
            (typeof vector[0] !== "string") || (typeof vector[1] !== "string")) {
            throw new Error("Unexpected response");
        }

        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const [entropy, words] = vector;

        suiteInstance.addTest(
            new Mocha.Test(entropy, () => {
                expect(calculateBip39Mnemonic(entropy).join(" ")).to.equal(words);
            }),
        );
    }

    const suiteRun = mochaInstance.run();
    process.on("exit", () => process.exit(suiteRun.stats?.failures ?? 0));
};

execute().catch((error) => void console.error(`${error}`));
