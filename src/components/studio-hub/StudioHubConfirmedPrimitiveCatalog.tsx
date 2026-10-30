import React from "react"
import { Bell, Check, Heart, Settings2, Sparkles } from "lucide-react"
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
  StudioUsernameInput,
  StudioSwitch,
  StudioTextArea,
  StudioTextInput,
  StudioWordToggle,
  StudioSpectrumTag,
  StudioCloseableBadge,
  StudioTagEditor,
  StudioSimpleDropdown,
  StudioSplitLeftDropdown,
  StudioUploadFrame,
  StudioTextBox,
  StudioVerticalWordToggle,
  StudioSquareIconButtonGroup,
  StudioSplitAccordion,
  StudioArrowToggle,
  StudioSideToggle,
  StudioDoubleSideToggle,
  StudioBarToggle,
  StudioDoubleSplitWordCounter,
  StudioLeftWordCounter,
  STUDIO_CONTROL_GLOBAL_RULE_EXCEPTIONS,
} from "../../studio-ui/primitives/StudioControls"
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
const CanonicalControlFamilies: React.FC = () => {
  const [switches, setSwitches] = React.useState<boolean[]>(Array(40).fill(false))
  const [choices, setChoices] = React.useState<boolean[]>(Array(60).fill(false))
  const [words, setWords] = React.useState<boolean[]>(Array(8).fill(false))
  const flip = (setter: React.Dispatch<React.SetStateAction<boolean[]>>, index: number, value?: boolean) => setter(current => current.map((old, i) => i === index ? (value ?? !old) : old))
  return <>
    <Family title="Choice Controls · Shared Four-Variant System" nonDefaultSettings={[
        "Switches, radios, checkmark checkboxes, and X checkboxes share the V1–V4 palette contract.",
        "Each example remains independently interactive and uses the canonical primitive with its native accessible label.",
      ]} provenance={<Provenance primitive="StudioSwitch / StudioRadio / StudioCheckbox / StudioXCheckbox" tsx="src/studio-ui/primitives/StudioControls.tsx" css="src/styles/studio-control-system.css" tokens="Shared V1 primary/secondary · V2 color swap · V3 white indicator · V4 black indicator." imports={["src/studio-ui/primitives/StudioControls.tsx"]} />}>
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
        <div className="vt-confirmed-size-examples" aria-label="Switch size examples">
          <div className="vt-confirmed-size-standard"><StudioSwitch sizeVariant="standard" checked={switches[12]} aria-label="Standard switch" onClick={() => flip(setSwitches, 12)}/></div>
          <div className="vt-confirmed-size-compact"><StudioSwitch sizeVariant="compact" checked={switches[13]} aria-label="Compact switch one" onClick={() => flip(setSwitches, 13)}/><StudioSwitch sizeVariant="compact" checked={switches[14]} aria-label="Compact switch two" onClick={() => flip(setSwitches, 14)}/></div>
          <div className="vt-confirmed-size-micro"><StudioSwitch sizeVariant="micro" checked={switches[15]} aria-label="Micro switch one" onClick={() => flip(setSwitches, 15)}/><StudioSwitch sizeVariant="micro" checked={switches[16]} aria-label="Micro switch two" onClick={() => flip(setSwitches, 16)}/><StudioSwitch sizeVariant="micro" checked={switches[17]} aria-label="Micro switch three" onClick={() => flip(setSwitches, 17)}/><StudioSwitch sizeVariant="micro" checked={switches[18]} aria-label="Micro switch four" onClick={() => flip(setSwitches, 18)}/></div>
        </div>
        <div className="vt-confirmed-size-examples" aria-label="Radio size examples">
          <div className="vt-confirmed-size-standard"><StudioRadio sizeVariant="standard" checked={choices[12]} aria-label="Standard radio" onClick={() => flip(setChoices, 12)}/></div>
          <div className="vt-confirmed-size-compact"><StudioRadio sizeVariant="compact" checked={choices[13]} aria-label="Compact radio one" onClick={() => flip(setChoices, 13)}/><StudioRadio sizeVariant="compact" checked={choices[14]} aria-label="Compact radio two" onClick={() => flip(setChoices, 14)}/></div>
          <div className="vt-confirmed-size-micro"><StudioRadio sizeVariant="micro" checked={choices[15]} aria-label="Micro radio one" onClick={() => flip(setChoices, 15)}/><StudioRadio sizeVariant="micro" checked={choices[16]} aria-label="Micro radio two" onClick={() => flip(setChoices, 16)}/><StudioRadio sizeVariant="micro" checked={choices[17]} aria-label="Micro radio three" onClick={() => flip(setChoices, 17)}/><StudioRadio sizeVariant="micro" checked={choices[18]} aria-label="Micro radio four" onClick={() => flip(setChoices, 18)}/></div>
        </div>
        <div className="vt-confirmed-size-examples" aria-label="Checkbox size examples">
          <div className="vt-confirmed-size-standard"><StudioCheckbox sizeVariant="standard" checked={choices[24]} aria-label="Standard checkbox" onClick={() => flip(setChoices, 24)}/></div>
          <div className="vt-confirmed-size-compact"><StudioCheckbox sizeVariant="compact" checked={choices[25]} aria-label="Compact checkbox one" onClick={() => flip(setChoices, 25)}/><StudioCheckbox sizeVariant="compact" checked={choices[26]} aria-label="Compact checkbox two" onClick={() => flip(setChoices, 26)}/></div>
          <div className="vt-confirmed-size-micro"><StudioCheckbox sizeVariant="micro" checked={choices[27]} aria-label="Micro checkbox one" onClick={() => flip(setChoices, 27)}/><StudioCheckbox sizeVariant="micro" checked={choices[28]} aria-label="Micro checkbox two" onClick={() => flip(setChoices, 28)}/><StudioCheckbox sizeVariant="micro" checked={choices[29]} aria-label="Micro checkbox three" onClick={() => flip(setChoices, 29)}/><StudioCheckbox sizeVariant="micro" checked={choices[30]} aria-label="Micro checkbox four" onClick={() => flip(setChoices, 30)}/></div>
        </div>
      </div>
    </Family>
    <Family title="Word Toggle · Standard + Compact" nonDefaultSettings={[
        "Standard examples use one full-width toggle per row; compact examples use two per row.",
      ]} provenance={<Provenance primitive="StudioWordToggle" tsx="src/studio-ui/primitives/StudioControls.tsx" css="src/styles/studio-control-system.css" tokens="44px standard / 28px compact · V1–V4 palette contract shared with choice controls." imports={["src/studio-ui/primitives/StudioControls.tsx"]} />}>
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
    </Family>
    <Family
      title="Split-left Badge · Standard + Compact + Micro"
      nonDefaultSettings={[
        "Informational split-left badge, not an action button.",
        "Badge-only micro exception: 14px height, 1px stroke, 2px radius, and 10px type/icons; it is not an interactive-control size.",
      ]}
      provenance={<Provenance
        primitive="StudioSplitLeftBadge"
        tsx="src/studio-ui/primitives/StudioControls.tsx"
        css="src/styles/studio-control-system.css"
        tokens="44px standard / 28px compact / 14px micro · 4px all-side spacing unit · centered labels · no shadows or transitions"
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

const Family: React.FC<{ title: string; children: React.ReactNode; provenance: React.ReactNode; nonDefaultSettings?: string[]; className?: string }> = ({ title, children, provenance, nonDefaultSettings = [], className }) => {
  const representative = className?.split(/\s+/).includes("vt-confirmed-representatives") ?? false
  const headingId = representative ? "vt-confirmed-representatives-title" : undefined
  return (
  <section className={[`vt-confirmed-family ${title === "Button" || title === "Split-left" ? "vt-confirmed-button-family" : ""}`, className].filter(Boolean).join(" ")} aria-labelledby={headingId}>
    <h3 id={headingId} title={title}>{title}</h3>
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
}

// The size matrix is deliberately label-free: one standard specimen, two compact,
// and four micro specimens remain visually adjacent as a single primitive family.
const compact = (child: React.ReactNode, key: React.Key) => (
  <div className="vt-confirmed-size-matrix__item" key={key}>{child}</div>
)
const micro = (child: React.ReactNode, key: React.Key) => (
  <div className="vt-confirmed-size-matrix__item" key={key}>{child}</div>
)
const SizeMatrix: React.FC<{
  label: string
  standard: React.ReactNode
  compact: React.ReactNode[]
  micro: React.ReactNode[]
}> = ({ label, standard, compact: compactItems, micro: microItems }) => (
  <div className="vt-confirmed-size-matrix" role="group" aria-label={label}>
    <div className="vt-confirmed-size-matrix__standard">{standard}</div>
    <div className="vt-confirmed-size-matrix__compact">{compactItems}</div>
    <div className="vt-confirmed-size-matrix__micro">{microItems}</div>
  </div>
)

const StudioPrimitiveRepresentatives: React.FC = () => (
  <Family
    title="Representatives · Production Primitives"
    className="vt-confirmed-representatives"
    nonDefaultSettings={[
      "Curated overview of real exported production components; detailed family behavior and size specimens remain in their own modules below.",
      "All examples use the canonical primitive exports, not mock replicas or inverse-color counter/slider variants.",
    ]}
    provenance={<Provenance primitive="Studio UI production exports" tsx="src/studio-ui/primitives/StudioControls.tsx" css="src/styles/studio-control-system.css" tokens="Canonical token-driven defaults and shared focus/split foundations." imports={["src/studio-ui/index.ts"]} />}
  >
    <div className="vt-confirmed-variant is-full-row">
      <span>PRIMARY ACTION</span>
      <StudioButton sizeVariant="standard">CREATE</StudioButton>
    </div>
    <div className="vt-confirmed-variant is-full-row">
      <span>TEXT ENTRY</span>
      <StudioTextInput sizeVariant="standard" aria-label="Representative text input" placeholder="TYPE HERE" />
    </div>
    <div className="vt-confirmed-variant is-full-row">
      <span>TEXT DISPLAY</span>
      <StudioTextBox size="standard">READ-ONLY TEXT BOX</StudioTextBox>
    </div>
    <div className="vt-confirmed-variant is-full-row">
      <span>COUNTER</span>
      <StudioCounter value={12} onValueChange={() => {}} size="standard" min={0} max={100} ariaLabel="Representative counter" />
    </div>
    <div className="vt-confirmed-variant is-full-row">
      <span>SPLIT ACTION</span>
      <StudioSplitLeftButton icon={<Settings2 aria-hidden="true" />} sizeVariant="standard" aria-label="Representative split action">SETTINGS</StudioSplitLeftButton>
    </div>
  </Family>
)

const RestoredPrimitiveShowcase: React.FC = () => {
  const [verticalValue, setVerticalValue] = React.useState(false)
  const [groupSelection, setGroupSelection] = React.useState<Record<"standard" | "compact" | "micro", boolean[]>>({
    standard: [false, false, false, false, false],
    compact: [false, false, false, false, false],
    micro: [false, false, false, false, false],
  })
  const [leftWord, setLeftWord] = React.useState(2)
  const [arrowWord, setArrowWord] = React.useState("TWO")
  const [sideWord, setSideWord] = React.useState("MID")
  const [rightWord, setRightWord] = React.useState("HIGH")
  const [barValue, setBarValue] = React.useState(55)
  const [doubleWord, setDoubleWord] = React.useState(2)
  const accordionItems = [
    { id: "overview", accessibleLabel: "Overview", icon: <Settings2 aria-hidden="true" />, content: <strong>OVERVIEW PANEL</strong> },
    { id: "activity", accessibleLabel: "Activity", icon: <Check aria-hidden="true" />, content: <strong>ACTIVITY PANEL</strong> },
    { id: "insights", accessibleLabel: "Insights", icon: <Sparkles aria-hidden="true" />, content: <strong>INSIGHTS PANEL</strong> },
  ]
  const squareButtonItems = (sizeVariant: "standard" | "compact" | "micro") => [
    { icon: <Settings2 aria-hidden="true" />, label: "Settings" },
    { icon: <Check aria-hidden="true" />, label: "Confirm" },
    { icon: <Sparkles aria-hidden="true" />, label: "Generate" },
    { icon: <Heart aria-hidden="true" />, label: "Favorite" },
    { icon: <Bell aria-hidden="true" />, label: "Notifications" },
  ].map((item, index) => (
    <StudioSquareIconButton
      key={item.label}
      icon={item.icon}
      label={item.label}
      variant="v1"
      sizeVariant={sizeVariant}
      selected={groupSelection[sizeVariant][index]}
      onSelectedChange={(selected) => setGroupSelection(current => ({
        ...current,
        [sizeVariant]: current[sizeVariant].map((value, itemIndex) => itemIndex === index ? selected : value),
      }))}
      data-vt-library-component="StudioSquareIconButton"
    />
  ))
  const squareButtons = (sizeVariant: "compact" | "micro", index: number) => (
    <StudioSquareIconButtonGroup sizeVariant={sizeVariant} aria-label={sizeVariant + " action group " + (index + 1)}>
      {squareButtonItems(sizeVariant)}
    </StudioSquareIconButtonGroup>
  )
  return <>
    <Family title="Vertical Word Toggle · Standard / Compact / Micro" nonDefaultSettings={[
      "Original two-word vertical layout and animated primary/secondary handle are retained.",
      "Focused word color and handle color share the canonical 500ms fade; reduced motion disables the handle animation.",
    ]} provenance={<Provenance primitive="StudioVerticalWordToggle" tsx="src/studio-ui/primitives/StudioControls.tsx" css="src/styles/studio-control-restored-primitives.css" tokens="60 / 44 / 28 / 20 / 12px size tiers; shared secondary focus outline." imports={["src/studio-ui/primitives/StudioControls.tsx"]} />}>
      <SizeMatrix label="Vertical word toggle size examples"
        standard={<StudioVerticalWordToggle value={verticalValue} onValueChange={setVerticalValue} sizeVariant="standard" words={["WRITE", "CREATE"]} aria-label="Standard vertical word toggle" />}
        compact={[0,1].map(i => compact(<StudioVerticalWordToggle value={verticalValue} onValueChange={setVerticalValue} sizeVariant="compact" words={["WRITE", "CREATE"]} aria-label={"Compact vertical word toggle " + (i+1)} />, "compact-"+i))}
        micro={[0,1,2,3].map(i => micro(<StudioVerticalWordToggle value={verticalValue} onValueChange={setVerticalValue} sizeVariant="micro" words={["OFF", "ON"]} aria-label={"Micro vertical word toggle " + (i+1)} />, "micro-"+i))} />
    </Family>
    <Family title="Square Icon Button Group · Five Primary Squares" nonDefaultSettings={[
      "All five squares begin with primary fill. Selecting a square changes only that square to the secondary fill; each selection is independent.",
      "The group is a single auto-width toolbar and inherits the selected Studio size tier.",
    ]} provenance={<Provenance primitive="StudioSquareIconButtonGroup / StudioSquareIconButton" tsx="src/studio-ui/primitives/StudioControls.tsx" css="src/styles/studio-control-restored-primitives.css" tokens="Five 1:1 squares; primary resting fill; secondary selected fill; black shared dividers." imports={["src/studio-ui/primitives/StudioControls.tsx"]} />}>
      <SizeMatrix label="Square icon button group size examples"
        standard={<StudioSquareIconButtonGroup sizeVariant="standard" aria-label="standard action group">{squareButtonItems("standard")}</StudioSquareIconButtonGroup>}
        compact={[0,1].map(i => compact(squareButtons("compact", i), "compact-"+i))}
        micro={[0,1,2,3].map(i => micro(squareButtons("micro", i), "micro-"+i))} />
    </Family>
    <Family title="Text Box · Read-only Display Surface" nonDefaultSettings={[
      "Read-only text display uses black text, persistent primary inset stroke, and the secondary outer focus-style outline at rest.",
      "Unlike editable fields, the text box has no separate focused state.",
    ]} provenance={<Provenance primitive="StudioTextBox" tsx="src/studio-ui/primitives/StudioControls.tsx" css="src/styles/studio-control-restored-primitives.css" tokens="Inherits the global five-size geometry and text-box field exception." imports={["src/studio-ui/primitives/StudioControls.tsx"]} />}>
      <SizeMatrix label="Text box size examples"
        standard={<StudioTextBox size="standard">READ-ONLY DISPLAY TEXT</StudioTextBox>}
        compact={[0,1].map(i => compact(<StudioTextBox size="compact">COMPACT DISPLAY</StudioTextBox>, "compact-"+i))}
        micro={[0,1,2,3].map(i => micro(<StudioTextBox size="micro">MICRO TEXT</StudioTextBox>, "micro-"+i))} />
    </Family>
    <Family title="Split Accordion · Standard / Compact / Micro" nonDefaultSettings={[
      "Uses the existing split-accordion production primitive, not a new accordion implementation.",
      "Panel expansion, interrupted motion, keyboard navigation, and reduced-motion behavior remain owned by StudioSplitAccordion.",
    ]} provenance={<Provenance primitive="StudioSplitAccordion" tsx="src/studio-ui/primitives/StudioSplitAccordion.tsx" css="src/styles/studio-split-accordion.css" tokens="Five global size tiers; one shared accordion behavior and geometry owner." imports={["src/studio-ui/primitives/StudioControls.tsx"]} />}>
      <SizeMatrix label="Split accordion size examples"
        standard={<StudioSplitAccordion items={accordionItems} sizeVariant="standard" accessibleLabel="Standard split accordion" />}
        compact={[0,1].map(i => compact(<StudioSplitAccordion items={accordionItems} sizeVariant="compact" accessibleLabel={"Compact split accordion "+(i+1)} />, "compact-"+i))}
        micro={[0,1,2,3].map(i => micro(<StudioSplitAccordion items={accordionItems} sizeVariant="micro" accessibleLabel={"Micro split accordion "+(i+1)} />, "micro-"+i))} />
    </Family>
    <Family title="Arrow / Side / Double-side / Bar Toggles + Double-split Word Counter" nonDefaultSettings={[
      "All split controls reuse StudioSplitShell rails, size tokens, black dividers, and the same chevron button class used by the counters.",
      "The bar toggle keeps its tooltip inside the active bar and exposes a labelled 0–100 meter.",
      "No inverse-color counter or slider specimens are included.",
    ]} provenance={<Provenance primitive="StudioArrowToggle / StudioSideToggle / StudioDoubleSideToggle / StudioBarToggle / StudioDoubleSplitWordCounter" tsx="src/studio-ui/primitives/StudioValueToggles.tsx" css="src/styles/studio-control-value-toggles.css" tokens="Shared split shell, square rails, secondary rail fill, and global focus outline." imports={["src/studio-ui/primitives/StudioControls.tsx"]} />}>
      <SizeMatrix label="Arrow toggle size examples"
        standard={<StudioArrowToggle value={arrowWord} options={["ONE","TWO","THREE","FOUR"]} onValueChange={setArrowWord} size="standard" ariaLabel="Standard arrow toggle" />}
        compact={[0,1].map(i => compact(<StudioArrowToggle value={arrowWord} options={["ONE","TWO","THREE","FOUR"]} onValueChange={setArrowWord} size="compact" ariaLabel={"Compact arrow toggle "+(i+1)} />, "compact-"+i))}
        micro={[0,1,2,3].map(i => micro(<StudioArrowToggle value={arrowWord} options={["ONE","TWO","THREE","FOUR"]} onValueChange={setArrowWord} size="micro" ariaLabel={"Micro arrow toggle "+(i+1)} />, "micro-"+i))} />
      <SizeMatrix label="Side toggle size examples"
        standard={<StudioSideToggle value={sideWord} options={["LOW","MID","HIGH"]} onValueChange={setSideWord} size="standard" arrowSide="right" />}
        compact={[0,1].map(i => compact(<StudioSideToggle value={sideWord} options={["LOW","MID","HIGH"]} onValueChange={setSideWord} size="compact" arrowSide="right" />, "compact-"+i))}
        micro={[0,1,2,3].map(i => micro(<StudioSideToggle value={sideWord} options={["LOW","MID","HIGH"]} onValueChange={setSideWord} size="micro" arrowSide="right" />, "micro-"+i))} />
      <SizeMatrix label="Double side toggle size examples"
        standard={<StudioDoubleSideToggle left={{value:"LOW",options:["LOW","HIGH"],onValueChange:()=>{}}} right={{value:rightWord,options:["LOW","MID","HIGH"],onValueChange:setRightWord}} size="standard" />}
        compact={[0,1].map(i => compact(<StudioDoubleSideToggle left={{value:"LOW",options:["LOW","HIGH"],onValueChange:()=>{}}} right={{value:rightWord,options:["LOW","MID","HIGH"],onValueChange:setRightWord}} size="compact" />, "compact-"+i))}
        micro={[0,1,2,3].map(i => micro(<StudioDoubleSideToggle left={{value:"LOW",options:["LOW","HIGH"],onValueChange:()=>{}}} right={{value:rightWord,options:["LOW","MID","HIGH"],onValueChange:setRightWord}} size="micro" />, "micro-"+i))} />
      <SizeMatrix label="Bar toggle size examples"
        standard={<StudioBarToggle value={barValue} onValueChange={setBarValue} size="standard" barCount={10} ariaLabel="Standard bar toggle" />}
        compact={[0,1].map(i => compact(<StudioBarToggle value={barValue} onValueChange={setBarValue} size="compact" barCount={8} ariaLabel={"Compact bar toggle "+(i+1)} />, "compact-"+i))}
        micro={[0,1,2,3].map(i => micro(<StudioBarToggle value={barValue} onValueChange={setBarValue} size="micro" barCount={6} ariaLabel={"Micro bar toggle "+(i+1)} />, "micro-"+i))} />
      <SizeMatrix label="Double split word counter size examples"
        standard={<StudioDoubleSplitWordCounter value={doubleWord} onValueChange={setDoubleWord} size="standard" />}
        compact={[0,1].map(i => compact(<StudioDoubleSplitWordCounter value={doubleWord} onValueChange={setDoubleWord} size="compact" />, "compact-"+i))}
        micro={[0,1,2,3].map(i => micro(<StudioDoubleSplitWordCounter value={doubleWord} onValueChange={setDoubleWord} size="micro" />, "micro-"+i))} />
    </Family>
    <Family title="Left Word Counter · Standard / Compact / Micro" nonDefaultSettings={[
      "Four-state ONE / TWO / THREE / FOUR counter uses the same canonical left-counter chevron buttons and split shell.",
    ]} provenance={<Provenance primitive="StudioLeftWordCounter" tsx="src/studio-ui/primitives/StudioControls.tsx" css="src/styles/studio-control-system.css" tokens="Shared counter rails, chevrons, focus interaction, and five-size token ladder." imports={["src/studio-ui/primitives/StudioControls.tsx"]} />}>
      <SizeMatrix label="Left word counter size examples"
        standard={<StudioLeftWordCounter value={leftWord} onValueChange={setLeftWord} size="standard" />}
        compact={[0,1].map(i => compact(<StudioLeftWordCounter value={leftWord} onValueChange={setLeftWord} size="compact" />, "compact-"+i))}
        micro={[0,1,2,3].map(i => micro(<StudioLeftWordCounter value={leftWord} onValueChange={setLeftWord} size="micro" />, "micro-"+i))} />
    </Family>
  </>
}

const ConfirmedStudioCounterFamily: React.FC = () => {
  const [values, setValues] = React.useState([22, 3, 4, 7, 8, 9, 10])
  const update = (index: number) => (value: number) => setValues(current => current.map((old, i) => i === index ? value : old))
  return <Family title="StudioCounter · Standard / Compact / Micro" nonDefaultSettings={[
    "One canonical primary-fill design only; inverse-color variants are intentionally excluded.",
    "Independent button-only counter; range is 0–100 for every specimen.",
  ]} provenance={<Provenance primitive="StudioCounter" tsx="src/studio-ui/primitives/StudioControls.tsx" css="src/styles/studio-control-system.css" tokens="44px standard / 28px compact / 12px micro · shared counter chevron and focus tokens." imports={["src/studio-ui/primitives/StudioControls.tsx"]} />}>
    <SizeMatrix label="Counter size examples"
      standard={<StudioCounter value={values[0]} onValueChange={update(0)} size="standard" min={0} max={100} ariaLabel="Standard counter" />}
      compact={[0,1].map(i => compact(<StudioCounter value={values[1+i]} onValueChange={update(1+i)} size="compact" min={0} max={100} ariaLabel={`Compact counter ${i+1}`} />, `compact-${i}`))}
      micro={[0,1,2,3].map(i => micro(<StudioCounter value={values[3+i]} onValueChange={update(3+i)} size="micro" min={0} max={100} ariaLabel={`Micro counter ${i+1}`} />, `micro-${i}`))} />
  </Family>
}

const ConfirmedStudioDoubleSplitSliderFamily: React.FC = () => {
  const [values, setValues] = React.useState([62, 38, 42, 7, 12, 18, 24])
  const update = (index: number) => (value: number) => setValues(current => current.map((old, i) => i === index ? value : old))
  return <Family title="StudioDoubleSplitSlider · Standard / Compact / Micro" nonDefaultSettings={[
    "One canonical primary-fill design only; inverse-color variants are intentionally excluded.",
    "Shared double-split rail geometry and global slider fill defaults; all specimens use a 0–100 value range.",
  ]} provenance={<Provenance primitive="StudioDoubleSplitSlider" tsx="src/studio-ui/primitives/StudioControls.tsx" css="src/styles/studio-control-system.css" tokens="44px standard / 28px compact / 12px micro · shared split-shell tokens." imports={["src/studio-ui/primitives/StudioControls.tsx"]} />}>
    <SizeMatrix label="Double split slider size examples"
      standard={<StudioDoubleSplitSlider value={values[0]} onValueChange={update(0)} size="standard" ariaLabel="Standard slider" />}
      compact={[0,1].map(i => compact(<StudioDoubleSplitSlider value={values[1+i]} onValueChange={update(1+i)} size="compact" ariaLabel={`Compact slider ${i+1}`} />, `compact-${i}`))}
      micro={[0,1,2,3].map(i => micro(<StudioDoubleSplitSlider value={values[3+i]} onValueChange={update(3+i)} size="micro" ariaLabel={`Micro slider ${i+1}`} />, `micro-${i}`))} />
    <div className="vt-confirmed-variant is-full-row"><span>COUNTER-CONTROLLED · UP / DOWN</span><StudioDoubleSplitSlider value={values[0]} onValueChange={update(0)} size="standard" leftControls="counter" ariaLabel="Counter-controlled slider" /></div>
  </Family>
}

const ConfirmedStudioSideCounterFamily: React.FC = () => {
  const [values, setValues] = React.useState([5, 3, 4, 8, 9, 10, 11])
  const update = (index: number) => (value: number) => setValues(current => current.map((old, i) => i === index ? value : old))
  return <Family title="StudioSideCounter · Standard / Compact / Micro" nonDefaultSettings={[
    "Dedicated right-side action rail with one canonical primary-fill specimen per size.",
    "No inverse-color or duplicate left-counter variants are shown in this family.",
  ]} provenance={<Provenance primitive="StudioSideCounter" tsx="src/studio-ui/primitives/StudioControls.tsx" css="src/styles/studio-control-system.css" tokens="44px standard / 28px compact / 12px micro · shared counter chevron and focus tokens." imports={["src/studio-ui/primitives/StudioControls.tsx"]} />}>
    <SizeMatrix label="Side counter size examples"
      standard={<StudioSideCounter value={values[0]} onValueChange={update(0)} size="standard" min={0} max={100} ariaLabel="Standard side counter" />}
      compact={[0,1].map(i => compact(<StudioSideCounter value={values[1+i]} onValueChange={update(1+i)} size="compact" min={0} max={100} ariaLabel={`Compact side counter ${i+1}`} />, `compact-${i}`))}
      micro={[0,1,2,3].map(i => micro(<StudioSideCounter value={values[3+i]} onValueChange={update(3+i)} size="micro" min={0} max={100} ariaLabel={`Micro side counter ${i+1}`} />, `micro-${i}`))} />
  </Family>
}

/** Certified production examples only. This catalog uses the real Studio Hub exports. */
export const StudioHubConfirmedPrimitiveCatalog: React.FC = () => (
  <div className="vt-confirmed-catalog">
    <section className="vt-confirmed-family vt-confirmed-defaults-combined" aria-labelledby="vt-confirmed-global-defaults-title">
      <h3 id="vt-confirmed-global-defaults-title">Global Defaults · Current Source Contract</h3>
      <p className="vt-confirmed-defaults-summary">60px supreme · 44px standard · 28px compact · 20px mini · 12px micro · 3px / 2px / 1px borders · 6px / 4px / 2px radii · Inter 1000 uppercase with size-scaled text stroke · 4px standard gap · row-fill by default; data-width="content" opts into intrinsic width · single-line input 52px / 38px / 24px / 17.5px / 10px · textarea 24.55px / 18px / 14px / 17.5px / 10px</p>
      <p><a href="https://github.com/viewtube-dev/viewtube/blob/master/consolidated-feature-integration/docs/ui/STUDIO_CONTROLS_GLOBAL_DEFAULTS_AND_EXCEPTION_INDEX.md" target="_blank" rel="noreferrer">Global defaults, exception index, and certification rules ↗</a></p>
      <details className="vt-confirmed-defaults-details">
        <summary>Show current defaults, effective CSS behavior, and exceptions</summary>
        <div className="vt-confirmed-size-grid">
          {(["supreme","standard","compact","mini","micro"] as const).map(size => <div className="vt-confirmed-size-card" key={size}><strong>{size.toUpperCase()} · {STUDIO_COMPONENT_SIZE_DEFAULTS[size].height}PX</strong><span>Stroke {STUDIO_COMPONENT_SIZE_DEFAULTS[size].stroke}px · Radius {STUDIO_COMPONENT_SIZE_DEFAULTS[size].radius}px · Font {STUDIO_COMPONENT_SIZE_DEFAULTS[size].fontSize}px / weight {STUDIO_COMPONENT_SIZE_DEFAULTS[size].fontWeight}</span><span>Flat default: no shadow, hover offset, or press offset · icon {STUDIO_COMPONENT_SIZE_DEFAULTS[size].iconSize}px / stroke {STUDIO_COMPONENT_SIZE_DEFAULTS[size].iconStroke}</span></div>)}
        </div>
        <div className="vt-confirmed-size-card"><strong>SINGLE-LINE INPUTS · GLOBAL TYPOGRAPHY</strong><span>Standard {STUDIO_COMPONENT_SIZE_DEFAULTS.textInput.standardFontSize}px · compact {STUDIO_COMPONENT_SIZE_DEFAULTS.textInput.compactFontSize}px · weight {STUDIO_COMPONENT_SIZE_DEFAULTS.textInput.fontWeight} · line-height {STUDIO_COMPONENT_SIZE_DEFAULTS.textInput.lineHeight}</span><span>Inputs keep the selected 44px / 28px geometry and use the global single-line type scale.</span></div>
        <div className="vt-confirmed-size-card vt-confirmed-field-typography-exception"><strong>MULTILINE TEXTAREA · REGISTERED EXCEPTION</strong><span>Standard {STUDIO_COMPONENT_SIZE_DEFAULTS.multiline.standardFontSize}px · compact {STUDIO_COMPONENT_SIZE_DEFAULTS.multiline.compactFontSize}px · minimum surface {STUDIO_COMPONENT_SIZE_DEFAULTS.multiline.minHeight}px · weight {STUDIO_COMPONENT_SIZE_DEFAULTS.multiline.fontWeight}</span><span>Textarea-only multiline line-height, padding, and vertical resizing; selected size still controls height family, border, and radius.</span></div>
        <div className="vt-confirmed-size-card vt-confirmed-action-exception"><strong>PROMINENT ACTION · FLAT 56PX FAMILY</strong><span>56px fixed height · 3px stroke · 6px radius · 20px Inter / weight 1000 text · flat and stationary.</span><span>StudioActionButton is a separate 56px action family; global flat-control contract removes shell shadows, transitions, and hover/press movement.</span></div>
        <div className="vt-confirmed-global-grid">{Object.entries(STUDIO_COMPONENT_GLOBAL_DEFAULTS).map(([key, value]) => <div key={key}><strong>{key.replace(/([A-Z])/g, " $1")}</strong><span>{formatDefaultValue(value)}</span></div>)}</div>
        <div className="vt-confirmed-defaults-explainer">
          <strong>HOW TO READ THE CURRENT CONTRACT</strong>
          <p><b>Geometry:</b> supreme is 60px / 3px / 6px; standard is 44px / 3px / 6px; compact is 28px / 2px / 4px; mini is 20px / 1.5px / 3px; micro is 12px / 1px / 2px. Default type is Inter, weight 1000, uppercase, -0.02em tracking, and 0.86 line-height unless a family exception is documented.</p>
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
        <li><strong>SINGLE-LINE INPUT TYPOGRAPHY:</strong> 38px standard / 24px compact, weight 1000 and 0.86 line-height while retaining selected-size geometry.</li>
        <li><strong>MULTILINE TEXTAREA:</strong> 18px standard / 14px compact, multiline line-height and padding, 92px minimum writing surface, and vertical resize.</li>
        <li><strong>PROMINENT WORKFLOW ACTION:</strong> StudioActionButton is a separate 56px family with 3px stroke, 6px radius, 20px label, and no shell shadow, transition, or hover/press translation.</li>
        <li><strong>GLOBAL SHADOW + MOTION POLICY:</strong> canonical primitive shells and faces are flat and stationary; obsolete shadow/movement declarations must be removed, not masked by override layers. Browser computed-style verification remains a release gate.</li>
        <li><strong>DROPDOWN:</strong> the trigger uses all five size tiers; menu rows and options are not button-press surfaces. A floating panel may have its own stationary shadow. Panel typography and stacking use dropdown-specific CSS.</li>
        <li><strong>SQUARE / CIRCLE ICON BUTTONS:</strong> share the standard/compact size lattice and default flat, stationary shell behavior. Large icon preset is default; circle buttons scale it to 80%. V1–V4 skins and documented inner-icon effects are explicit variants, not global shell behavior.</li>
        <li><strong>VAULT SPECTRUM TAG:</strong> registered 15px dense metadata chip with 2px border, 4px radius, 8px / weight-900 type, 35% white-mixed spectrum fill, and flat selected-state color treatment with no shadow, glow, or geometry offset.</li>
        <li><strong>CLOSEABLE BADGE:</strong> follows the supreme / standard / compact / mini / micro 60px / 44px / 28px / 20px / 12px size lattice, 3px / 2px / 1px stroke, 6px / 4px / 2px radius, and 38px / 24px / 10px type. The close action is circular and secondary-filled; no pill-ratio shell exception.</li>
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
      <SizeMatrix label="Text input size examples"
        standard={<StudioTextInput sizeVariant="standard" aria-label="Standard text input" placeholder="TYPE HERE" />}
        compact={[0,1].map(i => compact(<StudioTextInput sizeVariant="compact" aria-label={"Compact text input "+(i+1)} placeholder="TYPE HERE" />, "compact-"+i))}
        micro={[0,1,2,3].map(i => micro(<StudioTextInput sizeVariant="micro" aria-label={"Micro text input "+(i+1)} placeholder="TYPE" />, "micro-"+i))} />
      <div className="vt-confirmed-variant is-full-row"><span>44px standard · simple input</span><StudioTextInput sizeVariant="standard" aria-label="Studio plain text input standard" placeholder="TYPE HERE" data-vt-library-component="StudioTextInput" /></div>
      <div className="vt-confirmed-variant is-full-row"><span>28px compact · simple input</span><StudioTextInput sizeVariant="compact" aria-label="Studio plain text input compact" placeholder="TYPE HERE" data-vt-library-component="StudioTextInput" /></div>
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
    <StudioPrimitiveRepresentatives />
    <RestoredPrimitiveShowcase />
    <CanonicalControlFamilies />
    <p className="vt-confirmed-intro">Production primitives · standard + compact.</p>
    <Family title="Button"  provenance={<Provenance primitive="StudioButton" tsx="src/studio-ui/primitives/StudioControls.tsx" css="src/styles/studio-control-system.css" tokens="Button-only shadow; canonical size defaults." imports={["src/studio-ui/primitives/StudioControls.tsx"]} />}>
      <SizeMatrix label="Button size examples"
        standard={<StudioButton sizeVariant="standard">BUTTON</StudioButton>}
        compact={[0,1].map(i => compact(<StudioButton sizeVariant="compact">BUTTON</StudioButton>, "compact-"+i))}
        micro={[0,1,2,3].map(i => micro(<StudioButton sizeVariant="micro">BUTTON</StudioButton>, "micro-"+i))} />
      <div className="vt-confirmed-variant is-full-row"><span>44px standard · default</span><StudioButton sizeVariant="standard">button</StudioButton></div>
      <div className="vt-confirmed-variant"><span>28px compact · default</span><StudioButton sizeVariant="compact">button</StudioButton></div><div className="vt-confirmed-variant"><span>28px compact · neutral tone</span><StudioButton sizeVariant="compact" tone="neutral">button</StudioButton></div>
      <div className="vt-confirmed-variant is-full-row"><span>44px standard · selected</span><StudioButton selected sizeVariant="standard">button</StudioButton></div>
      <div className="vt-confirmed-variant"><span>28px compact · selected</span><StudioButton selected sizeVariant="compact">button</StudioButton></div><div className="vt-confirmed-variant"><span>28px compact · selected + disabled</span><StudioButton selected disabled sizeVariant="compact">button</StudioButton></div>
    </Family>
    <Family title="Prominent Action · 56px" nonDefaultSettings={[
        "Dedicated 56px action family with 20px label typography; it is not a third ordinary-button size.",
      ]} provenance={<Provenance primitive="StudioActionButton" tsx="src/studio-ui/primitives/StudioControls.tsx" css="src/styles/studio-control-system.css" tokens="Separate fixed 56px action family; never used as a standard/compact size alias." imports={["src/studio-ui/primitives/StudioControls.tsx"]} />}>
      <div className="vt-confirmed-variant is-full-row"><span>56px prominent workflow action</span><StudioActionButton data-vt-library-component="StudioActionButton">CREATE PACKAGE</StudioActionButton></div>
    </Family>

    <Family title="Square Icon Button · 44px + 28px" nonDefaultSettings={[
        "V1–V4 skins change fill and icon color only.",
        "All icon presets and interaction effects live in this single family; success styling must follow a real successful operation.",
      ]} provenance={<Provenance primitive="StudioSquareIconButton · v1/v2/v3/v4 + seven effects" tsx="src/studio-ui/primitives/StudioControls.tsx" css="src/styles/studio-control-system.css" tokens="44×44px standard / 28×28px compact; V1–V4 skins; all icon presets and opt-in interaction effects; no default shell shadow or motion." imports={["src/studio-ui/index.ts", "src/components/studio-hub/StudioHubConfirmedPrimitiveCatalog.tsx"]} />}>
      <SizeMatrix label="Square icon button size examples"
        standard={<StudioSquareIconButton icon={<Settings2 aria-hidden="true" />} label="Standard square icon button" variant="v1" sizeVariant="standard" />}
        compact={[0,1].map(i => compact(<StudioSquareIconButton icon={<Settings2 aria-hidden="true" />} label={"Compact square icon button "+(i+1)} variant="v1" sizeVariant="compact" />, "compact-"+i))}
        micro={[0,1,2,3].map(i => micro(<StudioSquareIconButton icon={<Settings2 aria-hidden="true" />} label={"Micro square icon button "+(i+1)} variant="v1" sizeVariant="micro" />, "micro-"+i))} />
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
      <SizeMatrix label="Split-left button size examples"
        standard={<StudioSplitLeftButton icon={<Settings2 aria-hidden="true" />} sizeVariant="standard">EDIT</StudioSplitLeftButton>}
        compact={[0,1].map(i => compact(<StudioSplitLeftButton icon={<Settings2 aria-hidden="true" />} sizeVariant="compact">EDIT</StudioSplitLeftButton>, "compact-"+i))}
        micro={[0,1,2,3].map(i => micro(<StudioSplitLeftButton icon={<Settings2 aria-hidden="true" />} sizeVariant="micro">EDIT</StudioSplitLeftButton>, "micro-"+i))} />
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
      <SizeMatrix label="Play pause button size examples"
        standard={<StudioPlayPauseButton sizeVariant="standard" />}
        compact={[0,1].map(i => compact(<StudioPlayPauseButton sizeVariant="compact" />, "compact-"+i))}
        micro={[0,1,2,3].map(i => micro(<StudioPlayPauseButton sizeVariant="micro" />, "micro-"+i))} />
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
      <SizeMatrix label="Circle icon button size examples"
        standard={<StudioCircleIconButton icon={<Settings2 aria-hidden="true" />} label="Standard circle icon button" variant="v1" sizeVariant="standard" />}
        compact={[0,1].map(i => compact(<StudioCircleIconButton icon={<Settings2 aria-hidden="true" />} label={"Compact circle icon button "+(i+1)} variant="v1" sizeVariant="compact" />, "compact-"+i))}
        micro={[0,1,2,3].map(i => micro(<StudioCircleIconButton icon={<Settings2 aria-hidden="true" />} label={"Micro circle icon button "+(i+1)} variant="v1" sizeVariant="micro" />, "micro-"+i))} />
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
      title="Username Split-left Input · 44px + 28px"
      nonDefaultSettings={[
        "Icon rail is part of the field, not an action button.",
        "Wrapper owns the focus outline/border; editable area reuses StudioTextInput.",
      ]}
      provenance={<Provenance primitive="StudioUsernameInput" tsx="src/studio-ui/primitives/StudioControls.tsx" css="src/styles/studio-control-system.css" tokens="Composite of canonical StudioTextInput and split-left icon rail; 44px / 28px geometry; no shadow; wrapper focus ring." imports={["src/studio-ui/primitives/StudioControls.tsx"]} />}
    >
      <SizeMatrix label="Username input size examples"
        standard={<StudioUsernameInput icon={<Settings2 aria-hidden="true" />} aria-label="Standard username" placeholder="USERNAME" />}
        compact={[0,1].map(i => compact(<StudioUsernameInput icon={<Settings2 aria-hidden="true" />} sizeVariant="compact" aria-label={"Compact username "+(i+1)} placeholder="USERNAME" />, "compact-"+i))}
        micro={[0,1,2,3].map(i => micro(<StudioUsernameInput icon={<Settings2 aria-hidden="true" />} sizeVariant="micro" aria-label={"Micro username "+(i+1)} placeholder="USER" />, "micro-"+i))} />
      <div className="vt-confirmed-variant is-full-row">
        <span>44px standard · editable username field</span>
        <StudioUsernameInput icon={<Settings2 aria-hidden="true" />} aria-label="Standard username" placeholder="USERNAME" autoComplete="username" data-vt-library-component="StudioUsernameInput" />
      </div>
      <div className="vt-confirmed-variant">
        <span>28px compact · editable username field</span>
        <StudioUsernameInput icon={<Settings2 aria-hidden="true" />} sizeVariant="compact" aria-label="Compact username" placeholder="USERNAME" autoComplete="username" data-vt-library-component="StudioUsernameInput" />
      </div>
      <div className="vt-confirmed-variant">
        <span>28px compact · disabled</span>
        <StudioUsernameInput icon={<Settings2 aria-hidden="true" />} sizeVariant="compact" aria-label="Disabled username" placeholder="USERNAME" disabled data-vt-library-component="StudioUsernameInput" />
      </div>
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
      <SizeMatrix label="Simple dropdown size examples"
        standard={<StudioSimpleDropdown sizeVariant="standard" ariaLabel="Standard simple dropdown" defaultValue="balanced" options={[{value:"light",label:"Light"},{value:"balanced",label:"Balanced"},{value:"aggressive",label:"Aggressive"}]} />}
        compact={[0,1].map(i => compact(<StudioSimpleDropdown sizeVariant="compact" ariaLabel={"Compact simple dropdown "+(i+1)} defaultValue="balanced" options={[{value:"light",label:"Light"},{value:"balanced",label:"Balanced"},{value:"aggressive",label:"Aggressive"}]} />, "compact-"+i))}
        micro={[0,1,2,3].map(i => micro(<StudioSimpleDropdown sizeVariant="micro" ariaLabel={"Micro simple dropdown "+(i+1)} defaultValue="balanced" options={[{value:"light",label:"Light"},{value:"balanced",label:"Balanced"},{value:"aggressive",label:"Aggressive"}]} />, "micro-"+i))} />
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
      <SizeMatrix label="Split-left dropdown size examples"
        standard={<StudioSplitLeftDropdown sizeVariant="standard" aria-label="Standard split-left dropdown" defaultValue="balanced" options={[{value:"balanced",label:"Balanced"},{value:"fast",label:"Fast"}]} />}
        compact={[0,1].map(i => compact(<StudioSplitLeftDropdown sizeVariant="compact" aria-label={"Compact split-left dropdown "+(i+1)} defaultValue="balanced" options={[{value:"balanced",label:"Balanced"},{value:"fast",label:"Fast"}]} />, "compact-"+i))}
        micro={[0,1,2,3].map(i => micro(<StudioSplitLeftDropdown sizeVariant="micro" aria-label={"Micro split-left dropdown "+(i+1)} defaultValue="balanced" options={[{value:"balanced",label:"Balanced"},{value:"fast",label:"Fast"}]} />, "micro-"+i))} />
      <div className="vt-confirmed-variant is-full-row" data-vt-library-component="StudioSplitLeftDropdown">
        <span>Standard · split-left chevron</span>
        <StudioSplitLeftDropdown aria-label="Split-left dropdown example" defaultValue="balanced" options={[{ value: "light", label: "Light" }, { value: "balanced", label: "Balanced" }, { value: "aggressive", label: "Aggressive" }]} />
        <span>Compact · split-left chevron</span>
        <StudioSplitLeftDropdown aria-label="Compact split-left dropdown example" sizeVariant="compact" defaultValue="three" options={[{ value: "one", label: "One set" }, { value: "three", label: "Three sets" }, { value: "five", label: "Five sets" }]} />
        <span>Simple dropdown · fixed trailing chevron</span>
        <StudioSimpleDropdown aria-label="Fixed trailing chevron example" sizeVariant="compact" defaultValue="balanced" options={[{ value: "balanced", label: "Balanced" }, { value: "focused", label: "Focused" }]} />
      </div>
    </Family>
    <ConfirmedStudioCounterFamily />
    <ConfirmedStudioDoubleSplitSliderFamily />
    <ConfirmedStudioSideCounterFamily />
  </div>
)

export default StudioHubConfirmedPrimitiveCatalog