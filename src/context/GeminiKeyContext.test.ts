import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const source = fs.readFileSync(
  path.resolve(process.cwd(), "src/context/GeminiKeyContext.tsx"),
  "utf8",
);

describe("Gemini API-key validation contract", () => {
  it("uses the app's current default Gemini model rather than the retired 1.5 model", () => {
    expect(source).toContain("model: 'gemini-3.1-flash'");
    expect(source).not.toContain("model: 'gemini-1.5-flash'");
  });

  it("maps provider failures to creator-safe messages instead of displaying raw SDK errors", () => {
    expect(source).toContain("Gemini could not use the validation model.");
    expect(source).toContain("Gemini could not validate this API key.");
    expect(source).toContain("Gemini connection failed.");
    expect(source).not.toContain("setValidationError(error.message");
  });
});
