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
  StudioCounter,
  StudioRightCounter,
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
    <Family title="44px Switches" nonDefaultSettings={[
        "Alternate selected-indicator skins: COLOR SWAP, BLACK, and WHITE.",
        "Round and rectangular variants change track/handle geometry.",
      ]} provenance={<Provenance primitive="StudioSwitch" tsx="src/studio-ui/primitives/StudioControls.tsx" css="src/styles/studio-control-system.css" tokens="75.68×44px track; shared four-skin variants." imports={["src/studio-ui/primitives/StudioControls.tsx"]} />}>
      <div className="vt-confirmed-control-family">{(["round", "rect"] as const).map((shape, row) => <div className="vt-confirmed-control-row" key={shape}><strong>{shape === "round" ? "ROUND" : "RECTANGULAR"}</strong><div className="vt-confirmed-control-variants">{CANONICAL_SKINS.map((skin, col) => { const index = row * 4 + col; return <div key={skin.skin}><small>{skin.label}</small><StudioSwitch shape={shape} skin={skin.skin} checked={switches[index]} aria-label={shape + " " + skin.label} onClick={() => flip(setSwitches, index)} /></div> })}</div></div>)}</div>
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
    <Family title="44px Radio + Checkbox" nonDefaultSettings={[
        "Radio, checkmark checkbox, and wide-X checkbox remain distinct public selection-mark variants.",
        "Alternate selected-indicator skins: COLOR SWAP, BLACK, and WHITE.",
      ]} provenance={<Provenance primitive="StudioRadio / StudioCheckbox / StudioXCheckbox" tsx="src/studio-ui/primitives/StudioControls.tsx" css="src/styles/studio-control-system.css" tokens="44×44px controls; checkmark and wide-X checkbox marks." imports={["src/studio-ui/primitives/StudioControls.tsx"]} />}>
      <div className="vt-confirmed-control-family">{([{Component:StudioRadio,label:"CIRCULAR RADIO",shape:"round" as const},{Component:StudioCheckbox,label:"CHECKMARK CHECKBOX",shape:"rect" as const},{Component:StudioXCheckbox,label:"WIDE-X CHECKBOX",shape:"rect" as const}]).map((item,row) => { const ChoiceComponent = item.Component; return <div className="vt-confirmed-control-row" key={item.label}><strong>{item.label}</strong><div className="vt-confirmed-control-variants">{CANONICAL_SKINS.map((skin,col) => { const index = row * 4 + col; return <div key={skin.skin}><small>{skin.label}</small><ChoiceComponent shape={item.shape} skin={skin.skin} checked={choices[index]} aria-label={item.label + " " + skin.label} onClick={() => flip(setChoices, index)} /></div> })}</div></div> })}</div>
    </Family>
    <Family title="Word Toggles · 44px + 28px" nonDefaultSettings={[
        "Alternate active-handle skins: COLOR SWAP and BLACK.",
      ]} provenance={<Provenance primitive="StudioWordToggle" tsx="src/studio-ui/primitives/StudioControls.tsx" css="src/styles/studio-control-system.css" tokens="Text-measured active handle; standard and compact variants." imports={["src/studio-ui/primitives/StudioControls.tsx"]} />}>
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

