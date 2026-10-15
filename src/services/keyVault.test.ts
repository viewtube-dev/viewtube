import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  getVaultKey,
  getVaultSnapshot,
  hasVaultKey,
  setVaultKey,
  setVaultSnapshot,
} from "./keyVault";

const makeStorage = () => {
  const values = new Map<string, string>();
  return {
    getItem: vi.fn((key: string) => values.get(key) ?? null),
    setItem: vi.fn((key: string, value: string) => { values.set(key, String(value)); }),
    removeItem: vi.fn((key: string) => { values.delete(key); }),
  };
};

describe("key vault storage boundaries", () => {
  beforeEach(() => vi.stubGlobal("localStorage", makeStorage()));
  afterEach(() => vi.unstubAllGlobals());

  it("reads and writes API keys through browser storage", () => {
    setVaultKey("gemini", "  test-key  ");
    expect(getVaultKey("gemini")).toBe("test-key");
    expect(hasVaultKey("gemini")).toBe(true);
    setVaultKey("gemini", "");
    expect(getVaultKey("gemini")).toBe("");
  });

  it("returns defaults and tolerates writes when localStorage is unavailable", () => {
    vi.stubGlobal("localStorage", undefined);
    expect(getVaultKey("gemini")).toBe("");
    expect(getVaultKey("googleClientId")).toContain(".apps.googleusercontent.com");
    expect(() => setVaultKey("gemini", "key")).not.toThrow();
    expect(() => setVaultSnapshot({ elevenLabs: "key", auphonic: "" })).not.toThrow();
    expect(getVaultSnapshot()).toMatchObject({ gemini: "", elevenLabs: "", auphonic: "" });
  });

  it("tolerates storage implementations that throw", () => {
    vi.stubGlobal("localStorage", {
      getItem: () => { throw new Error("storage blocked"); },
      setItem: () => { throw new Error("storage blocked"); },
      removeItem: () => { throw new Error("storage blocked"); },
    });
    expect(getVaultKey("gemini")).toBe("");
    expect(() => setVaultKey("gemini", "key")).not.toThrow();
    expect(() => setVaultKey("gemini", "")).not.toThrow();
  });
});
