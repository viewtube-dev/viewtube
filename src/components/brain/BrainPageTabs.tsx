import React, { useCallback, useMemo } from "react"
import { StudioLedBadgeTab, type StudioLedAlert, type StudioLedAnimation, type StudioLedTone } from "../../studio-ui"

export type BrainPageTabId = "chat" | "my-brain" | "review" | "controls"
type TabSignal = { led?: "off" | "solid" | "rainbow"; animation?: StudioLedAnimation; alert?: StudioLedAlert; tone?: StudioLedTone }

const DEFAULT_TABS: Array<{ id: BrainPageTabId; label: string; secondLine: string; tone: StudioLedTone }> = [
  { id: "chat", label: "Chat", secondLine: "Ask", tone: "cyan" },
  { id: "my-brain", label: "My Brain", secondLine: "Profile", tone: "purple" },
  { id: "review", label: "Review", secondLine: "Learning", tone: "yellow" },
  { id: "controls", label: "Controls", secondLine: "Access", tone: "green" },
]

export type BrainPageTabsProps = {
  activeTab: BrainPageTabId
  onChange: (tab: BrainPageTabId) => void
  tabSignals?: Partial<Record<BrainPageTabId, TabSignal>>
  className?: string
}

/** Four flush Brain destinations. Prompt Library, Capabilities, and Channel Context remain composer launchers. */
export const BrainPageTabs: React.FC<BrainPageTabsProps> = ({ activeTab, onChange, tabSignals, className = "" }) => {
  const tabs = useMemo(() => DEFAULT_TABS.map((tab) => ({ ...tab, ...(tabSignals?.[tab.id] || {}) })), [tabSignals])

  const onKeyDown = useCallback((event: React.KeyboardEvent<HTMLDivElement>) => {
    const order = tabs.map((tab) => tab.id)
    const index = order.indexOf(activeTab)
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
    <div role="tablist" aria-label="Brain pages" data-vt-brain-component="BrainPageTabs"
      className={`vt-studio-led-badge-tab-row shrink-0 ${className}`.trim()} onKeyDown={onKeyDown}>
      {tabs.map((tab) => (
        <StudioLedBadgeTab
          key={tab.id}
          id={`brain-page-tab-${tab.id}`}
          mode="tab"
          label={tab.label}
          firstLine={tab.label}
          secondLine={tab.secondLine}
          active={activeTab === tab.id}
          tone={tab.tone}
          led={tab.led ?? "solid"}
          animation={tab.animation ?? "steady"}
          alert={tab.alert ?? "none"}
          sizeVariant="compact"
          tabIndex={activeTab === tab.id ? 0 : -1}
          aria-controls={`brain-page-panel-${tab.id}`}
          aria-label={`${tab.label} · ${tab.secondLine}`}
          onClick={() => onChange(tab.id)}
        />
      ))}
    </div>
  )
}

export default BrainPageTabs
