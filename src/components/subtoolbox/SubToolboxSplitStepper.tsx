import React, { useCallback, useEffect, useRef, useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"
import { StudioTextInput } from "../../studio-ui/primitives/StudioTextInput"
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

const HOLD_FOCUS_DELAY = 160

/** Canonical Studio Controls stepper: fixed 3:1 overall width, 2:1 editable value field and square two-button rail. */
export const SubToolboxSplitStepper: React.FC<SubToolboxSplitStepperProps> = ({
  value,
  onValueChange,
  min = -Infinity,
  max = Infinity,
  step = 1,
  level = "l1",
  size = "standard",
  disabled = false,
  ariaLabel = "Value",
  className,
  style,
  ...props
}) => {
  const [draftValue, setDraftValue] = useState(String(value))
  const [isEditing, setIsEditing] = useState(false)
  const [isHolding, setIsHolding] = useState(false)
  const valueRef = useRef(value)
  valueRef.current = value
  const holdTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const repeatTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const focusTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const startedAt = useRef(0)
  const heldDirection = useRef<-1 | 1>(1)
  const cancelEditRef = useRef(false)

  useEffect(() => {
    if (!isEditing) setDraftValue(String(value))
  }, [value, isEditing])

  const stopHold = useCallback(() => {
    if (holdTimer.current) clearTimeout(holdTimer.current)
    if (repeatTimer.current) clearTimeout(repeatTimer.current)
    if (focusTimer.current) clearTimeout(focusTimer.current)
    holdTimer.current = null
    repeatTimer.current = null
    focusTimer.current = null
    setIsHolding(false)
  }, [])

  useEffect(() => stopHold, [stopHold])

  const change = useCallback((direction: -1 | 1) => {
    const next = Math.min(max, Math.max(min, valueRef.current + direction * step))
    valueRef.current = next
    setDraftValue(String(next))
    onValueChange(next)
  }, [max, min, onValueChange, step])

  const commitDraft = useCallback(() => {
    const parsed = Number(draftValue)
    if (draftValue.trim() === "" || !Number.isFinite(parsed)) {
      setDraftValue(String(valueRef.current))
      return
    }
    const next = Math.min(max, Math.max(min, parsed))
    const previous = valueRef.current
    valueRef.current = next
    setDraftValue(String(next))
    if (next !== previous) onValueChange(next)
  }, [draftValue, max, min, onValueChange])

  const scheduleRepeat = useCallback(() => {
    const elapsed = Date.now() - startedAt.current
    const delay = elapsed > 2200 ? 38 : elapsed > 1200 ? 65 : elapsed > 500 ? 110 : 220
    repeatTimer.current = setTimeout(() => {
      change(heldDirection.current)
      scheduleRepeat()
    }, delay)
  }, [change])

  const beginHold = (direction: -1 | 1, event: React.PointerEvent<HTMLButtonElement>) => {
    if (disabled || event.button !== 0) return
    event.preventDefault()
    stopHold()
    heldDirection.current = direction
    startedAt.current = Date.now()
    change(direction)
    focusTimer.current = setTimeout(() => setIsHolding(true), HOLD_FOCUS_DELAY)
    holdTimer.current = setTimeout(scheduleRepeat, 360)
  }

  const levelStyle = level ? getComponentLevelCssVars(level) : {}
  return (
    <div
      {...props}
      className={[
        "vt-subtoolbox-split-stepper",
        `is-${size}`,
        isEditing || isHolding ? "is-focused" : "",
        className,
      ].filter(Boolean).join(" ")}
      data-vt-control-level={level}
      data-stepper-size={size}
      role="group"
      aria-label={ariaLabel}
      style={{ ...levelStyle, ...style } as React.CSSProperties}
    >
      <StudioTextInput
        className="vt-subtoolbox-split-stepper-value"
        sizeVariant={size}
        type="number"
        inputMode="numeric"
        aria-label={ariaLabel}
        value={draftValue}
        disabled={disabled}
        onFocus={() => setIsEditing(true)}
        onChange={(event) => setDraftValue(event.currentTarget.value)}
        onBlur={() => {
          if (cancelEditRef.current) {
            setDraftValue(String(valueRef.current))
            cancelEditRef.current = false
          } else {
            commitDraft()
          }
          setIsEditing(false)
        }}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            commitDraft()
            event.currentTarget.blur()
          }
          if (event.key === "Escape") {
            cancelEditRef.current = true
            event.currentTarget.blur()
          }
        }}
      />
      <div className="vt-subtoolbox-split-stepper-rail">
        <button
          type="button"
          className="vt-subtoolbox-split-stepper-up"
          aria-label={`Increase ${ariaLabel}`}
          disabled={disabled || value >= max}
          onPointerDown={(event) => beginHold(1, event)}
          onPointerUp={stopHold}
          onPointerLeave={stopHold}
          onPointerCancel={stopHold}
          onClick={(event) => { event.preventDefault(); if (event.detail === 0 && !disabled && value < max) change(1) }}
        >
          <ChevronUp aria-hidden="true" />
        </button>
        <button
          type="button"
          className="vt-subtoolbox-split-stepper-down"
          aria-label={`Decrease ${ariaLabel}`}
          disabled={disabled || value <= min}
          onPointerDown={(event) => beginHold(-1, event)}
          onPointerUp={stopHold}
          onPointerLeave={stopHold}
          onPointerCancel={stopHold}
          onClick={(event) => { event.preventDefault(); if (event.detail === 0 && !disabled && value > min) change(-1) }}
        >
          <ChevronDown aria-hidden="true" />
        </button>
      </div>
    </div>
  )
}

export default SubToolboxSplitStepper
