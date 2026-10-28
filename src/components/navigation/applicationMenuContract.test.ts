import { describe, expect, it } from "vitest"
import {
  APPLICATION_MENU_DESTINATIONS,
  APPLICATION_MENU_GROUPS,
  searchApplicationMenuDestinations,
} from "./applicationMenuContract"

describe("application menu contract", () => {
  it("keeps product destinations grouped without internal routes", () => {
    expect(APPLICATION_MENU_GROUPS.map((group) => group.id)).toEqual([
      "create",
      "insights",
      "account",
      "support",
    ])
    expect(APPLICATION_MENU_DESTINATIONS.map((destination) => destination.path)).not.toContain("/reference-studio")
    expect(APPLICATION_MENU_DESTINATIONS.map((destination) => destination.path)).not.toContain("/audit")
    expect(APPLICATION_MENU_DESTINATIONS.map((destination) => destination.path)).not.toContain("/bench")
  })

  it("finds destinations from labels, descriptions and creator-facing aliases", () => {
    expect(searchApplicationMenuDestinations("thumbnail").map(({ id }) => id)).toEqual(["studio"])
    expect(searchApplicationMenuDestinations("retention").map(({ id }) => id)).toEqual(["analytics", "graphs"])
    expect(searchApplicationMenuDestinations("gemini key").map(({ id }) => id)).toEqual(["ai-integrations"])
    expect(searchApplicationMenuDestinations("recommendations").map(({ id }) => id)).toEqual(["resources"])
  })

  it("returns the grouped inventory for an empty query and no rows for an unknown query", () => {
    expect(searchApplicationMenuDestinations(" ")).toHaveLength(APPLICATION_MENU_DESTINATIONS.length)
    expect(searchApplicationMenuDestinations("destination-that-does-not-exist")).toEqual([])
  })
})

describe("Gemini key setup access", () => {
  it("keeps AI & Integrations available without an account-plan or owner gate", async () => {
    const fs = await import("node:fs")
    const path = await import("node:path")
    const menuSource = fs.readFileSync(
      path.resolve(process.cwd(), "src/components/navigation/ApplicationAccountMenu.tsx"),
      "utf8",
    )
    const navSource = fs.readFileSync(
      path.resolve(process.cwd(), "src/components/navigation/AdaptiveNavigationShell.tsx"),
      "utf8",
    )
    const settingsSource = fs.readFileSync(
      path.resolve(process.cwd(), "src/views/Settings.tsx"),
      "utf8",
    )
    const aiPanelSource = fs.readFileSync(
      path.resolve(process.cwd(), "src/views/settings/SettingsAiPanel.tsx"),
      "utf8",
    )

    expect(APPLICATION_MENU_DESTINATIONS.some((destination) => destination.id === "ai-integrations")).toBe(true)
    expect(menuSource).not.toContain("canSeeApiKeys")
    expect(navSource).not.toContain("const canSeeApiKeys =")
    expect(navSource).not.toContain("canSeeApiKeys={canSeeApiKeys}")
    expect(settingsSource).not.toContain("canViewGeminiKey")
    expect(aiPanelSource).not.toContain("canViewGeminiKey")
    expect(aiPanelSource).toContain("settings-gemini-key")
  })
})
