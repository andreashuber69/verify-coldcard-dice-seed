// https://github.com/andreashuber69/kiss-worker/blob/develop/README.md

import { defineConfig } from "vite";

// eslint-disable-next-line import/no-default-export, import/no-anonymous-default-export
export default defineConfig({
    build: {
        lib: {
            entry: ["src/package/main.ts"],
            fileName: "main",
            formats: ["es"],
        },
        outDir: "dist",
        rollupOptions: {
            input: {
                main: "src/package/main.ts",
            },
        },
        ssr: true,
        target: "es2022",
    },
    publicDir: false,
});
