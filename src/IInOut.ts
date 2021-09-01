// https://github.com/andreashuber69/verify-coldcard-dice-seed#--
type InNames = "once" | "pause" | "resume";

export type IGenericIn<T extends keyof NodeJS.ReadStream> = Pick<NodeJS.ReadStream, T>;
export type IGenericOut<T extends keyof NodeJS.WriteStream> = Pick<NodeJS.WriteStream, T>;

export interface IGenericInOut<T, U> {
    readonly stdin: T;
    readonly stdout: U;
}

export type IIn = IGenericIn<InNames>;
export type IInOut = IGenericInOut<IGenericIn<InNames>, IGenericOut<"write">>;
export type IInMovableOut = IGenericInOut<IGenericIn<InNames>, IGenericOut<"moveCursor" | "write">>;
