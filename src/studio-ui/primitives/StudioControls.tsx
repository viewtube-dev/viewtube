import React from "react"
import type { StudioControlSize } from "../tokens"
import { SubToolboxInput20, SubToolboxTextArea21 } from "../../components/subtoolbox/SubToolboxPrimitives"
import "../../styles/studio-split-left-consistency.css"
import "../../styles/studio-control-system.css"

export type StudioControlTone = "accent" | "neutral" | "danger" | "warning" | "success"

/** Canonical size contracts. CSS mirrors these values in studio-control-system.css. */
export const STUDIO_COMPONENT_SIZE_DEFAULTS = {
  standard: { height: 44, stroke: 3, fontSize: 32, fontWeight: 1000, buttonShadowX: 3, buttonShadowY: 3 },
  compact: { height: 28, stroke: 2, fontSize: 14, fontWeight: 1000, buttonShadowX: 1.5, buttonShadowY: 1.5 },
} as const

const withStudioAttrs = (size: StudioControlSize, tone?: StudioControlTone) => ({
  "data-vt-studio-control": "true",
  "data-size": size,
  ...(tone ? { "data-tone": tone } : {}),
})

/** Public Studio facade over canonical primitive 20; not an independent input implementation. */
export const StudioInput = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & { sizeVariant?: Exclude<StudioControlSize, "action"> }
>(({ sizeVariant = "standard", ...props }, ref) => (
  <SubToolboxInput20 ref={ref} controlSize={sizeVariant === "compact" ? "compact" : "standard"} {...withStudioAttrs(sizeVariant)} {...props} />
))
StudioInput.displayName = "StudioInput"

/** Search facade over canonical primitive 20. */
export const StudioSearchInput = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & { sizeVariant?: Exclude<StudioControlSize, "action"> }
>(({ sizeVariant = "standard", type = "search", ...props }, ref) => (
  <SubToolboxInput20 ref={ref} controlSize={sizeVariant === "compact" ? "compact" : "standard"} type={type} {...withStudioAttrs(sizeVariant)} {...props} />
))
StudioSearchInput.displayName = "StudioSearchInput"

/** Number facade over canonical primitive 20. */
export const StudioNumberInput = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & { sizeVariant?: Exclude<StudioControlSize, "action"> }
>(({ sizeVariant = "standard", type = "number", ...props }, ref) => (
  <SubToolboxInput20 ref={ref} controlSize={sizeVariant === "compact" ? "compact" : "standard"} type={type} {...withStudioAttrs(sizeVariant)} {...props} />
))
StudioNumberInput.displayName = "StudioNumberInput"

/** Public Studio facade over canonical primitive 21; not an independent textarea implementation. */
export const StudioTextArea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement> & { sizeVariant?: Exclude<StudioControlSize, "action"> }
>(({ sizeVariant = "standard", ...props }, ref) => <SubToolboxTextArea21 ref={ref} height={sizeVariant === "compact" ? "compact" : "standard"} {...withStudioAttrs(sizeVariant)} {...props} />)
StudioTextArea.displayName = "StudioTextArea"

export interface StudioFloatingLabelInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  overlayLabel: React.ReactNode
  sizeVariant?: Exclude<StudioControlSize, "action">
  level?: "l0" | "l1" | "l2"
}

/** Primitive 137 facade: canonical plain input 20 plus the upper-right label overlay. */
export const StudioFloatingLabelInput = React.forwardRef<HTMLInputElement, StudioFloatingLabelInputProps>(
  ({ overlayLabel, sizeVariant = "standard", level = "l1", className, style, ...props }, ref) => (
    <label data-vt-primitive-id="137" data-vt-studio-field="floating-input" data-vt-control-level={level}
      className={["vt-studio-labeled-field", "is-input", className].filter(Boolean).join(" ")} style={style}>
      <StudioInput ref={ref} sizeVariant={sizeVariant} {...props} />
      <span className="vt-studio-labeled-field-overlay">{overlayLabel}</span>
    </label>
  ),
)
StudioFloatingLabelInput.displayName = "StudioFloatingLabelInput"

