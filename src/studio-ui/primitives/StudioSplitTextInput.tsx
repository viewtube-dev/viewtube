import React from "react"
import "../../styles/studio-split-text-input.css"
import type { StudioControlSize } from "../tokens"

export type StudioSplitTextInputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> & {
  sizeVariant?: StudioControlSize
  /** Temporary geometry selector for comparing vertical alignment and clipping behavior. */
  geometryVariant?: "current" | "padding-reference" | "half-vertical-padding" | "username-height"
  split?: "left" | "right" | "double"
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

/** A single editable input with canonical left, right, or double split rails. */
export const StudioSplitTextInput = React.forwardRef<HTMLInputElement, StudioSplitTextInputProps>(
  ({ sizeVariant = "standard", geometryVariant = "current", split = "left", leftIcon, rightIcon, className, ...props }, ref) => {
    const hasLeftRail = split === "left" || split === "double"
    const hasRightRail = split === "right" || split === "double"
    return (
      <div
        data-vt-studio-control="true"
        data-size={sizeVariant}
        data-vt-studio-split-shell="true"
        data-vt-studio-split={split}
        data-geometry-variant={geometryVariant}
        data-layout={split}
        className={["vt-studio-split-shell", "vt-studio-split-text-input", className].filter(Boolean).join(" ")}
      >
        {hasLeftRail && (
          <span className="vt-studio-split-shell__rail" data-vt-studio-split-rail="start" data-rail="start" aria-hidden="true">
            {leftIcon}
          </span>
        )}
        <input
          ref={ref}
          data-vt-studio-control="true"
          data-size={sizeVariant}
          data-vt-studio-field-kind="text-input"
          data-geometry-variant={geometryVariant}
          className="vt-studio-split-text-input__field"
          {...props}
        />
        {hasRightRail && (
          <span className="vt-studio-split-shell__rail" data-vt-studio-split-rail="end" data-rail="end" aria-hidden="true">
            {rightIcon}
          </span>
        )}
      </div>
    )
  },
)
StudioSplitTextInput.displayName = "StudioSplitTextInput"
