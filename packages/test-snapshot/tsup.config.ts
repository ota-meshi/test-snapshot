import { defineConfig } from "tsup";

export default defineConfig([
  {
    clean: true,
    dts: true,
    entryPoints: ["src/index.mts", "src/chai.mts"],
    format: ["esm", "cjs"],
    outDir: "lib",
    target: "node18",
  },
]);
