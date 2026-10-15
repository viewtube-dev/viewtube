import React from "react"
import type { StudioControlSize } from "../tokens"
import "../../styles/studio-control-system.css"

const withStudioAttrs = (size: StudioControlSize) => ({
  "data-vt-studio-control": "true",
  "data-size": size,
})

type StudioTextInputBaseProps = React.InputHTMLAttributes<HTMLInputElement> & {
  sizeVariant?: StudioControlSize
}

type StudioTextInputSimpleProps = StudioTextInputBaseProps & {
  variant?: "simple"
  label?: never
  level?: never
  floatingLabelVariant?: never
  controlClassName?: never
  controlStyle?: never
}

type StudioTextInputFloatingLabelProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "size" | "className" | "style"
> & {
  sizeVariant?: StudioControlSize
  /** Render the canonical input with the shared floating-label treatment. */
  variant: "floating-label"
  label: string
  level?: "l0" | "l1" | "l2"
  /** Optional catalog specimen variant; B adds the documented compact focus stroke. */
  floatingLabelVariant?: "a" | "b"
  /** className/style target the field wrapper in floating-label mode. */
  className?: string
  style?: React.CSSProperties
  /** Optional direct styling for the native input inside the wrapper. */
  controlClassName?: string
  controlStyle?: React.CSSProperties
}

export type StudioTextInputProps = StudioTextInputSimpleProps | StudioTextInputFloatingLabelProps

/**
 * Canonical single-line Studio input family.
 * Simple and floating-label presentations are variants of this one primitive.
 * All variants share the same global 38px/24px typography and size geometry.
 */
export const StudioTextInput = React.forwardRef<HTMLInputElement, StudioTextInputProps>(
  (props, ref) => {
    const generatedId = React.useId()
    const {
      variant = "simple",
      label,
      level = "l1",
      floatingLabelVariant = "a",
      sizeVariant = "standard",
      type = "text",
      placeholder = "TYPE HERE",
      spellCheck = false,
      autoCorrect = "off",
      autoCapitalize = "off",
      id,
    } = props
    const fieldId = id ?? `studio-text-input-${generatedId}`

    if (variant === "floating-label") {
      const { className, style, controlClassName, controlStyle, variant: _variant, label: _label, level: _level, floatingLabelVariant: _floatingLabelVariant, sizeVariant: _sizeVariant, placeholder: _placeholder, ...inputProps } = props
      void [_variant, _label, _level, _floatingLabelVariant, _sizeVariant, _placeholder]
      return (
        <div
          data-vt-primitive-id="141"
          data-vt-studio-field="floating-input"
          data-vt-studio-field-variant="floating-label"
          data-vt-control-level={level}
          data-vt-floating-variant={floatingLabelVariant}
          className={["vt-studio-floating-field", "is-input", className].filter(Boolean).join(" ")}
          style={style}
        >
          <input
            ref={ref}
            id={fieldId}
            type={type}
            data-vt-studio-field-kind="text-input"
            placeholder=" "
            spellCheck={spellCheck}
            autoCorrect={autoCorrect}
            autoCapitalize={autoCapitalize}
            {...inputProps}
            className={controlClassName}
            style={controlStyle}
            {...withStudioAttrs(sizeVariant)}
          />
          <label className="vt-studio-floating-field-label" htmlFor={fieldId}>{label}</label>
        </div>
      )
    }

    const { className, style, variant: _variant, label: _label, level: _level, floatingLabelVariant: _floatingLabelVariant, sizeVariant: _sizeVariant, ...inputProps } = props
    void [_variant, _label, _level, _floatingLabelVariant, _sizeVariant]
    return (
      <input
        ref={ref}
        id={id}
        type={type}
        data-vt-studio-field-kind="text-input"
        placeholder={placeholder}
        spellCheck={spellCheck}
        autoCorrect={autoCorrect}
        autoCapitalize={autoCapitalize}
        {...inputProps}
        className={className}
        style={style}
        {...withStudioAttrs(sizeVariant)}
      />
    )
  },
)
StudioTextInput.displayName = "StudioTextInput"

/** Backwards-compatible canonical names used by existing Studio consumers. */
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
