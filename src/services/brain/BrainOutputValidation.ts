import type { Schema } from "@google/genai"

export interface BrainOutputValidationIssue {
 path: string
 code: "type" | "required" | "enum" | "min_items" | "max_items" | "min_length" | "max_length" | "minimum" | "maximum" | "schema"
 message: string
}

const record = (value: unknown): Record<string, unknown> | null =>
 value !== null && typeof value === "object" && !Array.isArray(value)
  ? value as Record<string, unknown>
  : null

const schemaRecord = (schema: unknown): Record<string, unknown> | null => record(schema)

const normalizedType = (value: unknown): string =>
 typeof value === "string" ? value.toLowerCase() : ""

const typeMatches = (value: unknown, type: string): boolean => {
 switch (type) {
  case "object": return record(value) !== null
  case "array": return Array.isArray(value)
  case "string": return typeof value === "string"
  case "number": return typeof value === "number" && Number.isFinite(value)
  case "integer": return typeof value === "number" && Number.isInteger(value)
  case "boolean": return typeof value === "boolean"
  case "null": return value === null
  default: return true
 }
}

/** Deterministic subset validator for the structured output schemas used by Brain. */
export const validateBrainStructuredOutput = (
 schema: Schema | Record<string, unknown>,
 value: unknown,
): BrainOutputValidationIssue[] => {
 const issues: BrainOutputValidationIssue[] = []
 let visited = 0
 const walk = (currentSchema: unknown, currentValue: unknown, path: string, depth: number): void => {
  visited += 1
  if (visited > 2000 || depth > 20) {
   issues.push({ path: path || "$", code: "schema", message: "Output exceeds validator complexity limits." })
   return
  }
  const shape = schemaRecord(currentSchema)
  if (!shape) {
   issues.push({ path: path || "$", code: "schema", message: "Schema node is not an object." })
   return
  }
  const type = normalizedType(shape.type)
  if (type && !typeMatches(currentValue, type)) {
   issues.push({ path: path || "$", code: "type", message: `Expected ${type}.` })
   return
  }
  if (Array.isArray(shape.enum) && !shape.enum.some((allowed) => Object.is(allowed, currentValue))) {
   issues.push({ path: path || "$", code: "enum", message: "Value is not one of the allowed enum values." })
  }
  if (typeof currentValue === "string") {
   if (typeof shape.minLength === "number" && currentValue.length < shape.minLength) {
    issues.push({ path: path || "$", code: "min_length", message: `Must contain at least ${shape.minLength} characters.` })
   }
   if (typeof shape.maxLength === "number" && currentValue.length > shape.maxLength) {
    issues.push({ path: path || "$", code: "max_length", message: `Must contain at most ${shape.maxLength} characters.` })
   }
  }
  if (typeof currentValue === "number") {
   if (typeof shape.minimum === "number" && currentValue < shape.minimum) {
    issues.push({ path: path || "$", code: "minimum", message: `Must be at least ${shape.minimum}.` })
   }
   if (typeof shape.maximum === "number" && currentValue > shape.maximum) {
    issues.push({ path: path || "$", code: "maximum", message: `Must be at most ${shape.maximum}.` })
   }
  }
  if (Array.isArray(currentValue)) {
   if (typeof shape.minItems === "number" && currentValue.length < shape.minItems) {
    issues.push({ path: path || "$", code: "min_items", message: `Must contain at least ${shape.minItems} items.` })
   }
   if (typeof shape.maxItems === "number" && currentValue.length > shape.maxItems) {
    issues.push({ path: path || "$", code: "max_items", message: `Must contain at most ${shape.maxItems} items.` })
   }
   if (shape.items) currentValue.slice(0, 500).forEach((item, index) => walk(shape.items, item, `${path || "$"}[${index}]`, depth + 1))
  }
  if (type === "object" || shape.properties) {
   const object = record(currentValue)
   if (!object) return
   const required = Array.isArray(shape.required) ? shape.required.filter((item): item is string => typeof item === "string") : []
   required.forEach((key) => {
    if (!(key in object) || object[key] === undefined) {
     issues.push({ path: path ? `${path}.${key}` : key, code: "required", message: "Required field is missing." })
    }
   })
   const properties = record(shape.properties) || {}
   Object.entries(properties).forEach(([key, childSchema]) => {
    if (key in object && object[key] !== undefined) walk(childSchema, object[key], path ? `${path}.${key}` : key, depth + 1)
   })
  }
 }
 walk(schema, value, "$", 0)
 return issues
}

export const formatBrainOutputValidationIssues = (issues: BrainOutputValidationIssue[]): string[] =>
 issues.map((issue) => `${issue.path}: ${issue.message}`)
