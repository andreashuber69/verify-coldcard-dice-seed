// https://github.com/andreashuber69/verify-coldcard-dice-seed#--
import { ReadStream } from "tty";
import sha256 from "crypto-js/sha256";
import { AbortError } from "./AbortError";
import { calculateBip39Mnemonic } from "./calculateBip39Mnemonic";

const getKey = async (stdin: ReadStream) => await new Promise<string>((resolve, reject) => {
    stdin.resume();

    stdin.once("data", (key: unknown) => {
        if (key === "\u0003") {
            reject(new AbortError());
        } else {
            resolve(`${key}`);
        }

        stdin.pause();
    });
});

const prompt = async (stdout: NodeJS.WriteStream, stdin: NodeJS.ReadStream) => {
    stdout.write("Press any key to continue or CTRL-C to abort: ");
    await getKey(stdin);
    stdout.write("\r\n\r\n");
};

enum Command {
    Process,
    Ignore,
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

const writeDestroySeedInstructions = (stdout: NodeJS.WriteStream) => {
    stdout.write("\r\n\r\n");
    stdout.write("CAUTION: If you've set up your COLDCARD with a seed please clear it now by\r\n");
    stdout.write("selecting 'Advanced', 'Danger Zone', 'Seed Functions', 'Destroy Seed'.\r\n");
};

const main = async () => {
    const { stdin, stdout } = process;

    try {
        if (stdin instanceof ReadStream) {
            stdin.pause();
            stdin.setRawMode(true);
            stdin.setEncoding("utf-8");

            stdout.write("Verify COLDCARD dice seed\r\n");
            stdout.write("\r\n");
            stdout.write("This application guides you through VERIFYING whether your COLDCARD correctly generates\r\n");
            stdout.write("24 word seeds from dice rolls.\r\n");
            stdout.write("CAUTION: The very point of a COLDCARD is that the 24 word seed of a real wallet is\r\n");
            stdout.write("NEVER entered outside of a coldcard.\r\n");
            stdout.write("So, once you have tested your COLDCARD successfully, you should then generate the\r\n");
            stdout.write("24 word seed for your real wallet on your COLDCARD only.\r\n\r\n");

            stdout.write("Log into your COLDCARD, select 'Import Existing', 'Dice Rolls'.\r\n");
            await prompt(stdout, stdin);
            stdout.write("To perform a realistic test you should enter exactly as many dice rolls as you will\r\n");
            stdout.write("enter for your real wallet. 99 rolls are recommended for maximum security.\r\n");
            stdout.write("\r\n\r\n\r\nPress 1-6 for each roll to mix in, ENTER to finish or CTRL-C to abort.\r\n");
            let state: IState = { rolls: 0, input: "", command: Command.Ignore };

            while (state.command !== Command.Finish) {
                stdout.moveCursor(0, -3);
                // eslint-disable-next-line no-await-in-loop
                state = await processKey(stdin, state);
            }

            if (state.command === Command.Finish) {
                const words = calculateBip39Mnemonic(`${sha256(state.input)}`);
                stdout.write("\r\n");
                stdout.write("Compare these 24 words to the ones calculated by your COLDCARD:\r\n");
                stdout.write(words.reduce((p, c, i) => `${p}${`0${i + 1}`.slice(-2)}: ${c}\r\n`, ""));

                stdout.write("\r\n");
                await prompt(stdout, stdin);
                stdout.write("Press the OK button ('\u2713') on your COLDCARD and answer the test questions.\r\n");
                await prompt(stdout, stdin);
                stdout.write("Select 'Advanced', 'MicroSD Card', 'Export Wallet', 'Generic JSON' on your\r\n");
                stdout.write("COLDCARD. Then press '\u2713', '0' '\u2713'.\r\n");
                stdout.write("Navigate back to the main menu by pressing 'X' multiple times.");
                stdout.write("Select 'Secure Logout' and power down your COLDCARD.");
                await prompt(stdout, stdin);
            }

            writeDestroySeedInstructions(stdout);
        }

        return 0;
    } catch (ex: unknown) {
        if (ex instanceof AbortError) {
            writeDestroySeedInstructions(stdout);

            return 0;
        }

        console.error(`${ex}`);

        return 1;
    }
};

// The catch should never be reached (because we handle all errors in main). If it does, we let the whole thing fail.
main().then((exitCode) => (process.exitCode = exitCode)).catch(() => (process.exitCode = 1));
