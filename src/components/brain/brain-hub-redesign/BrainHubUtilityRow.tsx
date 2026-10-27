import * as React from "react"

export type BrainHubUtilityRowProps = {
  onOpenPrompts: () => void
  onOpenContext: () => void
  /** Optional: tools still reachable without stacking in composer */
  onOpenTools?: () => void
  promptLauncherRef?: React.Ref<HTMLButtonElement>
  contextLauncherRef?: React.Ref<HTMLButtonElement>
  size?: "compact" | "standard"
  showPrompts?: boolean
  className?: string
}

/**
 * Prompts + Context lifted out of the composer.
 * Studio control attributes for shared shell styling.
 */
export function BrainHubUtilityRow({
  onOpenPrompts,
  onOpenContext,
  onOpenTools,
  promptLauncherRef,
  contextLauncherRef,
  size = "compact",
  showPrompts = true,
  className,
}: BrainHubUtilityRowProps) {
  return (
    <div
      className={["vt-brain-hub-utility-row", className].filter(Boolean).join(" ")}
      role="toolbar"
      aria-label="Brain utilities"
    >
      {showPrompts ? (
        <button
          type="button"
          className="vt-brain-hub-utility-btn"
          data-vt-studio-control="true"
          data-size={size}
          data-vt-studio-width="content"
          ref={promptLauncherRef}
          onClick={onOpenPrompts}
        >
          <span data-vt-studio-button-face>
            <span className="vt-brain-hub-utility-btn__icon" aria-hidden>
              <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" strokeWidth="2.4">
                <path d="M7 5h10v14H7zM9 9h6M9 13h6" strokeLinejoin="round" />
              </svg>
            </span>
            PROMPTS
          </span>
        </button>
      ) : null}

      <button
        type="button"
        className="vt-brain-hub-utility-btn"
        data-vt-studio-control="true"
        data-size={size}
        data-vt-studio-width="content"
        ref={contextLauncherRef}
        onClick={onOpenContext}
      >
        <span data-vt-studio-button-face>
          <span className="vt-brain-hub-utility-btn__icon" aria-hidden>
            <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" strokeWidth="2.4">
              <circle cx="12" cy="12" r="8" />
              <path d="M12 8v8M8 12h8" strokeLinecap="round" />
            </svg>
          </span>
          CONTEXT
        </span>
      </button>

      {onOpenTools ? (
        <button
          type="button"
          className="vt-brain-hub-utility-btn"
          data-vt-studio-control="true"
          data-size={size}
          data-vt-studio-width="content"
          onClick={onOpenTools}
        >
          <span data-vt-studio-button-face>
            <span className="vt-brain-hub-utility-btn__icon" aria-hidden>
              <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" strokeWidth="2.4">
                <path d="M4 7h6v10H4zM14 7h6v4h-6zM14 14h6v3h-6z" strokeLinejoin="round" />
              </svg>
            </span>
            TOOLS
          </span>
        </button>
      ) : null}
    </div>
  )
}
