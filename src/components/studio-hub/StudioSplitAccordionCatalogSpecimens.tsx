/**
 * Confirmed Library specimens for the StudioSplitAccordion train motion.
 * Each specimen row owns independent selection state.
 */
import React from "react";
import {
  LayoutDashboard, Sparkles, FolderKanban, Brain, BarChart3,
  PenLine, Archive, BookOpen, Settings2, User,
} from "lucide-react";
import { StudioSplitAccordion } from "../../studio-ui/primitives/StudioSplitAccordion";
import type { StudioSplitAccordionItem } from "../../studio-ui/primitives/StudioSplitAccordion";

const ICONS = [LayoutDashboard, Sparkles, FolderKanban, Brain, BarChart3, PenLine, Archive, BookOpen, Settings2, User];
const LABELS = ["Dashboard", "Studio", "Projects", "AI Brain", "Analytics", "Editor", "Vault", "Resources", "Settings", "User Guide"];

function makeItems(count: number): StudioSplitAccordionItem[] {
  return Array.from({ length: count }, (_, index) => {
    const Icon = ICONS[index % ICONS.length];
    const label = LABELS[index % LABELS.length];
    return {
      id: `split-accordion-${count}-${index}`,
      accessibleLabel: label,
      icon: <Icon aria-hidden="true" />,
      content: label,
    };
  });
}

function SpecimenRow({ title, count, size }: {
  title: string;
  count: number;
  size: "standard" | "compact" | "micro";
}) {
  const [activeIndex, setActiveIndex] = React.useState(0);
  const items = React.useMemo(() => makeItems(count), [count]);
  return (
    <div className="vt-confirmed-accordion-specimen" data-size={size} data-count={count} style={{ display: "grid", gap: 4, marginBlock: 4 }}>
      <small style={{ display: "block", fontWeight: 1000, fontSize: 11, textTransform: "uppercase" }}>{title}</small>
      <StudioSplitAccordion
        sizeVariant={size}
        items={items}
        activeIndex={activeIndex}
        onActiveIndexChange={setActiveIndex}
        accessibleLabel={title}
      />
    </div>
  );
}

export const StudioSplitAccordionCatalogSpecimens: React.FC = () => (
  <div data-vt-confirmed-primitive="StudioSplitAccordion" className="grid gap-1">
    <SpecimenRow title="44px Standard · 3 sections" count={3} size="standard" />
    <SpecimenRow title="44px Standard · 4 sections" count={4} size="standard" />
    <SpecimenRow title="44px Standard · 5 sections" count={5} size="standard" />
    <SpecimenRow title="44px Standard · 10 sections" count={10} size="standard" />
    <SpecimenRow title="28px Compact · 5 sections" count={5} size="compact" />
    <SpecimenRow title="28px Compact · 10 sections" count={10} size="compact" />
    <SpecimenRow title="12px Micro · 5 sections" count={5} size="micro" />
    <SpecimenRow title="12px Micro · 10 sections" count={10} size="micro" />
  </div>
);

export default StudioSplitAccordionCatalogSpecimens;
