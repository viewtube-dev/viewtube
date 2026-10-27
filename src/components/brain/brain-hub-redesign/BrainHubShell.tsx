import * as React from "react"
import {
  BrainHubPrimaryNav,
  type BrainHubPaneId,
} from "./BrainHubPrimaryNav"
import { BrainHubUtilityRow } from "./BrainHubUtilityRow"
import { BrainHubComposer } from "./BrainHubComposer"

export type BrainHubShellProps = {
  /** Controlled pane; defaults to internal state if omitted */
  activePane?: BrainHubPaneId
  defaultPane?: BrainHubPaneId
  onPaneChange?: (pane: BrainHubPaneId) => void

  /** Status strip */
  channelLabel?: string
  channelConnected?: boolean
  projectLabel?: string
  modeLabel?: string
  statusDetail?: string

  /** Message column */
  children?: React.ReactNode

  /** Composer */
  draft: string
  onDraftChange: (value: string) => void
  onSend: () => void
  sending?: boolean
  composerDisabled?: boolean

  /** Utility actions */
  onOpenPrompts: () => void
  onOpenContext: () => void
  onOpenTools?: () => void

  className?: string
}

function useIsDesktop(minWidth = 768) {
  const [desktop, setDesktop] = React.useState(false)
  React.useEffect(() => {
    const mq = window.matchMedia(`(min-width: ${minWidth}px)`)
    const apply = () => setDesktop(mq.matches)
    apply()
    mq.addEventListener("change", apply)
    return () => mq.removeEventListener("change", apply)
  }, [minWidth])
  return desktop
}

/**
 * AI Brain module shell:
 * title → split-rail nav → prompts/context utilities → status → messages → composer
 */
export function BrainHubShell({
  activePane: activePaneProp,
  defaultPane = "chat",
  onPaneChange,
  channelLabel = "Not connected",
  channelConnected = false,
  projectLabel = "None",
  modeLabel = "Ready",
  statusDetail,
  children,
  draft,
  onDraftChange,
  onSend,
  sending = false,
  composerDisabled = false,
  onOpenPrompts,
  onOpenContext,
  onOpenTools,
  className,
}: BrainHubShellProps) {
  const [internalPane, setInternalPane] = React.useState<BrainHubPaneId>(defaultPane)
  const activePane = activePaneProp ?? internalPane
  const desktop = useIsDesktop()
  const controlSize = desktop ? "standard" : "compact"

  const setPane = (pane: BrainHubPaneId) => {
    if (activePaneProp === undefined) setInternalPane(pane)
    onPaneChange?.(pane)
  }

  return (
    <section
      className={["vt-brain-hub-shell", className].filter(Boolean).join(" ")}
      aria-labelledby="brain-hub-title"
    >
      <header className="vt-brain-hub-shell__header">
        <div className="vt-brain-hub-shell__title-row">
          <span className="vt-brain-hub-shell__glyph" aria-hidden>
            <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M8 9a4 4 0 018 0c0 3-2 4-2 7H10c0-3-2-4-2-7z" />
              <path d="M10 20h4M9 16h6" strokeLinecap="round" />
            </svg>
          </span>
          <h1 id="brain-hub-title" className="vt-brain-hub-shell__title">
            AI BRAIN
          </h1>
        </div>

        <BrainHubPrimaryNav
          active={activePane}
          onChange={setPane}
          size={controlSize}
        />

        <BrainHubUtilityRow
          size="compact"
          onOpenPrompts={onOpenPrompts}
          onOpenContext={onOpenContext}
          onOpenTools={onOpenTools}
        />
      </header>

      <div className="vt-brain-hub-shell__status" role="status">
        <div className="vt-brain-hub-shell__status-grid">
          <div>
            <span className="vt-brain-hub-shell__status-key">Channel</span>
            <span
              className={
                channelConnected
                  ? "vt-brain-hub-shell__status-val"
                  : "vt-brain-hub-shell__status-val is-warn"
              }
            >
              {channelLabel}
            </span>
          </div>
          <div>
            <span className="vt-brain-hub-shell__status-key">Project</span>
            <span className="vt-brain-hub-shell__status-val">{projectLabel}</span>
          </div>
          <div>
            <span className="vt-brain-hub-shell__status-key">Mode</span>
            <span className="vt-brain-hub-shell__status-val">{modeLabel}</span>
          </div>
        </div>
        {statusDetail ? (
          <p className="vt-brain-hub-shell__status-detail">{statusDetail}</p>
        ) : null}
      </div>

      <div
        className="vt-brain-hub-shell__panel"
        role="tabpanel"
        id={`brain-hub-panel-${activePane}`}
        aria-labelledby={`brain-hub-tab-${activePane}`}
      >
        {children}
      </div>

      {activePane === "chat" ? (
        <BrainHubComposer
          value={draft}
          onChange={onDraftChange}
          onSend={onSend}
          sending={sending}
          disabled={composerDisabled}
        />
      ) : null}
    </section>
  )
}
