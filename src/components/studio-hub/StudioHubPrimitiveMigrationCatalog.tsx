import React from "react"
import { Captions, Check, ChevronDown, ChevronRight, Expand, FileText, Gauge, Image, Lightbulb, ListVideo, Menu, Minus, MoreHorizontal, Music, Pause, Play, Plus, Search, Settings2, SlidersHorizontal, Upload, Volume2, X } from "lucide-react"
import { MiniSubToolbox, SubToolbox } from "../Toolbox"
import { COMPONENT_SIZE_DNA, getComponentSizeCssVars } from "../subtoolbox/tokens"
import type { ToolboxControlLevel } from "../subtoolbox/tokens"
import {
  SubToolboxAlert,
  SubToolboxAspectRatioFrame,
  SubToolboxAlphabeticalSpectrumTags,
  SubToolboxAvatar,
  SubToolboxBreadcrumb,
  SubToolboxCarousel,
  SubToolboxCommandPalette,
  SubToolboxBadge,
  SubToolboxButton,
  SubToolboxButtonGroup,
  SubToolboxCheckControl,
  SubToolboxColorPicker,
  SubToolboxDataStats,
  SubToolboxDataTable,
  SubToolboxDialog,
  SubToolboxDisclosure,
  SubToolboxDivider,
  SubToolboxDrawer,
  SubToolboxFieldLabel,
  SubToolboxFileTarget,
  SubToolboxIconButton,
  SubToolboxInput,
  SubToolboxLabeledInput,
  SubToolboxLabeledTextArea,
  SubToolboxKnob,
  SubToolboxLinkButton,
  SubToolboxLoader,
  SubToolboxMediaCard,
  SubToolboxMediaCaptionToggle,
  SubToolboxMediaControlButton,
  SubToolboxMediaDurationBadge,
  SubToolboxMediaInspector,
  SubToolboxMediaPlayer,
  SubToolboxMediaPlayToggle,
  SubToolboxMediaPoster,
  SubToolboxMediaQueue,
  SubToolboxMediaReviewPanel,
  SubToolboxMediaSeekBar,
  SubToolboxMediaSpeedControl,
  SubToolboxMediaStatus,
  SubToolboxMediaTimecode,
  SubToolboxMediaTransportBar,
  SubToolboxMediaVolumeControl,
  SubToolboxMenu,
  SubToolboxMeter,
  SubToolboxMetric,
  SubToolboxMetricStrip,
  SubToolboxCalendar,
  SubToolboxSectionBand,
  SubToolboxTextBadgeGrid,
  SubToolboxInteractiveChecklistProgress,
  SubToolboxProductionPlannerGrid,
  SubToolboxHoverCard,
  SubToolboxOutputCard,
  SubToolboxPagination,
  SubToolboxPopover,
  SubToolboxProgressBar,
  SubToolboxProgressValue,
  SubToolboxRadioControl,
  SubToolboxRangeSlider,
  SubToolboxRemovableTag,
  SubToolboxReorderRow,
  SubToolboxSegmentedToggle,
  SubToolboxScrollbar,
  SubToolboxSelectableListRow,
  SubToolboxSelectableTag,
  SubToolboxSkeleton,
  SubToolboxSettingsSwitch,
  SubToolboxSlider,
  SubToolboxControllerSwitch,
  SubToolboxSplitField,
  SubToolboxStatePanel,
  SubToolboxStatCard,
  SubToolboxStatusBadge,
  SubToolboxStepIndicator,
  SubToolboxIconRailControl,
  SubToolboxLed,
  SubToolboxLedDot,
  SubToolboxNameValueList,
  SubToolboxStepper,
  SubToolboxSurface,
  SubToolboxTabs,
  SubToolboxTag,
  SubToolboxToolbar,
  SubToolboxTagEditor,
  SubToolboxTextArea,
  SubToolboxTopTitleDropdown,
  SubToolboxToast,
  SubToolboxToggleSwitch,
  SubToolboxTooltip,
  SubToolboxLegendTooltip,
  SubToolboxTree,
  SubToolboxVideoSelector,
  ToolboxHeaderCollapseButton,
  ToolboxHeaderHelpButton,
  ToolboxHeaderIconRail,
  ToolboxHeaderTitle,
  ToolboxHeaderToggle,
} from "../subtoolbox/SubToolboxPrimitives"
import { SubToolboxKpiCard, SubToolboxSplitButton, SubToolboxSplitDropdown } from "../subtoolbox/SubToolboxSplitPrimitives"
import { VaultAssetModule, type VaultAssetModuleKind, type VaultAssetModuleVariant } from "../subtoolbox/VaultAssetModule"
import "./studio-hub-primitive-migration-catalog.css"
import "../subtoolbox/SubToolboxExtendedPrimitives.css"
import { SubToolboxCmykMixer, SubToolboxXYJoystick, SubToolboxAspectRatioSelector, SubToolboxBeforeAfterCompare, SubToolboxSpringLoadedToggle, SubToolboxAccordion, SubToolboxOutputInput, SubToolboxPasswordInput, SubToolboxRating, SubToolboxProductionChecklist, SubToolboxNavigation, SubToolboxVideoSelector as ExtendedVideoSelector, SubToolboxTimeline, SubToolboxMediaFrame, SubToolboxColorSwitchToggle, SubToolboxToolboxToggle, SubToolboxProgress, SubToolboxDataGrid } from "../subtoolbox/SubToolboxExtendedPrimitives"

type StudioHubComponentLevel = ToolboxControlLevel
type CatalogSize = keyof typeof COMPONENT_SIZE_DNA

export const CATALOG_SIZES: ReadonlyArray<{ size: CatalogSize; level: StudioHubComponentLevel }> = [
  { size: "xs", level: "l2" },
  { size: "s", level: "l2" },
  { size: "m", level: "l1" },
  { size: "l", level: "l0" },
]

export const STUDIO_HUB_MIGRATED_FAMILIES = [
  "Primary Button",
  "Secondary Button",
  "Neutral Button",
  "Destructive Button",
  "Square Icon Button",
  "Split Left Button",
  "Head Tail Action",
  "Split Menu",
  "Dropdown",
  "Top Title Dropdown",
  "Select Menu",
  "Context Menu",
  "Text Input",
  "Textarea",
  "Split Search",
  "Number Field",
  "Input Action",
  "Stepper",
  "Slider",
  "Range Slider",
  "Toggle",
  "Settings Switch",
  "Checkbox",
  "Radio",
  "Segmented Choice",
  "Button Group",
  "Tag",
  "Removable Tag",
  "Selectable Tag",
  "Tag Editor",
  "Badge",
  "Status Badge",
  "Progress Bar",
  "Progress Value",
  "KPI",
  "Stat Card",
  "Tooltip",
  "Knob Dial",
  "Alphabetical Spectrum Tags",
  "Field Label",
  "Surface",
  "State Panel",
  "Output Card",
  "Metric",
  "Link Button",
  "Data Table",
  "Color Picker",
  "Media Card",
  "Selectable List Row",
  "Reorderable Row",
  "Tabs",
  "Alert",
  "Step Indicator",
  "Dialog",
  "Drawer",
  "Calendar",
  "Loader",
  "Skeleton",
  "Toast",
  "Popover",
  "Disclosure",
  "Divider",
  "Pagination",
  "Controller Switch",
  "LED Light",
  "Icon Rail Control",
  "Hover Card",
  "Meter",
  "Avatar",
  "Name Value List",
  "Breadcrumb",
  "Carousel",
  "Command Palette",
  "Metric Strip",
  "Horizontal Scrollbar",
  "Vertical Scrollbar",
  "Data Stats Module",
  "Upload Frame",
  "Vault Landscape Asset",
  "Vault Landscape Swapped Asset",
  "Vault Portrait Asset",
  "Vault Portrait Double Asset",
  "Vault Audio Asset",
  "Vault Document Asset",
  "Tree View",
  "Disabled Button",
  "Disabled Split Button",
  "Two Color Data Stats",
  "Monochrome Data Stats",
  "Tiny Data Stats",
  "Tooltip Dark",
  "Tooltip Color",
  "Dashboard Pill Tags",
  "Aspect Ratio Frame",
  "Toolbar",
  "Toolbox Header Icon Rail",
  "SubToolbox Header Icon Rail",
  "Toolbox Header Title",
  "SubToolbox Header Title",
  "Toolbox Header Help",
  "SubToolbox Header Help",
  "Toolbox Header Collapse",
  "SubToolbox Header Collapse",
  "LED Dot",
  "Loader Progress",
  "Loader Split",
  "Loader Orbit",
  "Loader Bars",
  "Tooltip Visual Key",
  "Skeleton Compact",
  "Skeleton Media",
  "Media Control Button",
  "Media Play Toggle",
  "Media Seek Bar",
  "Media Volume Control",
  "Media Timecode",
  "Media Duration Badge",
  "Media Caption Toggle",
  "Media Speed Control",
  "Media Poster Frame",
  "Media Status",
  "Media Player",
  "Media Transport Bar",
  "Media Queue",
  "Media Inspector",
  "Media Review Panel",
  "Labeled Input",
  "Labeled Textarea",
  "Video Selector",
  "Mini SubToolbox",
  "Full-Width Section Band",
  "Text + Badge Data Grid",
  "Interactive Checklist Progress",
  "Production Planner Grid",
  "CMYK Mixer",
  "XY Joystick",
  "Aspect Ratio Selector",
  "Before / After Compare",
  "Timeline",
  "Navigation",
  "Top Navigation",
  "Spring-Loaded Toggle",
  "Accordion",
  "Output Input",
  "Password Input",
  "Rating",
  "Checklist Progress",
  "Data Grid",
  "Media Frame",
  "Color Switching Toggle",
  "Toolbox Toggle",
  "Toolbox Toggle · Black Handle",
  "Toolbox Toggle · Black Fill",
  "Section Band · Primary",
  "Section Band · Secondary",
  "Checklist Progress · Compact",
  "Production Planner Grid · Compact",
  "Avatar · Creator",
  "Avatar · Compact",
  "Tooltip · Dark",
  "Tooltip · Color",
  "Disabled Button · Colored",
  "Disabled Split Button · Colored",
  "Upload Frame · Variant",
  "Carousel · L2",
  "LED Light · L1",
  "Toast · L1",
  "Calendar · Navigation",
  "Scrollbar · L1",
  "Scrollbar · L2",
  "Range Slider · L2",
  "Button Group · Select All",
  "Toggle · Stroke",
  "Toggle · No Stroke",
  "Settings Switch · Stroke",
  "Checkbox · Stroke",
  "Radio · Stroke",
] as const

