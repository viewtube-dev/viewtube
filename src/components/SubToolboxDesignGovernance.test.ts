import { readFileSync } from "node:fs"
import { resolve } from "node:path"
import { describe, expect, it } from "vitest"

const productionSubtoolboxConsumers = [
 "src/components/PreLaunchPriming.tsx",
 "src/components/ProjectStudio.tsx",
 "src/views/ActionableTactics.tsx",
 "src/views/MediaAnalyzer.tsx",
 "src/views/VideoManager.tsx",
 "src/views/VideoPublisher.tsx",
 "src/views/MetadataMaster.tsx",
 "src/views/StoryboardStudio.tsx",
 "src/views/supertools/SuperToolPrototypeWorkspace.tsx",
]

const source = (path: string) => readFileSync(resolve(process.cwd(), path), "utf8")
const studioControlStyles = () => [
  "studio-control-system.css", "studio-control-core.css", "studio-control-split.css", "studio-control-fields.css",
].map((file) => source("src/styles/" + file)).join("\n")

describe("subtoolbox design governance", () => {
 it.each(productionSubtoolboxConsumers)("keeps %s on the canonical nested shell", (path) => {
  const contents = source(path)

  expect(contents).not.toMatch(/<Toolbox\s[^>]*variant=["']sub["']/s)
  expect(contents).not.toContain("AccordionContainer")
 })

 it("does not replace palette shadows with inherited black on mobile", () => {
  const responsiveCss = source("src/styles/perf.css")
  const systemCss = source("src/styles/subtoolbox-system.css")

  expect(responsiveCss).not.toMatch(/\.vt-toolbox\[data-vt-toolbox\][^{]*\{[^}]*currentColor/s)
  expect(responsiveCss).not.toContain('--vt-subtoolbox-shadow-offset')
  expect(systemCss).toMatch(/--vt-subtoolbox-shadow-offset:\s*6px/)
  expect(systemCss).not.toContain("--vt-subtoolbox-header-height:44px")
  expect(systemCss).not.toContain("--vt-subtoolbox-shadow-offset:4px")
  expect(systemCss).toContain('[data-vt-toolbox-level="sub"]')
 })

 it("locks the mobile shell density and restored header anatomy", () => {
  const toolboxCss = source("src/styles/toolbox-system.css")
  const systemCss = source("src/styles/subtoolbox-system.css")
  const primitives = source("src/components/subtoolbox/SubToolboxPrimitives.tsx")
  const catalog = source("src/components/studio-hub/StudioHubPrimitiveMigrationCatalog.tsx")

  expect(toolboxCss).toContain("--vt-toolbox-header-height: 56px")
  expect(toolboxCss).toContain("--vt-subtoolbox-header-height: 44px")
  expect(toolboxCss).toContain("--vt-toolbox-shadow-offset: 6px")
  expect(toolboxCss).toContain("--vt-subtoolbox-shadow-offset: 4px")
  expect(toolboxCss).toContain("--vt-toolbox-radius: 14px")
  expect(toolboxCss).toContain("--vt-subtoolbox-radius: 10px")
  expect(systemCss).not.toContain(".vt-toolbox-header-toggle")
  expect(systemCss).toContain(".vt-subtoolbox-file-target.vt-upload-tight-reveal")
  expect(systemCss).toContain("box-shadow: none !important")
  expect(primitives).toContain("export const ToolboxHeaderToggle")
  expect(catalog).toContain('"Toolbox Header Toggle"')
  expect(catalog).toContain('"SubToolbox Header Toggle"')
 })

 it("uses V38 #95 as the canonical Toolbox header toggle primitive", () => {
  const systemCss = source("src/styles/subtoolbox-system.css")
  const toolboxCss = source("src/styles/toolbox-system.css")
  const primitives = source("src/components/subtoolbox/SubToolboxPrimitives.tsx")

  expect(primitives).toContain("Studiotoggle")
  expect(primitives).toContain('data-vt-header-toggle-primitive="studio-word-toggle"')
  expect(primitives).toContain('(orientation: portrait) and (max-width: 768px)')
  expect(primitives).not.toContain("--vt-header-toggle-count")
  expect(systemCss).not.toContain("V38 #95 HEADER SEGMENT AUTHORITY")
  expect(source("src/studio-ui/primitives/StudioControls.tsx")).toContain("vt-studio-44-word-toggle")
  expect(studioControlStyles()).toContain("vt-studio-44-word-toggle")
  expect(systemCss).not.toContain(".vt-toolbox-header-toggle button.is-active")
  expect(studioControlStyles()).toContain("is-active")
  expect(systemCss).not.toContain("grid-template-columns: repeat(var(--vt-header-toggle-count")
  expect(systemCss).not.toContain("box-shadow: 3px 3px 0 0 #000")
  expect(toolboxCss).not.toContain("min-width: 148px")
  expect(toolboxCss).toContain("width: max-content")
 })

 it("keeps header anatomy and primary actions on canonical primitives", () => {
  const toolbox = source("src/components/Toolbox.tsx")
  const primitives = source("src/components/subtoolbox/SubToolboxPrimitives.tsx")
  const catalog = source("src/components/studio-hub/StudioHubPrimitiveMigrationCatalog.tsx")
  const manager = source("src/views/VideoManager.tsx")
  const commentResponder = source("src/components/CommentResponder.tsx")
  const endScreen = source("src/components/EndScreenTool.tsx")

  for (const primitive of [
    "ToolboxHeaderIconRail",
    "ToolboxHeaderTitle",
    "ToolboxHeaderHelpButton",
    "ToolboxHeaderCollapseButton",
    "ToolboxHeaderToggle",
  ]) {
    expect(primitives).toContain(`export const ${primitive}`)
    expect(toolbox).toContain(primitive)
  }

  for (const family of [
    "Toolbox Header Icon Rail",
    "SubToolbox Header Icon Rail",
    "Toolbox Header Title",
    "SubToolbox Header Title",
    "Toolbox Header Help",
    "SubToolbox Header Help",
    "Toolbox Header Collapse",
    "SubToolbox Header Collapse",
    "Toolbox Header Toggle",
    "SubToolbox Header Toggle",
  ]) expect(catalog).toContain(`"${family}"`)

  expect(toolbox).toContain('data-vt-split-left={isSubtoolboxPeer && showIconSection ? "true" : undefined}')
  expect(toolbox).toContain('showIconSection={props.showIconSection ?? true}')
  expect(manager).toContain('<SubToolboxGridActionButton')
  expect(commentResponder).toContain('label="Connect YouTube Channel"')
  expect(endScreen).toContain('label={genLoading ? "Creating..." : "Generate Template"}')
 })

 it("keeps first-layer interior strokes uniform with the upload-frame exception", () => {
  const css = source("src/styles/subtoolbox-system.css")
  const toolboxCss = source("src/styles/toolbox-system.css")

  expect(css).toContain("First visual layer inside a SubToolbox shares one 3px interior stroke")
  expect(css).toContain(":not(.vt-subtoolbox-file-target)")
  expect(css).toContain("--vt-component-stroke: var(--vt-subtoolbox-inner-stroke,3px)!important")
  expect(css).toContain(".vt-subtoolbox-file-target.vt-upload-tight-reveal")
  expect(css).toContain("box-shadow: none !important")
  expect(toolboxCss).toContain(".vt-subtoolbox-inset")
  expect(toolboxCss).toContain("padding: 4px 4px 0 !important")
 })

 it("keeps Thumbnail Studio primitive-native in the mobile density pass", () => {
  const thumbnail = source("src/views/ThumbnailStudio.tsx")

  expect(thumbnail).not.toContain("<button")
  expect(thumbnail).not.toContain("<select")
  expect(thumbnail).not.toContain("StandardUploadBox")
  expect(thumbnail).toContain("SubToolboxFileTarget")
  expect(thumbnail).toContain("SubToolboxSelectableTag")
  expect(thumbnail).toContain("SubToolboxSelectableListRow")
  expect(thumbnail).toContain('label={analyzeLoading ? "Scanning..." : "Scan Potential"}')
 })

 it("keeps the compact inner-control hierarchy below the subtoolbox shell", () => {
  const tokenSource = source("src/components/subtoolbox/tokens.ts")
  const systemCss = source("src/styles/subtoolbox-system.css")

  expect(tokenSource).toContain('radius: 8')
  expect(tokenSource).toContain('radius: 12')
  expect(systemCss).toMatch(/--vt-subtoolbox-inner-radius:\s*8px/)
  expect(systemCss).toContain('var(--vt-subtoolbox-shadow')
 })

 it("keeps the Mini Toolbox Lab divider and collapse timing contract", () => {
  const toolboxSource = source("src/components/Toolbox.tsx")
  const tokenSource = source("src/components/subtoolbox/tokens.ts")

  expect(tokenSource).toContain('duration-[600ms] ease-out motion-reduce:transition-none')
  expect(toolboxSource).toContain('borderBottom: `var(--vt-toolbox-stroke, ${stroke}px) solid black`')
  expect(toolboxSource).toContain('borderBottom: `var(--vt-subtoolbox-stroke, ${SUB_TOOLBOX_INNER_STROKE}px) solid black`')
  expect(toolboxSource).toContain('SHELL_COLLAPSE_DURATION_MS = SUBTOOLBOX_TOKENS.motion.collapseMs')
  expect(toolboxSource).toContain('shouldRenderContent = !unmountWhenClosed || open || keepClosingContentMounted')
  expect(toolboxSource).toContain('shouldRenderContent = !unmountOnClose || open || keepClosingContentMounted')
 })

 it("keeps one token authority and the analytics recipe on the canonical seam", () => {
  const toolboxSystem = source("src/components/ToolboxUISystem.tsx")
  const chartModule = source("src/components/SubToolboxChartModule.tsx")

  expect(toolboxSystem).not.toMatch(/export const CONTROL_SHELL\s*=\s*\{/)
  expect(toolboxSystem).toContain('export { CONTROL_SHELL } from "./subtoolbox/tokens"')
  expect(chartModule).toContain('data-vt-subtoolbox-module="true"')
  expect(chartModule).toContain('borderBottom: `var(--vt-subtoolbox-stroke')
  expect(chartModule).not.toContain('const headerBorderClass = collapsible && !internalOpen')
 })

 it("certifies the video-tool migration wave on canonical interior primitives", () => {
  const manager = source("src/views/VideoManager.tsx")
  const publisher = source("src/views/VideoPublisher.tsx")
  const registry = source("src/components/subtoolbox/registry.ts")

  for (const contents of [manager, publisher]) {
   expect(contents).not.toContain("StandardInput")
   expect(contents).not.toContain("StandardTextArea")
   expect(contents).not.toContain("SubToolboxInnerActionButton")
   expect(contents).toContain("SubToolboxStack")
  }

  expect(manager).toContain("SubToolboxVideoSelector")
  expect(manager).toContain("StudioLabeledInput")
  expect(manager).toContain("StudioLabeledTextArea")
  expect(manager).toContain("MiniSubToolbox")
  expect(manager).toContain("SubToolboxTagEditor")
  expect(manager).not.toContain("SubToolboxMetric")
  expect(manager).not.toContain('title="Choose Video"')
  expect(manager).not.toContain('title="Save Video Changes"')
  expect(manager).toContain('label={!connected ? connectionLabel')
  expect(manager).not.toContain("chooseVideoPalette")
  expect(manager).not.toContain("accentColor={card.accentColor}")
  expect(publisher).toContain("SubToolboxOutputCard")
  expect(publisher).toContain("SubToolboxFileTarget")
  expect(registry).toContain('{ id: 2, status: "complete", surfaces: ["VideoManager", "VideoPublisher"] }')
 })

 it("locks Video Manager spacing and level hierarchy to the new mobile authority", () => {
  const manager = source("src/views/VideoManager.tsx")
  const systemCss = studioControlStyles()
  const toolbox = source("src/components/Toolbox.tsx")
  const toolboxCss = source("src/styles/toolbox-system.css")
  const primitiveCss = source("src/styles/subtoolbox-system.css")
  const service = source("src/services/simpleYouTubeApi.ts")

  expect(toolboxCss).toContain("--vt-toolbox-shell-gutter:6px")
  expect(toolboxCss).toContain("--vt-toolbox-shell-gutter:5px")
  expect(toolboxCss).toContain('[data-vt-toolbox-level="sub"] .vt-subtoolbox-inset')
  expect(toolboxCss).toContain("padding:0!important")
  expect(toolbox).toContain("export const MiniSubToolbox")
  expect(toolbox).toContain('data-vt-toolbox-level="mini"')
  expect(systemCss).toContain(".vt-studio-floating-field")
  expect(primitiveCss).toContain(".vt-subtoolbox-video-selector")
  expect(primitiveCss).toContain("text-overflow:clip")
  expect(primitiveCss).toContain(".vm-thumbnail-canvas")
  expect(manager).toContain('level="l0"')
  expect(manager).toContain('overlayLabel="TITLE"')
  expect(manager).toContain('overlayLabel="DESCRIPTION"')
  expect(manager).toContain('navigate("/thumbnail-studio"')
  expect(service).toContain("duration?: string")
 })

 it("keeps mobile fields browser-safe without forced focus/blur scrolling", () => {
  const toolboxCss = source("src/styles/toolbox-system.css")
  const systemCss = source("src/styles/subtoolbox-system.css")
  const appShell = source("src/app/AppShell.tsx")
  const preferences = source("src/services/workspaceUxPreferences.ts")

  expect(toolboxCss).toContain("--vt-toolbox-header-edge-clearance:8px")
  expect(toolboxCss).toContain("--vt-toolbox-header-edge-clearance:7px")
  expect(toolboxCss).toContain("padding:var(--vt-toolbox-header-edge-clearance) var(--vt-toolbox-shell-gutter) var(--vt-toolbox-shell-gutter)!important")
  expect(systemCss).toContain("Mobile editable-control contract — 2026-09-25")
  expect(systemCss).toContain("font-size:16px!important")
  expect(systemCss).toContain(':not([data-vt-studio-control="true"]):not([data-studioinput="true"]):not(.vt-studio-text-input):not(.vt-studio-input)')
  expect(systemCss).toContain('.vt-subtoolbox-labeled-control:not([data-vt-studio-control="true"])')
  expect(systemCss).not.toContain("scroll-margin-block:12px calc(var(--vt-keyboard-occlusion,0px) + 20px)")
  expect(toolboxCss).not.toContain("--vt-keyboard-occlusion:0px")
  expect(appShell).not.toContain("useRestoreKeyboardPosition")
  expect(preferences).not.toContain("keyboardPositionRestore")
 })

 it("keeps Toolbox header controls isolated, square, and mobile-safe", () => {
  const toolbox = source("src/components/Toolbox.tsx")
  const toolboxCss = source("src/styles/toolbox-system.css")
  const systemCss = source("src/styles/subtoolbox-system.css")
  const library = source("src/components/ToolboxUIReferenceLibrary.tsx")
  const manager = source("src/views/VideoManager.tsx")

  expect(toolbox).toContain("vt-toolbox-header-actions")
  expect(toolbox).toContain("vt-toolbox-header-extras")
  expect(toolbox).toContain("<ChevronDown")
  expect(toolbox).not.toContain("AnimatedToggleIcon open={open}")

  expect(toolboxCss).not.toContain('> header > div:last-child > *')
  expect(toolboxCss).not.toContain('> header > div:last-child span')
  expect(toolboxCss).not.toContain('> header > div:last-child svg')

  expect(toolboxCss).toContain("CANONICAL HEADER ALLOCATION CONTRACT")
  expect(toolboxCss).toContain(".vt-toolbox-header-actions")
  expect(toolboxCss).toContain(".vt-toolbox-header-extras")
  expect(toolboxCss).toContain(".vt-toolbox-header-secondary-actions")
  expect(systemCss).toContain("CANONICAL HEADER CONTROL PRIMITIVES — 2026-09-26")
  expect(systemCss).not.toContain(".vt-toolbox-header-actions{")
  expect(systemCss).not.toContain(".vt-toolbox-header-icon-rail.is-toolbox { width:56px; }")
  expect(systemCss).toContain(".vt-toolbox-header-collapse.is-toolbox")
  expect(systemCss).toContain(".vt-toolbox-header-palette-button")
  expect(systemCss).toContain(".vt-toolbox-header-collapse svg.is-open")

  expect(library).toContain("SubToolboxIconButton")
  expect(library).toContain("vt-toolbox-header-palette-button")
  expect(library).not.toContain("Studio Hub Component Library — Hardcoded")
  expect(manager).toContain("RefreshCw")
 })

 it("keeps production fields and the imported component library on one styling authority", () => {
  const toolboxSource = source("src/components/Toolbox.tsx")
  const systemCss = source("src/styles/subtoolbox-system.css")
  const migrationCatalog = source("src/components/studio-hub/StudioHubPrimitiveMigrationCatalog.tsx")
  const migrationCss = source("src/components/studio-hub/studio-hub-primitive-migration-catalog.css")

  expect(toolboxSource).toContain('["--pair-a" as any]: headerHex')
  expect(toolboxSource).toContain('["--pair-b" as any]: iconBg')

  expect(systemCss).toContain("CANONICAL TEXT FIELD STATE CONTRACT")
  expect(systemCss).toContain("color-mix(in srgb,var(--field-accent) 50%,white)")
  expect(systemCss).toContain("caret-color:var(--field-accent)!important")
  expect(systemCss).toContain("inset 0 0 0 var(--field-stroke) var(--field-accent)")
  expect(systemCss).toContain("color-mix(in srgb,var(--field-glow) 78%,transparent)")

  expect(migrationCatalog).toContain('from "../subtoolbox/SubToolboxPrimitives"')
  expect(migrationCatalog).toContain('from "../subtoolbox/SubToolboxSplitPrimitives"')
  expect(migrationCatalog).toContain('import "./studio-hub-primitive-migration-catalog.css"')
  expect(migrationCatalog).not.toContain('import "./studio-hub-complete-primitive-catalog.css"')
  expect(migrationCatalog).toContain('className="vt-primitive-migration-catalog"')
  expect(migrationCatalog).toContain('import { MiniSubToolbox, SubToolbox } from "../Toolbox"')
  expect(migrationCatalog).toContain('import type { ToolboxControlLevel } from "../subtoolbox/tokens"')
  expect(migrationCatalog).not.toContain('from "./StudioHubCompletePrimitiveCatalog"')
  expect(migrationCatalog).toContain('paletteIndex={paletteIndex + index}')
  expect(migrationCatalog).not.toContain("VT_SPECTRUM_PALETTE_06")
  expect(migrationCatalog).not.toContain("const pair =")
  expect(migrationCatalog).not.toContain('"--pair-a"')
  expect(migrationCatalog).not.toContain('"--pair-b"')
  expect(migrationCss).not.toContain(".vt-subtoolbox-input")
  expect(migrationCss).not.toContain(".vt-subtoolbox-textarea")
  expect(migrationCss).not.toContain("[data-vt-studio-control]")
 })

 it("keeps component colors owned by the nearest SubToolbox pair", () => {
  const split = source("src/components/subtoolbox/SubToolboxSplitPrimitives.tsx")
  const primitives = source("src/components/subtoolbox/SubToolboxPrimitives.tsx")
  const studioControls = source("src/studio-ui/primitives/StudioControls.tsx")
  const toolbox = source("src/components/Toolbox.tsx")
  const manager = source("src/views/VideoManager.tsx")
  const publisher = source("src/views/VideoPublisher.tsx")
  const community = source("src/components/CommunityPostGenerator.tsx")

  for (const forbidden of ["railColor?:", "labelColor?:", "accentColor?:"]) {
   expect(split).not.toContain(forbidden)
  }
  expect(primitives).not.toContain("toneColor?:")
  expect(primitives).not.toContain("accentColor?:")
  expect(studioControls).not.toContain("railColor?:")
  expect(toolbox).not.toContain("surfaceColor?: string;")
  expect(toolbox).not.toContain("controlColor?: string;")
  expect(manager).not.toContain("surfaceColor=")
  expect(manager).not.toContain("controlColor=")
  expect(publisher).not.toContain("accentColor=")
  expect(publisher).not.toContain("surfaceColor=")
  expect(community).not.toContain("railColor=")
  expect(community).not.toContain("--vt-studio-control-accent")
  expect(manager).toContain('className="vm-update-video-action"')
  expect(publisher).toContain('title="Generate Assets"')
  expect(publisher).toContain('title="Generated Assets"')
 })

 it("keeps legacy production dropdowns on pair A / pair B even through portals", () => {
  const toolbox = source("src/components/Toolbox.tsx")
  const css = source("src/styles/subtoolbox-system.css")

  expect(toolbox).toContain("const resolvedSurface = `var(--pair-a")
  expect(toolbox).toContain("const resolvedSecondary = `var(--pair-b")
  expect(toolbox).toContain("const resolvedTitle = `var(--pair-a")
  expect(toolbox).toContain("const resolvedBody = `var(--pair-b")
  expect(toolbox).toContain('data-vt-subtoolbox-dropdown-portal="true"')
  expect(toolbox).toContain('getPropertyValue("--pair-a")')
  expect(toolbox).toContain('getPropertyValue("--pair-b")')
  expect(css).toContain('[data-vt-subtoolbox-dropdown-portal="true"]')
 })

 it("bridges the owning SubToolbox pair into detached dropdown portals", () => {
  const primitives = source("src/components/subtoolbox/SubToolboxPrimitives.tsx")
  const css = source("src/styles/subtoolbox-system.css")

  expect(primitives).toContain('getPropertyValue("--pair-a")')
  expect(primitives).toContain('getPropertyValue("--pair-b")')
  expect(primitives).toContain('["--pair-a" as string]: inheritedPair.pairA')
  expect(primitives).toContain('["--pair-b" as string]: inheritedPair.pairB')
  expect(css).toContain(".vt-subtoolbox-top-title-dropdown-panel{")
  expect(css).toContain("--vt-top-title-title:var(--pair-a")
  expect(css).toContain("--vt-top-title-body:var(--pair-b")
 })

 it("keeps legacy Studio field wrappers on the same inherited pair and field-state contract", () => {
  const studioCss = studioControlStyles()

  expect(studioCss).toContain("--vt-studio-control-accent: var(--pair-a")
  expect(studioCss).toContain("--vt-studio-control-secondary: var(--pair-b")
  expect(studioCss).toContain("--vt-studio-control-default-fill-opacity: 50%")
  expect(studioCss).toContain("caret-color: var(--vt-field-primary)")
  expect(studioCss).toContain("caret-shape: block")
  expect(studioCss.match(/caret-color:/g)).toHaveLength(1)
  expect(studioCss).toContain("inset 0 0 0 var(--vt-field-stroke) var(--vt-field-primary)")
  expect(studioCss).toContain("outline-offset: var(--vt-studio-control-focus-outline-offset, 0px)")
  expect(studioCss).not.toContain("caret-color:var(--field-accent)!important")
 })

 it("derives every SubToolbox component pair from the canonical 12-color title/icon pattern", () => {
  const palette = source("src/styles/toolboxPalette.ts")
  const toolboxSource = source("src/components/Toolbox.tsx")
  const splitCss = source("src/styles/subtoolbox-system.css")
  const videoDirector = source("src/views/VideoDirector.tsx")
  const certification = source("src/studio-ui/StudioHubCertification.tsx")

  expect(palette).toContain("export const VT_SPECTRUM_PALETTE_06 = [")
  expect(palette).toContain("header: getPaletteColor(index)")
  expect(palette).toContain("icon: getPaletteColor(index + 4)")
  expect(toolboxSource).toContain('["--pair-a" as any]: headerHex')
  expect(toolboxSource).toContain('["--pair-b" as any]: iconBg')
  expect(splitCss).toContain("--vt-split-rail: var(--pair-b")
  expect(splitCss).toContain("--vt-split-label: var(--pair-a")
  expect(splitCss).toContain("--vt-kpi-accent: var(--pair-a")
  expect(splitCss).toContain("--vt-kpi-rail: var(--pair-b")
 })

 it("protects mobile toolbox titles and keeps stacked publisher modules intrinsic", () => {
  const toolbox = source("src/components/Toolbox.tsx")
  const toolboxCss = source("src/styles/toolbox-system.css")
  const systemCss = source("src/styles/subtoolbox-system.css")
  const publisher = source("src/views/VideoPublisher.tsx")
  const perfCss = source("src/styles/perf.css")

  expect(toolbox).toContain("vt-toolbox-header-title-slot")
  expect(toolboxCss).toContain("--vt-toolbox-title-protected-width")
  expect(toolboxCss).toContain("clamp(148px, 42vw, 168px)")
  expect(toolboxCss).toContain(".vt-toolbox-header-title-slot")
  expect(toolboxCss).toContain("CANONICAL HEADER ALLOCATION CONTRACT")
  expect(toolboxCss).toContain("overflow-wrap: normal")
  expect(toolboxCss).toContain("word-break: normal")
  expect(toolboxCss).not.toContain("overflow-wrap: anywhere")
  expect(systemCss).toContain("overflow-wrap:normal")
  expect(systemCss).toContain("word-break:normal")
  expect(systemCss).not.toContain("overflow-wrap:anywhere")
  expect(toolboxCss).toContain(".vt-toolbox-header-secondary-actions")
  expect(systemCss).toContain("min-width:44px!important")
  expect(perfCss).not.toContain('[data-vt-toolbox-level="main"] > header')

  expect(publisher).toContain("ToolboxHeaderToggle")
  expect(publisher).not.toContain('w-[210px]')
  expect(publisher).not.toContain('shellClassName="h-full"')
  expect(publisher).not.toContain('contentClassName="h-full"')
  expect(publisher).not.toContain("minHeight={220}")
  expect(publisher).not.toContain('headerColor="bg-[#CCFF00]"')
  expect(publisher).not.toContain('iconBoxColor="bg-[#00FF99]"')
  expect(toolboxCss).toContain("min-height: 0 !important")
  expect(systemCss).toContain("--vt-upload-target-min-height")
 })


 it("prevents page-local header width locks and mobile subtoolbox stretching", () => {
  const headerActionConsumers = [
    "src/components/ToolHeader.tsx",
    "src/components/ToolboxUIReferenceLibrary.tsx",
    "src/components/ProjectStudio.tsx",
    "src/components/projects/ProjectBuilderModule.tsx",
    "src/components/projects/ProjectsToolboxModule.tsx",
    "src/views/BrainCommandCenter.tsx",
    "src/views/PerformanceHub.tsx",
    "src/views/SeoGenerator.tsx",
    "src/views/ThumbnailStudio.tsx",
    "src/views/VideoManager.tsx",
    "src/views/VideoPublisher.tsx",
    "src/views/supertools/SuperToolPrototypeWorkspace.tsx",
    "src/views/supertools/SuperToolShell.tsx",
  ]

  for (const path of headerActionConsumers) {
    const contents = source(path)
    const headerActionRegion = contents.match(/headerActions=\{[\s\S]{0,1600}?\n\s*\}/g)?.join("\n") || ""
    expect(headerActionRegion).not.toMatch(/\bw-\[\d+px\]/)
    expect(headerActionRegion).not.toMatch(/\bmin-w-\[\d+px\]/)
  }

  const mediaAnalyzer = source("src/views/MediaAnalyzer.tsx")
  const storyboard = source("src/views/StoryboardStudio.tsx")

  expect(mediaAnalyzer).not.toContain('shellClassName="h-full"')
  expect(mediaAnalyzer).toContain('shellClassName="md:h-full"')
  expect(mediaAnalyzer).not.toMatch(/contentClassName="[^"]*(?:^|\s)h-full(?:\s|")/)
  expect(mediaAnalyzer).toContain('contentClassName="p-5 md:h-full flex flex-col"')

  expect(storyboard).not.toContain('shellClassName="h-full"')
  expect(storyboard).toContain('shellClassName="xl:h-full"')
 })


 it("keeps one canonical mobile shell geometry and gutter authority", () => {
  const toolboxCss = source("src/styles/toolbox-system.css")
  const systemCss = source("src/styles/subtoolbox-system.css")
  const navigationCss = source("src/components/navigation/adaptive-navigation.css")

  expect(toolboxCss).toContain("Mobile density authority — 2026-09-22")
  expect(toolboxCss).toContain("Canonical shell gutter authority — 2026-09-25")
  expect(toolboxCss).not.toContain("Phone geometry. Titles retain their established size.")
  expect(toolboxCss).not.toContain("Interior safety inset: all Toolbox and SubToolbox bodies")
  expect(toolboxCss).not.toContain("Second mobile-density pass:")
  expect(toolboxCss).not.toContain('data-vt-toolbox-help="true"')
  expect(toolboxCss).not.toContain('data-vt-toolbox-toggle="true"')
  expect(toolboxCss).not.toContain('data-vt-subtoolbox-help="true"')
  expect(toolboxCss).not.toContain('data-vt-subtoolbox-toggle="true"')
  expect(navigationCss).not.toContain("top: 64px;")
  expect(navigationCss).toContain("var(--vt-toolbox-header-height, 80px)")
  expect(navigationCss).toContain("var(--vt-toolbox-stroke, 5px)")
  expect(systemCss).toContain(".vt-toolbox-header-collapse:focus-visible")
  expect(systemCss).toContain(".vt-toolbox-header-help:focus-visible")
 })


 it("exposes canonical PrimaryButton and SplitLeftButton and floating-label field styling", () => {
  const primitives = source("src/components/subtoolbox/SubToolboxPrimitives.tsx")
  const splitPrimitives = source("src/components/subtoolbox/SubToolboxSplitPrimitives.tsx")
  const systemCss = source("src/styles/subtoolbox-system.css")
  const catalog = source("src/components/studio-hub/StudioHubPrimitiveMigrationCatalog.tsx")

  expect(primitives).toContain("export const PrimaryButton")
  expect(primitives).toContain("export const SubToolboxButton")
  expect(splitPrimitives).toContain("export const SplitLeftButton")
  expect(splitPrimitives).toContain("export const SubToolboxSplitButton")
  expect(primitives).toContain("floating-label")
  expect(systemCss).toContain(".vt-studio-floating-field > :is(input, textarea):not(:placeholder-shown) + .vt-studio-floating-field-label")
  expect(systemCss).toContain("left:14px")
  expect(systemCss).not.toContain("padding-right:52%!important")
  expect(catalog).toContain("PrimaryButton")
  expect(catalog).toContain("SplitLeftButton")
 })


 it("uses ViewTube Minimal as the canonical default control contract", () => {
  const tokenSource = source("src/components/subtoolbox/tokens.ts")
  const subtoolboxCss = source("src/styles/subtoolbox-system.css")
  const studioCss = studioControlStyles()

  expect(tokenSource).toContain("controlLetterSpacingEm: -0.035")
  expect(tokenSource).toContain("controlLineHeight: 0.86")
  expect(tokenSource).toContain("m: { height: 44, stroke: 3, radius: 8, shadowOffset: 4, fontSize: 32 }")
  expect(tokenSource).toContain("l1: { height: 44, stroke: 3, radius: 8, shadowOffset: 4, fontSize: 32 }")
  expect(subtoolboxCss).toContain("--vt-subtoolbox-control-standard:44px")
  expect(subtoolboxCss).toContain("font-size:32px")
  expect(subtoolboxCss).toContain("letter-spacing:-.035em")
  expect(studioCss).toContain("--vt-studio-control-height: 44px")
  expect(studioCss).toContain("font-size: var(--vt-studio-control-font-size, 38px)")
  expect(studioCss).toContain("letter-spacing: -.035em")
 })


 it("uses the canonical inverse-color split-left toggle for community post types", () => {
  const community = source("src/components/CommunityPostGenerator.tsx")
  const splitCss = source("src/styles/subtoolbox-system.css")
  const videoDirector = source("src/views/VideoDirector.tsx")
  const certification = source("src/studio-ui/StudioHubCertification.tsx")

  expect(community).toContain("SplitLeftButton")
  expect(community).not.toContain("StudioSplitLeftButton")
  expect(videoDirector).not.toContain("StudioSplitLeftButton")
  expect(certification).not.toContain("StudioSplitLeftButton")
  expect(splitCss).toContain('.vt-subtoolbox-split-button[aria-pressed="true"] .vt-subtoolbox-split-button-rail')
  expect(splitCss).toContain("background: var(--vt-split-label)")
  expect(splitCss).toContain("height: var(--vt-subtoolbox-control-standard, 44px)")
  expect(splitCss).toContain("font-size: 32px")
 })


 it("renders the canonical production primitives in the migration library", () => {
  const catalog = source("src/components/studio-hub/StudioHubPrimitiveMigrationCatalog.tsx")
  expect(catalog).toContain('tone={name === "Destructive Button" ? "danger"')
  expect(catalog).toContain('tone={name === "Head Tail Action" ? "neutral" : "accent"}')
  expect(catalog).toContain('spectrum tagLevel={level}')
  expect(catalog).toContain('variant="floating-label"')
  expect(catalog).toContain('<PrimaryButton level={level} disabled>')
  expect(catalog).toContain('<SplitLeftButton level={level} icon={<Settings2 />} disabled>')
 })

 it("keeps the definitive component library to one standard size and confirmed tokens", () => {
  const catalog = source("src/components/studio-hub/StudioHubPrimitiveMigrationCatalog.tsx")
  const catalogCss = source("src/components/studio-hub/studio-hub-primitive-migration-catalog.css")
  const tokens = source("src/components/subtoolbox/tokens.ts")

  expect(catalog).toContain('data-vt-catalog-track="definitive-component-library"')
  expect(catalog).toContain('const STANDARD_LEVEL: StudioHubComponentLevel = "l1"')
  expect(catalog).toContain('{[STANDARD_LEVEL].map((level) => (')
  expect(catalog).toContain('aria-label="Confirmed default component tokens"')
  expect(catalog).not.toContain(' : LEVELS')
  expect(catalogCss).toContain('grid-template-columns:minmax(0,1fr)')
  expect(catalogCss).toContain('content:"STANDARD · 44PX"')
  expect(catalogCss).toContain('--h:44px;--stroke:3px;--radius:8px;--fs:32px')
  expect(tokens).toContain('l1: { height: 44, stroke: 3, radius: 8, shadowOffset: 4, fontSize: 32 }')
  expect(tokens).toContain('controlWeight: 1000')
  expect(tokens).toContain('controlLetterSpacingEm: -0.035')
  expect(tokens).toContain('controlLineHeight: 0.86')
 })


 it("uses canonical PrimaryButton, SplitLeftButton, and LegendMultiDropdown in the requested workflows", () => {
  const primitives = source("src/components/subtoolbox/SubToolboxPrimitives.tsx")
  const splitPrimitives = source("src/components/subtoolbox/SubToolboxSplitPrimitives.tsx")
  const project = source("src/components/projects/ProjectManifestation.tsx")
  const metadata = source("src/views/MetadataMaster.tsx")
  const canonicalMetadata = source("src/components/metadata/CanonicalMetadataSections.tsx")
  const publishing = source("src/components/metadata/PublishingControls.tsx")
  const systemCss = source("src/styles/subtoolbox-system.css")
  const catalog = source("src/components/studio-hub/StudioHubPrimitiveMigrationCatalog.tsx")

  expect(primitives).toContain("export const LegendMultiDropdown")
  expect(primitives).toContain("onClear?: () => void")
  expect(primitives).toContain("vt-legend-multi-dropdown-clear")
  expect(primitives).toContain("vt-legend-multi-dropdown")
  expect(catalog).toContain('"Legend Multi Dropdown"')
  expect(catalog).toContain("<StudioLegendMultiDropdown")
  expect(splitPrimitives).toContain("export const SplitLeftButton")
  expect(project).toContain("SplitLeftButton")
  expect(project).toContain("LegendMultiDropdown")
  expect(project).not.toContain("<SubToolboxSplitDropdown")
  expect(metadata).toContain("PrimaryButton")
  expect(metadata).not.toContain('<SubToolboxButton size="compact" selected={setCount')
  expect(metadata).not.toContain('<SubToolboxButton key={value} size="compact" selected={intensity')
  expect(metadata).not.toContain('<SubToolboxButton\n                    key={slot.id}')
  expect(canonicalMetadata).toContain("SplitLeftButton")
  expect(canonicalMetadata).not.toContain("<SubToolboxSplitButton")
  expect(canonicalMetadata).toContain("LegendMultiDropdown")
  expect(publishing).toContain("<LegendMultiDropdown")
  expect(systemCss).toContain(".vt-legend-multi-dropdown")
  expect(systemCss).toContain(".vt-legend-multi-dropdown .vt-subtoolbox-top-title-dropdown-title")
  const studioCatalog = source("src/components/studio-hub/StudioHubPrimitiveMigrationCatalog.tsx")
  const studioCatalogCss = source("src/components/studio-hub/studio-hub-primitive-migration-catalog.css")
  expect(studioCatalog).toContain("<StudioLegendMultiDropdown")
  expect(studioCatalog).toContain('sizeVariant={level === "l0" ? "standard" : "compact"}')
  expect(studioCatalogCss).toContain('data-vt-family="Legend Multi Dropdown"')
  expect(studioCatalogCss).toContain("grid-column: 1 / -1")
  expect(studioCatalogCss).toContain("grid-template-columns: repeat(2, minmax(0, 1fr))")
 })

  it("keeps confirmed Studio controls authored and styled in the canonical system", () => {
    const studioControls = source("src/studio-ui/primitives/StudioControls.tsx")
    const studioCss = studioControlStyles()
    const publicIndex = source("src/studio-ui/index.ts")
    const subtoolboxPrimitives = source("src/components/subtoolbox/SubToolboxPrimitives.tsx")
    const subtoolboxCss = source("src/styles/subtoolbox-system.css")

    for (const primitive of ["Studioinput", "Studioarea", "Studiotoggle", "Studioswitch", "Studioradio", "Studiocheck", "Studioxbox"]) {
      expect(studioControls).toContain(primitive)
      expect(publicIndex).toContain(primitive)
    }
    expect(studioControls).not.toContain("SubToolboxInput20")
    expect(studioControls).not.toContain("SubToolboxTextArea21")
    expect(subtoolboxPrimitives).not.toContain("export const SubToolbox44WordToggle:")
    expect(subtoolboxCss).not.toContain(".vt-subtoolbox-44-word-toggle{")
    expect(studioCss).toContain(".vt-studio-44-word-toggle{")
    expect(studioCss).toContain("--vt-word-font-size:38px")
    expect(studioCss).toContain("--vt-word-font-size:24px")
    expect(studioCss).toContain("letter-spacing:-.035em")
    expect(studioCss).toContain("font:1000 var(--vt-word-font-size)/.86")
  })

 
 it("keeps Studio phases 3–5 aligned across controls, dropdowns, and the Confirmed Library", () => {
   const studioCss = studioControlStyles()
   const studioControls = source("src/studio-ui/primitives/StudioControls.tsx")
   const catalog = source("src/components/studio-hub/StudioHubConfirmedPrimitiveCatalog.tsx")
   const catalogCss = source("src/components/studio-hub/studio-hub-primitive-catalogs.css")

   expect(studioCss).toContain('--vt-legend-height: 28px;')
   expect(studioCss).toContain('--vt-legend-stroke: 2px;')
   expect(studioCss).toContain('--vt-legend-radius: 4px;')
   expect(studioCss).toContain('--vt-legend-shadow-offset: 1.5px')
   expect(studioCss).toContain('button[data-vt-studio-control]:not(.vt-studio-legend-trigger)')
   expect(studioCss).toContain('box-shadow: none;')
   expect(studioCss).toContain('box-shadow: var(--vt-legend-shadow-offset) var(--vt-legend-shadow-offset) 0 0 var(--vt-legend-shadow-color)')
   expect(studioCss).toContain('flex: 1 1 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;')
   expect(studioControls).toContain('const menuAccessibleLabel = accessibleLabel ??')
   expect(studioControls).toContain('aria-label={menuAccessibleLabel}')
   expect(catalog).toContain('formatDefaultValue')
   expect(catalog).not.toContain('<span>{String(value)}</span>')
   expect(catalog).toContain('primitive="StudioSwitch"')
   expect(catalog).toContain('primitive="StudioWordToggle"')
   expect(catalog).toContain('data-control-size={item.size}')
   expect(catalog).not.toContain('is-word-toggle-44')
   expect(catalogCss).toContain('.vt-confirmed-control-variants[data-control-size]')
   expect(catalogCss).not.toContain('.vt-confirmed-control-variants:is(.is-word-toggle-44, .is-word-toggle-28)')
 })


 it("keeps Confirmed Library phase 6–8 provenance, layout, and governance canonical", () => {
   const catalog = source("src/components/studio-hub/StudioHubConfirmedPrimitiveCatalog.tsx")
   const catalogCss = source("src/components/studio-hub/studio-hub-primitive-catalogs.css")
   const studioControls = source("src/studio-ui/primitives/StudioControls.tsx")
   const studioCss = studioControlStyles()

   for (const component of ["StudioSwitch", "StudioRadio", "StudioCheckbox", "StudioXCheckbox", "StudioWordToggle", "StudioTextInput", "StudioTextArea", "StudioButton", "StudioActionButton", "StudioSplitLeftButton", "StudioLegendMultiDropdown"]) {
     expect(catalog).toContain(component)
   }
   expect(catalog).toContain('from "../../studio-ui/primitives/StudioControls"')
   expect(catalog).toContain('tsx="src/studio-ui/primitives/StudioControls.tsx"')
   expect(catalog).toContain('css="src/styles/studio-control-system.css"')
   expect(catalog).not.toContain('src/components/subtoolbox/SubToolboxPrimitives.tsx')
   expect(catalog).not.toContain('src/styles/subtoolbox-system.css')
   expect(catalog).toContain('Object.entries(STUDIO_COMPONENT_GLOBAL_DEFAULTS).map')
   expect(catalog).toContain('formatDefaultValue(value)')
   expect(catalog).toContain('PROMINENT ACTION EXCEPTION · SEPARATE FAMILY')
   expect(catalog).not.toContain('FIX REQUIRED · Field radius')
   expect(catalog).not.toContain('FIX REQUIRED · Compact split-left divider')

   expect(catalog).toContain('const CANONICAL_SKINS =')
   expect(catalog).toContain('const WORD_TOGGLE_SKINS = CANONICAL_SKINS')
   expect(catalog).toContain('WORD_TOGGLE_SKINS.map')
   expect(catalog).toContain('className="vt-confirmed-control-variants" data-control-size={item.size}')
   expect(catalogCss).toContain('.vt-confirmed-control-variants {')
   expect(catalogCss).toContain('grid-template-columns: repeat(4, minmax(0, 1fr))')
   expect(catalogCss).toContain('.vt-confirmed-control-variants[data-control-size="28"]')
   expect(catalogCss).not.toContain('.vt-confirmed-control-variants:is(.is-word-toggle-44, .is-word-toggle-28)')
   expect(catalogCss).not.toContain('.vt-confirmed-catalog .vt-studio-legend-multi[data-size="compact"] .vt-studio-legend-option')
   expect(catalogCss).not.toContain('.vt-confirmed-catalog .vt-studio-legend-multi:not([data-size="compact"]) .vt-studio-legend-option')
   expect(catalogCss).toContain('.vt-confirmed-size-grid {')
   expect(catalogCss).toContain('.vt-confirmed-size-card {')
   expect(catalogCss).toContain('.vt-confirmed-variant.is-full-row {')
   expect(studioControls).toContain('export const STUDIO_COMPONENT_SIZE_DEFAULTS = STUDIO_CONTROL_SIZE_CONTRACT')
   expect(studioCss).toContain('caret-shape: block;')
 })
})


describe("compact Studio button shell and face width regression", () => {
 it("excludes modern StudioButton shells from the legacy compact-control padding rule", () => {
  const studioCss = studioControlStyles()
  const legacyCompactRule = studioCss.match(/button\[data-vt-studio-control\]\[data-size="compact"\][^{]*\{[^}]*\}/s)?.[0] ?? ""

  expect(legacyCompactRule).toContain(':not([data-vt-studio-button="true"])')
 })

 it("keeps compact shell padding at zero and the face/shadow anchored to the same shell width", () => {
  const studioCss = studioControlStyles()
  const compactShellRule = studioCss.match(/button\[data-vt-studio-button="true"\]\[data-size="compact"\]:not\(\[data-split-left="true"\]\):not\(\[data-icon-only="true"\]\) \{[^}]*\}/s)?.[0] ?? ""

  expect(compactShellRule).toMatch(/padding:\s*0(?:;| !important;)/)
  expect(compactShellRule).toContain("width: max-content;")
  expect(studioCss).toContain('button[data-vt-studio-button="true"]::before { content:""; position:absolute; z-index:0; inset:0;')
  expect(studioCss).toContain('button[data-vt-studio-button="true"][data-size="compact"]:not([data-split-left="true"]):not([data-icon-only="true"]) > [data-vt-studio-button-face] {')
  expect(studioCss).toContain("width: auto;")
 })

 it("protects compact StudioButtons from the legacy mini-action shell padding and border", () => {
  const toolboxCss = source("src/styles/toolbox-system.css")
  const miniOverride = toolboxCss.match(/\.vt-mini-subtoolbox-actions>button\[data-vt-studio-button="true"\]\[data-size="compact"\]\{[^}]*\}/s)?.[0] ?? ""

  expect(miniOverride).toContain("width:max-content!important;")
  expect(miniOverride).toContain("padding:0!important;")
  expect(miniOverride).toContain("border:0!important;")
  expect(miniOverride).toContain("box-shadow:none!important;")
 })
})


describe("Studio control defaults stay canonical with stationary shells", () => {
 it("does not retain legacy hover-offset tokens or action-button movement", () => {
  const studioCss = studioControlStyles()
  const studioTokens = source("src/studio-ui/tokens.ts")

  expect(studioCss).not.toContain("--vt-studio-control-hover-offset")
  expect(studioCss).not.toContain("transform: translate(1.5px, 1.5px)")
  expect(studioCss).not.toContain("filter: brightness(.98)")
  expect(studioTokens).toContain("const STUDIO_CONTROL_FLAT_INTERACTION_DEFAULTS")
  expect(studioTokens.match(/buttonShadowX:\s*0/g) || []).toHaveLength(1)
 })

 it("keeps the canonical Studio size lattice distinct from toolbox structural levels", () => {
  const studioTokens = source("src/studio-ui/tokens.ts")
  const toolboxTokens = source("src/components/subtoolbox/tokens.ts")
  const catalog = source("src/components/studio-hub/StudioHubConfirmedPrimitiveCatalog.tsx")

  expect(studioTokens).toContain("standard: { height: 44, stroke: 3, radius: 6")
  expect(studioTokens).toContain("compact: { height: 28, stroke: 2, radius: 4")
  expect(studioTokens).toContain("micro: { height: 14, stroke: 1, radius: 2")
  expect(toolboxTokens).toContain("l1: {\n    height: 48,")
  expect(catalog).not.toContain("44px pill radius")
  expect(catalog).toContain("6px standard, 4px compact, and 2px micro")
 })
})


describe("Studio split badges, textarea strokes, and size tokens", () => {
 it("uses size-family radii in the final shared split-badge cascade", () => {
  const studioCss = studioControlStyles()
  const canonical = studioCss.slice(studioCss.lastIndexOf("Canonical split-badge geometry contract."))

  expect(canonical).toContain("border-radius: var(--vt-studio-control-radius, var(--vt-studio-44-radius, 6px))")
  expect(studioCss).toContain('.vt-studio-split-left-badge[data-size="micro"]')
  expect(studioCss).toContain("--vt-studio-badge-radius: var(--vt-studio-14-radius, 2px)")
 })

 it("applies primary inline text strokes to textareas and black strokes on focus", () => {
  const studioCss = studioControlStyles()
  expect(studioCss).toContain('--vt-studio-textarea-text-stroke, .5px) var(--vt-field-primary, var(--pair-a, #36e0f6))')
  expect(studioCss).toContain('--vt-studio-textarea-text-stroke, .5px) #000')
  expect(studioCss).toContain('--vt-studio-textarea-text-stroke: .35px')
 })

 it("does not self-reference the size contract while it is initializing", () => {
  const studioTokens = source("src/studio-ui/tokens.ts")
  expect(studioTokens).toContain("const STUDIO_CONTROL_SIZE_BASE")
  expect(studioTokens).toContain("standardFontSize: STUDIO_CONTROL_SIZE_BASE.standard.fontSize")
  expect(studioTokens).not.toContain("standardFontSize: STUDIO_CONTROL_SIZE_CONTRACT.standard.fontSize")
 })
})


describe("canonical split badge geometry and color ownership", () => {
  it("uses one outer radius and square clipped interior fills for every split badge", () => {
    const studioCss = studioControlStyles()
    const canonical = studioCss.slice(studioCss.lastIndexOf("Canonical split-badge geometry contract."))
    expect(canonical).toContain("width: 100%;")
    expect(canonical).toContain("overflow: hidden;")
    expect(canonical).toContain("border-radius: 0;")
    expect(canonical).toContain("border: 0;")
    expect(canonical).toContain("var(--vt-studio-44-radius, 6px)")
    expect(canonical).toContain("var(--vt-studio-28-radius, 4px)")
    expect(canonical).toContain("var(--vt-studio-14-radius, 2px)")
  })

  it("keeps split-right secondary fill inside a fixed, token-sized rail", () => {
    const studioCss = studioControlStyles()
    const canonical = studioCss.slice(studioCss.lastIndexOf("Canonical split-badge geometry contract."))
    const railRule = canonical.match(/\.vt-studio-split-left-badge__rail,\s*\.vt-studio-split-right-badge__rail,\s*\.vt-studio-double-split-badge__rail\s*\{[^}]*\}/s)?.[0] ?? ""
    expect(railRule).toContain("flex: 0 0 var(--vt-studio-control-height")
    expect(railRule).toContain("overflow: hidden;")
    expect(railRule).toContain("padding: 0;")
    expect(canonical).toContain(".vt-studio-split-right-badge__rail { border-left:")
  })

  it("colors the double-split left rail primary and right rail secondary", () => {
    const studioCss = studioControlStyles()
    const canonical = studioCss.slice(studioCss.lastIndexOf("Canonical split-badge geometry contract."))
    expect(canonical).toContain(".vt-studio-double-split-badge__rail:first-child")
    expect(canonical).toContain("background: var(--vt-studio-control-accent, var(--vt-studio-primary, var(--pair-a, #36e0f6)));")
    expect(canonical).toContain(".vt-studio-double-split-badge__rail:last-child")
    expect(canonical).toContain("background: var(--vt-studio-control-secondary, var(--vt-studio-secondary, var(--pair-b, #ff7f6b)));")
  })
})


describe("Toolbox header word-toggle density, white track, and color fade", () => {
  it("pins only header toggles to white and fades header colors without changing in-content skins", () => {
    const primitives = source("src/components/subtoolbox/SubToolboxPrimitives.tsx")
    const toolboxCss = source("src/styles/toolbox-system.css")

    expect(primitives).toContain('(orientation: portrait) and (max-width: 768px)')
    expect(primitives).toContain('setSize(portraitMobile.matches || cramped ? "28" : "44")')
    expect(primitives).toContain('size={size}')
    expect(primitives).toContain('skin="solid"')
    expect(primitives).toContain('style={{ ...style, background: "#ffffff" }}')
    expect(toolboxCss).toMatch(/\[data-vt-toolbox\] header \.vt-studio-44-word-toggle[^]*?background: #ffffff !important/s)
    expect(toolboxCss).toContain('transition: background-color 180ms ease-out;')
    expect(toolboxCss).toContain('color 180ms ease-out')
    expect(toolboxCss).toContain('-webkit-text-stroke-color 180ms ease-out')
    expect(toolboxCss).toContain('transition: background-color 180ms ease-out;')
    expect(toolboxCss).toContain('@media (prefers-reduced-motion: reduce)')
  })
})


describe("Studio control family grouping and split-slider palette defaults", () => {
  it("groups switch, toggle, radio, and checkbox specimens in one first-layer family", () => {
    const catalog = source("src/components/studio-hub/StudioHubPrimitiveMigrationCatalog.tsx");
    const familyList = catalog.slice(catalog.indexOf("export const STUDIO_HUB_MIGRATED_FAMILIES"), catalog.indexOf("] as const") > -1 ? catalog.indexOf("] as const") : catalog.indexOf("]"));
    expect(familyList.indexOf('"Switches / Toggles / Radio / Checkbox"')).toBeGreaterThanOrEqual(0);
    expect(familyList.indexOf('"Switches / Toggles / Radio / Checkbox"')).toBeLessThan(familyList.indexOf('"Studio Button Family"'));
    for (const duplicate of ['"Toggle"', '"Vertical Word Toggle"', '"Settings Switch"', '"Checkbox"', '"Radio"', '"Segmented Choice"', '"Controller Switch"']) {
      expect(familyList).not.toContain(duplicate);
    }
    expect(catalog).toContain("SubToolboxToggleSwitch");
    expect(catalog).toContain("SubToolboxSettingsSwitch");
    expect(catalog).toContain("SubToolboxCheckControl");
    expect(catalog).toContain("SubToolboxRadioControl");
    expect(catalog).toContain("SubToolboxControllerSwitch");
    expect(catalog).toContain('"Studio Left Word Counter"');
    expect(catalog).toContain("<StudioLeftWordCounter size=\"standard\"");
    expect(catalog).toContain("Secondary value fill: add the");
  });

  it("uses secondary split sections and a solid primary center for the double-split slider", () => {
    const css = source("src/styles/studio-control-system.css");
    const slider = css.slice(css.indexOf("StudioDoubleSplitSlider — double-split rails"), css.indexOf(".vt-studio-double-split-slider input[type=\"range\"]::-webkit-slider-runnable-track"));
    expect(slider).toContain(".vt-studio-double-split-slider .vt-studio-double-split-slider__rail");
    expect(slider).toContain("background: var(--vt-studio-control-secondary, var(--pair-b, #ff7f6b));");
    expect(slider).toContain("background: var(--vt-studio-control-primary, var(--pair-a, #36e0f6));");
    expect(slider).not.toContain("color-mix(in srgb, var(--vt-studio-slider-left-fill) 50%, #fff)");
    const valueRule = slider.match(/\.vt-studio-double-split-slider \.vt-studio-double-split-slider__value \{[^}]*\}/s)?.[0] ?? "";
    expect(valueRule).toContain("color: #000;");
    expect(valueRule).toContain("font-size: var(--vt-studio-control-font-size, 38px);");
  });
});


describe("Studio primary defaults and shared split geometry", () => {
  it("uses the primary token for value-toggle faces and active slider tracks", () => {
    const css = source("src/styles/studio-control-system.css");
    const toggleStart = css.indexOf("/* Studio value-toggle family: canonical primitive styles; no motion or shadow. */");
    const toggleBlock = css.slice(toggleStart, css.indexOf(".vt-studio-value-toggle[data-size=", toggleStart));
    expect(toggleBlock).toContain("--vt-toggle-fill: var(--vt-studio-control-primary, var(--pair-a, #36e0f6));");
    const sharedSlider = css.slice(css.indexOf("/* Shared slider contract: the active track/center stays primary; split rails are secondary. */"), css.indexOf("/* Geometry invariants shared by the counter and split-control families. */"));
    expect(sharedSlider).toContain("[data-vt-studio-slider] input[type=\"range\"]");
    expect(sharedSlider).toContain("accent-color: var(--vt-studio-control-primary, var(--pair-a, #36e0f6));");
    expect(sharedSlider).toContain("background: var(--vt-studio-control-secondary, var(--pair-b, #ff7f6b));");
  });
});

describe("confirmed primitive library family organization", () => {
  it("keeps split button and dropdown variants in family modules, not duplicate representative rows", () => {
    const catalog = source("src/components/studio-hub/StudioHubConfirmedPrimitiveCatalog.tsx");
    const start = catalog.indexOf('<div className="vt-confirmed-direct-primitive-rows"');
    const end = catalog.indexOf("</Family>", start);
    const representatives = catalog.slice(start, end);
    for (const variant of ["StudioSplitLeftButton", "StudioDoubleSplitButton", "StudioTwoLineButton", "StudioSplitTwoLineButton", "StudioSplitRightButton", "StudioSplitLeftDropdown", "StudioLegendMultiDropdown", "StudioSplitRightBadge", "StudioDoubleSplitBadge", "StudioSideCounter", "StudioLeftCounter", "StudioLeftWordSlider", "StudioSideToggle", "StudioDoubleSideToggle", "StudioBarToggle", "StudioWordToggle", "StudioVerticalWordToggle", "StudioRadio", "StudioCheckbox", "StudioXCheckbox"]) {
      expect(representatives).not.toContain('data-vt-library-component="' + variant + '"');
    }
    expect(catalog).toContain("<ConfirmedStudioSplitButtonFamily />");
    expect(catalog).toContain("<ConfirmedStudioDropdownFamily />");
    expect(catalog).toContain('title="Split Button Family · Left / Right / Double / Two-Line"');
    expect(catalog).toContain('title="Dropdown Family · Standard / Split-Left / Multi-Select"');
    const counterFamily = catalog.slice(catalog.indexOf("const ConfirmedStudioCounterFamily"), catalog.indexOf("const ConfirmedStudioDoubleSplitSliderFamily", catalog.indexOf("const ConfirmedStudioCounterFamily")) );
    expect(counterFamily).toContain("<ConfirmedStudioSideCounterFamily />");
    expect(catalog).not.toMatch(/<ConfirmedStudioDoubleSplitSliderFamily \/>\\s*<ConfirmedStudioSideCounterFamily \/>/);

    for (const representative of ["StudioButton", "StudioDropdown", "StudioArrowToggle", "StudioCounter", "StudioLeftWordCounter", "StudioDoubleSplitSlider", "StudioSplitLeftBadge"]) {
      expect(representatives.match(new RegExp('data-vt-library-component="' + representative + '"', "g"))?.length).toBe(1);
    }
  });

  it("keeps the migration catalog's switch, radio, and checkbox specimens together without important overrides", () => {
    const catalog = source("src/components/studio-hub/StudioHubPrimitiveMigrationCatalog.tsx");
    const styles = source("src/components/studio-hub/studio-hub-primitive-migration-catalog.css");
    const families = catalog.slice(catalog.indexOf("export const STUDIO_HUB_MIGRATED_FAMILIES"), catalog.indexOf("] as const"));
    for (const duplicate of ['"Toggle",', '"Vertical Word Toggle",', '"Checkbox",', '"Radio",', '"Segmented Choice",', '"Settings Switch",', '"Controller Switch",', '"Dropdown",', '"Top Title Dropdown",', '"Legend Multi Dropdown",', '"Tone / Tension / Cinematic Dropdown",']) {
      expect(families).not.toContain(duplicate);
    }
    expect(families).toContain('"Switches / Toggles / Radio / Checkbox",');
    expect(families).toContain('"Studio Counter Family",');
    expect(families).toContain('"Studio Slider Family",');
    expect(families).toContain('"Studio Dropdown Family",');
    expect(styles).not.toContain("!important");
    expect(styles).toContain("--vt-subtoolbox-shell-box-shadow: none;");
    expect(styles).toContain("--vt-subtoolbox-content-border: 0;");
    const systemStyles = source("src/styles/studio-control-system.css");
    expect(systemStyles).toContain("--vt-toggle-fill: var(--vt-studio-control-primary, var(--pair-a, #36e0f6));");
    expect(systemStyles).toContain(".vt-studio-double-split-slider .vt-studio-double-split-slider__rail {");
    expect(systemStyles).toContain("background: var(--vt-studio-control-secondary, var(--pair-b, #ff7f6b));");
    expect(systemStyles).toContain(".vt-studio-double-split-slider input[type=\"range\"] {");
    expect(systemStyles).toContain("background: var(--vt-studio-control-primary, var(--pair-a, #36e0f6));");
  });
});


describe("confirmed primitive library organization", () => {
  it("does not duplicate family-module variants as separate individual cards", () => {
    const catalog = source("src/components/studio-hub/StudioHubConfirmedPrimitiveCatalog.tsx");
    const start = catalog.indexOf("const ConfirmedIndividualPrimitiveSections");
    const end = catalog.indexOf("const ConfirmedStudioValueToggleFamily", start);
    const individual = catalog.slice(start, end);
    for (const title of [
      "StudioSwitch · Standard", "StudioRadio · Standard", "StudioCheckbox · Standard",
      "StudioXCheckbox · Standard", "StudioWordToggle · Standard", "StudioVerticalWordToggle · Standard",
      "StudioSplitRightBadge · Standard", "StudioDoubleSplitBadge · Standard",
      "StudioArrowToggle · Standard", "StudioSideToggle · Standard",
      "StudioDoubleSideToggle · Standard", "StudioBarToggle · Standard",
    ]) {
      expect(individual).not.toContain(title);
    }
    expect(catalog).toContain('title="Switches, Radios & Checkboxes"');
    expect(catalog).toContain('title="Word Toggles · Standard + Compact + Vertical"');
    expect(catalog).toContain('title="Split-left Badge · Standard + Compact + Micro"');
    expect(catalog).toContain('title="Arrow / Side / Double Side / Bar Toggles"');
  });

  it("declares deliberate family groups with choice controls first", () => {
    const catalog = source("src/components/studio-hub/StudioHubConfirmedPrimitiveCatalog.tsx");
    const familyList = catalog.slice(catalog.indexOf("const CONFIRMED_CATALOG_FAMILIES"), catalog.indexOf("const classifyConfirmedCatalogItem"));
    expect(familyList.indexOf('"Controls"')).toBeLessThan(familyList.indexOf('"Counters & Sliders"'));
    for (const family of ['"Text Fields"', '"Buttons & Badges"', '"Dropdowns"', '"Controls"', '"Counters & Sliders"', '"Modules & Frames"', '"Compositions"']) {
      expect(familyList).toContain(family);
    }
  });

  it("routes related primitives to their intended family before fallback rules", () => {
    const catalog = source("src/components/studio-hub/StudioHubConfirmedPrimitiveCatalog.tsx");
    const classify = catalog.slice(catalog.indexOf("const classifyConfirmedCatalogItem"), catalog.indexOf("const ConfirmedCatalogFamilyGroups"));
    expect(classify.indexOf('return "Controls"')).toBeLessThan(classify.indexOf("if (/Button ·"));
    expect(classify).toContain('return "Counters & Sliders"');
    expect(classify).toContain('return "Buttons & Badges"');
    expect(classify).toContain('return "Modules & Frames"');
  });

  it("routes text fields and tags into their dedicated groups", () => {
    const catalog = source("src/components/studio-hub/StudioHubConfirmedPrimitiveCatalog.tsx");
    const classify = catalog.slice(catalog.indexOf("const classifyConfirmedCatalogItem"), catalog.indexOf("const ConfirmedCatalogFamilyGroups"));
    expect(classify).toContain("StudioTextInput|StudioTextArea|StudioTextBox");
    expect(classify).toContain("StudioCloseableBadge");
    expect(classify).toContain('return "Compositions"');
  });

  it("keeps direct representatives unique and excludes composite showcase grids", () => {
    const catalog = source("src/components/studio-hub/StudioHubConfirmedPrimitiveCatalog.tsx");
    const start = catalog.indexOf('data-vt-confirmed-representatives="true"');
    const end = catalog.indexOf("</Family>", start);
    const representatives = catalog.slice(start, end);
    const componentIds = [...representatives.matchAll(/data-vt-library-component="([^"]+)"/g)].map(match => match[1]);
    expect(componentIds).not.toContain("StudioComponentGrid:standard");
    expect(new Set(componentIds).size).toBe(componentIds.length);
    expect(representatives).toContain('sizeVariant="standard"');
  });
});

describe("Confirmed primitive library family organization", () => {
  it("groups related button, dropdown, counter, and slider variants in family modules", () => {
    const catalog = source("src/components/studio-hub/StudioHubPrimitiveMigrationCatalog.tsx");
    const start = catalog.indexOf("export const STUDIO_HUB_MIGRATED_FAMILIES");
    const end = catalog.indexOf("] as const", start);
    const families = catalog.slice(start, end);
    for (const family of ['"Studio Button Family"', '"Studio Dropdown Family"', '"Studio Counter Family"', '"Studio Slider Family"', '"Loader Family"', '"Tooltip Family"', '"Skeleton Family"', '"Data Stats Family"', '"Scrollbar Family"', '"LED Family"', '"Toolbox Header Family"']) {
      expect(families).toContain(family);
    }
    for (const duplicate of ['"Primary Button"', '"Secondary Button"', '"Neutral Button"', '"Destructive Button"', '"Studio Left Word Counter"', '"Slider"', '"Range Slider"', '"Stepper"', '"Split Menu"', '"Select Menu"', '"Context Menu"', '"Disabled Button"', '"Disabled Split Button"', '"Loader"', '"Loader Progress"', '"Loader Split"', '"Loader Orbit"', '"Loader Bars"', '"Tooltip Dark"', '"Tooltip Color"', '"Tooltip Visual Key"', '"Skeleton Compact"', '"Skeleton Media"', '"Two Color Data Stats"', '"Monochrome Data Stats"', '"Tiny Data Stats"', '"Horizontal Scrollbar"', '"Vertical Scrollbar"', '"LED Light"', '"LED Dot"', '"Toolbox Header Icon Rail"', '"SubToolbox Header Icon Rail"', '"Toolbox Header Title"', '"SubToolbox Header Title"', '"Toolbox Header Help"', '"SubToolbox Header Help"', '"Toolbox Header Collapse"', '"SubToolbox Header Collapse"', '"Toolbox Header Toggle"', '"SubToolbox Header Toggle"']) {
      expect(families).not.toContain(duplicate);
    }
    expect(catalog).toContain("StudioSplitRightButton");
    expect(catalog).toContain("StudioDoubleSplitButton");
    expect(catalog).toContain("StudioTwoLineButton");
    expect(catalog).toContain("StudioSplitTwoLineButton");
    expect(catalog).toContain("StudioLeftWordCounter");
    expect(catalog).toContain("StudioDoubleSplitSlider");
    expect(catalog).toContain("SubToolboxRangeSlider");
    expect(catalog).toContain("ToolboxHeaderCollapseButton");
    expect(catalog).toContain("SubToolboxLegendTooltip");
  });
});
describe("Confirmed primitive library canonical defaults", () => {
  it("documents the canonical standard size and flat typography tokens", () => {
    const catalog = source("src/components/studio-hub/StudioHubPrimitiveMigrationCatalog.tsx");
    expect(catalog).toContain("<span><b>HEIGHT</b> 44px</span>");
    expect(catalog).toContain("<span><b>STROKE</b> 3px</span>");
    expect(catalog).toContain("<span><b>RADIUS</b> 6px</span>");
    expect(catalog).toContain("<span><b>SHADOW</b> FLAT · 0</span>");
    expect(catalog).toContain("Uppercase · −0.02em · 1 line");
  });
});
