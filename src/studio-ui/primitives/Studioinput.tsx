import React from "react"
import "../../styles/studio-input.css"

/** Studioinput owns its size contract; it does not consume StudioControlSize or shared tokens. */
export type StudioinputSize = "standard" | "compact" | "micro"
export type StudioinputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> & {
  sizeVariant?: StudioinputSize
}

/**
 * Standalone Studioinput primitive.
 * No StudioTextInput import, shared size-token import, or shared control-token marker.
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
