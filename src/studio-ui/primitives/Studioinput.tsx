import React from "react"
import type { StudioControlSize } from "../tokens"
import "../../styles/studio-input.css"

export type StudioinputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> & {
  /** Independent Studioinput primitive: standard 44px, compact 28px, micro 14px. */
  sizeVariant?: StudioControlSize
}

/**
 * Standalone Studioinput primitive. It owns its class, data contract, and CSS;
 * it is deliberately not an alias or wrapper around StudioTextInput.
 */
export const Studioinput = React.forwardRef<HTMLInputElement, StudioinputProps>(
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
      data-vt-studio-field-kind="studioinput"
      className={["vt-studio-input", className].filter(Boolean).join(" ")}
      placeholder={placeholder}
      spellCheck={spellCheck}
      autoCorrect={autoCorrect}
      autoCapitalize={autoCapitalize}
      {...rest}
    />
  ),
)

Studioinput.displayName = "Studioinput"
