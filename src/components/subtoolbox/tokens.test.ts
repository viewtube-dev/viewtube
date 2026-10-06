import { describe, expect, it } from "vitest"
import { COMPONENT_LEVEL_DNA, getComponentLevelCssVars } from "../tokens"

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
})
