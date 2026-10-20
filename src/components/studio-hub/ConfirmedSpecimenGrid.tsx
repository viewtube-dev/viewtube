import React from "react"
import "./ConfirmedSpecimenGrid.css"

export type SpecimenTier = "supreme" | "standard" | "compact" | "micro"

export interface SpecimenRequest {
  id: string
  tier: SpecimenTier
  label: string
}

export interface ConfirmedSpecimenGridProps {
  familyName: string
  renderSpecimen: (request: SpecimenRequest) => React.ReactNode
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
  documentation,
}: ConfirmedSpecimenGridProps) {
  const [clean, setClean] = React.useState(false)
  const contentId = React.useId()

  const specimen = (id: string, tier: SpecimenTier, label: string) => (
    <div className="vt-specimen-slot" key={id}>
      {renderSpecimen({ id, tier, label })}
    </div>
  )

  const row = (id: string, tier: SpecimenTier, count: number, label: string) => (
    <div className={`vt-specimen-row vt-specimen-row--${count}`} key={id}>
      {Array.from({ length: count }, (_, index) =>
        specimen(`${id}-${index + 1}`, tier, `${label} ${index + 1}`),
      )}
    </div>
  )

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
        {clean ? (
          <div className="vt-specimen-columns">
            <div className="vt-specimen-stack">
              {row("clean-standard", "standard", 1, "STANDARD")}
              {row("clean-compact", "compact", 3, "COMPACT")}
            </div>
            <div className="vt-specimen-stack">
              {row("clean-supreme", "supreme", 1, "SUPREME")}
              {row("clean-micro", "micro", 4, "MICRO")}
            </div>
          </div>
        ) : (
          <>
            {row("ladder-supreme", "supreme", 1, "SUPREME")}
            {row("ladder-standard", "standard", 1, "STANDARD")}
            {row("ladder-halves", "standard", 2, "STANDARD")}
            {row("ladder-quarters", "standard", 4, "STANDARD")}
            <div className="vt-specimen-columns">
              <div className="vt-specimen-stack">
                {row("composition-supreme", "supreme", 1, "SUPREME")}
              </div>
              <div className="vt-specimen-stack">
                {row("composition-compact-full", "compact", 1, "COMPACT")}
                {row("composition-compact-halves", "compact", 2, "COMPACT")}
              </div>
            </div>
            <div className="vt-specimen-columns">
              <div className="vt-specimen-stack">
                {row("composition-supreme-halves", "supreme", 2, "SUPREME")}
              </div>
              <div className="vt-specimen-stack">
                {row("composition-micro-full", "micro", 1, "MICRO")}
                {row("composition-micro-halves", "micro", 2, "MICRO")}
                {row("composition-micro-quarters", "micro", 4, "MICRO")}
              </div>
            </div>
          </>
        )}
      </div>

      {!clean && documentation ? (
        <div className="vt-specimen-documentation">{documentation}</div>
      ) : null}
    </section>
  )
}

export default ConfirmedSpecimenGrid
