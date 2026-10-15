import React from "react"
import { ChevronDown } from "lucide-react"
import "../../styles/studio-control-system.css"

export interface StudioSimpleDropdownOption { value: string; label: string; disabled?: boolean }
export interface StudioSimpleDropdownProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "size"> {
  options: StudioSimpleDropdownOption[]
  size?: "standard" | "compact"
  placeholder?: string
}

/** Plain single-choice Studio Controls dropdown: no row checkboxes, multi-select, or floating label. */
export const StudioSimpleDropdown: React.FC<StudioSimpleDropdownProps> = ({
  options, size = "standard", placeholder, className, ...props
}) => (
  <div className={["vt-studio-simple-dropdown", className].filter(Boolean).join(" ")} data-vt-studio-control="true" data-vt-studio-control-family="dropdown" data-vt-studio-control-kind="simple-dropdown" data-size={size}>
    <select {...props} aria-label={props["aria-label"] || "Choose an option"}>
      {placeholder != null && <option value="" disabled>{placeholder}</option>}
      {options.map(option => <option key={option.value} value={option.value} disabled={option.disabled}>{option.label}</option>)}
    </select>
    <ChevronDown aria-hidden="true" className="vt-studio-simple-dropdown__icon" />
  </div>
)

StudioSimpleDropdown.displayName = "StudioSimpleDropdown"
