import React from "react";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { StudioSplitAccordion } from "./StudioSplitAccordion";

const items = [
  { id: "left", accessibleLabel: "Left", icon: <span>L</span>, content: "LEFT PANEL" },
  { id: "middle", accessibleLabel: "Middle", icon: <span>M</span>, content: "MIDDLE PANEL" },
  { id: "right", accessibleLabel: "Right", icon: <span>R</span>, content: "RIGHT PANEL" },
] as const;

describe("StudioSplitAccordion", () => {
  it("defaults to the rightmost enabled item and marks inactive panels hidden", () => {
    const html = renderToStaticMarkup(<StudioSplitAccordion items={items} />);
    expect(html).toContain('data-vt-studio-split-accordion="true"');
    expect(html).toContain('data-active-index="2"');
    expect(html).toContain("RIGHT PANEL");
    expect(html).toContain("MIDDLE PANEL");
    expect(html).toContain("LEFT PANEL");
    expect(html).toContain("hidden=\"\"");
    expect(html).toContain('data-vt-library-component="StudioSplitAccordion"');
  });

  it("supports compact and micro geometry and an explicit initial item", () => {
    const compact = renderToStaticMarkup(<StudioSplitAccordion items={items} defaultActiveIndex={0} sizeVariant="compact" />);
    const micro = renderToStaticMarkup(<StudioSplitAccordion items={items} defaultActiveIndex={1} sizeVariant="micro" />);
    expect(compact).toContain('data-size="compact"');
    expect(compact).toContain('data-active-index="0"');
    expect(micro).toContain('data-size="micro"');
    expect(micro).toContain('data-active-index="1"');
  });

  it("chooses the last enabled item when the requested default is disabled", () => {
    const html = renderToStaticMarkup(<StudioSplitAccordion items={[{ ...items[0], disabled: true }, items[1], { ...items[2], disabled: true }]} />);
    expect(html).toContain('data-active-index="1"');
    expect(html).toContain("MIDDLE PANEL");
  });

  it("exposes accessible expansion semantics for left, right, and double layouts", () => {
    for (const layout of ["left", "right", "double"] as const) {
      const html = renderToStaticMarkup(<StudioSplitAccordion items={items} layout={layout} />);
      expect(html).toContain(`data-layout="${layout}"`);
      expect(html).toContain('aria-expanded="false"');
    }
  });

  it("uses token-owned flat geometry, square faces, reduced motion, and a 280ms activation lock", () => {
    const css = readFileSync(resolve(process.cwd(), "src/styles/studio-split-accordion.css"), "utf8");
    const source = readFileSync(resolve(process.cwd(), "src/studio-ui/primitives/StudioSplitAccordion.tsx"), "utf8");
    expect(css).toContain("var(--vt-studio-control-height, 44px)");
    expect(css).toContain("width: var(--vt-studio-split-accordion-face, 38px)");
    expect(css).toContain("height: var(--vt-studio-split-accordion-face, 38px)");
    expect(css).not.toContain("box-shadow:");
    expect(css).toContain("@media (prefers-reduced-motion: reduce)");
    expect(source).toContain("const MOTION_LOCK_MS = 280");
  });

  it("locks the Studio Controls color and typography contract", () => {
    const css = readFileSync(resolve(process.cwd(), "src/styles/studio-split-accordion.css"), "utf8");
    expect(css).toContain("background: transparent;");
    expect(css).toContain("background: var(--vt-studio-control-secondary, var(--pair-b, #ff7f6b));");
    expect(css).toContain("background: var(--vt-studio-control-accent, var(--pair-a, #36e0f6));");
    expect(css).not.toMatch(/color-mix\\([^;]*accent/i);
    expect(css).toContain('.vt-studio-split-accordion[data-size="standard"] .vt-studio-split-accordion__content-inner {\\n  font-size: 38px;');
    expect(css).toContain('.vt-studio-split-accordion[data-size="compact"] .vt-studio-split-accordion__content-inner {\\n  font-size: 24px;');
    expect(css).toContain('.vt-studio-split-accordion[data-size="micro"] .vt-studio-split-accordion__content-inner {\\n  font-size: 10px;');
    expect(css).toContain("width: min(var(--vt-studio-control-icon-size, 38px), 100%);");
    expect(css).not.toContain("box-shadow:");
  });
});
