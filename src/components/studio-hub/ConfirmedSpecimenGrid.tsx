import React from "react"
import "./ConfirmedSpecimenGrid.css"

export type SpecimenTier = "supreme" | "standard" | "compact" | "mini" | "micro"

export interface SpecimenRequest {
  id: string
  tier: SpecimenTier
  label: string
}

export interface SpecimenCell {
  id: string
  label: string
  /** Width in 1/144ths of the full module width. */
  span?: number
}

export interface SpecimenGridRow {
  id: string
  tier: SpecimenTier
  specimens: SpecimenCell[]
  /** Optional paired size stacks retained for older catalog uses. */
  comparisonGroup?: "supreme" | "micro"
}

export interface SpecimenPanel {
  id: string
  tier: SpecimenTier
  span: number
  rows: SpecimenGridRow[]
}

export interface SpecimenLayoutRow {
  id: string
  panels?: SpecimenPanel[]
  tier?: SpecimenTier
  specimens?: SpecimenCell[]
}

export interface ConfirmedSpecimenGridProps {
  familyName: string
  renderSpecimen: (request: SpecimenRequest) => React.ReactNode
  specimenRows?: SpecimenGridRow[]
  /** Ordered, mixed-tier rows with proportional widths, used by the canonical button module. */
  layoutRows?: SpecimenLayoutRow[]
  documentation?: React.ReactNode
}

const SPECIMEN_TIERS = ["supreme", "standard", "compact", "mini", "micro"] as const

/**
 * Layout-only catalog component. Widths are fractions of the full module width
 * (144 units = 100%); panels let the compact and micro groups share row 7.
 * Production primitive geometry, color, type and interaction remain untouched.
 */
export function ConfirmedSpecimenGrid({
  familyName,
  renderSpecimen,
  specimenRows,
  layoutRows,
  documentation,
}: ConfirmedSpecimenGridProps) {
  const [clean, setClean] = React.useState(false)
  const contentId = React.useId()
  const viewPrefix = clean ? "clean" : "reference"

  const specimen = (id: string, tier: SpecimenTier, label: string, span = 144) => (
    <div className="vt-specimen-slot" key={id} data-vt-specimen-slot={id} data-vt-specimen-span={span} style={{ gridColumn: `span ${span}` }}>
      {renderSpecimen({ id, tier, label })}
    </div>
  )

  const renderAuthoredRow = (item: SpecimenGridRow) => (
    <div className="vt-specimen-row vt-specimen-row--proportional" key={item.id} aria-label={`${item.tier} specimens`} data-vt-specimen-row={item.id}>
      {item.specimens.map(({ id, label, span }) => specimen(id, item.tier, label, span ?? 144 / item.specimens.length))}
    </div>
  )

  const renderLayoutRow = (item: SpecimenLayoutRow) => {
    if (item.panels) {
      return (
        <div className="vt-specimen-layout-row vt-specimen-layout-row--panels" key={item.id} data-vt-layout-row={item.id}>
          {item.panels.map((panel) => (
            <section className="vt-specimen-panel" key={panel.id} aria-label={panel.id} data-vt-specimen-panel={panel.id} style={{ gridColumn: `span ${panel.span}` }}>
              <div className="vt-specimen-panel-rows">
                {panel.rows.map((row) => renderAuthoredRow(row))}
              </div>
            </section>
          ))}
        </div>
      )
    }
    if (!item.tier || !item.specimens) return null
    return (
      <div className="vt-specimen-layout-row" key={item.id} data-vt-layout-row={item.id}>
        {item.specimens.map(({ id, label, span }) => specimen(id, item.tier!, label, span ?? 144 / item.specimens!.length))}
      </div>
    )
  }

  const defaultRows = (
    <div className="vt-specimen-stack">
      {SPECIMEN_TIERS.flatMap((tier) =>
        [1, 2, 3, 4].map((count) => (
          <div className={`vt-specimen-row vt-specimen-row--${count}`} key={`${viewPrefix}-${tier}-${count}`}>
            {Array.from({ length: count }, (_, index) => specimen(`${viewPrefix}-${tier}-${count}-${index}`, tier, tier.toUpperCase(), 144 / count))}
          </div>
        )),
      )}
    </div>
  )

  return (
    <section className="vt-specimen-module" aria-label={familyName} data-view={clean ? "clean" : "reference"}>
      <div className="vt-specimen-toolbar">
        <button type="button" role="switch" aria-checked={clean} aria-controls={contentId} aria-label={`Clean composition view for ${familyName}`} onClick={() => setClean((value) => !value)}>
          {clean ? "REFERENCE GRID" : "CLEAN COMPOSITION"}
        </button>
      </div>
      <div id={contentId} className="vt-specimen-layout">
        {layoutRows
          ? <div className="vt-specimen-layout-rows">{layoutRows.map(renderLayoutRow)}</div>
          : specimenRows
            ? <div className="vt-specimen-tier-grid" aria-label="Button size tiers">
                {SPECIMEN_TIERS.map((tier) => (
                  <section className={`vt-specimen-tier-column vt-specimen-tier-column--${tier}`} key={tier} aria-label={`${tier} specimens`} data-vt-specimen-tier-column={tier}>
                    <h4 className="vt-specimen-tier-heading">{tier.toUpperCase()}</h4>
                    <div className="vt-specimen-stack">{specimenRows.filter((item) => item.tier === tier && !item.comparisonGroup).map(renderAuthoredRow)}</div>
                  </section>
                ))}
              </div>
            : defaultRows}
      </div>
      {!clean && documentation ? <div className="vt-specimen-documentation">{documentation}</div> : null}
    </section>
  )
}

export default ConfirmedSpecimenGrid
