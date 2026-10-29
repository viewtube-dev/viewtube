import React from "react"
import { CalendarDays, Image as ImageIcon } from "lucide-react"
import { StudioCloseableBadge, StudioSpectrumTag } from "./StudioControls"
import "./studio-calendar-primitives.css"

export type StudioCalendarEventKind = "publish" | "task" | "milestone" | "reminder" | "deadline"

export interface StudioCalendarEventChipProps {
  label: string
  kind?: StudioCalendarEventKind
  status?: string
  selected?: boolean
  onClick?: () => void
  onRemove?: () => void
  className?: string
}

export const StudioCalendarEventChip: React.FC<StudioCalendarEventChipProps> = ({
  label,
  kind = "task",
  status,
  selected = false,
  onClick,
  onRemove,
  className,
}) => (
  <span
    className={["vt-studio-calendar-event-chip", className].filter(Boolean).join(" ")}
    data-vt-calendar-event="true"
    data-vt-library-component="StudioCalendarEventChip"
    data-event-kind={kind}
    data-event-status={status}
  >
    {onRemove ? (
      <StudioCloseableBadge label={label} onClose={onRemove} entering={false} className="vt-studio-calendar-event-chip__removable" />
    ) : (
      <StudioSpectrumTag
        label={label}
        spectrumKey={kind}
        selected={selected}
        onClick={onClick ? () => onClick() : undefined}
        ariaLabel={label}
        className="vt-studio-calendar-event-chip__tag"
      />
    )}
    {status ? <span className="vt-studio-calendar-event-chip__status">{status}</span> : null}
  </span>
)

StudioCalendarEventChip.displayName = "StudioCalendarEventChip"

export interface StudioCalendarMediaRailProps {
  aspectRatio?: "16:9" | "9:16"
  split?: "left" | "right" | "double"
  thumbnailSrc?: string
  label: string
  leftLabel?: string
  rightLabel?: string
  className?: string
}

export const StudioCalendarMediaRail: React.FC<StudioCalendarMediaRailProps> = ({
  aspectRatio = "16:9",
  split = "left",
  thumbnailSrc,
  label,
  leftLabel = "MEDIA",
  rightLabel = "EVENT",
  className,
}) => (
  <div
    className={["vt-studio-calendar-media-rail", className].filter(Boolean).join(" ")}
    data-vt-library-component="StudioCalendarMediaRail"
    data-aspect-ratio={aspectRatio}
    data-split={split}
    role="group"
    aria-label={label}
  >
    {split !== "right" ? (
      <span className="vt-studio-calendar-media-rail__rail vt-studio-calendar-media-rail__rail--left">
        <StudioSpectrumTag label={leftLabel} spectrumKey={leftLabel} />
      </span>
    ) : null}
    <div className="vt-studio-calendar-media-rail__media">
      {thumbnailSrc ? <img src={thumbnailSrc} alt={label} loading="lazy" /> : (
        <span className="vt-studio-calendar-media-rail__placeholder">
          {aspectRatio === "9:16" ? <CalendarDays aria-hidden="true" /> : <ImageIcon aria-hidden="true" />}
          <span>{label}</span>
        </span>
      )}
    </div>
    {split !== "left" ? (
      <span className="vt-studio-calendar-media-rail__rail vt-studio-calendar-media-rail__rail--right">
        <StudioSpectrumTag label={rightLabel} spectrumKey={rightLabel} />
      </span>
    ) : null}
  </div>
)

StudioCalendarMediaRail.displayName = "StudioCalendarMediaRail"
