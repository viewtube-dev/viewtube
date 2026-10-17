import { expect, it } from "vitest"
import { readFileSync } from "node:fs"
import { resolve } from "node:path"

it("Studio Controls use hooks from the imported React namespace", () => {
  const source = readFileSync(resolve(process.cwd(), "src/studio-ui/primitives/StudioControls.tsx"), "utf8")
  expect(source).not.toMatch(/React\.React\.useRef/)
})
