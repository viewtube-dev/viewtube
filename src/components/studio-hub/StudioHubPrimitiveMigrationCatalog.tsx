import React from "react"
import { Captions, Check, ChevronDown, ChevronLeft, ChevronRight, Expand, FileText, Gauge, Image, Lightbulb, ListVideo, Menu, Minus, MoreHorizontal, Music, Pause, Play, Plus, Search, Settings2, SlidersHorizontal, Upload, Volume2, X } from "lucide-react"
import { MiniSubToolbox, SubToolbox, SubToolboxDropdownControl } from "../Toolbox"
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
  PrimaryButton,
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
  SubToolboxIconButton,
  SubToolboxInput,
  SubToolboxInput20,
  SubToolboxTextArea21,
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
  SubToolboxScriptBar,
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
import { SubToolboxKpiCard, SubToolboxSplitDropdown } from "../subtoolbox/SubToolboxSplitPrimitives"
import { VaultAssetModule, type VaultAssetModuleKind, type VaultAssetModuleVariant } from "../subtoolbox/VaultAssetModule"
import { TagRankTag } from "../metadata/TagRankTag"
import { EducationTimestampNotes } from "../metadata/EducationTimestampNotes"
import { SubToolboxNestedSquareChoice, SubToolboxTagActionRow } from "../subtoolbox/SubToolboxCompoundPrimitives"
import { StudioSplitLeftButton, StudioSplitRightButton, StudioDoubleSplitButton, StudioTwoLineButton, StudioSplitTwoLineButton, StudioDropdown, StudioSplitLeftDropdown, StudioSquareIconButton, StudioLegendMultiDropdown, StudioUploadFrame, StudioSideCounter, StudioCounter, StudioLeftCounter, StudioLeftWordCounter, StudioDoubleSplitSlider, StudioLeftWordSlider, StudioTextInput, StudioInput, StudioNumberInput, StudioTextArea } from "../../studio-ui/primitives/StudioControls"
import "./studio-hub-primitive-migration-catalog.css"

type StudioHubComponentLevel = ToolboxControlLevel

const STANDARD_LEVEL: StudioHubComponentLevel = "l1"

export const STUDIO_HUB_MIGRATED_FAMILIES = [
  "Switches / Toggles / Radio / Checkbox",
  "Studio Button Family",
  "Square Icon Button",
  "Split Left Button",
  "Studio Dropdown Family",
  "Studio Counter Family",
  "Studio Slider Family",
  "Loader Family",
  "Tooltip Family",
  "Skeleton Family",
  "Data Stats Family",
  "Scrollbar Family",
  "LED Family",
  "Toolbox Header Family",
  "Head Tail Action",
  "Nested Square Choice",
  "Tag-Adjacent Split Action Row",
  "Multi-Section Script Bar",
  "Ranked Metadata Tag",
  "Education Timestamp Notes",
  "Studio Text Input",
  "Studio Text Area",
  "Text Input",
  "Textarea",
  "20 Plain Input",
  "21 Plain Text Area",
  "137 Floating Label Input",
  "138 Floating Label Text Area",
  "Split Search",
  "Number Field",
  "Input Action",
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
  "Toast",
  "Popover",
  "Disclosure",
  "Divider",
  "Pagination",
  "Icon Rail Control",
  "Hover Card",
  "Meter",
  "Avatar",
  "Name Value List",
  "Breadcrumb",
  "Carousel",
  "Command Palette",
  "Metric Strip",
  "Upload Frame",
  "Vault Landscape Asset",
  "Vault Landscape Swapped Asset",
  "Vault Portrait Asset",
  "Vault Portrait Double Asset",
  "Vault Audio Asset",
  "Vault Document Asset",
  "Tree View",
  "Dashboard Pill Tags",
  "Aspect Ratio Frame",
  "Toolbar",
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
] as const

type StudioHubMigratedFamily = (typeof STUDIO_HUB_MIGRATED_FAMILIES)[number]

type CatalogPreviewMode = "intrinsic" | "fixed" | "compound" | "field" | "canvas"

type CatalogPreviewGeometry = {
  mode: CatalogPreviewMode
  inlineUnits?: number
  portraitStack?: boolean
}

const CATALOG_PREVIEW_GEOMETRY: Partial<Record<StudioHubMigratedFamily, CatalogPreviewGeometry>> = {
  "Studio Dropdown Family": { mode: "compound", inlineUnits: 6.5, portraitStack: true },
  "Studio Counter Family": { mode: "compound", inlineUnits: 5.8, portraitStack: true },
  "Studio Slider Family": { mode: "compound", inlineUnits: 5.8, portraitStack: true },
  "Switches / Toggles / Radio / Checkbox": { mode: "compound", inlineUnits: 8.2, portraitStack: true },
  "Square Icon Button": { mode: "fixed" },
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
  "Tone / Tension / Cinematic Dropdown": { mode: "compound", inlineUnits: 5.0, portraitStack: true },
  "Nested Square Choice": { mode: "compound", inlineUnits: 4.8, portraitStack: true },
  "Tag-Adjacent Split Action Row": { mode: "compound", inlineUnits: 6.2, portraitStack: true },
  "Multi-Section Script Bar": { mode: "compound", inlineUnits: 7.0, portraitStack: true },
  "Ranked Metadata Tag": { mode: "compound", inlineUnits: 4.5, portraitStack: true },
  "Education Timestamp Notes": { mode: "field", inlineUnits: 6.2, portraitStack: true },
  "Split Search": { mode: "compound", inlineUnits: 5.15, portraitStack: true },
  "Input Action": { mode: "compound", inlineUnits: 4.7, portraitStack: true },
  "Stepper": { mode: "compound", inlineUnits: 3.2, portraitStack: true },
  "Studio Left Word Counter": { mode: "compound", inlineUnits: 3.2, portraitStack: true },
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
  geometry: CatalogPreviewGeometry
  children: React.ReactNode
}> = ({ level, geometry, children }) => (
  <div
    className={`vt-catalog-demo is-${level}`}
    data-level={level}
    data-vt-preview-mode={geometry.mode}
    style={geometry.inlineUnits ? { ["--vt-catalog-inline-units" as string]: geometry.inlineUnits } as React.CSSProperties : undefined}
  >
    {children}
  </div>
)

