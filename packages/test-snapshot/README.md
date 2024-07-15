# test-snapshot

A snapshot testing library similar to [jest-snapshot].

## 🚀 Features

- Simple to use.
- Supports [mocha].
- Snapshot format similar to [jest-snapshot].

[jest-snapshot]: https://jestjs.io/docs/en/snapshot-testing
[mocha]: https://mochajs.org/
[chai]: https://www.chaijs.com/

## 💿 Installation

```bash
npm install -D @ota-meshi/test-snapshot
```

## 📖 Usage

For example, when used with [mocha]:

```js
import { expect } from "@ota-meshi/test-snapshot";

it("foo", () => {
  expect({ foo: "bar" }).toMatchSnapshot();
});
```

For example, when used with [mocha] and [chai]:

```js
import { use, expect } from "chai"
import { chaiPlugin } from "@ota-meshi/test-snapshot/chai";

use(chaiPlugin);

it("foo", () => {
  expect({ foo: "bar" }).toMatchSnapshot();
});
```
