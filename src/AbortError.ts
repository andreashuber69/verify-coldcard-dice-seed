// https://github.com/andreashuber69/verify-coldcard-dice-seed#--
export class AbortError extends Error {
    public constructor(message?: string) {
        super(message);

        // eslint-disable-next-line max-len
        // https://github.com/Microsoft/TypeScript-wiki/blob/master/Breaking-Changes.md#extending-built-ins-like-error-array-and-map-may-no-longer-work
        Object.setPrototypeOf(this, AbortError.prototype);
    }
}
