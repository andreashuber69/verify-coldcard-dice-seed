import { useEffect, useState } from "preact/hooks";
import type { AddressesParams } from "./AddressesProps.js";
import { getAddressesForMnemonicAndPassphrase } from "./AddressesProps.js";

export const Addresses = (props: AddressesParams) => {
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
