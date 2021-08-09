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

This application guides you through verifying that your COLDCARD correctly derives seeds and addresses from dice rolls.

CAUTION: The very point of a COLDCARD is that the seed (usually expressed as a 24 word mnemonic) of a real wallet is
never entered outside of a coldcard. You should therefore only use this application to verify the seed and address
derivation of your COLDCARD. Once you are convinced that your COLDCARD works correctly, you should then generate the
seed of your real wallet on your COLDCARD only. Since the COLDCARD electronics has no way of knowing whether you're
verifying seed derivation or generating a real wallet, you can be reasonably sure that your real wallet was indeed
derived from the dice entropy you entered.

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

``` shell_session
$ npx verify-coldcard-dice-seed
Need to install the following packages:
  verify-coldcard-dice-seed
Ok to proceed? (y) 
Verify COLDCARD v4.1.2 dice seed

This application guides you through VERIFYING whether your COLDCARD correctly
generates 24 word seeds from dice rolls.

CAUTION: The very point of a COLDCARD is that the 24 word seed of a real wallet
is never entered outside of a coldcard. So, once you have tested your COLDCARD
successfully, you should then generate the 24 word seed for your real wallet on
your COLDCARD only.

Log into your COLDCARD, select 'Import Existing', 'Dice Rolls'.
Press any key to continue or CTRL-C to abort: 

To perform a realistic test you should enter exactly as many dice rolls as you
will enter for your real wallet. 99 or more rolls are recommended for maximum
security. Roll the dice and enter the value on your COLDCARD and here.

6 rolls
8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92
Press 1-6 for each roll to mix in, ENTER to finish or CTRL-C to abort.

Press the OK button on your COLDCARD twice.
Press any key to continue or CTRL-C to abort: 

Compare these 24 words to the ones calculated by your COLDCARD:
01: mirror
02: reject
03: rookie
04: talk
05: pudding
06: throw
07: happy
08: era
09: myth
10: already
11: payment
12: own
13: sentence
14: push
15: head
16: sting
17: video
18: explain
19: letter
20: bomb
21: casual
22: hotel
23: rather
24: garment

Press any key to continue or CTRL-C to abort: 

Press the OK button on your COLDCARD and answer the test questions.
Press any key to continue or CTRL-C to abort: 

Select 'Address Explorer' and press the 4 button on your COLDCARD.
Press any key to continue or CTRL-C to abort: 

Select 'bc1qh2ns-6nvprc4' on your COLDCARD.
Press any key to continue or CTRL-C to abort: 

You can now verify as many addresses as you like and abort whenever you're
comfortable:
Addresses 0..9:

m/84'/0'/0'/0/0 => bc1qh2nsjhtgknshf6mpsdm6rm3rtchvq836nvprc4
m/84'/0'/0'/0/1 => bc1qz0apv5phxqar45crmskrp9qcz050c5r2fr8g2r
m/84'/0'/0'/0/2 => bc1q5edhylv4eaqkdmpxvla224739v4jpykymct666
m/84'/0'/0'/0/3 => bc1qrmlczy4wdjduz5xmdyjpakhdvfjjg6gpfdkn9x
m/84'/0'/0'/0/4 => bc1qnp4fdnx0qtwd86t9tep4gf75smtfjyfh97t6qg
m/84'/0'/0'/0/5 => bc1qtwdpry0z2thx4n5zg38dqya3trlem53vreydy5
m/84'/0'/0'/0/6 => bc1qdtysrkjx0jfde8yckw60k9duz3hx7lcnd679ww
m/84'/0'/0'/0/7 => bc1qv8x3lgptf0mq0nzalzkmlkljg4q6jwt3gejjhn
m/84'/0'/0'/0/8 => bc1qp2wk2vkhnqh2utumhsznl0xfnqvscrw453yw3k
m/84'/0'/0'/0/9 => bc1quzclsfs88n9z56eqauganuz5m7pw2uhrkkl3y0

Press the 9 button on your COLDCARD.
Press any key to continue or CTRL-C to abort: 

Addresses 10..19:

m/84'/0'/0'/0/10 => bc1q7ya3xhxz490vaq9nl4wpretqpvf69w7r6nkztv
m/84'/0'/0'/0/11 => bc1qmhtta3yynxzvgtewjdgrj63vaf4zfr8mgu75g0
m/84'/0'/0'/0/12 => bc1quewmx3um8uxpc62cdkhy7jfm8xaftcl60fpjv3
m/84'/0'/0'/0/13 => bc1qpxhptvcj5ut28w2072hxedrj6ef7v29lfx9vc8
m/84'/0'/0'/0/14 => bc1q8nppjt789hh65rspmq78j6q0dr3a6x4v72marl
m/84'/0'/0'/0/15 => bc1qq29gx84plw3nr2dcfdw0k9kmkzw0wl98jkhvqh
m/84'/0'/0'/0/16 => bc1qlv9quqsztdv5ekz20ef49ugfz2cg78tltncw9v
m/84'/0'/0'/0/17 => bc1qq0pmh7c7khhc2va8fycwyhy0x48js5ffnctj9u
m/84'/0'/0'/0/18 => bc1qwckfgdesfyvtuxx290kr546xsakjqhz3j6kdjv
m/84'/0'/0'/0/19 => bc1q59m83tk3h7hyedtev9cvxxfe46xw58m7duwl67

Press the 9 button on your COLDCARD.
Press any key to continue or CTRL-C to abort: 

Addresses 20..29:

m/84'/0'/0'/0/20 => bc1qynjmhatgm7netr65ndu8z0ectmjqzkuexefm4t
m/84'/0'/0'/0/21 => bc1qyy2yk0xzwnw79z74qgnacsp3nwylwz2p5rew72
m/84'/0'/0'/0/22 => bc1qkf07el78e6k678dj28wewryk36nfs500u6ljq8
m/84'/0'/0'/0/23 => bc1qel4qv3zqk3euysfar78mwz03y44y9d5s52ueq9
m/84'/0'/0'/0/24 => bc1qyjxdsd4wg7lha36rj59cpvgr8naw0telc2kx6a
m/84'/0'/0'/0/25 => bc1qf0qalcnh0v85zzhpsk9a2vd4kdnxymrxanp9u2
m/84'/0'/0'/0/26 => bc1q983kra2akjgzlxd8xt802wurkxgadxugg85zcn
m/84'/0'/0'/0/27 => bc1qdw0euqp8wl45sdmj800kwk0v0gkzfqz24smddc
m/84'/0'/0'/0/28 => bc1qcftmn8asj2ncuafajc0z93ze40wad5ufm0942m
m/84'/0'/0'/0/29 => bc1qafs8fnvnv0ehn9la9p2j3w2ay6vztnxdfsxm6u

Press the 9 button on your COLDCARD.
Press any key to continue or CTRL-C to abort: 

CAUTION: If you've set up your COLDCARD with a seed please clear it now by first
going back to the main menu by pressing the X button as many times as necessary
and then selecting 'Advanced', 'Danger Zone', 'Seed Functions', 'Destroy Seed'.
```
