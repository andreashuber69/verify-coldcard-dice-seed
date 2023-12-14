<h1 align="center">
  <img
    width="128" alt="logo"
    src="https://raw.githubusercontent.com/andreashuber69/verify-coldcard-dice-seed/develop/doc/icon.svg?sanitize=true"><br>
  verify-coldcard-dice-seed
</h1>
<p align="center">
  <a href="https://www.npmjs.com/package/verify-coldcard-dice-seed">
    <img src="https://img.shields.io/npm/v/verify-coldcard-dice-seed" alt="NPM Version">
  </a>
  <a href="https://github.com/andreashuber69/verify-coldcard-dice-seed/releases">
    <img src="https://img.shields.io/github/release-date/andreashuber69/verify-coldcard-dice-seed.svg" alt="Release Date">
  </a>
  <a href="https://travis-ci.com/github/andreashuber69/verify-coldcard-dice-seed">
    <img src="https://travis-ci.com/andreashuber69/verify-coldcard-dice-seed.svg?branch=master" alt="Build">
  </a>
  <a href="https://github.com/andreashuber69/verify-coldcard-dice-seed/issues">
    <img src="https://img.shields.io/github/issues-raw/andreashuber69/verify-coldcard-dice-seed.svg" alt="Issues">
  </a>
  <a href="https://codeclimate.com/github/andreashuber69/verify-coldcard-dice-seed/maintainability">
    <img src="https://api.codeclimate.com/v1/badges/117c9f61c524756193a5/maintainability" alt="Maintainability">
  </a>
  <a href="https://coveralls.io/github/andreashuber69/verify-coldcard-dice-seed?branch=develop">
    <img src="https://coveralls.io/repos/github/andreashuber69/verify-coldcard-dice-seed/badge.svg?branch=develop" alt="Coverage">
  </a>
  <a href="https://github.com/andreashuber69/verify-coldcard-dice-seed/blob/develop/LICENSE">
    <img src="https://img.shields.io/github/license/andreashuber69/verify-coldcard-dice-seed.svg" alt="License">
  </a>
</p>

This application guides you through verifying that your COLDCARD correctly derives seeds and addresses from dice rolls.

CAUTION: The very point of a COLDCARD is that the seed (usually expressed as a 24 word mnemonic) of a real wallet is
never entered outside of a coldcard. You should therefore only use this application to verify the seed and address
derivation of your COLDCARD. Once you are convinced that your COLDCARD works correctly, you should then generate the
seed of your real wallet on your COLDCARD only. Since the COLDCARD electronics has no way of knowing whether you're
verifying seed derivation or generating a real wallet, you can be reasonably sure that your real wallet was indeed
derived from the dice entropy you entered.

## Prerequisites

