// https://github.com/andreashuber69/verify-coldcard-dice-seed#--
import { expect } from "chai";
import Mocha from "mocha";

import fetch from "node-fetch";
import { calculateBip39Mnemonic } from "./calculateBip39Mnemonic";

const addPassingTest = (suite: Mocha.Suite, entropy: string, words: string) => suite.addTest(
    new Mocha.Test(entropy, () => expect(calculateBip39Mnemonic(entropy).join(" ")).to.equal(words)),
);

const addFailingTest = (suite: Mocha.Suite, entropy: string, errorMessage: string) => suite.addTest(
    new Mocha.Test(entropy, () => expect(() => calculateBip39Mnemonic(entropy)).to.throw(RangeError, errorMessage)),
);

const execute = async () => {
    const mocha = new Mocha();
    const suite = Mocha.Suite.create(mocha.suite, "calculateBip39Mnemonic");

    const response = await fetch("https://raw.githubusercontent.com/trezor/python-mnemonic/master/vectors.json");

    if (!response.ok) {
        throw new Error("Unexpected response");
    }

    const vectors = JSON.parse(await response.text()) as Record<string, unknown>;

    if (!("english" in vectors) || !(vectors.english instanceof Array)) {
        throw new Error("Unexpected response");
    }

    for (const vector of vectors.english) {
        if (!(vector instanceof Array) || (vector.length < 2) ||
            (typeof vector[0] !== "string") || (typeof vector[1] !== "string")) {
            throw new Error("Unexpected response");
        }

        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const [entropy, words] = vector;
        addPassingTest(suite, entropy, words);
    }

    addPassingTest(suite, "", "");
    addPassingTest(suite, "00000000", "abandon abandon ability");
    addPassingTest(suite, "ffffffff", "zoo zoo zoo");
    addFailingTest(suite, "3", "hexEntropy length must be a multiple of 8");
    addFailingTest(suite, "777777777", "hexEntropy length must be a multiple of 8");

    const suiteRun = mocha.run();
    process.on("exit", () => process.exit(suiteRun.stats?.failures ?? 0));
};

execute().catch((error) => void console.error(`${error}`));
