# test-snapshot

A snapshot testing library similar to [jest-snapshot].

## 🚀 Features

- Simple to use.
- Snapshot format similar to [jest-snapshot].
- Supports [mocha].
- Plans to support [node:test] in the future.

[jest-snapshot]: https://jestjs.io/docs/en/snapshot-testing
[mocha]: https://mochajs.org/
[node:test]: https://nodejs.org/api/test.html

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
