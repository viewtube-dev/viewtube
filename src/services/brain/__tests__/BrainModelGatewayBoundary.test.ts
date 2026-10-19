import { readFileSync } from "node:fs"
import { describe, expect, it } from "vitest"

const read = (path: string): string => readFileSync(new URL(path, import.meta.url), "utf8")

describe("Brain model gateway boundary", () => {
 it("keeps the orchestrator on the provider-neutral model gateway", () => {
  const source = read("../BrainOrchestrator.ts")

  expect(source).toContain("defaultBrainModelGateway.generateStructuredResponse")
  expect(source).not.toContain("generateStructuredBrainResponse")
 })
})
