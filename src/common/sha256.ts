// https://github.com/andreashuber69/verify-coldcard-dice-seed/blob/develop/README.md#----verify-coldcard-dice-seed
export const sha256 = async (buffer: Uint8Array) =>
    [...new Uint8Array(await globalThis.crypto.subtle.digest("SHA-256", buffer))].map(
        (n) => n.toString(16).padStart(2, "0"),
    ).join("");
