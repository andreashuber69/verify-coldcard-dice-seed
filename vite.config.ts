import type { Plugin } from "vite";
import { defineConfig } from "vite";
import { nodePolyfills } from "vite-plugin-node-polyfills";
import wasm from "vite-plugin-wasm";

const config = defineConfig({
    plugins: [
        (wasm as unknown as () => Plugin)(),
        nodePolyfills(),
    ],
    build: {
        target: "esnext",
        outDir: "github_pages",
    },
});

// eslint-disable-next-line import/no-default-export
export default config;
