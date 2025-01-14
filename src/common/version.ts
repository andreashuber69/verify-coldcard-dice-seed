// https://github.com/andreashuber69/verify-coldcard-dice-seed/blob/develop/README.md#----verify-coldcard-dice-seed

// vite detects and converts dynamic imports such that the contents is bundled. This is desirable for the browser build
// but a bit unfortunate for the node build (since package.json is available in the package anyway). Given the
// comparatively small size increase, this is not worth further investigation.
export const { version } = (await import("../../package.json", { assert: { type: "json" } })).default;
