// https://github.com/andreashuber69/verify-coldcard-dice-seed/blob/develop/README.md#----verify-coldcard-dice-seed
export class PromiseQueue {
    public async execute<T>(createAwaitable: () => Promise<T>): Promise<T> {
        while (this.pending !== undefined) {
            // eslint-disable-next-line no-await-in-loop
            await this.pending;
        }

        const next = createAwaitable();
        this.pending = next;

        try {
            return await next;
        } finally {
            this.pending = undefined;
        }
    }

    private pending: PromiseLike<unknown> | undefined;
}
