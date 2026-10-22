import React from "react";
import "../../styles/studio-split-accordion.css";

export type StudioSplitAccordionLayout = "left" | "right" | "double";
export type StudioSplitAccordionSize = "standard" | "compact" | "micro";

export interface StudioSplitAccordionItem {
  /** Stable identity; recommended when items can be reordered. */
  id?: string;
  accessibleLabel: string;
  icon: React.ReactNode;
  content: React.ReactNode;
  trailing?: React.ReactNode;
  disabled?: boolean;
  style?: React.CSSProperties;
}

export interface StudioSplitAccordionProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  items: readonly StudioSplitAccordionItem[];
  sizeVariant?: StudioSplitAccordionSize;
  layout?: StudioSplitAccordionLayout;
  /** Zero-based active item. Supplying this prop makes the accordion controlled. */
  activeIndex?: number;
  defaultActiveIndex?: number;
  onActiveIndexChange?: (index: number) => void;
  disabled?: boolean;
  accessibleLabel?: string;
}

const MOTION_LOCK_MS = 280;
const itemKey = (item: StudioSplitAccordionItem, index: number) => item.id ?? `${item.accessibleLabel}::${index}`;

function initialIndex(items: readonly StudioSplitAccordionItem[], requested?: number) {
  if (requested !== undefined && items[requested] && !items[requested].disabled) return requested;
  for (let index = items.length - 1; index >= 0; index -= 1) {
    if (!items[index].disabled) return index;
  }
  return -1;
}

/** Independent horizontal single-open accordion using Studio Controls geometry tokens. */
export const StudioSplitAccordion = React.forwardRef<HTMLDivElement, StudioSplitAccordionProps>(
  ({
    items,
    sizeVariant = "standard",
    layout = "left",
    activeIndex,
    defaultActiveIndex,
    onActiveIndexChange,
    disabled = false,
    accessibleLabel = "Split accordion",
    className,
    onKeyDown,
    ...props
  }, ref) => {
    const idPrefix = React.useId().replace(/:/g, "");
    const [uncontrolledKey, setUncontrolledKey] = React.useState(() => {
      const index = initialIndex(items, defaultActiveIndex);
      return index < 0 ? null : itemKey(items[index], index);
    });
    const [previewKey, setPreviewKey] = React.useState<string | null>(null);
    const [motionLocked, setMotionLocked] = React.useState(false);
    const lockTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);
    const controlled = activeIndex !== undefined;
    const controlledIndex = activeIndex !== undefined && items[activeIndex] && !items[activeIndex].disabled
      ? activeIndex
      : initialIndex(items);
    const keyIndex = items.findIndex((item, index) => itemKey(item, index) === uncontrolledKey);
    const currentIndex = controlled ? controlledIndex : (keyIndex >= 0 ? keyIndex : initialIndex(items));
    const selectedKey = currentIndex < 0 ? null : itemKey(items[currentIndex], currentIndex);
    const shownKey = !motionLocked && previewKey && items.some((item, index) => itemKey(item, index) === previewKey && !item.disabled)
      ? previewKey
      : selectedKey;
    const shownIndex = shownKey === null ? -1 : items.findIndex((item, index) => itemKey(item, index) === shownKey);

    React.useEffect(() => {
      if (!controlled && selectedKey !== uncontrolledKey) setUncontrolledKey(selectedKey);
    }, [controlled, selectedKey, uncontrolledKey]);

    React.useEffect(() => () => {
      if (lockTimer.current) clearTimeout(lockTimer.current);
    }, []);

    const activate = (index: number) => {
      const item = items[index];
      if (disabled || !item || item.disabled) return;
      const key = itemKey(item, index);
      setPreviewKey(null);
      setMotionLocked(true);
      if (lockTimer.current) clearTimeout(lockTimer.current);
      lockTimer.current = setTimeout(() => {
        setMotionLocked(false);
        lockTimer.current = null;
      }, MOTION_LOCK_MS);
      if (!controlled) setUncontrolledKey(key);
      onActiveIndexChange?.(index);
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
      onKeyDown?.(event);
      if (event.defaultPrevented || disabled || !items.length) return;
      const enabled = items.map((item, index) => ({ item, index })).filter(({ item }) => !item.disabled);
      if (!enabled.length) return;
      const current = enabled.findIndex(({ index }) => index === (shownIndex < 0 ? currentIndex : shownIndex));
      let target = -1;
      if (event.key === "ArrowRight" || event.key === "ArrowDown") target = (current + 1 + enabled.length) % enabled.length;
      else if (event.key === "ArrowLeft" || event.key === "ArrowUp") target = (current - 1 + enabled.length) % enabled.length;
      else if (event.key === "Home") target = 0;
      else if (event.key === "End") target = enabled.length - 1;
      if (target >= 0) {
        event.preventDefault();
        const next = enabled[target];
        activate(next.index);
        const buttons = event.currentTarget.querySelectorAll<HTMLButtonElement>("[data-vt-studio-split-accordion-trigger]");
        buttons[next.index]?.focus();
      }
    };

    return (
      <div
        {...props}
        ref={ref}
        className={["vt-studio-split-accordion", className].filter(Boolean).join(" ")}
        data-vt-studio-control="true"
        data-vt-studio-split-accordion="true"
        data-vt-library-component="StudioSplitAccordion"
        data-size={sizeVariant}
        data-layout={layout}
        data-active-index={shownIndex}
        data-motion-locked={motionLocked ? "true" : "false"}
        role="group"
        aria-label={accessibleLabel}
        onKeyDown={handleKeyDown}
      >
        {items.map((item, index) => {
          const key = itemKey(item, index);
          const active = key === shownKey;
          const selected = key === selectedKey;
          const panelId = `vt-studio-split-accordion-${idPrefix}-panel-${index}`;
          return (
            <div
              className="vt-studio-split-accordion__item"
              key={key}
              data-active={active ? "true" : "false"}
              data-selected={selected ? "true" : "false"}
              data-disabled={item.disabled || disabled ? "true" : "false"}
              style={item.style}
            >
              <button
                type="button"
                className="vt-studio-split-accordion__trigger"
                data-vt-studio-split-accordion-trigger="true"
                aria-label={item.accessibleLabel}
                aria-expanded={selected}
                aria-pressed={selected}
                aria-controls={panelId}
                disabled={disabled || item.disabled}
                tabIndex={active ? 0 : -1}
                onClick={() => activate(index)}
                onMouseEnter={() => {
                  if (!motionLocked && !disabled && !item.disabled) setPreviewKey(key);
                }}
                onMouseLeave={() => setPreviewKey(null)}
                onFocus={() => {
                  if (!motionLocked && !disabled && !item.disabled) setPreviewKey(key);
                }}
                onBlur={() => setPreviewKey(null)}
              >
                <span className="vt-studio-split-accordion__face" data-vt-studio-split-accordion-face="true" aria-hidden="true">{item.icon}</span>
              </button>
              <div
                className="vt-studio-split-accordion__content"
                id={panelId}
                data-active={active ? "true" : "false"}
                hidden={!active}
              >
                <div className="vt-studio-split-accordion__content-inner">{item.content}</div>
                {item.trailing ? <div className="vt-studio-split-accordion__trailing">{item.trailing}</div> : null}
              </div>
              {layout === "double" && active ? (
                <div className="vt-studio-split-accordion__face vt-studio-split-accordion__face--trailing" data-vt-studio-split-accordion-face="trailing" aria-hidden="true">{item.icon}</div>
              ) : null}
            </div>
          );
        })}
      </div>
    );
  },
);
StudioSplitAccordion.displayName = "StudioSplitAccordion";
