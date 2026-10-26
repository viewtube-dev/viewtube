import React from "react"
import "../../styles/studio-chat-composer-dock.css"

export type StudioChatComposerDockLayout = "inline-actions" | "toolbar-actions"

export type StudioChatComposerDockProps = {
  status?: React.ReactNode
  chips?: React.ReactNode
  tray?: React.ReactNode
  field: React.ReactNode
  action: React.ReactNode
  layout?: StudioChatComposerDockLayout
  className?: string
  "aria-label"?: string
}

export const StudioChatComposerDock = React.forwardRef<HTMLElement, StudioChatComposerDockProps>(
  function StudioChatComposerDock(
    {
      status,
      chips,
      tray,
      field,
      action,
      layout = "inline-actions",
      className = "",
      "aria-label": ariaLabel = "Message composer",
    },
    ref,
  ) {
    const trayNode = tray ? (
      <div className="vt-studio-chat-composer-dock__tray" data-vt-composer-part="tray" role="toolbar" aria-label="Composer tools">
        {tray}
      </div>
    ) : null

    const actionNode = <div className="vt-studio-chat-composer-dock__action" data-vt-composer-part="action">{action}</div>

    return (
      <footer
        ref={ref}
        data-vt-studio-primitive="StudioChatComposerDock"
        data-vt-library-component="StudioChatComposerDock"
        data-vt-composer-layout={layout}
        aria-label={ariaLabel}
        className={["vt-studio-chat-composer-dock", className].filter(Boolean).join(" ")}
      >
        {status ? <div className="vt-studio-chat-composer-dock__status" data-vt-composer-part="status">{status}</div> : null}
        {chips ? <div className="vt-studio-chat-composer-dock__chips" data-vt-composer-part="chips" role="group" aria-label="Composer context">{chips}</div> : null}
        {layout === "inline-actions" ? trayNode : null}
        <div className="vt-studio-chat-composer-dock__field-row" data-vt-composer-part="field-row">
          <div className="vt-studio-chat-composer-dock__field" data-vt-composer-part="field">{field}</div>
          {layout === "inline-actions" ? actionNode : null}
        </div>
        {layout === "toolbar-actions" ? (
          <div className="vt-studio-chat-composer-dock__bottom-row" data-vt-composer-part="bottom-row">
            {trayNode}
            {actionNode}
          </div>
        ) : null}
      </footer>
    )
  },
)
StudioChatComposerDock.displayName = "StudioChatComposerDock"
export default StudioChatComposerDock
