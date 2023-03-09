// https://github.com/andreashuber69/verify-coldcard-dice-seed/blob/develop/README.md#----verify-coldcard-dice-seed
type GenericOut<T extends keyof NodeJS.WriteStream> = Pick<NodeJS.WriteStream, T>;

export interface GenericInOut<T, U> {
    readonly stdin: T;
    readonly stdout: U;
}

export type In = Pick<NodeJS.ReadStream, "once" | "pause" | "resume">;

export type InOut = GenericInOut<In, GenericOut<"write">>;

export type InMovableOut = GenericInOut<In, GenericOut<"moveCursor" | "write">>;
