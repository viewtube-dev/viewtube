import React from "react"
import type { StudioControlSize } from "../tokens"
import "../../styles/studio-control-entry.css"
import "../../styles/studio-text-input.css"

const withStudioAttrs = (size: StudioControlSize) => ({
  "data-vt-studio-control": "true",
  "data-size": size,
})

type StudioTextInputBaseProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "size"
> & {
  /** Supreme = 60/51.82 · standard = 44/38 · compact = 28/24 · Mini = 20/16 · micro = 12/10 */
  sizeVariant?: StudioControlSize
}

type StudioTextInputSimpleProps = StudioTextInputBaseProps & {
  variant?: "simple"
  label?: never
  level?: never
  floatingLabelVariant?: never
  fieldClassName?: never
  fieldStyle?: never
}

type StudioTextInputFloatingLabelProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "size" | "className" | "style"
> & {
  sizeVariant?: StudioControlSize
  /** Render the canonical single-line input with the shared floating-label treatment. */
  variant: "floating-label"
  label: string
  level?: "l0" | "l1" | "l2"
  /** A/B catalog specimen; B reverses colors and adds the compact secondary focus stroke. */
  floatingLabelVariant?: "a" | "b"
  /** className/style target the field wrapper in floating-label mode. */
  className?: string
  style?: React.CSSProperties
  /** Optional direct styling for the native input inside the wrapper. */
  fieldClassName?: string
  fieldStyle?: React.CSSProperties
}

type StudioTextInputFixedLabelProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "size" | "className" | "style"
> & {
  sizeVariant?: StudioControlSize
  /** Permanent top-left label box matching StudioLegendMultiDropdown. */
  variant: "fixed-label"
  label: string
  level?: "l0" | "l1" | "l2"
  className?: string
  style?: React.CSSProperties
  /** Optional direct styling for the native input inside the wrapper. */
  fieldClassName?: string
  fieldStyle?: React.CSSProperties
  floatingLabelVariant?: never
}

export type StudioTextInputProps =
  | StudioTextInputSimpleProps
  | StudioTextInputFloatingLabelProps
  | StudioTextInputFixedLabelProps

/**
 * Canonical single-line Studio input family.
 * Simple, floating-label, and fixed-label presentations share the same native
 * input typography: 51.82px Supreme / 38px standard / 24px compact / 16px Mini / 10px micro.
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

    if (variant === "fixed-label") {
      const {
        className,
        style,
        fieldClassName,
        fieldStyle,
        variant: _variant,
        label: _label,
        level: _level,
        sizeVariant: _sizeVariant,
        floatingLabelVariant: _floatingLabelVariant,
        type: _type,
        placeholder: _placeholder,
        spellCheck: _spellCheck,
        autoCorrect: _autoCorrect,
        autoCapitalize: _autoCapitalize,
        id: _id,
        ...inputProps
      } = props
      void [_variant, _label, _level, _sizeVariant, _floatingLabelVariant, _type, _placeholder, _spellCheck, _autoCorrect, _autoCapitalize, _id]
      return (
        <div
          data-vt-studio-field="fixed-label-input"
          data-vt-studio-field-variant="fixed-label"
          data-vt-control-level={level}
          data-size={sizeVariant}
          className={["vt-studio-fixed-label-field", className].filter(Boolean).join(" ")}
          style={style}
        >
          <input
            ref={ref}
            id={fieldId}
            type={type}
            data-vt-studio-field-kind="text-input"
            placeholder={placeholder === "TYPE HERE" ? " " : placeholder}
            spellCheck={spellCheck}
            autoCorrect={autoCorrect}
            autoCapitalize={autoCapitalize}
            {...inputProps}
            className={["vt-studio-text-input", fieldClassName].filter(Boolean).join(" ")}
            style={fieldStyle}
            {...withStudioAttrs(sizeVariant)}
          />
          <label className="vt-studio-fixed-field-label" htmlFor={fieldId}>{label}</label>
        </div>
      )
    }

    if (variant === "floating-label") {
      const {
        className,
        style,
        fieldClassName,
        fieldStyle,
        variant: _variant,
        label: _label,
        level: _level,
        floatingLabelVariant: _floatingLabelVariant,
        sizeVariant: _sizeVariant,
        type: _type,
        placeholder: _placeholder,
        spellCheck: _spellCheck,
        autoCorrect: _autoCorrect,
        autoCapitalize: _autoCapitalize,
        id: _id,
        ...inputProps
      } = props
      void [_variant, _label, _level, _floatingLabelVariant, _sizeVariant, _type, _placeholder, _spellCheck, _autoCorrect, _autoCapitalize, _id]
      return (
        <div
          data-vt-studio-field="floating-input"
          data-vt-studio-field-variant="floating-label"
          data-size={sizeVariant}
          data-vt-control-level={level}
          data-vt-floating-variant={floatingLabelVariant}
          className={["vt-studio-floating-field", className].filter(Boolean).join(" ")}
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
            className={["vt-studio-text-input", fieldClassName].filter(Boolean).join(" ")}
            style={fieldStyle}
            {...withStudioAttrs(sizeVariant)}
          />
          <label className="vt-studio-floating-field-label" htmlFor={fieldId}>{label}</label>
        </div>
      )
    }

    const {
      className,
      style,
      variant: _variant,
      label: _label,
      level: _level,
      sizeVariant: _sizeVariant,
      floatingLabelVariant: _floatingLabelVariant,
      type: _type,
      placeholder: _placeholder,
      spellCheck: _spellCheck,
      autoCorrect: _autoCorrect,
      autoCapitalize: _autoCapitalize,
      id: _id,
      ...inputProps
    } = props
    void [_variant, _label, _level, _sizeVariant, _floatingLabelVariant, _type, _placeholder, _spellCheck, _autoCorrect, _autoCapitalize, _id]
    return (
      <input
        ref={ref}
        id={id}
        type={type}
        data-size={sizeVariant}
        data-vt-studio-control="true"
        data-vt-studio-field-kind="text-input"
        className={["vt-studio-text-input", "vt-studio-text-input--simple", className].filter(Boolean).join(" ")}
        placeholder={placeholder}
        spellCheck={spellCheck}
        autoCorrect={autoCorrect}
        autoCapitalize={autoCapitalize}
        {...inputProps}
        style={style}
      />
    )
  },
)

StudioTextInput.displayName = "StudioTextInput"

/** Back-compat alias for the canonical input family. */
export const StudioInput = StudioTextInput
