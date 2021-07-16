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

        stdout.write("Verify COLDCARD dice seed\r\n");
        stdout.write("\r\n");
        stdout.write("This application allows you to CHECK whether your COLDCARD correctly generates 24 word\r\n");
        stdout.write("seeds from dice rolls.\r\n");
        stdout.write("CAUTION: The very point of a COLDCARD is that the 24 word seed of a real wallet is NEVER\r\n");
        stdout.write("entered outside of a coldcard.\r\n");
        stdout.write("So, once you have tested your COLDCARD successfully, you should then generate the\r\n");
        stdout.write("24 word seed for your real wallet on your COLDCARD only.\r\n\r\n");

        if (stdin instanceof ReadStream) {
            stdin.setRawMode(true);
            stdin.setEncoding("utf-8");
            stdout.write("\r\n\r\nPress 1-6 for each roll to mix in, ENTER to finish or CTRL-C to abort.\r\n");
            let state: IState = { rolls: 0, input: "", command: Command.Ignore };

            while ((state.command !== Command.Abort) && (state.command !== Command.Finish)) {
                stdout.moveCursor(0, -3);
                // eslint-disable-next-line no-await-in-loop
                state = await processKey(stdin, state);
            }

            if (state.command === Command.Finish) {
                const words = calculateBip39Mnemonic(`${sha256(state.input)}`);
                stdout.write("\r\nCompare these 24 words to the ones calculated by your COLDCARD:\r\n");
                stdout.write(words.reduce((p, c, i) => `${p}${`0${i + 1}`.slice(-2)}: ${c}\r\n`, ""));
            }

            stdout.write("\r\n");
            stdout.write("IMPORTANT: Press the cancel button (X) on your COLDCARD now.\r\n");
        }

        return 0;
    } catch (ex: unknown) {
        console.error(`${ex}`);

        return 1;
    }
};

// The catch should never be reached (because we handle all errors in main). If it does, we let the whole thing fail.
main().then((exitCode) => (process.exitCode = exitCode)).catch(() => (process.exitCode = 1));
