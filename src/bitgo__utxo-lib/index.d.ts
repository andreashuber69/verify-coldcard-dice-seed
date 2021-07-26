// https://github.com/andreashuber69/verify-coldcard-dice-seed#--
// cSpell: disable
// eslint-disable-next-line import/unambiguous
declare module "@bitgo/utxo-lib" {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    export class HDNode {
        public static fromSeedBuffer(buffer: Buffer): HDNode;

        public derivePath(path: string): HDNode;
        public getAddress(): string;
    }
}
