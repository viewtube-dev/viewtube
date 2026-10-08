import { describe, expect, it } from "vitest"
import { CATALOG_SIZES, getFamilyCatalogSizes } from "./StudioHubPrimitiveMigrationCatalog"

describe("primitive catalog size policy", () => {
  it("keeps component sizes distinct from structural compatibility levels", () => {
    expect(CATALOG_SIZES).toEqual([
      { size: "xs", compatibilityLevel: "l2" },
      { size: "s", compatibilityLevel: "l2" },
      { size: "m", compatibilityLevel: "l1" },
      { size: "l", compatibilityLevel: "l0" },
    ])
  })

  it("preserves single-size family policy without changing the size ladder", () => {
    expect(getFamilyCatalogSizes("Dialog")).toEqual([{ size: "l", compatibilityLevel: "l0" }])
    expect(getFamilyCatalogSizes("Rating")).toEqual([{ size: "m", compatibilityLevel: "l1" }])
    expect(getFamilyCatalogSizes("Primary Button")).toHaveLength(4)
  })
})
