import React from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it, vi } from "vitest"

import { SettingsAiPanel } from "./SettingsAiPanel"

describe("SettingsAiPanel", () => {
  it("keeps Brain, model and API-key controls available without an entitlement gate", () => {
    const html = renderToStaticMarkup(
      <SettingsAiPanel
        geminiKey=""
        showKey={false}
        settingsSaveStatus={null}
        modelSelector={<div data-model-selector>Model Selector</div>}
        onOpenAiBrainIntake={vi.fn()}
        onSaveGeminiKey={vi.fn()}
        onToggleShowKey={vi.fn()}
        onUpdateGeminiKey={vi.fn()}
      />,
    )

    expect(html).toContain("Creator Brain")
    expect(html).toContain("Model Runtime")
    expect(html).toContain("Model Selector")
    expect(html).toContain("API Key / BYOK")
    expect(html).toContain("settings-gemini-key")
    expect(html).toContain('data-vt-control-level="l1"')
    expect(html).not.toContain("Model orchestration")
    expect(html).not.toContain("Bring your own key")
  })

  it("renders BYOK controls and saved status without an account-plan prop", () => {
    const html = renderToStaticMarkup(
      <SettingsAiPanel
        geminiKey="secret"
        showKey={false}
        settingsSaveStatus="API key saved."
        modelSelector={<div>Model Selector</div>}
        onOpenAiBrainIntake={vi.fn()}
        onSaveGeminiKey={vi.fn()}
        onToggleShowKey={vi.fn()}
        onUpdateGeminiKey={vi.fn()}
      />,
    )

    expect(html).toContain("API Key / BYOK")
    expect(html).toContain('type="password"')
    expect(html).toContain("API key saved.")
  })
})
