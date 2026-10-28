import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const source = fs.readFileSync(
  path.resolve(process.cwd(), "src/context/GeminiKeyContext.tsx"),
  "utf8",
);

describe("Gemini API-key validation contract", () => {
  it("does not reject valid keys because a hard-coded generation model is unavailable", () => {
    expect(source).toContain("await ai.models.list()");
    expect(source).toContain("for await (const _model of listedModels)");
    expect(source).toContain("setApiKey(trimmedKey)");
    expect(source).not.toContain("model: 'gemini-1.5-flash'");
    expect(source).not.toContain("Gemini could not use the validation model.");
  });

  it("uses shared local key storage and accepts keys independently of ViewTube login", () => {
    expect(source).toContain("import { getVaultKey, setVaultKey } from '../services/keyVault'");
    expect(source).toContain("getVaultKey('gemini')");
    expect(source).toContain("setVaultKey('gemini', trimmedKey)");
    expect(source).toContain("setVaultKey('gemini', '')");
    expect(source).not.toContain("useUnifiedAccount");
    expect(source).not.toContain("isAuthenticated");
  });

  it("maps key, catalog, and network failures to creator-safe messages", () => {
    expect(source).toContain("Gemini could not validate this API key.");
    expect(source).toContain("Google could not load the Gemini model catalog");
    expect(source).toContain("Gemini connection failed.");
    expect(source).not.toContain("setValidationError(error.message");
  });
});
