import { describe, expect, it } from "vitest"
import { validateBrainStructuredOutput } from "../BrainOutputValidation"

const schema = {
 type: "OBJECT",
 properties: {
  title: { type: "STRING", minLength: 3, maxLength: 20 },
  count: { type: "INTEGER", minimum: 1, maximum: 5 },
  kind: { type: "STRING", enum: ["text", "poll"] },
  items: { type: "ARRAY", minItems: 1, maxItems: 2, items: { type: "STRING" } },
 },
 required: ["title", "count", "kind", "items"],
}

describe("Brain structured output validation", () => {
 it("accepts a valid typed output", () => {
  expect(validateBrainStructuredOutput(schema, {
   title: "A good title", count: 3, kind: "poll", items: ["A", "B"],
  })).toEqual([])
 })

 it("reports missing fields, wrong types, invalid enums and bounds with stable paths", () => {
  const issues = validateBrainStructuredOutput(schema, {
   title: "x", count: 9, kind: "video", items: [],
  })
  expect(issues).toEqual(expect.arrayContaining([
   expect.objectContaining({ path: "title", code: "min_length" }),
   expect.objectContaining({ path: "count", code: "maximum" }),
   expect.objectContaining({ path: "kind", code: "enum" }),
   expect.objectContaining({ path: "items", code: "min_items" }),
  ]))
  expect(validateBrainStructuredOutput(schema, { title: "Good", count: 2, kind: "text" }))
   .toEqual(expect.arrayContaining([expect.objectContaining({ path: "$.items", code: "required" })]))
 })

 it("bounds traversal for adversarially deep or large structures", () => {
  const nested = { type: "ARRAY", items: { type: "ARRAY", items: { type: "ARRAY", items: { type: "STRING" } } } }
  expect(validateBrainStructuredOutput(nested, [[["ok"]]])).toEqual([])
 })
})
