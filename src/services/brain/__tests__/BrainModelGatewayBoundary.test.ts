import { readFileSync } from "node:fs"
import { describe, expect, it, vi } from "vitest"
import {
 createBrainModelGateway,
 type BrainJsonGenerationInput,
 type BrainStructuredGenerationInput,
} from "../runtime/BrainModelGateway"

const read = (path: string): string => readFileSync(new URL(path, import.meta.url), "utf8")

describe("Brain model gateway boundary", () => {
 it("keeps the orchestrator on the provider-neutral model gateway", () => {
  const source = read("../BrainOrchestrator.ts")

  expect(source).toContain("defaultBrainModelGateway.generateStructuredResponse")
  expect(source).not.toContain("generateStructuredBrainResponse")
 })

 it("keeps provider runtime imports out of the gateway contract module", () => {
  const source = read("../runtime/BrainModelGateway.ts")

  expect(source).not.toMatch(/^import\s+.*from\s+["'][^"']*\/gemini["']/m)
  expect(source).toContain('await import("../../gemini")')
 })

 it("substitutes a fake provider without changing gateway callers", async () => {
  const structuredOutput = { headline: "A grounded next step" } as any
  const jsonOutput = { actions: ["Review the strongest evidence"] }
  const generateStructuredResponse = vi.fn(async (_input: BrainStructuredGenerationInput) => structuredOutput)
  const generateJsonObject = vi.fn(async (_input: BrainJsonGenerationInput) => jsonOutput)
  const gateway = createBrainModelGateway({ generateStructuredResponse, generateJsonObject })

  const structuredInput: BrainStructuredGenerationInput = {
   history: [],
   userText: "What should I make next?",
   systemInstruction: "Use only supplied evidence.",
  }
  const jsonInput: BrainJsonGenerationInput = {
   userText: "Create an action plan.",
   systemInstruction: "Return valid JSON.",
   responseSchema: { type: "object" },
  }

  await expect(gateway.generateStructuredResponse(structuredInput)).resolves.toBe(structuredOutput)
  await expect(gateway.generateJsonObject?.(jsonInput)).resolves.toBe(jsonOutput)
  expect(generateStructuredResponse).toHaveBeenCalledWith(structuredInput)
  expect(generateJsonObject).toHaveBeenCalledWith(jsonInput)
 })
})
