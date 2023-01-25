// https://github.com/andreashuber69/verify-coldcard-dice-seed/blob/develop/README.md#----verify-coldcard-dice-seed
import type { InMovableOut } from "./InOut.js";
import { processKey } from "./processKey.js";
import { waitForUser } from "./waitForUser.js";

export const readDiceRolls = async ({ stdin, stdout }: InMovableOut) => {
    stdout.write("To perform a realistic test you should enter exactly as many dice rolls\r\n");
    stdout.write("as you will enter for your real wallet. 99 or more rolls are recommended\r\n");
    stdout.write("for maximum security. Roll the dice and enter the value on your COLDCARD\r\n");
    stdout.write("and here.\r\n");
    stdout.write("\r\n\r\n\r\n");
    stdout.write("Press 1-6 for each roll to mix in, ENTER to finish or CTRL-C to abort.\r\n");
    let rolls = "";
    let key = "";

    while (key !== "\r") {
        stdout.moveCursor(0, -3);
        // eslint-disable-next-line no-await-in-loop
        [rolls, key] = await processKey({ stdin, stdout }, rolls);
    }

    stdout.write("\r\n");
    const suffix = `${rolls.length < 99 ? " twice" : ""}`;
    stdout.write(`Press the OK button on your COLDCARD${suffix}.\r\n`);
    await waitForUser({ stdin, stdout });

    return rolls;
};
