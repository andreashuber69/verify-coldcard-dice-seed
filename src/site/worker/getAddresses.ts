// https://github.com/andreashuber69/verify-coldcard-dice-seed/blob/develop/README.md#----verify-coldcard-dice-seed
import { serveFunction } from "kiss-worker";
import { getAddressesForRoot } from "../../common/getAddressesForRoot.js";
import { getRoot } from "../../common/getRoot.js";

const getAddresses = async (
    mnemonic: readonly string[],
    passphrase: string,
    accountRootPath: string,
): Promise<Array<[string, string]>> =>
    getAddressesForRoot(await getRoot(mnemonic.join(" "), passphrase), accountRootPath, 0, 50);

serveFunction(getAddresses);

// eslint-disable-next-line @typescript-eslint/no-use-before-define
export type { getAddresses };
