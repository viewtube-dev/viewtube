import React from "react"
import "./ConfirmedSpecimenGrid.css"

export type SpecimenTier = "supreme" | "standard" | "compact" | "micro"

export interface SpecimenRequest {
  id: string
  tier: SpecimenTier
  label: string
}

export interface SpecimenGridRow {
  id: string
  tier: SpecimenTier
  specimens: Array<{ id: string; label: string }>
  /** Optional paired size stacks for dedicated Supreme/Micro comparisons. */
  comparisonGroup?: "supreme" | "micro"
}

export interface ConfirmedSpecimenGridProps {
  familyName: string
  renderSpecimen: (request: SpecimenRequest) => React.ReactNode
  /** Authored rows are grouped into parallel size columns, never one long size-by-size stack. */
  specimenRows?: SpecimenGridRow[]
  documentation?: React.ReactNode
}

const SPECIMEN_TIERS = ["supreme", "standard", "compact", "micro"] as const

/**
 * Catalog arrangement only. renderSpecimen must render the real production
 * control and map the requested tier to a size supported by that component.
 * This component intentionally applies no visual or geometric styles to faces.
 */
export function ConfirmedSpecimenGrid({
  familyName,
  renderSpecimen,
  specimenRows,
  documentation,
}: ConfirmedSpecimenGridProps) {
  const [clean, setClean] = React.useState(false)
  const contentId = React.useId()
  const viewPrefix = clean ? "clean" : "reference"

  const specimen = (id: string, tier: SpecimenTier, label: string) => (
    <div className="vt-specimen-slot" key={id} data-vt-specimen-slot={id}>
      {renderSpecimen({ id, tier, label })}
    </div>
  )

  const row = (id: string, tier: SpecimenTier, count: number, label: string) => (
    <div className={`vt-specimen-row vt-specimen-row--${count}`} key={id}>
      {Array.from({ length: count }, (_, index) =>
        specimen(`${id}-${index + 1}`, tier, label),
      )}
    </div>
  )

  const renderAuthoredRow = (item: SpecimenGridRow) => (
    <div
      className={`vt-specimen-row vt-specimen-row--${item.specimens.length}`}
      key={item.id}
      aria-label={`${item.tier} ${item.specimens.length}-column specimens`}
      data-vt-specimen-row={item.id}
    >
      {item.specimens.map(({ id, label }) => specimen(id, item.tier, label))}
    </div>
  )

  const authoredTierGrid = specimenRows?.some((item) => !item.comparisonGroup)
    ? (
      <div className="vt-specimen-tier-grid" aria-label="Button size tiers">
        {SPECIMEN_TIERS.map((tier) => {
          const tierRows = (specimenRows ?? []).filter((item) => item.tier === tier && !item.comparisonGroup)
          return (
            <section className={`vt-specimen-tier-column vt-specimen-tier-column--${tier}`} key={tier} aria-label={`${tier} specimens`} data-vt-specimen-tier-column={tier}>
              <h4 className="vt-specimen-tier-heading">{tier.toUpperCase()}</h4>
              <div className="vt-specimen-stack">
                {tierRows.map(renderAuthoredRow)}
              </div>
            </section>
          )
        })}
      </div>
    )
    : null

  const comparisonGroups = specimenRows?.some((item) => item.comparisonGroup)
    ? (
      <div className="vt-specimen-size-comparison" aria-label="Supreme and Micro size comparison">
        {(["supreme", "micro"] as const).map((group) => (
          <div className={`vt-specimen-comparison-column vt-specimen-comparison-column--${group}`} key={group} aria-label={`${group} button specimens`}>
            {(specimenRows ?? []).filter((item) => item.comparisonGroup === group).map(renderAuthoredRow)}
          </div>
        ))}
      </div>
    )
    : null

  return (
    <section
      className="vt-specimen-module"
      aria-label={familyName}
      data-view={clean ? "clean" : "reference"}
    >
      <div className="vt-specimen-toolbar">
        <button
          type="button"
          role="switch"
          aria-checked={clean}
          aria-controls={contentId}
          aria-label={`Clean composition view for ${familyName}`}
          onClick={() => setClean((value) => !value)}
        >
          {clean ? "REFERENCE GRID" : "CLEAN COMPOSITION"}
        </button>
      </div>

      <div id={contentId} className="vt-specimen-layout">
        {specimenRows
          ? <>{authoredTierGrid}{comparisonGroups}</>
          : <div className="vt-specimen-stack">
              {SPECIMEN_TIERS.flatMap((tier) =>
                [1, 2, 3, 4].map((count) =>
                  row(`${viewPrefix}-${tier}-${count}`, tier, count, tier.toUpperCase()),
                ),
              )}
            </div>}
      </div>

      {!clean && documentation ? (
        <div className="vt-specimen-documentation">{documentation}</div>
      ) : null}
    </section>
  )
}

export default ConfirmedSpecimenGrid
