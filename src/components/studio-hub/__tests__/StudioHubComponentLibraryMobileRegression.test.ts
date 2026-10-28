import { readFileSync } from "node:fs"
import { resolve } from "node:path"
import { describe, expect, it } from "vitest"

const read = (path: string) => readFileSync(resolve(process.cwd(), path), "utf8")

describe("Studio Hub Component Library mobile regression", () => {
  it("mounts frozen and primitive-migration catalogs from the production library wrapper", () => {
    const library = read("src/components/ToolboxUIReferenceLibrary.tsx")
    expect(library).toContain('import { StudioHubCompletePrimitiveCatalog }')
    expect(library).toContain('import { StudioHubPrimitiveMigrationCatalog }')
    expect(library).toContain('import { StudioHubProductionButtonCatalog }')
    expect(library).toContain("<StudioHubCompletePrimitiveCatalog paletteIndex={paletteIndex} />")
    expect(library).toContain("<StudioHubPrimitiveMigrationCatalog paletteIndex={paletteIndex} />")
    expect(library).toContain("<StudioHubProductionButtonCatalog paletteIndex={paletteIndex} />")
    expect(library).toContain('data-vt-library-track={track}')
  })

  it("keeps desktop and compact mobile shell geometry in production authority rather than a library override", () => {
    const library = read("src/components/ToolboxUIReferenceLibrary.tsx")
    const tokens = read("src/components/subtoolbox/tokens.ts")
    const css = read("src/styles/toolbox-system.css")

    expect(library).not.toContain("--vt-toolbox-header-height:")
    expect(tokens).toContain("height: 80")
    expect(tokens).toContain("height: TOOLBOX_LEVEL_DNA.l0.height")
    expect(css).toContain("--vt-toolbox-header-height: 80px")
    expect(css).toContain("--vt-subtoolbox-header-height: 56px")
    expect(tokens).toContain("TOOLBOX_MOBILE_HEADER_DNA")
    expect(css).toContain("--vt-subtoolbox-header-height: 44px")
  })

  it("keeps the primitive comparison track on shared component DNA", () => {
    const tokens = read("src/components/subtoolbox/tokens.ts")
    const primitives = read("src/components/subtoolbox/SubToolboxPrimitives.tsx")
    const migration = read("src/components/studio-hub/StudioHubPrimitiveMigrationCatalog.tsx")
    expect(tokens).toContain("COMPONENT_LEVEL_DNA")
    expect(tokens).toContain("getComponentLevelCssVars")
    expect(primitives).toContain("data-vt-control-level")
    expect(migration).toContain("STUDIO_HUB_MIGRATED_FAMILIES")
    expect(migration).toContain("SubToolboxSegmentedToggle")
    expect(migration).toContain("STUDIO_HUB_MIGRATED_FAMILIES.map")
    expect(migration).not.toContain("HardcodedGenericControl")
    expect(migration).not.toContain("hardcoded-fallback")
    expect(migration).toContain("SubToolboxSplitDropdown")
    expect(migration).toContain("SubToolboxRangeSlider")
    expect(migration).toContain("SubToolboxTagEditor")
    expect(migration).toContain("SubToolboxKnob")
    expect(migration).toContain("SubToolboxAlphabeticalSpectrumTags")
    expect(migration).toContain("SubToolboxDataTable")
    expect(migration).toContain("SubToolboxDialog")
    expect(migration).not.toContain("forceOpen content=\"TOOLTIP\"")
  })


  it("keeps the redesigned floating/status/data primitives in the production track", () => {
    const primitive = read("src/components/subtoolbox/SubToolboxPrimitives.tsx")
    const migration = read("src/components/studio-hub/StudioHubPrimitiveMigrationCatalog.tsx")
    const css = read("src/styles/subtoolbox-system.css")

    expect(primitive).toContain("useSubToolboxOverlayPosition")
    expect(primitive).toContain("SubToolboxLedDot")
    expect(migration).toContain('"LED Dot"')
    expect(migration).toContain('"Loader Progress"')
    expect(migration).toContain('"Loader Split"')
    expect(migration).toContain('"Loader Orbit"')
    expect(migration).toContain('"Loader Bars"')
    expect(migration).toContain('name === "Calendar" ? (["l0"]')
    expect(css).toContain("--vt-floating-overlay-z:2147483000")
    expect(css).toContain("vt-subtoolbox-led-ripple")
    expect(css).toContain("vt-subtoolbox-controller-thumb")
    expect(css).toContain("vt-subtoolbox-loader-progress")
    expect(css).toContain("vt-subtoolbox-tree-row[data-depth=\"1\"]")
  })

  it("keeps catalog placement separate from production primitive geometry", () => {
    const migration = read("src/components/studio-hub/StudioHubPrimitiveMigrationCatalog.tsx")
    const css = read("src/components/studio-hub/studio-hub-primitive-migration-catalog.css")
    const primitiveCss = read("src/styles/subtoolbox-system.css")
    const splitCss = read("src/styles/subtoolbox-system.css")

    expect(css).toContain('[data-vt-subtoolbox="true"] > div:first-child')
    expect(css).toContain("border:0!important")
    expect(css).toContain(".vt-catalog-demo{")
    expect(css).toContain("--vt-catalog-level-height:56px")
    expect(css).toContain('data-vt-preview-mode="compound"')
    expect(css).not.toContain(".vt-catalog-demo > *{\n  width:fit-content!important")
    expect(css).not.toContain("width:var(--vt-catalog-standard-inline)!important")
    expect(migration).toContain("CATALOG_PREVIEW_GEOMETRY")
    expect(migration).toContain('data-vt-preview-portrait={getCatalogPreviewGeometry(name).portraitStack ? "stack" : "grid"}')
    expect(css).toContain('data-vt-preview-portrait="stack"')
    expect(css).toContain("grid-template-columns:repeat(3,minmax(0,max-content))")
    expect(css).toContain("@media(max-width:520px) and (orientation:portrait)")
    expect(css).toContain("grid-template-columns:minmax(0,1fr)")
    expect(css).toContain("@media(max-height:520px) and (orientation:landscape)")
    expect(primitiveCss).toContain("CANONICAL INTRINSIC GEOMETRY — 2026-09-24")
    expect(primitiveCss).toContain("min-width:calc(var(--vt-component-height)*5.15)")
    expect(splitCss).toContain("min-width:calc(var(--vt-component-height)*4.15)")
    expect(splitCss).toContain("min-width:calc(var(--vt-component-height)*4.8)")
  })

  it("registers the visual-key tooltip and both new skeleton anatomies", () => {
    const primitive = read("src/components/subtoolbox/SubToolboxPrimitives.tsx")
    const migration = read("src/components/studio-hub/StudioHubPrimitiveMigrationCatalog.tsx")
    const css = read("src/styles/subtoolbox-system.css")

    expect(primitive).toContain("SubToolboxLegendTooltip")
    expect(primitive).toContain('variant?: "lines" | "compact" | "media"')
    expect(primitive).toContain('ratio?: "16:9" | "1:1" | "4:5"')
    expect(migration).toContain('"Tooltip Visual Key"')
    expect(migration).toContain('"Skeleton Compact"')
    expect(migration).toContain('"Skeleton Media"')
    expect(css).toContain(".vt-subtoolbox-tooltip-bubble.is-legend")
    expect(css).toContain(".vt-subtoolbox-tooltip-legend-row")
    expect(css).toContain(".vt-subtoolbox-skeleton.is-compact")
    expect(css).toContain(".vt-subtoolbox-skeleton.is-media")
  })

  it("registers the canonical media primitive and compound families", () => {
    const media = read("src/components/subtoolbox/SubToolboxMediaPrimitives.tsx")
    const migration = read("src/components/studio-hub/StudioHubPrimitiveMigrationCatalog.tsx")
    const css = read("src/styles/subtoolbox-system.css")

    for (const family of [
      "Media Control Button", "Media Play Toggle", "Media Seek Bar", "Media Volume Control",
      "Media Timecode", "Media Duration Badge", "Media Caption Toggle", "Media Speed Control",
      "Media Poster Frame", "Media Status", "Media Player", "Media Transport Bar",
      "Media Queue", "Media Inspector", "Media Review Panel",
      "Labeled Input", "Labeled Textarea", "Video Selector", "Mini SubToolbox",
    ]) expect(migration).toContain(`"${family}"`)

    expect(media).toContain("SubToolboxMediaPlayer")
    expect(media).toContain("SubToolboxMediaTransportBar")
    expect(media).toContain("SubToolboxMediaQueue")
    expect(media).toContain("SubToolboxMediaInspector")
    expect(media).toContain("SubToolboxMediaReviewPanel")
    expect(css).toContain(".vt-subtoolbox-media-player")
    expect(css).toContain(".vt-subtoolbox-media-transport")
    expect(css).toContain("@media(max-width:620px)")
  })

  it("keeps Video Manager-specific primitive additions in the canonical library", () => {
    const migration = read("src/components/studio-hub/StudioHubPrimitiveMigrationCatalog.tsx")
    const primitives = read("src/components/subtoolbox/SubToolboxPrimitives.tsx")
    const toolbox = read("src/components/Toolbox.tsx")
    const css = read("src/styles/subtoolbox-system.css")
    const toolboxCss = read("src/styles/toolbox-system.css")

    for (const family of ["Labeled Input", "Labeled Textarea", "Video Selector", "Mini SubToolbox"]) {
      expect(migration).toContain(`"${family}"`)
    }
    expect(migration).toContain("StudioTextInput")
    expect(migration).toContain("StudioTextArea")
    expect(primitives).toContain("SubToolboxVideoSelector")
    expect(toolbox).toContain("MiniSubToolbox")
    expect(css).toContain(".vt-subtoolbox-video-selector")
    expect(css).toContain(".vt-studio-floating-field")
    expect(toolboxCss).toContain(".vt-mini-subtoolbox")
  })

  it("exposes both tracks to the automated A/B certification harness", () => {
    const hardcoded = read("src/components/studio-hub/StudioHubCompletePrimitiveCatalog.tsx")
    const primitive = read("src/components/studio-hub/StudioHubPrimitiveMigrationCatalog.tsx")
    const capture = read("scripts/capture-studio-component-certification.mjs")

    expect(hardcoded).toContain("data-vt-family={name}")
    expect(hardcoded).toContain('data-vt-certification-state="hardcoded-reference"')
    expect(primitive).toContain("data-vt-family={name}")
    expect(capture).toContain('{ label: "desktop", width: 1440, height: 1000 }')
    expect(capture).toContain('{ label: "mobile", width: 390, height: 844 }')
    expect(capture).toContain('{ label: "mobile-landscape", width: 844, height: 390 }')
    for (const family of [
      "Split Menu", "Split Left Button", "Split Search", "Input Action", "Tag Editor",
      "Slider", "Range Slider", "Settings Switch", "Checkbox", "Radio", "Tooltip",
      "Progress Value", "Knob Dial", "Tooltip Color", "Hover Card", "Controller Switch",
      "LED Light", "LED Dot", "Horizontal Scrollbar", "Vertical Scrollbar", "Calendar",
      "Loader", "Loader Progress", "Loader Split", "Loader Orbit", "Loader Bars", "Tree View",
      "Tooltip Visual Key", "Skeleton Compact", "Skeleton Media",
    ]) expect(capture).toContain(`["${family}"`)
    expect(capture).toContain('["Tooltip", "Tooltip Color", "Tooltip Visual Key", "Hover Card"].includes(familyName)')
    expect(capture).toContain('captureMode: floatingOverlayFamily && state !== "default" ? "viewport" : "locator"')
    expect(capture).toContain("geometryMinimumUnits")
    expect(capture).toContain("inspectPrimitiveGeometry")
    expect(capture).toContain("squareRailDelta")
    expect(capture).toContain("canonical label clipped")
  })

  it("keeps the requested missing families in the canonical registry", () => {
    const catalog = read("src/components/studio-hub/StudioHubCompletePrimitiveCatalog.tsx")
    for (const family of [
      "Split Search", "Toggle", "Settings Switch", "Checkbox", "Radio", "Slider",
      "Range Slider", "Popover", "Pagination", "Vault Landscape Asset",
      "Vault Portrait Asset", "Vault Audio Asset", "Vault Document Asset",
    ]) expect(catalog).toContain(`\"${family}\"`)
  })

  it("registers the missing Script Architect and metadata compound patterns in the production library", () => {
    const primitives = read("src/components/subtoolbox/SubToolboxPrimitives.tsx")
    const scriptArchitect = read("src/views/ScriptArchitect.tsx")
    const migration = read("src/components/studio-hub/StudioHubPrimitiveMigrationCatalog.tsx")
    for (const family of [
      "Tone / Tension / Cinematic Dropdown",
      "Nested Square Choice",
      "Tag-Adjacent Split Action Row",
      "Multi-Section Script Bar",
      "Ranked Metadata Tag",
      "Education Timestamp Notes",
    ]) {
      expect(migration).toContain(`"${family}"`)
    }
    expect(primitives).toContain("export const SubToolboxScriptBar")
    expect(scriptArchitect).toContain("<SubToolboxScriptBar")
    expect(scriptArchitect).not.toContain("budget.sections.map((section, index) => (")
    expect(migration).toContain("SubToolboxDropdownControl")
    expect(migration).toContain("TagRankTag")
    expect(migration).toContain("EducationTimestampNotes")
    const compound = read("src/components/subtoolbox/SubToolboxCompoundPrimitives.tsx")
    expect(compound).toContain("export const SubToolboxNestedSquareChoice")
    expect(compound).toContain("export const SubToolboxTagActionRow")
  })

  it("registers the requested production button families as live component-library examples", () => {
    const catalog = read("src/components/studio-hub/StudioHubProductionButtonCatalog.tsx")
    const primitives = read("src/components/subtoolbox/SubToolboxPrimitives.tsx")
    const toolbox = read("src/components/Toolbox.tsx")
    for (const family of [
      "SubToolboxButton", "SubToolboxIconButton", "SubToolboxIconTextButton",
      "SubToolboxSplitButton", "StudioSplitLeftButton", "StudioButton",
      "SubToolboxSelectableTag", "SubToolboxInnerActionButton", "SubToolboxActions",
      "SubToolboxRefineButtonBase", "SubToolboxGridActionButton",
    ]) expect(catalog).toContain(family)
    expect(primitives).toContain("export const SubToolboxIconTextButton")
    expect(toolbox).toContain("export const SubToolboxRefineButtonBase")
    expect(catalog).toContain('data-vt-production-button-catalog="true"')
  })

  it("uses a menu dropdown and full-width responsive action rows in Project Manifestation", () => {
    const manifestation = read("src/components/projects/ProjectManifestation.tsx")
    const projectCss = read("src/styles/project-manifestation.css")
    const metadataCss = read("src/styles/subtoolbox-system.css")
    expect(manifestation).toContain("<LegendMultiDropdown")
    expect(manifestation).not.toContain("<SubToolboxSelect")
    expect(manifestation).toContain('className="vt-project-manifestation-actions"')
    expect(read("src/components/metadata/CanonicalMetadataSections.tsx")).toContain('<SubToolboxActions columns={3} forceRow className="vt-metadata-field-actions mt-2">')
    expect(projectCss).toContain("grid-template-columns: repeat(3, minmax(0, 1fr))")
    expect(projectCss).toContain("width: 100% !important")
    expect(metadataCss).toContain(".vt-metadata-field-actions")
    expect(metadataCss).toContain("grid-template-columns: repeat(3, minmax(0, 1fr))")
  })


  it("enforces one authoritative 4px spacing grid across the Confirmed Primitive Library", () => {
    const css = read("src/components/studio-hub/studio-hub-primitive-catalogs.css")
    const catalog = read("src/components/studio-hub/StudioHubConfirmedPrimitiveCatalog.tsx")
    const gridContract = css.slice(css.lastIndexOf("/* Confirmed Primitive Library — authoritative 4px grid system"))
    expect(gridContract).toContain("--vt-confirmed-grid-unit: 4px")
    expect(gridContract).toContain("--vt-confirmed-space-1: calc(var(--vt-confirmed-grid-unit) * 1)")
    expect(gridContract).toContain("--vt-confirmed-space-2: calc(var(--vt-confirmed-grid-unit) * 2)")
    expect(gridContract).toContain("--vt-confirmed-space-3: calc(var(--vt-confirmed-grid-unit) * 3)")
    expect(gridContract).toContain("grid-template-columns: repeat(2, minmax(0, 1fr))")
    expect(gridContract).toContain("grid-template-columns: minmax(0, 1fr)")
    expect(gridContract).toContain("@media (max-width: 560px)")
    expect(gridContract).toContain("min-width: 0")
    expect(gridContract).toContain("overflow-wrap: anywhere")
    expect(catalog).toContain('className="vt-confirmed-catalog"')
    expect(catalog).toContain('className="vt-confirmed-variants"')
    expect(gridContract).not.toContain("gap: 5px")
    expect(gridContract).not.toContain("gap: 6px")
    expect(gridContract).not.toContain("gap: 7px")
    expect(gridContract).not.toContain("gap: 10px")
  })

  it("lists one standard-size live production primitive per confirmed-catalog row", () => {
    const catalog = read("src/components/studio-hub/StudioHubConfirmedPrimitiveCatalog.tsx")
    const controls = read("src/studio-ui/primitives/StudioControls.tsx")
    const publicIndex = read("src/studio-ui/index.ts")
    const expectedRows = [
      "StudioButton", "StudioSplitLeftButton", "StudioDoubleSplitButton",
      "StudioTwoLineButton", "StudioSplitTwoLineButton", "StudioSimpleDropdown",
      "StudioLegendMultiDropdown", "StudioSplitLeftDropdown", "StudioArrowToggle",
      "StudioBarToggle", "StudioWordToggle", "StudioTextInput", "StudioTextArea",
      "StudioTextBox", "StudioSideToggle", "StudioDoubleSideToggle", "StudioCounter",
      "StudioSideCounter", "StudioDoubleSplitSlider", "StudioSplitAccordion",
    ]
    expect(catalog).toContain('title="Direct Imported Primitive Representatives · Standard"')
    for (const primitive of expectedRows) {
      expect(catalog).toContain(`data-vt-library-component="${primitive}"`)
    }
    expect(controls).toContain("export const StudioDoubleSplitButton")
    expect(controls).toContain('data-vt-library-component="StudioDoubleSplitButton"')
    expect(publicIndex).toContain("  StudioDoubleSplitButton,")
    expect(publicIndex).toContain("  StudioDoubleSplitButtonProps,")
    expect(catalog).toContain('accessibleLabel="Three section split accordion standard specimen"')
    expect(catalog).toContain('id: "overview"')
    expect(catalog).toContain('id: "settings"')
    expect(catalog).toContain('id: "details"')
  })


  it("groups switch, toggle, radio, and checkbox specimens into one Controls subfamily", () => {
    const catalog = read("src/components/studio-hub/StudioHubConfirmedPrimitiveCatalog.tsx")
    expect(catalog).toContain("const isSwitchToggleChoiceFamily = (title: string): boolean")
    expect(catalog).toContain("const switchToggleFamilies: React.ReactNode[] = []")
    expect(catalog).toContain('title="Switches / Toggles / Radio / Checkbox"')
    expect(catalog).toContain("if (isSwitchToggleChoiceFamily(title))")
    expect(catalog).toContain("switchToggleFamilies.push(node)")
    expect(catalog).toContain('const controls = grouped.get("Controls") ?? []')
    expect(catalog).toContain("if (switchToggleFamilies.length > 0)")
  })

})
