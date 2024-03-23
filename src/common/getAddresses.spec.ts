// https://github.com/andreashuber69/verify-coldcard-dice-seed/blob/develop/README.md#----verify-coldcard-dice-seed
import assert from "node:assert";
import { describe, it } from "node:test";
import { BIP32Factory } from "bip32";
import { mnemonicToSeed } from "bip39";
// eslint-disable-next-line import/no-namespace
import * as ecc from "tiny-secp256k1";
import { getAddresses } from "./getAddresses.js";

const bip32 = BIP32Factory(ecc);

const getBatch = async (mnemonic: string, passphrase: string, accountRootPath: string, startIndex: number) =>
    getAddresses(bip32.fromSeed(await mnemonicToSeed(mnemonic, passphrase)), accountRootPath, startIndex);

const rootPath = "m/84'/0'/0'/0";
const getPath = (index: number) => `${rootPath}/${index}`;

const expectBatch = async (mnemonic: string, expected: readonly string[]) => {
    await it(
        mnemonic,
        async () => {
            const batch = await getBatch(mnemonic, "", rootPath, 0);

            for (const [index, [path, address]] of batch.entries()) {
                assert(path === getPath(index));
                assert(address === expected[index]);
            }
        },
    );
};

await describe(getAddresses.name, async () => {
    await describe("should calculate the expected addresses", async () => {
        // https://en.bitcoin.it/wiki/BIP_0084
        await expectBatch(
            "abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about",
            [
                /* cSpell:disable */
                "bc1qcr8te4kr609gcawutmrza0j4xv80jy8z306fyu",
                "bc1qnjg0jd8228aq7egyzacy8cys3knf9xvrerkf9g",
                "bc1qp59yckz4ae5c4efgw2s5wfyvrz0ala7rgvuz8z",
                "bc1qgl5vlg0zdl7yvprgxj9fevsc6q6x5dmcyk3cn3",
                "bc1qm97vqzgj934vnaq9s53ynkyf9dgr05rargr04n",
                "bc1qnpzzqjzet8gd5gl8l6gzhuc4s9xv0djt0rlu7a",
                "bc1qtet8q6cd5vqm0zjfcfm8mfsydju0a29ggqrmu9",
                "bc1qhxgzmkmwvrlwvlfn4qe57lx2qdfg8phycnsarn",
                "bc1qncdts3qm2guw3hjstun7dd6t3689qg4230jh2n",
                "bc1qgswpjzsqgrm2qkfkf9kzqpw6642ptrgzapvh9y",

                /* cSpell:enable */
            ],
        );

        await expectBatch(
            "unveil nice picture region tragic fault cream strike tourist control recipe tourist",
            [
                /* cSpell:disable */
                "bc1q40jg305efx4r2h9nmp7zr25supg58vpzcgx54e",
                "bc1qvzupcg5h8a50ys3jmz7c6m5kys2pjw2d504zwl",
                "bc1q4wqeln27nquhxu7ttt5w2lcyfantg5xchrfdkt",
                "bc1quy7f7ecjptkllq67g3fqzalskvrs6jhzrex3jp",
                "bc1q2m7h929x890ueqj7kyd5069wr9re5fsl3ru0lk",
                "bc1qgkmzsaq49l2vfacvn6vw0y9884y3f79gmq5upv",
                "bc1qqyx6v85d0epv2p72wtx2ue490auk9n5e6gd9vr",
                "bc1qwytmgyccuk7j2dm7eqwdm7agyjfzykzru5vytu",
                "bc1qfys95c5ng2006e9dl7xmg0k25nv0jcs9n7zyyg",
                "bc1qjkkfzctymaashfjj5qsp0z6wqkdq2ujg9dgg77",

                /* cSpell:enable */
            ],
        );
    });
});