This application is based on Node.js. You either need to have [Node.js](https://nodejs.org/en/download/) on your system,
**or** run it in a [Docker](https://docker.com) container, see below for details.

## Usage

1. Open a command line window (i.e. CMD on Windows, Terminal on Linux).
2. Enter one of the following commands (see [Prerequisites](#prerequisites) for more information):

   - Node.js is available:

     ``` bash
     npx verify-coldcard-dice-seed@latest
     ```

     (if the above gives you an error, please enter `node -v` and check that your version is >=14.18)

   - Docker is available:

     ``` bash
     docker run -it --rm node:lts-alpine npx verify-coldcard-dice-seed@latest
     ```

3. If necessary, press the Enter key to acknowledge that the package needs to be installed.

4. Follow the instructions in the command line window.

5. Optional: The application with all its dependencies occupies roughly 5MB on your hard drive. To reclaim that space,
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

The first point above is often overlooked and most users simply trust that the electronically generated entropy used to
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

## Sample Output

``` shell_session cSpell:disable
$ npx verify-coldcard-dice-seed@latest
Need to install the following packages:
  verify-coldcard-dice-seed@1.0.19
Ok to proceed? (y) y
*** Verify COLDCARD Dice Seed v1.0.19 ***
(tested with COLDCARD Mk4 firmware v5.1.2)

This application guides you through verifying that your COLDCARD
correctly derives seeds and addresses from dice rolls.

CAUTION: The very point of a COLDCARD is that the seed of a real wallet
is never entered outside of a coldcard. You should therefore only use
this application to verify the seed and address derivation of your
COLDCARD. Once you are convinced that your COLDCARD works correctly, you
should then generate the seed of your real wallet on your COLDCARD only.

Log into your COLDCARD, select 'New Seed Words', '24 Word Dice Roll'.
Press any key to continue or CTRL-C to abort: 

To perform a realistic test you should enter exactly as many dice rolls
as you will enter for your real wallet. 99 or more rolls are REQUIRED.
Roll the dice and enter the value on your COLDCARD and here.

99 rolls
5588d3630bd19f6375b7bd922457af34ea9c74f00807566a1cf808e445dc8c20
Press 1-6 for each roll to mix in, ENTER to finish or CTRL-C to abort.

Press the OK button on your COLDCARD.
Press any key to continue or CTRL-C to abort: 

Compare these 24 words to the ones calculated by your COLDCARD:
01: few
02: educate
03: sugar
04: bless
05: boring
06: random
07: strategy
08: waste
09: mutual
10: cargo
11: type
12: hawk
13: prefer
14: denial
15: scan
16: abstract
17: filter
18: extend
19: dignity
20: balcony
21: dust
22: unusual
23: correct
24: bubble

Press any key to continue or CTRL-C to abort: 

Press the OK button on your COLDCARD and answer the test questions.
Press any key to continue or CTRL-C to abort: 

Press the X button on your COLDCARD to keep NFC disabled.
Press any key to continue or CTRL-C to abort: 

Wallet passphrase (press Return for none): 

Select 'Address Explorer' and press the 4 button on your COLDCARD.
Press any key to continue or CTRL-C to abort: 

Select 'bc1qvjc0-nn3uyys' on your COLDCARD.
Press any key to continue or CTRL-C to abort: 

You can now verify as many addresses as you like and stop whenever
you're comfortable.
Addresses 0..9:

m/84'/0'/0'/0/0 => bc1qvjc0ndgk8ap8uy495enag3qtcl4lua6nn3uyys
m/84'/0'/0'/0/1 => bc1qwazuu4zpl9j2julxq4gv2s0d3y3tw3p9z4s79s
m/84'/0'/0'/0/2 => bc1qfzvrcl5ysvmdxyna8edke2vat75kdaaamhnna5
m/84'/0'/0'/0/3 => bc1qvt3rxz9dn2rvrfwzk89vpc38t4qzwxsn056wth
m/84'/0'/0'/0/4 => bc1qejkee38r525an3klzlz6pqvq78rcsjx4py5nz8
m/84'/0'/0'/0/5 => bc1qjws6tswmzn042y4f277d0nh9pqqawlalrymltg
m/84'/0'/0'/0/6 => bc1qfra5etle3vxpsw6c7vkvjmjuq6ujklzzh3ygp4
m/84'/0'/0'/0/7 => bc1qahk9jhdp4c9u6r43dfp20ge9ed7g5zjzeapc0r
m/84'/0'/0'/0/8 => bc1qqfath89pls4a897s2hjjn8ttydvq7jtkh0f9e0
m/84'/0'/0'/0/9 => bc1qpyf9jjtx8gyj8xq5az2svmgk6w4vkhm4vclyl0

Press p for new passphrase, CTRL-C to stop or any other key to continue: 

Press the 9 button on your COLDCARD.
Addresses 10..19:

m/84'/0'/0'/0/10 => bc1qyuz4ahvhalzv3pfqyp6r9d6exegsevm0qfy58y
m/84'/0'/0'/0/11 => bc1qjv6stx8l4gvqhwn3nra25ekgukgmkmr3lzrdxa
m/84'/0'/0'/0/12 => bc1qxkxqhs69h3xxfutc4xk4chmczx5eg20alargyn
m/84'/0'/0'/0/13 => bc1qsuux3gwhs2tzdw236qyupt3n5whlnd4yxdxv2r
m/84'/0'/0'/0/14 => bc1qt933vma6tk2kknhkwc47d5vq0yp08zsxhlks3u
m/84'/0'/0'/0/15 => bc1qxnjlujkzt5tn4xs9gl4cr6m4j76u7cwx6gezkk
m/84'/0'/0'/0/16 => bc1qr9ytvtyq85vdtjvs0qddzj5fm4cralyhs3t9mt
m/84'/0'/0'/0/17 => bc1qmmugyzl277ksjq6mc0ucn7mhmvtr64u3dzxgpd
m/84'/0'/0'/0/18 => bc1q3el0j40zt58yxqrzurlnj6k0u6skwa9q70yaha
m/84'/0'/0'/0/19 => bc1qvce0chqk9jds24kg943pqhkyscfu0r50ex7m0z

Press p for new passphrase, CTRL-C to stop or any other key to continue: 

On your COLDCARD, press the X button twice.
Wallet passphrase (press Return for none): hello

On your COLDCARD, select 'Passphrase', press the OK button and enter the
same passphrase. Select 'APPLY', and press the OK button.
Press any key to continue or CTRL-C to abort: 

Select 'Address Explorer' and press the 4 button on your COLDCARD.
Press any key to continue or CTRL-C to abort: 

Select 'bc1q7l4x-xkevtmd' on your COLDCARD.
Press any key to continue or CTRL-C to abort: 

You can now verify as many addresses as you like and stop whenever
you're comfortable.
Addresses 0..9:

m/84'/0'/0'/0/0 => bc1q7l4xx50meu9046hd6tv8t3spxy6n045xkevtmd
m/84'/0'/0'/0/1 => bc1qkycah2855gac7t0l2u5zzrf2ar32umehs0ehdj
m/84'/0'/0'/0/2 => bc1qvw85hkn8vxt9cnw2unzl5fu4a43a79k0nzlgyn
m/84'/0'/0'/0/3 => bc1qft3chtdus6khz5g8g5exu43xrazkaegjwhazpz
m/84'/0'/0'/0/4 => bc1qjt6hp7exp8l5y88hgm98t398t324luyjg8ts9t
m/84'/0'/0'/0/5 => bc1qdm9j0xag80fms07veh9gyuwjqjxanmvxask7lr
m/84'/0'/0'/0/6 => bc1qwyq0vhqz6tl0dqfntmra2750f9xu6nrzflgn3n
m/84'/0'/0'/0/7 => bc1qz4admgpfllplsh2quezud9xdkp6t7jzjg3ucuf
m/84'/0'/0'/0/8 => bc1q9emwn3tgzw5xp86wm6axn8lev9c2zlh0l4v8pu
m/84'/0'/0'/0/9 => bc1qtkwch7amd0c4nwshqcuh3haex62vxx4936rmyk

Press p for new passphrase, CTRL-C to stop or any other key to continue: 

CAUTION: If you've set up your COLDCARD with a seed please clear it now
by first going back to the main menu (press the X button as many times
as necessary) and then selecting 'Advanced/Tools', 'Danger Zone',
'Seed Functions', 'Destroy Seed'.
```
