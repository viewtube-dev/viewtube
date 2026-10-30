import React, { useMemo } from "react"
import { BookOpen, Database, MessageSquare, Settings2, UserRound } from "lucide-react"
import { StudioSplitAccordion, type StudioSplitAccordionItem } from "../../studio-ui"

export type BrainPageTabId = "chat" | "my-brain" | "evidence" | "review" | "controls"

const DEFAULT_TABS: Array<{ id: BrainPageTabId; label: string; icon: React.ReactNode }> = [
  { id: "chat", label: "CHAT", icon: <MessageSquare aria-hidden="true" /> },
  { id: "my-brain", label: "PROFILE", icon: <UserRound aria-hidden="true" /> },
  { id: "evidence", label: "EVIDENCE", icon: <Database aria-hidden="true" /> },
  { id: "review", label: "LEARNING", icon: <BookOpen aria-hidden="true" /> },
  { id: "controls", label: "ACCESS", icon: <Settings2 aria-hidden="true" /> },
]

export type BrainPageTabsProps = {
  activeTab: BrainPageTabId
  onChange: (tab: BrainPageTabId) => void
  tabSignals?: Partial<Record<BrainPageTabId, { led?: "off" | "solid" | "rainbow"; animation?: string; alert?: string; tone?: string }>>
  className?: string
}

/** Brain destinations use the canonical Studio Split Accordion primitive and its default styling. */
export const BrainPageTabs: React.FC<BrainPageTabsProps> = ({ activeTab, onChange, className = "" }) => {
  const items = useMemo<readonly StudioSplitAccordionItem[]>(
    () => DEFAULT_TABS.map((tab) => ({
      id: tab.id,
      accessibleLabel: tab.label,
      icon: tab.icon,
      content: <span>{tab.label}</span>,
    })),
    [],
  )
  const activeIndex = Math.max(0, DEFAULT_TABS.findIndex((tab) => tab.id === activeTab))

  return (
    <StudioSplitAccordion
      items={items}
      activeIndex={activeIndex}
      onActiveIndexChange={(index) => {
        const tab = DEFAULT_TABS[index]
        if (tab) onChange(tab.id)
      }}
      accessibleLabel="Brain pages"
      className={`vt-brain-hub-primary-nav ${className}`.trim()}
      data-vt-brain-component="BrainPageTabs"
      data-vt-library-component="StudioSplitAccordion"
    />
  )
}

export default BrainPageTabs
