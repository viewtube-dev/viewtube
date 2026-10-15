import React from "react"
import { Minus, Plus } from "lucide-react"
import type { StudioControlSize } from "../tokens"
import "../../styles/studio-control-system.css"
import "./studio-inline-stepper.css"

export interface StudioInlineStepperProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  value: number
  onValueChange: (value: number) => void
  min?: number
  max?: number
  step?: number
  size?: StudioControlSize
  disabled?: boolean
  ariaLabel?: string
}

/** Clamp a numeric step action to valid finite values and the supplied bounds. */
export function normalizeStudioInlineStepperValue(
  value: number,
  direction: -1 | 0 | 1,
  step = 1,
  min = -Infinity,
  max = Infinity,
): number {
  const safeStep = Number.isFinite(step) && step > 0 ? step : 1
  const base = Number.isFinite(value) ? value : Number.isFinite(min) ? min : 0
  const lower = Number.isFinite(min) ? min : -Infinity
  const upper = Number.isFinite(max) ? max : Infinity
  if (lower > upper) return Number.isFinite(min) ? min : 0
  const next = base + direction * safeStep
  if (!Number.isFinite(next)) return direction < 0 && Number.isFinite(min) ? min : direction > 0 && Number.isFinite(max) ? max : base
  return Math.min(upper, Math.max(lower, next))
}

/**
 * Canonical horizontal Studio Controls stepper: square decrement button,
 * editable numeric field, square increment button. Independent from SubToolbox.
 */
export const StudioInlineStepper: React.FC<StudioInlineStepperProps> = ({
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
  const [draft, setDraft] = React.useState(String(Number.isFinite(value) ? value : 0))
  const [focused, setFocused] = React.useState(false)

  React.useEffect(() => {
    if (!focused) setDraft(String(Number.isFinite(value) ? value : 0))
  }, [value, focused])

  const commit = React.useCallback(() => {
    const parsed = draft.trim() === "" ? Number.NaN : Number(draft)
    if (!Number.isFinite(parsed)) {
      setDraft(String(Number.isFinite(value) ? value : 0))
      return
    }
    const normalized = normalizeStudioInlineStepperValue(parsed, 0, step, min, max)
    setDraft(String(normalized))
    if (normalized !== value) onValueChange(normalized)
  }, [draft, max, min, onValueChange, step, value])

  const adjust = React.useCallback((direction: -1 | 1) => {
    const parsedDraft = draft.trim() === "" ? Number.NaN : Number(draft)
    const base = Number.isFinite(parsedDraft) ? parsedDraft : value
    const next = normalizeStudioInlineStepperValue(base, direction, step, min, max)
    setDraft(String(next))
    if (next !== value) onValueChange(next)
  }, [draft, max, min, onValueChange, step, value])

  const currentForBounds = Number.isFinite(value) ? value : 0
  const validBounds = min <= max

  return (
    <div
      {...props}
      className={["vt-studio-inline-stepper", `is-${size}`, focused ? "is-focused" : "", className].filter(Boolean).join(" ")}
      data-vt-studio-control="true"
      data-vt-studio-control-family="stepper"
      data-vt-studio-control-kind="inline-stepper"
      data-size={size}
      role="group"
      aria-label={ariaLabel}
      style={style}
    >
      <button
        type="button"
        className="vt-studio-inline-stepper__button vt-studio-inline-stepper__decrement"
        aria-label={`Decrease ${ariaLabel}`}
        disabled={disabled || !validBounds || currentForBounds <= min}
        onClick={() => adjust(-1)}
      >
        <Minus aria-hidden="true" focusable="false" />
      </button>
      <input
        className="vt-studio-inline-stepper__value"
        type="number"
        inputMode="decimal"
        aria-label={ariaLabel}
        value={draft}
        min={Number.isFinite(min) ? min : undefined}
        max={Number.isFinite(max) ? max : undefined}
        step={step > 0 && Number.isFinite(step) ? step : 1}
        disabled={disabled}
        onFocus={() => setFocused(true)}
        onBlur={() => { setFocused(false); commit() }}
        onChange={event => {
          const nextDraft = event.currentTarget.value
          setDraft(nextDraft)
          if (!nextDraft.trim()) return
          const parsed = Number(nextDraft)
          if (!Number.isFinite(parsed)) return
          onValueChange(normalizeStudioInlineStepperValue(parsed, 0, step, min, max))
        }}
        onKeyDown={event => {
          if (event.key === "Enter") {
            event.preventDefault()
            commit()
            event.currentTarget.blur()
          }
        }}
      />
      <button
        type="button"
        className="vt-studio-inline-stepper__button vt-studio-inline-stepper__increment"
        aria-label={`Increase ${ariaLabel}`}
        disabled={disabled || !validBounds || currentForBounds >= max}
        onClick={() => adjust(1)}
      >
        <Plus aria-hidden="true" focusable="false" />
      </button>
    </div>
  )
}

StudioInlineStepper.displayName = "StudioInlineStepper"
export default StudioInlineStepper
