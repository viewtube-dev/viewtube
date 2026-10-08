import { describe, expect, it } from "vitest"
import {
  CATALOG_SIZES,
  STUDIO_HUB_L1_ONLY_FAMILIES,
  getFamilyCatalogSizes,
} from "./StudioHubPrimitiveMigrationCatalog"
import { COMPONENT_LEVEL_DNA } from "../subtoolbox/tokens"

describe("Studio Hub L1 control wave", () => {
  it("keeps components 18-29 on the explicit canonical L1 lane", () => {
    const families = [
      "Dropdown",
      "Top Title Dropdown",
      "Select Menu",
      "Context Menu",
      "Stepper",
      "Slider",
      "Range Slider",
      "Toggle",
      "Settings Switch",
      "Checkbox",
      "Radio",
      "Segmented Choice",
    ] as const

    expect(families.every((family) => STUDIO_HUB_L1_ONLY_FAMILIES.has(family))).toBe(true)
    for (const family of families) {
      expect(getFamilyCatalogSizes(family)).toEqual([
        { size: "l1", compatibilityLevel: "l1" },
      ])
    }
  })

  it("uses the 65 structural L1 DNA rather than the 44px component-M DNA", () => {
    expect(CATALOG_SIZES[0]).toEqual({ size: "l1", compatibilityLevel: "l1" })
    expect(COMPONENT_LEVEL_DNA.l1).toEqual({
      height: 48,
      stroke: 3,
      radius: 8,
      shadowOffset: 5,
      fontSize: 18,
    })
  })
})
