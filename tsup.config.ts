import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    index: "src/index.ts",
    "id/index": "src/id/index.ts",
    "schema/index": "src/schema/index.ts",
    "user/index": "src/user/index.ts",
    "errors/index": "src/errors/index.ts",
  },
  format: ["cjs", "esm"],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  treeshake: true,
  minify: false,
  external: ["effect", "@effect/schema"],

  target: "es2022",
  platform: "neutral",

  banner: {
    js: "/* @tesserakit/core */",
  },

  onSuccess: async () => {
    console.log("Build completed successfully!");
  },
});
