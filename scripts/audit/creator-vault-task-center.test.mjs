import { readFile } from "node:fs/promises";
import test from "node:test";
import assert from "node:assert/strict";

test("Creator Vault task rows and inspected details are returned as one keyed JSX fragment", async () => {
  const source = await readFile("src/views/CreatorVaultOS.tsx", "utf8");
  const mapStart = source.indexOf(".map((task) => (", source.indexOf('title="Task Center"'));
  assert.notEqual(mapStart, -1, "Task Center should render task cards through a map");
  const mapEnd = source.indexOf(")) : (", mapStart);
  assert.notEqual(mapEnd, -1, "Task Center task map should close before the empty state");
  const mapBody = source.slice(mapStart, mapEnd);
  assert.match(mapBody, /<React\.Fragment key=\{task\.id\}>/, "Each task card and its optional inspected details must share a keyed fragment");
  assert.match(mapBody, /data-vault-task-details=\{task\.id\}/, "The inspected details panel should remain inside the mapped fragment");
});
