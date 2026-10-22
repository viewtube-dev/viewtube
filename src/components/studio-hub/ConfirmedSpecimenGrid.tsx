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
}

export interface ConfirmedSpecimenGridProps {
  familyName: string
  renderSpecimen: (request: SpecimenRequest) => React.ReactNode
  /** Optional authored rows let a component family reuse the grid without changing its own specimen semantics. */
  specimenRows?: SpecimenGridRow[]
  documentation?: React.ReactNode
}

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

  const authoredRows = specimenRows?.map((item) => (
    <div
      className={`vt-specimen-row vt-specimen-row--${item.specimens.length}`}
      key={item.id}
      aria-label={`${item.tier} ${item.specimens.length}-column specimens`}
      data-vt-specimen-row={item.id}
    >
      {item.specimens.map(({ id, label }) => specimen(id, item.tier, label))}
    </div>
  ))

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
        <div className="vt-specimen-stack">
          {specimenRows
            ? authoredRows
            : (["supreme", "standard", "compact", "micro"] as const).flatMap((tier) =>
                [1, 2, 3, 4].map((count) =>
                  row(`${viewPrefix}-${tier}-${count}`, tier, count, tier.toUpperCase()),
                ),
              )}
        </div>
      </div>

      {!clean && documentation ? (
        <div className="vt-specimen-documentation">{documentation}</div>
      ) : null}
    </section>
  )
}

export default ConfirmedSpecimenGrid
