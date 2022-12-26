// https://github.com/andreashuber69/verify-coldcard-dice-seed#--
export class AbortError extends Error {
    public constructor(message?: string) {
        super(message);
        this.name = "AbortError";

        // https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-2.html#support-for-newtarget
        Object.setPrototypeOf(this, new.target.prototype);
    }
}
