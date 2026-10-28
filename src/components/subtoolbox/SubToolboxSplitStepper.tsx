import React, { useCallback, useEffect, useRef } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"
import type { ToolboxControlLevel } from "./tokens"
import { getComponentLevelCssVars } from "./tokens"
import "../../styles/toolbox-entry.css"
import "./subtoolbox-split-stepper.css"

export interface SubToolboxSplitStepperProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  value: number
  onValueChange: (value: number) => void
  min?: number
  max?: number
  step?: number
  level?: ToolboxControlLevel
  size?: "compact" | "standard"
  disabled?: boolean
  ariaLabel?: string
}

/** Studio Controls split stepper: full-height 2:1 value pane and square rail split into two 2:1 controls. */
export const SubToolboxSplitStepper: React.FC<SubToolboxSplitStepperProps> = ({
  value, onValueChange, min = -Infinity, max = Infinity, step = 1,
  level = "l1", size = "standard", disabled = false, ariaLabel = "Value",
  className, style, ...props
}) => {
  const valueRef = useRef(value)
  valueRef.current = value
  const holdTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const repeatTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const startedAt = useRef(0)
  const heldDirection = useRef<-1 | 1>(1)
  const stopHold = useCallback(() => {
    if (holdTimer.current) clearTimeout(holdTimer.current)
    if (repeatTimer.current) clearTimeout(repeatTimer.current)
    holdTimer.current = null
    repeatTimer.current = null
  }, [])
  useEffect(() => stopHold, [stopHold])

  const change = useCallback((direction: -1 | 1) => {
    const next = Math.min(max, Math.max(min, valueRef.current + direction * step))
    valueRef.current = next
    onValueChange(next)
  }, [max, min, onValueChange, step, value])

  const scheduleRepeat = useCallback(() => {
    const elapsed = Date.now() - startedAt.current
    const delay = elapsed > 2200 ? 38 : elapsed > 1200 ? 65 : elapsed > 500 ? 110 : 220
    repeatTimer.current = setTimeout(() => {
      change(heldDirection.current)
      scheduleRepeat()
    }, delay)
  }, [change])

  const beginHold = (direction: -1 | 1) => {
    if (disabled) return
    stopHold()
    heldDirection.current = direction
    startedAt.current = Date.now()
    change(direction)
    holdTimer.current = setTimeout(scheduleRepeat, 360)
  }

  const levelStyle = level ? getComponentLevelCssVars(level) : {}
  return <div
    {...props}
    className={["vt-subtoolbox-split-stepper", `is-${size}`, className].filter(Boolean).join(" ")}
    data-vt-control-level={level}
    role="group"
    aria-label={ariaLabel}
    style={{ ...levelStyle, ...style } as React.CSSProperties}
  >
    <output className="vt-subtoolbox-split-stepper-value" aria-live="polite" aria-atomic="true">{value}</output>
    <div className="vt-subtoolbox-split-stepper-rail">
      <button type="button" className="vt-subtoolbox-split-stepper-up" aria-label={`Increase ${ariaLabel}`} disabled={disabled || value >= max}
        onPointerDown={(event) => { if (event.button !== 0) return; event.preventDefault(); beginHold(1) }}
        onPointerUp={stopHold} onPointerLeave={stopHold} onPointerCancel={stopHold} onClick={(event) => event.preventDefault()}>
        <ChevronUp aria-hidden="true" />
      </button>
      <button type="button" className="vt-subtoolbox-split-stepper-down" aria-label={`Decrease ${ariaLabel}`} disabled={disabled || value <= min}
        onPointerDown={(event) => { if (event.button !== 0) return; event.preventDefault(); beginHold(-1) }}
        onPointerUp={stopHold} onPointerLeave={stopHold} onPointerCancel={stopHold} onClick={(event) => event.preventDefault()}>
        <ChevronDown aria-hidden="true" />
      </button>
    </div>
  </div>
}

export default SubToolboxSplitStepper
