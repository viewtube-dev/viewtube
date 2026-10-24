import React from "react"
import "../../styles/studio-response-meta-row.css"

export type StudioResponseMetaRowSize = "standard" | "compact" | "micro"

export interface StudioResponseMetaRowProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  title: React.ReactNode
  status?: React.ReactNode
  metadata?: React.ReactNode
  trailing?: React.ReactNode
  sizeVariant?: StudioResponseMetaRowSize
}

export const StudioResponseMetaRow: React.FC<StudioResponseMetaRowProps> = ({
  title,
  status,
  metadata,
  trailing,
  sizeVariant = "compact",
  className,
  "aria-label": ariaLabel,
  ...rest
}) => (
  <div
    {...rest}
    className={["vt-studio-response-meta-row", className].filter(Boolean).join(" ")}
    data-vt-studio-control="response-meta-row"
    data-vt-studio-size={sizeVariant}
    aria-label={ariaLabel ?? (typeof title === "string" ? `${title} metadata` : "Response metadata")}
  >
    <div className="vt-studio-response-meta-row__main">
      <span className="vt-studio-response-meta-row__title">{title}</span>
      {status !== undefined && status !== null && (
        <span className="vt-studio-response-meta-row__slot" data-slot="status">{status}</span>
      )}
      {metadata !== undefined && metadata !== null && (
        <span className="vt-studio-response-meta-row__slot" data-slot="metadata">{metadata}</span>
      )}
    </div>
    {trailing !== undefined && trailing !== null && (
      <div className="vt-studio-response-meta-row__trailing" data-slot="trailing">{trailing}</div>
    )}
  </div>
)

StudioResponseMetaRow.displayName = "StudioResponseMetaRow"
