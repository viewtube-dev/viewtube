/**
 * Confirmed Library specimens for the StudioSplitAccordion train motion.
 * Each specimen row owns independent selection state.
 */
import React from "react"
import {
  LayoutDashboard,
  Sparkles,
  FolderKanban,
  Brain,
  BarChart3,
  PenLine,
  Archive,
  BookOpen,
  Settings2,
  Compass,
} from "lucide-react"
import { StudioSplitAccordion } from "../../studio-ui/primitives/StudioSplitAccordion"
import type { StudioSplitAccordionItem } from "../../studio-ui/primitives/StudioSplitAccordion"
import { PRIMARY_NAV_ITEMS } from "../navigation/navigationContract"
import { NavIcon } from "../navigation/navIcons"
import { getNavPaletteColor } from "../../styles/toolboxPalette"

const ICONS = [
  LayoutDashboard,
  Sparkles,
  FolderKanban,
  Brain,
  BarChart3,
  PenLine,
  Archive,
  BookOpen,
  Settings2,
  Compass,
]
const LABELS = [
  "Dashboard",
  "Studio",
  "Projects",
  "AI Brain",
  "Analytics",
  "Editor",
  "Vault",
  "Resources",
  "Settings",
  "User Guide",
]

function makeItems(count: number): StudioSplitAccordionItem[] {
  return Array.from({ length: count }, (_, index) => {
    const Icon = ICONS[index % ICONS.length]
    const label = LABELS[index % LABELS.length]
    return {
      id: `split-accordion-${count}-${index}`,
      accessibleLabel: label,
      icon: <Icon aria-hidden="true" />,
      content: label,
    }
  })
}

/**
 * Site primary navigation → split accordion.
 * - Panel (content) fill = that page’s nav button colour (`paletteIndex`).
 * - Icon rail fill = the *next* nav page’s colour (wraps User Guide → Dashboard).
 * Icons use the shared Phosphor “fill” nav set so weight matches production nav.
 */
export function makeViewTubeNavigationItems(): StudioSplitAccordionItem[] {
  const count = PRIMARY_NAV_ITEMS.length
  return PRIMARY_NAV_ITEMS.map((item, index) => {
    const next = PRIMARY_NAV_ITEMS[(index + 1) % count]
    const panelColor = getNavPaletteColor(item.paletteIndex)
    const iconColor = getNavPaletteColor(next.paletteIndex)
    return {
      id: `vt-nav-split-${item.id}`,
      accessibleLabel: item.label,
      icon: <NavIcon id={item.iconId} weight="fill" />,
      content: item.label,
      style: {
        // Icon face / trigger uses the next page’s nav colour.
        ["--vt-sa-s" as string]: iconColor,
        // Expanded panel uses this page’s nav colour.
        ["--vt-sa-p" as string]: panelColor,
        // Keep the open panel text readable on bright spectrum fills.
        color: "#000",
      } as React.CSSProperties,
    }
  })
}

function SpecimenRow({
  title,
  count,
  size,
}: {
  title: string
  count: number
  size: "supreme" | "standard" | "compact" | "mini" | "micro"
}) {
  const [activeIndex, setActiveIndex] = React.useState(0)
  const items = React.useMemo(() => makeItems(count), [count])
  return (
    <div
      className="vt-confirmed-accordion-specimen"
      data-size={size}
      data-count={count}
      style={{
        display: "grid",
        gridTemplateColumns: "minmax(0, 1fr)",
        gap: 4,
        marginBlock: 4,
        width: "100%",
        minWidth: 0,
      }}
    >
      <small style={{ display: "block", fontWeight: 1000, fontSize: 11, textTransform: "uppercase" }}>
        {title}
      </small>
      <StudioSplitAccordion
        sizeVariant={size}
        items={items}
        activeIndex={activeIndex}
        onActiveIndexChange={setActiveIndex}
        accessibleLabel={title}
      />
    </div>
  )
}

function NavigationSpecimenRow({
  title,
  size,
}: {
  title: string
  size: "supreme" | "standard" | "compact" | "mini" | "micro"
}) {
  const [activeIndex, setActiveIndex] = React.useState(0)
  const items = React.useMemo(() => makeViewTubeNavigationItems(), [])
  return (
    <div
      className="vt-confirmed-accordion-specimen"
      data-vt-confirmed-specimen="viewtube-navigation-split-accordion"
      data-size={size}
      data-count={items.length}
      style={{
        display: "grid",
        gridTemplateColumns: "minmax(0, 1fr)",
        gap: 4,
        marginBlock: 8,
        width: "100%",
        minWidth: 0,
      }}
    >
      <small style={{ display: "block", fontWeight: 1000, fontSize: 11, textTransform: "uppercase" }}>
        {title}
      </small>
      <p style={{ margin: 0, fontSize: 10, fontWeight: 700, lineHeight: 1.4, color: "#444" }}>
        Ten primary nav destinations. Panel colour = page nav colour; icon rail = next page’s nav colour
        (Dashboard→Studio→…→User Guide→Dashboard). Phosphor fill icons match site navigation.
      </p>
      <StudioSplitAccordion
        sizeVariant={size}
        variant="saturated"
        borderTone="black"
        items={items}
        activeIndex={activeIndex}
        onActiveIndexChange={setActiveIndex}
        accessibleLabel={title}
      />
    </div>
  )
}

export const StudioSplitAccordionCatalogSpecimens: React.FC = () => (
  <div
    data-vt-confirmed-primitive="StudioSplitAccordion"
    className="grid w-full min-w-0 max-w-none gap-1"
    style={{ gridTemplateColumns: "minmax(0, 1fr)", width: "100%", minWidth: 0, maxWidth: "none" }}
  >
    <NavigationSpecimenRow title="ViewTube navigation · 10 pages · Standard" size="standard" />
    <NavigationSpecimenRow title="ViewTube navigation · 10 pages · Compact" size="compact" />

    <SpecimenRow title="60px Supreme · 5 sections" count={5} size="supreme" />
    <SpecimenRow title="44px Standard · 3 sections" count={3} size="standard" />
    <SpecimenRow title="44px Standard · 4 sections" count={4} size="standard" />
    <SpecimenRow title="44px Standard · 5 sections" count={5} size="standard" />
    <SpecimenRow title="44px Standard · 10 sections" count={10} size="standard" />
    <SpecimenRow title="28px Compact · 5 sections" count={5} size="compact" />
    <SpecimenRow title="28px Compact · 10 sections" count={10} size="compact" />
    <SpecimenRow title="20px Mini · 5 sections" count={5} size="mini" />
    <SpecimenRow title="12px Micro · 5 sections" count={5} size="micro" />
    <SpecimenRow title="12px Micro · 10 sections" count={10} size="micro" />
  </div>
)

export default StudioSplitAccordionCatalogSpecimens
