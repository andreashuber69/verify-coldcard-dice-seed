/* eslint-disable react/jsx-no-bind */
/* eslint-disable @typescript-eslint/unbound-method */
import { BIP32Factory } from "bip32";
import { mnemonicToSeed, wordlists } from "bip39";
import { Component } from "preact";
import type { Ref } from "preact/hooks";
import { useRef } from "preact/hooks";
// eslint-disable-next-line import/no-namespace
import * as ecc from "tiny-secp256k1";
import { calculateBip39Mnemonic } from "./calculateBip39Mnemonic.js";
import { getAddresses } from "./getAddresses.js";
import { sha256 } from "./sha256.js";

interface ViewModel {
    rollCount: number;
    hash: string;
    mnemonic: string[];
    addresses: Array<readonly [string, string]>;
}

// eslint-disable-next-line react/prefer-stateless-function, react/require-optimization
export class Main extends Component<Record<string, never>, ViewModel> {
    public constructor() {
        super();
        this.state = { rollCount: 0, hash: "", mnemonic: [], addresses: [] };
        const wordlist = wordlists["english"];

        if (!wordlist) {
            // cSpell: ignore wordlist
            throw new Error("Missing english wordlist.");
        }

        this.wordlist = wordlist;
    }

    public generate24WordsRef?: Ref<HTMLInputElement>;
    public diceRollsRef?: Ref<HTMLInputElement>;
    public passphraseRef?: Ref<HTMLInputElement>;

    public render() {
        const { rollCount, hash, mnemonic, addresses } = this.state;

        this.generate24WordsRef = useRef<HTMLInputElement>(null);
        this.diceRollsRef = useRef<HTMLInputElement>(null);
        this.passphraseRef = useRef<HTMLInputElement>(null);

        return (
          <>
            <section>
              <hgroup>
                <h1>Verify COLDCARD Dice Seed</h1>
                <p>
                  <span>v1.0.29</span>
                </p>
              </hgroup>
              <p>
                The COLDCARD manufacturer
                <a href="https://coldcardwallet.com/docs/verifying-dice-roll-math" rel="noreferrer" target="_blank">
                  provides instructions
                </a> on how to verify dice seed derivation with a Python script. This site offers a
                user-friendlier way to do the same and goes one step further: It also allows you to verify the receive
                addresses derived from the seed. Step by step guidance for the COLDCARD is available through the
                <a href="https://www.npmjs.com/package/verify-coldcard-dice-seed" rel="noreferrer" target="_blank">
                  verify-coldcard-dice-seed
                </a> Node.js application. See
                <a
                  href="https://www.npmjs.com/package/verify-coldcard-dice-seed#motivation"
                  rel="noreferrer" target="_blank">
                  Motivation
                </a>
                for technical details.
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
                    ref={this.generate24WordsRef} id="generate-24-words" role="switch" type="checkbox"
                    onInput={() => this.handleInput()} />
                  Generate 24 words (instead of the standard 12)
                </label>
                <br />
                <label htmlFor="dice-rolls">
                  Dice Rolls (1-6)
                  <input
                    ref={this.diceRollsRef} id="dice-rolls" pattern="[1-6]*"
                    minLength={this.generate24WordsRef.current?.checked ? 99 : 50} placeholder="31415..." type="text"
                    required onInput={this.handleInput} />
                </label>
                <label htmlFor="passphrase">
                  Passphrase
                  <input ref={this.passphraseRef} id="passphrase" type="text" onInput={this.handleInput} />
                </label>
                <div id="rolls-count" className="monospace">{`${rollCount} rolls`}</div>
                <div id="hash" className="monospace">{hash}</div>
              </form>
            </section>
            <section>
              <h2>Seed</h2>
              <div className="monospace">
                {mnemonic.map((w, i) => <span key={w}>{`${i + 1}`.padStart(2, "0")}{`: ${w}`}</span>)}
              </div>
            </section>
            <section>
              <h2>Addresses</h2>
              <div id="addresses" className="monospace">
                {addresses.map(([p, a]) => <span key={p}>{p}{" => "}{a}<br /></span>)}
              </div>
            </section>
          </>
        );
    }

    private static readonly bip32 = BIP32Factory(ecc);

    private static getElement<T>(ref: Ref<T> | undefined) {
        if (!ref?.current) {
            throw new TypeError("ref.current is nullish.");
        }

        return ref.current;
    }

    private readonly wordlist: readonly string[];
    private readonly handleInput = () => void this.handleInputImpl();

    private async handleInputImpl() {
        const diceRollsElement = Main.getElement(this.diceRollsRef);
        const rolls = diceRollsElement.value;
        const { tooShort, patternMismatch, valueMissing } = diceRollsElement.validity;
        diceRollsElement.ariaInvalid = `${tooShort || patternMismatch || valueMissing}`;
        const hash = await sha256(new TextEncoder().encode(rolls));

        // eslint-disable-next-line react/no-set-state
        this.setState({ rollCount: rolls.length, hash });

        if (diceRollsElement.ariaInvalid === "true") {
            // eslint-disable-next-line react/no-set-state
            this.setState({ addresses: [] });
        } else {
            const wordCount = Main.getElement(this.generate24WordsRef).checked ? 24 : 12;
            const mnemonic = await calculateBip39Mnemonic(hash, wordCount, this.wordlist);
            const passphraseElement = Main.getElement(this.passphraseRef).value;
            const root = Main.bip32.fromSeed(await mnemonicToSeed(mnemonic.join(" "), passphraseElement));
            const addresses = new Array<readonly [string, string]>();

            for (let startIndex = 0; startIndex < 50; startIndex = addresses.length) {
                addresses.push(...getAddresses(root, "m/84'/0'/0'/0", startIndex));
            }

            // eslint-disable-next-line react/no-set-state
            this.setState({ mnemonic, addresses });
        }
    }
}