export interface StudioFloatingLabelTextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  overlayLabel: React.ReactNode
  sizeVariant?: Exclude<StudioControlSize, "action">
  level?: "l0" | "l1" | "l2"
}

/** Primitive 138 facade: canonical plain textarea 21 plus the upper-right label overlay. */
export const StudioFloatingLabelTextArea = React.forwardRef<HTMLTextAreaElement, StudioFloatingLabelTextAreaProps>(
  ({ overlayLabel, sizeVariant = "standard", level = "l1", className, style, ...props }, ref) => (
    <label data-vt-primitive-id="138" data-vt-studio-field="floating-textarea" data-vt-control-level={level}
      className={["vt-studio-labeled-field", "is-textarea", className].filter(Boolean).join(" ")} style={style}>
      <StudioTextArea ref={ref} sizeVariant={sizeVariant} {...props} />
      <span className="vt-studio-labeled-field-overlay">{overlayLabel}</span>
    </label>
  ),
)
StudioFloatingLabelTextArea.displayName = "StudioFloatingLabelTextArea"


export const StudioSelect = React.forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement> & { sizeVariant?: Exclude<StudioControlSize, "action"> }
>(({ sizeVariant = "standard", ...props }, ref) => (
  <select ref={ref} {...withStudioAttrs(sizeVariant)} {...props} />
))
StudioSelect.displayName = "StudioSelect"

export interface StudioButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  sizeVariant?: StudioControlSize
  tone?: StudioControlTone
  loading?: boolean
  selected?: boolean
  /** Explicit geometry variant for the confirmed 44px and 28px button family. */
  heightVariant?: "44" | "28"
}

export const StudioButton = React.forwardRef<HTMLButtonElement, StudioButtonProps>(
  ({ sizeVariant = "standard", tone = "accent", loading = false, selected = false, heightVariant, disabled, children, type = "button", ...props }, ref) => (
    <button
      ref={ref}
      type={type}
      {...withStudioAttrs(sizeVariant, tone)}
      data-height-variant={heightVariant ?? (sizeVariant === "compact" ? "28" : "44")}
      data-selected={selected || undefined}
      aria-pressed={props["aria-pressed"] ?? (selected || undefined)}
      aria-busy={loading || undefined}
      disabled={disabled || loading}
      {...props}
    >
      {children}
    </button>
  ),
)
StudioButton.displayName = "StudioButton"

export interface StudioIconButtonProps extends Omit<StudioButtonProps, "children"> {
  icon: React.ReactNode
  label: string
}

export const StudioIconButton = React.forwardRef<HTMLButtonElement, StudioIconButtonProps>(
  ({ icon, label, ...props }, ref) => (
    <StudioButton ref={ref} aria-label={label} data-icon-only="true" {...props}>
      <span aria-hidden="true" data-vt-studio-button-icon>{icon}</span>
    </StudioButton>
  ),
)
StudioIconButton.displayName = "StudioIconButton"

export interface StudioSplitLeftButtonProps extends StudioButtonProps {
  icon: React.ReactNode
}

export const StudioSplitLeftButton = React.forwardRef<HTMLButtonElement, StudioSplitLeftButtonProps>(
  ({ icon, children, sizeVariant = "standard", ...props }, ref) => (
    <StudioButton ref={ref} sizeVariant={sizeVariant} data-split-left="true" {...props}>
      <span
        aria-hidden="true"
        data-vt-studio-split-rail
      >
        {icon}
      </span>
      <span data-vt-studio-split-label>{children}</span>
    </StudioButton>
  ),
)
StudioSplitLeftButton.displayName = "StudioSplitLeftButton"


export interface StudioLegendMultiDropdownOption {
  value: string
  label: string
  disabled?: boolean
}

