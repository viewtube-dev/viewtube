import React from "react"
import type { StudioControlSize } from "../tokens"
import "../../styles/studio-control-system.css"

const withStudioAttrs = (size: StudioControlSize) => ({
  "data-vt-studio-control": "true",
  "data-size": size,
})

/**
 * Canonical multiline Studio writing-surface family.
 * Standalone and floating-label textareas share typography and multiline geometry.
 */
export const StudioTextArea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement> & { sizeVariant?: StudioControlSize }
>(({ sizeVariant = "standard", rows, placeholder = "TYPE HERE", spellCheck = false, autoCorrect = "off", autoCapitalize = "off", ...props }, ref) => (
  <textarea
    ref={ref}
    rows={rows ?? 4}
    data-vt-studio-field-kind="textarea"
    placeholder={placeholder}
    spellCheck={spellCheck}
    autoCorrect={autoCorrect}
    autoCapitalize={autoCapitalize}
    {...props}
    {...withStudioAttrs(sizeVariant)}
  />
))
StudioTextArea.displayName = "StudioTextArea"

export interface StudioLabeledTextAreaProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "placeholder"> {
  label: string
  sizeVariant?: StudioControlSize
  level?: "l0" | "l1" | "l2"
}

/** Floating-label textarea composed from the canonical multiline family. */
export const StudioLabeledTextArea = React.forwardRef<HTMLTextAreaElement, StudioLabeledTextAreaProps>(
  ({ label, sizeVariant = "standard", level = "l1", className, style, id, ...props }, ref) => {
    const generatedId = React.useId()
    const fieldId = id ?? `studio-labeled-textarea-${generatedId}`
    return <div data-vt-primitive-id="142" data-vt-studio-field="floating-textarea" data-vt-control-level={level}
      className={["vt-studio-floating-field", "is-textarea", className].filter(Boolean).join(" ")} style={style}>
      <StudioTextArea ref={ref} id={fieldId} sizeVariant={sizeVariant} placeholder=" " {...props} />
      <label className="vt-studio-floating-field-label" htmlFor={fieldId}>{label}</label>
    </div>
  },
)
StudioLabeledTextArea.displayName = "StudioLabeledTextArea"
