import { defineConfig } from "vite";
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import wasm from "vite-plugin-wasm";

const config = defineConfig({
    plugins: [
        wasm(),
        nodePolyfills()
    ],
    build: {
        target: "esnext",
        outDir: "site",
    },
});

// eslint-disable-next-line import/no-default-export
export default config;
