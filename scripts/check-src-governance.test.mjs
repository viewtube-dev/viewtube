import test from "node:test"
import assert from "node:assert/strict"
import { findRuntimeSourceViolations } from "./source-governance/runtime-source-rules.mjs"

test("runtime source governance rejects documentation imports and absolute file links", () => {
 const result = findRuntimeSourceViolations([
  { path: "src/example.ts", text: 'import guide from "../docs/brain/guide.md"\nconst href = "file:///Users/dev/docs/guide.md"' },
 ])
 assert.deepEqual(result.documentationImports, ["src/example.ts"])
 assert.deepEqual(result.absoluteFileLinks, ["src/example.ts"])
})

test("runtime source governance rejects raw machine paths without a file URL scheme", () => {
 const result = findRuntimeSourceViolations([
  { path: "src/example.ts", text: 'const source = "/Users/dev/Downloads/input.json"' },
 ])
 assert.deepEqual(result.absoluteFileLinks, ["src/example.ts"])
})


test("runtime source governance does not mistake escaped newline labels for Windows paths", () => {
 const result = findRuntimeSourceViolations([
  { path: "src/example.ts", text: 'const prompt = "STAGE_A_INPUT_JSON:\\n${payload}"; const status = "status:\\nready"' },
 ])
 assert.deepEqual(result.absoluteFileLinks, [])
})


test("runtime source governance permits developer-path fixtures in test files", () => {
 const result = findRuntimeSourceViolations([
  { path: "src/services/example.test.ts", text: 'const fixture = "/Users/dev/fixture.json"' },
  { path: "src/services/__tests__/example.test.ts", text: 'const fixture = "C:\\Users\\dev\\fixture.json"' },
 ])
 assert.deepEqual(result.absoluteFileLinks, [])
})

test("runtime source governance permits repository-relative docs links and ordinary source", () => {
 const result = findRuntimeSourceViolations([
  { path: "src/example.ts", text: 'const href = "https://github.com/viewtube-dev/viewtube/blob/master/docs/brain/guide.md"' },
 ])
 assert.deepEqual(result.documentationImports, [])
 assert.deepEqual(result.absoluteFileLinks, [])
})
