// https://github.com/andreashuber69/verify-coldcard-dice-seed#--
import type { IInMovableOut } from "./IInOut";
import { processKey } from "./processKey";
import { waitForUser } from "./waitForUser";

export const readDiceRolls = async ({ stdin, stdout }: IInMovableOut) => {
    stdout.write("To perform a realistic test you should enter exactly as many dice rolls as you\r\n");
    stdout.write("will enter for your real wallet. 99 or more rolls are recommended for maximum\r\n");
    stdout.write("security. Roll the dice and enter the value on your COLDCARD and here.\r\n");
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
