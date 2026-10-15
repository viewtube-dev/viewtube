import React, { useCallback, useEffect, useRef, useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"
import type { ToolboxControlLevel } from "./tokens"
import { getComponentLevelCssVars } from "./tokens"
import { StudioNumberInput } from "../../studio-ui/primitives/StudioTextInput"
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

/** Canonical Studio Controls stepper: a 2:1 value pane and a square rail split into two equal chevron actions. */
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
  const valueRef = useRef(value)
  valueRef.current = value
  const [draft, setDraft] = useState(String(value))
  const [inputFocused, setInputFocused] = useState(false)
  const [held, setHeld] = useState(false)

  useEffect(() => { if (!inputFocused) setDraft(String(value)) }, [value, inputFocused])
  const holdTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const repeatTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const startedAt = useRef(0)
  const heldDirection = useRef<-1 | 1>(1)

  const stopHold = useCallback(() => {
    if (holdTimer.current) clearTimeout(holdTimer.current)
    if (repeatTimer.current) clearTimeout(repeatTimer.current)
    holdTimer.current = null
    repeatTimer.current = null
    setHeld(false)
  }, [])

  useEffect(() => stopHold, [stopHold])

  const change = useCallback((direction: -1 | 1) => {
    const next = Math.min(max, Math.max(min, valueRef.current + direction * step))
    valueRef.current = next
    onValueChange(next)
  }, [max, min, onValueChange, step])

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
    holdTimer.current = setTimeout(() => {
      setHeld(true)
      scheduleRepeat()
    }, 360)
  }

  const levelStyle = level ? getComponentLevelCssVars(level) : {}
  return (
    <div
      {...props}
      className={["vt-subtoolbox-split-stepper", `is-${size}`, (inputFocused || held) ? "is-interacting" : "", className].filter(Boolean).join(" ")}
      data-vt-control-level={level}
      data-stepper-size={size}
      role="group"
      aria-label={ariaLabel}
      style={{ ...levelStyle, ...style } as React.CSSProperties}
    >
      <StudioNumberInput
        className="vt-subtoolbox-split-stepper-value"
        sizeVariant={size === "compact" ? "compact" : "standard"}
        aria-label={ariaLabel}
        value={draft}
        min={Number.isFinite(min) ? min : undefined}
        max={Number.isFinite(max) ? max : undefined}
        step={step}
        disabled={disabled}
        onFocus={() => setInputFocused(true)}
        onBlur={() => {
          setInputFocused(false)
          const parsed = Number(draft)
          if (!draft.trim() || !Number.isFinite(parsed)) {
            setDraft(String(valueRef.current))
          } else {
            const normalized = Math.min(max, Math.max(min, parsed))
            setDraft(String(normalized))
            if (normalized !== valueRef.current) {
              valueRef.current = normalized
              onValueChange(normalized)
            }
          }
        }}
        onChange={(event) => {
          const nextDraft = event.currentTarget.value
          setDraft(nextDraft)
          if (nextDraft.trim() === "") return
          const parsed = Number(nextDraft)
          if (!Number.isFinite(parsed)) return
          const normalized = Math.min(max, Math.max(min, parsed))
          valueRef.current = normalized
          onValueChange(normalized)
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
