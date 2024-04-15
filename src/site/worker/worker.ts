// https://github.com/andreashuber69/verify-coldcard-dice-seed/blob/develop/README.md#----verify-coldcard-dice-seed
import { listen } from "kiss-worker";
import { getAddressesForMnemonicAndPassphraseImpl } from "./getAddressesForMnemonicAndPassphraseImpl.js";

listen(getAddressesForMnemonicAndPassphraseImpl);
