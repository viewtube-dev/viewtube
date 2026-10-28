import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { chooseGeminiValidationModel } from "./GeminiKeyContext";

const source = fs.readFileSync(
  path.resolve(process.cwd(), "src/context/GeminiKeyContext.tsx"),
  "utf8",
);

describe("Gemini API-key validation contract", () => {
  it("discovers a model supported by the current key instead of hard-coding a model ID", () => {
    expect(source).toContain("await ai.models.list()");
    expect(source).toContain("supportedActions?.includes('generateContent')");
    expect(source).toContain("model,");
    expect(source).not.toContain("model: 'gemini-1.5-flash'");
    expect(source).not.toContain("model: 'gemini-3.1-flash'");
  });

  it("maps provider failures to creator-safe messages instead of displaying raw SDK errors", () => {
    expect(source).toContain("Gemini could not use the validation model.");
    expect(source).toContain("Gemini could not validate this API key.");
    expect(source).toContain("Gemini connection failed.");
    expect(source).not.toContain("setValidationError(error.message");
  });
});

describe("chooseGeminiValidationModel", () => {
  it("prefers a non-preview Flash model that supports generateContent", () => {
    expect(chooseGeminiValidationModel([
      { name: "models/gemini-pro-preview", supportedActions: ["generateContent"] },
      { name: "models/gemini-flash-preview", supportedActions: ["generateContent"] },
      { name: "models/gemini-flash", supportedActions: ["generateContent"] },
      { name: "models/gemini-embedding", supportedActions: ["embedContent"] },
    ])).toBe("gemini-flash");
  });

  it("returns null when no Gemini model supports generateContent", () => {
    expect(chooseGeminiValidationModel([
      { name: "models/gemini-embedding", supportedActions: ["embedContent"] },
      { name: "models/other-flash", supportedActions: ["generateContent"] },
    ])).toBeNull();
  });
});
