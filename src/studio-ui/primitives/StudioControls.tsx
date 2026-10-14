import React from "react"
import type { StudioControlSize } from "../tokens"
import "../../styles/studio-split-left-consistency.css"
import "../../styles/studio-control-system.css"

export type StudioControlTone = "accent" | "neutral" | "danger" | "warning" | "success"

/** Global defaults apply to every Studio primitive unless a size-specific override is declared. */
export const STUDIO_COMPONENT_GLOBAL_DEFAULTS = {
  fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif",
  fontWeight: 1000,
  strokeColor: "#000000",
  colorPairSystem: "primary = --pair-a; secondary = --pair-b",
  backgroundFill: "buttons use primary; text fields use 50% opacity primary",
  textColor: "#000000",
  textTransform: "uppercase",
  letterSpacing: "-0.035em",
  lineHeight: 0.86,
  shadowPolicy: "button-only hard offset shadow; focused text-field outline shadow uses secondary",
  focusOutline: "text fields use secondary outline at half the current border width",
  textFieldDefaults: {
    defaultMode: {
      textColor: "primary",
      textStrokeColor: "primary",
      fill: "primary at 50% opacity",
      inlineStrokeColor: "primary",
      inlineStrokeWidth: "same as border width",
    },
    focusMode: {
      fill: "primary at 15% opacity",
      textColor: "#000000",
      textStrokeColor: "#000000",
      outlineStrokeColor: "secondary",
      outlineStrokeWidth: "half the current border width",
      outlineShadowColor: "secondary",
    },
    caret: { color: "primary", style: "native insertion caret" },
  },
  motionEasing: "ease-out",
} as const

/** Canonical size contracts. CSS mirrors these values in studio-control-system.css. */
export const STUDIO_COMPONENT_SIZE_DEFAULTS = {
  standard: { height: 44, stroke: 3, radius: 8, fontSize: 38, fontWeight: 1000, buttonShadowX: 3, buttonShadowY: 3, hoverTransitionMs: 150, hoverOffsetPx: 1.5, clickTransitionMs: 300, clickOffsetPx: 3, iconSize: 28, iconStroke: 2.5 },
  compact: { height: 28, stroke: 2, radius: 5, fontSize: 24, fontWeight: 1000, buttonShadowX: 1.5, buttonShadowY: 1.5, hoverTransitionMs: 150, hoverOffsetPx: 0.75, clickTransitionMs: 300, clickOffsetPx: 1.5, iconSize: 18, iconStroke: 1.65 },
} as const

const withStudioAttrs = (size: StudioControlSize, tone?: StudioControlTone) => ({
  "data-vt-studio-control": "true",
  "data-size": size,
  ...(tone ? { "data-tone": tone } : {}),
})

/**
 * Canonical standalone Studio text input.
 * This component is defined and styled entirely by the Studio Controls system;
 * it has no import, wrapper, or runtime dependency on SubToolbox primitives.
 */
export const StudioTextInput = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & { sizeVariant?: Exclude<StudioControlSize, "action"> }
>(({ sizeVariant = "standard", type = "text", ...props }, ref) => (
  <input
    ref={ref}
    type={type}
    {...withStudioAttrs(sizeVariant)}
    data-vt-studio-field-kind="text-input"
    {...props}
  />
))
StudioTextInput.displayName = "StudioTextInput"

/** Backwards-compatible canonical name used by existing Studio consumers. */
export const StudioInput = StudioTextInput

/** Canonical search input using the shared Studio text-field contract. */
export const StudioSearchInput = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & { sizeVariant?: Exclude<StudioControlSize, "action"> }
>(({ sizeVariant = "standard", type = "search", ...props }, ref) => (
  <input ref={ref} type={type} {...withStudioAttrs(sizeVariant)} {...props} />
))
StudioSearchInput.displayName = "StudioSearchInput"

