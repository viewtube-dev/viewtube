import React, { useState } from "react"
import { Check, FileText, Layers3, Plus, Settings2, Sparkles } from "lucide-react"
import { SubToolbox, SubToolboxGridActionButton, SubToolboxInnerActionButton, SubToolboxRefineButtonBase } from "../Toolbox"
import { SubToolboxActions } from "../subtoolbox/SubToolboxLayouts"
import { SubToolboxButton, SubToolboxIconButton, SubToolboxIconTextButton, SubToolboxSelectableTag } from "../subtoolbox/SubToolboxPrimitives"
import { SubToolboxSplitButton } from "../subtoolbox/SubToolboxSplitPrimitives"
import { StudioButton, StudioSplitLeftButton } from "../../studio-ui/primitives/StudioControls"
import "./studio-hub-production-button-catalog.css"

interface StudioHubProductionButtonCatalogProps {
  paletteIndex: number
}

const noop = () => undefined

const ButtonSample: React.FC<{ name: string; description: string; children: React.ReactNode }> = ({ name, description, children }) => (
  <article className="vt-production-button-sample">
    <header>
      <strong>{name}</strong>
      <p>{description}</p>
    </header>
    <div className="vt-production-button-preview">{children}</div>
  </article>
)

/** Live examples imported from the production button and layout implementations. */
export const StudioHubProductionButtonCatalog: React.FC<StudioHubProductionButtonCatalogProps> = ({ paletteIndex }) => {
  const [tagSelected, setTagSelected] = useState(true)
  const [studioSelected, setStudioSelected] = useState(false)
  const [innerCount, setInnerCount] = useState(0)
  const [gridCount, setGridCount] = useState(0)
  const [baseCount, setBaseCount] = useState(0)

  return (
    <SubToolbox
      title="Production Button Primitives"
      subtitle="Live examples from the production source; shared component styles and tokens remain authoritative."
      icon={<Layers3 />}
      paletteIndex={paletteIndex}
      collapsible={false}
    >
      <div className="vt-production-button-catalog" data-vt-production-button-catalog="true">
        <ButtonSample name="SubToolboxButton" description="Default accent button using the standard size and tone.">
          <SubToolboxButton onClick={noop}>DEFAULT BUTTON</SubToolboxButton>
        </ButtonSample>
        <ButtonSample name="SubToolboxIconButton" description="Icon-only control with an accessible label.">
          <SubToolboxIconButton icon={<Settings2 />} ariaLabel="Settings" onClick={noop} />
        </ButtonSample>
        <ButtonSample name="SubToolboxIconTextButton" description="Explicit icon-plus-label variant backed by SubToolboxButton.">
          <SubToolboxIconTextButton icon={<FileText />} onClick={noop}>ICON + TEXT</SubToolboxIconTextButton>
        </ButtonSample>
        <ButtonSample name="SubToolboxSplitButton" description="Canonical icon rail and label surface.">
          <SubToolboxSplitButton icon={<Settings2 />} onClick={noop}>SPLIT BUTTON</SubToolboxSplitButton>
        </ButtonSample>
        <ButtonSample name="StudioSplitLeftButton" description="Studio UI split-left action at its default action size.">
          <StudioSplitLeftButton icon={<Sparkles />} onClick={noop}>STUDIO ACTION</StudioSplitLeftButton>
        </ButtonSample>
        <ButtonSample name="StudioButton" description="Studio UI standard button with a working selected state.">
          <StudioButton onClick={() => setStudioSelected(value => !value)} selected={studioSelected}>
            {studioSelected ? "SELECTED" : "STUDIO BUTTON"}
          </StudioButton>
        </ButtonSample>
        <ButtonSample name="SubToolboxSelectableTag" description="Selectable tag primitive with selected and unselected states.">
          <SubToolboxSelectableTag selected={tagSelected} selectedIcon={<Check />} unselectedIcon={<Plus />} onClick={() => setTagSelected(value => !value)}>
            {tagSelected ? "SELECTED TAG" : "SELECT TAG"}
          </SubToolboxSelectableTag>
        </ButtonSample>
        <ButtonSample name="SubToolboxInnerActionButton" description="Three-pixel inner action; its icon rail is off by default.">
          <SubToolboxInnerActionButton label={`INNER ACTION ${innerCount}`} iconName="zap" onClick={() => setInnerCount(value => value + 1)} />
        </ButtonSample>
        <ButtonSample name="SubToolboxActions" description="Shared compound layout for arranging related actions in a consistent grid.">
          <SubToolboxActions columns={2} forceRow>
            <SubToolboxInnerActionButton label="WRITE" iconName="file-text" onClick={noop} />
            <SubToolboxInnerActionButton label="CREATE" iconName="sparkles" onClick={noop} />
          </SubToolboxActions>
        </ButtonSample>
        <ButtonSample name="SubToolboxRefineButtonBase" description="Shared implementation base shown in its inner-action configuration.">
          <SubToolboxRefineButtonBase label={`BASE ACTION ${baseCount}`} iconName="zap" onClick={() => setBaseCount(value => value + 1)} borderWidth={3} />
        </ButtonSample>
        <ButtonSample name="SubToolboxGridActionButton" description="Four-pixel grid action with its split icon rail enabled by default.">
          <SubToolboxGridActionButton label={`REFINE ${gridCount}`} iconName="sparkles" tone="pink" onClick={() => setGridCount(value => value + 1)} />
        </ButtonSample>
      </div>
    </SubToolbox>
  )
}

export default StudioHubProductionButtonCatalog
