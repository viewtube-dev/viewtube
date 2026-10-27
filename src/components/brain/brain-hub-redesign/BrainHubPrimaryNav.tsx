import * as React from "react"

export type BrainHubPaneId = "chat" | "profile" | "learning" | "access"

export type BrainHubPrimaryNavProps = {
  active: BrainHubPaneId
  onChange: (pane: BrainHubPaneId) => void
  /** compact on mobile, standard on desktop — parent can pass from breakpoint */
  size?: "compact" | "standard"
  className?: string
}

const PANES: Array<{
  id: BrainHubPaneId
  label: string
  icon: React.ReactNode
}> = [
  {
    id: "chat",
    label: "CHAT",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
        <path d="M4 6h16v10H8l-4 4V6z" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    id: "profile",
    label: "PROFILE",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
        <circle cx="12" cy="9" r="3.5" />
        <path d="M5 19c1.5-3 4-4.5 7-4.5S17.5 16 19 19" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: "learning",
    label: "LEARNING",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
        <path d="M4 6h10v12H4zM14 9h6v9h-6" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    id: "access",
    label: "ACCESS",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
        <circle cx="12" cy="12" r="3" />
        <path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2" strokeLinecap="round" />
      </svg>
    ),
  },
]

const SLIDE_MS = 280

/**
 * Primary Brain Hub nav — Studio split-rail accordion pattern.
 * One open pane label at a time; icons always visible and square.
 */
export function BrainHubPrimaryNav({
  active,
  onChange,
  size = "compact",
  className,
}: BrainHubPrimaryNavProps) {
  const [locked, setLocked] = React.useState(false)
  const lockTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null)

  React.useEffect(
    () => () => {
      if (lockTimer.current) clearTimeout(lockTimer.current)
    },
    [],
  )

  const activate = (id: BrainHubPaneId) => {
    if (locked || id === active) return
    setLocked(true)
    onChange(id)
    if (lockTimer.current) clearTimeout(lockTimer.current)
    lockTimer.current = setTimeout(() => {
      setLocked(false)
      lockTimer.current = null
    }, SLIDE_MS)
  }

  return (
    <div
      className={["vt-brain-hub-primary-nav", "vt-studio-split-rail-accordion", className]
        .filter(Boolean)
        .join(" ")}
      data-vt-studio-control="true"
      data-size={size}
      role="tablist"
      aria-label="Brain Hub sections"
    >
      {PANES.map((pane) => {
        const isActive = pane.id === active
        return (
          <div
            key={pane.id}
            className="vt-studio-split-rail-accordion__item"
            data-active={isActive ? "true" : "false"}
            role="presentation"
          >
            <button
              type="button"
              role="tab"
              data-vt-studio-split-rail-icon
              aria-selected={isActive}
              aria-controls={`brain-hub-panel-${pane.id}`}
              id={`brain-hub-tab-${pane.id}`}
              tabIndex={isActive ? 0 : -1}
              onClick={() => activate(pane.id)}
            >
              <span data-vt-studio-split-rail-icon-face>{pane.icon}</span>
            </button>
            <div
              className="vt-studio-split-rail-accordion__content"
              aria-hidden={!isActive}
            >
              <span data-vt-studio-split-rail-label>{pane.label}</span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
