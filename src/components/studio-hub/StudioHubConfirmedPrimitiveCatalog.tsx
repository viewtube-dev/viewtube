import React from "react"
import { StudioPublishingCard } from "../../studio-ui/compositions/StudioPublishingCard"
import { Check, Settings2, Sparkles } from "lucide-react"
import { StudioSplitAccordion } from "../../studio-ui/primitives/StudioSplitAccordion"
import {
  STUDIO_COMPONENT_GLOBAL_DEFAULTS,
  STUDIO_COMPONENT_SIZE_DEFAULTS,
  StudioButton,
  StudioActionButton,
  StudioRadio,
  StudioCheckbox,
  StudioXCheckbox,
  StudioLegendMultiDropdown,
  StudioCounter,
  StudioDoubleSplitSlider,
  StudioSideCounter,
  StudioLeftCounter,
  StudioSplitLeftButton,
  StudioSplitLeftBadge,
  StudioSplitRightBadge,
  StudioDoubleSplitBadge,
  StudioSquareIconButton,
  StudioPlayPauseButton,
  StudioCircleIconButton,
  StudioSwitch,
  StudioTextArea,
  StudioTextBox,
  StudioTextInput,
  StudioWordToggle,
  StudioVerticalWordToggle,
  StudioSpectrumTag,
  StudioCloseableBadge,
  StudioBrainStatusBadge,
  StudioTagEditor,
  StudioSimpleDropdown,
  StudioSplitLeftDropdown,
  StudioUploadFrame,
  STUDIO_CONTROL_GLOBAL_RULE_EXCEPTIONS,
  StudioArrowToggle,
  StudioSideToggle,
  StudioDoubleSideToggle,
  StudioBarToggle,
} from "../../studio-ui/primitives/StudioControls"
import ConfirmedSpecimenGrid from "./ConfirmedSpecimenGrid"
import "./studio-hub-primitive-catalogs.css"

type Size = "44px" | "28px"

const sizeClass = (size: Size) => size === "44px" ? "is-large" : "is-compact"

const formatDefaultValue = (value: unknown): string => {
  if (value === null) return "none"
  if (Array.isArray(value)) return value.map(formatDefaultValue).join(", ")
  if (typeof value === "object") return Object.entries(value as Record<string, unknown>).map(([key, nested]) => `${key}: ${formatDefaultValue(nested)}`).join("; ")
  return String(value)
}

const CANONICAL_SKINS = [{ skin: "solid" as const, label: "V1 · PRIMARY / SECONDARY" }, { skin: "color-swap" as const, label: "V2 · PRIMARY ↔ SECONDARY" }, { skin: "white-indicator" as const, label: "V3 · WHITE INDICATOR" }, { skin: "black-indicator" as const, label: "V4 · BLACK INDICATOR" }]
const CHOICE_SKINS = CANONICAL_SKINS
const WORD_TOGGLE_SKINS = CANONICAL_SKINS
const VERTICAL_WORD_TOGGLE_VARIANTS = [
  { variant: "primary-secondary" as const, label: "PRIMARY / SECONDARY" },
  { variant: "black-fill" as const, label: "BLACK FILL" },
  { variant: "primary-white-handle" as const, label: "PRIMARY + WHITE HANDLE" },
  { variant: "white-fill" as const, label: "WHITE FILL" },
]
const CanonicalControlFamilies: React.FC = () => {
  const [switches, setSwitches] = React.useState<boolean[]>(Array(8).fill(false))
  const [choices, setChoices] = React.useState<boolean[]>(Array(12).fill(false))
  const [words, setWords] = React.useState<boolean[]>(Array(8).fill(false))
  const [verticalWords, setVerticalWords] = React.useState<boolean[]>(Array(12).fill(false))
  const flip = (setter: React.Dispatch<React.SetStateAction<boolean[]>>, index: number, value?: boolean) => setter(current => current.map((old, i) => i === index ? (value ?? !old) : old))
  return <>
    <Family title="Switches, Radios & Checkboxes" nonDefaultSettings={[
        "Switches, radios, and checkboxes stay together in the controls family; word toggles are documented in their own separate family.",
        "Each specimen remains independently interactive and uses the canonical primitive with its native accessible label.",
        "Vertical word toggles size to their longest word plus original horizontal padding; the stacked height is content-driven.",
      ]} provenance={<Provenance primitive="StudioSwitch / StudioRadio / StudioCheckbox / StudioXCheckbox" tsx="src/studio-ui/primitives/StudioControls.tsx" css="src/styles/studio-control-system.css" tokens="44px / 28px / 12px tiers for supported switches, radios, and checkboxes." imports={["src/studio-ui/primitives/StudioControls.tsx"]} />}>
      <div className="vt-confirmed-choice-module">
        <div className="vt-confirmed-choice-names" aria-label="Component names">
          <span>ROUND SWITCH</span><span>RECTANGULAR SWITCH</span><span>RADIO BUTTON</span><span>CHECKMARK CHECKBOX</span><span>X CHECKBOX</span>
        </div>
        <div className="vt-confirmed-choice-variant-headings" aria-label="Shared palette variants">
          {CANONICAL_SKINS.map(skin => <span key={skin.skin}>{skin.label}</span>)}
        </div>
        <div className="vt-confirmed-choice-examples">
          {(["round", "rect"] as const).map((shape, row) => <div className="vt-confirmed-choice-example-row" key={"switch-"+shape} aria-label={shape + " switch examples"}>{CANONICAL_SKINS.map((skin, col) => { const index = row * 4 + col; return <div key={skin.skin}><StudioSwitch shape={shape} skin={skin.skin} checked={switches[index]} aria-label={shape + " switch " + skin.label} onClick={() => flip(setSwitches, index)} /></div> })}</div>)}
          {([{Component:StudioRadio,label:"radio button",shape:"round" as const},{Component:StudioCheckbox,label:"checkmark checkbox",shape:"rect" as const},{Component:StudioXCheckbox,label:"X checkbox",shape:"rect" as const}]).map((item,row) => { const ChoiceComponent = item.Component; return <div className="vt-confirmed-choice-example-row" key={item.label} aria-label={item.label + " examples"}>{CHOICE_SKINS.map((skin,col) => { const index = row * 4 + col; return <div key={skin.skin}><ChoiceComponent shape={item.shape} skin={skin.skin} checked={choices[index]} aria-label={item.label + " " + skin.label} onClick={() => flip(setChoices, index)} /></div> })}</div> })}
        </div>
      </div>
    </Family>
    <Family title="Word Toggles · Standard + Compact + Vertical" nonDefaultSettings={[
        "Horizontal and vertical word toggles share this module; switches, radios, and checkboxes remain in their own control family.",
        "Each toggle specimen remains independently interactive.",
        "Vertical toggle width follows the longest word plus the original horizontal padding; height remains content-driven.",
      ]} provenance={<Provenance primitive="StudioWordToggle / StudioVerticalWordToggle" tsx="src/studio-ui/primitives/StudioControls.tsx" css="src/styles/studio-control-system.css" tokens="44px / 28px / 12px typography tiers; vertical toggle total height remains content-driven." imports={["src/studio-ui/primitives/StudioControls.tsx"]} />}>
    <div className="vt-confirmed-toggle-subfamily">
      <strong>WORD TOGGLE · STANDARD + COMPACT</strong>
      <div className="vt-confirmed-control-family vt-confirmed-word-toggle-family">
        <div className="vt-confirmed-control-row">
          <strong>WORD TOGGLE · STANDARD</strong>
          <div className="vt-confirmed-control-variants vt-confirmed-word-toggle-standard" data-control-size="44">{WORD_TOGGLE_SKINS.map((skin,col) => <div key={skin.skin}><StudioWordToggle size="44" skin={skin.skin} value={words[col]} words={col === 0 ? ["WRITE","CREATE"] : ["OFF","ON"]} onValueChange={value => flip(setWords, col, value)} aria-label={"Standard word toggle variant " + (col + 1)} /></div>)}</div>
        </div>
        <div className="vt-confirmed-control-row">
          <strong>WORD TOGGLE · COMPACT</strong>
          <div className="vt-confirmed-control-variants vt-confirmed-word-toggle-compact" data-control-size="28">{WORD_TOGGLE_SKINS.map((skin,col) => { const index = 4 + col; return <div key={skin.skin}><StudioWordToggle size="28" skin={skin.skin} value={words[index]} words={["OFF","ON"]} onValueChange={value => flip(setWords, index, value)} aria-label={"Compact word toggle variant " + (col + 1)} /></div> })}</div>
        </div>
      </div>
    </div>
    <div className="vt-confirmed-toggle-subfamily">
      <strong>VERTICAL WORD TOGGLE · STANDARD + COMPACT + MICRO</strong>
      <div className="vt-confirmed-vertical-word-toggle-family">
        <div className="vt-confirmed-vertical-word-toggle-size-row">
          <strong>STANDARD · SINGLE COLUMN</strong>
          <div className="vt-confirmed-vertical-word-toggle-standard">
            {VERTICAL_WORD_TOGGLE_VARIANTS.map((item, index) => <div className="vt-confirmed-vertical-word-toggle-specimen" key={item.variant}>
              <small>{item.label}</small>
              <StudioVerticalWordToggle sizeVariant="standard" variant={item.variant} value={verticalWords[index]} onValueChange={value => flip(setVerticalWords, index, value)} words={index === 0 ? ["WRITE", "CREATE"] : ["OFF", "ON"]} aria-label={"Standard vertical word toggle " + item.label} />
            </div>)}
          </div>
        </div>
        <div className="vt-confirmed-vertical-word-toggle-size-row">
          <strong>COMPACT · SINGLE COLUMN + MICRO MATRIX</strong>
          <div className="vt-confirmed-vertical-word-toggle-compact">
            {VERTICAL_WORD_TOGGLE_VARIANTS.map((item, index) => <div className="vt-confirmed-vertical-word-toggle-specimen" key={item.variant}>
              <small>{item.label}</small>
              <StudioVerticalWordToggle sizeVariant="compact" variant={item.variant} value={verticalWords[4 + index]} onValueChange={value => flip(setVerticalWords, 4 + index, value)} words={index === 0 ? ["WRITE", "CREATE"] : ["OFF", "ON"]} aria-label={"Compact vertical word toggle " + item.label} />
            </div>)}
            <div className="vt-confirmed-vertical-word-toggle-micro" aria-label="Micro vertical word toggle variants">
              {VERTICAL_WORD_TOGGLE_VARIANTS.map((item, index) => <div className="vt-confirmed-vertical-word-toggle-specimen" key={item.variant}>
                <small>{item.label}</small>
                <StudioVerticalWordToggle sizeVariant="micro" variant={item.variant} value={verticalWords[8 + index]} onValueChange={value => flip(setVerticalWords, 8 + index, value)} words={["OFF", "ON"]} aria-label={"Micro vertical word toggle " + item.label} />
              </div>)}
            </div>
          </div>
        </div>
      </div>
    </div>
    </Family>
    <Family
      title="Split-left Badge · Standard + Compact + Micro"
      nonDefaultSettings={[
        "Informational split-left badge, not an action button.",
        "Badge-only micro exception: 12px height, 1px stroke, 2px radius, and 10px type/icons; it is not an interactive-control size.",
      ]}
      provenance={<Provenance
        primitive="StudioSplitLeftBadge"
        tsx="src/studio-ui/primitives/StudioControls.tsx"
        css="src/styles/studio-control-system.css"
        tokens="44px standard / 28px compact / 12px micro · 4px all-side spacing unit · centered labels · no shadows or transitions"
        imports={["src/studio-ui/primitives/StudioControls.tsx"]}
      />}
    >
      <div className="vt-confirmed-variant is-full-row vt-confirmed-split-left-badge-family" data-vt-library-component="StudioSplitLeftBadge">
        <span>STANDARD · FULL ROW</span>
        <StudioSplitLeftBadge icon={<Check aria-hidden="true" />} sizeVariant="standard">READY</StudioSplitLeftBadge>
        <span>STANDARD · HALF ROW</span>
        <div className="vt-confirmed-badge-layout is-half">
          <StudioSplitLeftBadge icon={<Check aria-hidden="true" />} sizeVariant="standard">READY</StudioSplitLeftBadge>
          <StudioSplitLeftBadge icon={<Check aria-hidden="true" />} sizeVariant="standard">READY</StudioSplitLeftBadge>
        </div>
        <span>STANDARD · QUARTER ROW · 4×1</span>
        <div className="vt-confirmed-badge-layout is-quarter">
          {["READY", "SAVED", "SYNCED", "LIVE"].map(label => <StudioSplitLeftBadge key={label} icon={<Check aria-hidden="true" />} sizeVariant="standard">{label}</StudioSplitLeftBadge>)}
        </div>
        <span>COMPACT · FULL ROW</span>
        <StudioSplitLeftBadge icon={<Check aria-hidden="true" />} sizeVariant="compact">READY</StudioSplitLeftBadge>
        <span>COMPACT · HALF ROW</span>
        <div className="vt-confirmed-badge-layout is-half">
          <StudioSplitLeftBadge icon={<Check aria-hidden="true" />} sizeVariant="compact">READY</StudioSplitLeftBadge>
          <StudioSplitLeftBadge icon={<Check aria-hidden="true" />} sizeVariant="compact">READY</StudioSplitLeftBadge>
        </div>
        <span>COMPACT · QUARTER ROW · 4×1</span>
        <div className="vt-confirmed-badge-layout is-quarter">
          {["READY", "SAVED", "SYNCED", "LIVE"].map(label => <StudioSplitLeftBadge key={label} icon={<Check aria-hidden="true" />} sizeVariant="compact">{label}</StudioSplitLeftBadge>)}
        </div>
        <span>MICRO · LEFT HALF ONLY · 1×1 / 2×1 / 4×1</span>
        <div className="vt-confirmed-badge-micro-stack">
          <div className="is-one"><StudioSplitLeftBadge icon={<Check aria-hidden="true" />} sizeVariant="micro">1×1</StudioSplitLeftBadge></div>
          <div className="is-two">{["2×1 A", "2×1 B"].map(label => <StudioSplitLeftBadge key={label} icon={<Check aria-hidden="true" />} sizeVariant="micro">{label}</StudioSplitLeftBadge>)}</div>
          <div className="is-four">{["A", "B", "C", "D"].map(label => <StudioSplitLeftBadge key={label} icon={<Check aria-hidden="true" />} sizeVariant="micro">{label}</StudioSplitLeftBadge>)}</div>
        </div>
        <span>SPLIT-RIGHT BADGE · SHARED FOUNDATION</span>
        <StudioSplitRightBadge icon={<Settings2 aria-hidden="true" />} sizeVariant="standard">RIGHT ALIGNED RAIL</StudioSplitRightBadge>
        <span>DOUBLE-SPLIT BADGE · SHARED FOUNDATION</span>
        <StudioDoubleSplitBadge leftIcon={<Check aria-hidden="true" />} rightIcon={<Sparkles aria-hidden="true" />} sizeVariant="standard">CENTERED LABEL</StudioDoubleSplitBadge>
        <span>COMPACT + MICRO VARIANTS</span>
        <StudioSplitRightBadge icon={<Settings2 aria-hidden="true" />} sizeVariant="compact">COMPACT RIGHT</StudioSplitRightBadge>
        <StudioDoubleSplitBadge leftIcon={<Check aria-hidden="true" />} rightIcon={<Sparkles aria-hidden="true" />} sizeVariant="micro">MICRO DOUBLE</StudioDoubleSplitBadge>
      </div>
    </Family>
  </>
}


