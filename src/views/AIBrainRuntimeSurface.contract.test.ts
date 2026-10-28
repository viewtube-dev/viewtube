import { readFileSync } from "node:fs"
import { describe, expect, it } from "vitest"

const source = readFileSync(new URL("./AIBrainCommandInterface.tsx", import.meta.url), "utf8")
const capabilityBrowserSource = readFileSync(new URL("../components/brain/BrainCapabilityBrowser.tsx", import.meta.url), "utf8")
const promptLibrarySource = readFileSync(new URL("../components/brain/BrainPromptLibrary.tsx", import.meta.url), "utf8")
const panelSource = readFileSync(new URL("../components/brain/BrainRuntimePanel.tsx", import.meta.url), "utf8")
const chatPrimitivesSource = readFileSync(new URL("../components/brain/BrainChatPrimitives.tsx", import.meta.url), "utf8")
const chatPrimitivesCssSource = readFileSync(new URL("../components/brain/BrainChatPrimitives.css", import.meta.url), "utf8")
const composerDockSource = readFileSync(new URL("../components/brain/BrainComposerDock.tsx", import.meta.url), "utf8")
const viewportHookSource = readFileSync(new URL("../components/brain/useVisualViewportHeight.ts", import.meta.url), "utf8")
const collapsePrimitiveSource = readFileSync(new URL("../studio-ui/primitives/StudioControls.tsx", import.meta.url), "utf8")
const toolboxSource = readFileSync(new URL("../components/Toolbox.tsx", import.meta.url), "utf8")

