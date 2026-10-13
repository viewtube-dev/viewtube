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
    <section className="vt-confirmed-family vt-confirmed-size-defaults"><h3>Canonical component size defaults</h3><div className="vt-confirmed-variants"><div><strong>44px standard</strong><p>Height {STUDIO_COMPONENT_SIZE_DEFAULTS.standard.height}px · {STUDIO_COMPONENT_SIZE_DEFAULTS.standard.stroke}px stroke · {STUDIO_COMPONENT_SIZE_DEFAULTS.standard.fontSize}px / weight {STUDIO_COMPONENT_SIZE_DEFAULTS.standard.fontWeight} · button-only shadow {STUDIO_COMPONENT_SIZE_DEFAULTS.standard.buttonShadowX}px × {STUDIO_COMPONENT_SIZE_DEFAULTS.standard.buttonShadowY}px</p></div><div><strong>28px compact</strong><p>Height {STUDIO_COMPONENT_SIZE_DEFAULTS.compact.height}px · {STUDIO_COMPONENT_SIZE_DEFAULTS.compact.stroke}px stroke · {STUDIO_COMPONENT_SIZE_DEFAULTS.compact.fontSize}px / weight {STUDIO_COMPONENT_SIZE_DEFAULTS.compact.fontWeight} · button-only shadow {STUDIO_COMPONENT_SIZE_DEFAULTS.compact.buttonShadowX}px × {STUDIO_COMPONENT_SIZE_DEFAULTS.compact.buttonShadowY}px</p></div></div></section>
    <p className="vt-confirmed-intro">Confirmed primitives only. Each preview is the production component, not a catalog redraw. Default and compact variants share identical typography and selected-state rules.</p>
    <Family
      title="StudioButton"
      provenance={<Provenance
        primitive="StudioButton"
        tsx="src/studio-ui/primitives/StudioControls.tsx"
        css="src/styles/studio-control-system.css"
        tokens="Shared size tokens: 44px / 28px · 3px / 2px stroke · 32px / 14px font · weight 1000 · button-only 3px / 1.5px shadow offsets"
        imports={["src/studio-ui/index.ts", "src/studio-ui/recipes/index.tsx", "src/studio-ui/StudioHubCertification.tsx", "src/views/ActionableTactics.tsx", "src/components/CommentResponder.tsx", "src/views/VideoDirector.tsx", "src/components/CommunityPostGenerator.tsx"]}
      />}
    >
      <div className="vt-confirmed-variant">
        <span>44px default</span>
        <StudioButton heightVariant="44">Studio Button</StudioButton>
      </div>
      <div className="vt-confirmed-variant">
        <span>28px compact</span>
        <StudioButton heightVariant="28">Studio Button</StudioButton>
      </div>
      <div className="vt-confirmed-variant">
        <span>44px selected</span>
        <StudioButton selected heightVariant="44">Studio Button</StudioButton>
      </div>
      <div className="vt-confirmed-variant">
        <span>28px selected</span>
        <StudioButton selected heightVariant="28">Studio Button</StudioButton>
      </div>
    </Family>
    <Family
      title="StudioSplitLeftButton"
      provenance={<Provenance
        primitive="StudioSplitLeftButton"
        tsx="src/studio-ui/primitives/StudioControls.tsx"
        css="src/styles/studio-control-system.css"
        tokens="44px / 28px · 3px / 2px stroke · 32px / 14px weight-1000 text · button-only 3px / 1.5px shadow · selected swaps pair A/B fills only"
        imports={["src/studio-ui/index.ts", "src/studio-ui/StudioHubCertification.tsx", "src/views/VideoDirector.tsx", "src/components/CommunityPostGenerator.tsx"]}
      />}
    >
      <div className="vt-confirmed-variant">
        <span>44px default</span>
        <StudioSplitLeftButton icon={<Sparkles size={18} />} heightVariant="44">Generate</StudioSplitLeftButton>
      </div>
      <div className="vt-confirmed-variant">
        <span>28px compact</span>
        <StudioSplitLeftButton icon={<Sparkles size={14} />} heightVariant="28">Generate</StudioSplitLeftButton>
      </div>
      <div className="vt-confirmed-variant">
        <span>44px selected</span>
        <StudioSplitLeftButton icon={<Settings2 size={18} />} selected heightVariant="44">Workspace Action</StudioSplitLeftButton>
      </div>
      <div className="vt-confirmed-variant">
        <span>28px selected</span>
        <StudioSplitLeftButton icon={<Settings2 size={14} />} selected heightVariant="28">Workspace Action</StudioSplitLeftButton>
      </div>
    </Family>

    <Family
      title="StudioLegendMultiDropdown · V2 (replaces V1 labeled dropdown)"
      provenance={<Provenance
        primitive="StudioLegendMultiDropdown · 140"
        tsx="src/studio-ui/primitives/StudioControls.tsx"
        css="src/styles/studio-control-system.css"
        tokens="Pair A trigger/menu · pair B floating legend and CLEAR ALL · shared 44px / 28px typography and stroke tokens · custom scrollable multiselect menu"
        imports={["src/studio-ui/index.ts", "src/views/VideoPublisher.tsx", "src/views/VideoManager.tsx"]}
      />}
    >
      <div className="vt-confirmed-variant">
        <span>44px · custom open menu · multiselect</span>
        <StudioLegendMultiDropdown
          label="FILTERS"
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
          label="STYLE"
          sizeVariant="compact"
          placeholder="ANY STYLE"
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