const Provenance: React.FC<{ primitive: string; tsx: string; css: string; tokens: string; imports: string[] }> = ({ primitive, tsx, css, tokens, imports }) => (
  <div className="vt-confirmed-provenance">
    <div><strong>{primitive}</strong></div>
    <div>TSX: <code>{tsx}</code></div>
    <div>CSS: <code>{css}</code></div>
    <div>{tokens}</div>
    <div>Imports: {imports.map((path) => <code key={path}>{path}</code>)}</div>
  </div>
)

const Family: React.FC<{ title: string; children: React.ReactNode; provenance: React.ReactNode; nonDefaultSettings?: string[] }> = ({ title, children, provenance, nonDefaultSettings = [] }) => (
  <section className={`vt-confirmed-family ${title === "Button" || title === "Split-left" ? "vt-confirmed-button-family" : ""}`}>
    <h3 title={title}>{title}</h3>
    <div className="vt-confirmed-variants">{children}</div>
    {(nonDefaultSettings.length > 0 || provenance) && (
      <details className="vt-confirmed-source-details">
        <summary>Settings + source</summary>
        {nonDefaultSettings.length > 0 && (
          <section className="vt-confirmed-nondefault-settings" aria-label={`${title} settings`}>
            <strong>NON-DEFAULT SETTINGS</strong>
            <ul>{nonDefaultSettings.map((setting) => <li key={setting}>{setting}</li>)}</ul>
          </section>
        )}
        {provenance}
      </details>
    )}
  </section>
)

const ConfirmedStudioCounterFamily: React.FC = () => {
  const [standardPrimary, setStandardPrimary] = React.useState(22)
  const [standardReversed, setStandardReversed] = React.useState(22)
  const [compactPrimary, setCompactPrimary] = React.useState(3)
  const [compactReversed, setCompactReversed] = React.useState(3)
  const [microPrimary, setMicroPrimary] = React.useState(7)
  const [microReversed, setMicroReversed] = React.useState(7)
  return (
    <Family
      title="StudioCounter · Standard + Compact + Micro"
      nonDefaultSettings={[
        "Independent button-only counter; no legacy stepper composition.",
        "Each size pairs the primary right-side rail with an opposite-palette left-side rail.",
        "Catalog range is 0–100 for all counter sizes.",
      ]}
      provenance={<Provenance primitive="StudioCounter" tsx="src/studio-ui/primitives/StudioControls.tsx" css="src/styles/studio-control-system.css" tokens="44px / 28px / 12px · fixed geometry · 0–100 specimen range." imports={["src/studio-ui/primitives/StudioControls.tsx"]} />}
    >
      <div className="vt-confirmed-variant is-full-row vt-confirmed-counter-row">
        <div className="vt-confirmed-counter-size-rows">
          <div className="vt-confirmed-counter-size-row"><small>44px STANDARD</small><div className="vt-confirmed-counter-pair"><StudioCounter value={standardPrimary} onValueChange={setStandardPrimary} size="standard" min={0} max={100} ariaLabel="Standard counter" /><StudioCounter className="is-reversed" value={standardReversed} onValueChange={setStandardReversed} size="standard" min={0} max={100} ariaLabel="Standard counter secondary palette" /></div></div>
          <div className="vt-confirmed-counter-size-row"><small>28px COMPACT</small><div className="vt-confirmed-counter-pair"><StudioCounter value={compactPrimary} onValueChange={setCompactPrimary} size="compact" min={0} max={100} ariaLabel="Compact counter" /><StudioCounter className="is-reversed" value={compactReversed} onValueChange={setCompactReversed} size="compact" min={0} max={100} ariaLabel="Compact counter secondary palette" /></div></div>
          <div className="vt-confirmed-counter-size-row"><small>12px MICRO</small><div className="vt-confirmed-counter-pair"><StudioCounter value={microPrimary} onValueChange={setMicroPrimary} size="micro" min={0} max={100} ariaLabel="Micro counter" /><StudioCounter className="is-reversed" value={microReversed} onValueChange={setMicroReversed} size="micro" min={0} max={100} ariaLabel="Micro counter secondary palette" /></div></div>
        </div>
      </div>
    </Family>
  )
}


const ConfirmedStudioDoubleSplitSliderFamily: React.FC = () => {
  const [standardA, setStandardA] = React.useState(62)
  const [standardB, setStandardB] = React.useState(62)
  const [standardC, setStandardC] = React.useState(62)
  const [compactA, setCompactA] = React.useState(38)
  const [compactB, setCompactB] = React.useState(38)
  const [microA, setMicroA] = React.useState(7)
  const [microB, setMicroB] = React.useState(7)
  return (
    <Family
      title="StudioDoubleSplitSlider · Standard + Compact + Micro"
      nonDefaultSettings={[
        "L1 range-slider track and live numeric readout on the canonical double-split shell.",
        "Rectangular v2 handle with a black structural stroke; no shell shadow or movement.",
        "Each slider specimen has independent state, including reversed palette and counter-controlled variants.",
      ]}
      provenance={<Provenance primitive="StudioDoubleSplitSlider" tsx="src/studio-ui/primitives/StudioControls.tsx" css="src/styles/studio-control-system.css" tokens="44px / 28px / 12px · double-split rails · rectangular v2 handle · 0–100 range." imports={["src/studio-ui/primitives/StudioControls.tsx"]} />}
    >
      <div className="vt-confirmed-variant is-full-row vt-confirmed-counter-row">
        <div className="vt-confirmed-counter-size-rows">
          <div className="vt-confirmed-counter-size-row"><small>44px STANDARD</small><div className="vt-confirmed-slider-pair"><StudioDoubleSplitSlider value={standardA} onValueChange={setStandardA} size="standard" ariaLabel="Standard slider" /><StudioDoubleSplitSlider className="is-reversed" value={standardB} onValueChange={setStandardB} size="standard" ariaLabel="Standard slider secondary palette" /></div></div>
          <div className="vt-confirmed-counter-size-row"><small>28px COMPACT</small><div className="vt-confirmed-slider-pair"><StudioDoubleSplitSlider value={compactA} onValueChange={setCompactA} size="compact" ariaLabel="Compact slider" /><StudioDoubleSplitSlider className="is-reversed" value={compactB} onValueChange={setCompactB} size="compact" ariaLabel="Compact slider secondary palette" /></div></div>
          <div className="vt-confirmed-counter-size-row"><small>COUNTER-CONTROLLED · UP / DOWN</small><div className="vt-confirmed-slider-pair"><StudioDoubleSplitSlider value={standardC} onValueChange={setStandardC} size="standard" leftControls="counter" ariaLabel="Counter-controlled slider" /></div></div>
          <div className="vt-confirmed-counter-size-row"><small>12px MICRO</small><div className="vt-confirmed-slider-pair"><StudioDoubleSplitSlider value={microA} onValueChange={setMicroA} size="micro" ariaLabel="Micro slider" /><StudioDoubleSplitSlider className="is-reversed" value={microB} onValueChange={setMicroB} size="micro" ariaLabel="Micro slider secondary palette" /></div></div>
        </div>
      </div>
    </Family>
  )
}

const ConfirmedStudioSideCounterFamily: React.FC = () => {
  const [sideStandard, setSideStandard] = React.useState(5)
  const [leftStandard, setLeftStandard] = React.useState(5)
  const [sideCompact, setSideCompact] = React.useState(3)
  const [leftCompact, setLeftCompact] = React.useState(3)
  const [sideMicro, setSideMicro] = React.useState(8)
  const [leftMicro, setLeftMicro] = React.useState(8)
  return (
    <Family
      title="StudioSideCounter · Standard + Compact + Micro"
      nonDefaultSettings={[
        "Independent button-only counter with 2:1 display and two-cell right action rail.",
        "Each size is a centered row with primary and secondary palette variants paired side-by-side.",
        "Catalog range is 0–100 for all counter sizes.",
      ]}
      provenance={<Provenance primitive="StudioSideCounter" tsx="src/studio-ui/primitives/StudioControls.tsx" css="src/styles/studio-control-system.css" tokens="44px / 28px / 12px · right-side action rail geometry · 0–100 specimen range." imports={["src/studio-ui/primitives/StudioControls.tsx"]} />}
    >
      <div className="vt-confirmed-variant is-full-row vt-confirmed-counter-row">
        <div className="vt-confirmed-counter-size-rows">
          <div className="vt-confirmed-counter-size-row"><small>44px STANDARD</small><div className="vt-confirmed-counter-pair"><StudioSideCounter value={sideStandard} onValueChange={setSideStandard} size="standard" min={0} max={100} ariaLabel="Standard side counter" /><StudioLeftCounter className="is-reversed" value={leftStandard} onValueChange={setLeftStandard} size="standard" min={0} max={100} ariaLabel="Standard left counter secondary palette" /></div></div>
          <div className="vt-confirmed-counter-size-row"><small>28px COMPACT</small><div className="vt-confirmed-counter-pair"><StudioSideCounter value={sideCompact} onValueChange={setSideCompact} size="compact" min={0} max={100} ariaLabel="Compact side counter" /><StudioLeftCounter className="is-reversed" value={leftCompact} onValueChange={setLeftCompact} size="compact" min={0} max={100} ariaLabel="Compact left counter secondary palette" /></div></div>
          <div className="vt-confirmed-counter-size-row"><small>12px MICRO</small><div className="vt-confirmed-counter-pair"><StudioSideCounter value={sideMicro} onValueChange={setSideMicro} size="micro" min={0} max={100} ariaLabel="Micro side counter" /><StudioLeftCounter className="is-reversed" value={leftMicro} onValueChange={setLeftMicro} size="micro" min={0} max={100} ariaLabel="Micro left counter secondary palette" /></div></div>
        </div>
      </div>
    </Family>
  )
}

/** Certified production examples only. This catalog uses the real Studio Hub exports. */
/** Certified StudioButton examples arranged by the reusable PR #756 specimen grid. */
const buttonVariantNumbers = [1, 2, 3, 4, 5, 6, 7] as const
type StudioButtonGridTier = "supreme" | "standard" | "compact" | "micro"

