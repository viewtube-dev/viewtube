import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const source = fs.readFileSync(
  path.resolve(process.cwd(), "src/context/GeminiKeyContext.tsx"),
  "utf8",
);

describe("Gemini API-key validation contract", () => {
  it("validates the credential through model discovery without depending on one model generation call", () => {
    expect(source).toContain("await ai.models.list()");
    expect(source).toContain("for await (const _model of listedModels)");
    expect(source).toContain("setApiKey(trimmedKey)");
    expect(source).not.toContain("await ai.models.generateContent({");
    expect(source).not.toContain("Gemini could not use the validation model.");
  });

  it("uses the shared local key vault so the key is available to all Gemini consumers", () => {
    expect(source).toContain("import { getVaultKey, setVaultKey } from '../services/keyVault'");
    expect(source).toContain("getVaultKey('gemini')");
    expect(source).toContain("setVaultKey('gemini', key)");
    expect(source).toContain("setVaultKey('gemini', '')");
  });

  it("maps provider failures to creator-safe messages instead of displaying raw SDK errors", () => {
    expect(source).toContain("Google rejected this API key.");
    expect(source).toContain("Key saved locally, but Google denied verification.");
    expect(source).toContain("Key saved locally. Google could not verify the connection right now");
    expect(source).toContain("setApiKey(trimmedKey);");
    expect(source).toContain("return true;");
    expect(source).toContain("return false;");
    expect(source).not.toContain("setValidationError(error.message");
  });
});
