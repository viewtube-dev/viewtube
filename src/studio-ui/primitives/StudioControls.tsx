import React from "react"
import { STUDIO_CONTROL_SIZE_CONTRACT, type StudioControlSize, type StudioIconSizeVariant } from "../tokens"
import "../../styles/studio-control-system.css"
import { StudioTextInput, StudioInput, StudioSearchInput, StudioNumberInput } from "./StudioTextInput"
import { StudioTextArea } from "./StudioTextArea"

export type StudioControlTone = "accent" | "neutral" | "danger" | "warning" | "success"

/** Global defaults apply to every Studio primitive unless a size-specific override is declared. */
export const STUDIO_COMPONENT_GLOBAL_DEFAULTS = {
  fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif",
  fontWeight: 1000,
  strokeColor: "#000000",
  colorPairSystem: "primary = --pair-a; secondary = --pair-b",
  backgroundFill: "primary (--pair-a) is the default component fill; text inputs and text areas use primary at 50% opacity; solid/selected family states must be explicit",
  textColor: "text fields use primary by default and black on focus; other controls use their component contract",
  textTransform: "uppercase",
  letterSpacing: "-0.02em",
  lineHeight: 0.86,
  shadowPolicy: "Hard offset shadows belong to buttons and floating dropdown panels. Dropdown triggers and menu options have no button shadow or press-motion; a floating menu panel may use its own stationary panel shadow. Text fields use black outer borders and primary-color inset strokes.",
  squareIconButtonDefaults: {
    geometry: "Square face matching the split-left icon rail: 44px standard / 28px compact; icon 28px with 2.5 stroke standard / 18px with 1.65 stroke compact.",
    v1: "Primary (--pair-a) face fill with secondary (--pair-b) offset shadow.",
    v2: "Secondary (--pair-b) face fill with primary (--pair-a) offset shadow.",
    v3: "Selectable v1/v2 color swap; click toggles the face and opposite-color shadow together.",
    v4: "Black face fill with primary (--pair-a) icon stroke.",
    effects: {
      standard: "No additional motion; shared Studio press, hover, focus and disabled behavior only.",
      notification: "Optional positioned badge; count/status pop and icon shake. Supply badge only when a real count/status exists.",
      rotatedToggle: "Opt-in inner-stage rotation; outer 44px/28px geometry and press transform remain unchanged.",
      flip: "Opt-in two-face 3D flip; provide activeIcon for a meaningful alternate face.",
      tooltip: "Opt-in contextual label revealed on hover/focus; accessible name remains label.",
      morph: "Opt-in icon crossfade/scale/rotation; provide activeIcon for the selected state.",
      success: "Outcome-driven checkmark and optional tooltip label; set success only after confirmed success.",
    },
    motion: "Effects are opt-in and scoped to inner layers; reduced-motion suppresses animation without suppressing state feedback.",
  },
  focusOutline: "Text inputs and text areas use a secondary-color visible focus accent at 0px offset; the last live audit measured its box shadow at 3px standard / 2px compact while the computed CSS outline itself measured 1px. Treat the outline and accent shadow as separate layers.",
  textFieldDefaults: {
    typography: {
      standardInputFontSize: "38px",
      compactInputFontSize: "24px",
      standardTextAreaFontSize: "18px",
      compactTextAreaFontSize: "14px",
      rule: "Single-line inputs follow global 38px standard / 24px compact typography. Textareas alone use 18px standard / 14px compact, with multiline line-height, padding, and a 92px minimum writing surface.",
    },
    sizeFamily: "Single-line inputs use global 38px standard / 24px compact typography and the global .86 line-height. Textareas alone use 18px standard / 14px compact with multiline line-height, padding, and a 92px minimum surface. Size selects 44px/28px height, 3px/2px stroke, and 6px/4px radius for both families.",
    defaultMode: {
      textColor: "primary",
      textStrokeColor: "matches text color (primary)",
      fill: "primary at 50% opacity",
      borderStrokeColor: "#000000",
      inlineStrokeColor: "primary at 100% opacity",
      inlineStrokeWidth: "same as global standard/compact border width",
    },
    focusMode: {
      fill: "primary at 15% opacity",
      textColor: "#000000",
      textStrokeColor: "matches text color (#000000)",
      borderStrokeColor: "#000000",
      inlineStrokeColor: "primary at 100% opacity",
      outlineStrokeColor: "secondary",
      focusOutlineWidth: "visible secondary-color accent box shadow: 3px standard / 2px compact (last live audit)",
      focusOutlineOffset: "0px for both sizes",
      outlineStrokeWidth: "computed CSS outline measured 1px in the last live audit; reconcile with declared token before visual certification",
      outlineShadowColor: "secondary",
    },
    caret: { color: "primary (--pair-a)", style: "native insertion caret; request block shape where supported; never simulate text insertion" },
  },
  motionEasing: "ease-out",
} as const

