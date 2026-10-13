import React from "react"
import { Check, Settings2, Sparkles } from "lucide-react"
import { StudioButton, StudioSplitLeftButton } from "../../studio-ui"
import "./studio-hub-confirmed-primitive-catalog.css"

type Size = "44px" | "28px"

const sizeClass = (size: Size) => size === "44px" ? "vt-confirmed-button-44" : "vt-confirmed-button-28"

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
        <StudioButton className={sizeClass("44px")}>Studio Button</StudioButton>
      </div>
      <div className="vt-confirmed-variant">
        <span>28px compact</span>
        <StudioButton className={sizeClass("28px")}>Studio Button</StudioButton>
      </div>
      <div className="vt-confirmed-variant">
        <span>44px selected</span>
        <StudioButton selected className={sizeClass("44px")}><Check size={16} /> Selected</StudioButton>
      </div>
      <div className="vt-confirmed-variant">
        <span>28px selected</span>
        <StudioButton selected className={sizeClass("28px")}><Check size={14} /> Selected</StudioButton>
      </div>
    </Family>
    <Family
      title="StudioSplitLeftButton"
      provenance={<Provenance
        primitive="StudioSplitLeftButton"
        tsx="src/studio-ui/primitives/StudioControls.tsx"
        css="src/styles/studio-control-system.css"
        tokens="44px / 28px total height · icon rail equals total height · 3px black stroke/divider · 8px radius · 14px uppercase label · weight 900 · line-height 1 · same button shadow and selected outline as StudioButton"
        imports={["src/studio-ui/index.ts", "src/studio-ui/StudioHubCertification.tsx", "src/views/VideoDirector.tsx", "src/components/CommunityPostGenerator.tsx"]}
      />}
    >
      <div className="vt-confirmed-variant">
        <span>44px default</span>
        <StudioSplitLeftButton icon={<Sparkles size={18} />} className={sizeClass("44px")}>Generate</StudioSplitLeftButton>
      </div>
      <div className="vt-confirmed-variant">
        <span>28px compact</span>
        <StudioSplitLeftButton icon={<Sparkles size={14} />} className={sizeClass("28px")}>Generate</StudioSplitLeftButton>
      </div>
      <div className="vt-confirmed-variant">
        <span>44px selected</span>
        <StudioSplitLeftButton icon={<Settings2 size={18} />} selected className={sizeClass("44px")}>Workspace Action</StudioSplitLeftButton>
      </div>
      <div className="vt-confirmed-variant">
        <span>28px selected</span>
        <StudioSplitLeftButton icon={<Settings2 size={14} />} selected className={sizeClass("28px")}>Workspace Action</StudioSplitLeftButton>
      </div>
    </Family>
  </div>
)

export default StudioHubConfirmedPrimitiveCatalog
