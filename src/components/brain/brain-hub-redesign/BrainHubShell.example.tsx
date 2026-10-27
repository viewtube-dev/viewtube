/**
 * Example wiring — replace handlers with real Brain Hub store / dialogs.
 */
import * as React from "react"
import { BrainHubShell } from "./BrainHubShell"
import type { BrainHubPaneId } from "./BrainHubPrimaryNav"
import "./brain-hub-shell.css"

export function BrainHubShellExample() {
  const [pane, setPane] = React.useState<BrainHubPaneId>("chat")
  const [draft, setDraft] = React.useState("")
  const [messages, setMessages] = React.useState<string[]>([
    "Use your strongest comparable upload as the control sample. Keep the same viewer payoff and structure, then change the topic angle so it feels fresh rather than copied.",
  ])

  return (
    <BrainHubShell
      activePane={pane}
      onPaneChange={setPane}
      channelLabel="Not connected"
      channelConnected={false}
      projectLabel="None"
      modeLabel="Ready"
      statusDetail="Public handle mode when a channel handle is set in Settings."
      draft={draft}
      onDraftChange={setDraft}
      onSend={() => {
        const text = draft.trim()
        if (!text) return
        setMessages((m) => [...m, text])
        setDraft("")
      }}
      onOpenPrompts={() => {
        /* open prompt library sheet */
      }}
      onOpenContext={() => {
        /* open context drawer */
      }}
      onOpenTools={() => {
        /* optional tools sheet */
      }}
    >
      {pane === "chat" ? (
        <div className="vt-brain-hub-messages">
          {messages.map((text, i) => (
            <article key={i} className="vt-brain-hub-message">
              <p style={{ margin: 0, fontWeight: 700, lineHeight: 1.4 }}>{text}</p>
            </article>
          ))}
        </div>
      ) : null}
      {pane === "profile" ? <p>Profile pane — existing My Brain content.</p> : null}
      {pane === "learning" ? <p>Learning pane — existing Review content.</p> : null}
      {pane === "access" ? <p>Access pane — existing Controls content.</p> : null}
    </BrainHubShell>
  )
}