/** Canonical machine-readable contract; defined once in studio-ui/tokens.ts. */
export const STUDIO_COMPONENT_SIZE_DEFAULTS = STUDIO_CONTROL_SIZE_CONTRACT

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
export { StudioTextInput, StudioInput, StudioSearchInput, StudioNumberInput }
export type { StudioTextInputProps } from "./StudioTextInput"
export { StudioTextArea }
export type { StudioTextAreaProps } from "./StudioTextArea"


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
  /** Optional fixed handle width in CSS pixels; omitted means measure the active word. */
  handleWidth?: number;
  /** Inset between the active word bounds and handle edges; defaults by size. */
  handleInset?: number;
  /** Scale the measured active-handle width when a fixed width is not supplied. */
  handleWidthScale?: number;
  /** Horizontal spacing between the two word labels in CSS pixels. */
  wordGap?: number;
}
export const Studiotoggle: React.FC<StudioWordToggleProps> = ({ value, onValueChange, words = ["WRITE", "CREATE"], size = "44", skin = "solid", handleWidth, handleInset, handleWidthScale = 1, wordGap = 0, className, style, ...props }) => {
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
      // Standard toggles reserve 16px of optical padding inside the active
      // handle and a fixed 4px gap from either inner container edge. The word
      // buttons use 20px side padding; the handle is 8px narrower than that
      // button, leaving 16px between glyph bounds and handle edges.
      const inset = handleInset ?? (size === "28" ? 2 : 4);
      const measuredWidth = Math.max(targetRect.width - inset * 2, 12) * handleWidthScale;
      const nextWidth = handleWidth === undefined ? measuredWidth : Math.max(0, handleWidth);
      // Absolutely positioned children measure from the container's padding
      // edge, not its outer border edge. Subtract clientLeft so both sides keep
      // the same 4px inner margin when the active word flips left/right.
      const next = {
        left: targetRect.left - rootRect.left - root.clientLeft + (targetRect.width - nextWidth) / 2,
        width: nextWidth,
      };
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
  }, [value, words, size, handleWidth, handleInset, handleWidthScale]);
  return <div ref={rootRef} role="group" data-vt-studio-control="true" data-size={size === "28" ? "compact" : "standard"} data-vt-word-toggle-size={size} className={studioClasses("vt-studio-44-word-toggle", `is-size-${size}`, studioSkinClass(skin), className)} style={{ ...style, "--vt-word-toggle-handle-inset": `${handleInset ?? (size === "28" ? 2 : 2.75)}px`, "--vt-word-toggle-handle-width-scale": handleWidthScale, "--vt-word-toggle-word-gap": `${wordGap}px`, "--vt-word-toggle-handle-left": `${handle.left}px`, "--vt-word-toggle-handle-width": `${handle.width}px` } as React.CSSProperties} {...props}>
    <span className="vt-studio-44-word-handle" aria-hidden="true" style={{ "--vt-word-toggle-handle-left": `${handle.left}px`, "--vt-word-toggle-handle-width": `${handle.width}px` } as React.CSSProperties} data-active={value ? "true" : "false"} />
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

/** Canonical public names; lowercase legacy exports remain compatibility aliases. */
export const StudioSwitch = Studioswitch
export const StudioWordToggle = Studiotoggle
export const StudioRadio = Studioradio
export const StudioCheckbox = Studiocheck
export const StudioXCheckbox = Studioxbox

