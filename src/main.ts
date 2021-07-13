import { ReadStream } from "tty";
import sha256 from "crypto-js/sha256";
import { calculateBip39Mnemonic } from "./calculateBip39Mnemonic";

const getKey = async (stdin: ReadStream) => await new Promise<string>((resolve) => {
    stdin.resume();

    stdin.once("data", (key: unknown) => {
        resolve(`${key}`);
        stdin.pause();
    });
});

enum Command {
    Process,
    Ignore,
    Abort,
    Finish,
}

interface IState {
    readonly rolls: number;
    readonly input: string;
    readonly command: Command;
}

const getCommand = (key: string) => {
    switch (key) {
        case "1":
        case "2":
        case "3":
        case "4":
        case "5":
        case "6":
            return Command.Process;
        case "\u0003":
            return Command.Abort;
        case "\r":
            return Command.Finish;
        default:
            return Command.Ignore;
    }
};

const processKey = async (stdin: NodeJS.ReadStream, state: IState): Promise<IState> => {
    const { rolls, input } = state;
    process.stdout.write(`${rolls} rolls\r\n`);
    process.stdout.write(`${sha256(input)}\r\n\r\n`);
    const key = await getKey(stdin);
    const command = getCommand(key);

    if (command === Command.Process) {
        return {
            rolls: rolls + 1,
            input: input + key,
            command,
        };
    }

    return { ...state, command };
};

const main = async () => {
    try {
        const { stdin, stdout } = process;

        if (stdin instanceof ReadStream) {
            stdin.setRawMode(true);
            stdin.setEncoding("utf-8");
            stdout.write("\r\n\r\nPress 1-6 for each roll to mix in.\r\n");
            let state: IState = { rolls: 0, input: "", command: Command.Ignore };

            while ((state.command !== Command.Abort) && (state.command !== Command.Finish)) {
                stdout.moveCursor(0, -3);
                // eslint-disable-next-line no-await-in-loop
                state = await processKey(stdin, state);
            }

            if (state.command === Command.Finish) {
                const words = calculateBip39Mnemonic(`${sha256(state.input)}`);
                stdout.write("\r\n24 words:\r\n");
                stdout.write(`${words.join("\r\n")}\r\n`);
            }
        }

        return 0;
    } catch (ex: unknown) {
        console.error(`${ex}`);

        return 1;
    }
};

// The catch should never be reached (because we handle all errors in main). If it does, we let the whole thing fail.
main().then((exitCode) => (process.exitCode = exitCode)).catch(() => (process.exitCode = 1));
