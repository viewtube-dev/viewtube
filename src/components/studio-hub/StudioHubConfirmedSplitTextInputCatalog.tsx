import React from "react"
import { Check, Settings2, Sparkles } from "lucide-react"
import { StudioSplitTextInput } from "../../studio-ui/primitives/StudioSplitTextInput"

export const StudioHubConfirmedSplitTextInputCatalog: React.FC = () => (
  <div className="vt-confirmed-catalog">
    <section className="vt-confirmed-family" data-vt-library-component="StudioSplitTextInput">
      <h3>Split text input · Standard · Left / Right / Double</h3>
      <div className="vt-confirmed-variants">
        <div className="vt-confirmed-variant is-full-row">
          <span>44PX STANDARD · SPLIT LEFT</span>
          <StudioSplitTextInput split="left" sizeVariant="standard" leftIcon={<Check />} aria-label="Standard split-left text input" placeholder="TYPE HERE" />
          <span>44PX STANDARD · SPLIT RIGHT</span>
          <StudioSplitTextInput split="right" sizeVariant="standard" rightIcon={<Settings2 />} aria-label="Standard split-right text input" placeholder="TYPE HERE" />
          <span>44PX STANDARD · DOUBLE SPLIT</span>
          <StudioSplitTextInput split="double" sizeVariant="standard" leftIcon={<Check />} rightIcon={<Sparkles />} aria-label="Standard double-split text input" placeholder="TYPE HERE" />
        </div>
      </div>
      <details className="vt-confirmed-source-details">
        <summary>Settings + source</summary>
        <p>Composes StudioSplitLeftBadge / StudioSplitRightBadge / StudioDoubleSplitBadge with StudioTextInput. Standard: 44px height, 3px perimeter, 6px radius, 38px input type. Decorative rails use secondary; the shell owns one perimeter and one divider per rail.</p>
        <p>Source: src/studio-ui/primitives/StudioSplitTextInput.tsx · src/studio-ui/primitives/studio-split-text-input.css</p>
        <p>Browser geometry, editing, focus and mobile verification pending; catalog placement is not visual certification.</p>
      </details>
    </section>
  </div>
)
