import { describe, expect, it } from "vitest";
import { toScriptExportFilename } from "./scriptExport";

describe("toScriptExportFilename", () => {
  it("uses a readable topic-based filename", () => {
    expect(toScriptExportFilename("My Great Video")).toBe("My-Great-Video.txt");
  });

  it("replaces filesystem-reserved characters and collapses separators", () => {
    expect(toScriptExportFilename('A/B:C*D?"E"')).toBe("A-B-C-D-E.txt");
  });

  it("uses a safe fallback for empty or whitespace-only names", () => {
    expect(toScriptExportFilename("   ")).toBe("viewtube-script.txt");
  });

  it("limits the basename length", () => {
    expect(toScriptExportFilename("a".repeat(200))).toBe(`${"a".repeat(80)}.txt`);
  });
});
