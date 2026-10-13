import React from "react"
import { Settings2, Sparkles } from "lucide-react"
import { SubToolboxInput20, SubToolboxTextArea21, SubToolbox44Switch, SubToolbox44Choice, SubToolbox44WordToggle } from "../subtoolbox/SubToolboxPrimitives"
import { STUDIO_COMPONENT_GLOBAL_DEFAULTS, STUDIO_COMPONENT_SIZE_DEFAULTS, StudioButton, StudioFloatingLabelInput, StudioFloatingLabelTextArea, StudioLegendMultiDropdown, StudioSplitLeftButton } from "../../studio-ui"
import "./studio-hub-confirmed-primitive-catalog.css"

type Size = "44px" | "28px"

const sizeClass = (size: Size) => size === "44px" ? "is-large" : "is-compact"

const CANONICAL_SKINS = [{ skin: "solid" as const, label: "1 · SOLID" }, { skin: "color-swap" as const, label: "3 · COLOR SWAP" }, { skin: "black-indicator" as const, label: "4 · BLACK INDICATOR" }, { skin: "white-indicator" as const, label: "5 · WHITE INDICATOR" }]
const CanonicalControlFamilies: React.FC = () => {
  const [switches, setSwitches] = React.useState<boolean[]>(Array(8).fill(false))
  const [choices, setChoices] = React.useState<boolean[]>(Array(12).fill(false))
  const [words, setWords] = React.useState<boolean[]>(Array(8).fill(false))
  const colorStyle = { "--vt-control-base": "#20f13e", "--vt-control-indicator": "#f276c5", "--vt-control-ink": "#0f172a" } as React.CSSProperties
  const flip = (setter: React.Dispatch<React.SetStateAction<boolean[]>>, index: number, value?: boolean) => setter(current => current.map((old, i) => i === index ? (value ?? !old) : old))
  return <>
    <Family title="44px Switches" provenance={<Provenance primitive="SubToolbox44Switch" tsx="src/components/subtoolbox/SubToolboxPrimitives.tsx" css="src/styles/subtoolbox-system.css" tokens="75.68×44px track; shared four-skin variants." imports={["src/components/subtoolbox/SubToolboxPrimitives.tsx"]} />}>
      <div className="vt-confirmed-control-family" style={colorStyle}>{(["round", "rect"] as const).map((shape, row) => <div className="vt-confirmed-control-row" key={shape}><strong>{shape === "round" ? "ROUND" : "RECTANGULAR"}</strong><div className="vt-confirmed-control-variants">{CANONICAL_SKINS.map((skin, col) => { const index = row * 4 + col; return <div key={skin.skin}><small>{skin.label}</small><SubToolbox44Switch shape={shape} skin={skin.skin} checked={switches[index]} aria-label={shape + " " + skin.label} onClick={() => flip(setSwitches, index)} /></div> })}</div></div>)}</div>
    </Family>
    <Family title="44px Radio + Checkbox" provenance={<Provenance primitive="SubToolbox44Choice" tsx="src/components/subtoolbox/SubToolboxPrimitives.tsx" css="src/styles/subtoolbox-system.css" tokens="44×44px controls; checkmark and wide-X checkbox marks." imports={["src/components/subtoolbox/SubToolboxPrimitives.tsx"]} />}>
      <div className="vt-confirmed-control-family" style={colorStyle}>{([{kind:"radio" as const,label:"CIRCULAR RADIO",mark:"check" as const},{kind:"checkbox" as const,label:"CHECKMARK CHECKBOX",mark:"check" as const},{kind:"checkbox" as const,label:"WIDE-X CHECKBOX",mark:"xwide" as const}]).map((item,row) => <div className="vt-confirmed-control-row" key={item.label}><strong>{item.label}</strong><div className="vt-confirmed-control-variants">{CANONICAL_SKINS.map((skin,col) => { const index = row * 4 + col; return <div key={skin.skin}><small>{skin.label}</small><SubToolbox44Choice kind={item.kind} mark={item.mark} shape={item.kind === "radio" ? "round" : "rect"} skin={skin.skin} checked={choices[index]} aria-label={item.label + " " + skin.label} onClick={() => flip(setChoices, index)} /></div> })}</div></div>)}</div>
    </Family>
    <Family title="Word Toggles · 44px + 28px" provenance={<Provenance primitive="SubToolbox44WordToggle" tsx="src/components/subtoolbox/SubToolboxPrimitives.tsx" css="src/styles/subtoolbox-system.css" tokens="Text-measured active handle; standard and compact variants." imports={["src/components/subtoolbox/SubToolboxPrimitives.tsx"]} />}>
      <div className="vt-confirmed-control-family" style={colorStyle}>{([{size:"44" as const,label:"44PX STANDARD"},{size:"28" as const,label:"28PX COMPACT"}]).map((item,row) => <div className="vt-confirmed-control-row" key={item.size}><strong>{item.label}</strong><div className="vt-confirmed-control-variants">{CANONICAL_SKINS.map((skin,col) => { const index = row * 4 + col; return <div key={skin.skin}><small>{skin.label}</small><SubToolbox44WordToggle size={item.size} skin={skin.skin} value={words[index]} onValueChange={value => flip(setWords, index, value)} /></div> })}</div></div>)}</div>
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

const Family: React.FC<{ title: string; children: React.ReactNode; provenance: React.ReactNode }> = ({ title, children, provenance }) => (
  <section className="vt-confirmed-family">
    <h3>{title}</h3>
    <div className="vt-confirmed-variants">{children}</div>
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
    <Family title="Simple Text Input + Textarea · Primitives 20 / 21" provenance={<Provenance primitive="SubToolboxInput20 / SubToolboxTextArea21" tsx="src/components/subtoolbox/SubToolboxPrimitives.tsx" css="src/styles/subtoolbox-system.css" tokens="Shared production primitives; pair-color focus state on simple text input." imports={["src/components/subtoolbox/SubToolboxPrimitives.tsx"]} />}>
      <div className="vt-confirmed-variant is-full-row"><span>20 · 44px simple text input</span><SubToolboxInput20 className="is-simple-text vt-confirmed-simple-input" aria-label="Simple text input" placeholder="TYPE HERE" /></div>
      <div className="vt-confirmed-variant"><span>21 · 44px simple textarea</span><SubToolboxTextArea21 className="vt-confirmed-simple-textarea" aria-label="Simple textarea" placeholder="TYPE DESCRIPTION" rows={2} /></div>
      <div className="vt-confirmed-variant"><span>21 · compact textarea</span><SubToolboxTextArea21 className="vt-confirmed-simple-textarea" aria-label="Compact simple textarea" placeholder="TYPE DESCRIPTION" rows={2} height="compact" /></div>
    </Family>
    <CanonicalControlFamilies />
    <p className="vt-confirmed-intro">Confirmed primitives only. Each preview is the production component, not a catalog redraw. Default and compact variants share identical typography and selected-state rules.</p>
    <Family title="Button" provenance={<Provenance primitive="StudioButton" tsx="src/studio-ui/primitives/StudioControls.tsx" css="src/styles/studio-control-system.css" tokens="Button-only shadow; canonical size defaults." imports={["src/studio-ui/index.ts"]} />}>
      <div className="vt-confirmed-variant is-full-row"><span>44px standard · default</span><StudioButton heightVariant="44">button</StudioButton></div>
      <div className="vt-confirmed-variant"><span>28px compact · default A</span><StudioButton heightVariant="28">button</StudioButton></div><div className="vt-confirmed-variant"><span>28px compact · default B</span><StudioButton heightVariant="28">button</StudioButton></div>
      <div className="vt-confirmed-variant is-full-row"><span>44px standard · selected</span><StudioButton selected heightVariant="44">button</StudioButton></div>
      <div className="vt-confirmed-variant"><span>28px compact · selected A</span><StudioButton selected heightVariant="28">button</StudioButton></div><div className="vt-confirmed-variant"><span>28px compact · selected B</span><StudioButton selected heightVariant="28">button</StudioButton></div>
    </Family>
    <Family title="Split-left" provenance={<Provenance primitive="StudioSplitLeftButton" tsx="src/studio-ui/primitives/StudioControls.tsx" css="src/styles/studio-control-system.css" tokens="44px icons explicitly enlarged; selected state swaps module-pair fills." imports={["src/studio-ui/index.ts"]} />}>
      <div className="vt-confirmed-variant is-full-row"><span>44px standard · default</span><StudioSplitLeftButton icon={<Sparkles />} heightVariant="44">split-left</StudioSplitLeftButton></div>
      <div className="vt-confirmed-variant"><span>28px compact · default A</span><StudioSplitLeftButton icon={<Sparkles />} heightVariant="28">split-left</StudioSplitLeftButton></div><div className="vt-confirmed-variant"><span>28px compact · default B</span><StudioSplitLeftButton icon={<Sparkles />} heightVariant="28">split-left</StudioSplitLeftButton></div>
      <div className="vt-confirmed-variant is-full-row"><span>44px standard · selected</span><StudioSplitLeftButton icon={<Settings2 />} selected heightVariant="44">split-left</StudioSplitLeftButton></div>
      <div className="vt-confirmed-variant"><span>28px compact · selected A</span><StudioSplitLeftButton icon={<Settings2 />} selected heightVariant="28">split-left</StudioSplitLeftButton></div><div className="vt-confirmed-variant"><span>28px compact · selected B</span><StudioSplitLeftButton icon={<Settings2 />} selected heightVariant="28">split-left</StudioSplitLeftButton></div>
    </Family>
    <Family
      title="Text input and textarea"
      provenance={<Provenance primitive="StudioFloatingLabelInput / StudioFloatingLabelTextArea · primitives 141 / 142" tsx="src/studio-ui/primitives/StudioControls.tsx" css="src/styles/studio-control-system.css" tokens="Textarea is multiline, content-height, and vertically resizable." imports={["src/studio-ui/index.ts", "src/views/VideoPublisher.tsx", "src/views/VideoManager.tsx"]} />}
    >
      <div className="vt-confirmed-variant is-full-row"><span>141 · 44px labeled text input</span><StudioFloatingLabelInput overlayLabel="TITLE" placeholder=" " aria-label="Labeled title input 44px" sizeVariant="standard" /></div>
      <div className="vt-confirmed-variant"><span>141 · 28px labeled input A</span><StudioFloatingLabelInput overlayLabel="TITLE" placeholder=" " aria-label="Labeled title input 28px A" sizeVariant="compact" /></div>
      <div className="vt-confirmed-variant"><span>141 · 28px labeled input B</span><StudioFloatingLabelInput overlayLabel="TITLE" placeholder=" " aria-label="Labeled title input 28px B" sizeVariant="compact" /></div>
      <div className="vt-confirmed-variant is-full-row"><span>142 · content-height labeled textarea</span><StudioFloatingLabelTextArea overlayLabel="DESCRIPTION" placeholder=" " aria-label="Labeled description textarea" rows={4} /></div>
    </Family>

    <Family
      title="Dropdown"
      provenance={<Provenance
        primitive="StudioLegendMultiDropdown · 140"
        tsx="src/studio-ui/primitives/StudioControls.tsx"
        css="src/styles/studio-control-system.css"
        tokens="Custom multiselect menu; floating legend and CLEAR ALL action."
        imports={["src/studio-ui/index.ts", "src/views/VideoPublisher.tsx", "src/views/VideoManager.tsx"]}
      />}
    >
      <div className="vt-confirmed-variant">
        <span>44px · custom open menu · multiselect</span>
        <StudioLegendMultiDropdown
          label="dropdown"
          defaultValue={["videos", "shorts"]}
          options={[
            { value: "videos", label: "Videos" },
            { value: "shorts", label: "Shorts" },
            { value: "live", label: "Live" },
            { value: "playlists", label: "Playlists" },
            { value: "podcasts", label: "Podcasts" },
            { value: "music", label: "Music" },
            { value: "gaming", label: "Gaming" },
            { value: "news", label: "News" },
            { value: "sports", label: "Sports" },
          ]}
        />
      </div>
      <div className="vt-confirmed-variant">
        <span>28px compact · module pair tokens</span>
        <StudioLegendMultiDropdown
          label="dropdown"
          sizeVariant="compact"
          placeholder="dropdown"
          options={[
            { value: "default", label: "Default" },
            { value: "bold", label: "Bold" },
            { value: "minimal", label: "Minimal" },
            { value: "cinematic", label: "Cinematic" },
            { value: "educational", label: "Educational" },
            { value: "documentary", label: "Documentary" },
            { value: "tutorial", label: "Tutorial" },
            { value: "storytelling", label: "Storytelling" },
            { value: "review", label: "Review" },
            { value: "commentary", label: "Commentary" },
            { value: "shorts", label: "Shorts" },
          ]}
        />
      </div>
    </Family>
  </div>
)

export default StudioHubConfirmedPrimitiveCatalog
