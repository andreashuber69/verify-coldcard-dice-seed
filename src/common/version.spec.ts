// https://github.com/andreashuber69/verify-coldcard-dice-seed/blob/develop/README.md#----verify-coldcard-dice-seed

import { describe, expect, it } from "vitest";

import { version } from "./version.js";

describe("version", () => {
    it("should be a non-empty string", () => {
        expect(typeof version === "string" && version.length > 0);
    });
});
