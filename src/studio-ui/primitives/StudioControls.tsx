import React from "react"
import type { StudioControlSize } from "../tokens"
import { SubToolboxInput20, SubToolboxTextArea21 } from "../../components/subtoolbox/SubToolboxPrimitives"
import "../../styles/studio-split-left-consistency.css"

export type StudioControlTone = "accent" | "neutral" | "danger" | "warning" | "success"

const withStudioAttrs = (size: StudioControlSize, tone?: StudioControlTone) => ({
  "data-vt-studio-control": "true",
  "data-size": size,
  ...(tone ? { "data-tone": tone } : {}),
})

/** Public Studio facade over canonical primitive 20; not an independent input implementation. */
export const StudioInput = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & { sizeVariant?: Exclude<StudioControlSize, "action"> }
>(({ sizeVariant = "standard", ...props }, ref) => (
  <SubToolboxInput20 ref={ref} controlSize={sizeVariant === "compact" ? "compact" : "standard"} {...withStudioAttrs(sizeVariant)} {...props} />
))
StudioInput.displayName = "StudioInput"

/** Search facade over canonical primitive 20. */
export const StudioSearchInput = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & { sizeVariant?: Exclude<StudioControlSize, "action"> }
>(({ sizeVariant = "standard", type = "search", ...props }, ref) => (
  <SubToolboxInput20 ref={ref} controlSize={sizeVariant === "compact" ? "compact" : "standard"} type={type} {...withStudioAttrs(sizeVariant)} {...props} />
))
StudioSearchInput.displayName = "StudioSearchInput"

/** Number facade over canonical primitive 20. */
export const StudioNumberInput = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & { sizeVariant?: Exclude<StudioControlSize, "action"> }
>(({ sizeVariant = "standard", type = "number", ...props }, ref) => (
  <SubToolboxInput20 ref={ref} controlSize={sizeVariant === "compact" ? "compact" : "standard"} type={type} {...withStudioAttrs(sizeVariant)} {...props} />
))
StudioNumberInput.displayName = "StudioNumberInput"

/** Public Studio facade over canonical primitive 21; not an independent textarea implementation. */
export const StudioTextArea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement> & { sizeVariant?: Exclude<StudioControlSize, "action"> }
>(({ sizeVariant = "standard", ...props }, ref) => <SubToolboxTextArea21 ref={ref} height={sizeVariant === "compact" ? "compact" : "standard"} {...withStudioAttrs(sizeVariant)} {...props} />)
StudioTextArea.displayName = "StudioTextArea"

export const StudioSelect = React.forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement> & { sizeVariant?: Exclude<StudioControlSize, "action"> }
>(({ sizeVariant = "standard", ...props }, ref) => (
  <select ref={ref} {...withStudioAttrs(sizeVariant)} {...props} />
))
StudioSelect.displayName = "StudioSelect"

export interface StudioButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  sizeVariant?: StudioControlSize
  tone?: StudioControlTone
  loading?: boolean
  selected?: boolean
  /** Explicit geometry variant for the confirmed 44px and 28px button family. */
  heightVariant?: "44" | "28"
}

export const StudioButton = React.forwardRef<HTMLButtonElement, StudioButtonProps>(
  ({ sizeVariant = "standard", tone = "accent", loading = false, selected = false, heightVariant = "44", disabled, children, type = "button", ...props }, ref) => (
    <button
      ref={ref}
      type={type}
      {...withStudioAttrs(sizeVariant, tone)}
      data-height-variant={heightVariant}
      data-selected={selected || undefined}
      aria-pressed={props["aria-pressed"] ?? (selected || undefined)}
      aria-busy={loading || undefined}
      disabled={disabled || loading}
      {...props}
    >
      {children}
    </button>
  ),
)
StudioButton.displayName = "StudioButton"

export interface StudioIconButtonProps extends Omit<StudioButtonProps, "children"> {
  icon: React.ReactNode
  label: string
}

export const StudioIconButton = React.forwardRef<HTMLButtonElement, StudioIconButtonProps>(
  ({ icon, label, ...props }, ref) => (
    <StudioButton ref={ref} aria-label={label} data-icon-only="true" {...props}>
      <span aria-hidden="true" data-vt-studio-button-icon>{icon}</span>
    </StudioButton>
  ),
)
StudioIconButton.displayName = "StudioIconButton"

export interface StudioSplitLeftButtonProps extends StudioButtonProps {
  icon: React.ReactNode
}

export const StudioSplitLeftButton = React.forwardRef<HTMLButtonElement, StudioSplitLeftButtonProps>(
  ({ icon, children, sizeVariant = "standard", ...props }, ref) => (
    <StudioButton ref={ref} sizeVariant={sizeVariant} data-split-left="true" {...props}>
      <span
        aria-hidden="true"
        data-vt-studio-split-rail
      >
        {icon}
      </span>
      <span data-vt-studio-split-label>{children}</span>
    </StudioButton>
  ),
)
StudioSplitLeftButton.displayName = "StudioSplitLeftButton"
