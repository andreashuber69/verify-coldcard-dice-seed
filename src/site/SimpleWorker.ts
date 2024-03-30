import { once } from "node:events";
import { PromiseQueue } from "./PromiseQueue.js";

export class SimpleWorker<T extends (...args: never[]) => unknown> {
    public constructor(private readonly worker: Worker) {}

    public async execute(...args: Parameters<T>) {
        return await this.queue.execute(
            async () => {
                // False positive
                // eslint-disable-next-line unicorn/require-post-message-target-origin
                this.worker.postMessage(args);
                return ((await once(this.worker, "message"))[0] as MessageEvent<Awaited<ReturnType<T>>>).data;
            },
        );
    }

    public terminate() {
        this.worker.terminate();
    }

    private readonly queue = new PromiseQueue();
}