const buttonCell = (tier: StudioButtonGridTier, id: string, variant: number, span: number) => ({
  id: `${tier}-${id}-v${variant}`,
  label: variant === 4 ? "BLACK" : variant === 5 ? "OFF" : variant === 6 ? "NO" : variant === 7 ? "WHITE" : "BUTTON",
  span,
})

const ConfirmedStudioButtonFamily: React.FC = () => {
  const layoutRows = [
    { id: "1-supreme-full", tier: "supreme" as const, specimens: [buttonCell("supreme", "row-1", 1, 144)] },
    { id: "2-supreme-halves", tier: "supreme" as const, specimens: [buttonCell("supreme", "row-2a", 1, 72), buttonCell("supreme", "row-2b", 2, 72)] },
    { id: "3-standard-full", tier: "standard" as const, specimens: [buttonCell("standard", "row-3", 1, 144)] },
    { id: "4-standard-halves", tier: "standard" as const, specimens: [buttonCell("standard", "row-4a", 1, 72), buttonCell("standard", "row-4b", 2, 72)] },
    { id: "5-standard-fractions", tier: "standard" as const, specimens: [
      buttonCell("standard", "row-5-third", 3, 48),
      buttonCell("standard", "row-5-quarter", 4, 36),
      buttonCell("standard", "row-5-sixth", 5, 24),
      buttonCell("standard", "row-5-eighth-a", 6, 18),
      buttonCell("standard", "row-5-eighth-b", 7, 18),
    ] },
    { id: "6-compact-fractions", tier: "compact" as const, specimens: [
      buttonCell("compact", "row-6-third", 1, 48),
      buttonCell("compact", "row-6-quarter", 2, 36),
      buttonCell("compact", "row-6-two-ninths", 3, 32),
      buttonCell("compact", "row-6-ninth", 4, 16),
      buttonCell("compact", "row-6-twelfth", 5, 12),
    ] },
    {
      id: "7-compact-and-micro",
      panels: [
        { id: "7 compact · half module", tier: "compact" as const, span: 72, rows: [{
          id: "7-compact-row",
          tier: "compact" as const,
          specimens: [
            buttonCell("compact", "row-7-eighth-a", 3, 18),
            buttonCell("compact", "row-7-eighth-b", 4, 18),
            buttonCell("compact", "row-7-eighth-c", 5, 18),
            buttonCell("compact", "row-7-sixteenth-a", 6, 9),
            buttonCell("compact", "row-7-sixteenth-b", 7, 9),
          ],
        }] },
        { id: "7A–7B micro · half module", tier: "micro" as const, span: 72, rows: [
          { id: "7A-micro-quarters", tier: "micro" as const, specimens: [
            buttonCell("micro", "row-7a-quarter-a", 1, 36),
            buttonCell("micro", "row-7a-quarter-b", 2, 36),
          ] },
          { id: "7B-micro-eighths-sixteenths", tier: "micro" as const, specimens: [
            buttonCell("micro", "row-7b-eighth-a", 3, 18),
            buttonCell("micro", "row-7b-eighth-b", 4, 18),
            buttonCell("micro", "row-7b-sixteenth-a", 5, 9),
            buttonCell("micro", "row-7b-sixteenth-b", 6, 9),
            buttonCell("micro", "row-7b-sixteenth-c", 7, 9),
            buttonCell("micro", "row-7b-sixteenth-d", 1, 9),
          ] },
        ] },
      ],
    },
  ]

  return (
    <Family title="Button · V1–V7 · Proportional size grid" nonDefaultSettings={[
      "Full-module width layout with the exact seven-row PR #756 composition: Supreme full and half rows; Standard full, half, and 1/3 + 1/4 + 1/6 + 2×1/8 row; Compact 1/3 + 1/4 + 2/9 + 1/9 + 1/12 row; then a split half-module Compact/Micro row.",
      "Row 7 keeps five compact specimens in the left half (3×1/8 + 2×1/16 of module width) and the Micro rows in the right half: 7A has 2×1/4; 7B has 2×1/8 + 4×1/16.",
      "V1 primary/black; V2 secondary/black; V3 independently toggles V1 and V2; V4 black/primary; V5 toggles V1/V2 with OFF/ON text; V6 toggles V1/black with NO/YES text; V7 primary/white.",
      "Each specimen is a real StudioButton. The grid controls arrangement only; production primitive owns size geometry, face styling, toggle state, accessibility, and ellipsis behavior.",
    ]} provenance={<Provenance primitive="StudioButton · V1–V7" tsx="src/studio-ui/primitives/StudioControls.tsx" css="src/styles/studio-control-system.css + ConfirmedSpecimenGrid.css" tokens="60px Supreme · 44px Standard · 28px Compact · 12px Micro · proportional 144-unit grid · 4px gap" imports={["src/studio-ui/primitives/StudioControls.tsx", "src/components/studio-hub/ConfirmedSpecimenGrid.tsx"]} />}>
      <div className="vt-confirmed-variant is-full-row vt-confirmed-button-gallery">
        <ConfirmedSpecimenGrid
          familyName="Original StudioButton variants"
          layoutRows={layoutRows}
          renderSpecimen={({ id, tier, label }) => {
            const variant = Number(id.match(/-v(\d+)(?:-repeat)?$/)?.[1] ?? 1) as 1 | 2 | 3 | 4 | 5 | 6 | 7
            const activeChildren = variant === 5 ? "ON" : variant === 6 ? "YES" : undefined
            return (
              <StudioButton
                className="vt-confirmed-button-skin"
                variant={`v${variant}` as "v1" | "v2" | "v3" | "v4" | "v5" | "v6" | "v7"}
                activeChildren={activeChildren}
                sizeVariant={tier}
                data-vt-library-component="StudioButton"
                aria-label={variant === 3 ? "Button primary/secondary color toggle" : variant === 5 ? "Button OFF/ON toggle" : variant === 6 ? "Button NO/YES toggle" : variant === 4 ? "Black button" : variant === 7 ? "White button" : `Button variant ${variant}`}
              >
                {label}
              </StudioButton>
            )
          }}
        />
      </div>
    </Family>
  )
}

