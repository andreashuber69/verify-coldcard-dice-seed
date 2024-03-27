// https://github.com/andreashuber69/verify-coldcard-dice-seed/blob/develop/README.md#----verify-coldcard-dice-seed
import assert from "node:assert";
import { describe, it } from "node:test";

import { PromiseQueue } from "./PromiseQueue.js";

const randomDelay = async (sequence: number[], result: number) => {
    await new Promise<void>((resolve) => setTimeout(resolve, Math.random() * 100));
    sequence.push(result);
    return result;
};

await describe(PromiseQueue.name, async () => {
    await it("should execute tasks in order", async () => {
        const queue = new PromiseQueue();
        const sequence = new Array<number>();

        const result = await Promise.all([
            queue.execute(async () => await randomDelay(sequence, 0)),
            queue.execute(async () => await randomDelay(sequence, 1)),
            queue.execute(async () => await randomDelay(sequence, 2)),
            queue.execute(async () => await randomDelay(sequence, 3)),
            queue.execute(async () => await randomDelay(sequence, 4)),
            queue.execute(async () => await randomDelay(sequence, 5)),
        ]);

        for (const [index, value] of result.entries()) {
            assert(index === value);
            assert(index === sequence[index]);
        }
    });
});
