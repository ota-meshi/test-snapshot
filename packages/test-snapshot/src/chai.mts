import type {} from "chai";
import { getSnapshotTester } from "./mocha.mts";
import { formatValue } from "./common.mts";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace -- OK
  namespace Chai {
    interface Assertion {
      toMatchSnapshot(message?: string): Assertion;
    }
  }
}
export const chaiPlugin: Chai.ChaiPlugin = function (chai, utils) {
  const tester = getSnapshotTester();
  chai.Assertion.addMethod("toMatchSnapshot", function (message?: string) {
    const test = tester.test();
    test.markAsUsed();

    // eslint-disable-next-line no-invalid-this -- OK
    const value = utils.flag(this, "object");
    const snapshot = test.getSnapshot();
    if (snapshot == null) {
      test.saveSnapshot(value);
      return;
    }
    new chai.Assertion(formatValue(value)).to.be.equal(snapshot, message);
  });
};
