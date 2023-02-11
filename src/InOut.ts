// https://github.com/andreashuber69/verify-coldcard-dice-seed/blob/develop/README.md#----verify-coldcard-dice-seed
type InNames = "once" | "pause" | "resume";

export type GenericIn<T extends keyof NodeJS.ReadStream> = Pick<NodeJS.ReadStream, T>;

export type GenericOut<T extends keyof NodeJS.WriteStream> = Pick<NodeJS.WriteStream, T>;

export interface GenericInOut<T, U> {
    readonly stdin: T;
    readonly stdout: U;
}

export type In = GenericIn<InNames>;

export type InOut = GenericInOut<GenericIn<InNames>, GenericOut<"write">>;

export type InMovableOut = GenericInOut<GenericIn<InNames>, GenericOut<"moveCursor" | "write">>;