export const StudioSelect = React.forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement> & { sizeVariant?: StudioControlSize }
>(({ sizeVariant = "standard", ...props }, ref) => (
  <select ref={ref} {...props} {...withStudioAttrs(sizeVariant)} />
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
  (
    {
      sizeVariant,
      tone = "accent",
      loading = false,
      selected = false,
      heightVariant,
      disabled,
      children,
      type = "button",
      ...props
    },
    ref,
  ) => {
    // Height is the authoritative geometry when supplied. This prevents a 28px
    // control from accidentally inheriting standard border/radius/shadow tokens.
    const resolvedSize = heightVariant
      ? heightVariant === "28" ? "compact" : "standard"
      : sizeVariant ?? "standard"
    const resolvedHeight = heightVariant ?? (resolvedSize === "compact" ? "28" : "44")

    return (
      <button
        ref={ref}
        type={type}
        {...props}
        {...withStudioAttrs(resolvedSize, tone)}
        data-vt-studio-button="true"
        data-height-variant={resolvedHeight}
        data-selected={selected || undefined}
        aria-pressed={props["aria-pressed"] ?? (selected || undefined)}
        aria-busy={loading || undefined}
        disabled={disabled || loading}
      >
        <span data-vt-studio-button-face>{children}</span>
      </button>
    )
  },
)
StudioButton.displayName = "StudioButton"

/**
 * Separate 56px action family for prominent workflow actions.
 * It is intentionally not a StudioButton size variant: StudioButton remains 44px/28px only.
 */
export interface StudioActionButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  tone?: StudioControlTone
  loading?: boolean
}

export const StudioActionButton = React.forwardRef<HTMLButtonElement, StudioActionButtonProps>(
  ({ tone = "accent", loading = false, disabled, children, type = "button", ...props }, ref) => (
    <button
      ref={ref}
      type={type}
      {...props}
      data-vt-studio-control="true"
      data-vt-studio-action-button="true"
      data-tone={tone}
      aria-busy={loading || undefined}
      disabled={disabled || loading}
    >
      <span data-vt-studio-action-face>{children}</span>
    </button>
  ),
)
StudioActionButton.displayName = "StudioActionButton"

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


export type StudioSquareIconButtonVariant = "v1" | "v2" | "v3" | "v4"
export type StudioSquareIconButtonEffect =
  | "standard"
  | "notification"
  | "rotated-toggle"
  | "flip"
  | "tooltip"
  | "morph"
  | "success"

export interface StudioSquareIconButtonProps extends Omit<StudioButtonProps, "children" | "selected"> {
  /** Visual comparison preset; outer button geometry is unchanged. */
  iconSizeVariant?: StudioIconSizeVariant
  icon: React.ReactNode
  label: string
  /** v1: primary fill / secondary shadow; v2: secondary fill / primary shadow;
   * v3: click-to-toggle between v1 and v2; v4: black fill / primary icon. */
  variant?: StudioSquareIconButtonVariant
  /** Optional interaction effect. Defaults to standard; visual skin remains controlled by variant. */
  effect?: StudioSquareIconButtonEffect
  /** Alternate icon used by flip/morph effects; for success effect, defaults to a checkmark. */
  activeIcon?: React.ReactNode
  /** Notification count or short status. Omit to hide the badge. */
  badge?: number | string
  /** Floating contextual label; also becomes a supplementary description when supplied. */
  tooltip?: string
  /** Outcome-driven success state. Set true only after the associated operation succeeds. */
  success?: boolean
  /** Replay the small pop feedback when activated; false by default. */
  animate?: boolean
  selected?: boolean
  defaultSelected?: boolean
  onSelectedChange?: (selected: boolean) => void
}

