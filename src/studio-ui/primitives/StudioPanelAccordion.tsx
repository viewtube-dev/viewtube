import React from "react"
import type { StudioControlSize } from "../tokens"
import "../../styles/studio-control-entry.css"

export interface StudioPanelAccordionItem {
  icon: React.ReactNode
  label: string
  content: React.ReactNode
  disabled?: boolean
}

export interface StudioPanelAccordionProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  items: readonly StudioPanelAccordionItem[]
  defaultActiveIndex?: number
  activeIndex?: number
  onActiveIndexChange?: (index: number) => void
  size?: Extract<StudioControlSize, "standard" | "compact">
}

/** Accessible single-open panel selector with square side rails and one active content panel. */
export const StudioPanelAccordion: React.FC<StudioPanelAccordionProps> = ({
  items,
  defaultActiveIndex = 0,
  activeIndex,
  onActiveIndexChange,
  size = "standard",
  className,
  ...props
}) => {
  const id = React.useId()
  const [uncontrolledIndex, setUncontrolledIndex] = React.useState(defaultActiveIndex)
  const selectedIndex = activeIndex ?? uncontrolledIndex
  const safeIndex = items.length ? Math.min(items.length - 1, Math.max(0, selectedIndex)) : -1
  const activeItem = safeIndex >= 0 ? items[safeIndex] : undefined
  const select = (index: number) => {
    if (items[index]?.disabled) return
    if (activeIndex === undefined) setUncontrolledIndex(index)
    onActiveIndexChange?.(index)
  }

  return (
    <section
      {...props}
      className={["vt-studio-panel-accordion", className].filter(Boolean).join(" ")}
      data-vt-studio-control="true"
      data-vt-studio-control-kind="panel-accordion"
      data-size={size}
      data-active-index={safeIndex}
    >
      <div className="vt-studio-panel-accordion__rails" role="group" aria-label="Choose panel">
        {items.map((item, index) => {
          const selected = index === safeIndex
          const panelId = `${id}-panel-${index}`
          return (
            <button
              key={`${item.label}-${index}`}
              type="button"
              className="vt-studio-panel-accordion__rail"
              aria-label={item.label}
              aria-expanded={selected}
              aria-controls={panelId}
              aria-pressed={selected}
              disabled={item.disabled}
              data-active={selected ? "true" : "false"}
              onClick={() => select(index)}
            >
              <span className="vt-studio-panel-accordion__icon" aria-hidden="true">{item.icon}</span>
              <span className="vt-studio-panel-accordion__label">{item.label}</span>
            </button>
          )
        })}
      </div>
      {activeItem ? (
        <div id={`${id}-panel-${safeIndex}`} className="vt-studio-panel-accordion__panel" role="region" aria-label={activeItem.label}>
          {activeItem.content}
        </div>
      ) : null}
    </section>
  )
}

StudioPanelAccordion.displayName = "StudioPanelAccordion"
