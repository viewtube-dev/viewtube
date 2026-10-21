import React from "react"
import type { StudioControlSize } from "../tokens"
import "./StudioSplitRailAccordion.css"

export interface StudioSplitRailAccordionItem {
  /** Icon centered in the square 1:1 rail. */
  icon: React.ReactNode
  /** Accessible name for the icon selector. */
  accessibleLabel: string
  /** Text or custom content revealed beside this icon when active. */
  content: React.ReactNode
  /** Optional activation callback for this item. */
  onSelect?: () => void
  disabled?: boolean
}

export interface StudioSplitRailAccordionProps {
  /** Exactly three items, ordered left to right. */
  items: readonly [StudioSplitRailAccordionItem, StudioSplitRailAccordionItem, StudioSplitRailAccordionItem]
  /** Defaults to 2, so the rightmost content area is initially visible. */
  defaultActiveIndex?: 0 | 1 | 2
  /** Controlled active item. */
  activeIndex?: 0 | 1 | 2
  onActiveIndexChange?: (index: 0 | 1 | 2) => void
  sizeVariant?: StudioControlSize
  className?: string
  ariaLabel?: string
}

/**
 * Three-way expansion built on Studio's split-rail geometry.
 * All three square icon rails stay visible; only the content pane beside the
 * active rail is open. Hover and keyboard focus preview a pane, while click
 * selects it. The default active pane is the rightmost item.
 */
export const StudioSplitRailAccordion = React.forwardRef<HTMLDivElement, StudioSplitRailAccordionProps>(
  ({
    items,
    defaultActiveIndex = 2,
    activeIndex,
    onActiveIndexChange,
    sizeVariant = "standard",
    className,
    ariaLabel = "Split rail selector",
  }, ref) => {
    const [uncontrolledIndex, setUncontrolledIndex] = React.useState<0 | 1 | 2>(defaultActiveIndex)
    const selectedIndex = activeIndex ?? uncontrolledIndex
    const [previewIndex, setPreviewIndex] = React.useState<0 | 1 | 2 | null>(null)
    const visibleIndex = previewIndex ?? selectedIndex

    const activate = (index: 0 | 1 | 2) => {
      if (items[index].disabled) return
      if (activeIndex === undefined) setUncontrolledIndex(index)
      onActiveIndexChange?.(index)
      items[index].onSelect?.()
    }

    return (
      <div
        ref={ref}
        role="group"
        aria-label={ariaLabel}
        data-vt-studio-control="true"
        data-vt-studio-split-rail-accordion="true"
        data-size={sizeVariant}
        data-active-index={visibleIndex}
        className={["vt-studio-split-rail-accordion", className].filter(Boolean).join(" ")}
        onMouseLeave={event => {
          if (!event.currentTarget.contains(document.activeElement)) setPreviewIndex(null)
        }}
        onBlurCapture={event => {
          if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setPreviewIndex(null)
        }}
      >
        {items.map((item, index) => {
          const itemIndex = index as 0 | 1 | 2
          const active = visibleIndex === itemIndex
          return (
            <div
              key={item.accessibleLabel}
              data-vt-studio-split-rail-item="true"
              data-active={active ? "true" : "false"}
              className="vt-studio-split-rail-accordion__item"
            >
              <button
                type="button"
                data-vt-studio-split-rail-icon="true"
                aria-label={item.accessibleLabel}
                aria-pressed={selectedIndex === itemIndex}
                aria-expanded={active}
                disabled={item.disabled}
                onMouseEnter={() => setPreviewIndex(itemIndex)}
                onFocus={() => setPreviewIndex(itemIndex)}
                onClick={() => activate(itemIndex)}
              >
                <span aria-hidden="true" data-vt-studio-split-rail-icon-face>{item.icon}</span>
              </button>
              <div
                data-vt-studio-split-rail-content="true"
                data-active={active ? "true" : "false"}
                aria-hidden={!active}
                inert={!active}
                className="vt-studio-split-rail-accordion__content"
                aria-label={item.accessibleLabel + " content"}
              >
                {item.content}
              </div>
            </div>
          )
        })}
      </div>
    )
  },
)
StudioSplitRailAccordion.displayName = "StudioSplitRailAccordion"
