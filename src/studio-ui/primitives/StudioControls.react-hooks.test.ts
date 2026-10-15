import assert from "node:assert/strict"
import test from "node:test"
import { readFileSync } from "node:fs"
import { resolve } from "node:path"

test("Studio Controls use hooks from the imported React namespace", () => {
  const source = readFileSync(resolve(process.cwd(), "src/studio-ui/primitives/StudioControls.tsx"), "utf8")
  assert.doesNotMatch(source, /React\.React\.useRef/)
})