const ConfirmedStudioCounterFamily: React.FC = () => {
  const [standardValue, setStandardValue] = React.useState(22)
  const [compactValue, setCompactValue] = React.useState(3)
  const [microValue, setMicroValue] = React.useState(7)
  return (
    <Family
      title="StudioCounter · Standard + Compact + Micro"
      nonDefaultSettings={[
        "New independent button-only counter primitive; not composed from legacy steppers.",
        "Square decrement/increment rails with a 2:1 read-only numeric display.",
      ]}
      provenance={<Provenance
        primitive="StudioCounter"
        tsx="src/studio-ui/primitives/StudioControls.tsx"
        css="src/styles/studio-control-system.css"
        tokens="Double-split badge foundation · 44px / 28px / 14px · square rails · 2:1 display · buttons-only value control."
        imports={["src/studio-ui/primitives/StudioControls.tsx"]}
      />}
    >
      <div className="vt-confirmed-variant is-full-row vt-confirmed-counter-row">
        <div className="vt-confirmed-counter-row-grid vt-confirmed-counter-row-grid--paired">
          <div className="vt-confirmed-counter-specimen"><small>44px standard · primary / secondary</small><div className="vt-confirmed-counter-pair"><StudioCounter value={standardValue} onValueChange={setStandardValue} size="standard" min={0} max={100} ariaLabel="Standard counter" /><StudioCounter className="is-reversed" value={standardValue} onValueChange={setStandardValue} size="standard" min={0} max={100} ariaLabel="Standard counter secondary palette" /></div></div>
          <div className="vt-confirmed-counter-specimen"><small>28px compact · primary / secondary</small><div className="vt-confirmed-counter-pair"><StudioCounter value={compactValue} onValueChange={setCompactValue} size="compact" min={0} max={100} ariaLabel="Compact counter" /><StudioCounter className="is-reversed" value={compactValue} onValueChange={setCompactValue} size="compact" min={0} max={100} ariaLabel="Compact counter secondary palette" /></div></div>
          <div className="vt-confirmed-counter-specimen"><small>14px micro · primary / secondary</small><div className="vt-confirmed-counter-pair"><StudioCounter value={microValue} onValueChange={setMicroValue} size="micro" min={0} max={100} ariaLabel="Micro counter" /><StudioCounter className="is-reversed" value={microValue} onValueChange={setMicroValue} size="micro" min={0} max={100} ariaLabel="Micro counter secondary palette" /></div></div>
        </div>
      </div>
    </Family>
  )
}

const ConfirmedStudioRightCounterFamily: React.FC = () => {
  const [standardValue, setStandardValue] = React.useState(5)
  const [compactValue, setCompactValue] = React.useState(3)
  const [microValue, setMicroValue] = React.useState(8)
  return (
    <Family
      title="StudioRightCounter · Standard + Compact + Micro"
      nonDefaultSettings={[
        "New independent button-only counter primitive; not composed from legacy steppers.",
        "2:1 read-only numeric display and square right rail with two equal action cells.",
        "Single chevrons and a horizontal divider between the action buttons.",
      ]}
      provenance={<Provenance
        primitive="StudioRightCounter"
        tsx="src/studio-ui/primitives/StudioControls.tsx"
        css="src/styles/studio-control-system.css"
        tokens="Split-right badge foundation · 44px / 28px / 14px · 2:1 display-to-square-rail ratio."
        imports={["src/studio-ui/primitives/StudioControls.tsx"]}
      />}
    >
      <div className="vt-confirmed-variant is-full-row vt-confirmed-counter-row">
        <div className="vt-confirmed-counter-row-grid vt-confirmed-counter-row-grid--paired">
          <div className="vt-confirmed-counter-specimen"><small>44px standard · primary / secondary</small><div className="vt-confirmed-counter-pair"><StudioRightCounter value={standardValue} onValueChange={setStandardValue} size="standard" min={0} max={100} ariaLabel="Standard right counter" /><StudioRightCounter className="is-reversed" value={standardValue} onValueChange={setStandardValue} size="standard" min={0} max={100} ariaLabel="Standard right counter secondary palette" /></div></div>
          <div className="vt-confirmed-counter-specimen"><small>28px compact · primary / secondary</small><div className="vt-confirmed-counter-pair"><StudioRightCounter value={compactValue} onValueChange={setCompactValue} size="compact" min={0} max={100} ariaLabel="Compact right counter" /><StudioRightCounter className="is-reversed" value={compactValue} onValueChange={setCompactValue} size="compact" min={0} max={100} ariaLabel="Compact right counter secondary palette" /></div></div>
          <div className="vt-confirmed-counter-specimen"><small>14px micro · primary / secondary</small><div className="vt-confirmed-counter-pair"><StudioRightCounter value={microValue} onValueChange={setMicroValue} size="micro" min={0} max={100} ariaLabel="Micro right counter" /><StudioRightCounter className="is-reversed" value={microValue} onValueChange={setMicroValue} size="micro" min={0} max={100} ariaLabel="Micro right counter secondary palette" /></div></div>
        </div>
      </div>
    </Family>
  )
}

