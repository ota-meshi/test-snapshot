import getReleasePlan from "@changesets/get-release-plan";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

/** Get new version string from changesets */
export async function getNewVersion(): Promise<string> {
  const releasePlan = await getReleasePlan(
    path.resolve(__dirname, "../../../.."),
  );

  return releasePlan.releases.find(({ name }) => name === "test-snapshot")!
    .newVersion;
}
