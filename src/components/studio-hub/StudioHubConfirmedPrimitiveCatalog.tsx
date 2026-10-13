import React from "react"
import { Settings2, Sparkles } from "lucide-react"
import { STUDIO_COMPONENT_GLOBAL_DEFAULTS, STUDIO_COMPONENT_SIZE_DEFAULTS, StudioButton, StudioFloatingLabelInput, StudioFloatingLabelTextArea, StudioLegendMultiDropdown, StudioSplitLeftButton } from "../../studio-ui"
import "./studio-hub-confirmed-primitive-catalog.css"

type Size = "44px" | "28px"

const sizeClass = (size: Size) => size === "44px" ? "is-large" : "is-compact"

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
    <section className="vt-confirmed-family vt-confirmed-size-defaults"><h3>Canonical component size defaults</h3><div className="vt-confirmed-variants"><div><strong>44px standard</strong><p>Height {STUDIO_COMPONENT_SIZE_DEFAULTS.standard.height}px · {STUDIO_COMPONENT_SIZE_DEFAULTS.standard.stroke}px stroke · radius {STUDIO_COMPONENT_SIZE_DEFAULTS.standard.radius}px · font {STUDIO_COMPONENT_SIZE_DEFAULTS.standard.fontSize}px / weight {STUDIO_COMPONENT_SIZE_DEFAULTS.standard.fontWeight} · button shadow {STUDIO_COMPONENT_SIZE_DEFAULTS.standard.buttonShadowX}px × {STUDIO_COMPONENT_SIZE_DEFAULTS.standard.buttonShadowY}px · hover {STUDIO_COMPONENT_SIZE_DEFAULTS.standard.hoverTransitionMs}ms / {STUDIO_COMPONENT_SIZE_DEFAULTS.standard.hoverOffsetPx}px · click {STUDIO_COMPONENT_SIZE_DEFAULTS.standard.clickTransitionMs}ms / {STUDIO_COMPONENT_SIZE_DEFAULTS.standard.clickOffsetPx}px · icon {STUDIO_COMPONENT_SIZE_DEFAULTS.standard.iconSize}px / stroke {STUDIO_COMPONENT_SIZE_DEFAULTS.standard.iconStroke}px</p></div><div><strong>28px compact</strong><p>Height {STUDIO_COMPONENT_SIZE_DEFAULTS.compact.height}px · {STUDIO_COMPONENT_SIZE_DEFAULTS.compact.stroke}px stroke · radius {STUDIO_COMPONENT_SIZE_DEFAULTS.compact.radius}px · font {STUDIO_COMPONENT_SIZE_DEFAULTS.compact.fontSize}px / weight {STUDIO_COMPONENT_SIZE_DEFAULTS.compact.fontWeight} · button shadow {STUDIO_COMPONENT_SIZE_DEFAULTS.compact.buttonShadowX}px × {STUDIO_COMPONENT_SIZE_DEFAULTS.compact.buttonShadowY}px · hover {STUDIO_COMPONENT_SIZE_DEFAULTS.compact.hoverTransitionMs}ms / {STUDIO_COMPONENT_SIZE_DEFAULTS.compact.hoverOffsetPx}px · click {STUDIO_COMPONENT_SIZE_DEFAULTS.compact.clickTransitionMs}ms / {STUDIO_COMPONENT_SIZE_DEFAULTS.compact.clickOffsetPx}px · icon {STUDIO_COMPONENT_SIZE_DEFAULTS.compact.iconSize}px / stroke {STUDIO_COMPONENT_SIZE_DEFAULTS.compact.iconStroke}px</p></div></div></section>
    <section className="vt-confirmed-family vt-confirmed-global-defaults"><h3>Global defaults · all component sizes</h3><div className="vt-confirmed-global-grid">{Object.entries(STUDIO_COMPONENT_GLOBAL_DEFAULTS).map(([key, value]) => <div key={key}><strong>{key.replace(/([A-Z])/g, " $1")}</strong><p>{String(value)}</p></div>)}</div></section>
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
