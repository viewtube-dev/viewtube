import fs from "node:fs"
import path from "node:path"
import { describe, expect, it } from "vitest"

const source = fs.readFileSync(
  path.resolve(process.cwd(), "src/services/brain/Core.ts"),
  "utf8",
)

describe("Brain reflection provider boundary", () => {
  it("routes reflection generation through the canonical BrainModelGateway", () => {
    expect(source).toContain('import { defaultBrainModelGateway } from "./runtime/BrainModelGateway"')
    expect(source).toContain("defaultBrainModelGateway.generateJsonObject")
    expect(source).not.toContain('await import("../gemini")')
    expect(source).not.toContain("ai.models.generateContent")
  })
})
