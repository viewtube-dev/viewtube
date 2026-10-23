import React from "react"
import { describe, expect, it } from "vitest"
import { renderToStaticMarkup } from "react-dom/server"
import {
  BrainChatStatusBadge,
  BrainChatMessageShell,
  BrainResponseSectionHeader,
  BrainChatActionButtonGroup,
  BrainPromptLibraryItem,
  BrainComposerAccessoryRow,
  BrainResponseLayout,
  BrainComposerShell,
  ChatConversationViewport,
} from "./BrainChatPrimitives"

const render = (node: React.ReactNode): string => renderToStaticMarkup(<>{node}</>)

describe("Brain Studio chat primitives", () => {
  it("renders explicit status labels without inferring evidence or success", () => {
    const html = render(<BrainChatStatusBadge status="partial" />)
    expect(html).toContain('data-status="partial"')
    expect(html).toContain("Partial")
  })

  it("keeps message role semantics and long content wrap-safe", () => {
    const html = render(<BrainChatMessageShell role="user">{ "a".repeat(400) }</BrainChatMessageShell>)
    expect(html).toContain('aria-label="Your message"')
    expect(html).toContain('data-message-role="user"')
    expect(html).toContain("[overflow-wrap:anywhere]")
    expect(html).toContain("a".repeat(400))
  })

  it("renders a response header with optional metadata", () => {
    const html = render(<BrainResponseSectionHeader title="Evidence" metadata={<span>Unavailable</span>} />)
    expect(html).toContain("<h3")
    expect(html).toContain("Evidence")
    expect(html).toContain("Unavailable")
  })

  it("exposes the action group label and disabled action state", () => {
    const html = render(
      <BrainChatActionButtonGroup
        label="Turn actions"
        actions={[
          { id: "retry", label: "Retry", onSelect: () => undefined },
          { id: "save", label: "Save", onSelect: () => undefined, disabled: true },
        ]}
      />,
    )
    expect(html).toContain('role="group"')
    expect(html).toContain('aria-label="Turn actions"')
    expect(html).toContain("Retry")
    expect(html).toContain("Save")
    expect(html).toMatch(/disabled(?:="")?/)
  })

  it("exposes prompt selection and disabled state through semantic button attributes", () => {
    const selected = render(<BrainPromptLibraryItem title="Plan video" description="Start a plan" selected onSelect={() => undefined} />)
    const disabled = render(<BrainPromptLibraryItem title="Unavailable prompt" disabled onSelect={() => undefined} />)
    expect(selected).toContain('aria-pressed="true"')
    expect(selected).toContain('data-vt-studio-brain-control="prompt-library-item"')
    expect(selected).toContain('data-vt-studio-button="true"')
    expect(disabled).toMatch(/disabled(?:="")?/)
    expect(disabled).toContain("Unavailable prompt")
  })

  it("labels accessory controls as a group", () => {
    const html = render(<BrainComposerAccessoryRow><button type="button">Attach</button></BrainComposerAccessoryRow>)
    expect(html).toContain('role="group"')
    expect(html).toContain('aria-label="Composer options"')
    expect(html).toContain("Attach")
  })

  it("composes response title, status, content, actions, and footer in one accessible layout", () => {
    const html = render(
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
    expect(html).toContain('data-vt-brain-component="BrainResponseLayout"')
    expect(html).toContain('aria-label="Growth plan"')
    expect(html).toContain("<h3")
    expect(html).toContain("Growth plan")
    expect(html).toContain("ViewTube Copilot")
    expect(html).toContain("Partial")
    expect(html).toContain("Three practical next steps")
    expect(html).toContain("Retry")
    expect(html).toContain("Evidence provenance")
  })

  it("provides a named composer shell with safe-area padding", () => {
    const html = render(<BrainComposerShell><button type="button">Send prompt</button></BrainComposerShell>)
    expect(html).toContain('data-vt-brain-component="BrainComposer"')
    expect(html).toContain('aria-label="Brain composer"')
    expect(html).toContain("env(safe-area-inset-bottom)")
    expect(html).toContain("Send prompt")
  })

  it("provides one labelled conversation log with a bottom sentinel", () => {
    const html = render(
      <ChatConversationViewport viewportRef={React.createRef<HTMLDivElement>()} bottomRef={React.createRef<HTMLDivElement>()}>
        <p>Newest turn</p>
      </ChatConversationViewport>,
    )
    expect(html).toContain('role="log"')
    expect(html).toContain('aria-label="Brain conversation"')
    expect(html).toContain("Newest turn")
    expect(html).toContain('aria-hidden="true"')
  })

})
