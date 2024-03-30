// https://github.com/andreashuber69/verify-coldcard-dice-seed/blob/develop/README.md#----verify-coldcard-dice-seed
import { useEffect, useState } from "preact/hooks";
import { getAddressesForMnemonicAndPassphrase } from "./getAddressesForMnemonicAndPassphrase.js";

export const Addresses = (...args: Parameters<typeof getAddressesForMnemonicAndPassphrase>) => {
    const [addresses, setAddresses] = useState<ReadonlyArray<readonly [string, string]>>([]);

    useEffect(
        () => {
            const doIt = async () => setAddresses(await getAddressesForMnemonicAndPassphrase(...args));
            void doIt();
        },
        // False positive, rule is unable to deal with spreads
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [...args],
    );

    return (
      <div className="monospace">
        {addresses.map(([p, a]) => <div key={p} className="grid"><span>{`${p} => ${a}`}</span></div>)}
      </div>
    );
};
