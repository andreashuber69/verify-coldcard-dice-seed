import { BIP32Factory } from "bip32";
import { mnemonicToSeed } from "bip39";
import { useEffect, useState } from "preact/hooks";
// eslint-disable-next-line import/no-namespace
import * as ecc from "tiny-secp256k1";
import { getAddresses } from "../common/getAddresses.js";

interface AddressesProps {
    // False positive
    /* eslint-disable react/no-unused-prop-types */
    readonly mnemonic: readonly string[];
    readonly passphrase: string;
    readonly accountRootPath: string;
    /* eslint-enable react/no-unused-prop-types */
}

const bip32 = BIP32Factory(ecc);

const getAddressesForMnemonicAndPassphrase = async (
    { mnemonic, passphrase, accountRootPath }: AddressesProps,
): Promise<Array<[string, string]>> => (
    mnemonic.length > 0 ?
        getAddresses(bip32.fromSeed(await mnemonicToSeed(mnemonic.join(" "), passphrase)), accountRootPath, 0, 50) :
        []
);

export const Addresses = (props: AddressesProps) => {
    const [addresses, setAddresses] = useState<ReadonlyArray<readonly [string, string]>>([]);

    useEffect(() => {
        const doIt = async () => setAddresses(await getAddressesForMnemonicAndPassphrase(props));
        void doIt();
    }, [props]);

    return (
      <div className="monospace">
        {addresses.map(([p, a]) => <div key={p} className="grid"><span>{`${p} => ${a}`}</span></div>)}
      </div>
    );
};
