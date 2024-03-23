// https://github.com/andreashuber69/verify-coldcard-dice-seed/blob/develop/README.md#----verify-coldcard-dice-seed
import { BIP32Factory } from "bip32";
import { mnemonicToSeed, wordlists } from "bip39";
import { render } from "preact";
import type { Ref } from "preact/hooks";
import { useCallback, useEffect, useRef, useState } from "preact/hooks";
// eslint-disable-next-line import/no-namespace
import * as ecc from "tiny-secp256k1";
import { calculateBip39Mnemonic } from "../common/calculateBip39Mnemonic.js";
import { getAddresses } from "../common/getAddresses.js";
import { sha256 } from "../common/sha256.js";
import { WordLine } from "./WordLine.js";

const wordlist = wordlists["english"];
const bip32 = BIP32Factory(ecc);

const calculate = async (generate24Words: boolean, rolls: string, isValid: boolean, passphrase: string) => {
    if (!wordlist) {
        throw new Error("Missing english wordlist.");
    }

    const newHash = await sha256(new TextEncoder().encode(rolls));
    let newMnemonic = new Array<string>();
    const newAddresses = new Array<readonly [string, string]>();

    if (isValid) {
        newMnemonic = await calculateBip39Mnemonic(newHash, generate24Words ? 24 : 12, wordlist);
        const root = bip32.fromSeed(await mnemonicToSeed(newMnemonic.join(" "), passphrase));

        for (let startIndex = 0; startIndex < 50; startIndex = newAddresses.length) {
            newAddresses.push(...getAddresses(root, "m/84'/0'/0'/0", startIndex));
        }
    }

    return { newHash, newMnemonic, newAddresses };
};

const getCurrent = <T extends NonNullable<unknown>>(ref: Ref<T>) => {
    if (!ref.current) {
        throw new TypeError("ref.current is nullish.");
    }

    return ref.current;
};

const getKey = (index: number) => `${index}`;

const Main = () => {
    const generate24WordsRef = useRef<HTMLInputElement>(null);
    const diceRollsRef = useRef<HTMLInputElement>(null);
    const passphraseRef = useRef<HTMLInputElement>(null);
    const [rollCount, setRollCount] = useState(0);
    const [hash, setHash] = useState("");
    const [mnemonic, setMnemonic] = useState<string[]>([]);
    const [addresses, setAddresses] = useState<Array<readonly [string, string]>>([]);

    const handleInputImpl = useCallback(async () => {
        const generate24Words = getCurrent(generate24WordsRef).checked;
        const diceRollsElement = getCurrent(diceRollsRef);
        const passphrase = getCurrent(passphraseRef).value;
        diceRollsElement.minLength = generate24Words ? 99 : 50;
        const isValid = diceRollsElement.validity.valid;
        diceRollsElement.ariaInvalid = `${!isValid}`;
        const rolls = diceRollsElement.value;
        const { newHash, newMnemonic, newAddresses } = await calculate(generate24Words, rolls, isValid, passphrase);
        setRollCount(rolls.length);
        setHash(newHash);
        setMnemonic(newMnemonic);
        setAddresses(newAddresses);
    }, [diceRollsRef, generate24WordsRef, passphraseRef]);

    const handleInput = useCallback(() => void handleInputImpl(), [handleInputImpl]);
    useEffect(handleInput, [handleInput]);

    return (
      <>
        <section>
          <hgroup>
            <h1>Verify COLDCARD Dice Seed</h1>
            <p>
              <span>v1.0.30</span>
            </p>
          </hgroup>
          <p>
            The COLDCARD manufacturer{" "}
            <a href="https://coldcardwallet.com/docs/verifying-dice-roll-math" rel="noreferrer" target="_blank">
              provides instructions
            </a> on how to verify dice seed derivation with a Python script. This site offers a
            user-friendlier way to do the same and goes one step further: It also allows you to verify the receive
            addresses derived from the seed. Step by step guidance for the COLDCARD is available through the{" "}
            <a href="https://www.npmjs.com/package/verify-coldcard-dice-seed" rel="noreferrer" target="_blank">
              verify-coldcard-dice-seed
            </a> Node.js application. See{" "}
            <a
              href="https://www.npmjs.com/package/verify-coldcard-dice-seed#motivation"
              rel="noreferrer" target="_blank">
              Motivation
            </a>
            {" "}for technical details.
          </p>
          <p>
            <mark>CAUTION: The very point of a COLDCARD is that the seed (usually expressed as a 12 word mnemonic)
              of a real wallet <b>never</b> appears on any other device. You should therefore only use this
              application to verify the seed and address derivation of your COLDCARD. Once you are convinced that
              your COLDCARD works correctly, you should then generate the seed of your real wallet on your COLDCARD
              only. Since the COLDCARD electronics has no way of knowing whether you&apos;re verifying seed
              derivation or generating a real wallet, you can be reasonably sure that your real wallet was indeed
              derived from the dice entropy you entered.
            </mark>
          </p>
          <br />
          <form>
            <label htmlFor="generate-24-words">
              <input
                ref={generate24WordsRef} id="generate-24-words" role="switch" type="checkbox"
                onInput={handleInput} />
              Generate 24 words (instead of the standard 12)
            </label>
            <br />
            <label htmlFor="dice-rolls">
              Dice Rolls (1-6)
              <input
                ref={diceRollsRef} id="dice-rolls" pattern="[1-6]*" placeholder="31415..." type="text"
                required onInput={handleInput} />
            </label>
            <div className="monospace">{`${rollCount} rolls`}</div>
            <div className="monospace">{hash}</div>
            <br />
            <label htmlFor="passphrase">
              Passphrase
              <input ref={passphraseRef} id="passphrase" type="text" onInput={handleInput} />
            </label>
          </form>
        </section>
        <section>
          <h2>Seed</h2>
          <div className="monospace">
            {mnemonic.map((_w, i, a) => (i % 4 === 0 ? <WordLine key={getKey(i)} index={i} words={a} /> : ""))}
          </div>
        </section>
        <section>
          <h2>Addresses</h2>
          <div className="monospace">
            {addresses.map(([p, a]) => <div key={p} className="grid"><span>{`${p} => ${a}`}</span></div>)}
          </div>
        </section>
      </>
    );
};

const mainElement = document.querySelector("#main");

if (!mainElement) {
    throw new Error("#main not found");
}

render(<Main />, mainElement);
