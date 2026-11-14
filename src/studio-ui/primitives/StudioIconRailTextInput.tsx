// QUARANTINED 2026-11-14: retained for rollback/reference only; not a public Studio primitive.
import React from "react"
import { StudioSplitShell, StudioTextInput } from "./StudioControls"
import type { StudioControlSize } from "../tokens"
import "./studio-icon-rail-text-input.css"

type Layout = "left" | "right" | "double"
type Shared = Omit<React.InputHTMLAttributes<HTMLInputElement>, "size" | "value" | "defaultValue" | "onChange" | "type" | "className" | "style"> & {
  value: string; onValueChange: (value: string) => void; size?: StudioControlSize; ariaLabel?: string
  className?: string; inputClassName?: string; inputStyle?: React.CSSProperties
}
export interface StudioIconRailTextInputProps extends Shared { leftIcon?: React.ReactNode; rightIcon?: React.ReactNode }
const IconRailBase = React.forwardRef<HTMLInputElement, StudioIconRailTextInputProps & { layout: Layout; name: string }>(
  ({ layout, name, value, onValueChange, size = "standard", ariaLabel = "Alphabetical text", leftIcon, rightIcon, className, inputClassName, inputStyle, ...inputProps }, ref) => {
    const rail = (icon: React.ReactNode, side: "left" | "right") => <span className={`vt-studio-icon-rail-text-input__glyph is-${side}`} aria-hidden="true">{icon}</span>
    return <StudioSplitShell layout={layout} fieldSlot sizeVariant={size}
      className={[`vt-studio-icon-rail-text-input ${name}`, className].filter(Boolean).join(" ")}
      railClassName="vt-studio-icon-rail-text-input__rail"
      leftRailContent={layout !== "right" ? rail(leftIcon, "left") : undefined}
      rightRailContent={layout !== "left" ? rail(rightIcon, "right") : undefined}
      shellProps={{ role: "group", "aria-label": ariaLabel, "data-vt-studio-control-family": "text-input", "data-vt-studio-control-kind": "icon-rail-text-input", "data-vt-library-component": name }}>
      <StudioTextInput {...inputProps} ref={ref} type="text" value={value} onChange={event => onValueChange(event.currentTarget.value)}
        aria-label={inputProps["aria-label"] ?? ariaLabel} autoCapitalize={inputProps.autoCapitalize ?? "characters"}
        inputMode={inputProps.inputMode ?? "text"} spellCheck={inputProps.spellCheck ?? false} sizeVariant={size}
        className={["vt-studio-icon-rail-text-input__input", inputClassName].filter(Boolean).join(" ")} style={inputStyle} />
    </StudioSplitShell>
  },
)
IconRailBase.displayName = "StudioIconRailTextInputBase"
export const StudioSplitLeftIconRailTextInput = React.forwardRef<HTMLInputElement, StudioIconRailTextInputProps>((p,r)=><IconRailBase {...p} ref={r} layout="left" name="StudioSplitLeftIconRailTextInput"/>)
StudioSplitLeftIconRailTextInput.displayName = "StudioSplitLeftIconRailTextInput"
export const StudioSplitRightIconRailTextInput = React.forwardRef<HTMLInputElement, StudioIconRailTextInputProps>((p,r)=><IconRailBase {...p} ref={r} layout="right" name="StudioSplitRightIconRailTextInput"/>)
StudioSplitRightIconRailTextInput.displayName = "StudioSplitRightIconRailTextInput"
export const StudioDoubleSplitIconRailTextInput = React.forwardRef<HTMLInputElement, StudioIconRailTextInputProps>((p,r)=><IconRailBase {...p} ref={r} layout="double" name="StudioDoubleSplitIconRailTextInput"/>)
StudioDoubleSplitIconRailTextInput.displayName = "StudioDoubleSplitIconRailTextInput"

