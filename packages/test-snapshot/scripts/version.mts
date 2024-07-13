import fs from "fs";
import path from "path";
import { createRequire } from "module";
import { fileURLToPath } from "url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const require = createRequire(import.meta.url);
fs.writeFileSync(
  path.resolve(__dirname, "../src/version.mts"),
  `export const version = "${require("../package.json").version}";\n`,
);