type StudioHubMigratedFamily = (typeof STUDIO_HUB_MIGRATED_FAMILIES)[number]

type CatalogPreviewMode = "intrinsic" | "fixed" | "compound" | "field" | "canvas"

type CatalogPreviewGeometry = {
  mode: CatalogPreviewMode
  inlineUnits?: number
  portraitStack?: boolean
}

const CATALOG_PREVIEW_GEOMETRY: Partial<Record<StudioHubMigratedFamily, CatalogPreviewGeometry>> = {
  "Square Icon Button": { mode: "fixed" },
  "Toggle": { mode: "fixed" },
  "Settings Switch": { mode: "fixed" },
  "Checkbox": { mode: "fixed" },
  "Radio": { mode: "fixed" },
  "Controller Switch": { mode: "fixed" },
  "LED Dot": { mode: "fixed" },
  "Knob Dial": { mode: "fixed" },
  "Media Control Button": { mode: "fixed" },
  "Media Play Toggle": { mode: "fixed" },

  "Split Left Button": { mode: "compound", inlineUnits: 4.15, portraitStack: true },
  "Head Tail Action": { mode: "compound", inlineUnits: 4.15, portraitStack: true },
  "Split Menu": { mode: "compound", inlineUnits: 4.8, portraitStack: true },
  "Dropdown": { mode: "compound", inlineUnits: 4.75, portraitStack: true },
  "Select Menu": { mode: "compound", inlineUnits: 4.75, portraitStack: true },
  "Top Title Dropdown": { mode: "compound", inlineUnits: 4.9, portraitStack: true },
  "Split Search": { mode: "compound", inlineUnits: 5.15, portraitStack: true },
  "Input Action": { mode: "compound", inlineUnits: 4.7, portraitStack: true },
  "Stepper": { mode: "compound", inlineUnits: 3.2, portraitStack: true },
  "Segmented Choice": { mode: "compound", inlineUnits: 4.2, portraitStack: true },
  "Button Group": { mode: "compound", inlineUnits: 4.1, portraitStack: true },
  "Progress Value": { mode: "compound", inlineUnits: 4.8, portraitStack: true },
  "Pagination": { mode: "compound", inlineUnits: 4.6, portraitStack: true },
  "Breadcrumb": { mode: "compound", inlineUnits: 5.4, portraitStack: true },
  "Icon Rail Control": { mode: "compound", inlineUnits: 4.4, portraitStack: true },
  "Loader Split": { mode: "compound", inlineUnits: 4.8, portraitStack: true },
  "Media Volume Control": { mode: "compound", inlineUnits: 4.0, portraitStack: true },
  "Media Speed Control": { mode: "compound", inlineUnits: 2.3, portraitStack: true },
  "Media Transport Bar": { mode: "compound", inlineUnits: 8.2, portraitStack: true },

  "Text Input": { mode: "field", inlineUnits: 5.4, portraitStack: true },
  "Textarea": { mode: "field", inlineUnits: 5.6, portraitStack: true },
  "Number Field": { mode: "field", inlineUnits: 4.2, portraitStack: true },
  "Slider": { mode: "field", inlineUnits: 5.4, portraitStack: true },
  "Range Slider": { mode: "field", inlineUnits: 5.7, portraitStack: true },
  "Tag Editor": { mode: "field", inlineUnits: 5.6, portraitStack: true },
  "Progress Bar": { mode: "field", inlineUnits: 5.2, portraitStack: true },
  "Surface": { mode: "field", inlineUnits: 5.4, portraitStack: true },
  "State Panel": { mode: "field", inlineUnits: 5.4, portraitStack: true },
  "Output Card": { mode: "field", inlineUnits: 5.7, portraitStack: true },
  "Selectable List Row": { mode: "field", inlineUnits: 5.8, portraitStack: true },
  "Reorderable Row": { mode: "field", inlineUnits: 6.2, portraitStack: true },
  "Tabs": { mode: "field", inlineUnits: 5.2, portraitStack: true },
  "Alert": { mode: "field", inlineUnits: 5.8, portraitStack: true },
  "Step Indicator": { mode: "field", inlineUnits: 5.8, portraitStack: true },
  "Skeleton": { mode: "field", inlineUnits: 5.4, portraitStack: true },
  "Skeleton Compact": { mode: "field", inlineUnits: 5.4, portraitStack: true },
  "Toast": { mode: "field", inlineUnits: 5.6, portraitStack: true },
  "Disclosure": { mode: "field", inlineUnits: 5.4, portraitStack: true },
  "Meter": { mode: "field", inlineUnits: 5.2, portraitStack: true },
  "Name Value List": { mode: "field", inlineUnits: 5.5, portraitStack: true },
  "Metric Strip": { mode: "field", inlineUnits: 5.8, portraitStack: true },
  "Horizontal Scrollbar": { mode: "field", inlineUnits: 5.8, portraitStack: true },
  "Data Stats Module": { mode: "field", inlineUnits: 5.6, portraitStack: true },
  "Toolbar": { mode: "field", inlineUnits: 6.0, portraitStack: true },
  "Loader Progress": { mode: "field", inlineUnits: 5.3, portraitStack: true },
  "Media Seek Bar": { mode: "field", inlineUnits: 6.0, portraitStack: true },

  "Data Table": { mode: "canvas", inlineUnits: 7.2, portraitStack: true },
  "Media Card": { mode: "canvas", inlineUnits: 6.4, portraitStack: true },
  "Calendar": { mode: "canvas", inlineUnits: 6.4, portraitStack: true },
  "Upload Frame": { mode: "canvas", inlineUnits: 6.2, portraitStack: true },
  "Vault Landscape Asset": { mode: "canvas", inlineUnits: 6.4, portraitStack: true },
  "Vault Portrait Asset": { mode: "canvas", inlineUnits: 6.0, portraitStack: true },
  "Vault Audio Asset": { mode: "canvas", inlineUnits: 6.0, portraitStack: true },
  "Vault Document Asset": { mode: "canvas", inlineUnits: 6.0, portraitStack: true },
  "Tree View": { mode: "canvas", inlineUnits: 6.4, portraitStack: true },
  "Aspect Ratio Frame": { mode: "canvas", inlineUnits: 6.4, portraitStack: true },
  "Carousel": { mode: "canvas", inlineUnits: 6.4, portraitStack: true },
  "Command Palette": { mode: "canvas", inlineUnits: 6.4, portraitStack: true },
  "Media Poster Frame": { mode: "canvas", inlineUnits: 6.2, portraitStack: true },
  "Media Player": { mode: "canvas", inlineUnits: 8.4, portraitStack: true },
  "Media Queue": { mode: "canvas", inlineUnits: 8.1, portraitStack: true },
  "Media Inspector": { mode: "canvas", inlineUnits: 7.6, portraitStack: true },
  "Media Review Panel": { mode: "canvas", inlineUnits: 10.8, portraitStack: true },
  "Labeled Input": { mode: "field", inlineUnits: 5.2, portraitStack: true },
  "Labeled Textarea": { mode: "field", inlineUnits: 6.2, portraitStack: true },
  "Video Selector": { mode: "canvas", inlineUnits: 7.4, portraitStack: true },
  "Mini SubToolbox": { mode: "canvas", inlineUnits: 6.4, portraitStack: true },
  "Full-Width Section Band": { mode: "field", inlineUnits: 6.4, portraitStack: true },
  "Text + Badge Data Grid": { mode: "canvas", inlineUnits: 8.2, portraitStack: true },
  "Interactive Checklist Progress": { mode: "canvas", inlineUnits: 7.4, portraitStack: true },
  "Production Planner Grid": { mode: "canvas", inlineUnits: 9.2, portraitStack: true },
}

