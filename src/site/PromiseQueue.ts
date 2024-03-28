// https://github.com/andreashuber69/verify-coldcard-dice-seed/blob/develop/README.md#----verify-coldcard-dice-seed
export class PromiseQueue {
    public async execute<T>(createAwaitable: () => Promise<T>) {
        const resultPromise = PromiseQueue.push(this.pendingPromise, createAwaitable);
        this.pendingPromise = resultPromise;

        try {
            return await resultPromise;
        } finally {
            if (resultPromise === this.pendingPromise) {
                // We only get here if this function has not been called again while we were waiting for
                // pendingPromise to settle. We therefore no longer need to hold on to pendingPromise.
                this.pendingPromise = undefined;
            }
        }
    }

    private static async push<T>(current: PromiseLike<unknown> | undefined, createNext: () => Promise<T>) {
        try {
            await current;
        } catch (error: unknown) {
            // Intentionally empty. If await current throws, the exception can be caught by the previous caller of
            // execute(). Here we simply need to wait for it to settle so that we can proceed to create the next
            // Promise.
            console.log(`${error}`);
        }

        return await createNext();
    }

    private pendingPromise: PromiseLike<unknown> | undefined;
}
