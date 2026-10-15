import React from "react"
import type { StudioControlSize } from "../tokens"
import "../../styles/studio-control-system.css"

const withStudioAttrs = (size: StudioControlSize) => ({
  "data-vt-studio-control": "true",
  "data-size": size,
})

/**
 * Canonical single-line Studio input family.
 * Standalone, search, number and floating-label inputs share the same size tokens.
 */
export const StudioTextInput = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & { sizeVariant?: StudioControlSize }
>(({ sizeVariant = "standard", type = "text", placeholder = "TYPE HERE", spellCheck = false, autoCorrect = "off", autoCapitalize = "off", ...props }, ref) => (
  <input
    ref={ref}
    type={type}
    data-vt-studio-field-kind="text-input"
    placeholder={placeholder}
    spellCheck={spellCheck}
    autoCorrect={autoCorrect}
    autoCapitalize={autoCapitalize}
    {...props}
    {...withStudioAttrs(sizeVariant)}
  />
))
StudioTextInput.displayName = "StudioTextInput"

/** Backwards-compatible canonical name used by existing Studio consumers. */
export const StudioInput = StudioTextInput

export const StudioSearchInput = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & { sizeVariant?: StudioControlSize }
>(({ sizeVariant = "standard", type = "search", placeholder = "TYPE HERE", ...props }, ref) => (
  <input ref={ref} type={type} autoCorrect="off" autoCapitalize="off" spellCheck={false} placeholder={placeholder} {...props} {...withStudioAttrs(sizeVariant)} />
))
StudioSearchInput.displayName = "StudioSearchInput"

export const StudioNumberInput = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & { sizeVariant?: StudioControlSize }
>(({ sizeVariant = "standard", type = "number", placeholder = "TYPE HERE", ...props }, ref) => (
  <input ref={ref} type={type} placeholder={placeholder} autoCorrect="off" autoCapitalize="off" spellCheck={false} {...props} {...withStudioAttrs(sizeVariant)} />
))
StudioNumberInput.displayName = "StudioNumberInput"

export interface StudioLabeledInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size" | "placeholder"> {
  label: string
  sizeVariant?: StudioControlSize
  level?: "l0" | "l1" | "l2"
  /** Specimen variant; B adds the documented compact secondary-color focus stroke. */
  variant?: "a" | "b"
}

/** Floating-label input composed from the canonical single-line input family. */
export const StudioLabeledInput = React.forwardRef<HTMLInputElement, StudioLabeledInputProps>(
  ({ label, sizeVariant = "standard", level = "l1", variant = "a", className, style, id, ...props }, ref) => {
    const generatedId = React.useId()
    const fieldId = id ?? `studio-labeled-input-${generatedId}`
    return <div data-vt-primitive-id="141" data-vt-studio-field="floating-input" data-vt-control-level={level} data-vt-floating-variant={variant}
      className={["vt-studio-floating-field", "is-input", className].filter(Boolean).join(" ")} style={style}>
      <StudioTextInput ref={ref} id={fieldId} sizeVariant={sizeVariant} placeholder=" " {...props} />
      <label className="vt-studio-floating-field-label" htmlFor={fieldId}>{label}</label>
    </div>
  },
)
StudioLabeledInput.displayName = "StudioLabeledInput"
