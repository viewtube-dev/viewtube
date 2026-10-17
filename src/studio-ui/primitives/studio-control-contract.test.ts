import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const read = (path: string) => readFileSync(resolve(process.cwd(), path), "utf8");

describe("Studio control global contract", () => {
  it("defines canonical standard/compact/micro geometry without an internal gap token", () => {
    const css = read("src/styles/studio-control-vars.generated.css");
    for (const token of ["--vt-studio-standard-height: 44px", "--vt-studio-compact-height: 28px", "--vt-studio-micro-height: 14px", "--vt-studio-micro-stroke: 1px", "--vt-studio-micro-radius: 2px", "--vt-studio-micro-font-size: 10px"]) expect(css).toContain(token);
    expect(css).not.toContain("--vt-studio-control-gap");
  });
  it("keeps split rails secondary and shells flat", () => {
    const css = read("src/styles/studio-control-split.css");
    expect(css).toContain('[data-vt-studio-split="double"]');
    expect(css.match(/background: var\(--vt-studio-control-secondary/g)?.length).toBeGreaterThanOrEqual(2);
    expect(css).toContain("border-radius: 0");
    expect(css).toContain("box-shadow: none");
    expect(css).toContain("border: var(--vt-studio-control-stroke, 3px) solid #000");
    expect(css).toContain("color: #000;");
    expect(css).toContain("align-items: center;");
    expect(css).toContain("justify-content: center;");
    expect(css).toContain('[data-vt-studio-split-rail][data-rail="start"]');
    expect(css).toContain('[data-vt-studio-split-rail][data-rail="end"]');
    expect(css).toContain("[data-vt-studio-split-rail] > svg *");
  });
  it("uses a secondary focus outline at 65% of border width with zero offset", () => {
    const css = read("src/styles/studio-control-fields.css");
    expect(css).toContain("* .65");
    expect(css).toContain("outline-offset: 0");
  });
  it("documents content-width exceptions instead of silently overriding row fill", () => {
    const tokens = read("src/studio-ui/tokens.ts");
    expect(tokens).toContain("STUDIO_CONTROL_EXCEPTIONS");
    expect(tokens).toContain("STUDIO_WIDTH_POLICY");
  });
  it("keeps field typography separate from border geometry in the canonical stylesheet", () => {
    const css = read("src/styles/studio-control-system.css");
    expect(css).toContain("--vt-studio-control-text-stroke, 1px");
    expect(css).toContain("--vt-studio-textarea-standard-font-size, 18px");
    expect(css).toContain("--vt-studio-textarea-compact-font-size, 14px");
    expect(css).toContain("--vt-studio-textarea-standard-text-stroke, .5px");
    expect(css).toContain("--vt-studio-textarea-compact-text-stroke, .35px");
    expect(css).toContain('textarea[data-vt-studio-control="true"][data-vt-studio-field-kind="textarea"]:is(:focus, :focus-visible)');
    expect(css).not.toContain("-webkit-text-stroke: var(--vt-field-stroke) var(--vt-field-primary)");
    const start = css.indexOf("/* Canonical Studio Controls field contract.");
    const end = css.indexOf("/* 2. Canonical 44px selection-control geometry.", start);
    expect(start).toBeGreaterThanOrEqual(0);
    expect(end).toBeGreaterThan(start);
    expect(css.slice(start, end)).not.toContain("!important");
    const controls = read("src/studio-ui/primitives/StudioControls.tsx");
    expect(controls).not.toContain("studio-library-audit-fixes.css");
  });

});
