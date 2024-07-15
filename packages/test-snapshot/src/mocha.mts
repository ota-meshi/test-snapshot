import path from "path";
import fs from "fs";
import assert from "assert";
import naturalCompare from "natural-compare";
import type {} from "chai";
import { version } from "./version.mjs";
import { formatValue } from "./common.mts";
const V = version.split(".")[0];

const ARGV_UPDATE_SNAPSHOT =
  Boolean(process.env.UPDATE_SNAPSHOT) ||
  process.argv.includes("--update") ||
  process.argv.includes("--update-snapshot") ||
  process.argv.includes("--updateSnapshot");
type SnapshotFile = {
  file: string;
  contents: Map<string, Map<number, string>>;
  updated?: boolean;
};
type SnapshotTitle = {
  title: string;
  seq: number;
};
type SnapshotContext = {
  snap: SnapshotFile;
  title: SnapshotTitle;
  titles: Map<string, SnapshotTitle>;
};
type SnapshotTester = {
  test: () => {
    hasSnapshot: () => boolean;
    getSnapshot: () => string | undefined;
    saveSnapshot: (value: any) => void;
    markAsUsed: () => void;
  };
};
let tester: SnapshotTester | null = null;
/**
 * Get snapshot tester
 */
export function getSnapshotTester(): SnapshotTester {
  return (tester ??= setupSnapshotTester());
}

/**
 * Setup snapshot testing
 */
function setupSnapshotTester(): SnapshotTester {
  let ctx: SnapshotContext | null = null;
  const unusedTests = new Map<string, Map<string, Set<number>>>();

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

    if (ctx?.snap.file !== file) {
      if (ctx) saveIfNeeded(ctx.snap);
      ctx = {
        snap: ARGV_UPDATE_SNAPSHOT ? { file, contents: new Map() } : load(file),
        title: { title, seq: 0 },
        titles: new Map(),
      };
      if (!unusedTests.has(file)) {
        const unused = new Map<string, Set<number>>();
        unusedTests.set(file, unused);
        for (const [key, sequences] of ctx.snap.contents) {
          unused.set(key, new Set(sequences.keys()));
        }
      }
    } else if (ctx.title.title !== title) {
      let st = ctx.titles.get(title);
      if (!st) {
        st = { title, seq: 0 };
        ctx.titles.set(title, st);
      }
      ctx.title = st;
    }
  });
  after(() => {
    if (ctx) saveIfNeeded(ctx.snap);

    const reports: string[] = [];
    for (const [file, unused] of unusedTests) {
      const unusedKeys: string[] = [];
      for (const [key, sequences] of unused) {
        for (const seq of sequences) {
          unusedKeys.push(JSON.stringify(`${key} ${seq}`));
        }
      }
      if (unusedKeys.length) {
        reports.push(`Unused snapshots in ${file}:\n${unusedKeys.join("\n")}`);
      }
    }
    if (reports.length) {
      assert.fail(reports.join("\n"));
    }
    unusedTests.clear();
  });

  return {
    test() {
      if (!ctx) throw new Error("Snapshot file not found");
      const { snap, title } = ctx;
      const key = title.title;
      const seq = ++title.seq;
      return {
        markAsUsed: () => unusedTests.get(snap.file)?.get(key)?.delete(seq),
        hasSnapshot: () => snap.contents.has(key),
        getSnapshot: () => snap.contents.get(key)?.get(seq),
        saveSnapshot,
      };

      /**
       * Save snapshot
       */
      function saveSnapshot(value: any) {
        let content = snap.contents.get(key);
        if (!content) {
          content = new Map();
          snap.contents.set(key, content);
        }
        content.set(seq, formatValue(value));
        snap.updated = true;
      }
    },
  };
}

/**
 * Save snapshot to file
 */
function saveIfNeeded(snapshotFile: SnapshotFile) {
  if (!snapshotFile.updated) return;
  fs.writeFileSync(snapshotFile.file, stringifySnapshot(snapshotFile));
}

/**
 * Load snapshot from file
 */
function load(filename: string): SnapshotFile {
  fs.mkdirSync(path.dirname(filename), { recursive: true });
  const contents: Map<string, Map<number, string>> = fs.existsSync(filename)
    ? parseSnapshot(fs.readFileSync(filename, "utf8"))
    : new Map();
  return {
    file: filename,
    contents,
  };
}

/**
 * Parse snapshot from string
 */
function parseSnapshot(content: string): Map<string, Map<number, string>> {
  const result: Map<string, Map<number, string>> = new Map();
  Function(
    "exports",
    content,
  )(
    new Proxy(
      {},
      {
        set(_, key, value) {
          if (typeof key !== "string") return false;
          const splitted = key.split(" ");
          const seq = Number(splitted.pop());
          const testKey = splitted.join(" ");
          let list = result.get(testKey);
          if (!list) {
            list = new Map();
            result.set(testKey, list);
          }
          list.set(seq, value);
          return true;
        },
      },
    ),
  );
  return result;
}

/**
 * Serialize snapshot to string
 */
function stringifySnapshot(snap: SnapshotFile): string {
  const content = [`// test-snapshot v${V}`];
  for (const [key, values] of [...snap.contents].sort(([a], [b]) => {
    return naturalCompare(a, b);
  })) {
    for (const [seq, value] of values) {
      content.push(
        `exports[\`${escape(key)} ${seq}\`] = \`${escape(value)}\`;`,
      );
    }
  }
  return `${content.join("\n\n")}\n`;

  /**
   * Escape string
   */
  function escape(str: string): string {
    return str.replace(/([\\`]|\$\{)/gu, "\\$1");
  }
}
