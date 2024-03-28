// https://github.com/andreashuber69/verify-coldcard-dice-seed/blob/develop/README.md#----verify-coldcard-dice-seed
import assert from "node:assert";
import { describe, it } from "node:test";

import { PromiseQueue } from "./PromiseQueue.js";

const delay = async (sequence: number[], result: number) => {
    await new Promise<void>((resolve) => setTimeout(resolve, 100));
    sequence.push(result);
    return result;
};

const throwError = async (id: number) => {
    await new Promise<void>((resolve) => setTimeout(resolve, 10));
    throw new Error(`${id}`);
};

await describe(PromiseQueue.name, async () => {
    await it("should create and await awaitables in order", async () => {
        try {
            const queue = new PromiseQueue();
            const sequence = new Array<number>();
            const promises = new Array<Promise<number>>();

            promises.push(
                queue.execute(async () => await delay(sequence, 0)),
                queue.execute(async () => await delay(sequence, 1)),
                queue.execute(async () => await delay(sequence, 2)),
            );

            await new Promise((resolve) => setTimeout(resolve, 150));
            const id1 = Math.random() * 1000;
            const throwErrorPromise1 = queue.execute(async () => await throwError(id1));

            promises.push(
                queue.execute(async () => await delay(sequence, 3)),
                queue.execute(async () => await delay(sequence, 4)),
                queue.execute(async () => await delay(sequence, 5)),
            );

            try {
                await throwErrorPromise1;
            } catch (error: unknown) {
                assert(error instanceof Error && error.message === `${id1}`);
            }

            const id2 = Math.random() * 1000;

            try {
                await queue.execute(async () => await throwError(id2));
            } catch (error: unknown) {
                assert(error instanceof Error && error.message === `${id2}`);
            }

            for (const [index, value] of (await Promise.all(promises)).entries()) {
                assert(index === value);
                assert(index === sequence[index]);
            }
        } catch (error: unknown) {
            console.log(error);
        }
    });
});
