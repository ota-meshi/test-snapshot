import path from "path";
import type {} from "chai";
import type { SnapshotTester } from "./common.mts";
import { setupSnapshotTester } from "./common.mts";
let tester: SnapshotTester | null = null;

/**
 * Get snapshot tester
 */
export function getSnapshotTester(): SnapshotTester {
  return (tester ??= setupSnapshotTester({
    listenEachTest: (cb) => {
      beforeEach(function () {
        // eslint-disable-next-line no-invalid-this -- Mocha.Test
        const test = this.currentTest!;
        const parsed = path.parse(test.file!);
        const file = path.join(
          parsed.dir,
          "__snapshots__",
          `${parsed.name + parsed.ext}.snap`,
        );
        const titleKeys = [test.title];
        let parent = test.parent;
        while (parent) {
          if (parent.title) titleKeys.unshift(parent.title);
          parent = parent.parent;
        }
        const title = titleKeys.join(" ");
        cb({ file, title });
      });
    },
    listenFinish: (cb) => after(() => cb()),
  }));
}
