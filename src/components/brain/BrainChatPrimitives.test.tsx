import React from "react"
import { describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import {
  BrainChatStatusBadge,
  BrainChatMessageShell,
  BrainResponseSectionHeader,
  BrainChatActionButtonGroup,
  BrainPromptLibraryItem,
  BrainComposerAccessoryRow,
  BrainResponseLayout,
} from "./BrainChatPrimitives"

describe("Brain Studio chat primitives", () => {
  it("renders explicit status labels without inferring evidence or success", () => {
    const { container } = render(<BrainChatStatusBadge status="partial" />)
    expect(screen.getByText("Partial")).toBeInTheDocument()
    expect(container.querySelector('[data-status="partial"]')).toBeInTheDocument()
  })

  it("keeps message role semantics and long content wrap-safe", () => {
    render(<BrainChatMessageShell role="user">{ "a".repeat(400) }</BrainChatMessageShell>)
    expect(screen.getByRole("article", { name: "Your message" })).toHaveAttribute("data-message-role", "user")
  })

  it("renders a response header with optional metadata", () => {
    render(<BrainResponseSectionHeader title="Evidence" metadata={<span>Unavailable</span>} />)
    expect(screen.getByRole("heading", { name: "Evidence" })).toBeInTheDocument()
    expect(screen.getByText("Unavailable")).toBeInTheDocument()
  })

  it("keeps action handlers wired and exposes disabled actions", () => {
    const onSelect = vi.fn()
    render(<BrainChatActionButtonGroup actions={[{ id: "retry", label: "Retry", onSelect }, { id: "save", label: "Save", onSelect, disabled: true }]} />)
    screen.getByRole("button", { name: "Retry" }).click()
    expect(onSelect).toHaveBeenCalledTimes(1)
    expect(screen.getByRole("button", { name: "Save" })).toBeDisabled()
  })

  it("exposes prompt selection state and disabled state", () => {
    render(<BrainPromptLibraryItem title="Plan video" description="Start a plan" selected onSelect={() => {}} />)
    expect(screen.getByRole("button", { name: /Plan video/ })).toHaveAttribute("aria-pressed", "true")
  })

  it("labels accessory controls as a group", () => {
    render(<BrainComposerAccessoryRow><button>Attach</button></BrainComposerAccessoryRow>)
    expect(screen.getByRole("group", { name: "Composer options" })).toBeInTheDocument()
  })
  it("composes response title, status, content, actions, and footer in one accessible layout", () => {
    render(
      <BrainResponseLayout
        title="Growth plan"
        attribution="ViewTube Copilot"
        status={<span>Partial</span>}
        actions={<button type="button">Retry</button>}
        footer={<p>Evidence provenance</p>}
      >
        <p>Three practical next steps</p>
      </BrainResponseLayout>,
    )
    expect(screen.getByRole("article", { name: "Growth plan" })).toBeInTheDocument()
    expect(screen.getByRole("heading", { name: "Growth plan" })).toBeInTheDocument()
    expect(screen.getByText("ViewTube Copilot")).toBeInTheDocument()
    expect(screen.getByText("Partial")).toBeInTheDocument()
    expect(screen.getByText("Three practical next steps")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Retry" })).toBeInTheDocument()
    expect(screen.getByText("Evidence provenance")).toBeInTheDocument()
  })

})