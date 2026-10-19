import { describe, expect, it } from "vitest"
import { EDUCATION_TIMESTAMP_PATTERN, validateEducationTimestampLines } from "./EducationTimestampNotes"

describe("education timestamp metadata", () => {
  it("accepts valid timestamped question/phrase lines", () => {
    expect(EDUCATION_TIMESTAMP_PATTERN.test("0:00 What is photosynthesis?")).toBe(true)
    expect(EDUCATION_TIMESTAMP_PATTERN.test("12:34 Key phrase")).toBe(true)
    expect(validateEducationTimestampLines("0:00 Question\n1:25 Phrase")).toEqual({ valid: true, invalidLines: [] })
  })

  it("rejects lines without the required timestamp prefix and content", () => {
    expect(validateEducationTimestampLines("Question without timestamp\n2:3 Bad seconds")).toEqual({
      valid: false,
      invalidLines: [1, 2],
    })
  })

  it("allows an empty optional education field", () => {
    expect(validateEducationTimestampLines("")).toEqual({ valid: true, invalidLines: [] })
  })
})