const getCatalogPreviewGeometry = (name: StudioHubMigratedFamily): CatalogPreviewGeometry =>
  CATALOG_PREVIEW_GEOMETRY[name] ?? { mode: "intrinsic" }


const DemoShell: React.FC<{
  level: StudioHubComponentLevel
  size: CatalogSize
  geometry: CatalogPreviewGeometry
  children: React.ReactNode
}> = ({ level, size, geometry, children }) => (
  <div
    className={`vt-catalog-demo is-${level} is-size-${size}`}
    data-level={level}
    data-vt-catalog-size={size}
    data-vt-preview-mode={geometry.mode}
    style={geometry.inlineUnits ? { ["--vt-catalog-inline-units" as string]: geometry.inlineUnits } as React.CSSProperties : undefined}
  >
    {children}
  </div>
)

const PrimitiveMigrationControl: React.FC<{
  name: string
  level: StudioHubComponentLevel
  size: CatalogSize
}> = ({ name, level, size }) => {
  const sizeStyle = getComponentSizeCssVars(size) as React.CSSProperties
  const [stepperValue, setStepperValue] = React.useState(5)
  const [toggleOn, setToggleOn] = React.useState(true)
  const [settingsOn, setSettingsOn] = React.useState(true)
  const [checkboxOn, setCheckboxOn] = React.useState(true)
  const [radioOn, setRadioOn] = React.useState(true)
  const [segmentChoice, setSegmentChoice] = React.useState("A")
  const [groupChoice, setGroupChoice] = React.useState("ONE")
  const [menuChoice, setMenuChoice] = React.useState("OPTION 1")
  const [sliderValue, setSliderValue] = React.useState(62)
  const [rangeLow, setRangeLow] = React.useState(22)
  const [rangeHigh, setRangeHigh] = React.useState(76)
  const [selectableTagOn, setSelectableTagOn] = React.useState(false)
  const [editorTags, setEditorTags] = React.useState(["NAPOLEON", "CAVALRY"])
  const [searchQuery, setSearchQuery] = React.useState("NAPOLEON")
  const [actionDraft, setActionDraft] = React.useState("NEW ITEM")
  const [knobValue, setKnobValue] = React.useState(72)
  const [colorValue, setColorValue] = React.useState("#36E0F6")
  const [mediaSelected, setMediaSelected] = React.useState(true)
  const [rowSelected, setRowSelected] = React.useState(false)
  const [tabValue, setTabValue] = React.useState("A")
  const [reorderItems, setReorderItems] = React.useState(["HOOK", "PROOF", "CTA"])
  const [dialogOpen, setDialogOpen] = React.useState(false)
  const [drawerOpen, setDrawerOpen] = React.useState(false)
  const [selectedDay, setSelectedDay] = React.useState(19)
  const [toastVisible, setToastVisible] = React.useState(true)
  const [page, setPage] = React.useState(2)
  const [controllerOn, setControllerOn] = React.useState(true)
  const [carouselIndex, setCarouselIndex] = React.useState(0)
  const [scrollPos, setScrollPos] = React.useState(30)
  const [vaultSelected, setVaultSelected] = React.useState(true)
  const [vaultTitle, setVaultTitle] = React.useState("NAPOLEON_ASSET_01")
  const [vaultTags, setVaultTags] = React.useState(["NAPOLEON", "HISTORY"])
  const [vaultNotes, setVaultNotes] = React.useState("NOTES: PRODUCTION REFERENCE MODULE")
  const [headerMode, setHeaderMode] = React.useState("A")
  const [mediaPlaying, setMediaPlaying] = React.useState(false)
  const [mediaCurrent, setMediaCurrent] = React.useState(22)
  const [mediaVolume, setMediaVolume] = React.useState(.76)
  const [mediaMuted, setMediaMuted] = React.useState(false)
  const [mediaSpeed, setMediaSpeed] = React.useState(1)
  const [mediaCaptions, setMediaCaptions] = React.useState(true)
  const [mediaQueueActive, setMediaQueueActive] = React.useState("a")
  const vaultCatalogPreview = React.useMemo(() => {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360"><defs><linearGradient id="g" x1="0" x2="1"><stop stop-color="#36E0F6"/><stop offset="1" stop-color="#FF7F6B"/></linearGradient></defs><rect width="640" height="360" fill="url(#g)"/><circle cx="160" cy="120" r="54" fill="white" fill-opacity=".7"/><path d="M60 300 230 150l85 75 120-120 145 195Z" fill="black" fill-opacity=".22"/><text x="320" y="325" text-anchor="middle" font-family="Arial" font-weight="900" font-size="34">VIEWTUBE VAULT</text></svg>`
    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`
  }, [])

  // Primitive track rule: only production primitives + shared CSS render here.
  // Unmigrated hardcoded families remain exclusively in the frozen baseline.
  if (name === "Primary Button" || name === "Secondary Button" || name === "Neutral Button" || name === "Destructive Button") {
    return <SubToolboxButton level={level} style={sizeStyle}>{name.replace(" Button", "")}</SubToolboxButton>
  }
  if (name === "Square Icon Button") {
    return <SubToolboxIconButton level={level} style={sizeStyle} icon={<Settings2 />} ariaLabel="Settings" />
  }
  if (name === "Text Input") {
    return <SubToolboxInput level={level} style={sizeStyle} type="text" defaultValue="TEXT INPUT" />
  }
  if (name === "Textarea") {
    return <SubToolboxTextArea level={level} style={sizeStyle} defaultValue="DESCRIPTION" />
  }
  if (name === "Stepper") {
    return <SubToolboxStepper level={level} style={sizeStyle} value={stepperValue} decreaseIcon={<Minus />} increaseIcon={<Plus />} onDecrease={() => setStepperValue((value) => value - 1)} onIncrease={() => setStepperValue((value) => value + 1)} />
  }
  if (name === "Toggle") {
    return <SubToolboxToggleSwitch level={level} style={sizeStyle} pressed={toggleOn} aria-label="Toggle" onClick={() => setToggleOn((value) => !value)} />
  }
  if (name === "Checkbox") {
    return <SubToolboxCheckControl level={level} style={sizeStyle} checked={checkboxOn} aria-label="Checkbox" onClick={() => setCheckboxOn((value) => !value)} />
  }
  if (name === "Radio") {
    return <SubToolboxRadioControl level={level} style={sizeStyle} checked={radioOn} aria-label="Radio" onClick={() => setRadioOn((value) => !value)} />
  }
  if (name === "Segmented Choice") {
    return <SubToolboxSegmentedToggle level={level} style={{ ...sizeStyle, ["--vt-segment-count" as string]: 3 } as React.CSSProperties} options={[{ value: "A", label: "A" }, { value: "B", label: "B" }, { value: "C", label: "C" }]} value={segmentChoice} onValueChange={setSegmentChoice} />
  }
  if (name === "Tag") {
    return <SubToolboxTag level={level} style={sizeStyle}>NAPOLEON</SubToolboxTag>
  }
  if (name === "Badge") {
    return <SubToolboxBadge level={level} style={sizeStyle}>BADGE</SubToolboxBadge>
  }
  if (name === "Status Badge") {
    return <SubToolboxStatusBadge level={level} style={sizeStyle}>READY</SubToolboxStatusBadge>
  }
  if (name === "Split Left Button" || name === "Head Tail Action") {
    return <SubToolboxSplitButton level={level} style={sizeStyle} icon={name === "Head Tail Action" ? <ChevronRight /> : <Settings2 />}>{name === "Head Tail Action" ? "Action" : "Settings"}</SubToolboxSplitButton>
  }
  if (name === "Split Menu") {
    return <SubToolboxSplitDropdown
      level={level} style={sizeStyle}
      value={menuChoice}
      options={[
        { value: "OPTION 1", label: "OPTION 1", icon: <Menu /> },
        { value: "OPTION 2", label: "OPTION 2", icon: <Settings2 /> },
        { value: "OPTION 3", label: "OPTION 3", icon: <SlidersHorizontal /> },
      ]}
      onChange={setMenuChoice}
      icon={<Menu />}
      chevron={<ChevronDown />}
      ariaLabel="Split menu"
    />
  }
  if (name === "Dropdown" || name === "Select Menu" || name === "Context Menu") {
    return <SubToolboxMenu level={level} style={sizeStyle} variant={name === "Context Menu" ? "context" : name === "Select Menu" ? "select" : "dropdown"} value={menuChoice} options={["OPTION 1","OPTION 2","OPTION 3"].map((option) => ({ value: option, label: option }))} onValueChange={setMenuChoice} triggerLabel={name === "Dropdown" ? "MENU" : menuChoice} triggerIcon={<MoreHorizontal />} chevronIcon={<ChevronDown />} ariaLabel={name} />
  }
  if (name === "Top Title Dropdown") {
    return <SubToolboxTopTitleDropdown
      level={level} style={sizeStyle}
      label="PRIVACY"
      value={menuChoice}
      options={["PUBLIC","UNLISTED","PRIVATE"].map((option) => ({ value: option, label: option }))}
      onValueChange={setMenuChoice}
      ariaLabel="Publishing control dropdown"
     
    />
  }
  if (name === "Split Search") {
    return <SubToolboxSplitField level={level} style={sizeStyle} variant="search" icon={<Search />} actionIcon={<X />} actionLabel="Clear search" onAction={() => setSearchQuery("")} inputProps={{ "aria-label": "Search", placeholder: "SEARCH", value: searchQuery, onChange: (event) => setSearchQuery(event.target.value) }} />
  }
  if (name === "Number Field") {
    return <SubToolboxInput level={level} style={sizeStyle} type="number" defaultValue="25" />
  }
  if (name === "Input Action") {
    return <SubToolboxSplitField level={level} style={sizeStyle} variant="action" actionIcon={<Plus />} actionLabel="Add item" onAction={() => setActionDraft("")} inputProps={{ "aria-label": "Add item", placeholder: "ADD ITEM", value: actionDraft, onChange: (event) => setActionDraft(event.target.value) }} />
  }
  if (name === "Slider") {
    return <SubToolboxSlider level={level} style={sizeStyle} value={sliderValue} onValueChange={setSliderValue} railIcon={<span>S</span>} onReset={() => setSliderValue(62)} />
  }
  if (name === "Range Slider") {
    return <SubToolboxRangeSlider level={level} style={sizeStyle} low={rangeLow} high={rangeHigh} onLowChange={setRangeLow} onHighChange={setRangeHigh} railIcon={<SlidersHorizontal />} onReset={() => { setRangeLow(22); setRangeHigh(76) }} />
  }
  if (name === "Settings Switch") {
    return <SubToolboxSettingsSwitch level={level} style={sizeStyle} pressed={settingsOn} aria-label="Settings switch" onClick={() => setSettingsOn((value) => !value)} />
  }
  if (name === "Button Group") {
    return <SubToolboxButtonGroup level={level} style={sizeStyle} items={[{ value: "ONE", label: "ONE" }, { value: "TWO", label: "TWO" }]} value={groupChoice} onValueChange={setGroupChoice} />
  }
  if (name === "Removable Tag") {
    return <SubToolboxRemovableTag level={level} style={sizeStyle} removeIcon={<X />}>NAPOLEON</SubToolboxRemovableTag>
  }
  if (name === "Selectable Tag") {
    return <SubToolboxSelectableTag level={level} style={sizeStyle} selected={selectableTagOn} selectedIcon={<Check />} unselectedIcon={<Plus />} onClick={() => setSelectableTagOn((value) => !value)}>{selectableTagOn ? "SELECTED" : "SELECT"}</SubToolboxSelectableTag>
  }
  if (name === "Tag Editor") {
    return <SubToolboxTagEditor level={level} style={sizeStyle} tags={editorTags} onTagsChange={setEditorTags} addIcon={<Plus />} saveIcon={<Check />} removeIcon={<X />} />
  }
  if (name === "Progress Bar") {
    return <SubToolboxProgressBar level={level} style={sizeStyle} value={68} />
  }
  if (name === "Progress Value") {
    return <SubToolboxProgressValue level={level} style={sizeStyle} value={68} label="SYNC" />
  }
  if (name === "KPI") {
    return <SubToolboxKpiCard level={level} style={sizeStyle} label="VIEWS" value="12.4K" />
  }
  if (name === "Stat Card") {
    return <SubToolboxStatCard level={level} style={sizeStyle} label="WATCH TIME" value="4,820H" delta="+12.4%" />
  }
  if (name === "Tooltip") {
    return <SubToolboxTooltip level={level} style={sizeStyle} content="TOOLTIP" />
  }
  if (name === "Tooltip Visual Key") {
    return (
      <SubToolboxLegendTooltip
        level={level} style={sizeStyle}
        title="VISUAL KEY"
        triggerLabel="KEY"
        items={[
          { label: "READY", detail: "Complete and available", color: "#3FEE56", icon: <Check /> },
          { label: "IN REVIEW", detail: "Needs creator attention", color: "#FFDA47", icon: <Lightbulb /> },
          { label: "MEDIA", detail: "Visual or asset reference", color: "#36E0F6", icon: <Image /> },
        ]}
        note="Use visual keys for legends, chart states, workflow status, and dense explanatory metadata."
      />
    )
  }
  if (name === "Knob Dial") {
    return <SubToolboxKnob level={level} style={sizeStyle} value={knobValue} onValueChange={setKnobValue} label="VALUE" />
  }
  if (name === "Alphabetical Spectrum Tags") {
    return <SubToolboxAlphabeticalSpectrumTags level={level} style={sizeStyle} />
  }
  if (name === "Field Label") {
    return <SubToolboxFieldLabel level={level} style={sizeStyle}>VIDEO TITLE</SubToolboxFieldLabel>
  }
  if (name === "Surface") {
    return <SubToolboxSurface level={level} style={sizeStyle} tone="accent"><strong>SURFACE</strong></SubToolboxSurface>
  }
  if (name === "State Panel") {
    return <SubToolboxStatePanel level={level} style={sizeStyle} state="ready" message="Ready to generate." />
  }
  if (name === "Output Card") {
    return <SubToolboxOutputCard level={level} style={sizeStyle} title="DESCRIPTION" badge="READY">Reusable generated output.</SubToolboxOutputCard>
  }
  if (name === "Metric") {
    return <SubToolboxMetric level={level} style={sizeStyle} label="VIEWS" value="12.4K" />
  }
  if (name === "Link Button") {
    return <SubToolboxLinkButton level={level} style={sizeStyle} href="#toolbox-ui-library-primitive" icon={<ChevronRight />}>OPEN</SubToolboxLinkButton>
  }
  if (name === "Data Table") {
    const rows = [{ metric: "Views", value: "12.4K" }, { metric: "CTR", value: "5.8%" }]
    return <SubToolboxDataTable level={level} style={sizeStyle} columns={[{ key: "metric", label: "METRIC" }, { key: "value", label: "VALUE", align: "right" }]} rows={rows} />
  }
  if (name === "Color Picker") {
    return <SubToolboxColorPicker level={level} style={sizeStyle} value={colorValue} onValueChange={setColorValue} label="ACCENT" />
  }
  if (name === "Media Card") {
    return <SubToolboxMediaCard level={level} style={sizeStyle} title="AUSTERLITZ" meta="16:9 · READY" preview={<div style={{ width: "100%", height: "100%", background: "var(--pair-a)" }} />} selected={mediaSelected} onClick={() => setMediaSelected((value) => !value)} />
  }
  if (name === "Selectable List Row") {
    return <SubToolboxSelectableListRow level={level} style={sizeStyle} title="DRAFT 01" detail="UPDATED NOW" leading={<span>01</span>} trailing={<ChevronRight />} selected={rowSelected} onClick={() => setRowSelected((value) => !value)} />
  }
  if (name === "Reorderable Row") {
    const first = reorderItems[0] ?? "HOOK"
    return <SubToolboxReorderRow level={level} style={sizeStyle} title={first} detail="SECTION 01" disableUp onMoveDown={() => setReorderItems((items) => items.length > 1 ? [items[1], items[0], ...items.slice(2)] : items)} onRemove={() => setReorderItems((items) => items.slice(1))} />
  }
  if (name === "Tabs") {
    return <SubToolboxTabs level={level} style={{ ...sizeStyle, ["--vt-tab-count" as string]: 3 } as React.CSSProperties} items={[{ value: "A", label: "EDIT" }, { value: "B", label: "PREVIEW" }, { value: "C", label: "DATA" }]} value={tabValue} onValueChange={setTabValue} />
  }
  if (name === "Alert") {
    return <SubToolboxAlert level={level} style={sizeStyle} tone="success" icon={<Check />} title="READY" detail="Primitive connected" />
  }
  if (name === "Step Indicator") {
    return <SubToolboxStepIndicator level={level} style={{ ...sizeStyle, ["--vt-step-count" as string]: 3 } as React.CSSProperties} steps={[{ label: "SCRIPT", state: "complete" }, { label: "VISUALS", state: "active" }, { label: "EXPORT", state: "upcoming" }]} />
  }
  if (name === "Dialog") {
    return <SubToolboxDialog level={level} style={sizeStyle} open={dialogOpen} onOpenChange={setDialogOpen} title="CONFIRM">Dialog content uses the same level DNA.</SubToolboxDialog>
  }
  if (name === "Drawer") {
    return <SubToolboxDrawer level={level} style={sizeStyle} open={drawerOpen} onOpenChange={setDrawerOpen} title="DETAILS">Drawer content.</SubToolboxDrawer>
  }
  if (name === "Calendar") {
    return <SubToolboxCalendar level={level} style={sizeStyle} selectedDay={selectedDay} onSelectDay={setSelectedDay} />
  }
  if (name === "Full-Width Section Band") {
    return <div className="grid gap-2"><SubToolboxSectionBand level={level} style={sizeStyle} tone="primary" label="LEAD" /><SubToolboxSectionBand level={level} style={sizeStyle} tone="secondary" label="PROPOSAL" /><SubToolboxSectionBand level={level} style={sizeStyle} tone="tertiary" label="ACTIVE / PAID" /></div>
  }
  if (name === "Text + Badge Data Grid") {
    return <SubToolboxTextBadgeGrid level={level} style={sizeStyle} columns={[{key:"segment",label:"SEGMENT"},{key:"signal",label:"SIGNAL"},{key:"action",label:"BEST ACTION"},{key:"activity",label:"LAST ACTIVITY"},{key:"status",label:"STATUS"}]} rows={[
      {segment:"History superfans",signal:"3+ longform comments",action:"Invite to topic poll",activity:"2 days ago",status:<span className="vt-workflow-badge is-success">ACTIVE</span>},
      {segment:"Shorts-only viewers",signal:"No longform click",action:"Pinned-video funnel",activity:"Today",status:<span className="vt-workflow-badge is-warning">OPPORTUNITY</span>},
      {segment:"Members",signal:"High retention",action:"Early-access post",activity:"Yesterday",status:<span className="vt-workflow-badge is-info">PRIORITY</span>},
    ]} />
  }
  if (name === "Interactive Checklist Progress") {
    return <SubToolboxInteractiveChecklistProgress level={level} style={sizeStyle} items={[
      {id:"a",title:"Revise weak thumbnail",detail:"CTR fell below baseline.",badge:"HIGH",badgeTone:"danger"},
      {id:"b",title:"Reply to questions",detail:"Three include video ideas.",badge:"MEDIUM",badgeTone:"warning",checked:true},
      {id:"c",title:"Finish script section",detail:"Project is 74% complete.",badge:"TODAY",badgeTone:"info",checked:true},
      {id:"d",title:"Approve sponsor deliverables",detail:"Deadline tomorrow.",badge:"URGENT",badgeTone:"danger",checked:true},
    ]} />
  }
  if (name === "CMYK Mixer") return <SubToolboxCmykMixer level={level} style={sizeStyle} />
  if (name === "XY Joystick") return <SubToolboxXYJoystick level={level} style={sizeStyle} />
  if (name === "Aspect Ratio Selector") return <SubToolboxAspectRatioSelector level={level} style={sizeStyle} />
  if (name === "Before / After Compare") return <SubToolboxBeforeAfterCompare level={level} style={sizeStyle} />
  if (name === "Spring-Loaded Toggle") return <SubToolboxSpringLoadedToggle level={level} style={sizeStyle} />
  if (name === "Accordion") return <SubToolboxAccordion level={level} style={sizeStyle} />
  if (name === "Output Input") return <SubToolboxOutputInput level={level} style={sizeStyle} />
  if (name === "Password Input") return <SubToolboxPasswordInput level={level} style={sizeStyle} />
  if (name === "Rating") return <SubToolboxRating level={level} style={sizeStyle} />
  if (name === "Checklist Progress") return <SubToolboxProductionChecklist level={level} style={sizeStyle} />
  if (name === "Data Grid") return <SubToolboxDataGrid level={level} style={sizeStyle} />
  if (name === "Navigation") return <SubToolboxNavigation level={level} style={sizeStyle} />
  if (name === "Top Navigation") return <SubToolboxNavigation top level={level} style={sizeStyle} />
  if (name === "Video Selector") return <ExtendedVideoSelector level={level} style={sizeStyle} />
  if (name === "Timeline") return <SubToolboxTimeline level={level} style={sizeStyle} />
  if (name === "Media Frame") return <SubToolboxMediaFrame level={level} style={sizeStyle} />
  if (name === "Color Switching Toggle") return <SubToolboxColorSwitchToggle level={level} style={sizeStyle} />
  if (name === "Toolbox Toggle") return <SubToolboxToolboxToggle level={level} style={sizeStyle} />
  if (name === "Toolbox Toggle · Black Handle") return <SubToolboxToolboxToggle level={level} style={sizeStyle} variant="pill" />
  if (name === "Toolbox Toggle · Black Fill") return <SubToolboxToolboxToggle level={level} style={sizeStyle} variant="black-fill" />
  if (name === "Section Band · Primary") return <SubToolboxSectionBand level={level} style={sizeStyle} tone="primary" label="PRIMARY" />
  if (name === "Section Band · Secondary") return <SubToolboxSectionBand level={level} style={sizeStyle} tone="secondary" label="SECONDARY" />
  if (name === "Checklist Progress · Compact") return <SubToolboxInteractiveChecklistProgress level={level} style={sizeStyle} items={[{id:"a",title:"CHECK",detail:"READY",checked:true},{id:"b",title:"REVIEW",detail:"NEXT"}]} />
  if (name === "Production Planner Grid · Compact") return <SubToolboxProductionPlannerGrid level={level} style={sizeStyle} days={[{id:"a",label:"MON",items:[{id:"x",label:"PLAN",tone:"info"}]},{id:"b",label:"TUE",items:[{id:"y",label:"BUILD",tone:"accent"}]}]} />
  if (name === "Avatar · Creator") return <SubToolboxAvatar level={level} style={sizeStyle} name="VIEW TUBE" meta="CREATOR" />
  if (name === "Avatar · Compact") return <SubToolboxAvatar level={level} style={sizeStyle} name="VT" meta="CREATOR" />
  if (name === "Tooltip · Dark") return <SubToolboxTooltip level={level} style={sizeStyle} content="DARK TOOLTIP" />
  if (name === "Tooltip · Color") return <SubToolboxLegendTooltip level={level} style={sizeStyle} title="COLOR KEY" triggerLabel="KEY" items={[{label:"READY",detail:"Active",color:"#36E0F6",icon:<Check/>}]} />
  if (name === "Disabled Button · Colored") return <SubToolboxButton level={level} style={sizeStyle} disabled tone="accent">DISABLED</SubToolboxButton>
  if (name === "Disabled Split Button · Colored") return <SubToolboxSplitButton level={level} style={sizeStyle} disabled icon={<ChevronRight/>}>DISABLED</SubToolboxSplitButton>
  if (name === "Upload Frame · Variant") return <SubToolboxFileTarget level={level} style={sizeStyle} label="UPLOAD MEDIA" icon={<Upload/>} minHeight={level === "l0" ? 176 : level === "l1" ? 144 : 112} />
  if (name === "Carousel · L2") return <SubToolboxCarousel level="l2" style={sizeStyle} index={carouselIndex} onIndexChange={setCarouselIndex} items={["ONE","TWO","THREE"].map(x=><span key={x}>{x}</span>)} />
  if (name === "LED Light · L1") return <SubToolboxLed level="l1" style={sizeStyle} active label="ACTIVE" />
  if (name === "Toast · L1") return <SubToolboxToast level="l1" style={sizeStyle} tone="success" title="SAVED" detail="Ready." onDismiss={()=>undefined} />
  if (name === "Calendar · Navigation") return <SubToolboxCalendar level={level} style={sizeStyle} selectedDay={selectedDay} onSelectDay={setSelectedDay} />
  if (name === "Scrollbar · L1") return <SubToolboxScrollbar level="l1" style={sizeStyle} orientation="horizontal" value={scrollPos} onValueChange={setScrollPos} />
  if (name === "Scrollbar · L2") return <SubToolboxScrollbar level="l2" style={sizeStyle} orientation="vertical" value={scrollPos} onValueChange={setScrollPos} />
  if (name === "Button Group · Select All") return <SubToolboxSelectAllButtonGroup level={level} style={sizeStyle} />
  if (name === "Toggle · Stroke") return <SubToolboxToggleSwitch level={level} pressed style={sizeStyle} className="is-stroke" aria-label="Stroke toggle" />
  if (name === "Toggle · No Stroke") return <SubToolboxToggleSwitch level={level} pressed={false} style={sizeStyle} aria-label="No-stroke toggle" />
  if (name === "Settings Switch · Stroke") return <SubToolboxSettingsSwitch level={level} pressed style={sizeStyle} className="is-stroke" aria-label="Stroke settings switch" />
  if (name === "Checkbox · Stroke") return <SubToolboxCheckControl level={level} checked style={sizeStyle} className="is-stroke" aria-label="Stroke checkbox" />
  if (name === "Radio · Stroke") return <SubToolboxRadioControl level={level} checked style={sizeStyle} className="is-stroke" aria-label="Stroke radio" />
  if (name === "Range Slider · L2") return <SubToolboxRangeSlider level="l2" style={sizeStyle} low={rangeLow} high={rangeHigh} onLowChange={setRangeLow} onHighChange={setRangeHigh} railIcon={<SlidersHorizontal/>} onReset={()=>{setRangeLow(22);setRangeHigh(76)}} />
  if (name === "Production Planner Grid") {
    return <SubToolboxProductionPlannerGrid level={level} style={sizeStyle} days={[
      {id:"mon",label:"MON 20",items:[{id:"research",label:"RESEARCH: AUSTERLITZ",tone:"warning"},{id:"thumb",label:"THUMBNAIL SKETCHES",tone:"info"}]},
      {id:"tue",label:"TUE 21",items:[{id:"script",label:"SCRIPT DRAFT",tone:"accent"}]},
      {id:"wed",label:"WED 22",items:[{id:"voice",label:"VOICEOVER",tone:"accent"},{id:"sponsor",label:"SPONSOR REVIEW",tone:"warning"}]},
      {id:"thu",label:"THU 23",items:[{id:"edit",label:"MAIN EDIT",tone:"info"}]},
      {id:"fri",label:"FRI 24",items:[{id:"qc",label:"QUALITY CONTROL",tone:"danger"}]},
      {id:"sat",label:"SAT 25",items:[{id:"publish",label:"PUBLISH LONGFORM",tone:"success"}]},
      {id:"sun",label:"SUN 26",items:[{id:"community",label:"COMMUNITY FOLLOW-UP",tone:"accent"}]},
    ]} />
  }
  if (name === "Loader") {
    return <SubToolboxLoader level={level} style={sizeStyle} variant="spinner" label="LOADING" />
  }
  if (name === "Loader Progress") {
    return <SubToolboxLoader level={level} style={sizeStyle} variant="progress" label="LOADING" />
  }
  if (name === "Loader Split") {
    return <SubToolboxLoader level={level} style={sizeStyle} variant="split" label="LOADING" />
  }
  if (name === "Loader Orbit") {
    return <SubToolboxLoader level={level} style={sizeStyle} variant="orbit" label="LOADING" />
  }
  if (name === "Loader Bars") {
    return <SubToolboxLoader level={level} style={sizeStyle} variant="bars" label="LOADING" />
  }
  if (name === "Skeleton") {
    return <SubToolboxSkeleton level={level} style={sizeStyle} lines={3} />
  }
  if (name === "Skeleton Compact") {
    return <SubToolboxSkeleton level={level} style={sizeStyle} variant="compact" />
  }
  if (name === "Skeleton Media") {
    return <SubToolboxSkeleton level={level} style={sizeStyle} variant="media" ratio="16:9" />
  }
  if (name === "Toast") {
    return toastVisible
      ? <SubToolboxToast level={level} style={sizeStyle} tone="success" title="SAVED" detail="Changes are ready." onDismiss={() => setToastVisible(false)} />
      : <SubToolboxButton level={level} style={sizeStyle} onClick={() => setToastVisible(true)}>SHOW TOAST</SubToolboxButton>
  }
  if (name === "Popover") {
    return <SubToolboxPopover level={level} style={sizeStyle} trigger="OPTIONS" title="OPTIONS"><strong>Popover content</strong></SubToolboxPopover>
  }
  if (name === "Disclosure") {
    return <SubToolboxDisclosure level={level} style={sizeStyle} title="ADVANCED" icon={<Plus />}>Disclosure content.</SubToolboxDisclosure>
  }
  if (name === "Divider") {
    return <SubToolboxDivider level={level} style={sizeStyle} />
  }
  if (name === "Pagination") {
    return <SubToolboxPagination level={level} style={sizeStyle} page={page} pages={3} onPageChange={setPage} />
  }
  if (name === "Controller Switch") {
    return <SubToolboxControllerSwitch level={level} style={sizeStyle} pressed={controllerOn} onClick={() => setControllerOn((value) => !value)} />
  }
  if (name === "LED Light") {
    return <SubToolboxLed level={level} style={sizeStyle} active label="ACTIVE" />
  }
  if (name === "LED Dot") {
    return <SubToolboxLedDot level={level} style={sizeStyle} active label="Active status light" />
  }
  if (name === "Icon Rail Control") {
    return <SubToolboxIconRailControl level={level} style={sizeStyle} icon={<SlidersHorizontal />} label="CONTROL" />
  }
  if (name === "Hover Card") {
    return <SubToolboxHoverCard level={level} style={sizeStyle} trigger="HOVER" content={<><strong>DETAILS</strong><div>Reusable hover information.</div></>} />
  }
  if (name === "Meter") {
    return <SubToolboxMeter level={level} style={sizeStyle} value={73} label="QUALITY" />
  }
  if (name === "Avatar") {
    return <SubToolboxAvatar level={level} style={sizeStyle} name="VIEW TUBE" meta="CREATOR" />
  }
  if (name === "Name Value List") {
    return <SubToolboxNameValueList level={level} style={sizeStyle} items={[{ name: "Views", value: "12.4K" }, { name: "CTR", value: "5.8%" }]} />
  }
  if (name === "Breadcrumb") {
    return <SubToolboxBreadcrumb level={level} style={sizeStyle} items={[{ label: "Studio" }, { label: "Video" }, { label: "Package" }]} />
  }
  if (name === "Carousel") {
    return <SubToolboxCarousel level={level} style={sizeStyle} index={carouselIndex} onIndexChange={setCarouselIndex} items={["FRAME 01","FRAME 02","FRAME 03"].map((item) => <span key={item}>{item}</span>)} />
  }
  if (name === "Command Palette") {
    return <SubToolboxCommandPalette level={level} style={sizeStyle} items={[{ id: "script", label: "SCRIPT ARCHITECT", keywords: "write outline" }, { id: "thumb", label: "THUMBNAIL STUDIO", keywords: "image packaging" }, { id: "publish", label: "VIDEO PUBLISHER", keywords: "upload metadata" }]} />
  }


  if (name === "Metric Strip") {
    return <SubToolboxMetricStrip level={level} style={sizeStyle} items={[{ label: "VIEWS", value: "12K" }, { label: "CTR", value: "5.8%" }, { label: "AVP", value: "72%" }]} />
  }
  if (name === "Horizontal Scrollbar") {
    return <SubToolboxScrollbar level={level} style={sizeStyle} orientation="horizontal" value={scrollPos} onValueChange={setScrollPos} />
  }
  if (name === "Vertical Scrollbar") {
    return <SubToolboxScrollbar level={level} style={sizeStyle} orientation="vertical" value={scrollPos} onValueChange={setScrollPos} />
  }
  if (name === "Data Stats Module") {
    return <SubToolboxDataStats level={level} style={sizeStyle} label="TOTAL VIEWS" value="128,442" delta="+12.4%" variant="standard" />
  }
  if (name === "Upload Frame") {
    return <SubToolboxFileTarget level={level} style={sizeStyle} label="DROP OR CHOOSE FILE" icon={<Upload />} minHeight={level === "l0" ? 176 : level === "l1" ? 144 : 112} />
  }
  if (name.startsWith("Vault ")) {
    const moduleKind: VaultAssetModuleKind = name.includes("Audio")
      ? "audio"
      : name.includes("Document")
        ? "document"
        : (name.includes("Landscape") || name.includes("Portrait")) && name.includes("Asset")
          ? (name.includes("Swapped") || name.includes("Double") ? "image" : "video")
          : "image"
    const moduleVariant: VaultAssetModuleVariant = name.includes("Landscape Swapped")
      ? "landscape-swapped"
      : name.includes("Landscape")
        ? "landscape"
        : name.includes("Portrait Double")
          ? "portrait-double"
          : name.includes("Portrait")
            ? "portrait-single"
            : name.includes("Audio")
              ? "audio"
              : "document"
    return (
      <VaultAssetModule
        level={level} style={sizeStyle}
        kind={moduleKind}
        variant={moduleVariant}
        title={vaultTitle}
        previewUrl={moduleKind === "audio" || moduleKind === "document" ? null : vaultCatalogPreview}
        mimeType={moduleKind === "document" ? "application/pdf" : undefined}
        fileTypeLabel={moduleKind === "document" ? "PDF" : undefined}
        durationLabel={moduleKind === "video" || moduleKind === "audio" ? "00:35" : undefined}
        selected={vaultSelected}
        tags={vaultTags}
        sharedTags={["APPLE", "BATTLE", "CAMERA", "HISTORY", "NAPOLEON", "THUMBNAIL", "VIDEO", "YOUTUBE"]}
        notes={vaultNotes}
        paletteIndex={7}
        onSelectedChange={setVaultSelected}
        onTitleChange={setVaultTitle}
        onTagsChange={setVaultTags}
        onNotesChange={setVaultNotes}
      />
    )
  }
  if (name === "Tree View") {
    return <SubToolboxTree
      level={level} style={sizeStyle}
      defaultOpenIds={["root", "assets"]}
      nodes={[{
        id: "root",
        label: "PROJECT",
        icon: <Lightbulb />,
        children: [
          { id: "script", label: "SCRIPT", icon: <FileText />, secondaryIcon: <FileText /> },
          {
            id: "assets",
            label: "ASSETS",
            icon: <Image />,
            secondaryIcon: <ChevronDown />,
            children: [
              { id: "thumb", label: "THUMBNAIL", icon: <Image />, secondaryIcon: <Image /> },
              { id: "audio", label: "AUDIO", icon: <Music />, secondaryIcon: <Music /> },
            ],
          },
        ],
      }]}
    />
  }
  if (name === "Media Control Button") {
    return <SubToolboxMediaControlButton level={level} style={sizeStyle} icon={<Volume2 />} label="Media control" />
  }
  if (name === "Media Play Toggle") {
    return <SubToolboxMediaPlayToggle level={level} style={sizeStyle} playing={mediaPlaying} onClick={() => setMediaPlaying((value) => !value)} />
  }
  if (name === "Media Seek Bar") {
    return <SubToolboxMediaSeekBar level={level} style={sizeStyle} value={mediaCurrent} duration={90} buffered={58} onValueChange={setMediaCurrent} />
  }
  if (name === "Media Volume Control") {
    return <SubToolboxMediaVolumeControl level={level} style={sizeStyle} value={mediaVolume} muted={mediaMuted} onValueChange={setMediaVolume} onMutedChange={setMediaMuted} />
  }
  if (name === "Media Timecode") {
    return <SubToolboxMediaTimecode level={level} style={sizeStyle} current={mediaCurrent} duration={90} />
  }
  if (name === "Media Duration Badge") {
    return <SubToolboxMediaDurationBadge level={level} style={sizeStyle} seconds={90} />
  }
  if (name === "Media Caption Toggle") {
    return <SubToolboxMediaCaptionToggle level={level} style={sizeStyle} enabled={mediaCaptions} onClick={() => setMediaCaptions((value) => !value)} />
  }
  if (name === "Media Speed Control") {
    return <SubToolboxMediaSpeedControl level={level} style={sizeStyle} value={mediaSpeed} onValueChange={setMediaSpeed} />
  }
  if (name === "Media Poster Frame") {
    return <SubToolboxMediaPoster level={level} style={sizeStyle} ratio="16:9" overlay={<SubToolboxMediaDurationBadge level={level} style={sizeStyle} seconds={90} />}><Play /></SubToolboxMediaPoster>
  }
  if (name === "Media Status") {
    return <SubToolboxMediaStatus level={level} style={sizeStyle} status={mediaPlaying ? "playing" : "ready"} />
  }
  if (name === "Media Transport Bar") {
    return <SubToolboxMediaTransportBar
      level={level} style={sizeStyle}
      playing={mediaPlaying}
      current={mediaCurrent}
      duration={90}
      speed={mediaSpeed}
      captions={mediaCaptions}
      onPlayingChange={setMediaPlaying}
      onCurrentChange={setMediaCurrent}
      onSpeedChange={setMediaSpeed}
      onCaptionsChange={setMediaCaptions}
      onFullscreen={() => undefined}
    />
  }
  if (name === "Media Player") {
    return <SubToolboxMediaPlayer
      level={level} style={sizeStyle}
      title="AUSTERLITZ PREVIEW"
      meta="16:9 · 1080P"
      current={mediaCurrent}
      duration={90}
      buffered={58}
      playing={mediaPlaying}
      muted={mediaMuted}
      volume={mediaVolume}
      speed={mediaSpeed}
      captions={mediaCaptions}
      onCurrentChange={setMediaCurrent}
      onPlayingChange={setMediaPlaying}
      onMutedChange={setMediaMuted}
      onVolumeChange={setMediaVolume}
      onSpeedChange={setMediaSpeed}
      onCaptionsChange={setMediaCaptions}
      onFullscreen={() => undefined}
    />
  }
  if (name === "Media Queue") {
    return <SubToolboxMediaQueue
      level={level} style={sizeStyle}
      activeId={mediaQueueActive}
      onActiveChange={setMediaQueueActive}
      items={[
        { id: "a", title: "AUSTERLITZ MASTER", meta: "FINAL CUT", duration: 90, status: "ready" },
        { id: "b", title: "SHORTS CUT", meta: "9:16", duration: 38, status: "processing" },
        { id: "c", title: "ALT OPENING", meta: "VERSION 03", duration: 74, status: "paused" },
      ]}
    />
  }
  if (name === "Media Inspector") {
    return <SubToolboxMediaInspector
      level={level} style={sizeStyle}
      title="AUSTERLITZ MASTER"
      duration={90}
      status="ready"
      items={[
        { label: "FORMAT", value: "16:9" },
        { label: "RESOLUTION", value: "1920×1080" },
        { label: "FPS", value: "30" },
      ]}
      actions={<SubToolboxMediaControlButton level={level} style={sizeStyle} icon={<Expand />} label="Open media" />}
    />
  }
  if (name === "Media Review Panel") {
    return <SubToolboxMediaReviewPanel
      level={level} style={sizeStyle}
      title="MEDIA REVIEW"
      status={<SubToolboxMediaStatus level={level} style={sizeStyle} status="ready" />}
      player={<SubToolboxMediaPlayer
        level={level} style={sizeStyle}
        title="REVIEW CUT"
        current={mediaCurrent}
        duration={90}
        playing={mediaPlaying}
        muted={mediaMuted}
        volume={mediaVolume}
        speed={mediaSpeed}
        captions={mediaCaptions}
        onCurrentChange={setMediaCurrent}
        onPlayingChange={setMediaPlaying}
        onMutedChange={setMediaMuted}
        onVolumeChange={setMediaVolume}
        onSpeedChange={setMediaSpeed}
        onCaptionsChange={setMediaCaptions}
      />}
      notes={<><strong>REVIEW NOTES</strong><div>Check first 8 seconds, caption timing, and final CTA.</div></>}
      actions={<><SubToolboxMediaControlButton level={level} style={sizeStyle} icon={<Check />} label="Approve" active /><SubToolboxMediaControlButton level={level} style={sizeStyle} icon={<Settings2 />} label="Review settings" /></>}
    />
  }
  if (name === "Labeled Input") {
    return <SubToolboxLabeledInput level={level} style={sizeStyle} variant="right-label" overlayLabel="TITLE" defaultValue="EGYPT PART CLASH COPY" placeholder=" " aria-label="Labeled title input" />
  }
  if (name === "Labeled Textarea") {
    return <SubToolboxLabeledTextArea level={level} style={sizeStyle} variant="right-label" overlayLabel="DESCRIPTION" defaultValue="A long-form video description fills the field while its contextual label remains behind the text until focus." placeholder=" " aria-label="Labeled description textarea" />
  }
  if (name === "Video Selector") {
    return <SubToolboxVideoSelector
      level={level} style={sizeStyle}
      value="a"
      options={[
        { value: "a", title: "EGYPT PART CLASH COPY", dateLabel: "SEP 24 26", durationLabel: "0:35" },
        { value: "b", title: "THE ENTIRE NAPOLEONIC CAMPAIGN EXPLAINED IN ONE VERY LONG VIDEO TITLE", dateLabel: "SEP 20 26", durationLabel: "12:44" },
      ]}
      searchValue=""
      onSearchValueChange={() => undefined}
      searchIcon={<Search size={18} strokeWidth={3} />}
    />
  }
  if (name === "Mini SubToolbox") {
    return <MiniSubToolbox
      title="Thumbnail"
      icon={<Image size={18} strokeWidth={3} />}
      actions={<><SubToolboxButton level="l2">Upload</SubToolboxButton><SubToolboxButton level="l2">Generate</SubToolboxButton></>}
    >
      <SubToolboxAspectRatioFrame level={level} style={sizeStyle} ratio="16:9"><Image /></SubToolboxAspectRatioFrame>
    </MiniSubToolbox>
  }
  if (name === "Disabled Button") {
    return <SubToolboxButton level={level} style={sizeStyle} disabled>DISABLED</SubToolboxButton>
  }
  if (name === "Disabled Split Button") {
    return <SubToolboxSplitButton level={level} style={sizeStyle} icon={<Settings2 />} disabled>DISABLED</SubToolboxSplitButton>
  }
  if (name === "Two Color Data Stats") {
    return <SubToolboxDataStats level={level} style={sizeStyle} label="VIEWS" value="128K" delta="+12%" variant="two-color" />
  }
  if (name === "Monochrome Data Stats") {
    return <SubToolboxDataStats level={level} style={sizeStyle} label="WATCH TIME" value="4.8K" delta="+8%" variant="monochrome" />
  }
  if (name === "Tiny Data Stats") {
    return <SubToolboxDataStats level={level} style={sizeStyle} label="CTR" value="5.8%" variant="tiny" />
  }
  if (name === "Tooltip Dark") {
    return <SubToolboxTooltip level={level} style={sizeStyle} variant="dark" content="TOOLTIP" />
  }
  if (name === "Tooltip Color") {
    return <SubToolboxTooltip level={level} style={sizeStyle} variant="color" content="TOOLTIP" />
  }
  if (name === "Dashboard Pill Tags") {
    return <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}><SubToolboxTag level={level} style={sizeStyle} variant="dashboard-pill">READY</SubToolboxTag><SubToolboxTag level={level} style={sizeStyle} variant="dashboard-pill">VIDEO</SubToolboxTag></div>
  }
  if (name === "Aspect Ratio Frame") {
    return <SubToolboxAspectRatioFrame level={level} style={sizeStyle} ratio="16:9" label="16:9"><Image /></SubToolboxAspectRatioFrame>
  }
  if (name === "Toolbar") {
    return <SubToolboxToolbar level={level} style={sizeStyle} leading={<strong>TOOLS</strong>} trailing={<SubToolboxIconButton level={level} style={sizeStyle} icon={<Settings2 />} ariaLabel="Toolbar settings" />}><SubToolboxButton level={level} style={sizeStyle}>EDIT</SubToolboxButton><SubToolboxButton level={level} style={sizeStyle}>SAVE</SubToolboxButton></SubToolboxToolbar>
  }
  if (name === "Toolbox Header Icon Rail") {
    return <div style={{ height: 80, display: "flex" }}><ToolboxHeaderIconRail level="toolbox" backgroundColor="var(--pair-b)"><Settings2 /></ToolboxHeaderIconRail></div>
  }
  if (name === "SubToolbox Header Icon Rail") {
    return <div style={{ height: 56, display: "flex" }}><ToolboxHeaderIconRail level="subtoolbox" backgroundColor="var(--pair-b)"><Settings2 /></ToolboxHeaderIconRail></div>
  }
  if (name === "Toolbox Header Title") {
    return <ToolboxHeaderTitle level="toolbox">VIDEO MANAGER</ToolboxHeaderTitle>
  }
  if (name === "SubToolbox Header Title") {
    return <ToolboxHeaderTitle level="subtoolbox">VIDEO DETAILS</ToolboxHeaderTitle>
  }
  if (name === "Toolbox Header Help") {
    return <div style={{ height: 80 }}><ToolboxHeaderHelpButton level="toolbox" aria-label="Toolbox help" /></div>
  }
  if (name === "SubToolbox Header Help") {
    return <div style={{ height: 56 }}><ToolboxHeaderHelpButton level="subtoolbox" aria-label="Subtoolbox help" /></div>
  }
  if (name === "Toolbox Header Collapse") {
    return <div style={{ height: 80 }}><ToolboxHeaderCollapseButton level="toolbox" open icon={<X />} aria-label="Collapse toolbox" /></div>
  }
  if (name === "SubToolbox Header Collapse") {
    return <div style={{ height: 56 }}><ToolboxHeaderCollapseButton level="subtoolbox" open icon={<X />} aria-label="Collapse subtoolbox" /></div>
  }
  if (name === "Toolbox Header Toggle") {
    return <ToolboxHeaderToggle value={headerMode} onValueChange={setHeaderMode} options={[{ value: "A", label: "ON" }, { value: "B", label: "OFF" }]} />
  }
  if (name === "SubToolbox Header Toggle") {
    return <ToolboxHeaderToggle level="subtoolbox" value={headerMode} onValueChange={setHeaderMode} options={[{ value: "A", label: "A" }, { value: "B", label: "B" }]} />
  }

  return null
}

export interface StudioHubPrimitiveMigrationCatalogProps {
  paletteIndex?: number
}

export const StudioHubPrimitiveMigrationCatalog: React.FC<StudioHubPrimitiveMigrationCatalogProps> = ({
  paletteIndex = 7,
}) => (
  <section
    className="vt-primitive-migration-catalog"
    aria-labelledby="studio-hub-primitive-migration-catalog-title"
    data-palette-index={paletteIndex}
    data-vt-catalog-track="primitive-migration"
  >
    <header className="vt-complete-catalog-heading">
      <div>
        <Lightbulb />
        <div>
          <h2 id="studio-hub-primitive-migration-catalog-title">Complete Component + Primitive Catalog</h2>
          <p>Only production primitives are rendered here. Unmigrated hardcoded families stay exclusively in the baseline toolbox.</p>
        </div>
      </div>
      <strong>{STUDIO_HUB_MIGRATED_FAMILIES.length} PRIMITIVE FAMILIES · {STUDIO_HUB_MIGRATED_FAMILIES.length * CATALOG_SIZES.length} SIZE EXAMPLES</strong>
    </header>

    <div className="vt-complete-catalog-grid">
      {STUDIO_HUB_MIGRATED_FAMILIES.map((name, index) => (
        <div
          className="vt-primitive-migration-family"
          key={name}
          data-vt-family={name}
          data-vt-migration-state="primitive"
          data-vt-preview-mode={getCatalogPreviewGeometry(name).mode}
          data-vt-preview-portrait={getCatalogPreviewGeometry(name).portraitStack ? "stack" : "grid"}
        >
          <SubToolbox
            title={`${String(index + 1).padStart(2, "0")} ${name}`}
            icon={<Settings2 />}
            paletteIndex={paletteIndex + index}
            collapsible
            isOpenInitial
            overflowVisible
            contentClassName="p-3"
          >
            <div className="vt-catalog-levels">
              {CATALOG_SIZES.map(({ size, level }) => (
                <DemoShell level={level} size={size} geometry={getCatalogPreviewGeometry(name)} key={size}>
                  <PrimitiveMigrationControl name={name} level={level} size={size} />
                </DemoShell>
              ))}            </div>
          </SubToolbox>
        </div>
      ))}
    </div>
  </section>
)

export default StudioHubPrimitiveMigrationCatalog
