import React from "react"
import { Settings2, Sparkles } from "lucide-react"
import {
  STUDIO_COMPONENT_GLOBAL_DEFAULTS,
  STUDIO_COMPONENT_SIZE_DEFAULTS,
  StudioButton,
  StudioActionButton,
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

const CANONICAL_SKINS = [{ skin: "solid" as const, label: "SOLID" }, { skin: "color-swap" as const, label: "COLOR SWAP" }, { skin: "black-indicator" as const, label: "BLACK" }, { skin: "white-indicator" as const, label: "WHITE" }]
const WORD_TOGGLE_SKINS = CANONICAL_SKINS
const CanonicalControlFamilies: React.FC = () => {
  const [switches, setSwitches] = React.useState<boolean[]>(Array(8).fill(false))
  const [choices, setChoices] = React.useState<boolean[]>(Array(12).fill(false))
  const [words, setWords] = React.useState<boolean[]>(Array(8).fill(false))
  const flip = (setter: React.Dispatch<React.SetStateAction<boolean[]>>, index: number, value?: boolean) => setter(current => current.map((old, i) => i === index ? (value ?? !old) : old))
  return <>
    <Family title="44px Switches" nonDefaultSettings={["The switch starts OFF; turning it ON moves the indicator to the selected side.", "Round and rectangular shapes change the track and handle corners, not the 44px control height.", "SOLID, COLOR SWAP, BLACK, and WHITE change the selected indicator treatment; SOLID is the default.", "A disabled switch cannot be changed and remains visibly muted."]} provenance={<Provenance primitive="StudioSwitch" tsx="src/studio-ui/primitives/StudioControls.tsx" css="src/styles/studio-control-system.css" tokens="75.68×44px track; shared four-skin variants." imports={["src/studio-ui/primitives/StudioControls.tsx"]} />}>
      <div className="vt-confirmed-control-family">{(["round", "rect"] as const).map((shape, row) => <div className="vt-confirmed-control-row" key={shape}><strong>{shape === "round" ? "ROUND" : "RECTANGULAR"}</strong><div className="vt-confirmed-control-variants">{CANONICAL_SKINS.map((skin, col) => { const index = row * 4 + col; return <div key={skin.skin}><small>{skin.label}</small><StudioSwitch shape={shape} skin={skin.skin} checked={switches[index]} aria-label={shape + " " + skin.label} onClick={() => flip(setSwitches, index)} /></div> })}</div></div>)}</div>
    </Family>
    <Family title="44px Radio + Checkbox" nonDefaultSettings={["Radio, checkmark checkbox, and wide-X checkbox are separate public controls with their own selection marks.", "Round or rectangular shape changes the outer control shape; the wide-X checkbox changes only the mark.", "SOLID is the default skin; COLOR SWAP, BLACK, and WHITE change the selected indicator colors.", "Selected controls show their mark; disabled controls cannot be changed and appear muted."]} provenance={<Provenance primitive="StudioRadio / StudioCheckbox / StudioXCheckbox" tsx="src/studio-ui/primitives/StudioControls.tsx" css="src/styles/studio-control-system.css" tokens="44×44px controls; checkmark and wide-X checkbox marks." imports={["src/studio-ui/primitives/StudioControls.tsx"]} />}>
      <div className="vt-confirmed-control-family">{([{Component:StudioRadio,label:"CIRCULAR RADIO",shape:"round" as const},{Component:StudioCheckbox,label:"CHECKMARK CHECKBOX",shape:"rect" as const},{Component:StudioXCheckbox,label:"WIDE-X CHECKBOX",shape:"rect" as const}]).map((item,row) => { const ChoiceComponent = item.Component; return <div className="vt-confirmed-control-row" key={item.label}><strong>{item.label}</strong><div className="vt-confirmed-control-variants">{CANONICAL_SKINS.map((skin,col) => { const index = row * 4 + col; return <div key={skin.skin}><small>{skin.label}</small><ChoiceComponent shape={item.shape} skin={skin.skin} checked={choices[index]} aria-label={item.label + " " + skin.label} onClick={() => flip(setChoices, index)} /></div> })}</div></div> })}</div>
    </Family>
    <Family title="Word Toggles · 44px + 28px" nonDefaultSettings={["The standard toggle is 44px high; choosing size 28 selects the compact 28px version.", "SOLID is the default skin; COLOR SWAP, BLACK, and WHITE change the active handle treatment.", "The first word is selected by default; selecting the second word changes the value to ON.", "Custom words replace the two displayed labels while preserving the same two-state interaction."]} provenance={<Provenance primitive="StudioWordToggle" tsx="src/studio-ui/primitives/StudioControls.tsx" css="src/styles/studio-control-system.css" tokens="Text-measured active handle; standard and compact variants." imports={["src/studio-ui/primitives/StudioControls.tsx"]} />}>
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
      <div className="vt-confirmed-size-card vt-confirmed-action-exception"><strong>PROMINENT ACTION EXCEPTION · SEPARATE FAMILY</strong><span>56px fixed height · 3px stroke · 6px radius · 3px stationary shadow · 20px / weight 1000 text.</span><span>Rendered by StudioActionButton; not a StudioButton size and not part of the 44px / 28px ordinary control contract.</span></div>
      <div className="vt-confirmed-global-grid">{Object.entries(STUDIO_COMPONENT_GLOBAL_DEFAULTS).map(([key, value]) => <div key={key}><strong>{key.replace(/([A-Z])/g, " $1")}</strong><span>{formatDefaultValue(value)}</span></div>)}</div><div className="vt-confirmed-defaults-explainer"><strong>HOW TO READ THESE DEFAULTS</strong><p><b>Standard:</b> 44px high, 3px border, 6px radius. <b>Compact:</b> 28px high, 2px border, 4px radius. Font family and weight are Inter / 1000 unless a documented functional exception applies.</p><p><b>Text fields at rest:</b> primary-color text and caret, primary fill at 50% opacity, black outer border, and primary inset stroke. <b>Focused:</b> primary fill at 15% opacity, black text, the primary inset stroke remains, and the secondary-color focus accent is layered at zero offset.</p><p><b>Focus measurement note:</b> the last live browser audit measured the visible secondary-color accent as a 3px standard / 2px compact box shadow; the computed CSS outline itself measured 1px. These are separate layers, not interchangeable widths. Re-check the rendered deployment before calling the current branch visually certified.</p></div>
    </section>
    <section className="vt-confirmed-family vt-confirmed-exception-index" aria-labelledby="vt-confirmed-exception-index-title">
      <h3 id="vt-confirmed-exception-index-title">Global Exceptions &amp; Verification Boundary</h3>
      <p>Canonical source: <code>src/studio-ui/primitives/StudioControls.tsx</code> + <code>src/styles/studio-control-system.css</code>. Full register: <code>docs/ui/STUDIO_CONTROLS_GLOBAL_DEFAULTS_AND_EXCEPTION_INDEX.md</code>.</p>
      <ul>
        <li><strong>DOCUMENTED EXCEPTION · Multiline textarea:</strong> taller writing surface, 92px minimum, 18px standard / 14px compact typography, weight 1000; selected size still controls border, radius, focus, and caret.</li>
        <li><strong>DOCUMENTED EXCEPTION · Prominent workflow action:</strong> StudioActionButton is a separate fixed 56px family; ordinary StudioButton supports only standard 44px and compact 28px.</li>
        <li><strong>DOCUMENTED EXCEPTION · Dropdown panel/options:</strong> menu rows and the floating panel are not button-press surfaces. Panel shadow is stationary; menu-specific row typography is governed by the production dropdown CSS.</li>
        <li><strong>BROWSER CAPABILITY · Block caret:</strong> the global stylesheet requests a native block insertion caret with <code>caret-shape: block</code> and retains native insertion behavior when a browser does not implement that property. Never simulate a caret with a fake overlay.</li>
        <li><strong>VERIFICATION GATE · Visual states:</strong> source governance does not replace browser verification. Confirm standard/compact sizing, selected and disabled states, keyboard focus, open dropdown stacking, narrow-screen wrapping, and reduced motion in a rendered browser.</li>
      </ul>
      <p><strong>Audit status:</strong> this gallery renders imported production primitives and uses catalog CSS for specimen layout only. A passing source test or build is not a claim of live visual certification.</p>
    </section>
    <Family title="Studio Text Input · Standalone" nonDefaultSettings={["The field defaults to the 44px standard size; the compact option uses 28px geometry.", "Search and number inputs keep the same Studio field border, typography, fill, caret, and focus rules.", "Disabled fields cannot receive edits; read-only fields can still be focused and their text selected.", "Placeholder text matches entered-text typography. Native input options such as input mode, autocomplete, and maximum length remain configurable."]} provenance={<Provenance primitive="StudioTextInput" tsx="src/studio-ui/primitives/StudioControls.tsx" css="src/styles/studio-control-system.css" tokens="Native input; standard 44px and compact 28px size variants; TYPE HERE placeholder shares entered-text typography; independent of SubToolbox primitives." imports={["src/studio-ui/primitives/StudioControls.tsx"]} />}>
      <div className="vt-confirmed-variant is-full-row"><span>44px standard · StudioTextInput</span><StudioTextInput sizeVariant="standard" aria-label="Studio text input 44px" placeholder="TYPE HERE" data-vt-library-component="StudioTextInput" /></div>
      <div className="vt-confirmed-variant"><span>28px compact A · StudioTextInput</span><StudioTextInput sizeVariant="compact" aria-label="Studio text input 28px A" placeholder="TYPE HERE" data-vt-library-component="StudioTextInput" /></div><div className="vt-confirmed-variant"><span>28px compact B · StudioTextInput</span><StudioTextInput sizeVariant="compact" aria-label="Studio text input 28px B" placeholder="TYPE HERE" data-vt-library-component="StudioTextInput" /></div>
    </Family>
    <Family title="Studio Text Area · Standalone" nonDefaultSettings={["Text areas keep a 92px minimum writing surface so longer copy remains readable and print-friendly.", "Standard text uses 18px and compact text uses 14px; both retain Inter and weight 1000.", "The selected family still controls the border and radius: 44px uses a 3px border and 6px radius; 28px uses 2px and 4px.", "The rows setting changes the initial visible lines, and users can resize the surface vertically.", "Disabled text areas cannot be edited; read-only text areas can be focused and selected."]} provenance={<Provenance primitive="StudioTextArea" tsx="src/studio-ui/primitives/StudioControls.tsx" css="src/styles/studio-control-system.css" tokens="Native textarea; 92px minimum surface; standard 18px / compact 14px typography at weight 1000; preserves selected family geometry, focus, and caret; independent of SubToolbox primitives." imports={["src/studio-ui/primitives/StudioControls.tsx"]} />}>
      <div className="vt-confirmed-variant is-full-row"><span>44px standard · StudioTextArea</span><StudioTextArea sizeVariant="standard" rows={4} aria-label="Studio text area 44px" placeholder="TYPE HERE" data-vt-library-component="StudioTextArea" /></div>
      <div className="vt-confirmed-variant is-full-row"><span>28px compact · StudioTextArea</span><StudioTextArea sizeVariant="compact" rows={4} aria-label="Studio text area 28px" placeholder="TYPE HERE" data-vt-library-component="StudioTextArea" /></div>
    </Family>
    <CanonicalControlFamilies />
    <p className="vt-confirmed-intro">Confirmed primitives only. Each preview is the production component, not a catalog redraw. Standard and compact variants share the global Inter / weight-1000 / uppercase contract; geometry, icon scale, and stroke are size-specific.</p>
    <Family title="Button" nonDefaultSettings={["The button defaults to 44px; the explicit compact height selects 28px. The older compact size option is used only when no height is supplied.", "Accent is the default tone; neutral, danger, warning, and success communicate alternate action meaning.", "Selected buttons use the secondary module color and expose a pressed state; disabled buttons cannot be activated.", "Loading exposes its busy state and disables activation until loading ends.", "The face owns the visible border and shadow; hover and press move the face without moving the shadow anchor."]} provenance={<Provenance primitive="StudioButton" tsx="src/studio-ui/primitives/StudioControls.tsx" css="src/styles/studio-control-system.css" tokens="Button-only shadow; canonical size defaults." imports={["src/studio-ui/primitives/StudioControls.tsx"]} />}>
      <div className="vt-confirmed-variant is-full-row"><span>44px standard · default</span><StudioButton heightVariant="44">button</StudioButton></div>
      <div className="vt-confirmed-variant"><span>28px compact · default A</span><StudioButton heightVariant="28">button</StudioButton></div><div className="vt-confirmed-variant"><span>28px compact · default B</span><StudioButton heightVariant="28">button</StudioButton></div>
      <div className="vt-confirmed-variant is-full-row"><span>44px standard · selected</span><StudioButton selected heightVariant="44">button</StudioButton></div>
      <div className="vt-confirmed-variant"><span>28px compact · selected A</span><StudioButton selected heightVariant="28">button</StudioButton></div><div className="vt-confirmed-variant"><span>28px compact · selected B</span><StudioButton selected heightVariant="28">button</StudioButton></div>
    </Family>
    <Family title="Prominent Action · 56px" nonDefaultSettings={["This is a distinct prominent-action family, not a third size of the ordinary button.", "Its height is fixed at 56px with a 3px border, 6px radius, and stationary 3px shadow.", "The action label uses the dedicated 20px Inter / weight-1000 typography.", "While loading, the action reports a busy state and cannot be activated; disabled actions also block interaction."]} provenance={<Provenance primitive="StudioActionButton" tsx="src/studio-ui/primitives/StudioControls.tsx" css="src/styles/studio-control-system.css" tokens="Separate fixed 56px action family; never used as a standard/compact size alias." imports={["src/studio-ui/primitives/StudioControls.tsx"]} />}>
      <div className="vt-confirmed-variant is-full-row"><span>56px prominent workflow action</span><StudioActionButton data-vt-library-component="StudioActionButton">CREATE PACKAGE</StudioActionButton></div>
    </Family>
    <Family title="Split-left" nonDefaultSettings={["The split-left button defaults to 44px; the compact option selects 28px.", "Accent is the default tone; neutral, danger, warning, and success are available for semantic action meaning.", "Selected state swaps the face and icon-rail pair colors; disabled state prevents activation.", "Loading reports a busy state and disables activation until loading clears.", "The required icon occupies the fixed left rail; size, tone, loading, and selected behavior follow the ordinary Studio button contract."]} provenance={<Provenance primitive="StudioSplitLeftButton" tsx="src/studio-ui/primitives/StudioControls.tsx" css="src/styles/studio-control-system.css" tokens="44px icons explicitly enlarged; selected state swaps module-pair fills." imports={["src/studio-ui/primitives/StudioControls.tsx"]} />}>
      <div className="vt-confirmed-variant is-full-row"><span>44px standard · default</span><StudioSplitLeftButton icon={<Sparkles />} heightVariant="44">split-left</StudioSplitLeftButton></div>
      <div className="vt-confirmed-variant"><span>28px compact · default A</span><StudioSplitLeftButton icon={<Sparkles />} heightVariant="28">split-left</StudioSplitLeftButton></div><div className="vt-confirmed-variant"><span>28px compact · default B</span><StudioSplitLeftButton icon={<Sparkles />} heightVariant="28">split-left</StudioSplitLeftButton></div>
      <div className="vt-confirmed-variant is-full-row"><span>44px standard · selected</span><StudioSplitLeftButton icon={<Settings2 />} selected heightVariant="44">split-left</StudioSplitLeftButton></div>
      <div className="vt-confirmed-variant"><span>28px compact · selected A</span><StudioSplitLeftButton icon={<Settings2 />} selected heightVariant="28">split-left</StudioSplitLeftButton></div><div className="vt-confirmed-variant"><span>28px compact · selected B</span><StudioSplitLeftButton icon={<Settings2 />} selected heightVariant="28">split-left</StudioSplitLeftButton></div>
    </Family>
    <Family
      title="Text input and textarea"
      nonDefaultSettings={["Labeled inputs default to 44px; choosing compact selects the 28px field family. Text areas keep their taller multiline surface.", "The control level can be set to l0, l1, or l2; l1 is the default and the level does not change the canonical field size tokens.", "The visible label is supplied through label; there is no overlayLabel prop. A focused or non-empty field lifts the label above the border.", "Disabled fields cannot be edited; read-only fields can be focused and selected without changing their value.", "Text areas are the documented exception: 92px minimum surface, 18px standard or 14px compact text, both weight 1000; border and radius still follow the selected family.", "Only Compact B adds the solid secondary-color focus stroke. Compact A and standard fields retain the shared focus treatment."]}
      provenance={<Provenance primitive="StudioLabeledInput / StudioLabeledTextArea · primitives 141 / 142" tsx="src/studio-ui/primitives/StudioControls.tsx" css="src/styles/studio-control-system.css" tokens="Textarea is multiline, content-height, and vertically resizable." imports={["src/studio-ui/primitives/StudioControls.tsx"]} />}
    >
      <div className="vt-confirmed-variant is-full-row"><span>141 · 44px labeled text input</span><StudioLabeledInput label="TITLE" aria-label="Labeled title input 44px" sizeVariant="standard" /></div>
      <div className="vt-confirmed-variant"><span>141 · 28px labeled input A</span><StudioLabeledInput label="TITLE" aria-label="Labeled title input 28px A" sizeVariant="compact" /></div>
      <div className="vt-confirmed-variant"><span>141 · 28px labeled input B</span><StudioLabeledInput label="TITLE" aria-label="Labeled title input 28px B" variant="b" sizeVariant="compact" /></div>
      <div className="vt-confirmed-variant is-full-row"><span>142 · content-height labeled textarea</span><StudioLabeledTextArea label="DESCRIPTION" aria-label="Labeled description textarea" rows={4} /></div>
    </Family>

    <Family
      title="Dropdown"
      nonDefaultSettings={["The dropdown trigger defaults to 44px; compact selects the 28px trigger and matching menu-row family.", "The control level can be l0, l1, or l2; l1 is the default and does not replace the trigger size contract.", "A disabled trigger cannot open the menu. Keyboard focus and selected options remain governed by the production dropdown component.", "Use a controlled value when the parent owns selection; use a default value to initialize selection managed inside the component.", "Placeholder text appears when nothing is selected; the clear label names the clear action, and maximum menu height limits the floating panel.", "Disabled options remain visible for context but cannot be selected. The panel may have a stationary shadow; options have no button-press shadow or motion."]}
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
