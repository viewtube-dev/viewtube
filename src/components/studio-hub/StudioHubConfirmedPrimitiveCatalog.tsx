import React from "react"
import { Settings2, Sparkles } from "lucide-react"
import { STUDIO_COMPONENT_SIZE_DEFAULTS, StudioButton, StudioLegendMultiDropdown, StudioSplitLeftButton } from "../../studio-ui"
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
    <p className="vt-confirmed-intro">Confirmed primitives only. Each preview is the production component, not a catalog redraw. Default and compact variants share identical typography and selected-state rules.</p>
    <Family
      title="Button"
      provenance={<Provenance
        primitive="StudioButton"
        tsx="src/studio-ui/primitives/StudioControls.tsx"
        css="src/styles/studio-control-system.css"
        tokens="Button-only shadow; no family-specific geometry overrides."
        imports={["src/studio-ui/index.ts", "src/studio-ui/recipes/index.tsx", "src/studio-ui/StudioHubCertification.tsx", "src/views/ActionableTactics.tsx", "src/components/CommentResponder.tsx", "src/views/VideoDirector.tsx", "src/components/CommunityPostGenerator.tsx"]}
      />}
    >
      <div className="vt-confirmed-variant">
        <span>44px default</span>
        <StudioButton heightVariant="44">button</StudioButton>
      </div>
      <div className="vt-confirmed-variant">
        <span>28px compact</span>
        <StudioButton heightVariant="28">button</StudioButton>
      </div>
      <div className="vt-confirmed-variant">
        <span>44px selected</span>
        <StudioButton selected heightVariant="44">button</StudioButton>
      </div>
      <div className="vt-confirmed-variant">
        <span>28px selected</span>
        <StudioButton selected heightVariant="28">button</StudioButton>
      </div>
    </Family>
    <Family
      title="Split-left"
      provenance={<Provenance
        primitive="StudioSplitLeftButton"
        tsx="src/studio-ui/primitives/StudioControls.tsx"
        css="src/styles/studio-control-system.css"
        tokens="Selected state swaps pair-A/pair-B fills; preserves the normal border stroke."
        imports={["src/studio-ui/index.ts", "src/studio-ui/StudioHubCertification.tsx", "src/views/VideoDirector.tsx", "src/components/CommunityPostGenerator.tsx"]}
      />}
    >
      <div className="vt-confirmed-variant">
        <span>44px default</span>
        <StudioSplitLeftButton icon={<Sparkles size={18} />} heightVariant="44">split-left</StudioSplitLeftButton>
      </div>
      <div className="vt-confirmed-variant">
        <span>28px compact</span>
        <StudioSplitLeftButton icon={<Sparkles size={14} />} heightVariant="28">split-left</StudioSplitLeftButton>
      </div>
      <div className="vt-confirmed-variant">
        <span>44px selected</span>
        <StudioSplitLeftButton icon={<Settings2 size={18} />} selected heightVariant="44">split-left</StudioSplitLeftButton>
      </div>
      <div className="vt-confirmed-variant">
        <span>28px selected</span>
        <StudioSplitLeftButton icon={<Settings2 size={14} />} selected heightVariant="28">split-left</StudioSplitLeftButton>
      </div>
    </Family>

    <Family
      title="Text input and textarea"
      provenance={<Provenance primitive="StudioInput / StudioTextArea · primitives 20 / 21" tsx="src/studio-ui/primitives/StudioControls.tsx" css="src/styles/studio-control-system.css" tokens="Textarea is multiline, content-height, and vertically resizable." imports={["src/studio-ui/index.ts", "src/views/VideoPublisher.tsx", "src/views/VideoManager.tsx"]} />}
    >
      <div className="vt-confirmed-variant"><span>44px text input</span><input data-vt-studio-control="true" data-size="standard" aria-label="Simple text input 44px" placeholder="text input" /></div>
      <div className="vt-confirmed-variant"><span>28px text input</span><input data-vt-studio-control="true" data-size="compact" aria-label="Simple text input 28px" placeholder="text input" /></div>
      <div className="vt-confirmed-variant"><span>44px text area</span><textarea data-vt-studio-control="true" data-size="standard" aria-label="Simple text area 44px" placeholder="text area" rows={3} /></div>
      <div className="vt-confirmed-variant"><span>28px text area</span><textarea data-vt-studio-control="true" data-size="compact" aria-label="Simple text area 28px" placeholder="text area" rows={2} /></div>
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
