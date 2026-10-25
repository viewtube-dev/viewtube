import React from "react"

export type StudioLedBadgeTabMode = "badge" | "tab"
export type StudioLedAnimation = "prism" | "radar" | "flare2" | "steady" | "blink"
export type StudioLedBadgeTabProps = {
  mode?: StudioLedBadgeTabMode
  label: string
  firstLine?: string
  secondLine?: string
  active?: boolean
  disabled?: boolean
  onClick?: () => void
  led?: "off" | "solid" | "rainbow"
  animation?: StudioLedAnimation
  tone?: "pink" | "cyan" | "green" | "yellow" | "purple"
  sizeVariant?: "compact" | "mini"
  className?: string
  "aria-label"?: string
}

const toneColors = {
  pink: "#FF7AC8",
  cyan: "#36E0F6",
  green: "#3FEE56",
  yellow: "#FFDA47",
  purple: "#B49CFF",
} as const

/** Canonical beveled LED badge / compact page-tab primitive. Selection remains caller-owned. */
export function StudioLedBadgeTab({
  mode = "badge",
  label,
  firstLine,
  secondLine,
  active = false,
  disabled = false,
  onClick,
  led = "rainbow",
  animation = "prism",
  tone = "cyan",
  sizeVariant = "compact",
  className = "",
  "aria-label": ariaLabel,
}: StudioLedBadgeTabProps) {
  const isTab = mode === "tab"
  const content = firstLine || secondLine ? (
    <span className="vt-studio-led-badge-tab__two-line">
      <span>{firstLine ?? label}</span>
      {secondLine ? <span>{secondLine}</span> : null}
    </span>
  ) : <span className="vt-studio-led-badge-tab__label">{label}</span>
  const classes = [
    "vt-studio-led-badge-tab",
    isTab ? "is-tab" : "is-badge",
    active ? "is-active" : "",
    "is-" + sizeVariant,
    "tone-" + tone,
    "led-" + led,
    "motion-" + animation,
    className,
  ].filter(Boolean).join(" ")
  const style = { "--vt-led-tone": toneColors[tone] } as React.CSSProperties
  if (isTab || onClick) {
    return (
      <button type="button" className={classes} style={style} disabled={disabled} onClick={onClick}
        aria-label={ariaLabel ?? label} role={isTab ? "tab" : undefined} aria-selected={isTab ? active : undefined} aria-pressed={!isTab && onClick ? active : undefined}
        data-vt-studio-primitive="StudioLedBadgeTab" data-vt-led-animation={animation}>
        <span className="vt-studio-led-badge-tab__bevel" aria-hidden="true" />
        <span className="vt-studio-led-badge-tab__led" aria-hidden="true" />
        {content}
      </button>
    )
  }
  return (
    <span className={classes} style={style} role="status" aria-label={ariaLabel ?? label}
      data-vt-studio-primitive="StudioLedBadgeTab" data-vt-led-animation={animation}>
      <span className="vt-studio-led-badge-tab__bevel" aria-hidden="true" />
      <span className="vt-studio-led-badge-tab__led" aria-hidden="true" />
      {content}
    </span>
  )
}

export default StudioLedBadgeTab
