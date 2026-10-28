import React from "react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { cleanup, fireEvent, render, screen } from "@testing-library/react"
import { ChannelContextSettingsSection } from "./ChannelContextSettingsSection"

const createStorage = () => {
  const values = new Map<string, string>()
  return {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => { values.set(key, value) },
    removeItem: (key: string) => { values.delete(key) },
    clear: () => { values.clear() },
  }
}

describe("ChannelContextSettingsSection local persistence", () => {
  let storage: ReturnType<typeof createStorage>

  beforeEach(() => {
    storage = createStorage()
    vi.stubGlobal("localStorage", storage)
  })

  afterEach(() => {
    cleanup()
    vi.unstubAllGlobals()
  })

  it("persists each answer locally as it is edited and restores it after remount", () => {
    const firstRender = render(<ChannelContextSettingsSection />)
    fireEvent.change(screen.getByLabelText(/What is your channel name\?/i), {
      target: { value: "History Lab" },
    })

    const saved = JSON.parse(storage.getItem("vt_ai_brain_context_v1") || "{}")
    expect(saved.channelContext.identity.name).toBe("History Lab")
    expect(saved.updatedAt).toBeTruthy()
    expect(screen.getByRole("status").textContent).toMatch(/saved locally/i)

    firstRender.unmount()
    render(<ChannelContextSettingsSection />)
    expect(screen.getByLabelText(/What is your channel name\?/i)).toHaveValue("History Lab")
  })

  it("persists textarea answers and array answers through the same Creator Brain profile", () => {
    render(<ChannelContextSettingsSection />)
    fireEvent.change(screen.getByLabelText(/Describe your channel in one sentence\./i), {
      target: { value: "Research-led history explainers for curious viewers." },
    })
    fireEvent.change(screen.getByLabelText(/Which themes should AI prioritize\?/i), {
      target: { value: "primary sources, overlooked campaigns" },
    })

    const saved = JSON.parse(storage.getItem("vt_ai_brain_context_v1") || "{}")
    expect(saved.channelContext.identity.description).toBe("Research-led history explainers for curious viewers.")
    expect(saved.channelContext.content.priorityThemes).toEqual(["primary sources", "overlooked campaigns"])
    expect(saved.channelDescription).toBe("Research-led history explainers for curious viewers.")
  })
})
