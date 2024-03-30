// https://github.com/andreashuber69/verify-coldcard-dice-seed/blob/develop/README.md#----verify-coldcard-dice-seed
import { useEffect, useState } from "preact/hooks";
import { getAddressesForMnemonicAndPassphrase } from "./getAddressesForMnemonicAndPassphrase.js";

export interface GetAddressesParams {
    readonly mnemonic: readonly string[];
    readonly passphrase: string;
    readonly accountRootPath: string;
}

export const Addresses = ({ mnemonic, passphrase, accountRootPath }: GetAddressesParams) => {
    const [addresses, setAddresses] = useState<ReadonlyArray<readonly [string, string]>>([]);

    useEffect(
        () => {
            const doIt = async () => setAddresses(
                await getAddressesForMnemonicAndPassphrase(mnemonic, passphrase, accountRootPath),
            );

            void doIt();
        },
        [mnemonic, passphrase, accountRootPath],
    );

    return (
      <div className="monospace">
        {addresses.map(([p, a]) => <div key={p} className="grid"><span>{`${p} => ${a}`}</span></div>)}
      </div>
    );
};