/** Certified production examples only. This catalog uses the real Studio Hub exports. */
export const StudioHubConfirmedPrimitiveCatalog: React.FC = () => (
  <div className="vt-confirmed-catalog">
    <section className="vt-confirmed-family vt-confirmed-defaults-combined" aria-labelledby="vt-confirmed-global-defaults-title">
      <h3 id="vt-confirmed-global-defaults-title">Global Defaults · Current Source Contract</h3>
      <p className="vt-confirmed-defaults-summary">44px standard · 28px compact · 14px micro · 3px / 2px / 1px borders · 6px / 4px / 2px radii · Inter 1000 uppercase with size-scaled text stroke · 4px standard gap · row-fill by default; data-width="content" opts into intrinsic width · single-line input 38px / 24px · textarea 18px / 14px</p>
      <p><a href="https://github.com/viewtube-dev/viewtube/blob/master/consolidated-feature-integration/docs/ui/STUDIO_CONTROLS_GLOBAL_DEFAULTS_AND_EXCEPTION_INDEX.md" target="_blank" rel="noreferrer">Global defaults, exception index, and certification rules ↗</a></p>
      <details className="vt-confirmed-defaults-details">
        <summary>Show current defaults, effective CSS behavior, and exceptions</summary>
        <div className="vt-confirmed-size-grid">
          <div className="vt-confirmed-size-card"><strong>44PX STANDARD</strong><span>H {STUDIO_COMPONENT_SIZE_DEFAULTS.standard.height}px · Stroke {STUDIO_COMPONENT_SIZE_DEFAULTS.standard.stroke}px · R {STUDIO_COMPONENT_SIZE_DEFAULTS.standard.radius}px · Font {STUDIO_COMPONENT_SIZE_DEFAULTS.standard.fontSize}px / weight {STUDIO_COMPONENT_SIZE_DEFAULTS.standard.fontWeight}</span><span>Flat default: no shadow, hover offset, or press offset · icon {STUDIO_COMPONENT_SIZE_DEFAULTS.standard.iconSize}px / stroke {STUDIO_COMPONENT_SIZE_DEFAULTS.standard.iconStroke}</span></div>
          <div className="vt-confirmed-size-card"><strong>28PX COMPACT</strong><span>H {STUDIO_COMPONENT_SIZE_DEFAULTS.compact.height}px · Stroke {STUDIO_COMPONENT_SIZE_DEFAULTS.compact.stroke}px · R {STUDIO_COMPONENT_SIZE_DEFAULTS.compact.radius}px · Font {STUDIO_COMPONENT_SIZE_DEFAULTS.compact.fontSize}px / weight {STUDIO_COMPONENT_SIZE_DEFAULTS.compact.fontWeight}</span><span>Flat default: no shadow, hover offset, or press offset · icon {STUDIO_COMPONENT_SIZE_DEFAULTS.compact.iconSize}px / stroke {STUDIO_COMPONENT_SIZE_DEFAULTS.compact.iconStroke}</span></div>
        </div>
        <div className="vt-confirmed-size-card"><strong>SINGLE-LINE INPUTS · GLOBAL TYPOGRAPHY</strong><span>Standard {STUDIO_COMPONENT_SIZE_DEFAULTS.textInput.standardFontSize}px · compact {STUDIO_COMPONENT_SIZE_DEFAULTS.textInput.compactFontSize}px · weight {STUDIO_COMPONENT_SIZE_DEFAULTS.textInput.fontWeight} · line-height {STUDIO_COMPONENT_SIZE_DEFAULTS.textInput.lineHeight}</span><span>Inputs keep the selected 44px / 28px geometry and use the global single-line type scale.</span></div>
        <div className="vt-confirmed-size-card vt-confirmed-field-typography-exception"><strong>MULTILINE TEXTAREA · REGISTERED EXCEPTION</strong><span>Standard {STUDIO_COMPONENT_SIZE_DEFAULTS.multiline.standardFontSize}px · compact {STUDIO_COMPONENT_SIZE_DEFAULTS.multiline.compactFontSize}px · minimum surface {STUDIO_COMPONENT_SIZE_DEFAULTS.multiline.minHeight}px · weight {STUDIO_COMPONENT_SIZE_DEFAULTS.multiline.fontWeight}</span><span>Textarea-only multiline line-height, padding, and vertical resizing; selected size still controls height family, border, and radius.</span></div>
        <div className="vt-confirmed-size-card vt-confirmed-action-exception"><strong>PROMINENT ACTION · FLAT 56PX FAMILY</strong><span>56px fixed height · 3px stroke · 6px radius · 20px Inter / weight 1000 text · flat and stationary.</span><span>StudioActionButton is a separate 56px action family; global flat-control contract removes shell shadows, transitions, and hover/press movement.</span></div>
        <div className="vt-confirmed-global-grid">{Object.entries(STUDIO_COMPONENT_GLOBAL_DEFAULTS).map(([key, value]) => <div key={key}><strong>{key.replace(/([A-Z])/g, " $1")}</strong><span>{formatDefaultValue(value)}</span></div>)}</div>
        <div className="vt-confirmed-defaults-explainer">
          <strong>HOW TO READ THE CURRENT CONTRACT</strong>
          <p><b>Geometry:</b> standard is 44px high / 3px border / 6px radius; compact is 28px / 2px / 4px. Default type is Inter, weight 1000, uppercase, -0.02em tracking, and 0.86 line-height unless a family exception is documented.</p>
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
        <li><strong>DROPDOWN:</strong> the trigger uses standard/compact sizing; menu rows and options are not button-press surfaces. A floating panel may have its own stationary shadow. Panel typography and stacking use dropdown-specific CSS.</li>
        <li><strong>SQUARE / CIRCLE ICON BUTTONS:</strong> share the standard/compact size lattice and default flat, stationary shell behavior. Large icon preset is default; circle buttons scale it to 80%. V1–V4 skins and documented inner-icon effects are explicit variants, not global shell behavior.</li>
        <li><strong>VAULT SPECTRUM TAG:</strong> registered 15px dense metadata chip with 2px border, 4px radius, 8px / weight-900 type, 35% white-mixed spectrum fill, and flat selected-state color treatment with no shadow, glow, or geometry offset.</li>
        <li><strong>CLOSEABLE BADGE:</strong> follows the standard / compact / micro 44px / 28px / 14px size lattice, 3px / 2px / 1px stroke, 6px / 4px / 2px radius, and 38px / 24px / 10px type. The close action is circular and secondary-filled; no pill-ratio shell exception.</li>
        <li><strong>TAG EDITOR ACTION:</strong> registered compact 28px square plus/check action, 2px stroke and 4px radius with a no shadow under the global flat-control contract.</li>
        <li><strong>SPLIT-LEFT BADGE MICRO DENSITY:</strong> informational badge examples include a 14px / 1px-stroke micro size in addition to standard 44px / 3px and compact 28px / 2px. Micro is a local exception, not a global control size.</li>
        <li><strong>FIELD CARET + FOCUS:</strong> native insertion caret is retained; <code>caret-shape: block</code> is requested where supported and must not be simulated with a fake overlay. Focus uses the secondary outline at 65% of the selected border width and 0px offset; verify computed styles in a rendered browser.</li>
        <li><strong>REDUCED MOTION:</strong> primitive shells have no default transitions or movement. Explicitly registered inner-icon effects must honor reduced-motion preferences.</li>
        <li><strong>VERIFICATION BOUNDARY:</strong> source text and source tests do not certify the live deployment. Verify standard/compact dimensions, effective shadows/transforms, selected/disabled/loading states, keyboard focus, dropdown stacking, narrow layouts, and reduced motion in a browser.</li>
      </ul>
      <p><strong>Audit status:</strong> this library records the canonical global defaults. A primitive is not certified until its production rendering, tokens, effective CSS, and responsive/accessibility behavior agree with this contract.</p>
    </section>
    <Family title="Studio Text Input · Standalone + Simple + Floating + Fixed Label" nonDefaultSettings={[
        "Floating and fixed-label presentations share one native input.",
        "Raised labels shrink to 80%; compact B reverses the paired colors.",
      ]} provenance={<Provenance primitive="StudioTextInput" tsx="src/studio-ui/primitives/StudioControls.tsx" css="src/styles/studio-control-system.css" tokens="One native input family with simple and floating-label variants; standard 44px / compact 28px geometry and global 38px / 24px typography." imports={["src/studio-ui/primitives/StudioControls.tsx"]} />}>
      <div className="vt-confirmed-variant is-full-row"><span>44px standard · StudioTextInput</span><StudioTextInput sizeVariant="standard" aria-label="Studio text input 44px" placeholder="TYPE HERE" data-vt-library-component="StudioTextInput" /></div>
      <div className="vt-confirmed-variant"><span>28px compact A · StudioTextInput</span><StudioTextInput sizeVariant="compact" aria-label="Studio text input 28px A" placeholder="TYPE HERE" data-vt-library-component="StudioTextInput" /></div><div className="vt-confirmed-variant"><span>28px compact · disabled</span><StudioTextInput sizeVariant="compact" aria-label="Studio text input 28px disabled" placeholder="TYPE HERE" disabled data-vt-library-component="StudioTextInput" /></div>
      <div className="vt-confirmed-variant is-full-row"><span>Floating label · 44px standard · A</span><StudioTextInput variant="floating-label" floatingLabelVariant="a" label="TITLE" aria-label="Studio floating-label input standard A" sizeVariant="standard" data-vt-library-component="StudioTextInput" /></div>
      <div className="vt-confirmed-variant"><span>Floating label · 28px compact · A</span><StudioTextInput variant="floating-label" floatingLabelVariant="a" label="TITLE" aria-label="Studio floating-label input compact A" sizeVariant="compact" data-vt-library-component="StudioTextInput" /></div>
      <div className="vt-confirmed-variant"><span>Floating label · 28px compact · B · reverse colors</span><StudioTextInput className="is-reverse-colors" variant="floating-label" floatingLabelVariant="b" label="TITLE" aria-label="Studio floating-label input compact B reverse colors" sizeVariant="compact" data-vt-library-component="StudioTextInput" /></div>
      <div className="vt-confirmed-variant is-full-row"><span>Fixed label box · 44px standard · A</span><StudioTextInput variant="fixed-label" label="TITLE" aria-label="Studio fixed-label input standard A" sizeVariant="standard" data-vt-library-component="StudioTextInput" /></div>
      <div className="vt-confirmed-variant"><span>Fixed label box · 28px compact · A</span><StudioTextInput variant="fixed-label" label="TITLE" aria-label="Studio fixed-label input compact A" sizeVariant="compact" data-vt-library-component="StudioTextInput" /></div>
      <div className="vt-confirmed-variant"><span>Fixed label box · 28px compact · B · reverse colors</span><StudioTextInput className="is-reverse-colors" variant="fixed-label" label="TITLE" aria-label="Studio fixed-label input compact B reverse colors" sizeVariant="compact" data-vt-library-component="StudioTextInput" /></div>
    </Family>
    <Family title="Studio Text Area · Standalone + Simple + Floating + Fixed Label" nonDefaultSettings={[
        "Multiline-only exception: 18px standard / 14px compact typography, distinct line-height and padding, and a 92px minimum writing surface.",
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
    <Family title="Icon Button · 44px + 28px" nonDefaultSettings={[
        "Icon-only wrapper over StudioButton; the label provides the accessible name and the icon is decorative.",
        "Current and moderate icon presets are opt-in.",
      ]} provenance={<Provenance primitive="StudioIconButton" tsx="src/studio-ui/primitives/StudioControls.tsx" css="src/styles/studio-control-system.css" tokens="44px / 28px; shared StudioButton interaction contract." imports={["src/studio-ui/index.ts"]} />}><div className="vt-confirmed-variant is-full-row"><span>44px standard · semantic tones</span><div className="vt-confirmed-square-variant-grid">{(["accent","neutral","danger","warning","success"] as const).map(tone => <StudioIconButton key={tone} icon={<Settings2 aria-hidden="true" />} label={tone + " action"} tone={tone} sizeVariant="standard" data-vt-library-component="StudioIconButton" />)}</div></div><div className="vt-confirmed-variant is-full-row"><span>28px compact · semantic tones</span><div className="vt-confirmed-square-variant-grid">{(["accent","neutral","danger","warning","success"] as const).map(tone => <StudioIconButton key={tone} icon={<Settings2 aria-hidden="true" />} label={tone + " compact action"} tone={tone} sizeVariant="compact" data-vt-library-component="StudioIconButton" />)}</div></div><div className="vt-confirmed-variant"><span>Selected</span><StudioIconButton icon={<Check aria-hidden="true" />} label="Selected icon action" selected sizeVariant="standard" data-vt-library-component="StudioIconButton" /></div><div className="vt-confirmed-variant"><span>Disabled</span><StudioIconButton icon={<Settings2 aria-hidden="true" />} label="Disabled icon action" disabled sizeVariant="standard" data-vt-library-component="StudioIconButton" /></div><div className="vt-confirmed-variant"><span>Loading</span><StudioIconButton icon={<Sparkles aria-hidden="true" />} label="Loading icon action" loading sizeVariant="standard" data-vt-library-component="StudioIconButton" /></div></Family>
    <Family title="Prominent Action · 56px" nonDefaultSettings={[
        "Dedicated 56px action family with 20px label typography; it is not a third ordinary-button size.",
      ]} provenance={<Provenance primitive="StudioActionButton" tsx="src/studio-ui/primitives/StudioControls.tsx" css="src/styles/studio-control-system.css" tokens="Separate fixed 56px action family; never used as a standard/compact size alias." imports={["src/studio-ui/primitives/StudioControls.tsx"]} />}>
      <div className="vt-confirmed-variant is-full-row"><span>56px prominent workflow action</span><StudioActionButton data-vt-library-component="StudioActionButton">CREATE PACKAGE</StudioActionButton></div>
    </Family>

    <Family title="Square Icon Button · 44px + 28px" nonDefaultSettings={[
        "V1–V4 skins change fill and icon color only.",
        "Inner-icon feedback effects are opt-in; success styling must follow a real successful operation.",
      ]} provenance={<Provenance primitive="StudioSquareIconButton · v1/v2/v3/v4 + seven effects" tsx="src/studio-ui/primitives/StudioControls.tsx" css="src/styles/studio-control-system.css" tokens="44×44px standard / 28×28px compact; V1–V4 skins; seven opt-in inner-icon effects; no default shell shadow or motion." imports={["src/studio-ui/index.ts", "src/components/studio-hub/StudioHubConfirmedPrimitiveCatalog.tsx"]} />}>
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
    <Family title="Split-left" nonDefaultSettings={[
        "Selected state swaps face and icon-rail colors.",
        "Fixed icon rail and centered label are component-specific anatomy.",
      ]} provenance={<Provenance primitive="StudioSplitLeftButton" tsx="src/studio-ui/primitives/StudioControls.tsx" css="src/styles/studio-control-system.css" tokens="44px icons explicitly enlarged; selected state swaps module-pair fills." imports={["src/studio-ui/primitives/StudioControls.tsx"]} />}>
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
      nonDefaultSettings={[
        "Icon presets and inner-icon effects are opt-in variants.",
        "Success is demonstration-only unless the product operation actually succeeded.",
      ]}
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
      title="Username Split-left Input · 44px + 28px"
      nonDefaultSettings={[
        "Icon rail is part of the field, not an action button.",
        "Wrapper owns the focus outline/border; editable area reuses StudioTextInput.",
      ]}
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
    <ConfirmedStudioCounterFamily />
    <ConfirmedStudioRightCounterFamily />
  </div>
)

export default StudioHubConfirmedPrimitiveCatalog