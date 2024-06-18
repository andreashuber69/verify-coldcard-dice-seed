// https://github.com/andreashuber69/verify-coldcard-dice-seed/blob/develop/README.md#----verify-coldcard-dice-seed
import { render } from "preact";
import { useCallback, useEffect, useRef, useState } from "preact/hooks";
import type { JSX } from "preact/jsx-dev-runtime";
import { calculateEnglishBip39Mnemonic } from "../common/calculateEnglishBip39Mnemonic.js";
import { sha256 } from "../common/sha256.js";
import { AddressSection } from "./AddressSection.js";
import { WordLine } from "./WordLine.js";

const header = (
  <>
    <hgroup>
      <h1>Verify COLDCARD Dice Seed</h1>
      <p>
        <span>v1.0.33</span> (tested with COLDCARD Mk4 firmware v5.2.2)
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

const getMnemonic = async (generate24Words: boolean, isValid: boolean, hash: string) =>
    (isValid ? await calculateEnglishBip39Mnemonic(hash, generate24Words ? 24 : 12) : []);

const useHandler = <Target extends EventTarget>(handler: (currentTarget: Target) => void) =>
    useCallback(({ currentTarget }: JSX.TargetedInputEvent<Target>) => handler(currentTarget), [handler]);

const getKey = (index: number) => `${index}`;

const Main = () => {
    const formRef = useRef<HTMLFormElement>(null);
    const [generate24Words, setGenerate24Words] = useState(false);
    const [diceRolls, setDiceRolls] = useState("");
    const [isValid, setIsValid] = useState(false);
    const [hash, setHash] = useState("");
    const [passphrase, setPassphrase] = useState("");
    const [account, setAccount] = useState(0);
    const [mnemonic, setMnemonic] = useState<string[]>([]);

    const handleInput = useCallback(async () => {
        const newIsValid = formRef?.current?.checkValidity() ?? false;
        setIsValid(newIsValid);
        const newHash = await sha256(new TextEncoder().encode(diceRolls));
        setHash(newHash);
        setMnemonic(await getMnemonic(generate24Words, newIsValid, newHash));
    }, [diceRolls, generate24Words]);

    useEffect(() => void handleInput(), [handleInput]);

    const handleGenerate24Words = useHandler(({ checked }: HTMLInputElement) => setGenerate24Words(checked));
    const handleDiceRolls = useHandler(({ value }: HTMLInputElement) => setDiceRolls(value));
    const handlePassphrase = useHandler(({ value }: HTMLInputElement) => setPassphrase(value));
    const handleAccount = useHandler(({ value }: HTMLInputElement) => setAccount(Number(value)));

    return (
      <>
        <section>
          {header}
          <form ref={formRef}>
            <label htmlFor="generate-24-words">
              <input id="generate-24-words" role="switch" type="checkbox" onInput={handleGenerate24Words} />
              Generate 24 words (instead of the standard 12)
            </label>
            <br />
            <label htmlFor="dice-rolls">
              Dice Rolls (1-6)
              <input
                id="dice-rolls" pattern="[1-6]*" minLength={generate24Words ? 99 : 50} placeholder="31415..."
                aria-invalid={!isValid} type="text" required onInput={handleDiceRolls} />
            </label>
            <div className="monospace">{`${diceRolls.length} rolls`}</div>
            <div className="monospace">{hash}</div>
            <br />
            <label htmlFor="passphrase">
              Passphrase
              <input id="passphrase" type="text" onInput={handlePassphrase} />
            </label>
            <label htmlFor="account">
              Account Number
              <input id="account" type="number" min="0" value={account} onInput={handleAccount} />
            </label>
          </form>
        </section>
        <section>
          <h2>Seed</h2>
          <div className="monospace">
            {mnemonic.map((_w, i, a) => (i % 4 === 0 ? <WordLine key={getKey(i)} index={i} words={a} /> : ""))}
          </div>
        </section>
        <AddressSection mnemonic={mnemonic} passphrase={passphrase} account={account} change={false} />
        <AddressSection mnemonic={mnemonic} passphrase={passphrase} account={account} change />
      </>
    );
};

const mainElement = document.querySelector("#main");

if (!mainElement) {
    throw new Error("#main not found");
}

render(<Main />, mainElement);
