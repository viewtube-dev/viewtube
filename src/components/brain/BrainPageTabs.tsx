import React, { useMemo } from "react"
import { BookOpen, MessageSquare, Settings2, UserRound } from "lucide-react"
import { StudioSplitAccordion, type StudioSplitAccordionItem, type StudioLedAlert, type StudioLedAnimation, type StudioLedTone } from "../../studio-ui"

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
/** The Brain's primary navigation uses the canonical Studio split-rail accordion. */
export const BrainPageTabs: React.FC<BrainPageTabsProps> = ({ activeTab, onChange, className = "" }) => {
  const tabs = useMemo(() => DEFAULT_TABS, [])
  const activeIndex = Math.max(0, tabs.findIndex((tab) => tab.id === activeTab))
  const items = useMemo<readonly StudioSplitAccordionItem[]>(
    () => tabs.map((tab) => ({
      id: tab.id,
      accessibleLabel: tab.label,
      icon: tab.icon,
      content: <span>{tab.label}</span>,
    })),
    [tabs],
  )
  return (
    <StudioSplitAccordion
      items={items}
      data-vt-brain-component="BrainPageTabs"
      aria-label="Brain pages"
      sizeVariant="standard"
      activeIndex={activeIndex}
      onActiveIndexChange={(index) => {
        const tab = tabs[index]
        if (tab) onChange(tab.id)
      }}
      className={`vt-brain-page-split-accordion shrink-0 ${className}`.trim()}
    />
  )
}
export default BrainPageTabs
