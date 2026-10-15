import { readFileSync } from "node:fs"
import { resolve } from "node:path"
import { describe, expect, it } from "vitest"

describe("Studio Controls React hook access", () => {
  it("uses React hooks from the imported React namespace, not a nested React.React namespace", () => {
    const source = readFileSync(resolve(process.cwd(), "src/studio-ui/primitives/StudioControls.tsx"), "utf8")
    expect(source).not.toContain("React.React.useRef")
  })
})
