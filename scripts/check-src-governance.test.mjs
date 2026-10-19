import test from "node:test"
import assert from "node:assert/strict"
import { findRuntimeSourceViolations } from "./check-src-governance.mjs"

test("runtime source governance rejects documentation imports and absolute file links", () => {
 const result = findRuntimeSourceViolations([
  { path: "src/example.ts", text: 'import guide from "../docs/brain/guide.md"\nconst href = "file:///Users/dev/docs/guide.md"' },
 ])
 assert.deepEqual(result.documentationImports, ["src/example.ts"])
 assert.deepEqual(result.absoluteFileLinks, ["src/example.ts"])
})

test("runtime source governance permits repository-relative docs links and ordinary source", () => {
 const result = findRuntimeSourceViolations([
  { path: "src/example.ts", text: 'const href = "https://github.com/viewtube-dev/viewtube/blob/master/docs/brain/guide.md"' },
 ])
 assert.deepEqual(result.documentationImports, [])
 assert.deepEqual(result.absoluteFileLinks, [])
})
