# test-snapshot

A snapshot testing library similar to [jest-snapshot].

## 🚀 Features

- Simple to use.
- Supports [mocha].
- Snapshot format similar to [jest-snapshot].

[jest-snapshot]: https://jestjs.io/docs/en/snapshot-testing
[mocha]: https://mochajs.org/

## 💿 Installation

```bash
npm install -D @ota-meshi/test-snapshot
```

## 📖 Usage

```js
import { expect } from "@ota-meshi/test-snapshot";

it("foo", () => {
  expect({ foo: "bar" }).toMatchSnapshot();
});
```
