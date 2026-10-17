import React from "react"
import { Check, Settings2, Sparkles } from "lucide-react"
import {
  STUDIO_COMPONENT_GLOBAL_DEFAULTS,
  STUDIO_COMPONENT_SIZE_DEFAULTS,
  StudioButton,
  StudioIconButton,
  StudioActionButton,
  StudioRadio,
  StudioCheckbox,
  StudioXCheckbox,
  StudioLegendMultiDropdown,
  StudioInlineStepper,
  StudioSplitStepper,
  StudioSplitLeftButton,
  StudioSplitLeftBadge,
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

const CANONICAL_SKINS = [{ skin: "solid" as const, label: "SOLID" }, { skin: "color-swap" as const, label: "COLOR SWAP" }, { skin: "black-indicator" as const, label: "BLACK" }, { skin: "white-indicator" as const, label: "WHITE" }]
const WORD_TOGGLE_SKINS = CANONICAL_SKINS.slice(0, 3)
const CanonicalControlFamilies: React.FC = () => {
  const [switches, setSwitches] = React.useState<boolean[]>(Array(8).fill(false))
  const [choices, setChoices] = React.useState<boolean[]>(Array(12).fill(false))
  const [words, setWords] = React.useState<boolean[]>(Array(6).fill(false))
  const flip = (setter: React.Dispatch<React.SetStateAction<boolean[]>>, index: number, value?: boolean) => setter(current => current.map((old, i) => i === index ? (value ?? !old) : old))
  return <>
    <Family title="44px Switches"  provenance={<Provenance primitive="StudioSwitch" tsx="src/studio-ui/primitives/StudioControls.tsx" css="src/styles/studio-control-system.css" tokens="75.68×44px track; shared four-skin variants." imports={["src/studio-ui/primitives/StudioControls.tsx"]} />}>
      <div className="vt-confirmed-control-family">{(["round", "rect"] as const).map((shape, row) => <div className="vt-confirmed-control-row" key={shape}><strong>{shape === "round" ? "ROUND" : "RECTANGULAR"}</strong><div className="vt-confirmed-control-variants">{CANONICAL_SKINS.map((skin, col) => { const index = row * 4 + col; return <div key={skin.skin}><small>{skin.label}</small><StudioSwitch shape={shape} skin={skin.skin} checked={switches[index]} aria-label={shape + " " + skin.label} onClick={() => flip(setSwitches, index)} /></div> })}</div></div>)}</div>
    </Family>
    <Family
      title="Split-left Badge · Standard + Compact + Micro"
      nonDefaultSettings={[
        "Static, informational badge reuses split-left rail anatomy without inheriting button activation.",
        "Micro is a badge-only 14px density exception with 1px stroke and 10px type/icons; it is not a global interactive-control size."
      ]}
      provenance={<Provenance
        primitive="StudioSplitLeftBadge"
        tsx="src/studio-ui/primitives/StudioControls.tsx"
        css="src/styles/studio-control-system.css"
        tokens="44px standard / 28px compact / 14px micro · 44px pill radius · flat and motionless"
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
      </div>
    </Family>
    <Family title="44px Radio + Checkbox"  provenance={<Provenance primitive="StudioRadio / StudioCheckbox / StudioXCheckbox" tsx="src/studio-ui/primitives/StudioControls.tsx" css="src/styles/studio-control-system.css" tokens="44×44px controls; checkmark and wide-X checkbox marks." imports={["src/studio-ui/primitives/StudioControls.tsx"]} />}>
      <div className="vt-confirmed-control-family">{([{Component:StudioRadio,label:"CIRCULAR RADIO",shape:"round" as const},{Component:StudioCheckbox,label:"CHECKMARK CHECKBOX",shape:"rect" as const},{Component:StudioXCheckbox,label:"WIDE-X CHECKBOX",shape:"rect" as const}]).map((item,row) => { const ChoiceComponent = item.Component; return <div className="vt-confirmed-control-row" key={item.label}><strong>{item.label}</strong><div className="vt-confirmed-control-variants">{CANONICAL_SKINS.map((skin,col) => { const index = row * 4 + col; return <div key={skin.skin}><small>{skin.label}</small><ChoiceComponent shape={item.shape} skin={skin.skin} checked={choices[index]} aria-label={item.label + " " + skin.label} onClick={() => flip(setChoices, index)} /></div> })}</div></div> })}</div>
    </Family>
    <Family title="Word Toggles · 44px + 28px"  provenance={<Provenance primitive="StudioWordToggle" tsx="src/studio-ui/primitives/StudioControls.tsx" css="src/styles/studio-control-system.css" tokens="Text-measured active handle; standard and compact variants." imports={["src/studio-ui/primitives/StudioControls.tsx"]} />}>
      <div className="vt-confirmed-control-family vt-confirmed-word-toggle-family">{([{size:"44" as const,label:"44PX STANDARD"},{size:"28" as const,label:"28PX COMPACT"}]).map((item,row) => {
        return <div className="vt-confirmed-control-row" key={item.size}>
          <strong>{item.label}</strong>
          <div className="vt-confirmed-control-variants" data-control-size={item.size}>{WORD_TOGGLE_SKINS.map((skin,col) => { const index = row * 3 + col; return <div key={skin.skin}><small>{skin.label}</small><StudioWordToggle size={item.size} skin={skin.skin} value={words[index]} words={item.size === "44" && col === 0 ? ["WRITE","CREATE"] : ["OFF","ON"]} onValueChange={value => flip(setWords, index, value)} /></div> })}</div>
        </div>
      })}</div>
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

const ConfirmedInlineStepperFamily: React.FC = () => {
  const [standardValue, setStandardValue] = React.useState(22)
  const [compactValue, setCompactValue] = React.useState(3)
  return (
    <Family
      title="Inline Stepper · 44px + 28px"
      
      provenance={<Provenance
        primitive="StudioInlineStepper"
        tsx="src/studio-ui/primitives/StudioControls.tsx"
        css="src/styles/studio-control-system.css"
        tokens="Horizontal 1:2:1 layout · global 44px/28px size lattice · shared Studio color pair and focus treatment."
        imports={["src/studio-ui/primitives/StudioControls.tsx"]}
      />}
    >
      <div className="vt-confirmed-variant is-full-row vt-confirmed-stepper-row">
        <span>Standard + compact · interactive horizontal comparison</span>
        <div className="vt-confirmed-stepper-row-grid">
          <div className="vt-confirmed-stepper-specimen">
            <small>44px standard · horizontal</small>
            <StudioInlineStepper value={standardValue} onValueChange={setStandardValue} size="standard" min={0} max={99} ariaLabel="Standard inline stepper" data-vt-library-component="StudioInlineStepper" />
          </div>
          <div className="vt-confirmed-stepper-specimen">
            <small>28px compact · horizontal</small>
            <StudioInlineStepper value={compactValue} onValueChange={setCompactValue} size="compact" min={0} max={99} ariaLabel="Compact inline stepper" data-vt-library-component="StudioInlineStepper" />
          </div>
        </div>
      </div>
    </Family>
  )
}

const ConfirmedStepperFamily: React.FC = () => {
  const [standardValue, setStandardValue] = React.useState(5)
  const [compactValue, setCompactValue] = React.useState(3)
  return (
    <Family
      title="Split Stepper · 44px + 28px"
      
      provenance={<Provenance
        primitive="StudioSplitStepper"
        tsx="src/studio-ui/primitives/StudioControls.tsx"
        css="src/styles/studio-control-system.css"
        tokens="2:1 value/rail geometry; 44px standard and 28px compact; shared Studio size tokens."
        imports={["src/studio-ui/primitives/StudioControls.tsx"]}
      />}
    >
      <div className="vt-confirmed-variant is-full-row vt-confirmed-stepper-row">
        <span>Standard + compact · interactive comparison</span>
        <div className="vt-confirmed-stepper-row-grid">
          <div className="vt-confirmed-stepper-specimen">
            <small>44px standard · interactive</small>
            <StudioSplitStepper
              value={standardValue}
              onValueChange={setStandardValue}
              size="standard"
              min={0}
              max={99}
              ariaLabel="Standard Studio split stepper value"
              data-vt-library-component="StudioSplitStepper"
            />
          </div>
          <div className="vt-confirmed-stepper-specimen">
            <small>28px compact · interactive</small>
            <StudioSplitStepper
              value={compactValue}
              onValueChange={setCompactValue}
              size="compact"
              min={0}
              max={99}
              ariaLabel="Compact Studio split stepper value"
              data-vt-library-component="StudioSplitStepper"
            />
          </div>
        </div>
      </div>
    </Family>
  )
}

/** Certified production examples only. This catalog uses the real Studio Hub exports. */
export const StudioHubConfirmedPrimitiveCatalog: React.FC = () => (
  <div className="vt-confirmed-catalog">
    <section className="vt-confirmed-family vt-confirmed-defaults-combined">
      <h3>Canonical + Global Defaults · All Component Sizes</h3>
      <p className="vt-confirmed-defaults-summary">44px standard · 28px compact · 38px / 24px input text · 18px / 14px textarea text · 1.5px compact button shadow</p>
      <p><a href="https://github.com/viewtube-dev/viewtube/blob/fix%2Fstudio-control-catalog-phases-1-4-2026-10-17/docs/ui/STUDIO_CONTROLS_GLOBAL_DEFAULTS_AND_EXCEPTION_INDEX.md" target="_blank" rel="noreferrer">Global defaults &amp; exception index ↗</a></p>
      <details className="vt-confirmed-defaults-details">
        <summary>Show full defaults and exceptions</summary>
      <div className="vt-confirmed-size-grid">
        <div className="vt-confirmed-size-card"><strong>44PX STANDARD</strong><span>H {STUDIO_COMPONENT_SIZE_DEFAULTS.standard.height}px · Stroke {STUDIO_COMPONENT_SIZE_DEFAULTS.standard.stroke}px · R {STUDIO_COMPONENT_SIZE_DEFAULTS.standard.radius}px · Font {STUDIO_COMPONENT_SIZE_DEFAULTS.standard.fontSize}px / {STUDIO_COMPONENT_SIZE_DEFAULTS.standard.fontWeight}</span><span>Shadow {STUDIO_COMPONENT_SIZE_DEFAULTS.standard.buttonShadowX}×{STUDIO_COMPONENT_SIZE_DEFAULTS.standard.buttonShadowY}px · Hover {STUDIO_COMPONENT_SIZE_DEFAULTS.standard.hoverTransitionMs}ms / {STUDIO_COMPONENT_SIZE_DEFAULTS.standard.hoverOffsetPx}px · Click {STUDIO_COMPONENT_SIZE_DEFAULTS.standard.clickTransitionMs}ms / {STUDIO_COMPONENT_SIZE_DEFAULTS.standard.clickOffsetPx}px · Icon {STUDIO_COMPONENT_SIZE_DEFAULTS.standard.iconSize}px / {STUDIO_COMPONENT_SIZE_DEFAULTS.standard.iconStroke}px</span></div>
        <div className="vt-confirmed-size-card"><strong>28PX COMPACT</strong><span>H {STUDIO_COMPONENT_SIZE_DEFAULTS.compact.height}px · Stroke {STUDIO_COMPONENT_SIZE_DEFAULTS.compact.stroke}px · R {STUDIO_COMPONENT_SIZE_DEFAULTS.compact.radius}px · Font {STUDIO_COMPONENT_SIZE_DEFAULTS.compact.fontSize}px / {STUDIO_COMPONENT_SIZE_DEFAULTS.compact.fontWeight}</span><span>Shadow {STUDIO_COMPONENT_SIZE_DEFAULTS.compact.buttonShadowX}×{STUDIO_COMPONENT_SIZE_DEFAULTS.compact.buttonShadowY}px · Hover {STUDIO_COMPONENT_SIZE_DEFAULTS.compact.hoverTransitionMs}ms / {STUDIO_COMPONENT_SIZE_DEFAULTS.compact.hoverOffsetPx}px · Click {STUDIO_COMPONENT_SIZE_DEFAULTS.compact.clickTransitionMs}ms / {STUDIO_COMPONENT_SIZE_DEFAULTS.compact.clickOffsetPx}px · Icon {STUDIO_COMPONENT_SIZE_DEFAULTS.compact.iconSize}px / stroke {STUDIO_COMPONENT_SIZE_DEFAULTS.compact.iconStroke}px</span></div>
      </div>
      <div className="vt-confirmed-size-card vt-confirmed-field-typography-exception"><strong>SINGLE-LINE INPUTS · GLOBAL TYPOGRAPHY</strong><span>Standard text: {STUDIO_COMPONENT_SIZE_DEFAULTS.textInput.standardFontSize}px · Compact text: {STUDIO_COMPONENT_SIZE_DEFAULTS.textInput.compactFontSize}px · Weight: {STUDIO_COMPONENT_SIZE_DEFAULTS.textInput.fontWeight}</span><span>Inputs follow the global standard/compact font-size and line-height tokens, matching ordinary controls. No textarea typography exception applies.</span></div><div className="vt-confirmed-size-card vt-confirmed-field-typography-exception"><strong>MULTILINE TEXTAREA · TYPOGRAPHY EXCEPTION</strong><span>Standard text: {STUDIO_COMPONENT_SIZE_DEFAULTS.multiline.standardFontSize}px · Compact text: {STUDIO_COMPONENT_SIZE_DEFAULTS.multiline.compactFontSize}px · Weight: {STUDIO_COMPONENT_SIZE_DEFAULTS.multiline.fontWeight}</span><span>Textareas alone use smaller 18px / 14px type, a {STUDIO_COMPONENT_SIZE_DEFAULTS.multiline.minHeight}px minimum surface, multiline line-height/padding, and vertical resize.</span></div>
      <div className="vt-confirmed-size-card vt-confirmed-action-exception"><strong>PROMINENT ACTION EXCEPTION · SEPARATE FAMILY</strong><span>56px fixed height · 3px stroke · 6px radius · 3px stationary shadow · 20px / weight 1000 text.</span><span>Rendered by StudioActionButton; not a StudioButton size and not part of the 44px / 28px ordinary control contract.</span></div>
      <div className="vt-confirmed-global-grid">{Object.entries(STUDIO_COMPONENT_GLOBAL_DEFAULTS).map(([key, value]) => <div key={key}><strong>{key.replace(/([A-Z])/g, " $1")}</strong><span>{formatDefaultValue(value)}</span></div>)}</div><div className="vt-confirmed-defaults-explainer"><strong>HOW TO READ THESE DEFAULTS</strong><p><b>Standard:</b> 44px high, 3px border, 6px radius. <b>Compact:</b> 28px high, 2px border, 4px radius. Font family and weight are Inter / 1000 unless a documented functional exception applies.</p><p><b>Text fields at rest:</b> primary-color text and caret, primary fill at 50% opacity, black outer border, and primary inset stroke. <b>Focused:</b> primary fill at 15% opacity, black text, the primary inset stroke remains, and the secondary-color focus accent is layered at zero offset.</p><p><b>Icon metrics:</b> button-family icons default to the large production preset: 38px/1.9 stroke standard and 24px/2.0 compact. Current (28px/18px) and moderate (34px/22px) presets are opt-in variants, not default specimens.</p><p><b>Component geometry exceptions:</b> rectangular 44px switches and rectangular radios use reference-specific 7.333px radii; checkmark and X checkboxes use the standard 6px radius.</p><p><b>Focus measurement note:</b> the last live browser audit measured the visible secondary-color accent as a 3px standard / 2px compact box shadow; the computed CSS outline itself measured 1px. These are separate layers, not interchangeable widths. Re-check the rendered deployment before calling the current branch visually certified.</p></div>
      </details>
    </section>
    <section className="vt-confirmed-family vt-confirmed-exception-index" aria-labelledby="vt-confirmed-exception-index-title">
      <h3 id="vt-confirmed-exception-index-title">Global Exceptions &amp; Verification Boundary</h3>
      <p>Canonical source: <code>src/studio-ui/primitives/StudioControls.tsx</code> + <code>src/styles/studio-control-system.css</code>. Full register: <code>docs/ui/STUDIO_CONTROLS_GLOBAL_DEFAULTS_AND_EXCEPTION_INDEX.md</code>.</p>
      <ul>
        <li><strong>GLOBAL TYPOGRAPHY · Single-line inputs:</strong> standard 38px / compact 24px at weight 1000 and global 0.86 line-height. Inputs retain global 44px / 28px geometry, 3px / 2px borders, and 6px / 4px radii.</li><li><strong>DOCUMENTED EXCEPTION · Multiline textarea typography:</strong> textareas alone use 18px standard / 14px compact at weight 1000, a 92px minimum writing surface, multiline line-height/padding, and vertical resize; selected size still controls border and radius.</li>
        <li><strong>DOCUMENTED EXCEPTION · Prominent workflow action:</strong> StudioActionButton is a separate fixed 56px family; ordinary StudioButton supports only standard 44px and compact 28px.</li>
        <li><strong>DOCUMENTED EXCEPTION · Dropdown panel/options:</strong> menu rows and the floating panel are not button-press surfaces. Panel shadow is stationary; menu-specific row typography is governed by the production dropdown CSS.</li>
        <li><strong>BROWSER CAPABILITY · Block caret:</strong> the global stylesheet requests a native block insertion caret with <code>caret-shape: block</code> and retains native insertion behavior when a browser does not implement that property. Never simulate a caret with a fake overlay.</li>
        <li><strong>VERIFICATION GATE · Visual states:</strong> source governance does not replace browser verification. Confirm standard/compact sizing, selected and disabled states, keyboard focus, open dropdown stacking, narrow-screen wrapping, and reduced motion in a rendered browser.</li>
      </ul>
      <p><strong>Audit status:</strong> this gallery renders imported production primitives and uses catalog CSS for specimen layout only. A passing source test or build is not a claim of live visual certification.</p>
    </section>
    <Family title="Studio Text Input · Simple + Floating + Fixed Label"  provenance={<Provenance primitive="StudioTextInput" tsx="src/studio-ui/primitives/StudioControls.tsx" css="src/styles/studio-control-system.css" tokens="One native input family with simple and floating-label variants; standard 44px / compact 28px geometry and global 38px / 24px typography." imports={["src/studio-ui/primitives/StudioControls.tsx"]} />}>
      <div className="vt-confirmed-variant is-full-row"><span>44px standard · StudioTextInput</span><StudioTextInput sizeVariant="standard" aria-label="Studio text input 44px" placeholder="TYPE HERE" data-vt-library-component="StudioTextInput" /></div>
      <div className="vt-confirmed-variant"><span>28px compact A · StudioTextInput</span><StudioTextInput sizeVariant="compact" aria-label="Studio text input 28px A" placeholder="TYPE HERE" data-vt-library-component="StudioTextInput" /></div><div className="vt-confirmed-variant"><span>28px compact · disabled</span><StudioTextInput sizeVariant="compact" aria-label="Studio text input 28px disabled" placeholder="TYPE HERE" disabled data-vt-library-component="StudioTextInput" /></div>
      <div className="vt-confirmed-variant is-full-row"><span>Floating label · 44px standard · A</span><StudioTextInput variant="floating-label" floatingLabelVariant="a" label="TITLE" aria-label="Studio floating-label input standard A" sizeVariant="standard" data-vt-library-component="StudioTextInput" /></div>
      <div className="vt-confirmed-variant"><span>Floating label · 28px compact · A</span><StudioTextInput variant="floating-label" floatingLabelVariant="a" label="TITLE" aria-label="Studio floating-label input compact A" sizeVariant="compact" data-vt-library-component="StudioTextInput" /></div>
      <div className="vt-confirmed-variant"><span>Floating label · 28px compact · B · reverse colors</span><StudioTextInput className="is-reverse-colors" variant="floating-label" floatingLabelVariant="b" label="TITLE" aria-label="Studio floating-label input compact B reverse colors" sizeVariant="compact" data-vt-library-component="StudioTextInput" /></div>
      <div className="vt-confirmed-variant is-full-row"><span>Fixed label box · 44px standard · A</span><StudioTextInput variant="fixed-label" label="TITLE" aria-label="Studio fixed-label input standard A" sizeVariant="standard" data-vt-library-component="StudioTextInput" /></div>
      <div className="vt-confirmed-variant"><span>Fixed label box · 28px compact · A</span><StudioTextInput variant="fixed-label" label="TITLE" aria-label="Studio fixed-label input compact A" sizeVariant="compact" data-vt-library-component="StudioTextInput" /></div>
      <div className="vt-confirmed-variant"><span>Fixed label box · 28px compact · B · reverse colors</span><StudioTextInput className="is-reverse-colors" variant="fixed-label" label="TITLE" aria-label="Studio fixed-label input compact B reverse colors" sizeVariant="compact" data-vt-library-component="StudioTextInput" /></div>
    </Family>
    <Family title="Studio Text Area · Simple + Floating + Fixed Label" nonDefaultSettings={[
        "Multiline-only exception: 18px standard / 14px compact typography, distinct line-height and padding, and a 92px minimum writing surface."
      ]} provenance={<Provenance primitive="StudioTextArea" tsx="src/studio-ui/primitives/StudioControls.tsx" css="src/styles/studio-control-system.css" tokens="One native textarea family with simple and floating-label variants; 92px minimum surface and standard 18px / compact 14px multiline typography." imports={["src/studio-ui/primitives/StudioControls.tsx"]} />}>
      <div className="vt-confirmed-variant is-full-row"><span>44px standard · StudioTextArea</span><StudioTextArea sizeVariant="standard" rows={4} aria-label="Studio text area 44px" placeholder="TYPE HERE" data-vt-library-component="StudioTextArea" /></div>
      <div className="vt-confirmed-variant is-full-row"><span>28px compact · StudioTextArea</span><StudioTextArea sizeVariant="compact" rows={4} aria-label="Studio text area 28px" placeholder="TYPE HERE" data-vt-library-component="StudioTextArea" /></div>
      <div className="vt-confirmed-variant is-full-row"><span>Floating label · 44px standard · A</span><StudioTextArea variant="floating-label" floatingLabelVariant="a" label="DESCRIPTION" aria-label="Studio floating-label textarea standard A" rows={4} data-vt-library-component="StudioTextArea" /></div>
      <div className="vt-confirmed-variant"><span>Floating label · 28px compact · A</span><StudioTextArea variant="floating-label" floatingLabelVariant="a" label="DESCRIPTION" aria-label="Studio floating-label textarea compact A" sizeVariant="compact" rows={4} data-vt-library-component="StudioTextArea" /></div>
      <div className="vt-confirmed-variant"><span>Floating label · 28px compact · B · reverse colors</span><StudioTextArea className="is-reverse-colors" variant="floating-label" floatingLabelVariant="b" label="DESCRIPTION" aria-label="Studio floating-label textarea compact B reverse colors" sizeVariant="compact" rows={4} data-vt-library-component="StudioTextArea" /></div>
      <div className="vt-confirmed-variant is-full-row"><span>Fixed label box · 44px standard · A</span><StudioTextArea variant="fixed-label" label="DESCRIPTION" aria-label="Studio fixed-label textarea standard A" sizeVariant="standard" rows={4} data-vt-library-component="StudioTextArea" /></div>
      <div className="vt-confirmed-variant"><span>Fixed label box · 28px compact · A</span><StudioTextArea variant="fixed-label" label="DESCRIPTION" aria-label="Studio fixed-label textarea compact A" sizeVariant="compact" rows={4} data-vt-library-component="StudioTextArea" /></div>
      <div className="vt-confirmed-variant"><span>Fixed label box · 28px compact · B · reverse colors</span><StudioTextArea className="is-reverse-colors" variant="fixed-label" label="DESCRIPTION" aria-label="Studio fixed-label textarea compact B reverse colors" sizeVariant="compact" rows={4} data-vt-library-component="StudioTextArea" /></div>
    </Family>
    <CanonicalControlFamilies />
    <p className="vt-confirmed-intro">Production primitives · standard + compact.</p>
    <Family title="Button"  provenance={<Provenance primitive="StudioButton" tsx="src/studio-ui/primitives/StudioControls.tsx" css="src/styles/studio-control-system.css" tokens="Button-only shadow; canonical size defaults." imports={["src/studio-ui/primitives/StudioControls.tsx"]} />}>
      <div className="vt-confirmed-variant is-full-row"><span>44px standard · default</span><StudioButton sizeVariant="standard">button</StudioButton></div>
      <div className="vt-confirmed-variant"><span>28px compact · default</span><StudioButton sizeVariant="compact">button</StudioButton></div><div className="vt-confirmed-variant"><span>28px compact · neutral tone</span><StudioButton sizeVariant="compact" tone="neutral">button</StudioButton></div>
      <div className="vt-confirmed-variant is-full-row"><span>44px standard · selected</span><StudioButton selected sizeVariant="standard">button</StudioButton></div>
      <div className="vt-confirmed-variant"><span>28px compact · selected</span><StudioButton selected sizeVariant="compact">button</StudioButton></div><div className="vt-confirmed-variant"><span>28px compact · selected + disabled</span><StudioButton selected disabled sizeVariant="compact">button</StudioButton></div>
    </Family>
    <Family title="Icon Button · 44px + 28px"  provenance={<Provenance primitive="StudioIconButton" tsx="src/studio-ui/primitives/StudioControls.tsx" css="src/styles/studio-control-system.css" tokens="44px / 28px; shared StudioButton interaction contract." imports={["src/studio-ui/index.ts"]} />}><div className="vt-confirmed-variant is-full-row"><span>44px standard · semantic tones</span><div className="vt-confirmed-square-variant-grid">{(["accent","neutral","danger","warning","success"] as const).map(tone => <StudioIconButton key={tone} icon={<Settings2 aria-hidden="true" />} label={tone + " action"} tone={tone} sizeVariant="standard" data-vt-library-component="StudioIconButton" />)}</div></div><div className="vt-confirmed-variant is-full-row"><span>28px compact · semantic tones</span><div className="vt-confirmed-square-variant-grid">{(["accent","neutral","danger","warning","success"] as const).map(tone => <StudioIconButton key={tone} icon={<Settings2 aria-hidden="true" />} label={tone + " compact action"} tone={tone} sizeVariant="compact" data-vt-library-component="StudioIconButton" />)}</div></div><div className="vt-confirmed-variant"><span>Selected</span><StudioIconButton icon={<Check aria-hidden="true" />} label="Selected icon action" selected sizeVariant="standard" data-vt-library-component="StudioIconButton" /></div><div className="vt-confirmed-variant"><span>Disabled</span><StudioIconButton icon={<Settings2 aria-hidden="true" />} label="Disabled icon action" disabled sizeVariant="standard" data-vt-library-component="StudioIconButton" /></div><div className="vt-confirmed-variant"><span>Loading</span><StudioIconButton icon={<Sparkles aria-hidden="true" />} label="Loading icon action" loading sizeVariant="standard" data-vt-library-component="StudioIconButton" /></div></Family>
    <Family title="Prominent Action · 56px" nonDefaultSettings={[
        "Dedicated 56px prominent-action exception with 20px label typography and 3px offset shadow; this is not a third ordinary-button size."
      ]} provenance={<Provenance primitive="StudioActionButton" tsx="src/studio-ui/primitives/StudioControls.tsx" css="src/styles/studio-control-system.css" tokens="Separate fixed 56px action family; never used as a standard/compact size alias." imports={["src/studio-ui/primitives/StudioControls.tsx"]} />}>
      <div className="vt-confirmed-variant is-full-row"><span>56px prominent workflow action</span><StudioActionButton data-vt-library-component="StudioActionButton">CREATE PACKAGE</StudioActionButton></div>
    </Family>

    <Family title="Square Icon Button · 44px + 28px"  provenance={<Provenance primitive="StudioSquareIconButton · v1/v2/v3/v4 + seven effects" tsx="src/studio-ui/primitives/StudioControls.tsx" css="src/styles/studio-control-system.css" tokens="44×44px standard / 28×28px compact; V1–V4 skins; seven opt-in interaction effects; shared Studio button shadow and motion contract." imports={["src/studio-ui/index.ts", "src/components/studio-hub/StudioHubConfirmedPrimitiveCatalog.tsx"]} />}>
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
        <span>Interaction effects · each example uses the canonical primitive at both sizes</span>
        <div className="vt-confirmed-square-effect-grid">
          <section className="vt-confirmed-square-effect-pair"><strong>POP ON ACTIVATION</strong><div className="vt-confirmed-square-effect-sizes"><StudioSquareIconButton icon={<Settings2 aria-hidden="true" />} label="Pop feedback on activation · standard" animate sizeVariant="standard" data-vt-library-component="StudioSquareIconButton" /><StudioSquareIconButton icon={<Settings2 aria-hidden="true" />} label="Pop feedback on activation · compact" animate sizeVariant="compact" data-vt-library-component="StudioSquareIconButton" /></div></section>
          <section className="vt-confirmed-square-effect-pair"><strong>NOTIFICATION BADGE · STATIC PREVIEW</strong><div className="vt-confirmed-square-effect-sizes"><StudioSquareIconButton icon={<Settings2 aria-hidden="true" />} label="Notifications · standard" effect="notification" badge={3} sizeVariant="standard" data-vt-library-component="StudioSquareIconButton" /><StudioSquareIconButton icon={<Settings2 aria-hidden="true" />} label="Notifications · compact" effect="notification" badge={3} sizeVariant="compact" data-vt-library-component="StudioSquareIconButton" /></div></section>
          <section className="vt-confirmed-square-effect-pair"><strong>ROTATED TOGGLE</strong><div className="vt-confirmed-square-effect-sizes"><StudioSquareIconButton icon={<Settings2 aria-hidden="true" />} label="Rotated toggle · standard" effect="rotated-toggle" defaultSelected sizeVariant="standard" data-vt-library-component="StudioSquareIconButton" /><StudioSquareIconButton icon={<Settings2 aria-hidden="true" />} label="Rotated toggle · compact" effect="rotated-toggle" defaultSelected sizeVariant="compact" data-vt-library-component="StudioSquareIconButton" /></div></section>
          <section className="vt-confirmed-square-effect-pair"><strong>3D FLIP</strong><div className="vt-confirmed-square-effect-sizes"><StudioSquareIconButton icon={<Settings2 aria-hidden="true" />} activeIcon={<Check aria-hidden="true" />} label="3D flip · standard" effect="flip" defaultSelected sizeVariant="standard" data-vt-library-component="StudioSquareIconButton" /><StudioSquareIconButton icon={<Settings2 aria-hidden="true" />} activeIcon={<Check aria-hidden="true" />} label="3D flip · compact" effect="flip" defaultSelected sizeVariant="compact" data-vt-library-component="StudioSquareIconButton" /></div></section>
          <section className="vt-confirmed-square-effect-pair"><strong>TOOLTIP</strong><div className="vt-confirmed-square-effect-sizes"><StudioSquareIconButton icon={<Settings2 aria-hidden="true" />} label="Tooltip · standard" effect="tooltip" tooltip="EDIT ITEM" sizeVariant="standard" data-vt-library-component="StudioSquareIconButton" /><StudioSquareIconButton icon={<Settings2 aria-hidden="true" />} label="Tooltip · compact" effect="tooltip" tooltip="EDIT ITEM" sizeVariant="compact" data-vt-library-component="StudioSquareIconButton" /></div></section>
          <section className="vt-confirmed-square-effect-pair"><strong>MORPH</strong><div className="vt-confirmed-square-effect-sizes"><StudioSquareIconButton icon={<Settings2 aria-hidden="true" />} activeIcon={<Sparkles aria-hidden="true" />} label="Morph · standard" effect="morph" defaultSelected sizeVariant="standard" data-vt-library-component="StudioSquareIconButton" /><StudioSquareIconButton icon={<Settings2 aria-hidden="true" />} activeIcon={<Sparkles aria-hidden="true" />} label="Morph · compact" effect="morph" defaultSelected sizeVariant="compact" data-vt-library-component="StudioSquareIconButton" /></div></section>
          <section className="vt-confirmed-square-effect-pair"><strong>SUCCESS STATE · STATIC PREVIEW</strong><div className="vt-confirmed-square-effect-sizes"><StudioSquareIconButton icon={<Settings2 aria-hidden="true" />} label="Success confirmation · standard" effect="success" success tooltip="SAVED" sizeVariant="standard" data-vt-library-component="StudioSquareIconButton" /><StudioSquareIconButton icon={<Settings2 aria-hidden="true" />} label="Success confirmation · compact" effect="success" success tooltip="SAVED" sizeVariant="compact" data-vt-library-component="StudioSquareIconButton" /></div></section>
          <section className="vt-confirmed-square-effect-pair"><strong>HEART POP · BLACK FILL + HEAVY RIPPLE</strong><p>Click to replay the 3-second black fill and paired heavy ripple; activation is temporary, never a persistent selection.</p><div className="vt-confirmed-square-effect-sizes"><StudioSquareIconButton iconPreset="heart" label="Heart pop · standard" effect="heart-pop" sizeVariant="standard" data-vt-library-component="StudioSquareIconButton" /><StudioSquareIconButton iconPreset="heart" label="Heart pop · compact" effect="heart-pop" sizeVariant="compact" data-vt-library-component="StudioSquareIconButton" /></div></section>
          <section className="vt-confirmed-square-effect-pair"><strong>BELL RING · ALERT DOT + RIPPLE</strong><p>Click to replay the bell rotation, alert-dot pop, and expanding perimeter ripple.</p><div className="vt-confirmed-square-effect-sizes"><StudioSquareIconButton iconPreset="bell" label="Bell ring · standard" effect="bell-ring" badge={3} sizeVariant="standard" data-vt-library-component="StudioSquareIconButton" /><StudioSquareIconButton iconPreset="bell" label="Bell ring · compact" effect="bell-ring" badge={3} sizeVariant="compact" data-vt-library-component="StudioSquareIconButton" /></div></section>
          <section className="vt-confirmed-square-effect-pair"><strong>SUN ↔ MOON · PERSISTENT TOGGLE</strong><p>Click to toggle between aligned sun and moon glyphs; outer circular geometry remains consistent.</p><div className="vt-confirmed-square-effect-sizes"><StudioSquareIconButton iconPreset="sun-moon" label="Sun / moon · standard" effect="sun-moon" sizeVariant="standard" data-vt-library-component="StudioSquareIconButton" /><StudioSquareIconButton iconPreset="sun-moon" label="Sun / moon · compact" effect="sun-moon" sizeVariant="compact" data-vt-library-component="StudioSquareIconButton" /></div></section>
          <section className="vt-confirmed-square-effect-pair"><strong>LOCK ↔ UNLOCK · SHACKLE ONLY</strong><p>Click to toggle the shackle while the lock body stays fixed in place.</p><div className="vt-confirmed-square-effect-sizes"><StudioSquareIconButton iconPreset="lock-unlock" label="Lock / unlock · standard" effect="lock-unlock" sizeVariant="standard" data-vt-library-component="StudioSquareIconButton" /><StudioSquareIconButton iconPreset="lock-unlock" label="Lock / unlock · compact" effect="lock-unlock" sizeVariant="compact" data-vt-library-component="StudioSquareIconButton" /></div></section>
          <section className="vt-confirmed-square-effect-pair"><strong>DOWNLOAD → CHECK · OUTCOME STATE</strong><p>Shows completion only when success is explicitly supplied after a successful operation.</p><div className="vt-confirmed-square-effect-sizes"><StudioSquareIconButton iconPreset="download-check" label="Download success · standard" effect="download-success" success tooltip="DOWNLOADED" sizeVariant="standard" data-vt-library-component="StudioSquareIconButton" /><StudioSquareIconButton iconPreset="download-check" label="Download success · compact" effect="download-success" success tooltip="DOWNLOADED" sizeVariant="compact" data-vt-library-component="StudioSquareIconButton" /></div></section>
          <section className="vt-confirmed-square-effect-pair"><strong>REFRESH · SPIN</strong><p>Click to replay the activation spin; the outer button geometry stays stationary.</p><div className="vt-confirmed-square-effect-sizes"><StudioSquareIconButton iconPreset="refresh" label="Refresh spin · standard" effect="refresh" sizeVariant="standard" data-vt-library-component="StudioSquareIconButton" /><StudioSquareIconButton iconPreset="refresh" label="Refresh spin · compact" effect="refresh" sizeVariant="compact" data-vt-library-component="StudioSquareIconButton" /></div></section>
          <section className="vt-confirmed-square-effect-pair"><strong>LIKE · POP + LIVE COUNT</strong><p>Click to increment the count and replay the icon pop.</p><div className="vt-confirmed-square-effect-sizes"><StudioSquareIconButton iconPreset="like" label="Like counter · standard" effect="like" badge={0} sizeVariant="standard" data-vt-library-component="StudioSquareIconButton" /><StudioSquareIconButton iconPreset="like" label="Like counter · compact" effect="like" badge={0} sizeVariant="compact" data-vt-library-component="StudioSquareIconButton" /></div></section>
        </div>
      </div>
    </Family>
    <Family title="Split-left"  provenance={<Provenance primitive="StudioSplitLeftButton" tsx="src/studio-ui/primitives/StudioControls.tsx" css="src/styles/studio-control-system.css" tokens="44px icons explicitly enlarged; selected state swaps module-pair fills." imports={["src/studio-ui/primitives/StudioControls.tsx"]} />}>
      <div className="vt-confirmed-variant is-full-row"><span>44px standard · default</span><StudioSplitLeftButton icon={<Sparkles />} sizeVariant="standard" data-vt-library-component="StudioSplitLeftButton">split-left</StudioSplitLeftButton></div>
      <div className="vt-confirmed-variant"><span>28px compact · default</span><StudioSplitLeftButton icon={<Sparkles />} sizeVariant="compact">split-left</StudioSplitLeftButton></div><div className="vt-confirmed-variant"><span>28px compact · neutral tone</span><StudioSplitLeftButton icon={<Sparkles />} tone="neutral" sizeVariant="compact">split-left</StudioSplitLeftButton></div>
      <div className="vt-confirmed-variant is-full-row"><span>44px standard · selected</span><StudioSplitLeftButton icon={<Settings2 />} selected sizeVariant="standard">split-left</StudioSplitLeftButton></div>
      <div className="vt-confirmed-variant"><span>28px compact · selected</span><StudioSplitLeftButton icon={<Settings2 />} selected sizeVariant="compact">split-left</StudioSplitLeftButton></div><div className="vt-confirmed-variant"><span>28px compact · selected + disabled</span><StudioSplitLeftButton icon={<Settings2 />} selected disabled sizeVariant="compact">split-left</StudioSplitLeftButton></div>
    </Family>
    <Family
      title="Button + Split-left · Complete Variant Matrix"
      
      provenance={<Provenance primitive="StudioButton / StudioSplitLeftButton" tsx="src/studio-ui/primitives/StudioControls.tsx" css="src/styles/studio-control-system.css" tokens="44px standard · 28px compact · five semantic tones · selected / disabled / loading · shared tactile press motion" imports={["src/studio-ui/primitives/StudioControls.tsx", "src/components/studio-hub/StudioHubConfirmedPrimitiveCatalog.tsx"]} />}
    >
      <div className="vt-confirmed-variant is-full-row">
        <span>STANDARD · SEMANTIC TONES</span>
        <div className="vt-confirmed-square-variant-grid">
          {(["accent", "neutral", "danger", "warning", "success"] as const).map(tone => <StudioButton key={tone} sizeVariant="standard" tone={tone}>{tone}</StudioButton>)}
        </div>
      </div>
      <div className="vt-confirmed-variant is-full-row">
        <span>COMPACT · SEMANTIC TONES</span>
        <div className="vt-confirmed-square-variant-grid">
          {(["accent", "neutral", "danger", "warning", "success"] as const).map(tone => <StudioButton key={tone} sizeVariant="compact" tone={tone}>{tone}</StudioButton>)}
        </div>
      </div>
      <div className="vt-confirmed-variant is-full-row">
        <span>SPLIT-LEFT · FIVE TONES</span>
        <div className="vt-confirmed-square-variant-grid">
          {(["accent", "neutral", "danger", "warning", "success"] as const).map(tone => <StudioSplitLeftButton key={tone} icon={<Settings2 aria-hidden="true" />} sizeVariant="standard" tone={tone}>{tone}</StudioSplitLeftButton>)}
        </div>
      </div>
      <div className="vt-confirmed-variant is-full-row">
        <span>STATE VARIANTS · SELECTED / DISABLED / LOADING</span>
        <div className="vt-confirmed-square-variant-grid">
          <StudioButton sizeVariant="standard" selected>selected</StudioButton>
          <StudioButton sizeVariant="standard" disabled>disabled</StudioButton>
          <StudioButton sizeVariant="standard" loading>loading</StudioButton>
          <StudioSplitLeftButton icon={<Check aria-hidden="true" />} sizeVariant="standard" selected>selected</StudioSplitLeftButton>
          <StudioSplitLeftButton icon={<Settings2 aria-hidden="true" />} sizeVariant="standard" disabled>disabled</StudioSplitLeftButton>
          <StudioSplitLeftButton icon={<Settings2 aria-hidden="true" />} sizeVariant="standard" loading>loading</StudioSplitLeftButton>
        </div>
      </div>
    </Family>
    <Family
      title="Square Icon Button · All Presets + Animations"
      
      provenance={<Provenance primitive="StudioSquareIconButton · complete preset/effect matrix" tsx="src/studio-ui/primitives/StudioControls.tsx" css="src/styles/studio-control-system.css" tokens="V1–V4 · 44×44px / 28×28px · 7 presets · all 17 effect modes · shared labels and motion" imports={["src/studio-ui/index.ts", "src/studio-ui/primitives/StudioControls.tsx"]} />}
    >
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
      title="Play/Pause Split-left Button · 44px + 28px"
      
      provenance={<Provenance primitive="StudioPlayPauseButton" tsx="src/studio-ui/primitives/StudioControls.tsx" css="src/styles/studio-control-system.css" tokens="Canonical StudioSplitLeftButton composition; stable Play/Pause label geometry; selected-color swap; 44px / 28px sizes." imports={["src/studio-ui/primitives/StudioControls.tsx"]} />}
    >
      <div className="vt-confirmed-variant is-full-row">
        <span>44px standard · click to toggle Play / Pause</span>
        <StudioPlayPauseButton sizeVariant="standard" data-vt-library-component="StudioPlayPauseButton" />
      </div>
      <div className="vt-confirmed-variant">
        <span>28px compact · click to toggle</span>
        <StudioPlayPauseButton sizeVariant="compact" data-vt-library-component="StudioPlayPauseButton" />
      </div>
      <div className="vt-confirmed-variant">
        <span>28px compact · starts selected</span>
        <StudioPlayPauseButton sizeVariant="compact" defaultPlaying data-vt-library-component="StudioPlayPauseButton" />
      </div>
    </Family>
    <Family
      title="Circle Icon Button · 44px + 28px"
      nonDefaultSettings={[
        "Circular shape uses 80% of the canonical large icon preset: 30.4px / 1.9 stroke standard and 19.2px / 2.0 compact."
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
      title="Username Split-left Input · 44px + 28px"
      
      provenance={<Provenance primitive="StudioUsernameInput" tsx="src/studio-ui/primitives/StudioControls.tsx" css="src/styles/studio-control-system.css" tokens="Composite of canonical StudioTextInput and split-left icon rail; 44px / 28px geometry; no shadow; wrapper focus ring." imports={["src/studio-ui/primitives/StudioControls.tsx"]} />}
    >
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
    </Family>
    <Family
      title="Global Rules Exceptions · Vault Spectrum Tags"
      nonDefaultSettings={[
        "Dense metadata exception: 15px height, spectrum-derived border/text, 35% color fill, and opt-in selected glow."
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
        "Closeable badge exception: 20px pill with 16px label and animated close affordance.",
        "Tag editor action exception: 32px square plus/check controls with 3px stroke, 8px radius, and 4px pair-color shadow."
      ]}
      provenance={<Provenance
        primitive="StudioCloseableBadge / StudioTagEditor"
        tsx="src/studio-ui/primitives/StudioControls.tsx"
        css="src/styles/studio-control-system.css"
        tokens={`Badge H ${STUDIO_CONTROL_GLOBAL_RULE_EXCEPTIONS.closeableBadge.height}px · label ${STUDIO_CONTROL_GLOBAL_RULE_EXCEPTIONS.closeableBadge.fontSize}px / ${STUDIO_CONTROL_GLOBAL_RULE_EXCEPTIONS.closeableBadge.fontWeight} · action H ${STUDIO_CONTROL_GLOBAL_RULE_EXCEPTIONS.tagEditorAction.height}px / stroke ${STUDIO_CONTROL_GLOBAL_RULE_EXCEPTIONS.tagEditorAction.stroke}px / radius ${STUDIO_CONTROL_GLOBAL_RULE_EXCEPTIONS.tagEditorAction.radius}px`}
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
      title="Simple Dropdown · Single Selection"
      
      provenance={<Provenance primitive="StudioSimpleDropdown" tsx="src/studio-ui/primitives/StudioControls.tsx" css="src/styles/studio-control-system.css" tokens="Studio Controls standard/compact sizes, Inter 1000 uppercase, inherited palette pair" imports={["src/studio-ui/primitives/StudioControls.tsx"]} />}
    >
      <div className="vt-confirmed-variant is-full-row">
        <span>Standard · single select</span>
        <StudioSimpleDropdown aria-label="Example simple dropdown" defaultValue="balanced" options={[{ value: "light", label: "Light" }, { value: "balanced", label: "Balanced" }, { value: "aggressive", label: "Aggressive" }]} />
        <span>Single select · three-set choice</span>
        <StudioSimpleDropdown aria-label="Example three-set dropdown" defaultValue="three" options={[{ value: "one", label: "One set" }, { value: "three", label: "Three sets" }, { value: "five", label: "Five sets" }]} />
      </div>
    </Family>
    <ConfirmedInlineStepperFamily />
    <ConfirmedStepperFamily />
  </div>
)

export default StudioHubConfirmedPrimitiveCatalog