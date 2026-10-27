import React, { useCallback, useMemo } from "react"
import { BookOpen, MessageSquare, Settings2, UserRound } from "lucide-react"
import type { StudioLedAlert, StudioLedAnimation, StudioLedTone } from "../../studio-ui"

export type BrainPageTabId = "chat" | "my-brain" | "review" | "controls"
type TabSignal = { led?: "off" | "solid" | "rainbow"; animation?: StudioLedAnimation; alert?: StudioLedAlert; tone?: StudioLedTone }
const DEFAULT_TABS: Array<{ id: BrainPageTabId; label: string; icon: React.ReactNode; tone: StudioLedTone }> = [
  { id: "chat", label: "CHAT", icon: <MessageSquare aria-hidden="true" />, tone: "cyan" },
  { id: "my-brain", label: "PROFILE", icon: <UserRound aria-hidden="true" />, tone: "purple" },
  { id: "review", label: "LEARNING", icon: <BookOpen aria-hidden="true" />, tone: "yellow" },
  { id: "controls", label: "ACCESS", icon: <Settings2 aria-hidden="true" />, tone: "green" },
]
export type BrainPageTabsProps = {
  activeTab: BrainPageTabId
  onChange: (tab: BrainPageTabId) => void
  tabSignals?: Partial<Record<BrainPageTabId, TabSignal>>
  className?: string
}
/** Responsive split-rail navigation for the four existing Brain destinations. */
export const BrainPageTabs: React.FC<BrainPageTabsProps> = ({ activeTab, onChange, tabSignals, className = "" }) => {
  const tabs = useMemo(() => DEFAULT_TABS.map((tab) => ({ ...tab, ...(tabSignals?.[tab.id] || {}) })), [tabSignals])
  const onKeyDown = useCallback((event: React.KeyboardEvent<HTMLDivElement>) => {
    const order = tabs.map((tab) => tab.id), index = order.indexOf(activeTab)
    let nextIndex = -1
    if (event.key === "ArrowRight" || event.key === "ArrowDown") nextIndex = (index + 1) % order.length
    else if (event.key === "ArrowLeft" || event.key === "ArrowUp") nextIndex = (index - 1 + order.length) % order.length
    else if (event.key === "Home") nextIndex = 0
    else if (event.key === "End") nextIndex = order.length - 1
    if (nextIndex < 0) return
    event.preventDefault()
    const nextId = order[nextIndex]
    event.currentTarget.querySelector<HTMLButtonElement>(`#brain-page-tab-${nextId}`)?.focus()
    onChange(nextId)
  }, [activeTab, onChange, tabs])
  return (
    <div role="tablist" aria-label="Brain pages" data-vt-brain-component="BrainPageTabs" data-size="standard"
      className={`vt-brain-hub-primary-nav vt-studio-split-rail-accordion shrink-0 ${className}`.trim()} onKeyDown={onKeyDown}>
      {tabs.map((tab) => {
        const active = activeTab === tab.id
        return (
          <div key={tab.id} className="vt-studio-split-rail-accordion__item" data-active={active ? "true" : "false"} data-tone={tab.tone} role="presentation">
            <button type="button" role="tab" data-vt-studio-split-rail-icon aria-selected={active}
              aria-controls={`brain-page-panel-${tab.id}`} id={`brain-page-tab-${tab.id}`} aria-label={tab.label}
              tabIndex={active ? 0 : -1} onClick={() => onChange(tab.id)}>
              <span data-vt-studio-split-rail-icon-face>{tab.icon}</span>
            </button>
            <div className="vt-studio-split-rail-accordion__content" aria-hidden={!active}>
              <span data-vt-studio-split-rail-label>{tab.label}</span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
export default BrainPageTabs
