// https://github.com/andreashuber69/verify-coldcard-dice-seed/blob/develop/README.md#----verify-coldcard-dice-seed
export interface GetAddressesParams {
    readonly mnemonic: readonly string[];
    readonly passphrase: string;
    readonly accountRootPath: string;
}
