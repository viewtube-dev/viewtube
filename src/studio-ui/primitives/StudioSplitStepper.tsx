import React, { useCallback, useEffect, useRef, useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"
import type { StudioControlSize } from "../tokens"
import "../../styles/studio-control-system.css"
import "./studio-split-stepper.css"

export interface StudioSplitStepperProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  value: number
  onValueChange: (value: number) => void
  min?: number
  max?: number
  step?: number
  size?: StudioControlSize
  disabled?: boolean
  ariaLabel?: string
}

/** Canonical Studio Controls split stepper. Native number entry + independent two-action rail. */
export const StudioSplitStepper: React.FC<StudioSplitStepperProps> = ({
  value,
  onValueChange,
  min = -Infinity,
  max = Infinity,
  step = 1,
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
  const holdTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const repeatTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const startedAt = useRef(0)
  const heldDirection = useRef<-1 | 1>(1)

  useEffect(() => {
    if (!inputFocused) setDraft(String(value))
  }, [value, inputFocused])

  const stopHold = useCallback(() => {
    if (holdTimer.current) clearTimeout(holdTimer.current)
    if (repeatTimer.current) clearTimeout(repeatTimer.current)
    holdTimer.current = null
    repeatTimer.current = null
  }, [])
  useEffect(() => stopHold, [stopHold])

  const change = useCallback((direction: -1 | 1) => {
    const current = valueRef.current
    const next = Math.min(max, Math.max(min, current + direction * step))
    if (next === current) {
      stopHold()
      return
    }
    valueRef.current = next
    setDraft(String(next))
    onValueChange(next)
  }, [max, min, onValueChange, step, stopHold])

  const scheduleRepeat = useCallback(() => {
    const elapsed = Date.now() - startedAt.current
    const delay = elapsed > 2200 ? 38 : elapsed > 1200 ? 65 : elapsed > 500 ? 110 : 220
    repeatTimer.current = setTimeout(() => {
      const current = valueRef.current
      if ((heldDirection.current > 0 && current >= max) || (heldDirection.current < 0 && current <= min)) {
        stopHold()
        return
      }
      change(heldDirection.current)
      if (valueRef.current !== max && valueRef.current !== min) scheduleRepeat()
    }, delay)
  }, [change, max, min, stopHold])

  const beginHold = (direction: -1 | 1, event: React.PointerEvent<HTMLButtonElement>) => {
    if (disabled || event.button !== 0) return
    if ((direction > 0 && valueRef.current >= max) || (direction < 0 && valueRef.current <= min)) return
    event.preventDefault()
    stopHold()
    heldDirection.current = direction
    startedAt.current = Date.now()
    change(direction)
    holdTimer.current = setTimeout(scheduleRepeat, 360)
  }

  const commitDraft = () => {
    const parsed = Number(draft)
    if (!draft.trim() || !Number.isFinite(parsed)) {
      setDraft(String(valueRef.current))
      return
    }
    const normalized = Math.min(max, Math.max(min, parsed))
    valueRef.current = normalized
    setDraft(String(normalized))
    if (normalized !== value) onValueChange(normalized)
  }

  return (
    <div
      {...props}
      className={["vt-studio-split-stepper", `is-${size}`, inputFocused ? "is-interacting" : "", className].filter(Boolean).join(" ")}
      data-vt-studio-control="true"
      data-vt-studio-control-kind="split-stepper"
      data-size={size}
      role="group"
      aria-label={ariaLabel}
      style={style}
    >
      <input
        type="number"
        className="vt-studio-split-stepper-value"
        aria-label={ariaLabel}
        inputMode="decimal"
        value={draft}
        min={Number.isFinite(min) ? min : undefined}
        max={Number.isFinite(max) ? max : undefined}
        step={step}
        disabled={disabled}
        onFocus={() => setInputFocused(true)}
        onBlur={() => { setInputFocused(false); commitDraft() }}
        onChange={(event) => {
          const nextDraft = event.currentTarget.value
          setDraft(nextDraft)
          if (!nextDraft.trim()) return
          const parsed = Number(nextDraft)
          if (!Number.isFinite(parsed)) return
          const normalized = Math.min(max, Math.max(min, parsed))
          valueRef.current = normalized
          onValueChange(normalized)
        }}
      />
      <div className="vt-studio-split-stepper-rail">
        <button
          type="button"
          className="vt-studio-split-stepper-up"
          aria-label={`Increase ${ariaLabel}`}
          disabled={disabled || value >= max}
          onPointerDown={(event) => beginHold(1, event)}
          onPointerUp={stopHold}
          onPointerLeave={stopHold}
          onPointerCancel={stopHold}
          onClick={(event) => { event.preventDefault(); if (event.detail === 0 && !disabled && valueRef.current < max) change(1) }}
        ><ChevronUp aria-hidden="true" /></button>
        <button
          type="button"
          className="vt-studio-split-stepper-down"
          aria-label={`Decrease ${ariaLabel}`}
          disabled={disabled || value <= min}
          onPointerDown={(event) => beginHold(-1, event)}
          onPointerUp={stopHold}
          onPointerLeave={stopHold}
          onPointerCancel={stopHold}
          onClick={(event) => { event.preventDefault(); if (event.detail === 0 && !disabled && valueRef.current > min) change(-1) }}
        ><ChevronDown aria-hidden="true" /></button>
      </div>
    </div>
  )
}

export default StudioSplitStepper
