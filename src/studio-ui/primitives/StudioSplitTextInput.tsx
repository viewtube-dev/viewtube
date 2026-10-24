import React from "react"
import type { StudioControlSize } from "../tokens"

export type StudioSplitTextInputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> & {
  sizeVariant?: StudioControlSize
  icon?: React.ReactNode
  layout?: "left" | "right"
}

/** Text input with a canonical square split rail and one shared outer shell. */
export const StudioSplitTextInput = React.forwardRef<HTMLInputElement, StudioSplitTextInputProps>(
  ({ sizeVariant = "standard", icon, layout = "left", className, ...props }, ref) => (
    <div
      data-vt-studio-control="true"
      data-size={sizeVariant}
      data-vt-studio-split-shell="true"
      data-layout={layout}
      className={["vt-studio-split-shell", "vt-studio-split-text-input", className].filter(Boolean).join(" ")}
    >
      {layout === "left" && <span className="vt-studio-split-shell__rail" data-rail="start" aria-hidden="true">{icon}</span>}
      <input
        ref={ref}
        data-vt-studio-control="true"
        data-size={sizeVariant}
        className="vt-studio-split-text-input__field"
        {...props}
      />
      {layout === "right" && <span className="vt-studio-split-shell__rail" data-rail="end" aria-hidden="true">{icon}</span>}
    </div>
  ),
)
StudioSplitTextInput.displayName = "StudioSplitTextInput"
