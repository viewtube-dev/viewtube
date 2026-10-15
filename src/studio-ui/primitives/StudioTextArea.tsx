import React from "react"
import type { StudioControlSize } from "../tokens"
import "../../styles/studio-control-system.css"

const withStudioAttrs = (size: StudioControlSize) => ({
  "data-vt-studio-control": "true",
  "data-size": size,
})

type StudioTextAreaBaseProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  sizeVariant?: StudioControlSize
}

type StudioTextAreaSimpleProps = StudioTextAreaBaseProps & {
  variant?: "simple"
  label?: never
  level?: never
  fieldClassName?: never
  fieldStyle?: never
}

type StudioTextAreaFloatingLabelProps = Omit<
  React.TextareaHTMLAttributes<HTMLTextAreaElement>,
  "className" | "style"
> & {
  sizeVariant?: StudioControlSize
  /** Render the canonical writing surface with the shared floating-label treatment. */
  variant: "floating-label"
  label: string
  level?: "l0" | "l1" | "l2"
  /** className/style target the field wrapper in floating-label mode. */
  className?: string
  style?: React.CSSProperties
  /** Optional direct styling for the native textarea inside the wrapper. */
  fieldClassName?: string
  fieldStyle?: React.CSSProperties
}

type StudioTextAreaFixedLabelProps = Omit<
  React.TextareaHTMLAttributes<HTMLTextAreaElement>,
  "className" | "style"
> & {
  sizeVariant?: StudioControlSize
  /** Permanent top-left label box matching StudioLegendMultiDropdown. */
  variant: "fixed-label"
  label: string
  level?: "l0" | "l1" | "l2"
  className?: string
  style?: React.CSSProperties
  /** Optional direct styling for the native textarea inside the wrapper. */
  fieldClassName?: string
  fieldStyle?: React.CSSProperties
}

export type StudioTextAreaProps = StudioTextAreaSimpleProps | StudioTextAreaFloatingLabelProps | StudioTextAreaFixedLabelProps

/**
 * Canonical multiline Studio writing-surface family.
 * Simple and floating-label presentations are variants of this one primitive.
 * Textarea typography alone is 18px standard / 14px compact; the 92px minimum
 * writing surface, multiline padding, and vertical resize remain shared by variants.
 */
export const StudioTextArea = React.forwardRef<HTMLTextAreaElement, StudioTextAreaProps>(
  (props, ref) => {
    const generatedId = React.useId()
    const {
      variant = "simple",
      label,
      level = "l1",
      sizeVariant = "standard",
      rows,
      placeholder = "TYPE HERE",
      spellCheck = false,
      autoCorrect = "off",
      autoCapitalize = "off",
      id,
    } = props
    const fieldId = id ?? `studio-text-area-${generatedId}`

    if (variant === "fixed-label") {
      const { className, style, fieldClassName, fieldStyle, variant: _variant, label: _label, level: _level, sizeVariant: _sizeVariant, placeholder: _placeholder, ...areaProps } = props
      void [_variant, _label, _level, _sizeVariant, _placeholder]
      return (
        <div
          data-vt-primitive-id="144"
          data-vt-studio-field="fixed-label-textarea"
          data-vt-studio-field-variant="fixed-label"
          data-vt-control-level={level}
          data-size={sizeVariant}
          className={["vt-studio-fixed-label-field", "is-textarea", className].filter(Boolean).join(" ")}
          style={style}
        >
          <textarea
            ref={ref}
            id={fieldId}
            rows={rows ?? 4}
            data-vt-studio-field-kind="textarea"
            placeholder={placeholder === "TYPE HERE" ? " " : placeholder}
            spellCheck={spellCheck}
            autoCorrect={autoCorrect}
            autoCapitalize={autoCapitalize}
            {...areaProps}
            className={fieldClassName}
            style={fieldStyle}
            {...withStudioAttrs(sizeVariant)}
          />
          <label className="vt-studio-fixed-field-label" htmlFor={fieldId}>{label}</label>
        </div>
      )
    }

    if (variant === "floating-label") {
      const { className, style, fieldClassName, fieldStyle, variant: _variant, label: _label, level: _level, sizeVariant: _sizeVariant, placeholder: _placeholder, ...areaProps } = props
      void [_variant, _label, _level, _sizeVariant, _placeholder]
      return (
        <div
          data-vt-primitive-id="142"
          data-vt-studio-field="floating-textarea"
          data-vt-studio-field-variant="floating-label"
          data-size={sizeVariant}
          data-vt-control-level={level}
          className={["vt-studio-floating-field", "is-textarea", className].filter(Boolean).join(" ")}
          style={style}
        >
          <textarea
            ref={ref}
            id={fieldId}
            rows={rows ?? 4}
            data-vt-studio-field-kind="textarea"
            placeholder=" "
            spellCheck={spellCheck}
            autoCorrect={autoCorrect}
            autoCapitalize={autoCapitalize}
            {...areaProps}
            className={fieldClassName}
            style={fieldStyle}
            {...withStudioAttrs(sizeVariant)}
          />
          <label className="vt-studio-floating-field-label" htmlFor={fieldId}>{label}</label>
        </div>
      )
    }

    const { className, style, variant: _variant, label: _label, level: _level, sizeVariant: _sizeVariant, ...areaProps } = props
    void [_variant, _label, _level, _sizeVariant]
    return (
      <textarea
        ref={ref}
        id={id}
        rows={rows ?? 4}
        data-vt-studio-field-kind="textarea"
        placeholder={placeholder}
        spellCheck={spellCheck}
        autoCorrect={autoCorrect}
        autoCapitalize={autoCapitalize}
        {...areaProps}
        className={className}
        style={style}
        {...withStudioAttrs(sizeVariant)}
      />
    )
  },
)
StudioTextArea.displayName = "StudioTextArea"