export interface StudioIconButtonRailTextInputProps extends Shared {
  leftIcon?: React.ReactNode; rightIcon?: React.ReactNode; leftIconLabel?: string; rightIconLabel?: string
  onLeftIconClick?: React.MouseEventHandler<HTMLButtonElement>; onRightIconClick?: React.MouseEventHandler<HTMLButtonElement>
  leftIconDisabled?: boolean; rightIconDisabled?: boolean
}
const IconButtonRailBase = React.forwardRef<HTMLInputElement, StudioIconButtonRailTextInputProps & { layout: Layout; name: string }>(
  ({ layout, name, value, onValueChange, size = "standard", ariaLabel = "Alphabetical text", leftIcon, rightIcon, leftIconLabel, rightIconLabel, onLeftIconClick, onRightIconClick, leftIconDisabled = false, rightIconDisabled = false, className, inputClassName, inputStyle, ...inputProps }, ref) => {
    const button = (icon: React.ReactNode, side: "left" | "right") => <button type="button"
      className={`vt-studio-icon-button-rail-text-input__button is-${side}`}
      aria-label={(side === "left" ? leftIconLabel : rightIconLabel) ?? `${side === "left" ? "Left" : "Right"} icon action for ${ariaLabel}`}
      disabled={side === "left" ? leftIconDisabled || !onLeftIconClick : rightIconDisabled || !onRightIconClick}
      onClick={side === "left" ? onLeftIconClick : onRightIconClick}><span aria-hidden="true">{icon}</span></button>
    return <StudioSplitShell layout={layout} fieldSlot sizeVariant={size}
      className={[`vt-studio-icon-button-rail-text-input ${name}`, className].filter(Boolean).join(" ")}
      railClassName="vt-studio-icon-button-rail-text-input__rail"
      leftRailContent={layout !== "right" ? button(leftIcon, "left") : undefined}
      rightRailContent={layout !== "left" ? button(rightIcon, "right") : undefined}
      shellProps={{ role: "group", "aria-label": ariaLabel, "data-vt-studio-control-family": "text-input", "data-vt-studio-control-kind": "icon-button-rail-text-input", "data-vt-library-component": name }}>
      <StudioTextInput {...inputProps} ref={ref} type="text" value={value} onChange={event => onValueChange(event.currentTarget.value)}
        aria-label={inputProps["aria-label"] ?? ariaLabel} autoCapitalize={inputProps.autoCapitalize ?? "characters"}
        inputMode={inputProps.inputMode ?? "text"} spellCheck={inputProps.spellCheck ?? false} sizeVariant={size}
        className={["vt-studio-icon-button-rail-text-input__input", inputClassName].filter(Boolean).join(" ")} style={inputStyle} />
    </StudioSplitShell>
  },
)
IconButtonRailBase.displayName = "StudioIconButtonRailTextInputBase"
export const StudioSplitLeftIconButtonTextInput = React.forwardRef<HTMLInputElement, StudioIconButtonRailTextInputProps>((p,r)=><IconButtonRailBase {...p} ref={r} layout="left" name="StudioSplitLeftIconButtonTextInput"/>)
StudioSplitLeftIconButtonTextInput.displayName = "StudioSplitLeftIconButtonTextInput"
export const StudioSplitRightIconButtonTextInput = React.forwardRef<HTMLInputElement, StudioIconButtonRailTextInputProps>((p,r)=><IconButtonRailBase {...p} ref={r} layout="right" name="StudioSplitRightIconButtonTextInput"/>)
StudioSplitRightIconButtonTextInput.displayName = "StudioSplitRightIconButtonTextInput"
export const StudioDoubleSplitIconButtonTextInput = React.forwardRef<HTMLInputElement, StudioIconButtonRailTextInputProps>((p,r)=><IconButtonRailBase {...p} ref={r} layout="double" name="StudioDoubleSplitIconButtonTextInput"/>)
StudioDoubleSplitIconButtonTextInput.displayName = "StudioDoubleSplitIconButtonTextInput"
