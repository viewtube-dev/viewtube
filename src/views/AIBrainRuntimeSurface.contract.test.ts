import { readFileSync } from "node:fs"
import { describe, expect, it } from "vitest"

const source = readFileSync(new URL("./AIBrainCommandInterface.tsx", import.meta.url), "utf8")
const panelSource = readFileSync(new URL("../components/brain/BrainRuntimePanel.tsx", import.meta.url), "utf8")
const chatPrimitivesSource = readFileSync(new URL("../components/brain/BrainChatPrimitives.tsx", import.meta.url), "utf8")

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
 })

 it("uses StudioInterModule for chat entries and the registry-backed prompt library", () => {
  const userMessage = source.slice(source.indexOf('export const UserMessage:'), source.indexOf('const CreatorIntakeWizard:'))
  const responseCard = source.slice(source.indexOf('const CreatorResponseCard:'), source.indexOf('const readinessForSnapshot:'))
  const promptLibrary = source.slice(source.indexOf('export const BrainPromptLibrary:'), source.indexOf('const FEEDBACK_OPTIONS ='))

  expect(source).toContain('import { StudioInterModule } from "../studio-ui/primitives/StudioInterModule"')
  expect(userMessage).toContain("<StudioInterModule")
  expect(responseCard).toContain("<StudioInterModule")
  expect(promptLibrary).toContain('data-vt-brain-component="BrainPromptLibraryModule"')
  expect(promptLibrary).toContain('data-vt-brain-part="prompt-collapsible-module"')
  expect(promptLibrary).toContain("<StudioCollapsingSplitModule")
  expect(promptLibrary).not.toContain("<StudioInterModule\n           key={card.id}")
  expect(promptLibrary).toContain("firstLine=\"SEND TO\"")
  expect(promptLibrary).toContain("secondLine=\"CHAT\"")
  expect(promptLibrary).toContain("firstLine=\"EDIT\"")
  expect(promptLibrary).toContain("secondLine=\"FIRST\"")
  expect(source).toContain("TOOLBOX_PALETTE[(index + 4) % TOOLBOX_PALETTE.length]")
  expect(promptLibrary).toContain("order.get(card.id)")
  expect(chatPrimitivesSource).toContain("touch-pan-y")
  expect(source).toContain("max-xl:h-[100dvh]")
 })
})
