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
  it("defaults to the rightmost enabled item and renders only its content", () => {
    const html = renderToStaticMarkup(<StudioSplitAccordion items={items} />);
    expect(html).toContain('data-vt-studio-split-accordion="true"');
    expect(html).toContain('data-active-index="2"');
    expect(html).toContain("RIGHT PANEL");
    expect(html).not.toContain("MIDDLE PANEL");
    expect(html).not.toContain("LEFT PANEL");
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
      expect(html).toContain('aria-pressed="false"');
    }
  });

  it("uses token-owned flat geometry, square faces, reduced motion, and a 280ms activation lock", () => {
    const css = readFileSync(resolve(process.cwd(), "src/styles/studio-split-accordion.css"), "utf8");
    const source = readFileSync(resolve(process.cwd(), "src/studio-ui/primitives/StudioSplitAccordion.tsx"), "utf8");
    expect(css).toContain("var(--vt-studio-control-height, 44px)");
    expect(css).toContain("width: var(--vt-studio-split-accordion-face)");
    expect(css).toContain("height: var(--vt-studio-split-accordion-face)");
    expect(css).not.toContain("box-shadow:");
    expect(css).toContain("@media (prefers-reduced-motion: reduce)");
    expect(source).toContain("const MOTION_LOCK_MS = 280");
  });
});