/** Canonical square icon primitive. Visual skins (V1–V4) and interaction effects are orthogonal. */
export const StudioSquareIconButton = React.forwardRef<HTMLButtonElement, StudioSquareIconButtonProps>(
  ({
    icon, label, variant = "v1", effect = "standard", iconSizeVariant = "current", activeIcon, badge, tooltip, success = false, animate = false,
    sizeVariant = "standard", selected, defaultSelected = false, onSelectedChange, onClick, className,
    disabled, ...props
  }, ref) => {
    const [uncontrolledSelected, setUncontrolledSelected] = React.useState(defaultSelected)
    const [animationKey, setAnimationKey] = React.useState(0)
    const badgeValue = badge === undefined || badge === null || badge === "" ? null : String(badge)
    const previousBadgeValue = React.useRef(badgeValue)
    React.useEffect(() => {
      if (previousBadgeValue.current !== badgeValue) setAnimationKey(key => key + 1)
      previousBadgeValue.current = badgeValue
    }, [badgeValue])
    const selectable = variant === "v3" || effect === "rotated-toggle" || effect === "flip" || effect === "morph"
    const isSelected = selectable ? (selected ?? uncontrolledSelected) : false
    const isSuccess = effect === "success" && success
    const effectClass = effect === "standard" ? (animate ? "is-effect-pop" : undefined) : `is-effect-${effect}`
    const tooltipId = React.useId()
    const successStatusId = React.useId()
    const handleClick: React.MouseEventHandler<HTMLButtonElement> = event => {
      // Disabled controls must not dispatch actions or state/animation changes,
      // including when an event is dispatched programmatically in a test or wrapper.
      if (event.currentTarget.disabled) return
      onClick?.(event)
      if (event.defaultPrevented) return
      if (animate || effect === "notification") setAnimationKey(key => key + 1)
      if (!selectable) return
      const next = !isSelected
      if (selected === undefined) setUncontrolledSelected(next)
      onSelectedChange?.(next)
    }
    const fallbackCheck = (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="m5 12 4 4L19 6" />
      </svg>
    )
    const iconNode = effect === "success" && isSuccess ? (activeIcon ?? fallbackCheck) : icon
    const alternateNode = activeIcon ?? icon
    const describedBy = [
      props["aria-describedby"],
      effect === "tooltip" && tooltip ? tooltipId : undefined,
      isSuccess && tooltip ? successStatusId : undefined,
    ].filter(Boolean).join(" ") || undefined
    return (
      <StudioButton
        ref={ref}
        {...props}
        className={studioClasses("vt-studio-square-icon-button", effectClass, className)}
        disabled={disabled}
        sizeVariant={sizeVariant}
        aria-label={effect === "notification" && badge !== undefined && badge !== null && badge !== "" ? `${label}, ${badge}` : label}
        aria-describedby={describedBy}
        aria-pressed={selectable ? isSelected : undefined}
        selected={selectable && isSelected}
        data-vt-studio-icon-button="true"
        data-icon-size-variant={iconSizeVariant}
        data-icon-variant={variant}
        data-icon-effect={effect}
        data-icon-only="true"
        data-icon-active={isSelected || isSuccess || animate ? "true" : "false"}
        data-pop={animate && animationKey > 0 ? "true" : undefined}
        data-success={isSuccess ? "true" : undefined}
        data-has-badge={badgeValue !== null ? "true" : undefined}
        data-notification-pulse={effect === "notification" && badgeValue !== null && animationKey > 0 ? "true" : undefined}
        onClick={handleClick}
      >
        <span aria-hidden="true" data-vt-studio-button-icon data-vt-square-icon-stage>
          {effect === "flip" ? (
            <span data-vt-square-flip-inner>
              <span data-vt-square-flip-face="front">{icon}</span>
              <span data-vt-square-flip-face="back">{alternateNode}</span>
            </span>
          ) : effect === "morph" ? (
            <span data-vt-square-morph-inner>
              <span data-vt-square-morph-face="front">{icon}</span>
              <span data-vt-square-morph-face="back">{alternateNode}</span>
            </span>
          ) : (
            <span key={`${effect}:${animationKey}:${effect === "notification" ? String(badge ?? "") : ""}`} data-vt-square-icon-current>{iconNode}</span>
          )}
        </span>
        {effect === "notification" && badge !== undefined && badge !== null && badge !== "" ? (
          <span key={`${String(badge)}:${animationKey}`} data-vt-square-badge aria-hidden="true">{badge}</span>
        ) : null}
        {effect === "tooltip" && tooltip ? (
          <span id={tooltipId} role="tooltip" data-vt-square-tooltip>{tooltip}</span>
        ) : null}
        {effect === "success" && isSuccess && tooltip ? (
          <span id={successStatusId} role="status" aria-live="polite" aria-atomic="true" data-vt-square-success-label>{tooltip}</span>
        ) : null}
      </StudioButton>
    )
  },
)
StudioSquareIconButton.displayName = "StudioSquareIconButton"

export interface StudioSplitLeftButtonProps extends StudioButtonProps {
  /** Visual comparison preset; outer button geometry is unchanged. */
  iconSizeVariant?: StudioIconSizeVariant
  icon: React.ReactNode
}

export const StudioSplitLeftButton = React.forwardRef<HTMLButtonElement, StudioSplitLeftButtonProps>(
  ({ icon, children, sizeVariant = "standard", iconSizeVariant = "current", ...props }, ref) => (
    <StudioButton ref={ref} sizeVariant={sizeVariant} data-split-left="true" data-icon-size-variant={iconSizeVariant} {...props}>
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
  /** Accessible plain-text name when the visible label is rich React content. */
  accessibleLabel?: string
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
  label, accessibleLabel, options, value, defaultValue = [], onChange, sizeVariant = "standard",
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
  const menuAccessibleLabel = accessibleLabel ?? (typeof label === "string" || typeof label === "number" ? String(label) : "Filter options")
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
        <div className="vt-studio-legend-menu" style={{ maxHeight: maxMenuHeight }} id={listId} role="listbox" aria-label={menuAccessibleLabel} aria-multiselectable="true">
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