export const StudioHubConfirmedPrimitiveCatalog: React.FC = () => (
  <div className="vt-confirmed-catalog">
    <Family
      title="Confirmed Specimen Grid · Layout Contract"
      nonDefaultSettings={[
        "This is the reusable arrangement component from PR #756, integrated with real production Studio Controls.",
        "This general layout-contract preview uses a status badge for its informational micro sample; the original Button family below separately exercises the established Supreme, Standard, and Micro button variants.",
        "The grid controls catalog arrangement only. It does not override primitive faces, sizing tokens, focus, or interaction behavior.",
      ]}
      provenance={<Provenance primitive="ConfirmedSpecimenGrid + StudioButton + StudioBrainStatusBadge" tsx="src/components/studio-hub/ConfirmedSpecimenGrid.tsx" css="src/components/studio-hub/ConfirmedSpecimenGrid.css" tokens="4px layout rhythm; tier availability remains component-specific." imports={["src/components/studio-hub/ConfirmedSpecimenGrid.tsx", "src/studio-ui/primitives/StudioControls.tsx"]} />}
    >
      <ConfirmedSpecimenGrid
        familyName="Studio control tier and layout reference"
        documentation={<p>Use this reusable grid as the migration target for catalog families. Do not map unsupported size tiers onto a primitive.</p>}
        renderSpecimen={({ id, tier }) => (
          <div className="vt-confirmed-variant" data-vt-specimen-id={id} data-vt-specimen-tier={tier} aria-label={`${tier} specimen`}>
            {tier === "supreme" ? (
              <StudioButton heightVariant="60">SUPREME</StudioButton>
            ) : tier === "standard" ? (
              <StudioButton heightVariant="44">STANDARD</StudioButton>
            ) : tier === "compact" ? (
              <StudioButton heightVariant="28">COMPACT</StudioButton>
            ) : (
              <StudioBrainStatusBadge label="MICRO" tone="cyan" appearance="tinted" sizeVariant="micro" />
            )}
          </div>
        )}
      />
    </Family>
    <section className="vt-confirmed-family vt-confirmed-defaults-combined" aria-labelledby="vt-confirmed-global-defaults-title">
      <h3 id="vt-confirmed-global-defaults-title">Global Defaults · Current Source Contract</h3>
      <p className="vt-confirmed-defaults-summary">60px Supreme · 44px standard · 28px compact · 12px micro · 4.09px / 3px / 2px / 1px borders · 6px / 4px / 2px radii · Inter 1000 uppercase with size-scaled text stroke · 4px standard gap · row-fill by default; data-width="content" opts into intrinsic width · single-line input 38px / 24px · textarea 18px / 14px</p>
      <p><a href="https://github.com/viewtube-dev/viewtube/blob/master/consolidated-feature-integration/docs/ui/STUDIO_CONTROLS_GLOBAL_DEFAULTS_AND_EXCEPTION_INDEX.md" target="_blank" rel="noreferrer">Global defaults, exception index, and certification rules ↗</a></p>
      <details className="vt-confirmed-defaults-details">
        <summary>Show current defaults, effective CSS behavior, and exceptions</summary>
        <div className="vt-confirmed-size-grid">
          <div className="vt-confirmed-size-card"><strong>44PX STANDARD</strong><span>H {STUDIO_COMPONENT_SIZE_DEFAULTS.standard.height}px · Stroke {STUDIO_COMPONENT_SIZE_DEFAULTS.standard.stroke}px · R {STUDIO_COMPONENT_SIZE_DEFAULTS.standard.radius}px · Font {STUDIO_COMPONENT_SIZE_DEFAULTS.standard.fontSize}px / weight {STUDIO_COMPONENT_SIZE_DEFAULTS.standard.fontWeight}</span><span>Flat default: no shadow, hover offset, or press offset · icon {STUDIO_COMPONENT_SIZE_DEFAULTS.standard.iconSize}px / stroke {STUDIO_COMPONENT_SIZE_DEFAULTS.standard.iconStroke}</span></div>
          <div className="vt-confirmed-size-card"><strong>28PX COMPACT</strong><span>H {STUDIO_COMPONENT_SIZE_DEFAULTS.compact.height}px · Stroke {STUDIO_COMPONENT_SIZE_DEFAULTS.compact.stroke}px · R {STUDIO_COMPONENT_SIZE_DEFAULTS.compact.radius}px · Font {STUDIO_COMPONENT_SIZE_DEFAULTS.compact.fontSize}px / weight {STUDIO_COMPONENT_SIZE_DEFAULTS.compact.fontWeight}</span><span>Flat default: no shadow, hover offset, or press offset · icon {STUDIO_COMPONENT_SIZE_DEFAULTS.compact.iconSize}px / stroke {STUDIO_COMPONENT_SIZE_DEFAULTS.compact.iconStroke}</span></div>
        </div>
        <div className="vt-confirmed-size-card"><strong>SINGLE-LINE INPUTS · GLOBAL TYPOGRAPHY</strong><span>Standard {STUDIO_COMPONENT_SIZE_DEFAULTS.textInput.standardFontSize}px · compact {STUDIO_COMPONENT_SIZE_DEFAULTS.textInput.compactFontSize}px · weight {STUDIO_COMPONENT_SIZE_DEFAULTS.textInput.fontWeight} · line-height {STUDIO_COMPONENT_SIZE_DEFAULTS.textInput.lineHeight}</span><span>Inputs keep the selected 44px / 28px geometry and use the global single-line type scale.</span></div>
        <div className="vt-confirmed-size-card vt-confirmed-field-typography-exception"><strong>MULTILINE TEXTAREA · REGISTERED EXCEPTION</strong><span>Standard {STUDIO_COMPONENT_SIZE_DEFAULTS.multiline.standardFontSize}px · compact {STUDIO_COMPONENT_SIZE_DEFAULTS.multiline.compactFontSize}px · minimum surface {STUDIO_COMPONENT_SIZE_DEFAULTS.multiline.minHeight}px · weight {STUDIO_COMPONENT_SIZE_DEFAULTS.multiline.fontWeight}</span><span>Textarea-only multiline line-height, padding, and vertical resizing; selected size still controls height family, border, and radius.</span></div>
        <div className="vt-confirmed-size-card vt-confirmed-action-exception"><strong>PROMINENT ACTION · SUPREME DEFAULT</strong><span>60px Supreme default; standard and compact variants use shared tier tokens · flat and stationary.</span><span>StudioActionButton is a workflow role, not a separate fixed-height size family; shell shadows, transitions, and hover/press movement are removed.</span></div>
        <div className="vt-confirmed-global-grid">{Object.entries(STUDIO_COMPONENT_GLOBAL_DEFAULTS).map(([key, value]) => <div key={key}><strong>{key.replace(/([A-Z])/g, " $1")}</strong><span>{formatDefaultValue(value)}</span></div>)}</div>
        <div className="vt-confirmed-defaults-explainer">
          <strong>HOW TO READ THE CURRENT CONTRACT</strong>
          <p><b>Geometry:</b> standard is 44px high / 3px border / 6px radius; compact is 28px / 2px / 4px. Default type is Inter, weight 1000, uppercase, -0.02em tracking, and default line-height (1) unless a family exception is documented.</p>
          <p><b>Field colors:</b> At rest, value, placeholder, and caret use primary (--pair-a); fill uses primary at 50% opacity, the outer border is black, and the inline primary text stroke matches the selected border width. Focus uses primary fill at 15%, black text and inline stroke, plus a secondary-color outline at 65% of the selected border width with 0px offset.</p>
          <p><b>Global interaction defaults:</b> primitive shells are flat and stationary. No shell shadow, hover/press movement, or transition is part of the default contract; explicitly registered inner-icon effects must remain isolated and honor reduced motion.</p>
          <p><b>Icon presets:</b> the default production preset is 38px / 1.9 stroke standard and 24px / 2.0 compact. Current (28px / 18px) and moderate (34px / 22px) presets are opt-in. Circle icon buttons scale the large preset to 80%.</p>
          <p><b>Certification boundary:</b> This section describes the intended canonical contract. Focus, responsive layout, accessibility, and any explicitly registered inner-icon effect require browser verification before certification; primitive shells remain flat and stationary.</p>
        </div>
      </details>
    </section>
    <section className="vt-confirmed-family vt-confirmed-exception-index" aria-labelledby="vt-confirmed-exception-index-title">
      <h3 id="vt-confirmed-exception-index-title">Global Exceptions · Current Implementation + Verification Boundary</h3>
      <p>Canonical sources: <code>src/studio-ui/primitives/StudioControls.tsx</code>, <code>src/studio-ui/tokens.ts</code>, and <code>src/styles/studio-control-system.css</code>. Named size exceptions are registered in <code>STUDIO_CONTROL_GLOBAL_RULE_EXCEPTIONS</code>; effective CSS can diverge from token metadata.</p>
      <ul>
        <li><strong>BASE SIZE LATTICE:</strong> standard is 44px / 3px stroke / 6px radius; compact is 28px / 2px stroke / 4px radius. These are ordinary component sizes, not universal dimensions for every metadata element.</li>
        <li><strong>SINGLE-LINE INPUT TYPOGRAPHY:</strong> 38px standard / 24px compact, weight 1000 and default line-height (1) while retaining selected-size geometry.</li>
        <li><strong>MULTILINE TEXTAREA:</strong> 18px standard / 14px compact, multiline line-height and padding, 92px minimum writing surface, and vertical resize.</li>
        <li><strong>PROMINENT WORKFLOW ACTION:</strong> StudioActionButton is a Supreme 60px default with standard/compact variants and token-driven geometry, and no shell shadow, transition, or hover/press translation.</li>
        <li><strong>GLOBAL SHADOW + MOTION POLICY:</strong> canonical primitive shells and faces are flat and stationary; obsolete shadow/movement declarations must be removed, not masked by override layers. Browser computed-style verification remains a release gate.</li>
        <li><strong>DROPDOWN:</strong> the trigger uses standard/compact sizing; menu rows and options are not button-press surfaces. A floating panel may have its own stationary shadow. Panel typography and stacking use dropdown-specific CSS.</li>
        <li><strong>SQUARE / CIRCLE ICON BUTTONS:</strong> share the standard/compact size lattice and default flat, stationary shell behavior. Large icon preset is default; circle buttons scale it to 80%. V1–V4 skins and documented inner-icon effects are explicit variants, not global shell behavior.</li>
        <li><strong>VAULT SPECTRUM TAG:</strong> registered 15px dense metadata chip with 2px border, 4px radius, 8px / weight-900 type, 35% white-mixed spectrum fill, and flat selected-state color treatment with no shadow, glow, or geometry offset.</li>
        <li><strong>CLOSEABLE BADGE:</strong> follows the standard / compact / micro 44px / 28px / 12px size lattice, 3px / 2px / 1px stroke, 6px / 4px / 2px radius, and 38px / 24px / 10px type. The close action is circular and secondary-filled; no pill-ratio shell exception.</li>
        <li><strong>TAG EDITOR ACTION:</strong> registered compact 28px square plus/check action, 2px stroke and 4px radius with a no shadow under the global flat-control contract.</li>
        <li><strong>SPLIT-LEFT BADGE MICRO DENSITY:</strong> informational badge examples include a 12px / 1px-stroke micro size in addition to standard 44px / 3px and compact 28px / 2px. Micro is a local exception, not a global control size.</li>
        <li><strong>FIELD CARET + FOCUS:</strong> native insertion caret is retained; <code>caret-shape: block</code> is requested where supported and must not be simulated with a fake overlay. Focus uses the secondary outline at 65% of the selected border width and 0px offset; verify computed styles in a rendered browser.</li>
        <li><strong>REDUCED MOTION:</strong> primitive shells have no default transitions or movement. Explicitly registered inner-icon effects must honor reduced-motion preferences.</li>
        <li><strong>VERIFICATION BOUNDARY:</strong> source text and source tests do not certify the live deployment. Verify standard/compact dimensions, effective shadows/transforms, selected/disabled/loading states, keyboard focus, dropdown stacking, narrow layouts, and reduced motion in a browser.</li>
      </ul>
      <p><strong>Audit status:</strong> this library records the canonical global defaults. A primitive is not certified until its production rendering, tokens, effective CSS, and responsive/accessibility behavior agree with this contract.</p>
    </section>
    <Family title="Studio Text Input · Standalone + Simple + Floating + Fixed Label" nonDefaultSettings={[
        "Single-line input typography remains 38px standard / 24px compact / 10px micro across all label variants.",
        "Floating labels raise to 80% of the input font size; fixed label boxes match StudioLegendMultiDropdown.",
      ]} provenance={<Provenance primitive="StudioTextInput" tsx="src/studio-ui/primitives/StudioTextInput.tsx" css="src/styles/studio-control-system.css + src/styles/studio-text-input.css" tokens="One native input family with simple, floating-label, and fixed-label variants; standard 44px / 38px, compact 28px / 24px, micro 12px / 10px." imports={["src/studio-ui/primitives/StudioTextInput.tsx", "src/styles/studio-control-entry.css", "src/styles/studio-text-input.css"]} />}>
      <div className="vt-confirmed-variant is-full-row"><span>44px standard · simple input</span><StudioTextInput sizeVariant="standard" aria-label="Studio plain text input standard" placeholder="TYPE HERE" data-vt-library-component="StudioTextInput" /></div>
      <div className="vt-confirmed-variant is-full-row"><span>28px compact · simple input</span><StudioTextInput sizeVariant="compact" aria-label="Studio plain text input compact" placeholder="TYPE HERE" data-vt-library-component="StudioTextInput" /></div>
      <div className="vt-confirmed-variant is-full-row"><span>12px micro · simple input</span><StudioTextInput sizeVariant="micro" aria-label="Studio plain text input micro" placeholder="TITLE" data-vt-library-component="StudioTextInput" /></div>
      <div className="vt-confirmed-variant is-full-row"><span>Floating label · 44px standard · A</span><StudioTextInput variant="floating-label" floatingLabelVariant="a" label="TITLE" aria-label="Studio floating-label input standard A" data-vt-library-component="StudioTextInput" /></div>
      <div className="vt-confirmed-paired-compact-row">
        <div className="vt-confirmed-variant"><span>Floating label · 28px compact · A</span><StudioTextInput variant="floating-label" floatingLabelVariant="a" label="TITLE" aria-label="Studio floating-label input compact A" sizeVariant="compact" data-vt-library-component="StudioTextInput" /></div>
        <div className="vt-confirmed-variant"><span>Floating label · 28px compact · B · reverse colors</span><StudioTextInput className="is-reverse-colors" variant="floating-label" floatingLabelVariant="b" label="TITLE" aria-label="Studio floating-label input compact B reverse colors" sizeVariant="compact" data-vt-library-component="StudioTextInput" /></div>
      </div>
      <div className="vt-confirmed-variant is-full-row"><span>Fixed label box · 44px standard · A</span><StudioTextInput variant="fixed-label" label="TITLE" aria-label="Studio fixed-label input standard A" sizeVariant="standard" data-vt-library-component="StudioTextInput" /></div>
      <div className="vt-confirmed-paired-compact-row">
        <div className="vt-confirmed-variant"><span>Fixed label box · 28px compact · A</span><StudioTextInput variant="fixed-label" label="TITLE" aria-label="Studio fixed-label input compact A" sizeVariant="compact" data-vt-library-component="StudioTextInput" /></div>
        <div className="vt-confirmed-variant"><span>Fixed label box · 28px compact · B · reverse colors</span><StudioTextInput className="is-reverse-colors" variant="fixed-label" label="TITLE" aria-label="Studio fixed-label input compact B reverse colors" sizeVariant="compact" data-vt-library-component="StudioTextInput" /></div>
      </div>
    </Family>
    <Family title="Studio Text Area · Standalone + Simple + Floating + Fixed Label" nonDefaultSettings={[
        "Multiline-only exception: 18px standard / 14px compact typography, distinct line-height and padding, and a 92px minimum writing surface.",
      ]} provenance={<Provenance primitive="StudioTextArea" tsx="src/studio-ui/primitives/StudioControls.tsx" css="src/styles/studio-control-system.css" tokens="One native textarea family with simple and floating-label variants; 92px minimum surface and standard 18px / compact 14px multiline typography." imports={["src/studio-ui/primitives/StudioControls.tsx"]} />}>
      <div className="vt-confirmed-variant is-full-row"><span>44px standard · StudioTextArea</span><StudioTextArea sizeVariant="standard" rows={4} aria-label="Studio text area 44px" placeholder="TYPE HERE" data-vt-library-component="StudioTextArea" /></div>
      <div className="vt-confirmed-variant is-full-row"><span>28px compact · StudioTextArea</span><StudioTextArea sizeVariant="compact" rows={4} aria-label="Studio text area 28px" placeholder="TYPE HERE" data-vt-library-component="StudioTextArea" /></div>
      <div className="vt-confirmed-variant is-full-row"><span>Floating label · 44px standard · A</span><StudioTextArea variant="floating-label" floatingLabelVariant="a" label="DESCRIPTION" aria-label="Studio floating-label textarea standard A" rows={4} data-vt-library-component="StudioTextArea" /></div>
      <div className="vt-confirmed-paired-compact-row">
        <div className="vt-confirmed-variant"><span>Floating label · 28px compact · A</span><StudioTextArea variant="floating-label" floatingLabelVariant="a" label="DESCRIPTION" aria-label="Studio floating-label textarea compact A" sizeVariant="compact" rows={4} data-vt-library-component="StudioTextArea" /></div>
        <div className="vt-confirmed-variant"><span>Floating label · 28px compact · B · reverse colors</span><StudioTextArea className="is-reverse-colors" variant="floating-label" floatingLabelVariant="b" label="DESCRIPTION" aria-label="Studio floating-label textarea compact B reverse colors" sizeVariant="compact" rows={4} data-vt-library-component="StudioTextArea" /></div>
      </div>
      <div className="vt-confirmed-variant is-full-row"><span>Fixed label box · 44px standard · A</span><StudioTextArea variant="fixed-label" label="DESCRIPTION" aria-label="Studio fixed-label textarea standard A" sizeVariant="standard" rows={4} data-vt-library-component="StudioTextArea" /></div>
      <div className="vt-confirmed-paired-compact-row">
        <div className="vt-confirmed-variant"><span>Fixed label box · 28px compact · A</span><StudioTextArea variant="fixed-label" label="DESCRIPTION" aria-label="Studio fixed-label textarea compact A" sizeVariant="compact" rows={4} data-vt-library-component="StudioTextArea" /></div>
        <div className="vt-confirmed-variant"><span>Fixed label box · 28px compact · B · reverse colors</span><StudioTextArea className="is-reverse-colors" variant="fixed-label" label="DESCRIPTION" aria-label="Studio fixed-label textarea compact B reverse colors" sizeVariant="compact" rows={4} data-vt-library-component="StudioTextArea" /></div>
      </div>
    </Family>

    <Family title="Studio Text Box · Standard + Compact + Micro" nonDefaultSettings={[
        "Non-editable, selectable display surface; no caret, editing behavior, or keyboard tab stop.",
        "Inherits the corresponding textarea border, radius, padding, typography, primary fill, and default line-height (1).",
        "Content height grows with text; newlines are preserved and long words wrap.",
      ]} provenance={<Provenance primitive="StudioTextBox" tsx="src/studio-ui/primitives/StudioControls.tsx" css="src/styles/studio-control-system.css" tokens="Textarea-matched typography: 18px standard / 14px compact / 10px micro; shared global border widths and radii; default line-height (1)." imports={["src/studio-ui/primitives/StudioControls.tsx"]} />}>
      <div className="vt-confirmed-variant is-full-row"><span>STANDARD · 18PX</span><StudioTextBox aria-label="Studio text box standard" data-vt-library-component="StudioTextBox">A read-only description that can contain as little or as much text as needed.</StudioTextBox></div>
      <div className="vt-confirmed-variant is-full-row"><span>COMPACT · 14PX</span><StudioTextBox size="compact" aria-label="Studio text box compact" data-vt-library-component="StudioTextBox">Compact display text. A second row remains aligned to the textarea line-height.</StudioTextBox></div>
      <div className="vt-confirmed-variant is-full-row"><span>MICRO · 10PX</span><StudioTextBox size="micro" aria-label="Studio text box micro" data-vt-library-component="StudioTextBox">Micro display text.</StudioTextBox></div>
    </Family>
    <CanonicalControlFamilies />
    <p className="vt-confirmed-intro">Production primitives · standard + compact.</p>
    <ConfirmedStudioButtonFamily />


    <Family title="Prominent Action · 60px Supreme" nonDefaultSettings={[
        "Supreme 60px is the default; standard 44px and compact 28px are explicit size variants.",
        "Workflow role does not create a separate fixed-height tier; all geometry comes from the canonical Studio size tokens.",
      ]} provenance={<Provenance primitive="StudioActionButton" tsx="src/studio-ui/primitives/StudioControls.tsx" css="src/styles/studio-control-system.css" tokens="Supreme 60px default · Standard 44px · Compact 28px; workflow role shares canonical size tokens." imports={["src/studio-ui/primitives/StudioControls.tsx"]} />}>
      <div className="vt-confirmed-variant is-full-row"><span>60px Supreme · default</span><StudioActionButton sizeVariant="supreme" data-vt-library-component="StudioActionButton">CREATE PACKAGE</StudioActionButton></div>
      <div className="vt-confirmed-variant"><span>44px standard</span><StudioActionButton sizeVariant="standard" data-vt-library-component="StudioActionButton">CREATE PACKAGE</StudioActionButton></div>
      <div className="vt-confirmed-variant"><span>28px compact</span><StudioActionButton sizeVariant="compact" data-vt-library-component="StudioActionButton">CREATE</StudioActionButton></div>
    </Family>

    <Family title="Square Icon Button · 44px + 28px" nonDefaultSettings={[
        "V1–V4 skins change fill and icon color only.",
        "All icon presets and interaction effects live in this single family; success styling must follow a real successful operation.",
      ]} provenance={<Provenance primitive="StudioSquareIconButton · v1/v2/v3/v4 + seven effects" tsx="src/studio-ui/primitives/StudioControls.tsx" css="src/styles/studio-control-system.css" tokens="44×44px standard / 28×28px compact; V1–V4 skins; all icon presets and opt-in interaction effects; no default shell shadow or motion." imports={["src/studio-ui/index.ts", "src/components/studio-hub/StudioHubConfirmedPrimitiveCatalog.tsx"]} />}>
      <div className="vt-confirmed-variant is-full-row vt-confirmed-square-variant-row">
        <span>44px standard · variants 1–4</span>
        <div className="vt-confirmed-square-variant-grid">
          <StudioSquareIconButton icon={<Settings2 aria-hidden="true" />} label="Square icon button V1 primary fill" variant="v1" sizeVariant="standard" data-vt-library-component="StudioSquareIconButton" />
          <StudioSquareIconButton icon={<Settings2 aria-hidden="true" />} label="Square icon button V2 secondary fill" variant="v2" sizeVariant="standard" data-vt-library-component="StudioSquareIconButton" />
          <StudioSquareIconButton icon={<Sparkles aria-hidden="true" />} label="Toggle square icon button selection" variant="v3" sizeVariant="standard" data-vt-library-component="StudioSquareIconButton" />
          <StudioSquareIconButton icon={<Settings2 aria-hidden="true" />} label="Square icon button V4 black fill" variant="v4" sizeVariant="standard" data-vt-library-component="StudioSquareIconButton" />
        </div>
      </div>
      <div className="vt-confirmed-variant is-full-row vt-confirmed-square-variant-row">
        <span>28px compact · variants 1–4</span>
        <div className="vt-confirmed-square-variant-grid">
          <StudioSquareIconButton icon={<Settings2 aria-hidden="true" />} label="Compact square icon button V1" variant="v1" sizeVariant="compact" data-vt-library-component="StudioSquareIconButton" />
          <StudioSquareIconButton icon={<Settings2 aria-hidden="true" />} label="Compact square icon button V2" variant="v2" sizeVariant="compact" data-vt-library-component="StudioSquareIconButton" />
          <StudioSquareIconButton icon={<Sparkles aria-hidden="true" />} label="Toggle compact square icon button selection" variant="v3" sizeVariant="compact" data-vt-library-component="StudioSquareIconButton" />
          <StudioSquareIconButton icon={<Settings2 aria-hidden="true" />} label="Compact square icon button V4" variant="v4" sizeVariant="compact" data-vt-library-component="StudioSquareIconButton" />
        </div>
      </div>
      <div className="vt-confirmed-variant"><span>44px standard · disabled</span><StudioSquareIconButton icon={<Settings2 aria-hidden="true" />} label="Disabled square icon button" variant="v1" sizeVariant="standard" disabled data-vt-library-component="StudioSquareIconButton" /></div>
      <div className="vt-confirmed-variant is-full-row vt-confirmed-square-effects-wrap">
        <span>INTERACTION EFFECT EXAMPLES · STANDARD + COMPACT</span>
        <details className="vt-confirmed-source-details vt-confirmed-square-effect-details">
          <summary>Animation behavior · expand for details</summary>
          <section className="vt-confirmed-nondefault-settings" aria-label="Square icon animation behavior">
            <strong>INTERACTION ANIMATION NOTES</strong>
            <ul>
              <li>Pop on activation is temporary; notification badges remain a separate count indicator.</li>
              <li>Rotated toggle, sun/moon, and lock/unlock preserve their selected state; lock/unlock changes the shackle only.</li>
              <li>3D flip and morph transition between configured icon states; tooltip effects expose an action label on hover and focus.</li>
              <li>Success and download/check show an outcome only when success is explicitly supplied.</li>
              <li>Heart pop uses a temporary fill and paired ripple; bell ring rotates and expands an alert ripple.</li>
              <li>Refresh spins on activation; like increments its live count and replays the icon pop.</li>
              <li>Reduced-motion preferences remain handled by the shared primitive styles.</li>
            </ul>
          </section>
        </details>
        <div className="vt-confirmed-square-effect-grid">
          <section className="vt-confirmed-square-effect-pair"><strong>POP ON ACTIVATION</strong><div className="vt-confirmed-square-effect-sizes"><StudioSquareIconButton icon={<Settings2 aria-hidden="true" />} label="Pop feedback on activation · standard" animate sizeVariant="standard" data-vt-library-component="StudioSquareIconButton" /><StudioSquareIconButton icon={<Settings2 aria-hidden="true" />} label="Pop feedback on activation · compact" animate sizeVariant="compact" data-vt-library-component="StudioSquareIconButton" /></div></section>
          <section className="vt-confirmed-square-effect-pair"><strong>NOTIFICATION BADGE · STATIC PREVIEW</strong><div className="vt-confirmed-square-effect-sizes"><StudioSquareIconButton icon={<Settings2 aria-hidden="true" />} label="Notifications · standard" effect="notification" badge={3} sizeVariant="standard" data-vt-library-component="StudioSquareIconButton" /><StudioSquareIconButton icon={<Settings2 aria-hidden="true" />} label="Notifications · compact" effect="notification" badge={3} sizeVariant="compact" data-vt-library-component="StudioSquareIconButton" /></div></section>
          <section className="vt-confirmed-square-effect-pair"><strong>ROTATED TOGGLE</strong><div className="vt-confirmed-square-effect-sizes"><StudioSquareIconButton icon={<Settings2 aria-hidden="true" />} label="Rotated toggle · standard" effect="rotated-toggle" defaultSelected sizeVariant="standard" data-vt-library-component="StudioSquareIconButton" /><StudioSquareIconButton icon={<Settings2 aria-hidden="true" />} label="Rotated toggle · compact" effect="rotated-toggle" defaultSelected sizeVariant="compact" data-vt-library-component="StudioSquareIconButton" /></div></section>
          <section className="vt-confirmed-square-effect-pair"><strong>3D FLIP</strong><div className="vt-confirmed-square-effect-sizes"><StudioSquareIconButton icon={<Settings2 aria-hidden="true" />} activeIcon={<Check aria-hidden="true" />} label="3D flip · standard" effect="flip" defaultSelected sizeVariant="standard" data-vt-library-component="StudioSquareIconButton" /><StudioSquareIconButton icon={<Settings2 aria-hidden="true" />} activeIcon={<Check aria-hidden="true" />} label="3D flip · compact" effect="flip" defaultSelected sizeVariant="compact" data-vt-library-component="StudioSquareIconButton" /></div></section>
          <section className="vt-confirmed-square-effect-pair"><strong>TOOLTIP</strong><div className="vt-confirmed-square-effect-sizes"><StudioSquareIconButton icon={<Settings2 aria-hidden="true" />} label="Tooltip · standard" effect="tooltip" tooltip="EDIT ITEM" sizeVariant="standard" data-vt-library-component="StudioSquareIconButton" /><StudioSquareIconButton icon={<Settings2 aria-hidden="true" />} label="Tooltip · compact" effect="tooltip" tooltip="EDIT ITEM" sizeVariant="compact" data-vt-library-component="StudioSquareIconButton" /></div></section>
          <section className="vt-confirmed-square-effect-pair"><strong>MORPH</strong><div className="vt-confirmed-square-effect-sizes"><StudioSquareIconButton icon={<Settings2 aria-hidden="true" />} activeIcon={<Sparkles aria-hidden="true" />} label="Morph · standard" effect="morph" defaultSelected sizeVariant="standard" data-vt-library-component="StudioSquareIconButton" /><StudioSquareIconButton icon={<Settings2 aria-hidden="true" />} activeIcon={<Sparkles aria-hidden="true" />} label="Morph · compact" effect="morph" defaultSelected sizeVariant="compact" data-vt-library-component="StudioSquareIconButton" /></div></section>
          <section className="vt-confirmed-square-effect-pair"><strong>SUCCESS STATE · STATIC PREVIEW</strong><div className="vt-confirmed-square-effect-sizes"><StudioSquareIconButton icon={<Settings2 aria-hidden="true" />} label="Success confirmation · standard" effect="success" success tooltip="SAVED" sizeVariant="standard" data-vt-library-component="StudioSquareIconButton" /><StudioSquareIconButton icon={<Settings2 aria-hidden="true" />} label="Success confirmation · compact" effect="success" success tooltip="SAVED" sizeVariant="compact" data-vt-library-component="StudioSquareIconButton" /></div></section>
          <section className="vt-confirmed-square-effect-pair"><strong>HEART POP · BLACK FILL + HEAVY RIPPLE</strong><div className="vt-confirmed-square-effect-sizes"><StudioSquareIconButton iconPreset="heart" label="Heart pop · standard" effect="heart-pop" sizeVariant="standard" data-vt-library-component="StudioSquareIconButton" /><StudioSquareIconButton iconPreset="heart" label="Heart pop · compact" effect="heart-pop" sizeVariant="compact" data-vt-library-component="StudioSquareIconButton" /></div></section>
          <section className="vt-confirmed-square-effect-pair"><strong>BELL RING · ALERT DOT + RIPPLE</strong><div className="vt-confirmed-square-effect-sizes"><StudioSquareIconButton iconPreset="bell" label="Bell ring · standard" effect="bell-ring" badge={3} sizeVariant="standard" data-vt-library-component="StudioSquareIconButton" /><StudioSquareIconButton iconPreset="bell" label="Bell ring · compact" effect="bell-ring" badge={3} sizeVariant="compact" data-vt-library-component="StudioSquareIconButton" /></div></section>
          <section className="vt-confirmed-square-effect-pair"><strong>SUN ↔ MOON · PERSISTENT TOGGLE</strong><div className="vt-confirmed-square-effect-sizes"><StudioSquareIconButton iconPreset="sun-moon" label="Sun / moon · standard" effect="sun-moon" sizeVariant="standard" data-vt-library-component="StudioSquareIconButton" /><StudioSquareIconButton iconPreset="sun-moon" label="Sun / moon · compact" effect="sun-moon" sizeVariant="compact" data-vt-library-component="StudioSquareIconButton" /></div></section>
          <section className="vt-confirmed-square-effect-pair"><strong>LOCK ↔ UNLOCK · SHACKLE ONLY</strong><div className="vt-confirmed-square-effect-sizes"><StudioSquareIconButton iconPreset="lock-unlock" label="Lock / unlock · standard" effect="lock-unlock" sizeVariant="standard" data-vt-library-component="StudioSquareIconButton" /><StudioSquareIconButton iconPreset="lock-unlock" label="Lock / unlock · compact" effect="lock-unlock" sizeVariant="compact" data-vt-library-component="StudioSquareIconButton" /></div></section>
          <section className="vt-confirmed-square-effect-pair"><strong>DOWNLOAD → CHECK · OUTCOME STATE</strong><div className="vt-confirmed-square-effect-sizes"><StudioSquareIconButton iconPreset="download-check" label="Download success · standard" effect="download-success" success tooltip="DOWNLOADED" sizeVariant="standard" data-vt-library-component="StudioSquareIconButton" /><StudioSquareIconButton iconPreset="download-check" label="Download success · compact" effect="download-success" success tooltip="DOWNLOADED" sizeVariant="compact" data-vt-library-component="StudioSquareIconButton" /></div></section>
          <section className="vt-confirmed-square-effect-pair"><strong>REFRESH · SPIN</strong><div className="vt-confirmed-square-effect-sizes"><StudioSquareIconButton iconPreset="refresh" label="Refresh spin · standard" effect="refresh" sizeVariant="standard" data-vt-library-component="StudioSquareIconButton" /><StudioSquareIconButton iconPreset="refresh" label="Refresh spin · compact" effect="refresh" sizeVariant="compact" data-vt-library-component="StudioSquareIconButton" /></div></section>
          <section className="vt-confirmed-square-effect-pair"><strong>LIKE · POP + LIVE COUNT</strong><div className="vt-confirmed-square-effect-sizes"><StudioSquareIconButton iconPreset="like" label="Like counter · standard" effect="like" badge={0} sizeVariant="standard" data-vt-library-component="StudioSquareIconButton" /><StudioSquareIconButton iconPreset="like" label="Like counter · compact" effect="like" badge={0} sizeVariant="compact" data-vt-library-component="StudioSquareIconButton" /></div></section>
        </div>
      </div>
      <div className="vt-confirmed-variant is-full-row">
        <span>CANONICAL ICON PRESETS · INTERACTIVE</span>
        <div className="vt-confirmed-square-variant-grid">
          {([
            { preset: "heart", label: "Heart" },
            { preset: "bell", label: "Bell" },
            { preset: "sun-moon", label: "Sun / moon" },
            { preset: "lock-unlock", label: "Lock / unlock" },
            { preset: "download-check", label: "Download / check" },
            { preset: "refresh", label: "Refresh" },
            { preset: "like", label: "Like" },
          ] as const).map(item => <StudioSquareIconButton key={item.preset} iconPreset={item.preset} label={item.label} variant="v3" sizeVariant="standard" data-vt-library-component="StudioSquareIconButton" />)}
        </div>
      </div>
      <div className="vt-confirmed-variant is-full-row">
        <span>HEART + STATE FEEDBACK · CLICK TO REPLAY</span>
        <div className="vt-confirmed-square-variant-grid">
          <StudioSquareIconButton iconPreset="heart" label="Heart pop ripple" effect="heart-pop" variant="v3" sizeVariant="standard" data-vt-library-component="StudioSquareIconButton" />
          <StudioSquareIconButton iconPreset="heart" label="Pop on activation" effect="pop-on-activation" variant="v3" sizeVariant="standard" data-vt-library-component="StudioSquareIconButton" />
          <StudioSquareIconButton iconPreset="lock-unlock" label="Unlock shackle" effect="unlock" variant="v3" sizeVariant="standard" data-vt-library-component="StudioSquareIconButton" />
          <StudioSquareIconButton iconPreset="heart" label="Heart activation" effect="pop-on-activation" variant="v3" animate sizeVariant="standard" data-vt-library-component="StudioSquareIconButton" />
          <StudioSquareIconButton iconPreset="bell" label="Bell ring" effect="bell-ring" variant="v3" sizeVariant="standard" data-vt-library-component="StudioSquareIconButton" />
          <StudioSquareIconButton iconPreset="like" label="Like feedback" effect="like" variant="v3" sizeVariant="standard" data-vt-library-component="StudioSquareIconButton" />
        </div>
      </div>
      <div className="vt-confirmed-variant is-full-row">
        <span>TRANSITIONS · CLICK TO TOGGLE</span>
        <div className="vt-confirmed-square-variant-grid">
          <StudioSquareIconButton iconPreset="sun-moon" label="Sun moon transition" effect="sun-moon" variant="v3" sizeVariant="standard" data-vt-library-component="StudioSquareIconButton" />
          <StudioSquareIconButton iconPreset="lock-unlock" label="Lock shackle transition" effect="lock-unlock" variant="v3" sizeVariant="standard" data-vt-library-component="StudioSquareIconButton" />
          <StudioSquareIconButton iconPreset="download-check" label="Download check transition" effect="download" variant="v3" sizeVariant="standard" data-vt-library-component="StudioSquareIconButton" />
          <StudioSquareIconButton iconPreset="download-check" label="Download success" effect="download-success" variant="v3" sizeVariant="standard" data-vt-library-component="StudioSquareIconButton" />
          <StudioSquareIconButton iconPreset="refresh" label="Refresh transition" effect="refresh" variant="v3" sizeVariant="standard" data-vt-library-component="StudioSquareIconButton" />
          <StudioSquareIconButton iconPreset="bell" label="Rotated toggle" effect="rotated-toggle" variant="v3" sizeVariant="standard" data-vt-library-component="StudioSquareIconButton" />
        </div>
      </div>
      <div className="vt-confirmed-variant is-full-row">
        <span>CONTEXT + OUTCOME EFFECTS</span>
        <div className="vt-confirmed-square-variant-grid">
          <StudioSquareIconButton icon={<Settings2 aria-hidden="true" />} activeIcon={<Check aria-hidden="true" />} label="3D flip" effect="flip" variant="v1" sizeVariant="standard" data-vt-library-component="StudioSquareIconButton" />
          <StudioSquareIconButton icon={<Settings2 aria-hidden="true" />} activeIcon={<Sparkles aria-hidden="true" />} label="Morph" effect="morph" variant="v2" sizeVariant="standard" data-vt-library-component="StudioSquareIconButton" />
          <StudioSquareIconButton iconPreset="bell" label="Notification count" effect="notification" badge={3} variant="v1" sizeVariant="standard" data-vt-library-component="StudioSquareIconButton" />
          <StudioSquareIconButton iconPreset="refresh" label="Tooltip label" effect="tooltip" tooltip="REFRESH ITEM" variant="v2" sizeVariant="standard" data-vt-library-component="StudioSquareIconButton" />
          <StudioSquareIconButton iconPreset="download-check" label="Success label" effect="success" success tooltip="SAVED" variant="v1" sizeVariant="standard" data-vt-library-component="StudioSquareIconButton" />
          <StudioSquareIconButton iconPreset="refresh" label="Standard icon button" effect="standard" variant="v4" sizeVariant="standard" data-vt-library-component="StudioSquareIconButton" />
        </div>
      </div>
      <div className="vt-confirmed-variant is-full-row">
        <span>COMPACT · PRESET AND EFFECT GEOMETRY</span>
        <div className="vt-confirmed-square-variant-grid">
          <StudioSquareIconButton iconPreset="heart" label="Compact heart ripple" effect="heart-pop" variant="v3" sizeVariant="compact" data-vt-library-component="StudioSquareIconButton" />
          <StudioSquareIconButton iconPreset="sun-moon" label="Compact sun moon" effect="sun-moon" variant="v3" sizeVariant="compact" data-vt-library-component="StudioSquareIconButton" />
          <StudioSquareIconButton iconPreset="lock-unlock" label="Compact lock unlock" effect="lock-unlock" variant="v3" sizeVariant="compact" data-vt-library-component="StudioSquareIconButton" />
          <StudioSquareIconButton iconPreset="download-check" label="Compact download success" effect="download-success" variant="v3" sizeVariant="compact" data-vt-library-component="StudioSquareIconButton" />
        </div>
      </div>

    </Family>
    <Family
      title="Split-left Button · Standard + Compact"
      nonDefaultSettings={[
        "Canonical split-left button with an independent leading icon rail and stationary outer shell.",
        "The two compact examples share one row and retain their individual accessible names.",
      ]}
      provenance={<Provenance primitive="StudioSplitLeftButton" tsx="src/studio-ui/primitives/StudioControls.tsx" css="src/styles/studio-control-system.css" tokens="44px standard / 28px compact · shared button palettes · square leading icon rail." imports={["src/studio-ui/primitives/StudioControls.tsx"]} />}
    >
      <div className="vt-confirmed-variant is-full-row">
        <span>44px standard · edit action</span>
        <StudioSplitLeftButton icon={<Settings2 aria-hidden="true" />} sizeVariant="standard" aria-label="Standard split-left edit action" data-vt-library-component="StudioSplitLeftButton">EDIT</StudioSplitLeftButton>
      </div>
      <div className="vt-confirmed-paired-compact-row">
        <div className="vt-confirmed-variant"><span>28px compact · edit action</span><StudioSplitLeftButton icon={<Settings2 aria-hidden="true" />} sizeVariant="compact" aria-label="Compact split-left edit action" data-vt-library-component="StudioSplitLeftButton">EDIT</StudioSplitLeftButton></div>
        <div className="vt-confirmed-variant"><span>28px compact · create action</span><StudioSplitLeftButton icon={<Sparkles aria-hidden="true" />} sizeVariant="compact" aria-label="Compact split-left create action" data-vt-library-component="StudioSplitLeftButton">CREATE</StudioSplitLeftButton></div>
      </div>
    </Family>
    <Family
      title="Play/Pause Split-left Button · 44px + 28px"
      nonDefaultSettings={[
        "Reserves label width so Play/Pause does not resize the control.",
        "Supports uncontrolled or parent-controlled playback state.",
      ]}
      provenance={<Provenance primitive="StudioPlayPauseButton" tsx="src/studio-ui/primitives/StudioControls.tsx" css="src/styles/studio-control-system.css" tokens="Canonical StudioSplitLeftButton composition; stable Play/Pause label geometry; selected-color swap; 44px / 28px sizes." imports={["src/studio-ui/primitives/StudioControls.tsx"]} />}
    >
      <div className="vt-confirmed-variant is-full-row">
        <span>44px standard · click to toggle Play / Pause</span>
        <StudioPlayPauseButton sizeVariant="standard" data-vt-library-component="StudioPlayPauseButton" />
      </div>
      <div className="vt-confirmed-paired-compact-row">
        <div className="vt-confirmed-variant"><span>28px compact · click to toggle</span><StudioPlayPauseButton sizeVariant="compact" data-vt-library-component="StudioPlayPauseButton" /></div>
        <div className="vt-confirmed-variant"><span>28px compact · starts selected</span><StudioPlayPauseButton sizeVariant="compact" defaultPlaying data-vt-library-component="StudioPlayPauseButton" /></div>
      </div>
    </Family>
    <Family
      title="Circle Icon Button · 44px + 28px"
      nonDefaultSettings={[
        "Circular shape uses 80% of the canonical large icon preset: 30.4px / 1.9 stroke standard and 19.2px / 2.0 compact.",
      ]}
      provenance={<Provenance primitive="StudioCircleIconButton" tsx="src/studio-ui/primitives/StudioControls.tsx" css="src/styles/studio-control-system.css" tokens="Circular shape wrapper over StudioSquareIconButton; shared V1–V4, sizing, effects, and accessibility contracts." imports={["src/studio-ui/primitives/StudioControls.tsx"]} />}
    >
      <div className="vt-confirmed-variant is-full-row">
        <span>44px standard · variants 1–4</span>
        <div className="vt-confirmed-square-variant-grid">
          <StudioCircleIconButton icon={<Settings2 aria-hidden="true" />} label="Circle icon button V1" variant="v1" sizeVariant="standard" data-vt-library-component="StudioCircleIconButton" />
          <StudioCircleIconButton icon={<Settings2 aria-hidden="true" />} label="Circle icon button V2" variant="v2" sizeVariant="standard" data-vt-library-component="StudioCircleIconButton" />
          <StudioCircleIconButton icon={<Sparkles aria-hidden="true" />} label="Circle icon button V3 toggle" variant="v3" sizeVariant="standard" data-vt-library-component="StudioCircleIconButton" />
          <StudioCircleIconButton icon={<Settings2 aria-hidden="true" />} label="Circle icon button V4" variant="v4" sizeVariant="standard" data-vt-library-component="StudioCircleIconButton" />
        </div>
      </div>
      <div className="vt-confirmed-variant is-full-row">
        <span>28px compact · variants 1–4</span>
        <div className="vt-confirmed-square-variant-grid">
          <StudioCircleIconButton icon={<Settings2 aria-hidden="true" />} label="Compact circle icon button V1" variant="v1" sizeVariant="compact" data-vt-library-component="StudioCircleIconButton" />
          <StudioCircleIconButton icon={<Settings2 aria-hidden="true" />} label="Compact circle icon button V2" variant="v2" sizeVariant="compact" data-vt-library-component="StudioCircleIconButton" />
          <StudioCircleIconButton icon={<Sparkles aria-hidden="true" />} label="Compact circle icon button V3 toggle" variant="v3" sizeVariant="compact" data-vt-library-component="StudioCircleIconButton" />
          <StudioCircleIconButton icon={<Settings2 aria-hidden="true" />} label="Compact circle icon button V4" variant="v4" sizeVariant="compact" data-vt-library-component="StudioCircleIconButton" />
        </div>
      </div>
      <div className="vt-confirmed-variant"><span>44px standard · disabled</span><StudioCircleIconButton icon={<Settings2 aria-hidden="true" />} label="Disabled circle icon button" variant="v1" sizeVariant="standard" disabled data-vt-library-component="StudioCircleIconButton" /></div>
    </Family>

    <Family
      title="Dropdown"
      nonDefaultSettings={[
        "Fixed floating label and multi-select count are dropdown-specific.",
        "Menu options are not button-press surfaces; the floating panel has its own stationary surface treatment.",
      ]}
      provenance={<Provenance
        primitive="StudioLegendMultiDropdown · 140"
        tsx="src/studio-ui/primitives/StudioControls.tsx"
        css="src/styles/studio-control-system.css"
        tokens="Fixed floating label; trigger value typography independent of label; 28px/18px chevrons; 44px/28px menu rows; no menu-option shadows or press motion."
        imports={["src/studio-ui/primitives/StudioControls.tsx"]}
      />}
    >
      <div className="vt-confirmed-variant is-full-row">
        <span>44px standard · selected values · multiselect trigger</span>
        <StudioLegendMultiDropdown
          label="dropdown"
          defaultValue={["videos", "shorts"]}
          options={[
            { value: "videos", label: "VIDEOS" },
            { value: "shorts", label: "SHORTS" },
            { value: "live", label: "LIVE" },
            { value: "playlists", label: "PLAYLISTS" },
            { value: "podcasts", label: "PODCASTS" },
            { value: "music", label: "MUSIC" },
            { value: "gaming", label: "GAMING" },
            { value: "news", label: "NEWS" },
            { value: "sports", label: "SPORTS" },
          ]}
        />
      </div>
      <div className="vt-confirmed-paired-compact-row">
        <div className="vt-confirmed-variant">
          <span>28px compact A · closed trigger and count</span>
          <StudioLegendMultiDropdown
            label="dropdown"
            sizeVariant="compact"
            placeholder="dropdown A"
            options={[
              { value: "default", label: "DEFAULT" },
              { value: "bold", label: "BOLD" },
              { value: "minimal", label: "MINIMAL" },
              { value: "cinematic", label: "CINEMATIC" },
              { value: "educational", label: "EDUCATIONAL" },
              { value: "documentary", label: "DOCUMENTARY" },
            ]}
          />
        </div>
        <div className="vt-confirmed-variant">
          <span>28px compact B · closed trigger and count</span>
          <StudioLegendMultiDropdown
            label="dropdown"
            sizeVariant="compact"
            placeholder="dropdown B"
            options={[
              { value: "tutorial", label: "TUTORIAL" },
              { value: "storytelling", label: "STORYTELLING" },
              { value: "review", label: "REVIEW" },
              { value: "commentary", label: "COMMENTARY" },
              { value: "shorts", label: "SHORTS" },
            ]}
          />
        </div>
      </div>
    </Family>
    <Family
      title="Global Rules Exceptions · Vault Spectrum Tags"
      nonDefaultSettings={[
        "Dense metadata exception: 15px height, spectrum-derived border/text, 35% color fill, and opt-in selected glow.",
      ]}
      provenance={<Provenance
        primitive="StudioSpectrumTag"
        tsx="src/studio-ui/primitives/StudioControls.tsx"
        css="src/styles/studio-control-system.css"
        tokens={`H ${STUDIO_CONTROL_GLOBAL_RULE_EXCEPTIONS.vaultSpectrumTag.height}px · border ${STUDIO_CONTROL_GLOBAL_RULE_EXCEPTIONS.vaultSpectrumTag.borderWidth}px · radius ${STUDIO_CONTROL_GLOBAL_RULE_EXCEPTIONS.vaultSpectrumTag.radius}px · ${STUDIO_CONTROL_GLOBAL_RULE_EXCEPTIONS.vaultSpectrumTag.fontSize}px / weight ${STUDIO_CONTROL_GLOBAL_RULE_EXCEPTIONS.vaultSpectrumTag.fontWeight} · fill 35% white mix`}
        imports={["src/components/subtoolbox/VaultAssetModule.tsx", "src/studio-ui/primitives/StudioControls.tsx"]}
      />}
    >
      <p className="vt-confirmed-defaults-summary">Intentional exception to global control geometry · exact Vault asset-module chip styling</p>
      <div className="vt-confirmed-variant is-full-row vt-confirmed-spectrum-tag-variant">
        <span>50 continuous alphabetical spectrum samples</span>
        <div className="vt-confirmed-spectrum-tag-grid">
          <StudioSpectrumTag label="AARDVARK" />
          <StudioSpectrumTag label="AZURE" />
          <StudioSpectrumTag label="BANANA" />
          <StudioSpectrumTag label="BLUEBELL" />
          <StudioSpectrumTag label="CANDY" />
          <StudioSpectrumTag label="CITRUS" />
          <StudioSpectrumTag label="DAFFODIL" />
          <StudioSpectrumTag label="DENIM" />
          <StudioSpectrumTag label="EBONY" />
          <StudioSpectrumTag label="EMERALD" />
          <StudioSpectrumTag label="FERN" />
          <StudioSpectrumTag label="FROST" />
          <StudioSpectrumTag label="GOLD" />
          <StudioSpectrumTag label="GREEN" />
          <StudioSpectrumTag label="HAZEL" />
          <StudioSpectrumTag label="HONEY" />
          <StudioSpectrumTag label="INDIGO" />
          <StudioSpectrumTag label="IVORY" />
          <StudioSpectrumTag label="JADE" />
          <StudioSpectrumTag label="JASMINE" />
          <StudioSpectrumTag label="KIWI" />
          <StudioSpectrumTag label="KUMQUAT" />
          <StudioSpectrumTag label="LAVENDER" />
          <StudioSpectrumTag label="LEMON" />
          <StudioSpectrumTag label="MAGENTA" />
          <StudioSpectrumTag label="MINT" />
          <StudioSpectrumTag label="NAVY" />
          <StudioSpectrumTag label="NEON" />
          <StudioSpectrumTag label="OPAL" />
          <StudioSpectrumTag label="ORANGE" />
          <StudioSpectrumTag label="PEACH" />
          <StudioSpectrumTag label="PERIWINKLE" />
          <StudioSpectrumTag label="QUARTZ" />
          <StudioSpectrumTag label="QUINCE" />
          <StudioSpectrumTag label="ROSE" />
          <StudioSpectrumTag label="RUBY" />
          <StudioSpectrumTag label="SAPPHIRE" />
          <StudioSpectrumTag label="SCARLET" />
          <StudioSpectrumTag label="TEAL" />
          <StudioSpectrumTag label="TURQUOISE" />
          <StudioSpectrumTag label="ULTRAMARINE" />
          <StudioSpectrumTag label="UMBER" />
          <StudioSpectrumTag label="VIOLET" />
          <StudioSpectrumTag label="VIRIDIAN" />
          <StudioSpectrumTag label="WALNUT" />
          <StudioSpectrumTag label="WHITE" />
          <StudioSpectrumTag label="XANTHAN" />
          <StudioSpectrumTag label="XENON" />
          <StudioSpectrumTag label="YELLOW" />
          <StudioSpectrumTag label="ZUCCHINI" />
        </div>
        <div className="vt-confirmed-spectrum-tag-selected">
          <span>Selected-state treatment</span>
          <StudioSpectrumTag label="DESIGN" selected />
        </div>
      </div>
    </Family>
    <Family
      title="Global Rules Exceptions · Closeable Badge + Tag Editor"
      nonDefaultSettings={[
        "Closeable badge exception: 20px pill with 16px label and a secondary-pair close affordance.",
        "Tag-editor action geometry must match the registered exception in the production token/CSS contract.",
      ]}
      provenance={<Provenance
        primitive="StudioCloseableBadge / StudioTagEditor"
        tsx="src/studio-ui/primitives/StudioControls.tsx"
        css="src/styles/studio-control-system.css"
        tokens={`Closeable badge H 20px · full pill · no border · 16px type · primary color mixed 50% with white · action H ${STUDIO_CONTROL_GLOBAL_RULE_EXCEPTIONS.tagEditorAction.height}px / stroke ${STUDIO_CONTROL_GLOBAL_RULE_EXCEPTIONS.tagEditorAction.stroke}px / radius ${STUDIO_CONTROL_GLOBAL_RULE_EXCEPTIONS.tagEditorAction.radius}px`}
        imports={["src/studio-ui/primitives/StudioControls.tsx"]}
      />}
    >
      <div className="vt-confirmed-variant is-full-row vt-confirmed-tag-editor-variant">
        <span>Closeable badge · enter, close-swap, and fade animations</span>
        <div className="vt-confirmed-tag-editor-badge-row">
          <StudioCloseableBadge label="Tag One" />
          <StudioCloseableBadge label="Featured" />
          <StudioCloseableBadge label="Live" />
        </div>
        <span>Interactive Tag Editor · add, confirm, fly, and remove</span>
        <StudioTagEditor defaultValue={["Tag One", "Featured"]} />
      </div>
    </Family>
    <Family
      title="Upload Frame · Standard + Compact"
      nonDefaultSettings={[
        "Canvas component uses a 16:9 frame at every breakpoint.",
        "Conic border, breathing layers, and image preview derive their colors from the active primary/secondary pair.",
        "Native file picker, drag/drop, disabled state, image preview, and reduced-motion behavior are supported.",
      ]}
      provenance={<Provenance primitive="StudioUploadFrame" tsx="src/studio-ui/primitives/StudioControls.tsx" css="src/styles/studio-control-system.css" tokens="Full-row canvas · pair A/B gradients · 16:9 ratio" imports={["src/studio-ui/primitives/StudioControls.tsx"]} />}
    >
      <div className="vt-confirmed-variant is-full-row" data-vt-library-component="StudioUploadFrame">
        <span>Standard · default upload frame</span>
        <StudioUploadFrame aria-label="Standard upload frame example" />
        <span>Compact · image upload</span>
        <StudioUploadFrame sizeVariant="compact" accept="image/*" aria-label="Compact image upload example" />
      </div>
    </Family>
    <Family
      title="Simple Dropdown · Single Selection"
      nonDefaultSettings={[
        "Single-selection menu without checkbox rows, multi-select behavior, or a top-left label.",
      ]}
      provenance={<Provenance primitive="StudioSimpleDropdown" tsx="src/studio-ui/primitives/StudioControls.tsx" css="src/styles/studio-control-system.css" tokens="Studio Controls standard/compact sizes, Inter 1000 uppercase, inherited palette pair" imports={["src/studio-ui/primitives/StudioControls.tsx"]} />}
    >
      <div className="vt-confirmed-variant is-full-row">
        <span>Standard · single select</span>
        <StudioSimpleDropdown aria-label="Example simple dropdown" defaultValue="balanced" options={[{ value: "light", label: "Light" }, { value: "balanced", label: "Balanced" }, { value: "aggressive", label: "Aggressive" }]} />
        <span>Single select · three-set choice</span>
        <StudioSimpleDropdown aria-label="Example three-set dropdown" defaultValue="three" options={[{ value: "one", label: "One set" }, { value: "three", label: "Three sets" }, { value: "five", label: "Five sets" }]} />
      </div>
    </Family>
    <Family
      title="Split-left Dropdown · Fixed Chevron Rail"
      nonDefaultSettings={[
        "Single-select dropdown with a fixed square leading rail and chevron.",
        "All dropdown variants use fixed side-aligned chevrons: 38px icon in the 44px standard rail and 24px icon in the 28px compact rail.",
        "Menu options inherit the canonical 44px / 28px row heights and 3px / 2px divider strokes.",
      ]}
      provenance={<Provenance primitive="StudioSplitLeftDropdown / StudioDropdown / StudioSimpleDropdown" tsx="src/studio-ui/primitives/StudioControls.tsx" css="src/styles/studio-control-system.css" tokens="44px standard / 28px compact · fixed square chevron rails · consistent menu row ratio" imports={["src/studio-ui/primitives/StudioControls.tsx"]} />}
    >
      <div className="vt-confirmed-variant is-full-row" data-vt-library-component="StudioSplitLeftDropdown">
        <span>Standard · split-left chevron</span>
        <StudioSplitLeftDropdown aria-label="Split-left dropdown example" defaultValue="balanced" options={[{ value: "light", label: "Light" }, { value: "balanced", label: "Balanced" }, { value: "aggressive", label: "Aggressive" }]} />
        <span>Compact · split-left chevron</span>
        <StudioSplitLeftDropdown aria-label="Compact split-left dropdown example" sizeVariant="compact" defaultValue="three" options={[{ value: "one", label: "One set" }, { value: "three", label: "Three sets" }, { value: "five", label: "Five sets" }]} />
        <span>Simple dropdown · fixed trailing chevron</span>
        <StudioSimpleDropdown aria-label="Fixed trailing chevron example" sizeVariant="compact" defaultValue="balanced" options={[{ value: "balanced", label: "Balanced" }, { value: "focused", label: "Focused" }]} />
      </div>
    </Family>
    <Family
      title="Publishing Card · 5:7 Compound Composition"
      nonDefaultSettings={[
        "Composition built from canonical Studio Controls primitives; it is a composition, not a new primitive family.",
        "Outer shell maintains a 5:7 ratio with a black 3px border, 6px radius, and 25% secondary-pair fill.",
        "Includes standard, compact, and micro density variants; micro uses the canonical compact textarea because Studio textareas do not define a micro tier.",
        "Includes fixed-label title and description, a 16:9 image upload frame, removable tags, and Playlist / Category / Location / Publish Date selectors.",
        "Uses active primary/secondary pair styling and canonical upload and tag components; composition-specific responsive layout is owned by studio-publishing-card.css.",
      ]}
      provenance={<Provenance primitive="StudioPublishingCard composition" tsx="src/studio-ui/compositions/StudioPublishingCard.tsx" css="src/styles/studio-publishing-card.css" tokens="5:7 shell · standard 44px / compact 28px / micro 12px control tiers · 16:9 thumbnail · 25% secondary fill · size-matched black border/radius · primary inset + secondary outline" imports={["src/studio-ui/compositions/StudioPublishingCard.tsx", "src/studio-ui/primitives/StudioControls.tsx"]} />}
    >
      <div className="vt-confirmed-variant is-full-row" data-vt-library-component="StudioPublishingCard">
        {([
          { size: "standard" as const, label: "Standard · 44px controls" },
          { size: "compact" as const, label: "Compact · 28px controls" },
          { size: "micro" as const, label: "Micro · 12px controls (textarea uses canonical compact tier)" },
        ]).map(({ size, label }) => <div className="vt-confirmed-publishing-card-specimen" key={size} data-publishing-card-size={size}>
          <span>{label}</span>
          <div style={{ width: "min(100%, 360px)", marginInline: "auto" }}>
            <StudioPublishingCard
              sizeVariant={size}
              title="NEW VIDEO"
              description="A short description of the video and what viewers can expect."
              playlistOptions={[{ value: "featured", label: "FEATURED" }, { value: "gameplay", label: "GAMEPLAY" }, { value: "tutorial", label: "TUTORIAL" }]}
              categoryOptions={[{ value: "gaming", label: "GAMING" }, { value: "education", label: "EDUCATION" }, { value: "entertainment", label: "ENTERTAINMENT" }]}
              locationOptions={[{ value: "youtube", label: "YOUTUBE" }, { value: "shorts", label: "SHORTS" }, { value: "community", label: "COMMUNITY" }]}
              publishDateOptions={[{ value: "2026-10-21", label: "10/21/2026" }, { value: "2026-10-22", label: "10/22/2026" }]}
            />
          </div>
        </div>)}
      </div>
    </Family>
    <ConfirmedStudioValueToggleFamily />
    <ConfirmedStudioCounterFamily />
    <ConfirmedStudioDoubleSplitSliderFamily />
    <ConfirmedStudioSideCounterFamily />
    <Family
      title="Split Accordion · Standard + Compact + Micro"
      nonDefaultSettings={[
        "Independent primitive; it does not import or wrap the retired split-rail accordion.",
        "Horizontal single-open panels with square icon faces and left, right, or double split layouts.",
        "Defaults to the rightmost enabled item; supports keyboard navigation and a 280ms preview lock.",
        "Flat Studio Control geometry and reduced-motion styling.",
      ]}
      provenance={<Provenance primitive="StudioSplitAccordion" tsx="src/studio-ui/primitives/StudioSplitAccordion.tsx" css="src/styles/studio-split-accordion.css" tokens="44px / 28px / 12px · square faces · 280ms panel tween · left/right/double layouts" imports={["src/studio-ui/primitives/StudioSplitAccordion.tsx", "src/styles/studio-split-accordion.css"]} />}
    >
      <div className="vt-confirmed-variant is-full-row" data-vt-library-component="StudioSplitAccordion">
        {(["standard", "compact", "micro"] as const).map((size) => (
          <div key={size} style={{ display: "grid", gap: 4, marginBlock: 4 }}>
            <span>{size.toUpperCase()} · SPLIT ACCORDION</span>
            <StudioSplitAccordion
              sizeVariant={size}
              accessibleLabel={`Confirmed primitive Split Accordion ${size}`}
              items={[
                { id: "overview", accessibleLabel: "Overview", icon: <span>⌂</span>, content: "OVERVIEW" },
                { id: "details", accessibleLabel: "Details", icon: <span>◈</span>, content: "DETAILS" },
                { id: "settings", accessibleLabel: "Settings", icon: <span>⚙</span>, content: "SETTINGS" },
              ]}
            />
          </div>
        ))}
        <StudioSplitAccordion
          layout="double"
          defaultActiveIndex={1}
          accessibleLabel="Double split accordion example"
          items={[
            { id: "left", accessibleLabel: "Left", icon: <span>◀</span>, content: "LEFT" },
            { id: "center", accessibleLabel: "Center", icon: <span>◆</span>, content: "CENTER" },
            { id: "right", accessibleLabel: "Right", icon: <span>▶</span>, content: "RIGHT" },
          ]}
        />
      </div>
    </Family>
    <Family
      title="Brain Status LED Badges"
      nonDefaultSettings={[
        "Borderless status badge with a smaller saturated LED to the left of the label.",
        "Dark variant: black fill and white text; tinted variant: light fill matching the LED hue and black text.",
        "Six LED tones with a slow expanding/fading circular ripple; reduced-motion disables the ripple.",
        "Status text must reflect the owning workflow state; these specimens are visual examples, not live telemetry.",
      ]}
      provenance={<Provenance primitive="StudioBrainStatusBadge" tsx="src/studio-ui/primitives/StudioControls.tsx" css="src/styles/studio-control-system.css" tokens="24px / 20px / 12px badge tiers · 10px / 8px / 5px LED core · black/tinted fill variants · 8s ripple cycle" imports={["src/studio-ui/primitives/StudioControls.tsx", "src/components/studio-hub/StudioHubConfirmedPrimitiveCatalog.tsx"]} />}
    >
      <div className="vt-confirmed-variant is-full-row" data-vt-library-component="StudioBrainStatusBadge">
        <span>STANDARD · DARK FILL / WHITE TEXT</span>
        <div className="vt-catalog-brain-status-badges__group">
          <StudioBrainStatusBadge label="READY" tone="green" appearance="dark" sizeVariant="standard" />
          <StudioBrainStatusBadge label="THINKING" tone="cyan" appearance="dark" sizeVariant="standard" />
          <StudioBrainStatusBadge label="LEARNING" tone="purple" appearance="dark" sizeVariant="standard" />
        </div>
        <span>STANDARD · MATCHING LIGHT FILL / BLACK TEXT</span>
        <div className="vt-catalog-brain-status-badges__group">
          <StudioBrainStatusBadge label="REVIEW" tone="yellow" appearance="tinted" sizeVariant="standard" />
          <StudioBrainStatusBadge label="BLOCKED" tone="red" appearance="tinted" sizeVariant="standard" />
          <StudioBrainStatusBadge label="SYNCED" tone="blue" appearance="tinted" sizeVariant="standard" />
        </div>
        <span>COMPACT + MICRO</span>
        <div className="vt-catalog-brain-status-badges__group">
          <StudioBrainStatusBadge label="ACTIVE" tone="green" appearance="dark" sizeVariant="compact" />
          <StudioBrainStatusBadge label="QUEUED" tone="cyan" appearance="dark" sizeVariant="compact" />
          <StudioBrainStatusBadge label="PAUSED" tone="yellow" appearance="tinted" sizeVariant="compact" />
          <StudioBrainStatusBadge label="IDLE" tone="purple" appearance="tinted" sizeVariant="micro" />
          <StudioBrainStatusBadge label="ERROR" tone="red" appearance="dark" sizeVariant="micro" />
          <StudioBrainStatusBadge label="SYNC" tone="blue" appearance="tinted" sizeVariant="micro" />
        </div>
      </div>
    </Family>
  </div>
)


