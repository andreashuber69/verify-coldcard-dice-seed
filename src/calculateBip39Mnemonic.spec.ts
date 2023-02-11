// https://github.com/andreashuber69/verify-coldcard-dice-seed/blob/develop/README.md#----verify-coldcard-dice-seed
import { wordlists } from "bip39";
import { expect } from "chai";
import Mocha from "mocha";
import fetch from "node-fetch";

import { calculateBip39Mnemonic } from "./calculateBip39Mnemonic.js";

const wordlist = wordlists["english"];

if (!wordlist) {
    // cSpell: ignore wordlist
    throw new Error("Missing english wordlist.");
}

const addPassingTest = (s: Mocha.Suite, entropy: string, words: string) => s.addTest(
    new Mocha.Test(entropy, () => expect(calculateBip39Mnemonic(entropy, wordlist).join(" ")).to.equal(words)),
);

const addFailingTest = (
    s: Mocha.Suite,
    entropy: string,
    newWordlist: readonly string[],
    errorMessage: string,
) => s.addTest(
    new Mocha.Test(
        entropy,
        () => expect(() => calculateBip39Mnemonic(entropy, newWordlist)).to.throw(RangeError, errorMessage),
    ),
);


const mocha = new Mocha();
const suite = Mocha.Suite.create(mocha.suite, "calculateBip39Mnemonic");

const response = await fetch("https://raw.githubusercontent.com/trezor/python-mnemonic/master/vectors.json");

if (!response.ok) {
    throw new Error("Unexpected response");
}

const vectors = JSON.parse(await response.text()) as Record<string, unknown>;

if (!("english" in vectors) || !Array.isArray(vectors["english"])) {
    throw new Error("Unexpected response");
}

for (const vector of vectors["english"]) {
    if (!Array.isArray(vector) || (vector.length < 2) ||
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
addFailingTest(suite, "3", wordlist, "hexEntropy length must be a multiple of 8");
addFailingTest(suite, "777777777", wordlist, "hexEntropy length must be a multiple of 8");
addFailingTest(suite, "ffffffff", wordlist.slice(1), "wordlist.length is invalid: 2047");
addFailingTest(suite, "ffffffff", wordlist.slice(1024), "wordlist.length is invalid: 1024");
const invalidWordlist = wordlist.slice(-1);
invalidWordlist.push("");
addFailingTest(suite, "ffffffff", invalidWordlist, "wordlist is invalid");

const suiteRun = mocha.run();
process.on("exit", () => process.exit(suiteRun.stats?.failures ?? 0));
