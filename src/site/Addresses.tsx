// https://github.com/andreashuber69/verify-coldcard-dice-seed/blob/develop/README.md#----verify-coldcard-dice-seed
import { useEffect, useState } from "preact/hooks";
import { getAddressesForMnemonicAndPassphrase } from "./getAddressesForMnemonicAndPassphrase.js";
import type { GetAddressesParams } from "./GetAddressesParams.js";

export const Addresses = (props: GetAddressesParams) => {
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
