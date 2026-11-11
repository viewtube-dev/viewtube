import React from "react"
import { CalendarDays, Image as ImageIcon } from "lucide-react"
import { StudioCloseableBadge, StudioSpectrumTag } from "./StudioControls"
import "./studio-calendar-primitives.css"

export type StudioCalendarEventKind = "publish" | "task" | "milestone" | "reminder" | "deadline"
export type StudioCalendarMiniSegment = "single" | "start" | "middle" | "end"

export interface StudioCalendarEventChipProps {
  label: string
  kind?: StudioCalendarEventKind
  status?: string
  selected?: boolean
  sizeVariant?: "standard" | "mini"
  onClick?: () => void
  onRemove?: () => void
  className?: string
}

export const StudioCalendarEventChip: React.FC<StudioCalendarEventChipProps> = ({
  label,
  kind = "task",
  status,
  selected = false,
  sizeVariant = "standard",
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
    data-calendar-size={sizeVariant}
    data-selected={selected ? "true" : undefined}
  >
    {sizeVariant === "mini" ? (
      <>
        {onClick ? (
          <button type="button" className="vt-studio-calendar-event-chip__mini-label" aria-label={label} onClick={onClick}>{label}</button>
        ) : (
          <span className="vt-studio-calendar-event-chip__mini-label">{label}</span>
        )}
        {onRemove ? <button type="button" className="vt-studio-calendar-event-chip__mini-remove" aria-label={`Remove ${label}`} onClick={onRemove}>×</button> : null}
      </>
    ) : onRemove ? (
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

export interface StudioCalendarMultiDayBarProps {
  label: string
  kind?: StudioCalendarEventKind
  status?: string
  segment?: StudioCalendarMiniSegment
  channelWide?: boolean
  selected?: boolean
  onClick?: () => void
  className?: string
}

export const StudioCalendarMultiDayBar: React.FC<StudioCalendarMultiDayBarProps> = ({
  label,
  kind = "publish",
  status,
  segment = "single",
  channelWide = false,
  selected = false,
  onClick,
  className,
}) => {
  const content = (
    <>
      <span className="vt-studio-calendar-multi-day-bar__label">{label}</span>
      {status ? <span className="vt-studio-calendar-multi-day-bar__status">{status}</span> : null}
    </>
  )
  const classNames = ["vt-studio-calendar-multi-day-bar", className].filter(Boolean).join(" ")
  const attributes = {
    className: classNames,
    "data-vt-library-component": "StudioCalendarMultiDayBar",
    "data-event-kind": kind,
    "data-event-status": status,
    "data-calendar-size": "mini",
    "data-calendar-segment": segment,
    "data-channel-wide": channelWide ? "true" : undefined,
    "data-selected": selected ? "true" : undefined,
    "aria-label": [label, status].filter(Boolean).join(", "),
  }
  return onClick
    ? <button type="button" {...attributes} onClick={onClick}>{content}</button>
    : <div {...attributes} role="group">{content}</div>
}

StudioCalendarMultiDayBar.displayName = "StudioCalendarMultiDayBar"

export interface StudioCalendarThumbnailEventChipProps {
  label: string
  thumbnailSrc?: string
  thumbnailAlt?: string
  kind?: StudioCalendarEventKind
  status?: string
  selected?: boolean
  onClick?: () => void
  className?: string
}

export const StudioCalendarThumbnailEventChip: React.FC<StudioCalendarThumbnailEventChipProps> = ({
  label,
  thumbnailSrc,
  thumbnailAlt,
  kind = "publish",
  status,
  selected = false,
  onClick,
  className,
}) => {
  const content = (
    <>
      <span className="vt-studio-calendar-thumbnail-event-chip__media" data-thumbnail-ratio="16:9">
        {thumbnailSrc
          ? <img src={thumbnailSrc} alt={thumbnailAlt ?? ""} loading="lazy" />
          : <ImageIcon aria-hidden="true" />}
      </span>
      <span className="vt-studio-calendar-thumbnail-event-chip__body">
        <span className="vt-studio-calendar-thumbnail-event-chip__label">{label}</span>
        {status ? <span className="vt-studio-calendar-thumbnail-event-chip__status">{status}</span> : null}
      </span>
    </>
  )
  const attributes = {
    className: ["vt-studio-calendar-thumbnail-event-chip", className].filter(Boolean).join(" "),
    "data-vt-library-component": "StudioCalendarThumbnailEventChip",
    "data-event-kind": kind,
    "data-event-status": status,
    "data-calendar-size": "mini",
    "data-thumbnail-ratio": "16:9",
    "data-selected": selected ? "true" : undefined,
    "aria-label": [label, status].filter(Boolean).join(", "),
  }
  return onClick
    ? <button type="button" {...attributes} onClick={onClick}>{content}</button>
    : <div {...attributes} role="group">{content}</div>
}

StudioCalendarThumbnailEventChip.displayName = "StudioCalendarThumbnailEventChip"

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