const PrimitiveMigrationControl: React.FC<{
  name: string
  level: StudioHubComponentLevel
}> = ({ name, level }) => {
  const [stepperValue, setStepperValue] = React.useState(5)
  const [wordCounterValue, setWordCounterValue] = React.useState(1)
  const [toggleOn, setToggleOn] = React.useState(true)
  const [settingsOn, setSettingsOn] = React.useState(true)
  const [checkboxOn, setCheckboxOn] = React.useState(true)
  const [radioOn, setRadioOn] = React.useState(true)
  const [segmentChoice, setSegmentChoice] = React.useState("A")
  const [groupChoice, setGroupChoice] = React.useState("ONE")
  const [menuChoice, setMenuChoice] = React.useState("OPTION 1")
  const [privacyChoice, setPrivacyChoice] = React.useState("PUBLIC")
  const [legendFilters, setLegendFilters] = React.useState<string[]>(["VIDEOS"])
  const [toneChoice, setToneChoice] = React.useState("CINEMATIC")
  const [nestedChoice, setNestedChoice] = React.useState("HOOK")
  const [educationNotes, setEducationNotes] = React.useState("0:00 Open with the central question\n1:25 Explain the key evidence")
  const [tagActionStatus, setTagActionStatus] = React.useState("")
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

  // Keep all binary and segmented choice controls discoverable together.
  // Each preview is the actual production primitive, not a catalog imitation.
  if (name === "Switches / Toggles / Radio / Checkbox") {
    return (
      <div className="vt-catalog-choice-family" role="group" aria-label="Switches, toggles, radio buttons, and checkboxes">
        <div className="vt-catalog-choice-specimen">
          <span>TOGGLE</span>
          <SubToolboxToggleSwitch level={level} pressed={toggleOn} aria-label="Toggle" onClick={() => setToggleOn((value) => !value)} />
        </div>
        <div className="vt-catalog-choice-specimen">
          <span>WORD TOGGLE</span>
          <SubToolboxSegmentedToggle level={level} options={[{ value: "show", label: "SHOW" }, { value: "hide", label: "HIDE" }]} value={toggleOn ? "show" : "hide"} onValueChange={(value) => setToggleOn(value === "show")} ariaLabel="Word toggle" />
        </div>
        <div className="vt-catalog-choice-specimen">
          <span>SETTINGS SWITCH</span>
          <SubToolboxSettingsSwitch level={level} pressed={settingsOn} aria-label="Settings switch" onClick={() => setSettingsOn((value) => !value)} />
        </div>
        <div className="vt-catalog-choice-specimen">
          <span>CHECKBOX</span>
          <SubToolboxCheckControl level={level} checked={checkboxOn} aria-label="Checkbox" onClick={() => setCheckboxOn((value) => !value)} />
        </div>
        <div className="vt-catalog-choice-specimen">
          <span>RADIO</span>
          <SubToolboxRadioControl level={level} checked={radioOn} aria-label="Radio" onClick={() => setRadioOn((value) => !value)} />
        </div>
        <div className="vt-catalog-choice-specimen">
          <span>SEGMENTED CHOICE</span>
          <SubToolboxSegmentedToggle level={level} style={{ ["--vt-segment-count" as string]: 3 } as React.CSSProperties} options={[{ value: "A", label: "A" }, { value: "B", label: "B" }, { value: "C", label: "C" }]} value={segmentChoice} onValueChange={setSegmentChoice} />
        </div>
        <div className="vt-catalog-choice-specimen">
          <span>CONTROLLER SWITCH</span>
          <SubToolboxControllerSwitch level={level} pressed={controllerOn} onClick={() => setControllerOn((value) => !value)} />
        </div>
      </div>
    )
  }

  if (name === "Studio Button Family") {
    return (
      <div className="vt-catalog-button-family" role="group" aria-label="Standard button family">
        <div className="vt-catalog-family-variant"><span>PRIMARY</span><PrimaryButton level={level}>SAVE</PrimaryButton></div>
        <div className="vt-catalog-family-variant"><span>SECONDARY</span><PrimaryButton level={level} tone="neutral">CANCEL</PrimaryButton></div>
        <div className="vt-catalog-family-variant"><span>NEUTRAL</span><PrimaryButton level={level} tone="ink">OPEN</PrimaryButton></div>
        <div className="vt-catalog-family-variant"><span>DESTRUCTIVE</span><PrimaryButton level={level} tone="danger">DELETE</PrimaryButton></div>
        <div className="vt-catalog-family-variant"><span>DISABLED</span><PrimaryButton level={level} disabled>UNAVAILABLE</PrimaryButton></div>
        <details className="vt-catalog-variants"><summary>VARIANTS</summary><p>Primary, secondary, neutral, destructive, and disabled are tones/states of the same standard button system. Split and square-icon buttons remain in their own geometry families.</p></details>
      </div>
    )
  }

  // Primitive track rule: only production primitives + shared CSS render here.
  // Unmigrated hardcoded families remain exclusively in the frozen baseline.
  if (name === "Primary Button" || name === "Secondary Button" || name === "Neutral Button" || name === "Destructive Button") {
    return <PrimaryButton level={level} tone={name === "Destructive Button" ? "danger" : name === "Neutral Button" || name === "Secondary Button" ? "neutral" : "accent"}>{name.replace(" Button", "")}</PrimaryButton>
  }
  if (name === "Studio Dropdown Family") {
    const options = ["OPTION 1", "OPTION 2", "OPTION 3"].map((option) => ({ value: option, label: option }));
    const filterOptions = ["VIDEOS", "SHORTS", "LIVE", "PLAYLISTS"].map((option) => ({ value: option, label: option }));
    const privacyOptions = ["PUBLIC", "UNLISTED", "PRIVATE"].map((option) => ({ value: option, label: option }));
    return (
      <div className="vt-catalog-dropdown-family" role="group" aria-label="Dropdown and menu primitive family">
        <div className="vt-catalog-family-variant"><span>SIMPLE</span><StudioDropdown sizeVariant="standard" value={menuChoice} options={options} onChange={setMenuChoice} ariaLabel="Standard dropdown" placeholder="CHOOSE" /></div>
        <div className="vt-catalog-family-variant"><span>SPLIT LEFT</span><StudioSplitLeftDropdown sizeVariant="standard" value={menuChoice} options={options} onChange={setMenuChoice} ariaLabel="Split-left dropdown" placeholder="CHOOSE" /></div>
        <div className="vt-catalog-family-variant"><span>SPLIT MENU</span><SubToolboxSplitDropdown level={level} value={menuChoice} options={options.map((option) => ({ ...option, icon: <Menu /> }))} onChange={setMenuChoice} icon={<Menu />} chevron={<ChevronDown />} ariaLabel="Split menu" /></div>
        <div className="vt-catalog-family-variant"><span>TITLE LABEL</span><SubToolboxTopTitleDropdown level={level} label="PRIVACY" value={privacyChoice} options={privacyOptions} onValueChange={setPrivacyChoice} ariaLabel="Publishing dropdown" /></div>
        <div className="vt-catalog-family-variant"><span>MULTI-SELECT</span><StudioLegendMultiDropdown level={level} label="MULTI SELECT" options={filterOptions} value={legendFilters} onChange={setLegendFilters} sizeVariant="standard" placeholder="ANY" clearLabel="CLEAR ALL" /></div>
        <div className="vt-catalog-family-variant"><span>SELECT MENU</span><SubToolboxMenu level={level} variant="select" value={menuChoice} options={options} onValueChange={setMenuChoice} triggerLabel={menuChoice} ariaLabel="Select menu" /></div>
        <div className="vt-catalog-family-variant"><span>CONTEXT MENU</span><SubToolboxMenu level={level} variant="context" value={menuChoice} options={options} onValueChange={setMenuChoice} triggerLabel="MORE" ariaLabel="Context menu" /></div>
        <div className="vt-catalog-family-variant"><span>TONE / STYLE</span><SubToolboxDropdownControl label="TONE / TENSION / STYLE" value={toneChoice} options={["TONE", "TENSION", "CINEMATIC"]} onChange={setToneChoice} tone="pink" className="w-full" /></div>
        <details className="vt-catalog-variants"><summary>VARIANTS</summary><p>Simple, split-left, split menu, title-label, multi-select, select, context, and tone/style variants belong together. All specimens use their production primitives.</p></details>
      </div>
    )
  }
  if (name === "Split Left Button") {
    return (
      <div className="vt-catalog-split-button-family">
        <StudioSplitLeftButton sizeVariant="standard" icon={<ChevronLeft />} aria-label="Split left button">LEFT</StudioSplitLeftButton>
        <StudioSplitRightButton sizeVariant="standard" icon={<ChevronRight />} aria-label="Split right button">RIGHT</StudioSplitRightButton>
        <StudioDoubleSplitButton sizeVariant="standard" leftIcon={<ChevronLeft />} rightIcon={<ChevronRight />} aria-label="Double split button">DOUBLE</StudioDoubleSplitButton>
        <StudioTwoLineButton sizeVariant="standard" firstLine="PRIMARY" secondLine="SECOND LINE" aria-label="Two-line button" />
        <StudioSplitTwoLineButton sizeVariant="standard" icon={<ChevronLeft />} firstLine="PRIMARY" secondLine="SECOND LINE" aria-label="Two-line split button" />
        <StudioSplitLeftButton sizeVariant="standard" icon={<ChevronLeft />} aria-label="Disabled split button" disabled>DISABLED</StudioSplitLeftButton>
        <details className="vt-catalog-variants"><summary>VARIANTS</summary><p>Split-left, split-right, double-split, two-line, and two-line split stay together in this family. The representative size is standard.</p></details>
      </div>
    )
  }
  if (name === "Studio Counter Family") {
    return (
      <div className="vt-catalog-counter-family" role="group" aria-label="Counter primitive family">
        <div className="vt-catalog-family-variant"><span>SIDE COUNTER</span><StudioSideCounter size="standard" value={sliderValue} onValueChange={setSliderValue} ariaLabel="Side counter" /></div>
        <div className="vt-catalog-family-variant"><span>DOUBLE-SIDE</span><StudioCounter size="standard" value={sliderValue} onValueChange={setSliderValue} ariaLabel="Double-side counter" /></div>
        <div className="vt-catalog-family-variant"><span>LEFT COUNTER</span><StudioLeftCounter size="standard" value={sliderValue} onValueChange={setSliderValue} ariaLabel="Left counter" /></div>
        <div className="vt-catalog-family-variant"><span>WORD COUNTER</span><StudioLeftWordCounter size="standard" value={wordCounterValue} onValueChange={setWordCounterValue} ariaLabel="Word counter" /></div>
        <details className="vt-catalog-variants"><summary>VARIANTS</summary><p>Side, double-side, left-rail, and word-option counters share the standard counter family. Numeric counter rails use secondary fill; the word counter defaults to primary fill with black text. Background alternatives belong here rather than as duplicate representatives.</p></details>
      </div>
    )
  }
  if (name === "Studio Slider Family") {
    return (
      <div className="vt-catalog-slider-family" role="group" aria-label="Slider primitive family">
        <div className="vt-catalog-family-variant"><span>VALUE SLIDER</span><SubToolboxSlider level={level} value={sliderValue} onValueChange={setSliderValue} railIcon={<span>S</span>} onReset={() => setSliderValue(62)} /></div>
        <div className="vt-catalog-family-variant"><span>RANGE SLIDER</span><SubToolboxRangeSlider level={level} low={rangeLow} high={rangeHigh} onLowChange={setRangeLow} onHighChange={setRangeHigh} railIcon={<SlidersHorizontal />} onReset={() => { setRangeLow(22); setRangeHigh(76) }} /></div>
        <div className="vt-catalog-family-variant"><span>DOUBLE-SPLIT</span><StudioDoubleSplitSlider size="standard" value={sliderValue} onValueChange={setSliderValue} ariaLabel="Double split slider" /></div>
        <div className="vt-catalog-family-variant"><span>WORD VALUE</span><StudioLeftWordSlider size="standard" value={sliderValue} onValueChange={setSliderValue} ariaLabel="Word slider" /></div>
        <details className="vt-catalog-variants"><summary>VARIANTS</summary><p>Single-value, range, double-split, and word-value sliders live in one family. Active center fill is primary; split sections and rails are secondary.</p></details>
      </div>
    )
  }
  if (name === "Square Icon Button") {
    return <SubToolboxIconButton level={level} icon={<Settings2 />} ariaLabel="Settings" />
  }
  if (name === "Studio Text Input") {
    return <StudioTextInput sizeVariant="standard" aria-label="Canonical Studio text input" placeholder="TYPE HERE" data-vt-library-component="StudioTextInput" />
  }
  if (name === "Studio Text Area") {
    return <StudioTextArea sizeVariant="standard" aria-label="Canonical Studio text area" placeholder="TYPE DESCRIPTION" data-vt-library-component="StudioTextArea" />
  }
  if (name === "Text Input") {
    return <StudioInput sizeVariant={level === "l2" ? "compact" : "standard"} defaultValue="TEXT INPUT" aria-label="Text input primitive" />
  }
  if (name === "Textarea") {
    return <StudioTextArea sizeVariant={level === "l2" ? "compact" : "standard"} defaultValue="DESCRIPTION" aria-label="Textarea primitive" />
  }
  if (name === "Stepper") {
    return <StudioSideCounter size={level === "l2" ? "compact" : "standard"} value={stepperValue} onValueChange={setStepperValue} ariaLabel="Demo value" />
  }
  if (name === "Studio Left Word Counter") {
    return (
      <div className="vt-catalog-word-counter-family">
        <StudioLeftWordCounter size="standard" value={wordCounterValue} onValueChange={setWordCounterValue} ariaLabel="Word counter" />
        <details className="vt-catalog-variants">
          <summary>VARIANTS</summary>
          <p>Secondary value fill: add the <code>is-reversed</code> class. The representative above stays primary-filled with black text.</p>
        </details>
      </div>
    )
  }
  if (name === "Toggle") {
    return <SubToolboxToggleSwitch level={level} pressed={toggleOn} aria-label="Toggle" onClick={() => setToggleOn((value) => !value)} />
  }
  if (name === "Vertical Word Toggle") {
    return <SubToolboxSegmentedToggle className="vt-catalog-vertical-word-toggle" level={level} options={[{ value: "show", label: "SHOW" }, { value: "hide", label: "HIDE" }]} value={toggleOn ? "show" : "hide"} onValueChange={(value) => setToggleOn(value === "show")} ariaLabel="Vertical word toggle" />
  }
  if (name === "Checkbox") {
    return <SubToolboxCheckControl level={level} checked={checkboxOn} aria-label="Checkbox" onClick={() => setCheckboxOn((value) => !value)} />
  }
  if (name === "Radio") {
    return <SubToolboxRadioControl level={level} checked={radioOn} aria-label="Radio" onClick={() => setRadioOn((value) => !value)} />
  }
  if (name === "Segmented Choice") {
    return <SubToolboxSegmentedToggle level={level} style={{ ["--vt-segment-count" as string]: 3 } as React.CSSProperties} options={[{ value: "A", label: "A" }, { value: "B", label: "B" }, { value: "C", label: "C" }]} value={segmentChoice} onValueChange={setSegmentChoice} />
  }
  if (name === "Tag") {
    return <SubToolboxTag level={level}>NAPOLEON</SubToolboxTag>
  }
  if (name === "Badge") {
    return <SubToolboxBadge level={level}>BADGE</SubToolboxBadge>
  }
  if (name === "Status Badge") {
    return (
      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 6, minWidth: 0 }}>
        <SubToolboxStatusBadge level={level} variant="outlined" tone="blue" dense>STATUS: NEVER</SubToolboxStatusBadge>
        <SubToolboxStatusBadge level={level} variant="outlined" tone="cyan" dense>RESULT: 0 RECORDS</SubToolboxStatusBadge>
        <SubToolboxStatusBadge level={level} variant="outlined" tone="green" dense>OPTIONS: METADATA</SubToolboxStatusBadge>
      </div>
    )
  }
  if (name === "Split Left Button" || name === "Head Tail Action") {
    return <StudioSplitLeftButton heightVariant={level === "l2" ? "28" : "44"} tone={name === "Head Tail Action" ? "neutral" : "accent"} icon={name === "Head Tail Action" ? <ChevronRight /> : <Settings2 />}>{name === "Head Tail Action" ? "Action" : "Settings"}</StudioSplitLeftButton>
  }
  if (name === "Split Menu") {
    return <SubToolboxSplitDropdown
      level={level}
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
    return <SubToolboxMenu level={level} variant={name === "Context Menu" ? "context" : name === "Select Menu" ? "select" : "dropdown"} value={menuChoice} options={["OPTION 1","OPTION 2","OPTION 3"].map((option) => ({ value: option, label: option }))} onValueChange={setMenuChoice} triggerLabel={name === "Dropdown" ? "MENU" : menuChoice} triggerIcon={<MoreHorizontal />} chevronIcon={<ChevronDown />} ariaLabel={name} />
  }
  if (name === "Tone / Tension / Cinematic Dropdown") {
    return <SubToolboxDropdownControl
      label="TONE / TENSION / STYLE"
      value={toneChoice}
      options={["TONE", "TENSION", "CINEMATIC"]}
      onChange={setToneChoice}
      tone="pink"
      className="w-full"
    />
  }
  if (name === "Nested Square Choice") {
    return <SubToolboxNestedSquareChoice
      level={level}
      ariaLabel="Refinement target"
      value={nestedChoice}
      onChange={setNestedChoice}
      options={[
        { value: "HOOK", label: "Hook", description: "Opening / first seconds" },
        { value: "PROOF", label: "Proof", description: "Evidence / detail" },
        { value: "CTA", label: "CTA", description: "Next action" },
      ]}
    />
  }
  if (name === "Tag-Adjacent Split Action Row") {
    return <SubToolboxTagActionRow
      level={level}
      tags={editorTags}
      onTagsChange={setEditorTags}
      actionStatus={tagActionStatus}
      onAction={(action) => setTagActionStatus(`${action.toUpperCase()} ACTION SELECTED`)}
    />
  }
  if (name === "Multi-Section Script Bar") {
    return <SubToolboxScriptBar
      level={level}
      aria-label="Example script section timeline"
      segments={[
        { id: "hook", label: "HOOK", minutes: 0.5, words: 65, durationLabel: "0:30", color: "var(--pair-a)" },
        { id: "proof", label: "PROOF", minutes: 1.2, words: 160, durationLabel: "1:12", color: "var(--pair-b)" },
        { id: "story", label: "STORY", minutes: 1.8, words: 240, durationLabel: "1:48", color: "#CCFF00" },
        { id: "cta", label: "CTA", minutes: 0.5, words: 60, durationLabel: "0:30", color: "#FF77D6" },
      ]}
    />
  }
  if (name === "Ranked Metadata Tag") {
    return <div className="flex flex-wrap items-center gap-1">
      <TagRankTag tag="NAPOLEON" analysis={{ tag: "NAPOLEON", score: 92, searchVolume: 18400, competition: 4100, rank: 4, tripleKeyword: false }} componentLevel={level === "l0" ? "l1" : level} />
      <TagRankTag tag="CAMPAIGN" analysis={{ tag: "CAMPAIGN", score: 74, searchVolume: 8200, competition: 3900, rank: 18, tripleKeyword: true }} componentLevel={level === "l0" ? "l1" : level} />
    </div>
  }
  if (name === "Education Timestamp Notes") {
    return <EducationTimestampNotes embedded value={educationNotes} onChange={setEducationNotes} />
  }
  if (name === "Top Title Dropdown") {
    return <SubToolboxTopTitleDropdown
      level={level}
      label="PRIVACY"
      value={menuChoice}
      options={["PUBLIC","UNLISTED","PRIVATE"].map((option) => ({ value: option, label: option }))}
      onValueChange={setMenuChoice}
      ariaLabel="Publishing control dropdown"
     
    />
  }
  if (name === "Legend Multi Dropdown") {
    const options = ["VIDEOS", "SHORTS", "LIVE", "PLAYLISTS", "PODCASTS", "MUSIC"].map((option) => ({ value: option, label: option }))
    return <StudioLegendMultiDropdown
      level={level}
      label="FILTERS"
      options={options}
      value={legendFilters}
      onChange={setLegendFilters}
      sizeVariant={level === "l0" ? "standard" : "compact"}
      placeholder="ANY"
      clearLabel="CLEAR ALL"
    />
  }
  if (name === "Split Search") {
    return <div className="flex min-w-0 items-center gap-1"><StudioTextInput sizeVariant={level === "l2" ? "compact" : "standard"} aria-label="Search" placeholder="SEARCH" value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} /><StudioSquareIconButton sizeVariant={level === "l2" ? "compact" : "standard"} icon={<X aria-hidden="true" />} label="Clear search" onClick={() => setSearchQuery("")} /></div>
  }
  if (name === "20 Plain Input") return <StudioInput sizeVariant="standard" defaultValue="TEXT INPUT" />
  if (name === "21 Plain Text Area") return <StudioTextArea sizeVariant="compact" defaultValue="TEXT AREA" />
  if (name === "137 Floating Label Input") return <StudioTextInput variant="floating-label" sizeVariant="standard" label="TITLE" aria-label="Title" />
  if (name === "138 Floating Label Text Area") return <StudioTextArea variant="floating-label" sizeVariant="compact" label="DESCRIPTION" aria-label="Description" />
  if (name === "Number Field") {
    return <StudioNumberInput sizeVariant={level === "l2" ? "compact" : "standard"} defaultValue={25} aria-label="Number field primitive" />
  }
  if (name === "Input Action") {
    return <SubToolboxSplitField level={level} variant="action" actionIcon={<Plus />} actionLabel="Add item" onAction={() => setActionDraft("")} inputProps={{ "aria-label": "Add item", placeholder: "ADD ITEM", value: actionDraft, onChange: (event) => setActionDraft(event.target.value) }} />
  }
  if (name === "Slider") {
    return <SubToolboxSlider level={level} value={sliderValue} onValueChange={setSliderValue} railIcon={<span>S</span>} onReset={() => setSliderValue(62)} />
  }
  if (name === "Range Slider") {
    return <SubToolboxRangeSlider level={level} low={rangeLow} high={rangeHigh} onLowChange={setRangeLow} onHighChange={setRangeHigh} railIcon={<SlidersHorizontal />} onReset={() => { setRangeLow(22); setRangeHigh(76) }} />
  }
  if (name === "Settings Switch") {
    return <SubToolboxSettingsSwitch level={level} pressed={settingsOn} aria-label="Settings switch" onClick={() => setSettingsOn((value) => !value)} />
  }
  if (name === "Button Group") {
    return <SubToolboxButtonGroup level={level} items={[{ value: "ONE", label: "ONE" }, { value: "TWO", label: "TWO" }]} value={groupChoice} onValueChange={setGroupChoice} />
  }
  if (name === "Removable Tag") {
    return <SubToolboxRemovableTag level={level} removeIcon={<X />}>NAPOLEON</SubToolboxRemovableTag>
  }
  if (name === "Selectable Tag") {
    return <SubToolboxSelectableTag level={level} selected={selectableTagOn} selectedIcon={<Check />} unselectedIcon={<Plus />} onClick={() => setSelectableTagOn((value) => !value)}>{selectableTagOn ? "SELECTED" : "SELECT"}</SubToolboxSelectableTag>
  }
  if (name === "Tag Editor") {
    return <SubToolboxTagEditor level={level} label="TAGS" tags={editorTags} onTagsChange={setEditorTags} spectrum tagLevel={level} addIcon={<Plus />} saveIcon={<Check />} removeIcon={<X />} />
  }
  if (name === "Progress Bar") {
    return <SubToolboxProgressBar level={level} value={68} />
  }
  if (name === "Progress Value") {
    return <SubToolboxProgressValue level={level} value={68} label="SYNC" />
  }
  if (name === "KPI") {
    return <SubToolboxKpiCard level={level} label="VIEWS" value="12.4K" />
  }
  if (name === "Stat Card") {
    return <SubToolboxStatCard level={level} label="WATCH TIME" value="4,820H" delta="+12.4%" />
  }
  if (name === "Tooltip") {
    return <SubToolboxTooltip level={level} content="TOOLTIP" />
  }
  if (name === "Tooltip Visual Key") {
    return (
      <SubToolboxLegendTooltip
        level={level}
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
    return <SubToolboxKnob level={level} value={knobValue} onValueChange={setKnobValue} label="VALUE" />
  }
  if (name === "Alphabetical Spectrum Tags") {
    return <SubToolboxAlphabeticalSpectrumTags level={level} />
  }
  if (name === "Field Label") {
    return <SubToolboxFieldLabel level={level}>VIDEO TITLE</SubToolboxFieldLabel>
  }
  if (name === "Surface") {
    return <SubToolboxSurface level={level} tone="accent"><strong>SURFACE</strong></SubToolboxSurface>
  }
  if (name === "State Panel") {
    return <SubToolboxStatePanel level={level} state="ready" message="Ready to generate." />
  }
  if (name === "Output Card") {
    return <SubToolboxOutputCard level={level} title="DESCRIPTION" badge="READY">Reusable generated output.</SubToolboxOutputCard>
  }
  if (name === "Metric") {
    return <SubToolboxMetric level={level} label="VIEWS" value="12.4K" />
  }
  if (name === "Link Button") {
    return <SubToolboxLinkButton level={level} href="#toolbox-ui-library-primitive" icon={<ChevronRight />}>OPEN</SubToolboxLinkButton>
  }
  if (name === "Data Table") {
    const rows = [{ metric: "Views", value: "12.4K" }, { metric: "CTR", value: "5.8%" }]
    return <SubToolboxDataTable level={level} columns={[{ key: "metric", label: "METRIC" }, { key: "value", label: "VALUE", align: "right" }]} rows={rows} />
  }
  if (name === "Color Picker") {
    return <SubToolboxColorPicker level={level} value={colorValue} onValueChange={setColorValue} label="ACCENT" />
  }
  if (name === "Media Card") {
    return <SubToolboxMediaCard level={level} title="AUSTERLITZ" meta="16:9 · READY" preview={<div style={{ width: "100%", height: "100%", background: "var(--pair-a)" }} />} selected={mediaSelected} onClick={() => setMediaSelected((value) => !value)} />
  }
  if (name === "Selectable List Row") {
    return <SubToolboxSelectableListRow level={level} title="DRAFT 01" detail="UPDATED NOW" leading={<span>01</span>} trailing={<ChevronRight />} selected={rowSelected} onClick={() => setRowSelected((value) => !value)} />
  }
  if (name === "Reorderable Row") {
    const first = reorderItems[0] ?? "HOOK"
    return <SubToolboxReorderRow level={level} title={first} detail="SECTION 01" disableUp onMoveDown={() => setReorderItems((items) => items.length > 1 ? [items[1], items[0], ...items.slice(2)] : items)} onRemove={() => setReorderItems((items) => items.slice(1))} />
  }
  if (name === "Tabs") {
    return <SubToolboxTabs level={level} style={{ ["--vt-tab-count" as string]: 3 } as React.CSSProperties} items={[{ value: "A", label: "EDIT" }, { value: "B", label: "PREVIEW" }, { value: "C", label: "DATA" }]} value={tabValue} onValueChange={setTabValue} />
  }
  if (name === "Alert") {
    return <SubToolboxAlert level={level} tone="success" icon={<Check />} title="READY" detail="Primitive connected" />
  }
  if (name === "Step Indicator") {
    return <SubToolboxStepIndicator level={level} style={{ ["--vt-step-count" as string]: 3 } as React.CSSProperties} steps={[{ label: "SCRIPT", state: "complete" }, { label: "VISUALS", state: "active" }, { label: "EXPORT", state: "upcoming" }]} />
  }
  if (name === "Dialog") {
    return <SubToolboxDialog level={level} open={dialogOpen} onOpenChange={setDialogOpen} title="CONFIRM">Dialog content uses the same level DNA.</SubToolboxDialog>
  }
  if (name === "Drawer") {
    return <SubToolboxDrawer level={level} open={drawerOpen} onOpenChange={setDrawerOpen} title="DETAILS">Drawer content.</SubToolboxDrawer>
  }
  if (name === "Calendar") {
    return <SubToolboxCalendar level={level} selectedDay={selectedDay} onSelectDay={setSelectedDay} />
  }
  if (name === "Full-Width Section Band") {
    return <div className="grid gap-2"><SubToolboxSectionBand level={level} tone="primary" label="LEAD" /><SubToolboxSectionBand level={level} tone="secondary" label="PROPOSAL" /><SubToolboxSectionBand level={level} tone="tertiary" label="ACTIVE / PAID" /></div>
  }
  if (name === "Text + Badge Data Grid") {
    return <SubToolboxTextBadgeGrid level={level} columns={[{key:"segment",label:"SEGMENT"},{key:"signal",label:"SIGNAL"},{key:"action",label:"BEST ACTION"},{key:"activity",label:"LAST ACTIVITY"},{key:"status",label:"STATUS"}]} rows={[
      {segment:"History superfans",signal:"3+ longform comments",action:"Invite to topic poll",activity:"2 days ago",status:<span className="vt-workflow-badge is-success">ACTIVE</span>},
      {segment:"Shorts-only viewers",signal:"No longform click",action:"Pinned-video funnel",activity:"Today",status:<span className="vt-workflow-badge is-warning">OPPORTUNITY</span>},
      {segment:"Members",signal:"High retention",action:"Early-access post",activity:"Yesterday",status:<span className="vt-workflow-badge is-info">PRIORITY</span>},
    ]} />
  }
  if (name === "Interactive Checklist Progress") {
    return <SubToolboxInteractiveChecklistProgress level={level} items={[
      {id:"a",title:"Revise weak thumbnail",detail:"CTR fell below baseline.",badge:"HIGH",badgeTone:"danger"},
      {id:"b",title:"Reply to questions",detail:"Three include video ideas.",badge:"MEDIUM",badgeTone:"warning",checked:true},
      {id:"c",title:"Finish script section",detail:"Project is 74% complete.",badge:"TODAY",badgeTone:"info",checked:true},
      {id:"d",title:"Approve sponsor deliverables",detail:"Deadline tomorrow.",badge:"URGENT",badgeTone:"danger",checked:true},
    ]} />
  }
  if (name === "Production Planner Grid") {
    return <SubToolboxProductionPlannerGrid level={level} days={[
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
    return <SubToolboxLoader level={level} variant="spinner" label="LOADING" />
  }
  if (name === "Loader Progress") {
    return <SubToolboxLoader level={level} variant="progress" label="LOADING" />
  }
  if (name === "Loader Split") {
    return <SubToolboxLoader level={level} variant="split" label="LOADING" />
  }
  if (name === "Loader Orbit") {
    return <SubToolboxLoader level={level} variant="orbit" label="LOADING" />
  }
  if (name === "Loader Bars") {
    return <SubToolboxLoader level={level} variant="bars" label="LOADING" />
  }
  if (name === "Skeleton") {
    return <SubToolboxSkeleton level={level} lines={3} />
  }
  if (name === "Skeleton Compact") {
    return <SubToolboxSkeleton level={level} variant="compact" />
  }
  if (name === "Skeleton Media") {
    return <SubToolboxSkeleton level={level} variant="media" ratio="16:9" />
  }
  if (name === "Toast") {
    return toastVisible
      ? <SubToolboxToast level={level} tone="success" title="SAVED" detail="Changes are ready." onDismiss={() => setToastVisible(false)} />
      : <PrimaryButton level={level} onClick={() => setToastVisible(true)}>SHOW TOAST</PrimaryButton>
  }
  if (name === "Popover") {
    return <SubToolboxPopover level={level} trigger="OPTIONS" title="OPTIONS"><strong>Popover content</strong></SubToolboxPopover>
  }
  if (name === "Disclosure") {
    return <SubToolboxDisclosure level={level} title="ADVANCED" icon={<Plus />}>Disclosure content.</SubToolboxDisclosure>
  }
  if (name === "Divider") {
    return <SubToolboxDivider level={level} />
  }
  if (name === "Pagination") {
    return <SubToolboxPagination level={level} page={page} pages={3} onPageChange={setPage} />
  }
  if (name === "Controller Switch") {
    return <SubToolboxControllerSwitch level={level} pressed={controllerOn} onClick={() => setControllerOn((value) => !value)} />
  }
  if (name === "LED Light") {
    return <SubToolboxLed level={level} active label="ACTIVE" />
  }
  if (name === "LED Dot") {
    return <SubToolboxLedDot level={level} active label="Active status light" />
  }
  if (name === "Icon Rail Control") {
    return <SubToolboxIconRailControl level={level} icon={<SlidersHorizontal />} label="CONTROL" />
  }
  if (name === "Hover Card") {
    return <SubToolboxHoverCard level={level} trigger="HOVER" content={<><strong>DETAILS</strong><div>Reusable hover information.</div></>} />
  }
  if (name === "Meter") {
    return <SubToolboxMeter level={level} value={73} label="QUALITY" />
  }
  if (name === "Avatar") {
    return <SubToolboxAvatar level={level} name="VIEW TUBE" meta="CREATOR" />
  }
  if (name === "Name Value List") {
    return <SubToolboxNameValueList level={level} items={[{ name: "Views", value: "12.4K" }, { name: "CTR", value: "5.8%" }]} />
  }
  if (name === "Breadcrumb") {
    return <SubToolboxBreadcrumb level={level} items={[{ label: "Studio" }, { label: "Video" }, { label: "Package" }]} />
  }
  if (name === "Carousel") {
    return <SubToolboxCarousel level={level} index={carouselIndex} onIndexChange={setCarouselIndex} items={["FRAME 01","FRAME 02","FRAME 03"].map((item) => <span key={item}>{item}</span>)} />
  }
  if (name === "Command Palette") {
    return <SubToolboxCommandPalette level={level} items={[{ id: "script", label: "SCRIPT ARCHITECT", keywords: "write outline" }, { id: "thumb", label: "THUMBNAIL STUDIO", keywords: "image packaging" }, { id: "publish", label: "VIDEO PUBLISHER", keywords: "upload metadata" }]} />
  }


  if (name === "Metric Strip") {
    return <SubToolboxMetricStrip level={level} items={[{ label: "VIEWS", value: "12K" }, { label: "CTR", value: "5.8%" }, { label: "AVP", value: "72%" }]} />
  }
  if (name === "Horizontal Scrollbar") {
    return <SubToolboxScrollbar level={level} orientation="horizontal" value={scrollPos} onValueChange={setScrollPos} />
  }
  if (name === "Vertical Scrollbar") {
    return <SubToolboxScrollbar level={level} orientation="vertical" value={scrollPos} onValueChange={setScrollPos} />
  }
  if (name === "Data Stats Module") {
    return <SubToolboxDataStats level={level} label="TOTAL VIEWS" value="128,442" delta="+12.4%" variant="standard" />
  }
  if (name === "Upload Frame") {
    return <StudioUploadFrame sizeVariant={level === "l2" ? "compact" : "standard"} accept="image/*,video/*" aria-label="Studio Hub upload frame example" />
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
        level={level}
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
        paletteIndex={7}
        onSelectedChange={setVaultSelected}
        onTitleChange={setVaultTitle}
        onTagsChange={setVaultTags}
      />
    )
  }
  if (name === "Tree View") {
    return <SubToolboxTree
      level={level}
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
    return <SubToolboxMediaControlButton level={level} icon={<Volume2 />} label="Media control" />
  }
  if (name === "Media Play Toggle") {
    return <SubToolboxMediaPlayToggle level={level} playing={mediaPlaying} onClick={() => setMediaPlaying((value) => !value)} />
  }
  if (name === "Media Seek Bar") {
    return <SubToolboxMediaSeekBar level={level} value={mediaCurrent} duration={90} buffered={58} onValueChange={setMediaCurrent} />
  }
  if (name === "Media Volume Control") {
    return <SubToolboxMediaVolumeControl level={level} value={mediaVolume} muted={mediaMuted} onValueChange={setMediaVolume} onMutedChange={setMediaMuted} />
  }
  if (name === "Media Timecode") {
    return <SubToolboxMediaTimecode level={level} current={mediaCurrent} duration={90} />
  }
  if (name === "Media Duration Badge") {
    return <SubToolboxMediaDurationBadge level={level} seconds={90} />
  }
  if (name === "Media Caption Toggle") {
    return <SubToolboxMediaCaptionToggle level={level} enabled={mediaCaptions} onClick={() => setMediaCaptions((value) => !value)} />
  }
  if (name === "Media Speed Control") {
    return <SubToolboxMediaSpeedControl level={level} value={mediaSpeed} onValueChange={setMediaSpeed} />
  }
  if (name === "Media Poster Frame") {
    return <SubToolboxMediaPoster level={level} ratio="16:9" overlay={<SubToolboxMediaDurationBadge level={level} seconds={90} />}><Play /></SubToolboxMediaPoster>
  }
  if (name === "Media Status") {
    return <SubToolboxMediaStatus level={level} status={mediaPlaying ? "playing" : "ready"} />
  }
  if (name === "Media Transport Bar") {
    return <SubToolboxMediaTransportBar
      level={level}
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
      level={level}
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
      level={level}
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
      level={level}
      title="AUSTERLITZ MASTER"
      duration={90}
      status="ready"
      items={[
        { label: "FORMAT", value: "16:9" },
        { label: "RESOLUTION", value: "1920×1080" },
        { label: "FPS", value: "30" },
      ]}
      actions={<SubToolboxMediaControlButton level={level} icon={<Expand />} label="Open media" />}
    />
  }
  if (name === "Media Review Panel") {
    return <SubToolboxMediaReviewPanel
      level={level}
      title="MEDIA REVIEW"
      status={<SubToolboxMediaStatus level={level} status="ready" />}
      player={<SubToolboxMediaPlayer
        level={level}
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
      actions={<><SubToolboxMediaControlButton level={level} icon={<Check />} label="Approve" active /><SubToolboxMediaControlButton level={level} icon={<Settings2 />} label="Review settings" /></>}
    />
  }
  if (name === "Labeled Input") {
    return <StudioTextInput variant="floating-label" level={level} sizeVariant="standard" label="TITLE" aria-label="Title" autoComplete="off" />
  }
  if (name === "Labeled Textarea") {
    return <StudioTextArea variant="floating-label" level={level} sizeVariant="standard" label="DESCRIPTION" defaultValue="A long-form video description demonstrates the raised label while preserving the larger writing area." aria-label="Description" />
  }
  if (name === "Video Selector") {
    return <SubToolboxVideoSelector
      level={level}
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
      actions={<><PrimaryButton level="l2">Upload</PrimaryButton><PrimaryButton level="l2">Generate</PrimaryButton></>}
    >
      <SubToolboxAspectRatioFrame level={level} ratio="16:9"><Image /></SubToolboxAspectRatioFrame>
    </MiniSubToolbox>
  }
  if (name === "Disabled Button") {
    return <PrimaryButton level={level} disabled>DISABLED</PrimaryButton>
  }
  if (name === "Disabled Split Button") {
    return <StudioSplitLeftButton heightVariant={level === "l2" ? "28" : "44"} icon={<Settings2 />} disabled>DISABLED</StudioSplitLeftButton>
  }
  if (name === "Two Color Data Stats") {
    return <SubToolboxDataStats level={level} label="VIEWS" value="128K" delta="+12%" variant="two-color" />
  }
  if (name === "Monochrome Data Stats") {
    return <SubToolboxDataStats level={level} label="WATCH TIME" value="4.8K" delta="+8%" variant="monochrome" />
  }
  if (name === "Tiny Data Stats") {
    return <SubToolboxDataStats level={level} label="CTR" value="5.8%" variant="tiny" />
  }
  if (name === "Tooltip Dark") {
    return <SubToolboxTooltip level={level} variant="dark" content="TOOLTIP" />
  }
  if (name === "Tooltip Color") {
    return <SubToolboxTooltip level={level} variant="color" content="TOOLTIP" />
  }
  if (name === "Dashboard Pill Tags") {
    return <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}><SubToolboxTag level={level} variant="dashboard-pill">READY</SubToolboxTag><SubToolboxTag level={level} variant="dashboard-pill">VIDEO</SubToolboxTag></div>
  }
  if (name === "Aspect Ratio Frame") {
    return <SubToolboxAspectRatioFrame level={level} ratio="16:9" label="16:9"><Image /></SubToolboxAspectRatioFrame>
  }
  if (name === "Toolbar") {
    return <SubToolboxToolbar level={level} leading={<strong>TOOLS</strong>} trailing={<SubToolboxIconButton level={level} icon={<Settings2 />} ariaLabel="Toolbar settings" />}><PrimaryButton level={level}>EDIT</PrimaryButton><PrimaryButton level={level}>SAVE</PrimaryButton></SubToolboxToolbar>
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


  if (name === "Loader Family") {
    return (
      <div className="vt-catalog-family-variants" role="group" aria-label="Loader variants">
        <div className="vt-catalog-family-variant"><span>SPINNER</span><SubToolboxLoader level={level} variant="spinner" label="LOADING" /></div>
        <div className="vt-catalog-family-variant"><span>PROGRESS</span><SubToolboxLoader level={level} variant="progress" label="LOADING" /></div>
        <div className="vt-catalog-family-variant"><span>SPLIT</span><SubToolboxLoader level={level} variant="split" label="LOADING" /></div>
        <div className="vt-catalog-family-variant"><span>ORBIT</span><SubToolboxLoader level={level} variant="orbit" label="LOADING" /></div>
        <div className="vt-catalog-family-variant"><span>BARS</span><SubToolboxLoader level={level} variant="bars" label="LOADING" /></div>
      </div>
    )
  }
  if (name === "Tooltip Family") {
    return (
      <div className="vt-catalog-family-variants" role="group" aria-label="Tooltip variants">
        <div className="vt-catalog-family-variant"><span>STANDARD</span><SubToolboxTooltip level={level} content="TOOLTIP" /></div>
        <div className="vt-catalog-family-variant"><span>DARK</span><SubToolboxTooltip level={level} variant="dark" content="TOOLTIP" /></div>
        <div className="vt-catalog-family-variant"><span>COLOR</span><SubToolboxTooltip level={level} variant="color" content="TOOLTIP" /></div>
        <div className="vt-catalog-family-variant"><span>VISUAL KEY</span><SubToolboxLegendTooltip level={level} title="VISUAL KEY" triggerLabel="KEY" items={[{ label: "READY", detail: "Complete and available", color: "#3FEE56", icon: <Check /> }, { label: "IN REVIEW", detail: "Needs creator attention", color: "#FFDA47", icon: <Lightbulb /> }, { label: "MEDIA", detail: "Visual or asset reference", color: "#36E0F6", icon: <Image /> }]} /></div>
      </div>
    )
  }
  if (name === "Skeleton Family") {
    return (
      <div className="vt-catalog-family-variants" role="group" aria-label="Skeleton loading variants">
        <div className="vt-catalog-family-variant"><span>LINES</span><SubToolboxSkeleton level={level} lines={3} /></div>
        <div className="vt-catalog-family-variant"><span>COMPACT</span><SubToolboxSkeleton level={level} variant="compact" /></div>
        <div className="vt-catalog-family-variant"><span>MEDIA 16:9</span><SubToolboxSkeleton level={level} variant="media" ratio="16:9" /></div>
      </div>
    )
  }
  if (name === "Data Stats Family") {
    return (
      <div className="vt-catalog-family-variants" role="group" aria-label="Data stats variants">
        <div className="vt-catalog-family-variant"><span>STANDARD</span><SubToolboxDataStats level={level} label="TOTAL VIEWS" value="128,442" delta="+12.4%" variant="standard" /></div>
        <div className="vt-catalog-family-variant"><span>TWO COLOR</span><SubToolboxDataStats level={level} label="VIEWS" value="128K" delta="+12%" variant="two-color" /></div>
        <div className="vt-catalog-family-variant"><span>MONOCHROME</span><SubToolboxDataStats level={level} label="WATCH TIME" value="4.8K" delta="+8%" variant="monochrome" /></div>
        <div className="vt-catalog-family-variant"><span>TINY</span><SubToolboxDataStats level={level} label="CTR" value="5.8%" variant="tiny" /></div>
      </div>
    )
  }
  if (name === "Scrollbar Family") {
    return (
      <div className="vt-catalog-family-variants" role="group" aria-label="Scrollbar orientations">
        <div className="vt-catalog-family-variant"><span>HORIZONTAL</span><SubToolboxScrollbar level={level} orientation="horizontal" value={scrollPos} onValueChange={setScrollPos} /></div>
        <div className="vt-catalog-family-variant"><span>VERTICAL</span><SubToolboxScrollbar level={level} orientation="vertical" value={scrollPos} onValueChange={setScrollPos} /></div>
      </div>
    )
  }
  if (name === "LED Family") {
    return (
      <div className="vt-catalog-family-variants" role="group" aria-label="LED indicator variants">
        <div className="vt-catalog-family-variant"><span>STATUS LED</span><SubToolboxLed level={level} active label="ACTIVE" /></div>
        <div className="vt-catalog-family-variant"><span>LED DOT</span><SubToolboxLedDot level={level} active label="Active status light" /></div>
      </div>
    )
  }
  if (name === "Toolbox Header Family") {
    return (
      <div className="vt-catalog-family-variants" role="group" aria-label="Toolbox and SubToolbox header variants">
        <div className="vt-catalog-family-variant"><span>TOOLBOX RAIL</span><div style={{height:80,display:"flex"}}><ToolboxHeaderIconRail level="toolbox" backgroundColor="var(--pair-b)"><Settings2 /></ToolboxHeaderIconRail></div></div>
        <div className="vt-catalog-family-variant"><span>SUBTOOLBOX RAIL</span><div style={{height:56,display:"flex"}}><ToolboxHeaderIconRail level="subtoolbox" backgroundColor="var(--pair-b)"><Settings2 /></ToolboxHeaderIconRail></div></div>
        <div className="vt-catalog-family-variant"><span>TOOLBOX TITLE</span><ToolboxHeaderTitle level="toolbox">VIDEO MANAGER</ToolboxHeaderTitle></div>
        <div className="vt-catalog-family-variant"><span>SUBTOOLBOX TITLE</span><ToolboxHeaderTitle level="subtoolbox">VIDEO DETAILS</ToolboxHeaderTitle></div>
        <div className="vt-catalog-family-variant"><span>TOOLBOX HELP</span><div style={{height:80}}><ToolboxHeaderHelpButton level="toolbox" aria-label="Toolbox help" /></div></div>
        <div className="vt-catalog-family-variant"><span>SUBTOOLBOX HELP</span><div style={{height:56}}><ToolboxHeaderHelpButton level="subtoolbox" aria-label="Subtoolbox help" /></div></div>
        <div className="vt-catalog-family-variant"><span>TOOLBOX COLLAPSE</span><div style={{height:80}}><ToolboxHeaderCollapseButton level="toolbox" open icon={<X />} aria-label="Collapse toolbox" /></div></div>
        <div className="vt-catalog-family-variant"><span>SUBTOOLBOX COLLAPSE</span><div style={{height:56}}><ToolboxHeaderCollapseButton level="subtoolbox" open icon={<X />} aria-label="Collapse subtoolbox" /></div></div>
        <div className="vt-catalog-family-variant"><span>TOOLBOX TOGGLE</span><ToolboxHeaderToggle value={headerMode} onValueChange={setHeaderMode} options={[{value:"A",label:"ON"},{value:"B",label:"OFF"}]} /></div>
        <div className="vt-catalog-family-variant"><span>SUBTOOLBOX TOGGLE</span><ToolboxHeaderToggle level="subtoolbox" value={headerMode} onValueChange={setHeaderMode} options={[{value:"A",label:"A"},{value:"B",label:"B"}]} /></div>
      </div>
    )
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
    data-vt-catalog-track="definitive-component-library"
  >
    <header className="vt-complete-catalog-heading">
      <div>
        <Lightbulb />
        <div>
          <h2 id="studio-hub-primitive-migration-catalog-title">Definitive Component Library</h2>
          <p>Confirmed canonical production primitives only. Each family is shown once at the standard component size; shared tokens define the uniform default style, while compound components retain their intrinsic geometry.</p>
        </div>
      </div>
      <strong>{STUDIO_HUB_MIGRATED_FAMILIES.length} COMPONENT FAMILIES · ONE STANDARD SIZE EACH</strong>
    </header>

    <div className="vt-definitive-token-strip" aria-label="Confirmed default component tokens">
      <span><b>HEIGHT</b> 44px</span>
      <span><b>STROKE</b> 3px</span>
      <span><b>RADIUS</b> 6px</span>
      <span><b>SHADOW</b> FLAT · 0</span>
      <span><b>TYPE</b> Inter · 1000</span>
      <span><b>TEXT</b> Uppercase · −0.02em · 1 line</span>
    </div>

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
              {[STANDARD_LEVEL].map((level) => (
                <DemoShell level={level} geometry={getCatalogPreviewGeometry(name)} key={level}>
                  <PrimitiveMigrationControl name={name} level={level} />
                </DemoShell>
              ))}
            </div>
          </SubToolbox>
        </div>
      ))}
    </div>
  </section>
)

export default StudioHubPrimitiveMigrationCatalog
