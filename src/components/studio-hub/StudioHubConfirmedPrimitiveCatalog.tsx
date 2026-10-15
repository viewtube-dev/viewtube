import React from "react"
import { Settings2, Sparkles } from "lucide-react"
import {
  STUDIO_COMPONENT_GLOBAL_DEFAULTS,
  STUDIO_COMPONENT_SIZE_DEFAULTS,
  StudioButton,
  StudioRadio,
  StudioCheckbox,
  StudioXCheckbox,
  StudioLabeledInput,
  StudioLabeledTextArea,
  StudioLegendMultiDropdown,
  StudioSplitLeftButton,
  StudioSwitch,
  StudioTextArea,
  StudioTextInput,
  StudioWordToggle,
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

const CANONICAL_SKINS = [{ skin: "solid" as const, label: "1 · SOLID" }, { skin: "color-swap" as const, label: "3 · COLOR SWAP" }, { skin: "black-indicator" as const, label: "4 · BLACK INDICATOR" }, { skin: "white-indicator" as const, label: "5 · WHITE INDICATOR" }]
const WORD_TOGGLE_SKINS = CANONICAL_SKINS
const CanonicalControlFamilies: React.FC = () => {
  const [switches, setSwitches] = React.useState<boolean[]>(Array(8).fill(false))
  const [choices, setChoices] = React.useState<boolean[]>(Array(12).fill(false))
  const [words, setWords] = React.useState<boolean[]>(Array(8).fill(false))
  const flip = (setter: React.Dispatch<React.SetStateAction<boolean[]>>, index: number, value?: boolean) => setter(current => current.map((old, i) => i === index ? (value ?? !old) : old))
  return <>
    <Family title="44px Switches" nonDefaultSettings={["checked=true · ON state; checked=false is the default OFF state.", "shape=\"round\" | \"rect\".", "skin=\"color-swap\" | \"black-indicator\" | \"white-indicator\" (default: solid).", "disabled=true disables interaction while preserving the selected skin."]} provenance={<Provenance primitive="StudioSwitch" tsx="src/studio-ui/primitives/StudioControls.tsx" css="src/styles/studio-control-system.css" tokens="75.68×44px track; shared four-skin variants." imports={["src/studio-ui/primitives/StudioControls.tsx"]} />}>
      <div className="vt-confirmed-control-family">{(["round", "rect"] as const).map((shape, row) => <div className="vt-confirmed-control-row" key={shape}><strong>{shape === "round" ? "ROUND" : "RECTANGULAR"}</strong><div className="vt-confirmed-control-variants">{CANONICAL_SKINS.map((skin, col) => { const index = row * 4 + col; return <div key={skin.skin}><small>{skin.label}</small><StudioSwitch shape={shape} skin={skin.skin} checked={switches[index]} aria-label={shape + " " + skin.label} onClick={() => flip(setSwitches, index)} /></div> })}</div></div>)}</div>
    </Family>
    <Family title="44px Radio + Checkbox" nonDefaultSettings={["Uses the distinct canonical StudioRadio, StudioCheckbox, and StudioXCheckbox exports.", "shape=\"round\" | \"rect\"; StudioXCheckbox selects the wide-X mark.", "skin=\"color-swap\" | \"black-indicator\" | \"white-indicator\" (default: solid).", "checked=true shows the selected state; disabled=true blocks interaction."]} provenance={<Provenance primitive="StudioRadio / StudioCheckbox / StudioXCheckbox" tsx="src/studio-ui/primitives/StudioControls.tsx" css="src/styles/studio-control-system.css" tokens="44×44px controls; checkmark and wide-X checkbox marks." imports={["src/studio-ui/primitives/StudioControls.tsx"]} />}>
      <div className="vt-confirmed-control-family">{([{Component:StudioRadio,label:"CIRCULAR RADIO",shape:"round" as const},{Component:StudioCheckbox,label:"CHECKMARK CHECKBOX",shape:"rect" as const},{Component:StudioXCheckbox,label:"WIDE-X CHECKBOX",shape:"rect" as const}]).map((item,row) => { const ChoiceComponent = item.Component; return <div className="vt-confirmed-control-row" key={item.label}><strong>{item.label}</strong><div className="vt-confirmed-control-variants">{CANONICAL_SKINS.map((skin,col) => { const index = row * 4 + col; return <div key={skin.skin}><small>{skin.label}</small><ChoiceComponent shape={item.shape} skin={skin.skin} checked={choices[index]} aria-label={item.label + " " + skin.label} onClick={() => flip(setChoices, index)} /></div> })}</div></div> })}</div>
    </Family>
    <Family title="Word Toggles · 44px + 28px" nonDefaultSettings={["size=\"28\" selects the compact variant; default size is 44px.", "skin=\"color-swap\" | \"black-indicator\" | \"white-indicator\" (default: solid).", "value=true selects the second word; default value is false.", "words={[\"PAUSE\", \"PLAY\"]} customizes the labels; defaults are OFF / ON."]} provenance={<Provenance primitive="StudioWordToggle" tsx="src/studio-ui/primitives/StudioControls.tsx" css="src/styles/studio-control-system.css" tokens="Text-measured active handle; standard and compact variants." imports={["src/studio-ui/primitives/StudioControls.tsx"]} />}>
      <div className="vt-confirmed-control-family vt-confirmed-word-toggle-family">{([{size:"44" as const,label:"44PX STANDARD"},{size:"28" as const,label:"28PX COMPACT"}]).map((item,row) => {
        return <div className="vt-confirmed-control-row" key={item.size}>
          <strong>{item.label}</strong>
          <div className="vt-confirmed-control-variants" data-control-size={item.size}>{WORD_TOGGLE_SKINS.map((skin,col) => { const index = row * 4 + col; return <div key={skin.skin}><small>{skin.label}</small><StudioWordToggle size={item.size} skin={skin.skin} value={words[index]} words={item.size === "44" && col === 0 ? ["WRITE","CREATE"] : ["OFF","ON"]} onValueChange={value => flip(setWords, index, value)} /></div> })}</div>
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
    <h3>{title}</h3>
    <div className="vt-confirmed-variants">{children}</div>
    {nonDefaultSettings.length > 0 && (
      <section className="vt-confirmed-nondefault-settings" aria-label={`${title} non-default settings`}>
        <strong>NON-DEFAULT SETTINGS</strong>
        <ul>{nonDefaultSettings.map((setting) => <li key={setting}>{setting}</li>)}</ul>
      </section>
    )}
    {provenance}
  </section>
)

/** Certified production examples only. This catalog uses the real Studio Hub exports. */
export const StudioHubConfirmedPrimitiveCatalog: React.FC = () => (
  <div className="vt-confirmed-catalog">
    <section className="vt-confirmed-family vt-confirmed-defaults-combined">
      <h3>Canonical + Global Defaults · All Component Sizes</h3>
      <div className="vt-confirmed-size-grid">
        <div className="vt-confirmed-size-card"><strong>44PX STANDARD</strong><span>H {STUDIO_COMPONENT_SIZE_DEFAULTS.standard.height}px · Stroke {STUDIO_COMPONENT_SIZE_DEFAULTS.standard.stroke}px · R {STUDIO_COMPONENT_SIZE_DEFAULTS.standard.radius}px · Font {STUDIO_COMPONENT_SIZE_DEFAULTS.standard.fontSize}px / {STUDIO_COMPONENT_SIZE_DEFAULTS.standard.fontWeight}</span><span>Shadow {STUDIO_COMPONENT_SIZE_DEFAULTS.standard.buttonShadowX}×{STUDIO_COMPONENT_SIZE_DEFAULTS.standard.buttonShadowY}px · Hover {STUDIO_COMPONENT_SIZE_DEFAULTS.standard.hoverTransitionMs}ms / {STUDIO_COMPONENT_SIZE_DEFAULTS.standard.hoverOffsetPx}px · Click {STUDIO_COMPONENT_SIZE_DEFAULTS.standard.clickTransitionMs}ms / {STUDIO_COMPONENT_SIZE_DEFAULTS.standard.clickOffsetPx}px · Icon {STUDIO_COMPONENT_SIZE_DEFAULTS.standard.iconSize}px / {STUDIO_COMPONENT_SIZE_DEFAULTS.standard.iconStroke}px</span></div>
        <div className="vt-confirmed-size-card"><strong>28PX COMPACT</strong><span>H {STUDIO_COMPONENT_SIZE_DEFAULTS.compact.height}px · Stroke {STUDIO_COMPONENT_SIZE_DEFAULTS.compact.stroke}px · R {STUDIO_COMPONENT_SIZE_DEFAULTS.compact.radius}px · Font {STUDIO_COMPONENT_SIZE_DEFAULTS.compact.fontSize}px / {STUDIO_COMPONENT_SIZE_DEFAULTS.compact.fontWeight}</span><span>Shadow {STUDIO_COMPONENT_SIZE_DEFAULTS.compact.buttonShadowX}×{STUDIO_COMPONENT_SIZE_DEFAULTS.compact.buttonShadowY}px · Hover {STUDIO_COMPONENT_SIZE_DEFAULTS.compact.hoverTransitionMs}ms / {STUDIO_COMPONENT_SIZE_DEFAULTS.compact.hoverOffsetPx}px · Click {STUDIO_COMPONENT_SIZE_DEFAULTS.compact.clickTransitionMs}ms / {STUDIO_COMPONENT_SIZE_DEFAULTS.compact.clickOffsetPx}px · Icon {STUDIO_COMPONENT_SIZE_DEFAULTS.compact.iconSize}px / stroke {STUDIO_COMPONENT_SIZE_DEFAULTS.compact.iconStroke}px</span></div>
      </div>
      <div className="vt-confirmed-size-card vt-confirmed-textarea-exception"><strong>MULTILINE TEXTAREA EXCEPTION</strong><span>Minimum surface: {STUDIO_COMPONENT_SIZE_DEFAULTS.multiline.minHeight}px · Standard text: {STUDIO_COMPONENT_SIZE_DEFAULTS.multiline.standardFontSize}px · Compact text: {STUDIO_COMPONENT_SIZE_DEFAULTS.multiline.compactFontSize}px · Weight: {STUDIO_COMPONENT_SIZE_DEFAULTS.multiline.fontWeight}</span><span>Long-form / print-friendly text. Preserves standard or compact borders, radii, focus, and caret; vertical resize enabled.</span></div>
      <div className="vt-confirmed-global-grid">{Object.entries(STUDIO_COMPONENT_GLOBAL_DEFAULTS).map(([key, value]) => <div key={key}><strong>{key.replace(/([A-Z])/g, " $1")}</strong><span>{formatDefaultValue(value)}</span></div>)}</div>
    </section>
    <section className="vt-confirmed-family vt-confirmed-exception-index" aria-labelledby="vt-confirmed-exception-index-title">
      <h3 id="vt-confirmed-exception-index-title">Global Exceptions &amp; Known Deviations</h3>
      <p>Canonical source: <code>src/studio-ui/primitives/StudioControls.tsx</code> + <code>src/styles/studio-control-system.css</code>. Full register: <code>docs/ui/STUDIO_CONTROLS_GLOBAL_DEFAULTS_AND_EXCEPTION_INDEX.md</code>.</p>
      <ul>
        <li><strong>FIX REQUIRED · Compact split-left divider:</strong> compact is 2px by contract, but legacy CSS currently sets the rail divider to 3px in default and selected states.</li>
        <li><strong>FIX REQUIRED · Field radius:</strong> a later field rule forces 8px instead of standard 6px / compact 4px.</li>
        <li><strong>FIX REQUIRED · Button typography:</strong> conflicting 32px, 10px, 36px, and 22px declarations bypass the 38px / 24px contract.</li>
        <li><strong>FIX REQUIRED · Button shadow motion:</strong> hover changes the shadow offset and active removes the shadow while moving the button; required behavior is a fixed shadow anchor with the face moving halfway on hover and fully on click.</li>
        <li><strong>FIX REQUIRED · Transition timing:</strong> CSS currently uses 180ms while size constants specify 150ms hover / 300ms click.</li>
        <li><strong>REVIEW · Undeclared sizes:</strong> CSS includes 32px small and 56px action heights outside the standard/compact defaults.</li>
        <li><strong>DOCUMENTED FUNCTIONAL EXCEPTION · Dropdown menus/options:</strong> menu surface and options do not use button press shadows; option typography and minimum height are menu-specific and must remain explicitly documented.</li>
        <li><strong>REVIEW · Fields and wrappers:</strong> multiline height, floating-label layout, focus ring, switch/choice sizing, and word-toggle measured handle need size-by-size verification.</li>
      </ul>
      <p><strong>Audit status:</strong> source-level conflicts verified; browser-computed styles and rendered states are not yet certified. Do not treat these listed defects as approved exceptions.</p>
    </section>
    <Family title="Studio Text Input · Standalone" nonDefaultSettings={["sizeVariant=\"compact\" selects 28px; default is standard 44px.", "type=\"search\" or type=\"number\" uses the shared Studio field styling.", "disabled=true prevents editing; readOnly=true permits focus and selection without edits.", "placeholder, inputMode, autoComplete, and maxLength can be overridden with native input props."]} provenance={<Provenance primitive="StudioTextInput" tsx="src/studio-ui/primitives/StudioControls.tsx" css="src/styles/studio-control-system.css" tokens="Native input; standard 44px and compact 28px size variants; TYPE HERE placeholder shares entered-text typography; independent of SubToolbox primitives." imports={["src/studio-ui/primitives/StudioControls.tsx"]} />}>
      <div className="vt-confirmed-variant is-full-row"><span>44px standard · StudioTextInput</span><StudioTextInput sizeVariant="standard" aria-label="Studio text input 44px" placeholder="TYPE HERE" data-vt-library-component="StudioTextInput" /></div>
      <div className="vt-confirmed-variant"><span>28px compact · StudioTextInput</span><StudioTextInput sizeVariant="compact" aria-label="Studio text input 28px" placeholder="TYPE HERE" data-vt-library-component="StudioTextInput" /></div>
    </Family>
    <Family title="Studio Text Area · Standalone" nonDefaultSettings={["Multiline exception: 92px minimum writing surface for long-form / print-friendly text.", "Standard typography is 18px; compact typography is 14px; both use weight 1000.", "All other geometry follows the selected family: standard 44px / 3px stroke / 6px radius, compact 28px / 2px stroke / 4px radius.", "rows may increase the initial surface; vertical resize remains available.", "disabled=true prevents editing; readOnly=true allows focus and text selection without edits."]} provenance={<Provenance primitive="StudioTextArea" tsx="src/studio-ui/primitives/StudioControls.tsx" css="src/styles/studio-control-system.css" tokens="Native textarea; 92px minimum surface; standard 18px / compact 14px typography at weight 1000; preserves selected family geometry, focus, and caret; independent of SubToolbox primitives." imports={["src/studio-ui/primitives/StudioControls.tsx"]} />}>
      <div className="vt-confirmed-variant is-full-row"><span>44px standard · StudioTextArea</span><StudioTextArea sizeVariant="standard" rows={4} aria-label="Studio text area 44px" placeholder="TYPE HERE" data-vt-library-component="StudioTextArea" /></div>
      <div className="vt-confirmed-variant is-full-row"><span>28px compact · StudioTextArea</span><StudioTextArea sizeVariant="compact" rows={4} aria-label="Studio text area 28px" placeholder="TYPE HERE" data-vt-library-component="StudioTextArea" /></div>
    </Family>
    <CanonicalControlFamilies />
    <p className="vt-confirmed-intro">Confirmed primitives only. Each preview is the production component, not a catalog redraw. Standard and compact variants share the global Inter / weight-1000 / uppercase contract; geometry, icon scale, and stroke are size-specific.</p>
    <Family title="Button" nonDefaultSettings={["heightVariant=\"28\" selects compact; default is 44px.", "tone=\"neutral\" | \"danger\" | \"warning\" | \"success\" (default: accent).", "selected=true applies the canonical selected state; disabled=true blocks interaction.", "loading=true sets aria-busy and disables the button until loading clears.", "sizeVariant=\"compact\" is the compact alias when heightVariant is not supplied."]} provenance={<Provenance primitive="StudioButton" tsx="src/studio-ui/primitives/StudioControls.tsx" css="src/styles/studio-control-system.css" tokens="Button-only shadow; canonical size defaults." imports={["src/studio-ui/primitives/StudioControls.tsx"]} />}>
      <div className="vt-confirmed-variant is-full-row"><span>44px standard · default</span><StudioButton heightVariant="44">button</StudioButton></div>
      <div className="vt-confirmed-variant"><span>28px compact · default A</span><StudioButton heightVariant="28">button</StudioButton></div><div className="vt-confirmed-variant"><span>28px compact · default B</span><StudioButton heightVariant="28">button</StudioButton></div>
      <div className="vt-confirmed-variant is-full-row"><span>44px standard · selected</span><StudioButton selected heightVariant="44">button</StudioButton></div>
      <div className="vt-confirmed-variant"><span>28px compact · selected A</span><StudioButton selected heightVariant="28">button</StudioButton></div><div className="vt-confirmed-variant"><span>28px compact · selected B</span><StudioButton selected heightVariant="28">button</StudioButton></div>
    </Family>
    <Family title="Split-left" nonDefaultSettings={["heightVariant=\"28\" selects compact; default is 44px.", "tone=\"neutral\" | \"danger\" | \"warning\" | \"success\" (default: accent).", "selected=true swaps the module-pair selected treatment; disabled=true blocks interaction.", "loading=true exposes aria-busy and disables the split-left action.", "The icon prop is required; the same size/tone/selected settings are inherited from StudioButton."]} provenance={<Provenance primitive="StudioSplitLeftButton" tsx="src/studio-ui/primitives/StudioControls.tsx" css="src/styles/studio-control-system.css" tokens="44px icons explicitly enlarged; selected state swaps module-pair fills." imports={["src/studio-ui/primitives/StudioControls.tsx"]} />}>
      <div className="vt-confirmed-variant is-full-row"><span>44px standard · default</span><StudioSplitLeftButton icon={<Sparkles />} heightVariant="44">split-left</StudioSplitLeftButton></div>
      <div className="vt-confirmed-variant"><span>28px compact · default A</span><StudioSplitLeftButton icon={<Sparkles />} heightVariant="28">split-left</StudioSplitLeftButton></div><div className="vt-confirmed-variant"><span>28px compact · default B</span><StudioSplitLeftButton icon={<Sparkles />} heightVariant="28">split-left</StudioSplitLeftButton></div>
      <div className="vt-confirmed-variant is-full-row"><span>44px standard · selected</span><StudioSplitLeftButton icon={<Settings2 />} selected heightVariant="44">split-left</StudioSplitLeftButton></div>
      <div className="vt-confirmed-variant"><span>28px compact · selected A</span><StudioSplitLeftButton icon={<Settings2 />} selected heightVariant="28">split-left</StudioSplitLeftButton></div><div className="vt-confirmed-variant"><span>28px compact · selected B</span><StudioSplitLeftButton icon={<Settings2 />} selected heightVariant="28">split-left</StudioSplitLeftButton></div>
    </Family>
    <Family
      title="Text input and textarea"
      nonDefaultSettings={["sizeVariant=\"compact\" selects the 28px labeled-input variant; standard 44px is the default.", "level=\"l0\" | \"l2\" changes the declared control level (default: l1).", "overlayLabel accepts custom field context such as TITLE, DESCRIPTION, or TAGS.", "disabled=true and readOnly=true follow native input/textarea behavior.", "Textarea exception: 92px minimum surface; standard 18px or compact 14px text, both weight 1000; other geometry follows the selected 44px or 28px family."]}
      provenance={<Provenance primitive="StudioLabeledInput / StudioLabeledTextArea · primitives 141 / 142" tsx="src/studio-ui/primitives/StudioControls.tsx" css="src/styles/studio-control-system.css" tokens="Textarea is multiline, content-height, and vertically resizable." imports={["src/studio-ui/primitives/StudioControls.tsx"]} />}
    >
      <div className="vt-confirmed-variant is-full-row"><span>141 · 44px labeled text input</span><StudioLabeledInput label="TITLE" placeholder=" " aria-label="Labeled title input 44px" sizeVariant="standard" /></div>
      <div className="vt-confirmed-variant"><span>141 · 28px labeled input A</span><StudioLabeledInput label="TITLE" placeholder=" " aria-label="Labeled title input 28px A" sizeVariant="compact" /></div>
      <div className="vt-confirmed-variant"><span>141 · 28px labeled input B</span><StudioLabeledInput label="TITLE" placeholder=" " aria-label="Labeled title input 28px B" sizeVariant="compact" /></div>
      <div className="vt-confirmed-variant is-full-row"><span>142 · content-height labeled textarea</span><StudioLabeledTextArea label="DESCRIPTION" placeholder=" " aria-label="Labeled description textarea" rows={4} /></div>
    </Family>

    <Family
      title="Dropdown"
      nonDefaultSettings={["sizeVariant=\"compact\" selects 28px; default is standard 44px.", "level=\"l0\" | \"l2\" changes the declared control level (default: l1).", "disabled=true disables the trigger and prevents the menu from opening.", "value={[...]} makes selection controlled; defaultValue={[...]} initializes uncontrolled selection.", "placeholder, clearLabel, and maxMenuHeight customize the empty trigger, clear action, and menu height.", "An option with disabled=true remains visible but cannot be selected."]}
      provenance={<Provenance
        primitive="StudioLegendMultiDropdown · 140"
        tsx="src/studio-ui/primitives/StudioControls.tsx"
        css="src/styles/studio-control-system.css"
        tokens="Fixed floating label; trigger value typography independent of label; 28px/18px chevrons; 44px/28px menu rows; no menu-option shadows or press motion."
        imports={["src/studio-ui/primitives/StudioControls.tsx"]}
      />}
    >
      <div className="vt-confirmed-variant is-full-row">
        <span>44px standard · open menu · multiselect</span>
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
        <span>28px compact A · menu row ratio</span>
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
        <span>28px compact B · menu row ratio</span>
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
  </div>
)

export default StudioHubConfirmedPrimitiveCatalog
