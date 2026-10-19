import React, { useState } from "react"
import { Layers3, Sparkles } from "lucide-react"
import { SubToolbox } from "../Toolbox"
import { StudioButton, StudioSplitLeftButton } from "../../studio-ui/primitives/StudioControls"
import "./studio-hub-production-button-catalog.css"

interface StudioHubProductionButtonCatalogProps {
  paletteIndex: number
}

const noop = () => undefined

interface ButtonSampleProps {
  name: string
  description: string
  children: React.ReactNode
}

const ButtonSample: React.FC<ButtonSampleProps> = ({ name, description, children }) => (
  <article className="vt-production-button-sample">
    <header>
      <strong>{name}</strong>
      <p>{description}</p>
    </header>
    <div className="vt-production-button-preview">{children}</div>
  </article>
)

/** Canonical production button library: only StudioButton and StudioSplitLeftButton. */
export const StudioHubProductionButtonCatalog: React.FC<StudioHubProductionButtonCatalogProps> = ({ paletteIndex }) => {
  const [studioSelected, setStudioSelected] = useState(false)

  return (
    <SubToolbox
      title="Production Button Primitives"
      subtitle="Canonical production button surface. All other button families should migrate to one of these two primitives."
      icon={<Layers3 />}
      paletteIndex={paletteIndex}
      collapsible={false}
    >
      <div className="vt-production-button-catalog" data-vt-production-button-catalog="true">
        <ButtonSample name="StudioButton" description="Canonical standard button. Default height: 44px. Supports tone, disabled, loading and selected states.">
          <StudioButton onClick={() => setStudioSelected(value => !value)} selected={studioSelected}>
            {studioSelected ? "SELECTED" : "STUDIO BUTTON"}
          </StudioButton>
        </ButtonSample>
        <ButtonSample name="StudioSplitLeftButton" description="Canonical split-left button with icon rail and label. Default height: 44px.">
          <StudioSplitLeftButton icon={<Sparkles aria-hidden="true" />} onClick={noop}>
            STUDIO SPLIT LEFT
          </StudioSplitLeftButton>
        </ButtonSample>
      </div>
    </SubToolbox>
  )
}

export default StudioHubProductionButtonCatalog