/** Canonical number input using the shared Studio text-field contract. */
export const StudioNumberInput = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & { sizeVariant?: Exclude<StudioControlSize, "action"> }
>(({ sizeVariant = "standard", type = "number", ...props }, ref) => (
  <input ref={ref} type={type} {...withStudioAttrs(sizeVariant)} {...props} />
))
StudioNumberInput.displayName = "StudioNumberInput"

/**
 * Canonical standalone Studio text area.
 * Size, border, typography, focus, placeholder, and resize behavior are owned by
 * studio-control-system.css—not by SubToolbox primitive classes or inline styles.
 */
export const StudioTextArea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement> & { sizeVariant?: Exclude<StudioControlSize, "action"> }
>(({ sizeVariant = "standard", rows, ...props }, ref) => (
  <textarea
    ref={ref}
    rows={rows ?? 4}
    {...withStudioAttrs(sizeVariant)}
    data-vt-studio-field-kind="textarea"
    {...props}
  />
))
StudioTextArea.displayName = "StudioTextArea"

export interface StudioFloatingLabelInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  overlayLabel: React.ReactNode
  sizeVariant?: Exclude<StudioControlSize, "action">
  level?: "l0" | "l1" | "l2"
}

/** Studio input plus the upper-right label overlay. */
export const StudioFloatingLabelInput = React.forwardRef<HTMLInputElement, StudioFloatingLabelInputProps>(
  ({ overlayLabel, sizeVariant = "standard", level = "l1", className, style, ...props }, ref) => (
    <label data-vt-primitive-id="141" data-vt-studio-field="floating-input" data-vt-control-level={level}
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

/** Studio writing area plus the upper-right label overlay. */
export const StudioFloatingLabelTextArea = React.forwardRef<HTMLTextAreaElement, StudioFloatingLabelTextAreaProps>(
  ({ overlayLabel, sizeVariant = "standard", level = "l1", className, style, ...props }, ref) => (
    <label data-vt-primitive-id="142" data-vt-studio-field="floating-textarea" data-vt-control-level={level}
      className={["vt-studio-labeled-field", "is-textarea", className].filter(Boolean).join(" ")} style={style}>
      <StudioTextArea ref={ref} sizeVariant={sizeVariant} {...props} />
      <span className="vt-studio-labeled-field-overlay">{overlayLabel}</span>
    </label>
  ),
)
StudioFloatingLabelTextArea.displayName = "StudioFloatingLabelTextArea"


const studioClasses = (...values: Array<string | false | null | undefined>) => values.filter(Boolean).join(" ")
/** Canonical Studio 44px / 28px switch, choice, and word-toggle primitives. */
export type StudioControlSkin = "solid" | "color-swap" | "black-indicator" | "white-indicator";
export interface StudioControlButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onChange"> {
  skin?: StudioControlSkin;
  checked: boolean;
  shape?: "round" | "rect";
}
const studioSkinClass = (skin: StudioControlSkin) => ({
  "solid": "is-solid",
  "color-swap": "is-color-swap",
  "black-indicator": "is-black-indicator",
  "white-indicator": "is-white-indicator",
}[skin]);
export const Studioswitch: React.FC<StudioControlButtonProps> = ({ skin = "solid", checked, className, shape = "round", type = "button", ...props }) => (
  <button type={type} role="switch" aria-checked={checked} data-vt-studio-control="true" data-size="standard" className={studioClasses("vt-studio-44-switch", `is-${shape}`, studioSkinClass(skin), checked && "is-on", className)} {...props}><span className="vt-studio-44-handle" aria-hidden="true" /></button>
);
export type StudioChoiceKind = "radio" | "checkbox";
export interface StudioChoiceProps extends StudioControlButtonProps { kind: StudioChoiceKind; mark?: "check" | "xwide" }
export const StudioChoice: React.FC<StudioChoiceProps> = ({ kind, mark = "check", skin = "solid", checked, className, shape = "round", type = "button", ...props }) => (
  <button type={type} role={kind} aria-checked={checked} data-vt-studio-control="true" data-size="standard" className={studioClasses("vt-studio-44-choice", `is-${kind}`, `is-${shape}`, `is-${mark}`, studioSkinClass(skin), checked && "is-on", className)} {...props}>
    {kind === "radio" ? <span className="vt-studio-44-dot" aria-hidden="true" /> : <svg viewBox="0 0 50 50" aria-hidden="true"><path d={mark === "xwide" ? "M 10 10 L 40 40 M 40 10 L 10 40" : "M 7 26 L 19 39 L 43 11"} /></svg>}
  </button>
);
export interface StudioWordToggleProps extends React.HTMLAttributes<HTMLDivElement> {
  value: boolean;
  onValueChange?: (value: boolean) => void;
  words?: readonly [string, string];
  size?: "44" | "28";
  skin?: StudioControlSkin;
}
export const Studiotoggle: React.FC<StudioWordToggleProps> = ({ value, onValueChange, words = ["OFF", "ON"], size = "44", skin = "solid", className, ...props }) => {
  const rootRef = React.useRef<HTMLDivElement>(null);
  const wordRefs = React.useRef<Array<HTMLButtonElement | null>>([]);
  const [handle, setHandle] = React.useState({ left: 2.75, width: 16 });
  React.useEffect(() => {
    let frame = 0;
    const measure = () => {
      const root = rootRef.current;
      const target = wordRefs.current[value ? 1 : 0];
      if (!root || !target) return;
      const rootRect = root.getBoundingClientRect();
      const targetRect = target.getBoundingClientRect();
      const inset = size === "28" ? 2 : 2.75;
      const next = { left: targetRect.left - rootRect.left + inset, width: Math.max(targetRect.width - inset * 2, 12) };
      setHandle(current => Math.abs(current.left-next.left)<.5 && Math.abs(current.width-next.width)<.5 ? current : next);
    };
    const schedule = () => { if (typeof window !== "undefined") { window.cancelAnimationFrame(frame); frame = window.requestAnimationFrame(measure); } else measure(); };
    schedule();
    const root = rootRef.current;
    const observer = typeof ResizeObserver !== "undefined" && root ? new ResizeObserver(schedule) : null;
    if (root) observer?.observe(root);
    wordRefs.current.forEach(node => { if (node) observer?.observe(node); });
    if (typeof window !== "undefined") window.addEventListener("resize", schedule);
    if (typeof document !== "undefined") document.fonts?.ready?.then(schedule);
    return () => { if (typeof window !== "undefined") { window.cancelAnimationFrame(frame); window.removeEventListener("resize", schedule); } observer?.disconnect(); };
  }, [value, words, size]);
  return <div ref={rootRef} role="group" data-vt-studio-control="true" data-size={size === "28" ? "compact" : "standard"} data-vt-word-toggle-size={size} className={studioClasses("vt-studio-44-word-toggle", `is-size-${size}`, studioSkinClass(skin), className)} {...props}>
    <span className="vt-studio-44-word-handle" aria-hidden="true" style={{ left: handle.left, width: handle.width }} data-active={value ? "true" : "false"} />
    {words.map((word, index) => <button key={index} ref={node => { wordRefs.current[index] = node }} type="button" aria-pressed={value === (index === 1)} className={value === (index === 1) ? "is-active" : ""} onClick={() => onValueChange?.(index === 1)}>{word}</button>)}
  </div>;
};


export const Studioradio: React.FC<Omit<StudioChoiceProps, "kind" | "mark">> = props => <StudioChoice {...props} kind="radio" />
Studioradio.displayName = "Studioradio"
export const Studiocheck: React.FC<Omit<StudioChoiceProps, "kind" | "mark">> = props => <StudioChoice {...props} kind="checkbox" mark="check" />
Studiocheck.displayName = "Studiocheck"
export const Studioxbox: React.FC<Omit<StudioChoiceProps, "kind" | "mark">> = props => <StudioChoice {...props} kind="checkbox" mark="xwide" />
Studioxbox.displayName = "Studioxbox"
export const Studioinput = StudioTextInput
export const Studioarea = StudioTextArea

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
