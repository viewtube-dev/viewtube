import React from "react"
import "../../styles/studio-input.css"

export type StudioinputSize = "standard" | "compact" | "micro"

export type StudioinputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> & {
  /** Studioinput-owned size setting; independent of Studio control tokens. */
  sizeVariant?: StudioinputSize
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
      data-studioinput-size={sizeVariant}
      data-studioinput="true"
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
