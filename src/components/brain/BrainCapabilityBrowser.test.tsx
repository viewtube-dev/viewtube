import React from "react"
import { describe, expect, it } from "vitest"
import { renderToStaticMarkup } from "react-dom/server"
import type { BrainCapabilityDefinition } from "../../types"
import {
  BrainCapabilityActions,
  capabilityPromptFor,
  type BrainCapabilityAvailability,
} from "./BrainCapabilityBrowser"

const capability = {
  id: "audience-language",
  label: "Audience Language",
  description: "Find audience interests and wording.",
  intents: ["audience", "language"],
  requiresChannelData: false,
} as BrainCapabilityDefinition

const ready: BrainCapabilityAvailability = {
  status: "ready",
  label: "Available to request",
  reason: "Brain checks request fit, permissions, and evidence when sent.",
}

describe("Brain capability prompt actions", () => {
  it("uses the same two-line Edit First and Send to Chat controls as the Prompt Library", () => {
    const html = renderToStaticMarkup(
      <BrainCapabilityActions
        capability={capability}
        availability={ready}
        onPrompt={() => undefined}
        onEdit={() => undefined}
        onClose={() => undefined}
      />,
    )

    expect(html).toContain("EDIT")
    expect(html).toContain("FIRST")
    expect(html).toContain("SEND TO")
    expect(html).toContain("CHAT")
    expect(html).toContain('data-vt-studio-button="true"')
    expect(html).toContain('class="vt-brain-tool-surface__actions is-pair"')
  })

  it("keeps Send to Chat disabled when capability access is blocked or the browser is busy", () => {
    const blocked: BrainCapabilityAvailability = {
      status: "blocked",
      label: "Analytics access off",
      reason: "Enable analytics access in Brain controls.",
    }
    const blockedHtml = renderToStaticMarkup(
      <BrainCapabilityActions
        capability={capability}
        availability={blocked}
        onPrompt={() => undefined}
        onClose={() => undefined}
      />,
    )
    const busyHtml = renderToStaticMarkup(
      <BrainCapabilityActions
        capability={capability}
        availability={ready}
        busy
        onPrompt={() => undefined}
        onClose={() => undefined}
      />,
    )

    expect(blockedHtml).toMatch(/disabled(?:="")?/)
    expect(busyHtml).toMatch(/disabled(?:="")?/)
    expect(blockedHtml).not.toContain("EDIT")
  })

  it("creates a transparent guided request without claiming the capability already ran", () => {
    const prompt = capabilityPromptFor(capability)
    expect(prompt).toContain("Help me with audience language.")
    expect(prompt).toContain("what the available evidence supports")
    expect(prompt).toContain("Do not claim this capability ran")
  })
})
