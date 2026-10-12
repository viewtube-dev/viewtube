import React, { useState } from "react"
import { Check, FileText, Layers3, Plus, Settings2, Sparkles } from "lucide-react"
import { SubToolbox } from "../Toolbox"
import {
  SubToolboxButton,
  SubToolboxIconButton,
  SubToolboxIconTextButton,
  SubToolboxSelectableTag,
} from "../subtoolbox/SubToolboxPrimitives"
import { SubToolboxSplitButton } from "../subtoolbox/SubToolboxSplitPrimitives"
import { SubToolboxActions } from "../subtoolbox/SubToolboxLayouts"
import { StudioButton, StudioSplitLeftButton } from "../../studio-ui/primitives/StudioControls"
import {
  SubToolboxGridActionButton,
  SubToolboxInnerActionButton,
  SubToolboxRefineButtonBase,
} from "../Toolbox"
import "./studio-hub-production-button-catalog.css"

interface StudioHubProductionButtonCatalogProps {
  paletteIndex: number
}

const noop = () => undefined

const ButtonSample: React.FC<{ name: string; description: string; children: React.ReactNode }> = ({
  name, description, children,
}) => (
  <article className="vt-production-button-sample">
    <header>
      <strong>{name}</strong>
      <p>{description}</p>
    </header>
    <div className="vt-production-button-preview">{children}</div>
  </article>
)

/** Live examples of the named production button primitives and compound action layout. */
export const StudioHubProductionButtonCatalog: React.FC<StudioHubProductionButtonCatalogProps> = ({ paletteIndex }) => {
  const [tagSelected, setTagSelected] = useState(true)
  const [studioSelected, setStudioSelected] = useState(false)
  const [innerActionCount, setInnerActionCount] = useState(0)
  const [gridActionCount, setGridActionCount] = useState(0)
  const [baseActionCount, setBaseActionCount] = useState(0)

  return (
    <SubToolbox
      title="Production Button Primitives"
      subtitle="Live examples imported from the production component files; these are not catalog-only button recreations."
      icon={<Layers3 />}
      paletteIndex={paletteIndex}
      collapsible={false}
    >
      <div className="vt-production-button-catalog" data-vt-production-button-catalog="true">
        <ButtonSample name="SubToolboxButton" description="Default accent button; standard size and tone are left at their component defaults.">
          <SubToolboxButton onClick={noop}>DEFAULT BUTTON</SubToolboxButton>
        </ButtonSample>

        <ButtonSample name="SubToolboxIconButton" description="Icon-only control with an accessible label.">
          <SubToolboxIconButton icon={<Settings2 />} ariaLabel="Settings" onClick={noop} />
        </ButtonSample>

        <ButtonSample name="SubToolboxIconTextButton" description="Icon-leading text button sharing SubToolboxButton styling and tokens.">
          <SubToolboxIconTextButton icon={<FileText />} onClick={noop}>ICON + TEXT</SubToolboxIconTextButton>
        </ButtonSample>

        <ButtonSample name="SubToolboxSplitButton" description="Canonical left icon rail and label surface.">
          <SubToolboxSplitButton icon={<Settings2 />} onClick={noop}>SPLIT BUTTON</SubToolboxSplitButton>
        </ButtonSample>

        <ButtonSample name="StudioSplitLeftButton" description="Studio UI split-left control; uses its default action size.">
          <StudioSplitLeftButton icon={<Sparkles />} onClick={noop}>STUDIO ACTION</StudioSplitLeftButton>
        </ButtonSample>

        <ButtonSample name="StudioButton" description="Studio UI standard accent button.">
          <StudioButton onClick={() => setStudioSelected(value => !value)} selected={studioSelected}>
            {studioSelected ? "SELECTED" : "STUDIO BUTTON"}
          </StudioButton>
        </ButtonSample>

        <ButtonSample name="SubToolboxSelectableTag" description="Selectable tag primitive with a visible selected state.">
          <SubToolboxSelectableTag selected={tagSelected} selectedIcon={<Check />} unselectedIcon={<Plus />} onClick={() => setTagSelected(value => !value)}>
            {tagSelected ? "SELECTED TAG" : "SELECT TAG"}
          </SubToolboxSelectableTag>
        </ButtonSample>

        <ButtonSample name="SubToolboxInnerActionButton" description="Three-pixel inner action; default icon rail remains off.">
          <SubToolboxInnerActionButton label={`INNER ACTION ${innerActionCount}`} iconName="zap" onClick={() => setInnerActionCount(value => value + 1)} />
        </ButtonSample>

        <ButtonSample name="SubToolboxActions" description="Shared compound layout for arranging related actions in a consistent grid.">
          <SubToolboxActions columns={2} forceRow>
            <SubToolboxInnerActionButton label="WRITE" iconName="file-text" onClick={noop} />
            <SubToolboxInnerActionButton label="CREATE" iconName="sparkles" onClick={noop} />
          </SubToolboxActions>
        </ButtonSample>

        <ButtonSample name="SubToolboxRefineButtonBase" description="Shared implementation base, shown in its default inner-action configuration.">
          <SubToolboxRefineButtonBase label={`BASE ACTION ${baseActionCount}`} iconName="zap" onClick={() => setBaseActionCount(value => value + 1)} borderWidth={3} />
        </ButtonSample>

        <ButtonSample name="SubToolboxGridActionButton" description="Four-pixel subtoolbox grid action with its split icon rail enabled by default.">
          <SubToolboxGridActionButton label={`REFINE ${gridActionCount}`} iconName="sparkles" tone="pink" onClick={() => setGridActionCount(value => value + 1)} />
        </ButtonSample>
      </div>
    </SubToolbox>
  )
}

export default StudioHubProductionButtonCatalog
