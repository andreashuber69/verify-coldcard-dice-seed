import type { ReadStream } from "tty";

export interface IStdStreams {
    readonly stdin: ReadStream;
    readonly stdout: NodeJS.WriteStream;
}