const ConfirmedStudioValueToggleFamily: React.FC = () => {
  const [arrow, setArrow] = React.useState("ONE")
  const [side, setSide] = React.useState("LOW")
  const [left, setLeft] = React.useState("SOURCE")
  const [right, setRight] = React.useState("TARGET")
  const [level, setLevel] = React.useState(50)
  const options = ["ONE", "TWO", "THREE"] as const
  return (
    <Family title="Arrow / Side / Double Side / Bar Toggles" nonDefaultSettings={[
      "Four production primitives share Studio Controls tokens and controlled selection/value APIs.",
      "Arrow Toggle supports configurable text, fill, text color, icon color, and icon fill.",
      "Side Toggle defaults to right-side up/down arrows; its left-side variant is also shown.",
      "Double Side Toggle demonstrates independent left/right values and the V1–V4 divider/width variants.",
      "Bar Toggle uses ten fixed-width bars, each representing 10 percentage points, with press-and-hold arrow controls.",
    ]} provenance={<Provenance primitive="StudioArrowToggle · StudioSideToggle · StudioDoubleSideToggle · StudioBarToggle" tsx="src/studio-ui/primitives/StudioValueToggles.tsx" css="src/styles/studio-control-system.css" tokens="Studio size lattice · semantic primary/secondary colors · ten 18×38px standard bars" imports={["src/studio-ui/primitives/StudioValueToggles.tsx", "src/styles/studio-control-system.css", "src/studio-ui/primitives/StudioControls.tsx"]} />}>
      <div className="vt-confirmed-variant is-full-row" data-vt-library-component="StudioArrowToggle">
        <span>ARROW TOGGLE · STANDARD</span>
        <StudioArrowToggle value={arrow} options={options} onValueChange={setArrow} ariaLabel="Arrow toggle specimen" appearance={{ fillColor: "color-mix(in srgb, var(--pair-a, #36e0f6) 50%, transparent)", textColor: "#000", iconColor: "#000", iconFillColor: "transparent" }} />
        <span>SIDE TOGGLE · DEFAULT RIGHT / V2 LEFT</span>
        <div style={{ display: "grid", gap: 4 }}>
          <StudioSideToggle value={side} options={["LOW", "MID", "HIGH"]} onValueChange={setSide} />
          <StudioSideToggle value={side} options={["LOW", "MID", "HIGH"]} onValueChange={setSide} arrowSide="left" size="compact" />
        </div>
        <span>DOUBLE SIDE TOGGLE · V1–V4</span>
        <div style={{ display: "grid", gap: 4 }}>
          {(["default", "v2", "v3", "v4"] as const).map(variant => <StudioDoubleSideToggle key={variant} variant={variant}
            left={{ value: left, options: ["SOURCE", "INPUT", "ORIGIN"], onValueChange: setLeft, ariaLabel: "Left side selection" }}
            right={{ value: right, options: ["TARGET", "OUTPUT", "DESTINATION"], onValueChange: setRight, ariaLabel: "Right side selection" }} />)}
        </div>
        <span>BAR TOGGLE · {level}%</span>
        <StudioBarToggle value={level} onValueChange={setLevel} ariaLabel="Bar toggle specimen" />
        <span>COMPACT SPECIMENS</span>
        <div style={{ display: "grid", gap: 4 }}>
          <StudioArrowToggle size="compact" value={arrow} options={options} onValueChange={setArrow} />
          <StudioSideToggle size="compact" value={side} options={["LOW", "MID", "HIGH"]} onValueChange={setSide} />
          <StudioBarToggle size="compact" value={level} onValueChange={setLevel} />
        </div>
      </div>
    </Family>
  )
}

export default StudioHubConfirmedPrimitiveCatalog