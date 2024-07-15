import { formatValue } from "./common.mts";
import { getSnapshotTester } from "./mocha.mts";
import assert from "assert";

const tester = getSnapshotTester();
export const expect = function (value: any): {
  toMatchSnapshot: () => void;
} {
  const test = tester.test();
  return {
    toMatchSnapshot: () => {
      test.markAsUsed();
      const snapshot = test.getSnapshot();
      if (snapshot == null) {
        test.saveSnapshot(value);
        return;
      }
      assert.deepStrictEqual(formatValue(value), snapshot);
    },
  };
};
