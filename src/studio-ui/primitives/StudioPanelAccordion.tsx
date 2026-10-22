import React from "react"
import type { StudioControlSize } from "../tokens"
import "../../styles/studio-panel-accordion.css"

export interface StudioPanelAccordionItem {
  /** Icon drawn inside the square rail face. */
  icon: React.ReactNode
  /** Accessible name for the panel selector. */
  label: string
  /** Content shown when this panel is active. */
  content: React.ReactNode
  disabled?: boolean
  onSelect?: () => void
}

export interface StudioPanelAccordionProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  /** Three panels in fixed left-to-right order. */
  items: readonly [StudioPanelAccordionItem, StudioPanelAccordionItem, StudioPanelAccordionItem]
  /** Initially open panel; defaults to the right panel. */
  defaultActiveIndex?: 0 | 1 | 2
  /** Controlled active panel index. */
  activeIndex?: 0 | 1 | 2
  onChange?: (index: 0 | 1 | 2) => void
  size?: StudioControlSize
  /** Visual pair tokens; resolved from Studio's existing color pair variables. */
  accent?: string
  secondary?: string
}

/**
 * New, independent three-panel accordion primitive.
 *
 * Geometry is rail-first: shell height determines the exact square rail face.
 * The item owns width expansion; its label is absolutely positioned inside the
 * active item's content viewport, whose left edge never moves during expansion.
 */
export function StudioPanelAccordion({
  items,
  defaultActiveIndex = 2,
  activeIndex,
  onChange,
  size = "standard",
  accent,
  secondary,
  className,
  ...rest
}: StudioPanelAccordionProps) {
  const [internalIndex, setInternalIndex] = React.useState<0 | 1 | 2>(defaultActiveIndex)
  const currentIndex = activeIndex ?? internalIndex

  const activate = (index: 0 | 1 | 2) => {
    if (items[index].disabled) return
    if (activeIndex === undefined) setInternalIndex(index)
    onChange?.(index)
    items[index].onSelect?.()
  }

  return (
    <div
      {...rest}
      className={["vt-studio-panel-accordion", className].filter(Boolean).join(" ")}
      data-vt-studio-control="panel-accordion"
      data-size={size === "compact" ? "compact" : "standard"}
      data-active-index={currentIndex}
      style={{
        ...(accent ? { "--vt-studio-accordion-accent": accent } as React.CSSProperties : {}),
        ...(secondary ? { "--vt-studio-accordion-secondary": secondary } as React.CSSProperties : {}),
        ...rest.style,
      }}
    >
      {items.map((item, index) => {
        const active = currentIndex === index
        const itemIndex = index as 0 | 1 | 2
        return (
          <section
            className="vt-studio-panel-accordion__item"
            data-active={active ? "true" : "false"}
            key={index}
          >
            <button
              type="button"
              className="vt-studio-panel-accordion__rail"
              aria-label={item.label}
              aria-expanded={active}
              aria-controls={`vt-studio-panel-accordion-panel-${index}`}
              disabled={item.disabled}
              onClick={() => activate(itemIndex)}
            >
              <span className="vt-studio-panel-accordion__icon">{item.icon}</span>
            </button>
            <div
              className="vt-studio-panel-accordion__viewport"
              id={`vt-studio-panel-accordion-panel-${index}`}
              aria-hidden={!active}
            >
              <span className="vt-studio-panel-accordion__label" aria-hidden="true">{item.label}</span>
              <div className="vt-studio-panel-accordion__content">{item.content}</div>
            </div>
          </section>
        )
      })}
    </div>
  )
}

export default StudioPanelAccordion
