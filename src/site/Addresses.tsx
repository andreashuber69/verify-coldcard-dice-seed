import { useEffect, useState } from "preact/hooks";
import { getAddresses } from "../common/getAddresses.js";
import { getRoot } from "../common/getRoot.js";

interface AddressesProps {
    // False positive
    /* eslint-disable react/no-unused-prop-types */
    readonly mnemonic: readonly string[];
    readonly passphrase: string;
    readonly accountRootPath: string;
    /* eslint-enable react/no-unused-prop-types */
}

const getAddressesForMnemonicAndPassphrase = async (
    { mnemonic, passphrase, accountRootPath }: AddressesProps,
): Promise<Array<[string, string]>> => (
    mnemonic.length > 0 ? getAddresses(await getRoot(mnemonic.join(" "), passphrase), accountRootPath, 0, 50) : []
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
