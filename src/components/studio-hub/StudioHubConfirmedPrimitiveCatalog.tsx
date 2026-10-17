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
    <Family title="44px Switches" nonDefaultSettings={["Default state is OFF; selected state moves the indicator and changes the active treatment.","Round and rectangular shapes alter track/handle geometry, not the 44px height.","SOLID is the default skin; COLOR SWAP, BLACK, and WHITE are explicit alternate selected-indicator skins.","Disabled switches are non-interactive and muted; transitions and reduced-motion overrides are component-specific."]} provenance={<Provenance primitive="StudioSwitch" tsx="src/studio-ui/primitives/StudioControls.tsx" css="src/styles/studio-control-system.css" tokens="75.68×44px track; shared four-skin variants." imports={["src/studio-ui/primitives/StudioControls.tsx"]} />}>
      <div className="vt-confirmed-control-family">{(["round", "rect"] as const).map((shape, row) => <div className="vt-confirmed-control-row" key={shape}><strong>{shape === "round" ? "ROUND" : "RECTANGULAR"}</strong><div className="vt-confirmed-control-variants">{CANONICAL_SKINS.map((skin, col) => { const index = row * 4 + col; return <div key={skin.skin}><small>{skin.label}</small><StudioSwitch shape={shape} skin={skin.skin} checked={switches[index]} aria-label={shape + " " + skin.label} onClick={() => flip(setSwitches, index)} /></div> })}</div></div>)}</div>
    </Family>
    <Family
      title="Split-left Badge · Standard + Compact + Micro"
      nonDefaultSettings={["This is an informational badge using split-left rail anatomy, not an action button.","Standard is 44px / 3px stroke; compact 28px / 2px; micro is a 14px / 1px-stroke density exception.","The badge uses a 44px pill radius and does not use the button activation contract.","Standard, compact, and global 14px micro sizes use the shared split-badge foundation; all badge labels center like StudioButton and all sides use the global 4px spacing unit."]}
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
    <Family title="44px Radio + Checkbox" nonDefaultSettings={["Radio, checkmark checkbox, and wide-X checkbox are separate public controls with different selection marks.","Shape changes the outer control; wide-X changes the mark, not the geometry family.","SOLID is default; COLOR SWAP, BLACK, and WHITE are explicit selected-indicator variants. Disabled controls cannot be changed."]} provenance={<Provenance primitive="StudioRadio / StudioCheckbox / StudioXCheckbox" tsx="src/studio-ui/primitives/StudioControls.tsx" css="src/styles/studio-control-system.css" tokens="44×44px controls; checkmark and wide-X checkbox marks." imports={["src/studio-ui/primitives/StudioControls.tsx"]} />}>
      <div className="vt-confirmed-control-family">{([{Component:StudioRadio,label:"CIRCULAR RADIO",shape:"round" as const},{Component:StudioCheckbox,label:"CHECKMARK CHECKBOX",shape:"rect" as const},{Component:StudioXCheckbox,label:"WIDE-X CHECKBOX",shape:"rect" as const}]).map((item,row) => { const ChoiceComponent = item.Component; return <div className="vt-confirmed-control-row" key={item.label}><strong>{item.label}</strong><div className="vt-confirmed-control-variants">{CANONICAL_SKINS.map((skin,col) => { const index = row * 4 + col; return <div key={skin.skin}><small>{skin.label}</small><ChoiceComponent shape={item.shape} skin={skin.skin} checked={choices[index]} aria-label={item.label + " " + skin.label} onClick={() => flip(setChoices, index)} /></div> })}</div></div> })}</div>
    </Family>
    <Family title="Word Toggles · 44px + 28px" nonDefaultSettings={["Standard is 44px; size 28 selects the 28px compact version.","SOLID is default; COLOR SWAP and BLACK are alternate active-handle treatments.","False selects the first word and true the second; custom words change labels, not the boolean state contract."]} provenance={<Provenance primitive="StudioWordToggle" tsx="src/studio-ui/primitives/StudioControls.tsx" css="src/styles/studio-control-system.css" tokens="Text-measured active handle; standard and compact variants." imports={["src/studio-ui/primitives/StudioControls.tsx"]} />}>
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
      nonDefaultSettings={["Horizontal decrement / editable value / increment composition with square side actions and a 1:2:1 layout.","Standard 44px and compact 28px use shared Studio size, stroke, radius, typography, and color-pair tokens.","Typing, step/min/max bounds, and accessible action labels are supported. This horizontal primitive is distinct from the vertical-rail StudioSplitStepper."]}
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
      nonDefaultSettings={["Standard is 44px; compact is 28px. Width is fixed rather than auto/full-width.","The value pane uses a 2:1 width-to-height proportion; the right rail contains two vertically stacked 2:1 buttons.","Typing, bounds, step, disabled state, primary inline stroke/fill, and chevron sizing are component-specific. The family is documented as shadowless; verify cascading CSS before certification."]}
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
    <section className="vt-confirmed-family vt-confirmed-defaults-combined" aria-labelledby="vt-confirmed-global-defaults-title">
      <h3 id="vt-confirmed-global-defaults-title">Global Defaults · Current Source Contract</h3>
      <p className="vt-confirmed-defaults-summary">44px standard · 28px compact · 14px micro · 3px / 2px / 1px borders · 6px / 4px / 2px radii · Inter 1000 uppercase with size-scaled text stroke · 4px standard gap · row-fill by default; data-width="content" opts into intrinsic width · single-line input 38px / 24px · textarea 18px / 14px</p>
      <details className="vt-confirmed-defaults-details">
        <summary>Show current defaults, effective CSS behavior, and exceptions</summary>
        <div className="vt-confirmed-size-grid">
          <div className="vt-confirmed-size-card"><strong>44PX STANDARD</strong><span>H {STUDIO_COMPONENT_SIZE_DEFAULTS.standard.height}px · Stroke {STUDIO_COMPONENT_SIZE_DEFAULTS.standard.stroke}px · R {STUDIO_COMPONENT_SIZE_DEFAULTS.standard.radius}px · Font {STUDIO_COMPONENT_SIZE_DEFAULTS.standard.fontSize}px / weight {STUDIO_COMPONENT_SIZE_DEFAULTS.standard.fontWeight}</span><span>Registered token values: shadow {STUDIO_COMPONENT_SIZE_DEFAULTS.standard.buttonShadowX}×{STUDIO_COMPONENT_SIZE_DEFAULTS.standard.buttonShadowY}px · hover offset {STUDIO_COMPONENT_SIZE_DEFAULTS.standard.hoverOffsetPx}px / {STUDIO_COMPONENT_SIZE_DEFAULTS.standard.hoverTransitionMs}ms · press offset {STUDIO_COMPONENT_SIZE_DEFAULTS.standard.clickOffsetPx}px / {STUDIO_COMPONENT_SIZE_DEFAULTS.standard.clickTransitionMs}ms · icon {STUDIO_COMPONENT_SIZE_DEFAULTS.standard.iconSize}px / stroke {STUDIO_COMPONENT_SIZE_DEFAULTS.standard.iconStroke}</span></div>
          <div className="vt-confirmed-size-card"><strong>28PX COMPACT</strong><span>H {STUDIO_COMPONENT_SIZE_DEFAULTS.compact.height}px · Stroke {STUDIO_COMPONENT_SIZE_DEFAULTS.compact.stroke}px · R {STUDIO_COMPONENT_SIZE_DEFAULTS.compact.radius}px · Font {STUDIO_COMPONENT_SIZE_DEFAULTS.compact.fontSize}px / weight {STUDIO_COMPONENT_SIZE_DEFAULTS.compact.fontWeight}</span><span>Registered token values: shadow {STUDIO_COMPONENT_SIZE_DEFAULTS.compact.buttonShadowX}×{STUDIO_COMPONENT_SIZE_DEFAULTS.compact.buttonShadowY}px · hover offset {STUDIO_COMPONENT_SIZE_DEFAULTS.compact.hoverOffsetPx}px / {STUDIO_COMPONENT_SIZE_DEFAULTS.compact.hoverTransitionMs}ms · press offset {STUDIO_COMPONENT_SIZE_DEFAULTS.compact.clickOffsetPx}px / {STUDIO_COMPONENT_SIZE_DEFAULTS.compact.clickTransitionMs}ms · icon {STUDIO_COMPONENT_SIZE_DEFAULTS.compact.iconSize}px / stroke {STUDIO_COMPONENT_SIZE_DEFAULTS.compact.iconStroke}</span></div>
        </div>
        <div className="vt-confirmed-size-card"><strong>SINGLE-LINE INPUTS · GLOBAL TYPOGRAPHY</strong><span>Standard {STUDIO_COMPONENT_SIZE_DEFAULTS.textInput.standardFontSize}px · compact {STUDIO_COMPONENT_SIZE_DEFAULTS.textInput.compactFontSize}px · weight {STUDIO_COMPONENT_SIZE_DEFAULTS.textInput.fontWeight} · line-height {STUDIO_COMPONENT_SIZE_DEFAULTS.textInput.lineHeight}</span><span>Inputs keep the selected 44px / 28px geometry and use the global single-line type scale.</span></div>
        <div className="vt-confirmed-size-card vt-confirmed-field-typography-exception"><strong>MULTILINE TEXTAREA · REGISTERED EXCEPTION</strong><span>Standard {STUDIO_COMPONENT_SIZE_DEFAULTS.multiline.standardFontSize}px · compact {STUDIO_COMPONENT_SIZE_DEFAULTS.multiline.compactFontSize}px · minimum surface {STUDIO_COMPONENT_SIZE_DEFAULTS.multiline.minHeight}px · weight {STUDIO_COMPONENT_SIZE_DEFAULTS.multiline.fontWeight}</span><span>Textarea-only multiline line-height, padding, and vertical resizing; selected size still controls height family, border, and radius.</span></div>
        <div className="vt-confirmed-size-card vt-confirmed-action-exception"><strong>PROMINENT ACTION · FLAT 56PX FAMILY</strong><span>56px fixed height · 3px stroke · 6px radius · 20px Inter / weight 1000 text · flat and stationary.</span><span>StudioActionButton is a separate 56px action family; global flat-control contract removes shell shadows, transitions, and hover/press movement.</span></div>
        <div className="vt-confirmed-global-grid">{Object.entries(STUDIO_COMPONENT_GLOBAL_DEFAULTS).map(([key, value]) => <div key={key}><strong>{key.replace(/([A-Z])/g, " $1")}</strong><span>{formatDefaultValue(value)}</span></div>)}</div>
        <div className="vt-confirmed-defaults-explainer">
          <strong>HOW TO READ THE CURRENT CONTRACT</strong>
          <p><b>Geometry:</b> standard is 44px high / 3px border / 6px radius; compact is 28px / 2px / 4px. Default type is Inter, weight 1000, uppercase, -0.02em tracking, and 0.86 line-height unless a family exception is documented.</p>
          <p><b>Field colors:</b> at rest, text and caret use primary (--pair-a), fill uses primary at 50% opacity, the outer border is black, and the primary inset stroke is retained. Focus uses primary fill at 15%, black text, the primary inset stroke, and a secondary-color focus accent. The source register records a 3px standard / 2px compact visible accent and a separately measured 1px computed outline; live rendering still needs verification.</p>
          <p><b>Token/CSS discrepancy:</b> the token registry records zero hover and press offsets, but older component rules defined standard/compact offset shadows and hover/press movement, but the appended canonical flat-control contract overrides those effects. Computed browser styles still require verification.</p>
          <p><b>Icon presets:</b> the default production preset is 38px / 1.9 stroke standard and 24px / 2.0 compact. Current (28px / 18px) and moderate (34px / 22px) presets are opt-in. Circle icon buttons scale the large preset to 80%.</p>
          <p><b>Certification boundary:</b> this section describes current source behavior, not approval of every behavior as design policy. Shadows, motion, focus, reduced-motion, and responsive behavior require browser verification before certification.</p>
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
        <li><strong>PROMINENT WORKFLOW ACTION:</strong> StudioActionButton is a separate 56px family with 3px stroke, 6px radius, 3px offset shadow, 20px label, 1.5px hover translation and 3px press translation.</li>
        <li><strong>BUTTON SHADOW + MOTION OVERRIDE:</strong> legacy shadow/movement declarations remain in older component rules, but the canonical flat-control contract overrides shell/face shadows and hover/press geometry. Browser computed-style verification remains a release gate.</li>
        <li><strong>DROPDOWN:</strong> the trigger uses standard/compact sizing; menu rows and options are not button-press surfaces. A floating panel may have its own stationary shadow. Panel typography and stacking use dropdown-specific CSS.</li>
        <li><strong>SQUARE / CIRCLE ICON BUTTONS:</strong> share button sizing and shadow behavior. Large icon preset is default; circle buttons scale it to 80%. V1–V4 skins and interaction effects are explicit variants, not global behavior.</li>
        <li><strong>VAULT SPECTRUM TAG:</strong> registered 15px dense metadata chip with 2px border, 4px radius, 8px / weight-900 type, 35% white-mixed spectrum fill, and selected-state 1px upward offset plus layered glow.</li>
        <li><strong>CLOSEABLE BADGE:</strong> registered 20px pill with 16px label and 16px close circle; close color cycling and fade/removal are intentional badge-specific animation.</li>
        <li><strong>TAG EDITOR ACTION:</strong> registered compact 28px square plus/check action, 2px stroke and 4px radius with a no shadow under the global flat-control contract.</li>
        <li><strong>SPLIT-LEFT BADGE MICRO DENSITY:</strong> informational badge examples include a 14px / 1px-stroke micro size in addition to standard 44px / 3px and compact 28px / 2px. Micro is a local exception, not a global control size.</li>
        <li><strong>FIELD CARET + FOCUS:</strong> native insertion caret is retained; <code>caret-shape: block</code> is requested where supported and must not be simulated with a fake overlay. Declared focus-outline and last-recorded computed measurements differ, so verify in a rendered browser.</li>
        <li><strong>REDUCED MOTION:</strong> switch/choice, tag, badge, and button effects have component-specific reduced-motion rules. Do not infer that all transitions or animations are globally disabled.</li>
        <li><strong>VERIFICATION BOUNDARY:</strong> source text and source tests do not certify the live deployment. Verify standard/compact dimensions, effective shadows/transforms, selected/disabled/loading states, keyboard focus, dropdown stacking, narrow layouts, and reduced motion in a browser.</li>
      </ul>
      <p><strong>Audit status:</strong> this library describes the current implementation and flags known token/CSS disagreement. It does not claim that the current shadow/motion implementation satisfies the desired global flat/stationary policy.</p>
    </section>
    <Family title="Studio Text Input · Simple + Floating + Fixed Label" nonDefaultSettings={["Standard/compact are 44px/28px with 3px/2px strokes and 6px/4px radii; simple is default, floating/fixed labels are variants of one native input.","Single-line type is 38px/24px, weight 1000, line-height .86. Floating labels shrink to 80%; fixed labels remain raised; B variants reverse paired colors.","Search/number, input mode, autocomplete, max length, disabled/read-only behavior, and native caret are field-specific options. Verify focus accents in a browser."]} provenance={<Provenance primitive="StudioTextInput" tsx="src/studio-ui/primitives/StudioControls.tsx" css="src/styles/studio-control-system.css" tokens="One native input family with simple and floating-label variants; standard 44px / compact 28px geometry and global 38px / 24px typography." imports={["src/studio-ui/primitives/StudioControls.tsx"]} />}>
      <div className="vt-confirmed-variant is-full-row"><span>44px standard · StudioTextInput</span><StudioTextInput sizeVariant="standard" aria-label="Studio text input 44px" placeholder="TYPE HERE" data-vt-library-component="StudioTextInput" /></div>
      <div className="vt-confirmed-variant"><span>28px compact A · StudioTextInput</span><StudioTextInput sizeVariant="compact" aria-label="Studio text input 28px A" placeholder="TYPE HERE" data-vt-library-component="StudioTextInput" /></div><div className="vt-confirmed-variant"><span>28px compact · disabled</span><StudioTextInput sizeVariant="compact" aria-label="Studio text input 28px disabled" placeholder="TYPE HERE" disabled data-vt-library-component="StudioTextInput" /></div>
      <div className="vt-confirmed-variant is-full-row"><span>Floating label · 44px standard · A</span><StudioTextInput variant="floating-label" floatingLabelVariant="a" label="TITLE" aria-label="Studio floating-label input standard A" sizeVariant="standard" data-vt-library-component="StudioTextInput" /></div>
      <div className="vt-confirmed-variant"><span>Floating label · 28px compact · A</span><StudioTextInput variant="floating-label" floatingLabelVariant="a" label="TITLE" aria-label="Studio floating-label input compact A" sizeVariant="compact" data-vt-library-component="StudioTextInput" /></div>
      <div className="vt-confirmed-variant"><span>Floating label · 28px compact · B · reverse colors</span><StudioTextInput className="is-reverse-colors" variant="floating-label" floatingLabelVariant="b" label="TITLE" aria-label="Studio floating-label input compact B reverse colors" sizeVariant="compact" data-vt-library-component="StudioTextInput" /></div>
      <div className="vt-confirmed-variant is-full-row"><span>Fixed label box · 44px standard · A</span><StudioTextInput variant="fixed-label" label="TITLE" aria-label="Studio fixed-label input standard A" sizeVariant="standard" data-vt-library-component="StudioTextInput" /></div>
      <div className="vt-confirmed-variant"><span>Fixed label box · 28px compact · A</span><StudioTextInput variant="fixed-label" label="TITLE" aria-label="Studio fixed-label input compact A" sizeVariant="compact" data-vt-library-component="StudioTextInput" /></div>
      <div className="vt-confirmed-variant"><span>Fixed label box · 28px compact · B · reverse colors</span><StudioTextInput className="is-reverse-colors" variant="fixed-label" label="TITLE" aria-label="Studio fixed-label input compact B reverse colors" sizeVariant="compact" data-vt-library-component="StudioTextInput" /></div>
    </Family>
    <Family title="Studio Text Area · Simple + Floating + Fixed Label" nonDefaultSettings={["Textareas retain a 92px minimum surface and use 18px/14px type with multiline line-height, padding, and vertical resize.","Simple is default; floating/fixed labels are variants of one native textarea. Raised labels shrink to 80%; compact B reverses paired colors.","Rows, disabled/read-only behavior, and label association remain native. Selected size still controls border/radius; typography is the registered exception."]} provenance={<Provenance primitive="StudioTextArea" tsx="src/studio-ui/primitives/StudioControls.tsx" css="src/styles/studio-control-system.css" tokens="One native textarea family with simple and floating-label variants; 92px minimum surface and standard 18px / compact 14px multiline typography." imports={["src/studio-ui/primitives/StudioControls.tsx"]} />}>
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
    <Family title="Button" nonDefaultSettings={["Ordinary buttons default to 44px; explicit compact selects 28px. Accent is default; neutral/danger/warning/success are semantic alternatives.","Selected changes face color; disabled blocks activation; loading exposes busy state and blocks activation.","Legacy effect declarations are overridden by the canonical flat-control contract; no shell shadow, transition, hover movement, or press movement is intended."]} provenance={<Provenance primitive="StudioButton" tsx="src/studio-ui/primitives/StudioControls.tsx" css="src/styles/studio-control-system.css" tokens="Button-only shadow; canonical size defaults." imports={["src/studio-ui/primitives/StudioControls.tsx"]} />}>
      <div className="vt-confirmed-variant is-full-row"><span>44px standard · default</span><StudioButton heightVariant="44">button</StudioButton></div>
      <div className="vt-confirmed-variant"><span>28px compact · default</span><StudioButton heightVariant="28">button</StudioButton></div><div className="vt-confirmed-variant"><span>28px compact · neutral tone</span><StudioButton heightVariant="28" tone="neutral">button</StudioButton></div>
      <div className="vt-confirmed-variant is-full-row"><span>44px standard · selected</span><StudioButton selected heightVariant="44">button</StudioButton></div>
      <div className="vt-confirmed-variant"><span>28px compact · selected</span><StudioButton selected heightVariant="28">button</StudioButton></div><div className="vt-confirmed-variant"><span>28px compact · selected + disabled</span><StudioButton selected disabled heightVariant="28">button</StudioButton></div>
    </Family>
    <Family title="Icon Button · 44px + 28px" nonDefaultSettings={["Icon-only wrapper over StudioButton, not a parallel skin; label provides accessible name and icon is hidden from assistive technology.","Geometry, tones, selected/disabled/loading/focus states, shadow, hover and press behavior are inherited from StudioButton.","Large icon preset is default; current and moderate sizes are opt-in. Effective button CSS retains shadow/motion despite zero-offset token metadata."]} provenance={<Provenance primitive="StudioIconButton" tsx="src/studio-ui/primitives/StudioControls.tsx" css="src/styles/studio-control-system.css" tokens="44px / 28px; shared StudioButton interaction contract." imports={["src/studio-ui/index.ts"]} />}><div className="vt-confirmed-variant is-full-row"><span>44px standard · semantic tones</span><div className="vt-confirmed-square-variant-grid">{(["accent","neutral","danger","warning","success"] as const).map(tone => <StudioIconButton key={tone} icon={<Settings2 aria-hidden="true" />} label={tone + " action"} tone={tone} heightVariant="44" data-vt-library-component="StudioIconButton" />)}</div></div><div className="vt-confirmed-variant is-full-row"><span>28px compact · semantic tones</span><div className="vt-confirmed-square-variant-grid">{(["accent","neutral","danger","warning","success"] as const).map(tone => <StudioIconButton key={tone} icon={<Settings2 aria-hidden="true" />} label={tone + " compact action"} tone={tone} heightVariant="28" data-vt-library-component="StudioIconButton" />)}</div></div><div className="vt-confirmed-variant"><span>Selected</span><StudioIconButton icon={<Check aria-hidden="true" />} label="Selected icon action" selected heightVariant="44" data-vt-library-component="StudioIconButton" /></div><div className="vt-confirmed-variant"><span>Disabled</span><StudioIconButton icon={<Settings2 aria-hidden="true" />} label="Disabled icon action" disabled heightVariant="44" data-vt-library-component="StudioIconButton" /></div><div className="vt-confirmed-variant"><span>Loading</span><StudioIconButton icon={<Sparkles aria-hidden="true" />} label="Loading icon action" loading heightVariant="44" data-vt-library-component="StudioIconButton" /></div></Family>
    <Family title="Prominent Action · 56px" nonDefaultSettings={["StudioActionButton is a separate 56px family, not a third ordinary-button size; it uses 3px stroke, 6px radius, no shadow, and 20px Inter/1000 label.","Legacy declarations are overridden by the canonical flat-control contract; browser computed-style verification is still required.","Loading exposes busy state; disabled blocks interaction. Reduced-motion rules disable transitions but do not alter geometry."]} provenance={<Provenance primitive="StudioActionButton" tsx="src/studio-ui/primitives/StudioControls.tsx" css="src/styles/studio-control-system.css" tokens="Separate fixed 56px action family; never used as a standard/compact size alias." imports={["src/studio-ui/primitives/StudioControls.tsx"]} />}>
      <div className="vt-confirmed-variant is-full-row"><span>56px prominent workflow action</span><StudioActionButton data-vt-library-component="StudioActionButton">CREATE PACKAGE</StudioActionButton></div>
    </Family>

    <Family title="Square Icon Button · 44px + 28px" nonDefaultSettings={["StudioSquareIconButton is the canonical square counterpart to the split-left rail: 44×44 standard / 28×28 compact.","V1–V4 skins have different fill/shadow pairs; circle icons use 80% of the large preset (30.4px/1.9 standard; 19.2px/2.0 compact).","Effects are opt-in; notification needs a real count/status and success must follow actual operation success. It inherits button shadow/hover/press behavior and is not globally flat."]} provenance={<Provenance primitive="StudioSquareIconButton · v1/v2/v3/v4 + seven effects" tsx="src/studio-ui/primitives/StudioControls.tsx" css="src/styles/studio-control-system.css" tokens="44×44px standard / 28×28px compact; V1–V4 skins; seven opt-in interaction effects; shared Studio button shadow and motion contract." imports={["src/studio-ui/index.ts", "src/components/studio-hub/StudioHubConfirmedPrimitiveCatalog.tsx"]} />}>
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
    <Family title="Split-left" nonDefaultSettings={["Split-left defaults to 44px; compact is 28px. Accent is default; neutral/danger/warning/success are semantic alternatives.","Selected swaps face and rail colors; disabled blocks activation; loading reports busy state.","The fixed icon rail and size/tone/state behavior are production CSS contracts. Split-left uses StudioButton's shell and centered label contract; legacy size-specific effects are overridden by the global flat-control contract."]} provenance={<Provenance primitive="StudioSplitLeftButton" tsx="src/studio-ui/primitives/StudioControls.tsx" css="src/styles/studio-control-system.css" tokens="44px icons explicitly enlarged; selected state swaps module-pair fills." imports={["src/studio-ui/primitives/StudioControls.tsx"]} />}>
      <div className="vt-confirmed-variant is-full-row"><span>44px standard · default</span><StudioSplitLeftButton icon={<Sparkles />} heightVariant="44" data-vt-library-component="StudioSplitLeftButton">split-left</StudioSplitLeftButton></div>
      <div className="vt-confirmed-variant"><span>28px compact · default</span><StudioSplitLeftButton icon={<Sparkles />} heightVariant="28">split-left</StudioSplitLeftButton></div><div className="vt-confirmed-variant"><span>28px compact · neutral tone</span><StudioSplitLeftButton icon={<Sparkles />} tone="neutral" heightVariant="28">split-left</StudioSplitLeftButton></div>
      <div className="vt-confirmed-variant is-full-row"><span>44px standard · selected</span><StudioSplitLeftButton icon={<Settings2 />} selected heightVariant="44">split-left</StudioSplitLeftButton></div>
      <div className="vt-confirmed-variant"><span>28px compact · selected</span><StudioSplitLeftButton icon={<Settings2 />} selected heightVariant="28">split-left</StudioSplitLeftButton></div><div className="vt-confirmed-variant"><span>28px compact · selected + disabled</span><StudioSplitLeftButton icon={<Settings2 />} selected disabled heightVariant="28">split-left</StudioSplitLeftButton></div>
    </Family>
    <Family
      title="Button + Split-left · Complete Variant Matrix"
      nonDefaultSettings={["Specimens use production StudioButton and StudioSplitLeftButton exports, with standard/compact sizes and five semantic tones.","Selected, disabled, and loading are separate states, not tones.","The canonical flat-control contract overrides legacy shell shadows and press movement; focus and reduced-motion still require browser verification."]}
      provenance={<Provenance primitive="StudioButton / StudioSplitLeftButton" tsx="src/studio-ui/primitives/StudioControls.tsx" css="src/styles/studio-control-system.css" tokens="44px standard · 28px compact · five semantic tones · selected / disabled / loading · shared tactile press motion" imports={["src/studio-ui/primitives/StudioControls.tsx", "src/components/studio-hub/StudioHubConfirmedPrimitiveCatalog.tsx"]} />}
    >
      <div className="vt-confirmed-variant is-full-row">
        <span>STANDARD · SEMANTIC TONES</span>
        <div className="vt-confirmed-square-variant-grid">
          {(["accent", "neutral", "danger", "warning", "success"] as const).map(tone => <StudioButton key={tone} heightVariant="44" tone={tone}>{tone}</StudioButton>)}
        </div>
      </div>
      <div className="vt-confirmed-variant is-full-row">
        <span>COMPACT · SEMANTIC TONES</span>
        <div className="vt-confirmed-square-variant-grid">
          {(["accent", "neutral", "danger", "warning", "success"] as const).map(tone => <StudioButton key={tone} heightVariant="28" tone={tone}>{tone}</StudioButton>)}
        </div>
      </div>
      <div className="vt-confirmed-variant is-full-row">
        <span>SPLIT-LEFT · FIVE TONES</span>
        <div className="vt-confirmed-square-variant-grid">
          {(["accent", "neutral", "danger", "warning", "success"] as const).map(tone => <StudioSplitLeftButton key={tone} icon={<Settings2 aria-hidden="true" />} heightVariant="44" tone={tone}>{tone}</StudioSplitLeftButton>)}
        </div>
      </div>
      <div className="vt-confirmed-variant is-full-row">
        <span>STATE VARIANTS · SELECTED / DISABLED / LOADING</span>
        <div className="vt-confirmed-square-variant-grid">
          <StudioButton heightVariant="44" selected>selected</StudioButton>
          <StudioButton heightVariant="44" disabled>disabled</StudioButton>
          <StudioButton heightVariant="44" loading>loading</StudioButton>
          <StudioSplitLeftButton icon={<Check aria-hidden="true" />} heightVariant="44" selected>selected</StudioSplitLeftButton>
          <StudioSplitLeftButton icon={<Settings2 aria-hidden="true" />} heightVariant="44" disabled>disabled</StudioSplitLeftButton>
          <StudioSplitLeftButton icon={<Settings2 aria-hidden="true" />} heightVariant="44" loading>loading</StudioSplitLeftButton>
        </div>
      </div>
    </Family>
    <Family
      title="Square Icon Button · All Presets + Animations"
      nonDefaultSettings={["All examples mount StudioSquareIconButton directly; V1–V4 skins, icon presets, and effects are separate options.","Preset coverage includes heart, bell, sun/moon, lock/unlock, download/check, refresh, and like; effects include pop/ripple, notification, rotate, flip, morph, tooltip, and success.","Effects are stateful and opt-in. Success is demonstration-only unless the product operation actually succeeded; accessibility and reduced-motion behavior remain required."]}
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
      nonDefaultSettings={["Activation swaps icon, label, and selected palette state while reserving width so Play/Pause does not resize the control.","Uncontrolled state is default; playing/onPlayingChange enables parent-controlled state and aria-pressed reflects current state.","Standard is 44px and compact 28px; selected coloring and label reservation are family-specific, not global defaults."]}
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
      nonDefaultSettings={["Circle is a shape variant of StudioSquareIconButton and shares palette, preset, disabled, focus, shadow, and press behavior.","Standard is 44×44px; compact 28×28px; icons use 80% of large preset dimensions.","V1–V4 skins and square-button effects are inherited opt-in variants; circular shape does not create a new size family."]}
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
      nonDefaultSettings={["The left icon rail is part of the field, not an action button; documented contract has no button shadow or press movement.","Rail uses large icon preset: 38px/1.9 standard and 24px/2.0 compact.","Editable area reuses StudioTextInput; wrapper owns focus outline/border. Native props/ref are forwarded. Verify CSS has not introduced button-like movement or shadow."]}
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
      nonDefaultSettings={["Trigger is 44px by default; compact is 28px. l0/l1/l2 level is independent from trigger size.","Disabled trigger cannot open; controlled/uncontrolled value, placeholder, clear label, max panel height, keyboard focus and disabled options are production behaviors.","Menu rows/options are not button-press surfaces; the floating panel may have its own stationary shadow. Verify stacking, keyboard navigation and narrow-screen layout."]}
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
      nonDefaultSettings={["Registered 15px dense metadata chip, not a general-purpose 44px/28px control; border/text use alphabetical spectrum color and fill mixes it with white at 35%.","Color resolves from the first A–Z letter using getAlphabeticalSpectrumColor and the 12-stop palette.","Selected state uses flat color/border feedback only; no movement or glow is permitted under the global flat-control contract."]}
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
      nonDefaultSettings={["Closeable badges are registered 20px pills with 16px uppercase Inter/1000 labels and a 16px close circle; pill uses primary fill and label uses primary mixed 50% with white.","Close action swaps circle/X colors three times at 180ms per cycle then fades for one second; this is badge-specific animation.","Tag-editor plus/check actions are 28px compact squares with 2px stroke, 4px radius, and 1.5px secondary-color offset shadow at 45%. Enter confirms; Escape cancels; reduced-motion removes nonessential animation."]}
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
      nonDefaultSettings={["Plain single-choice dropdown with no top-left label, checkbox rows, or multi-select behavior.","Closed control/options inherit Studio typography and color-pair tokens; trigger uses 44px standard / 28px compact sizing.","Keyboard selection, disabled options and optional placeholder are supported. Panel/option styling is separate from the trigger's button interaction contract."]}
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