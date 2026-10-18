import React from "react"
import type { StudioControlSize } from "../tokens"

export type StudioTextInputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "size"
> & {
  /** standard = 44/38 · compact = 28/24 · micro = 14/10 */
  sizeVariant?: StudioControlSize
}

/**
 * Plain Studio text input — foundation primitive only.
 * No floating label, no fixed label, no variants.
 */
export const StudioTextInput = React.forwardRef<HTMLInputElement, StudioTextInputProps>(
  (
    {
      sizeVariant = "standard",
      type = "text",
      placeholder = "TYPE HERE",
      className,
      spellCheck = false,
      autoCorrect = "off",
      autoCapitalize = "off",
      ...rest
    },
    ref,
  ) => (
    <input
      ref={ref}
      type={type}
      data-size={sizeVariant}
      data-vt-studio-control="true"
      data-vt-studio-field-kind="text-input"
      className={["vt-studio-text-input", className].filter(Boolean).join(" ")}
      placeholder={placeholder}
      spellCheck={spellCheck}
      autoCorrect={autoCorrect}
      autoCapitalize={autoCapitalize}
      {...rest}
    />
  ),
)

StudioTextInput.displayName = "StudioTextInput"

/** Back-compat alias for the canonical plain input. */
export const StudioInput = StudioTextInput
