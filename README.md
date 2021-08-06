<h1 align="center">
  <img width="128" src="https://raw.githubusercontent.com/andreashuber69/verify-coldcard-dice-seed/master/doc/icon.svg?sanitize=true">
</h1>
<p align="center">
  <a href="https://github.com/andreashuber69/verify-coldcard-dice-seed/releases/latest">
    <img src="https://img.shields.io/github/release/andreashuber69/verify-coldcard-dice-seed.svg" alt="Version">
  </a>
  <a href="https://github.com/andreashuber69/verify-coldcard-dice-seed/releases/latest">
    <img src="https://img.shields.io/github/release-date/andreashuber69/verify-coldcard-dice-seed.svg" alt="Release Date">
  </a>
  <a href="https://travis-ci.com/andreashuber69/verify-coldcard-dice-seed">
    <img src="https://travis-ci.com/andreashuber69/verify-coldcard-dice-seed.svg?branch=master" alt="Build">
  </a>
  <a href="https://github.com/andreashuber69/verify-coldcard-dice-seed/issues">
    <img src="https://img.shields.io/github/issues-raw/andreashuber69/verify-coldcard-dice-seed.svg" alt="Issues">
  </a>
  <a href="https://github.com/andreashuber69/verify-coldcard-dice-seed/blob/master/LICENSE">
    <img src="https://img.shields.io/github/license/andreashuber69/verify-coldcard-dice-seed.svg" alt="License">
  </a>
</p>

<h1 align="center">Verify COLDCARD Dice Seed</h1>

This application guides you through verifying that your COLDCARD correctly derives 24 word seeds and addresses from
dice rolls.

CAUTION: The very point of a COLDCARD is that the 24 word seed of a real wallet is never entered outside of a coldcard.
You should therefore only use this application to verify the seed and address derivation of your COLDCARD. Once you
are convinced that your COLDCARD works correctly, you should then generate the seed of your real wallet on your COLDCARD
only. Since the COLDCARD electronics has no way of knowing whether you're verifying seed derivation or generating a real
wallet, you can be reasonably sure that your real wallet was indeed derived from the dice entropy you entered.

## Installation

This application is based on Node.js. Please download and install the version for your operating system
[here](https://nodejs.org/en/download/).

## Usage

1. Open a command line window (i.e. CMD on Windows, Terminal on Linux) and enter the following command:

   ``` bash
   npx verify-coldcard-dice-seed
   ```

2. First time usage only: Press the Enter key to acknowledge that the package needs to be installed.

3. Follow the instructions in the command line window.

4. Optional: The application with all its dependencies occupies roughly 5MB on your hard drive. To reclaim that space,
   you can delete the npx cache (the following commands assume that you did not change the default locations):
   - Linux (& probably MacOS):

     ``` bash
     rm -rf ~/.npm/_npx
     ```

   - Windows:
     Two locations seem to be used (possibly depending on the npx version). The following command attempts to delete
     both. If just one was used on your system, you might see a `The system cannot find the file specified` message:

     ``` bash
     rmdir /q /s "%LocalAppData%\npm-cache\_npx" "%AppData%\npm-cache\_npx"
     ```

## Motivation

### Hardware Wallet Security

Due to a multitude of measures, hardware wallets are much more secure than any software wallet on a general purpose
device (e.g. laptop, tablet, phone) could ever be. However, HW wallets usually fail to provide an easy way to verify
whether they function as advertised. More specifically, hardware wallets can only provide the purported security, if at
least the following conditions are satisfied:

1. The seed of the hardware wallet is verifiably derived from truly random entropy.
2. Addresses are reproducibly generated from the seed.

### Why You Should Verify the Seed and Address Derivation of your HW Wallet

The first point is often overlooked and most users simply trust that the electronically generated entropy used to
derive the seed is truly random. Here are two reasons why such trust is misplaced:

- Most HW wallets use a hardware random number generator (HW RNG) as a source of entropy. HW RNGs are often used in
  security-critical applications (encrypted communication, digital signing, etc.). Companies mass-producing such
  hardware are thus prime targets for intelligence agency "nudging" or even downright infiltration.
- The HW wallet you ordered could have been interdicted and exchanged on its way to you. The one you got looks and
  works exactly like the original but is designed to steal your funds. It does so by only using say 30 bits of entropy
  and replacing the others with bits the attacker can calculate from the 30 bits. The seed words thus generated **look**
  random to you and would probably pass every [randomness test](https://en.wikipedia.org/wiki/Statistical_randomness)
  but the attacker can easily gain control over your funds by regularly checking the billion or so wallets that the 30
  random bits represent.

Therefore, if you want to be sure that your seed is derived from truly random entropy, your wallet must provide the
following features:

- Allow for the external supply of entropy
- Reproducibly generate the seed and addresses from the supplied entropy

The [COLDCARD](https://coldcardwallet.com) hardware wallet provides both features, as it allows the use of dice to
generate the entropy and documents how the seed is then derived from the entropy. As we've seen above, using dice rolls
only makes sense when you can verify that your COLDCARD indeed factors in all rolls into the entropy. This is why the
manufacturer [provides instructions](https://coldcardwallet.com/docs/verifying-dice-roll-math)
on how to verify dice seed derivation with a Python script. This application does the same but goes one step further: It
also allows you to verify the receive addresses derived from the seed. This covers the scenario where a malicious
COLDCARD copy correctly derives the seed but then generates addresses from a different seed, only known to the attacker.
