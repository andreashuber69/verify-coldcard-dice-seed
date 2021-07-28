// https://github.com/andreashuber69/verify-coldcard-dice-seed#--
// cSpell: disable
// eslint-disable-next-line import/unambiguous
declare module "@bitgo/utxo-lib" {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    export class HDNode {
        public static fromSeedBuffer(buffer: Buffer): HDNode;

        public getPublicKeyBuffer(): Buffer;
        public derive(index: number): HDNode;
        public derivePath(path: string): HDNode;
    }

    export namespace crypto {
        export function hash160(buffer: Buffer): Buffer;
        export function sha256(buffer: Buffer): Buffer;
    }

    export namespace script {
        export namespace witnessPubKeyHash {
            export namespace output {
                export function encode(pubKeyHash: Buffer): Buffer;
            }
        }
    }

    export namespace address {
        export function fromOutputScript(outputScript: Buffer): string;
    }
}
