// https://www.npmjs.com/package/@preact/preset-vite

import { preact } from "@preact/preset-vite";
import type { Plugin } from "vite";
import { defineConfig } from "vite";
import { nodePolyfills } from "vite-plugin-node-polyfills";
import wasm from "vite-plugin-wasm";

const nodePolyfillsPlugin = nodePolyfills({ include: ["stream"] });
// eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
const wasmPlugin = (wasm as unknown as () => Plugin)();

// eslint-disable-next-line import/no-anonymous-default-export, import/no-default-export
export default defineConfig({
    plugins: [nodePolyfillsPlugin, ...preact(), wasmPlugin],
    worker: {
        format: "es",
        plugins: () => [nodePolyfillsPlugin, wasmPlugin],
    },
    base: "",
    build: {
        outDir: "github_pages",
        target: "es2022",
    },
});
