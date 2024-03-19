import { Component } from "preact";

// eslint-disable-next-line react/prefer-stateless-function, react/require-optimization
export class Main extends Component {
    public render() {
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
                  <input id="generate-24-words" role="switch" type="checkbox" />
                  Generate 24 words (instead of the standard 12)
                </label>
                <br />
                <label htmlFor="dice-rolls">
                  Dice Rolls (1-6)
                  <input id="dice-rolls" pattern="[1-6]*" placeholder="31415..." type="text" required />
                </label>
                <label htmlFor="passphrase">
                  Passphrase
                  <input id="passphrase" type="text" />
                </label>
                <div id="rolls-count" className="monospace" />
                <div id="hash" className="monospace" />
              </form>
            </section>
            <section>
              <h2>Seed</h2>
              <div className="monospace">
                <div className="grid">
                  <span id="word01" /><span id="word02" /><span id="word03" /><span id="word04" />
                </div>
                <div className="grid">
                  <span id="word05" /><span id="word06" /><span id="word07" /><span id="word08" />
                </div>
                <div className="grid">
                  <span id="word09" /><span id="word10" /><span id="word11" /><span id="word12" />
                </div>
                <div className="grid">
                  <span id="word13" /><span id="word14" /><span id="word15" /><span id="word16" />
                </div>
                <div className="grid">
                  <span id="word17" /><span id="word18" /><span id="word19" /><span id="word20" />
                </div>
                <div className="grid">
                  <span id="word21" /><span id="word22" /><span id="word23" /><span id="word24" />
                </div>
              </div>
            </section>
            <section>
              <h2>Addresses</h2>
              <div id="addresses" className="monospace" />
            </section>
          </>
        );
    }
}
