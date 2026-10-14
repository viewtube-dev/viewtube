import React from "react"
import { Settings2, Sparkles } from "lucide-react"
import { SubToolboxInput20, SubToolboxTextArea21 } from "../subtoolbox/SubToolboxPrimitives"
import { Studioswitch as SubToolbox44Switch, StudioChoice as SubToolbox44Choice, Studiotoggle as SubToolbox44WordToggle } from "../../studio-ui"
import { STUDIO_COMPONENT_GLOBAL_DEFAULTS, STUDIO_COMPONENT_SIZE_DEFAULTS, StudioButton, StudioFloatingLabelInput, StudioFloatingLabelTextArea, StudioLegendMultiDropdown, StudioSplitLeftButton } from "../../studio-ui"
import { StudioTextInput, StudioTextArea } from "../../studio-ui/primitives/StudioControls"
import "./studio-hub-primitive-catalogs.css"

type Size = "44px" | "28px"

const sizeClass = (size: Size) => size === "44px" ? "is-large" : "is-compact"

const CANONICAL_SKINS = [{ skin: "solid" as const, label: "1 · SOLID" }, { skin: "color-swap" as const, label: "3 · COLOR SWAP" }, { skin: "black-indicator" as const, label: "4 · BLACK INDICATOR" }, { skin: "white-indicator" as const, label: "5 · WHITE INDICATOR" }]
const WORD_TOGGLE_SKINS = CANONICAL_SKINS.filter(item => item.skin !== "white-indicator")
const CanonicalControlFamilies: React.FC = () => {
  const [switches, setSwitches] = React.useState<boolean[]>(Array(8).fill(false))
  const [choices, setChoices] = React.useState<boolean[]>(Array(12).fill(false))
  const [words, setWords] = React.useState<boolean[]>(Array(7).fill(false))
  const colorStyle = { "--vt-control-base": "#20f13e", "--vt-control-indicator": "#f276c5", "--vt-control-ink": "#0f172a" } as React.CSSProperties
  const flip = (setter: React.Dispatch<React.SetStateAction<boolean[]>>, index: number, value?: boolean) => setter(current => current.map((old, i) => i === index ? (value ?? !old) : old))
  return <>
    <Family title="44px Switches" nonDefaultSettings={["checked=true · ON state; checked=false is the default OFF state.", "shape=\"round\" | \"rect\".", "skin=\"color-swap\" | \"black-indicator\" | \"white-indicator\" (default: solid).", "disabled=true disables interaction while preserving the selected skin."]} provenance={<Provenance primitive="Studioswitch" tsx="src/studio-ui/primitives/StudioControls.tsx" css="src/styles/studio-control-system.css" tokens="75.68×44px track; shared four-skin variants." imports={["src/components/subtoolbox/SubToolboxPrimitives.tsx"]} />}>
      <div className="vt-confirmed-control-family" style={colorStyle}>{(["round", "rect"] as const).map((shape, row) => <div className="vt-confirmed-control-row" key={shape}><strong>{shape === "round" ? "ROUND" : "RECTANGULAR"}</strong><div className="vt-confirmed-control-variants">{CANONICAL_SKINS.map((skin, col) => { const index = row * 4 + col; return <div key={skin.skin}><small>{skin.label}</small><SubToolbox44Switch shape={shape} skin={skin.skin} checked={switches[index]} aria-label={shape + " " + skin.label} onClick={() => flip(setSwitches, index)} /></div> })}</div></div>)}</div>
    </Family>
    <Family title="44px Radio + Checkbox" nonDefaultSettings={["kind=\"radio\" | \"checkbox\"; shape=\"round\" | \"rect\".", "mark=\"xwide\" selects the wide-X checkbox mark; default mark is check.", "skin=\"color-swap\" | \"black-indicator\" | \"white-indicator\" (default: solid).", "checked=true shows the selected state; disabled=true blocks interaction."]} provenance={<Provenance primitive="StudioChoice" tsx="src/studio-ui/primitives/StudioControls.tsx" css="src/styles/studio-control-system.css" tokens="44×44px controls; checkmark and wide-X checkbox marks." imports={["src/components/subtoolbox/SubToolboxPrimitives.tsx"]} />}>
      <div className="vt-confirmed-control-family" style={colorStyle}>{([{kind:"radio" as const,label:"CIRCULAR RADIO",mark:"check" as const},{kind:"checkbox" as const,label:"CHECKMARK CHECKBOX",mark:"check" as const},{kind:"checkbox" as const,label:"WIDE-X CHECKBOX",mark:"xwide" as const}]).map((item,row) => <div className="vt-confirmed-control-row" key={item.label}><strong>{item.label}</strong><div className="vt-confirmed-control-variants">{CANONICAL_SKINS.map((skin,col) => { const index = row * 4 + col; return <div key={skin.skin}><small>{skin.label}</small><SubToolbox44Choice kind={item.kind} mark={item.mark} shape={item.kind === "radio" ? "round" : "rect"} skin={skin.skin} checked={choices[index]} aria-label={item.label + " " + skin.label} onClick={() => flip(setChoices, index)} /></div> })}</div></div>)}</div>
    </Family>
    <Family title="Word Toggles · 44px + 28px" nonDefaultSettings={["size=\"28\" selects the compact variant; default size is 44px.", "skin=\"color-swap\" | \"black-indicator\" | \"white-indicator\" (default: solid).", "value=true selects the second word; default value is false.", "words={[\"PAUSE\", \"PLAY\"]} customizes the labels; defaults are OFF / ON."]} provenance={<Provenance primitive="Studiotoggle" tsx="src/studio-ui/primitives/StudioControls.tsx" css="src/styles/studio-control-system.css" tokens="Text-measured active handle; standard and compact variants." imports={["src/components/subtoolbox/SubToolboxPrimitives.tsx"]} />}>
      <div className="vt-confirmed-control-family" style={colorStyle}><div className="vt-confirmed-control-row"><strong>44PX STANDARD · SOLID</strong><div className="vt-confirmed-control-variants is-word-toggle-44 is-word-toggle-solid"><div><small>1 · SOLID</small><SubToolbox44WordToggle size="44" skin="solid" words={["WRITE","CREATE"]} value={words[0]} onValueChange={value => flip(setWords, 0, value)} /></div></div></div>{([{size:"44" as const,label:"44PX STANDARD"},{size:"28" as const,label:"28PX COMPACT"}]).map((item,row) => <div className="vt-confirmed-control-row" key={item.size}><strong>{item.label}</strong><div className={`vt-confirmed-control-variants ${item.size === "44" ? "is-word-toggle-44" : "is-word-toggle-28"}`}>{WORD_TOGGLE_SKINS.filter(skin => skin.skin !== "solid").map((skin,col) => { const index = row * 3 + col + 1; return <div key={skin.skin}><small>{skin.label}</small><SubToolbox44WordToggle size={item.size} skin={skin.skin} words={["WRITE","CREATE"]} value={words[index]} onValueChange={value => flip(setWords, index, value)} /></div> })}</div></div>)}</div>
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
      <div className="vt-confirmed-global-grid">{Object.entries(STUDIO_COMPONENT_GLOBAL_DEFAULTS).map(([key, value]) => <div key={key}><strong>{key.replace(/([A-Z])/g, " $1")}</strong><span>{String(value)}</span></div>)}</div>
    </section>
    <Family title="Studio Text Input · Standalone" nonDefaultSettings={["sizeVariant=\"compact\" selects 28px; default is standard 44px.", "type=\"search\" or type=\"number\" uses the shared Studio field styling.", "disabled=true prevents editing; readOnly=true permits focus and selection without edits.", "placeholder, inputMode, autoComplete, and maxLength can be overridden with native input props."]} provenance={<Provenance primitive="StudioTextInput" tsx="src/studio-ui/primitives/StudioControls.tsx" css="src/styles/studio-control-system.css" tokens="Native input; standard 44px and compact 28px size variants; independent of SubToolbox primitives." imports={["src/studio-ui/primitives/StudioControls.tsx"]} />}>
      <div className="vt-confirmed-variant is-full-row"><span>44px standard · StudioTextInput</span><StudioTextInput sizeVariant="standard" aria-label="Studio text input 44px" placeholder="TYPE HERE" data-vt-library-component="StudioTextInput" /></div>
      <div className="vt-confirmed-variant"><span>28px compact · StudioTextInput</span><StudioTextInput sizeVariant="compact" aria-label="Studio text input 28px" placeholder="TYPE HERE" data-vt-library-component="StudioTextInput" /></div>
    </Family>
    <Family title="Studio Text Area · Standalone" nonDefaultSettings={["sizeVariant=\"compact\" selects the compact typography variant; standard textarea height is 92px.", "Standard textarea uses 18px typography; compact uses 14px typography.", "rows={2} or another positive row count changes the initial writing-area height.", "disabled=true prevents editing; readOnly=true allows focus and text selection without edits.", "Native resize behavior remains available unless the consumer overrides resize styling."]} provenance={<Provenance primitive="StudioTextArea" tsx="src/studio-ui/primitives/StudioControls.tsx" css="src/styles/studio-control-system.css" tokens="Native textarea; 92px standard height, 18px standard font and 14px compact font; canonical borders/focus; independent of SubToolbox primitives." imports={["src/studio-ui/primitives/StudioControls.tsx"]} />}>
      <div className="vt-confirmed-variant is-full-row"><span>Standard · StudioTextArea</span><StudioTextArea className="vt-confirmed-studio-textarea-standard" sizeVariant="standard" rows={4} aria-label="Studio text area standard" placeholder="TYPE DESCRIPTION" data-vt-library-component="StudioTextArea" /></div>
      <div className="vt-confirmed-variant is-full-row"><span>Compact · StudioTextArea</span><StudioTextArea className="vt-confirmed-studio-textarea-compact" sizeVariant="compact" rows={4} aria-label="Studio text area compact" placeholder="TYPE DESCRIPTION" data-vt-library-component="StudioTextArea" /></div>
    </Family>
    <Family title="Simple Text Inputs · Primitive 20" nonDefaultSettings={["controlSize=\"compact\" selects the 28px variant; default is 44px.", "disabled=true prevents input; readOnly=true allows selection without editing.", "Focused state uses black text/stroke and a Color 2 outline.", "type may be set to search, number, email, or another native input type."]} provenance={<Provenance primitive="SubToolboxInput20" tsx="src/components/subtoolbox/SubToolboxPrimitives.tsx" css="src/styles/subtoolbox-system.css" tokens="44px standard / 28px compact; text uses the canonical size token. Default text and border share Color 1; focus text and border use black with a visible Color 2 outline." imports={["src/components/subtoolbox/SubToolboxPrimitives.tsx"]} />}>
      <div className="vt-confirmed-variant is-full-row"><span>20 · 44px standard · 38px / 1000 typography</span><SubToolboxInput20 className="is-simple-text vt-confirmed-simple-input is-input-44" aria-label="Simple text input 44px" placeholder="TYPE HERE" /></div>
      <div className="vt-confirmed-variant"><span>20 · 28px compact A</span><SubToolboxInput20 controlSize="compact" className="is-simple-text vt-confirmed-simple-input is-input-28" aria-label="Simple text input 28px A" placeholder="TYPE HERE" /></div>
      <div className="vt-confirmed-variant"><span>20 · 28px compact B</span><SubToolboxInput20 controlSize="compact" className="is-simple-text vt-confirmed-simple-input is-input-28" aria-label="Simple text input 28px B" placeholder="TYPE HERE" /></div>
    </Family>
    <Family title="Simple Text Area · Primitive 21" nonDefaultSettings={["rows changes the initial number of text lines; the primitive defaults to a 92px writing area.", "disabled=true prevents editing; readOnly=true allows focus and selection without edits.", "resize may be set to none, vertical, horizontal, or both by the consuming field style.", "Focused state uses black text/stroke with the Color 2 focus outline."]} provenance={<Provenance primitive="SubToolboxTextArea21" tsx="src/components/subtoolbox/SubToolboxPrimitives.tsx" css="src/styles/subtoolbox-system.css" tokens="Fixed 92px writing area; intentionally independent of the 28px / 44px height system. Paragraph typography follows the 28px input text size, with 44px input stroke/focus treatment." imports={["src/components/subtoolbox/SubToolboxPrimitives.tsx"]} />}>
      <div className="vt-confirmed-variant is-full-row"><span>21 · 92px paragraph textarea</span><SubToolboxTextArea21 className="vt-confirmed-simple-textarea" aria-label="Simple paragraph textarea" placeholder="WRITE A PARAGRAPH…" rows={4} /></div>
    </Family>
    <CanonicalControlFamilies />
    <p className="vt-confirmed-intro">Confirmed primitives only. Each preview is the production component, not a catalog redraw. Default and compact variants share identical typography and selected-state rules.</p>
    <Family title="Button" nonDefaultSettings={["heightVariant=\"28\" selects compact; default is 44px.", "tone=\"neutral\" | \"danger\" | \"warning\" | \"success\" (default: accent).", "selected=true applies the canonical selected state; disabled=true blocks interaction.", "loading=true sets aria-busy and disables the button until loading clears.", "sizeVariant=\"compact\" is the compact alias when heightVariant is not supplied."]} provenance={<Provenance primitive="StudioButton" tsx="src/studio-ui/primitives/StudioControls.tsx" css="src/styles/studio-control-system.css" tokens="Button-only shadow; canonical size defaults." imports={["src/studio-ui/index.ts"]} />}>
      <div className="vt-confirmed-variant is-full-row"><span>44px standard · default</span><StudioButton heightVariant="44">button</StudioButton></div>
      <div className="vt-confirmed-variant"><span>28px compact · default A</span><StudioButton heightVariant="28">button</StudioButton></div><div className="vt-confirmed-variant"><span>28px compact · default B</span><StudioButton heightVariant="28">button</StudioButton></div>
      <div className="vt-confirmed-variant is-full-row"><span>44px standard · selected</span><StudioButton selected heightVariant="44">button</StudioButton></div>
      <div className="vt-confirmed-variant"><span>28px compact · selected A</span><StudioButton selected heightVariant="28">button</StudioButton></div><div className="vt-confirmed-variant"><span>28px compact · selected B</span><StudioButton selected heightVariant="28">button</StudioButton></div>
    </Family>
    <Family title="Split-left" nonDefaultSettings={["heightVariant=\"28\" selects compact; default is 44px.", "tone=\"neutral\" | \"danger\" | \"warning\" | \"success\" (default: accent).", "selected=true swaps the module-pair selected treatment; disabled=true blocks interaction.", "loading=true exposes aria-busy and disables the split-left action.", "The icon prop is required; the same size/tone/selected settings are inherited from StudioButton."]} provenance={<Provenance primitive="StudioSplitLeftButton" tsx="src/studio-ui/primitives/StudioControls.tsx" css="src/styles/studio-control-system.css" tokens="44px icons explicitly enlarged; selected state swaps module-pair fills." imports={["src/studio-ui/index.ts"]} />}>
      <div className="vt-confirmed-variant is-full-row"><span>44px standard · default</span><StudioSplitLeftButton icon={<Sparkles />} heightVariant="44">split-left</StudioSplitLeftButton></div>
      <div className="vt-confirmed-variant"><span>28px compact · default A</span><StudioSplitLeftButton icon={<Sparkles />} heightVariant="28">split-left</StudioSplitLeftButton></div><div className="vt-confirmed-variant"><span>28px compact · default B</span><StudioSplitLeftButton icon={<Sparkles />} heightVariant="28">split-left</StudioSplitLeftButton></div>
      <div className="vt-confirmed-variant is-full-row"><span>44px standard · selected</span><StudioSplitLeftButton icon={<Settings2 />} selected heightVariant="44">split-left</StudioSplitLeftButton></div>
      <div className="vt-confirmed-variant"><span>28px compact · selected A</span><StudioSplitLeftButton icon={<Settings2 />} selected heightVariant="28">split-left</StudioSplitLeftButton></div><div className="vt-confirmed-variant"><span>28px compact · selected B</span><StudioSplitLeftButton icon={<Settings2 />} selected heightVariant="28">split-left</StudioSplitLeftButton></div>
    </Family>
    <Family
      title="Text input and textarea"
      nonDefaultSettings={["sizeVariant=\"compact\" selects the 28px labeled-input variant; standard 44px is the default.", "level=\"l0\" | \"l2\" changes the declared control level (default: l1).", "overlayLabel accepts custom field context such as TITLE, DESCRIPTION, or TAGS.", "disabled=true and readOnly=true follow native input/textarea behavior.", "Textarea rows controls the initial writing height; textarea remains content-height and vertically resizable by default."]}
      provenance={<Provenance primitive="StudioFloatingLabelInput / StudioFloatingLabelTextArea · primitives 141 / 142" tsx="src/studio-ui/primitives/StudioControls.tsx" css="src/styles/studio-control-system.css" tokens="Textarea is multiline, content-height, and vertically resizable." imports={["src/studio-ui/index.ts", "src/views/VideoPublisher.tsx", "src/views/VideoManager.tsx"]} />}
    >
      <div className="vt-confirmed-variant is-full-row"><span>141 · 44px labeled text input</span><StudioFloatingLabelInput overlayLabel="TITLE" placeholder=" " aria-label="Labeled title input 44px" sizeVariant="standard" /></div>
      <div className="vt-confirmed-variant"><span>141 · 28px labeled input A</span><StudioFloatingLabelInput overlayLabel="TITLE" placeholder=" " aria-label="Labeled title input 28px A" sizeVariant="compact" /></div>
      <div className="vt-confirmed-variant"><span>141 · 28px labeled input B</span><StudioFloatingLabelInput overlayLabel="TITLE" placeholder=" " aria-label="Labeled title input 28px B" sizeVariant="compact" /></div>
      <div className="vt-confirmed-variant is-full-row"><span>142 · content-height labeled textarea</span><StudioFloatingLabelTextArea overlayLabel="DESCRIPTION" placeholder=" " aria-label="Labeled description textarea" rows={4} /></div>
    </Family>

    <Family
      title="Dropdown"
      nonDefaultSettings={["sizeVariant=\"compact\" selects 28px; default is standard 44px.", "level=\"l0\" | \"l2\" changes the declared control level (default: l1).", "disabled=true disables the trigger and prevents the menu from opening.", "value={[...]} makes selection controlled; defaultValue={[...]} initializes uncontrolled selection.", "placeholder, clearLabel, and maxMenuHeight customize the empty trigger, clear action, and menu height.", "An option with disabled=true remains visible but cannot be selected."]}
      provenance={<Provenance
        primitive="StudioLegendMultiDropdown · 140"
        tsx="src/studio-ui/primitives/StudioControls.tsx"
        css="src/styles/studio-control-system.css"
        tokens="Custom multiselect menu; floating legend and CLEAR ALL action."
        imports={["src/studio-ui/index.ts", "src/views/VideoPublisher.tsx", "src/views/VideoManager.tsx"]}
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