export interface StudioLegendMultiDropdownProps {
  label: React.ReactNode
  options: StudioLegendMultiDropdownOption[]
  value?: string[]
  defaultValue?: string[]
  onChange?: (values: string[]) => void
  sizeVariant?: "compact" | "standard"
  level?: "l0" | "l1" | "l2"
  placeholder?: string
  clearLabel?: string
  maxMenuHeight?: number
  className?: string
  disabled?: boolean
  name?: string
}

/**
 * Canonical implementation of component-library 09/V2 "Legend Multi".
 * Uses the module's pair-A trigger/panel and pair-B floating legend/actions;
 * selection is multi-valued and never depends on a native browser menu.
 */
export const StudioLegendMultiDropdown: React.FC<StudioLegendMultiDropdownProps> = ({
  label, options, value, defaultValue = [], onChange, sizeVariant = "standard",
  level = "l1", placeholder = "ANY", clearLabel = "CLEAR ALL",
  maxMenuHeight = 280, className, disabled = false, name,
}) => {
  const [uncontrolled, setUncontrolled] = React.useState<string[]>(defaultValue)
  const [open, setOpen] = React.useState(false)
  const selected = value ?? uncontrolled
  const rootRef = React.useRef<HTMLDivElement>(null)
  const listId = React.useId()
  const setSelected = (next: string[]) => {
    if (value === undefined) setUncontrolled(next)
    onChange?.(next)
  }
  React.useEffect(() => {
    if (!open) return
    const onPointerDown = (event: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) setOpen(false)
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false)
    }
    document.addEventListener("pointerdown", onPointerDown)
    document.addEventListener("keydown", onKeyDown)
    return () => {
      document.removeEventListener("pointerdown", onPointerDown)
      document.removeEventListener("keydown", onKeyDown)
    }
  }, [open])
  const selectedLabels = options.filter(option => selected.includes(option.value)).map(option => option.label)
  const triggerLabel = selectedLabels.length ? selectedLabels.join(", ") : placeholder
  return (
    <div
      ref={rootRef}
      data-vt-primitive-id="140"
      data-vt-studio-field="legend-multi-dropdown"
      data-vt-control-level={level}
      data-size={sizeVariant}
      data-open={open || undefined}
      className={["vt-studio-legend-multi", className].filter(Boolean).join(" ")}
    >
      <div className="vt-studio-legend-anchor">
        <span className="vt-studio-legend-label">{label}</span>
        <button
          type="button"
          className="vt-studio-legend-trigger"
          data-vt-studio-control="true"
          data-size={sizeVariant}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={listId}
          disabled={disabled}
          onClick={() => setOpen(current => !current)}
        >
          <span className="vt-studio-legend-trigger-text">{triggerLabel}</span>
          <span className={["vt-studio-legend-count", selected.length ? "is-visible" : ""].filter(Boolean).join(" ")} aria-label={`${selected.length} selected`}>{selected.length}</span>
          <svg className="vt-studio-legend-chevron" viewBox="0 0 24 24" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg>
        </button>
      </div>
      {open && !disabled && (
        <div className="vt-studio-legend-menu" style={{ maxHeight: maxMenuHeight }} id={listId} role="listbox" aria-label={String(label)} aria-multiselectable="true">
          <div className="vt-studio-legend-options">
            {options.map(option => {
              const isSelected = selected.includes(option.value)
              return (
                <button
                  key={option.value}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  disabled={option.disabled}
                  data-selected={isSelected || undefined}
                  className="vt-studio-legend-option"
                  onClick={() => setSelected(isSelected ? selected.filter(item => item !== option.value) : [...selected, option.value])}
                >
                  <span className="vt-studio-legend-check" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7" /></svg></span>
                  <span className="vt-studio-legend-option-text">{option.label}</span>
                </button>
              )
            })}
          </div>
          <button type="button" className="vt-studio-legend-clear" onClick={() => setSelected([])} disabled={selected.length === 0}>{clearLabel}</button>
          {name && selected.map(item => <input key={item} type="hidden" name={name} value={item} />)}
        </div>
      )}
    </div>
  )
}
StudioLegendMultiDropdown.displayName = "StudioLegendMultiDropdown"