describe("AI Brain runtime surface integration", () => {
 it("mounts the canonical backend runtime snapshot above the conversation workspace", () => {
  expect(source).toContain('from "../services/brain/BrainRuntimeSnapshot"')
  expect(source).toContain('from "../components/brain/BrainRuntimePanel"')
  expect(source).toContain("readBrainRuntimeSnapshot")
  expect(source).toContain("runtimeSnapshot")
  expect(source).toContain("<BrainRuntimePanel")
  expect(source).toContain("snapshot={runtimeSnapshot}")
 })

 it("surfaces metadata history and governed learning in the canonical runtime panel", () => {
  expect(panelSource).toContain("metadataIntelligence")
  expect(panelSource).toContain('label="Metadata versions"')
  expect(panelSource).toContain('label="Learning candidates"')
  expect(panelSource).toContain('label="Promoted"')
  expect(panelSource).toContain('data-vt-brain-part="evidence-lineage"')
  expect(panelSource).toContain('data-vt-brain-part="embedded-evidence-lineage"')
  expect(panelSource).toContain('data-vt-brain-part="runtime-details"')
  expect(panelSource).toContain('data-vt-brain-part="runtime-summary"')
 })

 it("lets fillAvailable toolboxes fit their header and keep the remaining viewport scrollable", () => {
  expect(toolboxSource).toContain('overflow-hidden min-h-0 ${fillAvailable ? \'flex-1 flex flex-col\' : \'\'}')
  expect(toolboxSource).toContain('className={`min-h-0 ${fillAvailable ? \'flex-1\' : \'\'} bg-white vt-main-toolbox-content ${finalContentClass}`}')
  expect(toolboxSource).not.toContain('className={`min-h-0 ${fillAvailable ? \'flex-1\' : \'\'} bg-white vt-main-toolbox-content ${fillAvailable ? \'h-full\' : \'\'}')
 })

 it("uses StudioInterModule for chat entries and the registry-backed prompt library", () => {
  const userMessage = source.slice(source.indexOf('export const UserMessage:'), source.indexOf('const CreatorIntakeWizard:'))
  const responseCard = source.slice(source.indexOf('const CreatorResponseCard:'), source.indexOf('const readinessForSnapshot:'))
  const promptLibrary = promptLibrarySource

  expect(source).toContain('from "../components/brain/BrainPromptLibrary"')
  expect(source).toContain('from "../studio-ui"')
  expect(userMessage).toContain("<StudioInterModule")
  expect(responseCard).toContain("<StudioInterModule")
  expect(promptLibrary).toContain('data-vt-brain-component="BrainPromptLibraryModule"')
  expect(promptLibrary).toContain('data-vt-brain-part="prompt-collapsible-module"')
  expect(promptLibrary).not.toContain("<StudioCollapsingSplitModule")
  expect(promptLibrary).toContain('sizeVariant="standard"')
  expect(promptLibrary).toContain("<StudioCollapsingTwoLineModule")
  expect(promptLibrary).toContain("description={summarize(card)}")
  expect(promptLibrary).toContain('data-vt-brain-part="prompt-complete-text"')
  expect(promptLibrary).toContain('onEdit ? "is-pair" : ""')
  expect(promptLibrary).toContain('<StudioSplitTwoLineButton')
  expect(promptLibrary).toContain('firstLine="SEND TO"')
  expect(promptLibrary).toContain('secondLine="CHAT"')
  expect(promptLibrary).toContain('firstLine="EDIT"')
  expect(promptLibrary).toContain('secondLine="FIRST"')
  expect(promptLibrary).toContain("data-prompt-id={card.id}")
  expect(promptLibrary).toContain('firstLine="SEND TO"')
  expect(promptLibrary).toContain('firstLine="EDIT"')
  expect(promptLibrary).toContain("title={card.label}")
  expect(collapsePrimitiveSource).toContain("export const StudioCollapsingTwoLineModule")
  expect(source).toContain("fillAvailable")
  expect(source).toContain('contentClassName="vt-brain-studio-workspace__toolbox-content flex min-h-0 flex-col overflow-hidden bg-[#f3f4f6]')
  expect(source).not.toContain('contentClassName="flex min-h-0 flex-col overflow-hidden bg-[#f3f4f6] max-xl:!h-full')
  expect(promptLibrary).toContain("PROMPT_MODULE_COLOR_PAIRS[promptIndex % PROMPT_MODULE_COLOR_PAIRS.length]")
  expect(source).toContain('className="brain-launcher-mode-switch grid grid-cols-2 gap-1"')
  expect(source).toContain('firstLine="PROMPT" secondLine="LIBRARY" aria-label="Prompt Library"')
  expect(source).toContain('firstLine="CAPABILITIES" secondLine="BROWSER" aria-label="Capabilities"')
  expect(chatPrimitivesCssSource).toContain(".brain-launcher-mode-switch [data-vt-studio-button-line]")
  expect(chatPrimitivesCssSource).toContain(".brain-prompt-library-shell > .vt-studio-inter-module__head .vt-studio-inter-module__title")
  expect(promptLibrary).toContain("order.get(card.id)")
  expect(chatPrimitivesSource).toContain("touch-pan-y")
  expect(source).toContain("max-xl:h-[100dvh]")
  expect(viewportHookSource).toContain("window.visualViewport")
  expect(source).toContain("data-vt-brain-visual-viewport-height")
  expect(viewportHookSource).toMatch(/vv\?\.addEventListener\("resize",\s*sync\)/)
  expect(chatPrimitivesSource).toContain("pb-[max(8px,env(safe-area-inset-bottom))]")
  expect(chatPrimitivesCssSource).toContain("grid-template-columns: minmax(0, 1fr) auto;")
  expect(chatPrimitivesCssSource).toContain("gap: 4px;")
  expect(chatPrimitivesCssSource).toContain("@media (min-width: 640px)")
  expect(source).toContain('max-xl:grid-rows-[minmax(0,1fr)]')
  expect(chatPrimitivesSource).toContain("overflow-y-auto overscroll-y-contain touch-pan-y")
 })
 
 it("preserves transcript position unless the creator is following or sends a new turn", () => {
  expect(source.includes("export const shouldFollowBrainConversation") || source.includes('import { shouldFollowBrainConversation } from "./brainConversationScroll"')).toBe(true)
  expect(source).toContain("if (!shouldFollowConversationRef.current) return")
  expect(source).toContain("shouldFollowConversationRef.current = shouldFollowBrainConversation(viewport.scrollHeight, viewport.scrollTop, viewport.clientHeight)")
  const handleSend = source.slice(source.indexOf("const handleSend = async"), source.indexOf("const handleRetryInterruptedTurn"))
  expect(handleSend).toContain("shouldFollowConversationRef.current = true")
 })

 
 it("keeps Brain context actions readable on narrow phones and collapses learning details by default", () => {
  const contextStrip = source.slice(source.indexOf('const BrainContextStrip:'), source.indexOf('const shellCard ='))
  const receiptEntry = source.slice(source.indexOf('if (!response && message.learningReceipt)'), source.indexOf('if (!response)'))

  expect(contextStrip).toContain('grid-cols-1 gap-1 min-[480px]:grid-cols-3 sm:grid-cols-4')
  expect(contextStrip).toContain('Clear selection')
  expect(contextStrip).toContain('Clear project')
  expect(contextStrip).toContain('text-clip')
  expect(contextStrip).not.toContain('truncate')
  expect(contextStrip).toContain('className="block min-w-0 whitespace-nowrap overflow-hidden text-clip">Project · {projectLabel}</span>')
  expect(contextStrip).toContain('className="block min-w-0 whitespace-nowrap overflow-hidden text-clip">Selected · {selection?.label || "None"}</span>')
  expect(receiptEntry).toContain('title="LEARNING SAVED"')
  expect(receiptEntry).not.toContain('defaultOpen')
 })

 it("summarizes missing channel data in one collapsed creator-facing line", () => {
  const readiness = source.slice(source.indexOf('const BrainDataReadiness:'), source.indexOf('export const UserMessage:'))

  expect(readiness).toContain('data-vt-brain-part="readiness-creator-summary"')
  expect(readiness).toContain('Channel data')
  expect(readiness).toContain('data items unavailable')
  expect(readiness).toContain('data-vt-brain-part="dataset-status-item"')
  expect(readiness).not.toContain('<details data-vt-brain-component="BrainEvidenceReadiness" open')
  expect(readiness).toContain('View details')
  expect(readiness).toContain('{expanded ? (')
  expect(readiness).toContain('onToggle={(event) => setExpanded(event.currentTarget.open)}')
 })

 it("uses plain-language runtime status and separates project and build context", () => {
  expect(panelSource).toContain('trace?.status?.toLowerCase() === "fallback" ? "Using channel-wide fallback"')
  expect(panelSource).toContain('Project: {project?.name || "No project"}')
  expect(panelSource).toContain('Build: {titleCase(build.stage)}')
  expect(panelSource).not.toContain('{trace ? titleCase(trace.status) : "No trace yet"}')
 })

 it("keeps the mobile composer inside the layout viewport and gives the textarea real width", () => {
  expect(viewportHookSource).toMatch(/Math\.min\(vv\.height,\s*layoutHeight\)/)
  expect(viewportHookSource).toContain('window.visualViewport')
  expect(composerDockSource).toContain('className="vt-brain-composer-input w-full min-w-0 resize-none"')
  expect(composerDockSource).toContain('maxHeight: maxFieldPx')
  expect(composerDockSource).toContain('data-vt-brain-component="BrainComposerSendAction"')
  expect(source).toContain('className="vt-brain-studio-workspace__composer vt-brain-chat-column__dock"')
 })


 it("does not make the entire transcript a live log that re-announces the full conversation", () => {
  const viewport = chatPrimitivesSource.slice(
   chatPrimitivesSource.indexOf("export const ChatConversationViewport:"),
   chatPrimitivesSource.indexOf("/** Anchored composer frame"),
  )
  expect(viewport).toContain('aria-label="Brain conversation"')
  expect(viewport).toContain('role="region"')
  expect(viewport).not.toContain('role="log"')
  expect(viewport).not.toContain('aria-live="polite"')
 })


 it("keeps follow scrolling inside the conversation viewport instead of scrolling ancestor layout", () => {
  expect(source).not.toContain('bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" })')
  expect(source).toContain('viewport.scrollTo({ top: viewport.scrollHeight, behavior: "smooth" })')
 })

 it("opens the first canonical capability and keeps selection aligned with search", () => {
  expect(capabilityBrowserSource).toContain("BRAIN_CAPABILITY_REGISTRY[0]?.id ?? null")
  expect(capabilityBrowserSource).toContain("matchingCapabilities[0]?.id ?? null")
 })

 it("shows draft provenance and an explicit clear-draft action in the canonical composer", () => {
  expect(composerDockSource).toContain('data-vt-brain-part="composer-attachments"')
  expect(composerDockSource).toContain('data-vt-brain-part="clear-composer-draft"')
  expect(source).toContain('activePromptTitle={activePromptTitle}')
  expect(source).toContain('setActivePromptTitle("Capability draft")')
  expect(source).toContain('setActivePromptTitle("Suggested action")')
 })

})
