import React from "react"
import type { StudioControlSize } from "../tokens"
import "../../styles/studio-control-entry.css"
import "../../styles/studio-text-box.css"

export type StudioTextBoxSize = StudioControlSize
export type StudioTextBoxProps = Omit<React.HTMLAttributes<HTMLDivElement>, "children"> & {
  /** Plain text content; embedded newlines are preserved and content grows naturally. */
  children?: string
  sizeVariant?: StudioTextBoxSize
}

/** Non-editable, selectable text display using the corresponding textarea size tokens. */
export const StudioTextBox = React.forwardRef<HTMLDivElement, StudioTextBoxProps>(
  ({ children, sizeVariant = "standard", className, ...props }, ref) => (
    <div
      {...props}
      ref={ref}
      className={["vt-studio-text-box", className].filter(Boolean).join(" ")}
      data-vt-studio-control="true"
      data-vt-studio-text-box="true"
      data-size={sizeVariant}
      aria-readonly="true"
    >
      {children}
    </div>
  ),
)
StudioTextBox.displayName = "StudioTextBox"
