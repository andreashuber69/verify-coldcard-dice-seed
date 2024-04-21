// https://github.com/andreashuber69/verify-coldcard-dice-seed/blob/develop/README.md#----verify-coldcard-dice-seed
import { useEffect, useState } from "preact/hooks";
import { getAddresses } from "./getAddresses.js";

interface AddressSectionProps {
    readonly mnemonic: readonly string[];
    readonly passphrase: string;
    readonly account: number;
    readonly change: boolean;
}

export const AddressSection = ({ mnemonic, passphrase, account, change }: AddressSectionProps) => {
    const [addresses, setAddresses] = useState<ReadonlyArray<readonly [string, string]>>([]);
    const accountRootPath = `m/84'/0'/${account}'/${change ? 1 : 0}`;

    useEffect(
        () => {
            const doIt = async () => setAddresses(
                await getAddresses(mnemonic, passphrase, accountRootPath),
            );

            void doIt();
        },
        [mnemonic, passphrase, accountRootPath],
    );

    return (
      <section>
        <h2>{change ? "Change" : "Receive"} Addresses</h2>
        <div className="monospace">
          {addresses.map(([p, a]) => <div key={p} className="grid"><span>{`${p} => ${a}`}</span></div>)}
        </div>
      </section>
    );
};
