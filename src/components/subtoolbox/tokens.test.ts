import { describe, expect, it } from "vitest"
import { COMPONENT_LEVEL_DNA, getComponentLevelCssVars, VIEWTUBE_TYPOGRAPHY, COMPONENT_SIZE_DNA, getComponentSizeCssVars } from "./tokens"

describe("canonical component-level DNA", () => {
  it("matches the locked 65 geometry for L0/L1/L2", () => {
    expect(COMPONENT_LEVEL_DNA).toEqual({
      l0: { height: 56, stroke: 3.5, radius: 9.333333, shadowOffset: 5.833333, fontSize: 24 },
      l1: { height: 48, stroke: 3, radius: 8, shadowOffset: 5, fontSize: 18 },
      l2: { height: 32, stroke: 2, radius: 6, shadowOffset: 4, fontSize: 12 },
    })
  })

  it("projects every level into CSS variables without local geometry", () => {
    expect(getComponentLevelCssVars("l0")).toMatchObject({
      "--vt-component-height": "56px",
      "--vt-component-stroke": "3.5px",
      "--vt-component-radius": "9.333333px",
      "--vt-component-shadow-offset": "5.833333px",
      "--vt-component-font-size": "24px",
    })
    expect(getComponentLevelCssVars("l1")).toMatchObject({
      "--vt-component-height": "48px",
      "--vt-component-stroke": "3px",
      "--vt-component-radius": "8px",
      "--vt-component-shadow-offset": "5px",
      "--vt-component-font-size": "18px",
    })
    expect(getComponentLevelCssVars("l2")).toMatchObject({
      "--vt-component-height": "32px",
      "--vt-component-stroke": "2px",
      "--vt-component-radius": "6px",
      "--vt-component-shadow-offset": "4px",
      "--vt-component-font-size": "12px",
    })
  })
  it("locks the component-library typography and four default control sizes", () => {
    expect(VIEWTUBE_TYPOGRAPHY).toMatchObject({
      family: 'Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif',
      controlWeight: 1000,
      bodyWeight: 900,
      controlLetterSpacingEm: -0.055,
      controlLineHeight: 0.9,
    })
    expect(COMPONENT_SIZE_DNA).toEqual({
      xs: { height: 20, fontSize: 10 },
      s: { height: 32, fontSize: 12 },
      m: { height: 44, fontSize: 16 },
      l: { height: 56, fontSize: 24 },
    })
    expect(getComponentSizeCssVars("xs")).toMatchObject({
      "--vt-component-height": "20px",
      "--vt-component-font-size": "10px",
    })
    expect(getComponentSizeCssVars("m")).toMatchObject({
      "--vt-component-height": "44px",
      "--vt-component-font-size": "16px",
    })
  })
})
