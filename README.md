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
  <a href="https://github.com/andreashuber69/verify-coldcard-dice-seed/actions/workflows/ci.yml">
    <img src="https://github.com/andreashuber69/verify-coldcard-dice-seed/actions/workflows/ci.yml/badge.svg" alt="CI">
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

> NEW: If you don't need step by step instructions on how to use your COLDCARD, it's probably much easier to use the
> [web version](https://andreashuber69.github.io/verify-coldcard-dice-seed) of this application.

CAUTION: The very point of a COLDCARD is that the seed (usually expressed as a 12 word mnemonic) of a real wallet
**never** appears on any other device. You should therefore only use this application to verify the seed and address
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

     (if the above gives you an error, please enter `node -v` and check that your version is >=20.11)

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
  verify-coldcard-dice-seed@1.0.33
Ok to proceed? (y) y
*** Verify COLDCARD Dice Seed v1.0.33 ***
(tested with COLDCARD Mk4 firmware v5.3.1)

This application guides you through verifying that your COLDCARD
correctly derives seeds and addresses from dice rolls.

CAUTION: The very point of a COLDCARD is that the seed of a real wallet
is never entered outside of a coldcard. You should therefore only use
this application to verify the seed and address derivation of your
COLDCARD. Once you are convinced that your COLDCARD works correctly, you
should then generate the seed of your real wallet on your COLDCARD only.

Generate 24 instead of the standard 12 words [y, N]? 

Log into your COLDCARD, select 'New Seed Words', '12 Word Dice Roll'.
Press any key to continue or CTRL-C to abort: 

To perform a realistic test you should enter exactly as many dice rolls
as you will enter for your real wallet. 50 or more rolls are REQUIRED.
Roll the dice and enter the value on your COLDCARD and here.

50 rolls
ee72ae915a4e6ea7ccbeb8e5e5eecef29a1d0d90f053183726a424b6d3b07325
Press 1-6 for each roll to mix in, ENTER to finish or CTRL-C to abort.

Press the OK button on your COLDCARD.
Press any key to continue or CTRL-C to abort: 

Compare these words to the ones calculated by your COLDCARD:
01: unveil
02: nice
03: picture
04: region
05: tragic
06: fault
07: cream
08: strike
09: tourist
10: control
11: recipe
12: tourist

Press any key to continue or CTRL-C to abort: 

Press the OK button on your COLDCARD and answer the test questions.
Press any key to continue or CTRL-C to abort: 

Wallet passphrase (press Return for none): 

Select 'Address Explorer' and press the 4 button on your COLDCARD.
Press any key to continue or CTRL-C to abort: 

Select 'bc1q40-cgx54e' on your COLDCARD.
Press any key to continue or CTRL-C to abort: 

You can now verify as many addresses as you like and stop whenever
you're comfortable.
Addresses 0..9:

m/84'/0'/0'/0/0 => bc1q40jg305efx4r2h9nmp7zr25supg58vpzcgx54e
m/84'/0'/0'/0/1 => bc1qvzupcg5h8a50ys3jmz7c6m5kys2pjw2d504zwl
m/84'/0'/0'/0/2 => bc1q4wqeln27nquhxu7ttt5w2lcyfantg5xchrfdkt
m/84'/0'/0'/0/3 => bc1quy7f7ecjptkllq67g3fqzalskvrs6jhzrex3jp
m/84'/0'/0'/0/4 => bc1q2m7h929x890ueqj7kyd5069wr9re5fsl3ru0lk
m/84'/0'/0'/0/5 => bc1qgkmzsaq49l2vfacvn6vw0y9884y3f79gmq5upv
m/84'/0'/0'/0/6 => bc1qqyx6v85d0epv2p72wtx2ue490auk9n5e6gd9vr
m/84'/0'/0'/0/7 => bc1qwytmgyccuk7j2dm7eqwdm7agyjfzykzru5vytu
m/84'/0'/0'/0/8 => bc1qfys95c5ng2006e9dl7xmg0k25nv0jcs9n7zyyg
m/84'/0'/0'/0/9 => bc1qjkkfzctymaashfjj5qsp0z6wqkdq2ujg9dgg77

Press p for new passphrase, CTRL-C to stop or any other key to continue: 

Press the 9 button on your COLDCARD.
Addresses 10..19:

m/84'/0'/0'/0/10 => bc1q69nkp8qy536q5az9cf3v6wer4sd7fpsr8z353d
m/84'/0'/0'/0/11 => bc1q4mjk7v8zztrv4v7y8r9e274h6020cs6jvunlr8
m/84'/0'/0'/0/12 => bc1q5l9nwh08skpwzfyqxhulx7fr8dp34pgj4893re
m/84'/0'/0'/0/13 => bc1qlxzvyy0hjyksn4fun3rh842ujtxyesuv922lr0
m/84'/0'/0'/0/14 => bc1q0xvek0j04p2552xex30jxu9z8gqmssef3qexy7
m/84'/0'/0'/0/15 => bc1qkv4d3tfk09gh9rdp3tvj2jlv4kvnw5rdh5fv49
m/84'/0'/0'/0/16 => bc1qk75kp9wkmra02s707eshtxfdfz2yd4dk66eggl
m/84'/0'/0'/0/17 => bc1qh374unl8uk6xxv2za9tjs2xxmxkjw8lns3q46x
m/84'/0'/0'/0/18 => bc1qk2ghr7wwn9p7xy3mupezktq7kss5a6tr8k9hjs
m/84'/0'/0'/0/19 => bc1qtnn3s0xvflu7vzekffe2suy7a9sh4jamgffa79

Press p for new passphrase, CTRL-C to stop or any other key to continue: 

On your COLDCARD, press the X button twice.
Wallet passphrase (press Return for none): hello

On your COLDCARD, select 'Passphrase', press the OK button and enter the
same passphrase. Select 'APPLY', and press the OK button.
Press any key to continue or CTRL-C to abort: 

Select 'Address Explorer' and press the 4 button on your COLDCARD.
Press any key to continue or CTRL-C to abort: 

Select 'bc1qgy-e3n084' on your COLDCARD.
Press any key to continue or CTRL-C to abort: 

You can now verify as many addresses as you like and stop whenever
you're comfortable.
Addresses 0..9:

m/84'/0'/0'/0/0 => bc1qgydfzfvp95lctvf22y3lpd00hrerjck9e3n084
m/84'/0'/0'/0/1 => bc1qp6n25uyds6u8888fs6lkxdfxwv765gpml343v6
m/84'/0'/0'/0/2 => bc1qumpek4k8784qp3mtkx8wtftw53t6up2laj0aqq
m/84'/0'/0'/0/3 => bc1qnuavy9y4f8n9t3u4m2yujlql2vnq22ax4grl8r
m/84'/0'/0'/0/4 => bc1qawmtu24vq6axv4zdvxuknly035gu2w7z6u38xu
m/84'/0'/0'/0/5 => bc1qjfps2jts2klcad0vtlpq3wqmanxpxqkm73vxu4
m/84'/0'/0'/0/6 => bc1q8a8cagucue973srtepflfv7krv8dt2el0hn66x
m/84'/0'/0'/0/7 => bc1qr4ktljx86r79nd3jhqzyt4264mqn6z2pxwham5
m/84'/0'/0'/0/8 => bc1qczqtjlp6sgc0z2hkva9mqdap67p97t93900xk2
m/84'/0'/0'/0/9 => bc1q0azumqrfn8290f8535rhw95yqr5g74quh443kn

Press p for new passphrase, CTRL-C to stop or any other key to continue: 

CAUTION: If you've set up your COLDCARD with a seed please clear it now
by first going back to the main menu (press the X button as many times
as necessary) and then selecting 'Advanced/Tools', 'Danger Zone',
'Seed Functions', 'Destroy Seed'.
```
