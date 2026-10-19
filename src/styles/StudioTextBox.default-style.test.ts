import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const css = fs.readFileSync(path.resolve(process.cwd(), "src/styles/studio-control-system.css"), "utf8");

describe("StudioTextBox default stroke contract", () => {
  const start = css.indexOf('.vt-studio-text-box[data-vt-studio-control="true"] {');
  const end = css.indexOf('.vt-studio-text-box[data-vt-studio-control="true"][data-size="compact"]');
  const standard = css.slice(start, end);

  it("halves only the local field border width and matches both decorative strokes", () => {
    expect(start).toBeGreaterThanOrEqual(0);
    expect(standard).toContain("--field-border-width: var(--vt-studio-control-stroke, 3px);");
    expect(standard).toContain("--studio-text-box-stroke-width: calc(var(--field-border-width) * 0.5);");
    expect(standard).toContain("border: var(--studio-text-box-stroke-width) solid #000;");
    expect(standard).toContain("box-shadow: inset 0 0 0 var(--studio-text-box-stroke-width) var(--vt-field-primary");
    expect(standard).toContain("outline: var(--studio-text-box-stroke-width) solid var(--vt-field-secondary");
    expect(standard).toContain("outline-offset: 0;");
  });

  it("preserves the half-fill background, black default text, and per-size textarea tokens", () => {
    expect(standard).toContain("var(--vt-studio-control-default-fill-opacity, 50%)");
    expect(standard).toContain("color: #000;");
    expect(standard).toContain("-webkit-text-fill-color: #000;");
    expect(css).toContain('.vt-studio-text-box[data-vt-studio-control="true"][data-size="compact"]');
    expect(css).toContain('.vt-studio-text-box[data-vt-studio-control="true"][data-size="micro"]');
    expect(css).toContain("var(--vt-studio-textarea-compact-font-size, 14px)");
    expect(css).toContain("var(--vt-studio-textarea-micro-font-size, 10px)");
  });
});
