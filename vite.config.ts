// https://www.npmjs.com/package/@preact/preset-vite

import { preact } from "@preact/preset-vite";
import type { Plugin } from "vite";
import { defineConfig } from "vite";
import { nodePolyfills } from "vite-plugin-node-polyfills";
import wasm from "vite-plugin-wasm";

const config = defineConfig({
    plugins: [
        nodePolyfills(),
        ...preact(),
        // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
        (wasm as unknown as () => Plugin)(),
    ],
    worker: {
        format: "es",
        plugins: () => [
            nodePolyfills(),
            // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
            (wasm as unknown as () => Plugin)(),
        ],
    },
    base: "",
    build: {
        target: "es2022",
        outDir: "github_pages",
    },
});

// eslint-disable-next-line import/no-default-export
export default config;
