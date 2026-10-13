import React from "react"
import { Check, Settings2, Sparkles } from "lucide-react"
import { StudioButton, StudioLabeledDropdown, StudioLegendMultiDropdown, StudioSplitLeftButton } from "../../studio-ui"
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
    <p className="vt-confirmed-intro">Confirmed primitives only. Each preview is the production component, not a catalog redraw. Default and compact variants share identical typography and selected-state rules.</p>
    <Family
      title="StudioButton"
      provenance={<Provenance
        primitive="StudioButton"
        tsx="src/studio-ui/primitives/StudioControls.tsx"
        css="src/styles/studio-control-system.css"
        tokens="44px / 28px height · 3px black stroke · 8px radius · 14px uppercase font · weight 900 · line-height 1 · 4px offset shadow · selected outline 3px black"
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
        <StudioButton selected heightVariant="44"><Check size={16} /> Selected</StudioButton>
      </div>
      <div className="vt-confirmed-variant">
        <span>28px selected</span>
        <StudioButton selected heightVariant="28"><Check size={14} /> Selected</StudioButton>
      </div>
    </Family>
    <Family
      title="StudioSplitLeftButton"
      provenance={<Provenance
        primitive="StudioSplitLeftButton"
        tsx="src/studio-ui/primitives/StudioControls.tsx"
        css="src/styles/studio-control-system.css"
        tokens="44px / 28px total height · icon rail equals total height · 3px black stroke/divider · 8px / 6px radius · 14px uppercase label · weight 900 · 4px / 3px offset shadow · selected state swaps pair A/B fills only"
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
      title="StudioLabeledDropdown"
      provenance={<Provenance
        primitive="StudioLabeledDropdown · 139"
        tsx="src/studio-ui/primitives/StudioControls.tsx"
        css="src/styles/studio-control-system.css"
        tokens="44px standard / 28px compact · uppercase label · 3px stroke · 4px / 3px pair-aware shadow · module pair A/B colors"
        imports={["src/studio-ui/index.ts", "src/views/VideoPublisher.tsx", "src/views/VideoManager.tsx"]}
      />}
    >
      <div className="vt-confirmed-variant">
        <span>44px standard · 11 styles</span>
        <StudioLabeledDropdown
          label="STYLE"
          sizeVariant="standard"
          defaultValue="default"
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
      <div className="vt-confirmed-variant">
        <span>28px compact · 11 styles</span>
        <StudioLabeledDropdown
          label="STYLE"
          sizeVariant="compact"
          defaultValue="cinematic"
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

    <Family
      title="StudioLegendMultiDropdown · 09/V2"
      provenance={<Provenance
        primitive="StudioLegendMultiDropdown · 140"
        tsx="src/studio-ui/primitives/StudioControls.tsx"
        css="src/styles/studio-control-system.css"
        tokens="Pair A trigger/menu · pair B floating legend, selected checkbox and CLEAR ALL · 44px / 28px heights · 3px black stroke · 8px / 6px radius · 4px / 3px offset shadow · selected-count badge · scrollable custom menu"
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
