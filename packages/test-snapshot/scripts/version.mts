import fs from "fs";
import path from "path";
import { createRequire } from "module";
import { fileURLToPath } from "url";
import { getNewVersion } from "./lib/changesets-util.mts";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const require = createRequire(import.meta.url);

let v: string = require("../package.json").version;
try {
  v = await getNewVersion();
} catch {
  // nop
}

fs.writeFileSync(
  path.resolve(__dirname, "../src/version.mts"),
  `export const version = "${v}";\n`,
);
