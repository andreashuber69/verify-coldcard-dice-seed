// https://github.com/andreashuber69/verify-coldcard-dice-seed/blob/develop/README.md#----verify-coldcard-dice-seed
import { BIP32Factory } from "bip32";
import { mnemonicToSeed, wordlists } from "bip39";
import { Component, render } from "preact";
import type { Ref } from "preact/hooks";
import { useRef } from "preact/hooks";
// eslint-disable-next-line import/no-namespace
import * as ecc from "tiny-secp256k1";
import { calculateBip39Mnemonic } from "./calculateBip39Mnemonic.js";
import { getAddresses } from "./getAddresses.js";
import { getElement } from "./getElement.js";
import { sha256 } from "./sha256.js";

interface Props {
    readonly generate24WordsRef: Ref<HTMLInputElement>;
    readonly diceRollsRef: Ref<HTMLInputElement>;
    readonly passphraseRef: Ref<HTMLInputElement>;
}

interface ViewModel {
    rollCount: number;
    hash: string;
    mnemonic: string[];
    addresses: Array<readonly [string, string]>;
}

interface MnemonicProps {
    readonly index: number;
    readonly words: string[];
}

const Word = function({ index, words }: MnemonicProps) {
    return <span>{`${`${index + 1}`.padStart(2, "0")}: ${words[index]}`}</span>;
};

const WordLine = function(props: MnemonicProps) {
    const props1 = { ...props, index: props.index + 1 };
    const props2 = { ...props, index: props.index + 2 };
    const props3 = { ...props, index: props.index + 3 };
    return <div className="grid"><Word {...props} /><Word {...props1} /><Word {...props2} /><Word {...props3} /></div>;
};

class Main extends Component<Props, ViewModel> {
    public constructor() {
        super();
        this.state = { rollCount: 0, hash: "", mnemonic: [], addresses: [] };
        const wordlist = wordlists["english"];

        if (!wordlist) {
            throw new Error("Missing english wordlist.");
        }

        this.wordlist = wordlist;
    }

    public override render() {
        const { generate24WordsRef, diceRollsRef, passphraseRef } = this.props;
        const { rollCount, hash, mnemonic, addresses } = this.state;

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
                    ref={generate24WordsRef} id="generate-24-words" role="switch" type="checkbox"
                    onInput={this.handleInput} />
                  Generate 24 words (instead of the standard 12)
                </label>
                <br />
                <label htmlFor="dice-rolls">
                  Dice Rolls (1-6)
                  <input
                    ref={diceRollsRef} id="dice-rolls" pattern="[1-6]*" placeholder="31415..." type="text"
                    required onInput={this.handleInput} />
                </label>
                <label htmlFor="passphrase">
                  Passphrase
                  <input ref={passphraseRef} id="passphrase" type="text" onInput={this.handleInput} />
                </label>
                <div className="monospace">{`${rollCount} rolls`}</div>
                <div className="monospace">{hash}</div>
              </form>
            </section>
            <section>
              <h2>Seed</h2>
              <div className="monospace">
                {mnemonic.map((_w, i, a) => (i % 4 === 0 ? <WordLine key={this.getKey()} index={i} words={a} /> : ""))}
              </div>
            </section>
            <section>
              <h2>Addresses</h2>
              <div className="monospace">
                {addresses.map(([p, a]) => <span key={p}>{p}{" => "}{a}<br /></span>)}
              </div>
            </section>
          </>
        );
    }

    public override componentDidMount() {
        this.handleInput();
    }

    private static readonly bip32 = BIP32Factory(ecc);

    private static getElement<T>(ref: Ref<T> | undefined) {
        if (!ref?.current) {
            throw new TypeError("ref.current is nullish.");
        }

        return ref.current;
    }

    private readonly wordlist: readonly string[];
    private currentKey = 0;

    private readonly handleInput = () => void this.handleInputImpl();

    private getKey() {
        return this.currentKey++;
    }

    private async handleInputImpl() {
        const { generate24WordsRef, diceRollsRef, passphraseRef } = this.props;

        const generate24WordsElement = Main.getElement(generate24WordsRef);
        const diceRollsElement = Main.getElement(diceRollsRef);
        diceRollsElement.minLength = generate24WordsElement.checked ? 99 : 50;
        diceRollsElement.ariaInvalid = `${!diceRollsElement.validity.valid}`;
        const rolls = diceRollsElement.value;
        const hash = await sha256(new TextEncoder().encode(rolls));

        // eslint-disable-next-line react/no-set-state
        this.setState({ rollCount: rolls.length, hash });

        if (diceRollsElement.ariaInvalid === "true") {
            // eslint-disable-next-line react/no-set-state
            this.setState({ mnemonic: [], addresses: [] });
        } else {
            const wordCount = generate24WordsElement.checked ? 24 : 12;
            const mnemonic = await calculateBip39Mnemonic(hash, wordCount, this.wordlist);
            const passphraseElement = Main.getElement(passphraseRef).value;
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

const withHooks = <T extends Component<Props, ViewModel>>(BaseComponentCtor: new () => T) => function WithHooks() {
    const props = {
        generate24WordsRef: useRef<HTMLInputElement>(null),
        diceRollsRef: useRef<HTMLInputElement>(null),
        passphraseRef: useRef<HTMLInputElement>(null),
    };

    return (<BaseComponentCtor {...props} />);
};

const MainWithHooks = withHooks(Main);
render(<MainWithHooks />, getElement(HTMLElement, "#main"));
