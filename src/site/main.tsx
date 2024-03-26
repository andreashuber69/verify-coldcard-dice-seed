// https://github.com/andreashuber69/verify-coldcard-dice-seed/blob/develop/README.md#----verify-coldcard-dice-seed
import { render } from "preact";
import type { Ref } from "preact/hooks";
import { useCallback, useEffect, useRef, useState } from "preact/hooks";
import { calculateEnglishBip39Mnemonic } from "../common/calculateEnglishBip39Mnemonic.js";
import { sha256 } from "../common/sha256.js";
import { Addresses } from "./Addresses.js";
import { WordLine } from "./WordLine.js";

const getMnemonic = async (generate24Words: boolean, isValid: boolean, hash: string) =>
    (isValid ? await calculateEnglishBip39Mnemonic(hash, generate24Words ? 24 : 12) : []);

const getCurrent = <T extends NonNullable<unknown>>(ref: Ref<T>) => {
    if (!ref.current) {
        throw new TypeError("ref.current is nullish.");
    }

    return ref.current;
};

const getKey = (index: number) => `${index}`;

const header = (
  <>
    <hgroup>
      <h1>Verify COLDCARD Dice Seed</h1>
      <p>
        <span>v1.0.31</span> (tested with COLDCARD Mk4 firmware v5.2.2)
      </p>
    </hgroup>
    <p>
      The COLDCARD manufacturer{" "}
      <a href="https://coldcardwallet.com/docs/verifying-dice-roll-math" rel="noreferrer" target="_blank">
        provides instructions
      </a> on how to verify dice seed derivation with a Python script. This site offers a more user-friendly way
      to do the same and goes one step further: It also allows you to verify the receive and change addresses
      derived from the seed. Step by step guidance for the COLDCARD is available through the{" "}
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
  </>
);

const Main = () => {
    const generate24WordsRef = useRef<HTMLInputElement>(null);
    const diceRollsRef = useRef<HTMLInputElement>(null);
    const passphraseRef = useRef<HTMLInputElement>(null);
    const accountRef = useRef<HTMLInputElement>(null);
    const [rollCount, setRollCount] = useState(0);
    const [hash, setHash] = useState("");
    const [passphrase, setPassphrase] = useState("");
    const [account, setAccount] = useState(0);
    const [mnemonic, setMnemonic] = useState<string[]>([]);

    const handleInputImpl = useCallback(async () => {
        const generate24Words = getCurrent(generate24WordsRef).checked;
        const diceRollsElement = getCurrent(diceRollsRef);
        diceRollsElement.minLength = generate24Words ? 99 : 50;
        const isValid = diceRollsElement.validity.valid;
        diceRollsElement.ariaInvalid = `${!isValid}`;
        const rolls = diceRollsElement.value;
        const newHash = await sha256(new TextEncoder().encode(rolls));
        const newMnemonic = await getMnemonic(generate24Words, isValid, newHash);
        setRollCount(rolls.length);
        setHash(newHash);
        setPassphrase(getCurrent(passphraseRef).value);
        setAccount(Number(getCurrent(accountRef).value));
        setMnemonic(newMnemonic);
    }, [generate24WordsRef, diceRollsRef]);

    const handleInput = useCallback(() => void handleInputImpl(), [handleInputImpl]);
    useEffect(handleInput, [handleInput]);

    const getAddressesSection = (change: boolean) => (
      <section>
        <h2>{change ? "Change" : "Receive"} Addresses</h2>
        <Addresses
          mnemonic={mnemonic} passphrase={passphrase} accountRootPath={`m/84'/0'/${account}'/${change ? 1 : 0}`} />
      </section>
    );

    return (
      <>
        <section>
          {header}
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
            <label htmlFor="account">
              Account Number
              <input ref={accountRef} id="account" type="number" min="0" value={account} onInput={handleInput} />
            </label>
          </form>
        </section>
        <section>
          <h2>Seed</h2>
          <div className="monospace">
            {mnemonic.map((_w, i, a) => (i % 4 === 0 ? <WordLine key={getKey(i)} index={i} words={a} /> : ""))}
          </div>
        </section>
        {getAddressesSection(false)}
        {getAddressesSection(true)}
      </>
    );
};

const mainElement = document.querySelector("#main");

if (!mainElement) {
    throw new Error("#main not found");
}

render(<Main />, mainElement);
