import React, { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useBrain } from "../context/useBrain"
import { CHANNEL_CONTEXT_QUESTIONS } from "../context/channelContextQuestions"
import { scoreContext } from "../context/ChannelContextScoring"
import { loadAiBrainContext } from "../services/aiBrainContext"
import { buildCreatorAnswerEvidenceRecords, isCreatorAnswerProfileEligible } from "../services/brain/CreatorAnswerEvidence"
import { BrainScopeSummary } from "../components/brain/BrainScopeSummary"
import { BrainSettingsSwitch, BrainSettingsRange } from "../components/brain/BrainSettingsControls"
import { BRAIN_USER_CONTROLS_STORAGE_KEY, DEFAULT_BRAIN_USER_CONTROLS, clearBrainUserControlOverride, readBrainUserControls, writeBrainUserControls, type BrainUserControls } from "../services/brain/BrainUserControls"
import { readBrainEngineControls, resetBrainEngineControls, writeBrainEngineControls, type BrainEngineControls } from "../services/brain/BrainEngineControls"
import { BRAIN_CAPABILITY_EVIDENCE_REQUIREMENTS, BRAIN_CAPABILITY_REGISTRY } from "../services/brain/BrainCapabilityRegistry"
import type { BrainCapabilityDefinition } from "../types"
import { StudioButton, StudioCollapsingTwoLineModule, StudioInterModule, StudioTopSplitModule } from "../studio-ui"
import { capabilityPromptFor } from "../components/brain/BrainCapabilityBrowser"

type Settings = { policy: BrainUserControls; engines: BrainEngineControls }
type PolicyRow = readonly [keyof BrainUserControls, string, string]
type EngineKey = "channelIntelligence" | "anomalyIntelligence" | "opportunityIntelligence" | "algorithmPriming" | "videoPackages" | "autoLoadEvidence"
const masterRows: PolicyRow[] = [
  ["enabled", "Brain enabled", "Master switch for Brain reasoning and governed capabilities."],
  ["personalization", "Personalization", "Use creator knowledge, history, channel context and style preferences."],
  ["learnFromInteractions", "Learn from interactions", "Allow eligible interactions into the governed learning process; this is not automatic approval of permanent knowledge."],
  ["captureCreatorCommunications", "Capture creator communications", "Opt in to classification as evidence. Raw text is redacted; no automatic memory promotion occurs."],
  ["showEvidence", "Show evidence", "Show provenance, evidence and caveats with supported answers."],
]
const accessRows: PolicyRow[] = [
  ["allowAnalytics", "Analytics + VT-SYNC", "Permit canonical analytics evidence. Turning this off prevents private analytics use."],
  ["allowProjects", "Projects", "Permit project and content context."],
  ["allowVault", "Vault + video packages", "Permit asset and package metadata lookup."],
  ["allowComments", "Comments", "Permit community context where supported."],
  ["allowPublisher", "Publisher handoffs", "Permit preparation of publisher handoffs; this alone does not authorize publication."],
]
const safetyRows: PolicyRow[] = [
  ["externalActionsRequireApproval", "Require approval for external actions", "External actions remain gated; publisher access alone is not publishing approval."],
  ["contributeDeidentifiedResearch", "De-identified research contribution", "Optional research contribution. Disabled by default."],
]
const engineRows: ReadonlyArray<readonly [EngineKey, string, string]> = [
  ["channelIntelligence", "Channel Intelligence", "Use channel patterns and outcome history."],
  ["anomalyIntelligence", "Signal / Anomaly Intelligence", "Use detected material changes in recommendation context."],
  ["opportunityIntelligence", "Opportunity Intelligence", "Use strategic opportunities when ranking recommendations."],
  ["algorithmPriming", "Algorithm Priming + Momentum", "Prepare pre-launch, launch, post-launch, sustain and learn plans."],
  ["videoPackages", "Video Package access", "Use matching package artifacts, subject to data-access permissions."],
  ["autoLoadEvidence", "Auto-load evidence", "Attach bounded relevant evidence to supported Brain turns."],
]
const loadSettings = (channelId: string | null): Settings => ({ policy: readBrainUserControls(channelId), engines: readBrainEngineControls(channelId) })
export const brainSettingsDiffer = (left: Settings, right: Settings): boolean => JSON.stringify(left) !== JSON.stringify(right)
const inheritedSettings = (): Settings => {
  let policy = { ...DEFAULT_BRAIN_USER_CONTROLS }
  try {
    const raw = localStorage.getItem(BRAIN_USER_CONTROLS_STORAGE_KEY)
    policy = { ...policy, ...(raw ? JSON.parse(raw) : {}) }
  } catch { /* Match existing policy-reader fallback to defaults. */ }
  return { policy, engines: readBrainEngineControls(null) }
}
const Card: React.FC<{ title: string; eyebrow?: string; children: React.ReactNode }> = ({ title, eyebrow, children }) => {
  const id = React.useId()
  return (
    <StudioTopSplitModule as="section" sizeVariant="standard" title={<span id={id}>{title}</span>} aria-labelledby={id} className="min-w-0">
      {eyebrow ? <p className="mb-2 text-[10px] font-black uppercase tracking-wide text-black/60">{eyebrow}</p> : null}
      {children}
    </StudioTopSplitModule>
  )
}
export const getBrainCapabilityGroups = () => {
  const groups = [
    { title: "Channel intelligence", ids: ["channel-profile", "signal-anomaly-intelligence", "statistics-intelligence", "algorithm-intelligence", "analytics-diagnosis", "top-performer-mining"] },
    { title: "Creator strategy", ids: ["audience-promise", "goal-coach", "daily-oracle", "journal-memory"] },
    { title: "Discovery + publishing", ids: ["seo-opportunity", "niche-knowledge", "current-grounding", "content-generation"] },
  ].map(group => ({
    title: group.title,
    capabilities: group.ids
      .map(id => BRAIN_CAPABILITY_REGISTRY.find(item => item.id === id))
      .filter((item): item is BrainCapabilityDefinition => Boolean(item)),
  }))
  const assignedIds = new Set(groups.flatMap(group => group.capabilities.map(capability => capability.id)))
  const unassigned = BRAIN_CAPABILITY_REGISTRY.filter(capability => !assignedIds.has(capability.id))
  if (unassigned.length) groups.push({ title: "Other registered capabilities", capabilities: unassigned })
  return groups.filter(group => group.capabilities.length > 0)
}

const readProfileValue = (profile: ReturnType<typeof loadAiBrainContext>["channelContext"], path: string): unknown =>
  path.split(".").reduce<unknown>((value, key) =>
    value && typeof value === "object" ? (value as Record<string, unknown>)[key] : undefined, profile)
const displayProfileValue = (value: unknown): string =>
  Array.isArray(value) ? value.map(item => String(item ?? "").trim()).filter(Boolean).join(", ")
    : value === undefined || value === null ? "" : String(value).trim()
const CapabilityInventory: React.FC = () => {
  const navigate = useNavigate()
  const groups = getBrainCapabilityGroups()
  return <div className="grid min-w-0 gap-3">
    <p className="text-sm font-bold leading-5">This is the complete registered capability catalog—not a promise that every capability is ready for every channel. Each request still checks permissions, evidence, and context.</p>
    {groups.map(group => <section key={group.title} className="grid min-w-0 gap-2">
      <StudioInterModule title={group.title} sizeVariant="standard" />
      {group.capabilities.map(capability => <StudioCollapsingTwoLineModule
        key={capability.id}
        title={capability.label}
        description={capability.description}
        sizeVariant="standard"
        split="double"
        className="min-w-0"
      >
        <div className="grid min-w-0 gap-2 p-3">
          <p className="text-[10px] font-black uppercase text-black/60">Intents: {capability.intents.join(" · ").replace(/_/g, " ")}</p>
          <p className="break-words text-[10px] font-bold leading-4">Evidence contract: {(BRAIN_CAPABILITY_EVIDENCE_REQUIREMENTS[capability.id] || []).join(", ").replace(/_/g, " ") || "No specific sections registered"}</p>
          <p className="text-[10px] font-bold leading-4 text-black/65">{capability.requiresChannelData ? "Requires channel evidence." : "Can be useful without channel analytics."} {capability.requiresCurrentResearch ? "Only selected for timely/current research requests." : ""} Maximum invocations per turn: {capability.maximumInvocationsPerTurn}.</p>
          <StudioButton type="button" sizeVariant="compact" tone="neutral" onClick={() => navigate("/ai-brain?draft=" + encodeURIComponent(capabilityPromptFor(capability)))}>PREPARE REQUEST IN BRAIN</StudioButton>
        </div>
      </StudioCollapsingTwoLineModule>)}
    </section>)}
  </div>
}

export default function BrainControlsPage() {
  const { authState } = useBrain()
  const navigate = useNavigate()
  const channelId = authState.channelId || authState.channelHandle || null
  const creatorProfileChannelId = authState.channelId || null
  const activeChannelLabel = authState.channelName || null
  const [draft, setDraft] = useState(() => loadSettings(channelId))
  const [saved, setSaved] = useState(() => loadSettings(channelId))
  const [loadedScope, setLoadedScope] = useState(channelId)
  const [resetPending, setResetPending] = useState(false)
  const [status, setStatus] = useState("")
  const [creatorProfile, setCreatorProfile] = useState(() => loadAiBrainContext(creatorProfileChannelId, activeChannelLabel))
  const scopeReady = loadedScope === channelId
  const dirty = resetPending || brainSettingsDiffer(draft, saved)
  const reload = () => {
    const next = loadSettings(channelId)
    setDraft(next); setSaved(next); setResetPending(false); setLoadedScope(channelId)
  }
  useEffect(() => {
    const next = loadSettings(channelId)
    setDraft(next); setSaved(next); setResetPending(false); setLoadedScope(channelId); setStatus("Loaded settings for the selected scope.")
  }, [channelId])
  useEffect(() => {
    if (!dirty) return
    const warn = (event: BeforeUnloadEvent) => { event.preventDefault(); event.returnValue = "" }
    window.addEventListener("beforeunload", warn)
    return () => window.removeEventListener("beforeunload", warn)
  }, [dirty])
  useEffect(() => {
    const refreshCreatorProfile = () => setCreatorProfile(loadAiBrainContext(creatorProfileChannelId, activeChannelLabel))
    refreshCreatorProfile()
    window.addEventListener("vt_creator_channel_context_updated", refreshCreatorProfile)
    window.addEventListener("storage", refreshCreatorProfile)
    return () => {
      window.removeEventListener("vt_creator_channel_context_updated", refreshCreatorProfile)
      window.removeEventListener("storage", refreshCreatorProfile)
    }
  }, [creatorProfileChannelId, activeChannelLabel])
  const editPolicy = (key: keyof BrainUserControls, value: boolean) => { setDraft(old => ({ ...old, policy: { ...old.policy, [key]: value } })); setResetPending(false); setStatus("") }
  const editEngine = (key: keyof BrainEngineControls, value: boolean | number) => { setDraft(old => ({ ...old, engines: { ...old.engines, [key]: value } })); setResetPending(false); setStatus("") }
  const save = () => {
    if (!channelId || !scopeReady) return
    try {
      const next = resetPending
        ? { policy: clearBrainUserControlOverride(channelId), engines: resetBrainEngineControls(channelId) }
        : { policy: writeBrainUserControls(draft.policy, channelId), engines: writeBrainEngineControls(draft.engines, channelId) }
      setDraft(next); setSaved(next); setResetPending(false); setStatus("Saved channel settings in this browser.")
    } catch { setStatus("Save did not complete. Some settings may have changed. Use Cancel / reload saved settings to inspect the persisted values.") }
  }
  const stageReset = () => {
    if (!channelId || !scopeReady) return
    if (!window.confirm("Preview removal of this channel's policy and engine overrides? Inherited settings will appear below. Nothing changes until Save.")) return
    setDraft(inheritedSettings()); setResetPending(true); setStatus("Reset preview only. Save removes both channel overrides; Cancel keeps the saved settings.")
  }
  const rows = (items: PolicyRow[]) => items.map(([key, label, detail]) => <BrainSettingsSwitch key={key} checked={draft.policy[key]} onChange={value => editPolicy(key, value)} label={label} detail={detail} />)
  const contextScore = scoreContext(creatorProfile.channelContext)
  const answeredQuestions = CHANNEL_CONTEXT_QUESTIONS.filter(question => Boolean(displayProfileValue(readProfileValue(creatorProfile.channelContext, question.contextField))))
  // Evidence IDs must use the same stable channel ID as BrainOrchestrator.
  // A scoped profile is trusted by scope; only an unscoped legacy profile needs
  // an exact active-channel label match before its answers can be used.
  const creatorEvidenceChannelId = authState.channelId || null
  const creatorProfileEligibleForScope = isCreatorAnswerProfileEligible({
    channelScoped: Boolean(creatorEvidenceChannelId),
    profileName: creatorProfile.channelContext.identity.name,
    activeChannelLabel,
  })
  const creatorAnswerEvidence = creatorProfileEligibleForScope && creatorEvidenceChannelId
    ? buildCreatorAnswerEvidenceRecords(creatorProfile, creatorEvidenceChannelId)
    : []
  const evidenceIds = new Set(creatorAnswerEvidence.map(record => record.id))
  return <main className="min-h-screen bg-[#f5f5f2] text-black">
    <div className="mx-auto grid w-full max-w-[1120px] min-w-0 gap-4 p-2 sm:p-4 md:gap-5 md:p-6">
      <header className="grid min-w-0 gap-3 border-b-[3px] border-black pb-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="grid min-w-0 gap-1">
            <p className="text-[10px] font-black uppercase tracking-[0.12em] text-black/60">ViewTube Studio / AI Brain</p>
            <h1 className="text-2xl font-black uppercase tracking-tight sm:text-3xl">Brain Controls</h1>
            <p className="max-w-2xl text-sm font-bold leading-5 text-black/70">One control surface for intelligence, permissions, learning, evidence, and safety. Draft changes are local until you save.</p>
          </div>
          <StudioButton type="button" sizeVariant="standard" tone="neutral" onClick={() => {
            if (!dirty || window.confirm("Discard unsaved Brain settings and open the Brain?")) navigate("/ai-brain")
          }}>OPEN BRAIN</StudioButton>
        </div>
        <BrainScopeSummary channelId={channelId} />
      </header>

      <StudioTopSplitModule as="section" sizeVariant="standard" title={<span>{resetPending ? "Reset preview — not saved" : dirty ? "Unsaved changes" : "All changes saved"}</span>} className="sticky top-0 z-20 min-w-0">
        <div className="grid min-w-0 gap-3 p-2 sm:flex sm:flex-wrap sm:items-center sm:justify-between">
          <p role="status" aria-live="polite" className="min-w-0 text-xs font-bold leading-4">{status || (dirty ? "Review your draft, then save." : "Settings are saved in this browser for the selected channel.")}</p>
          <div className="grid grid-cols-2 gap-2 sm:flex">
            <StudioButton type="button" sizeVariant="standard" tone="success" disabled={!channelId || !scopeReady || !dirty} onClick={save}>SAVE CHANGES</StudioButton>
            <StudioButton type="button" sizeVariant="standard" tone="neutral" disabled={!scopeReady} onClick={() => { reload(); setStatus("Reloaded saved settings. Draft changes were discarded.") }}>CANCEL / RELOAD</StudioButton>
          </div>
        </div>
      </StudioTopSplitModule>

      {!channelId ? <p role="note" className="border-2 border-black bg-[#FFDA47] p-3 text-sm font-bold">Select a channel before changing settings. No channel overrides will be written without an explicit channel.</p> : null}

      <Card title="Creator profile + evidence" eyebrow="01 / One canonical local intake">
        <div className="grid min-w-0 gap-3 p-2">
          <div className="grid grid-cols-2 gap-2">
            <div className="min-w-0 border-2 border-black bg-[#f8f8f4] p-2">
              <p className="text-[9px] font-black uppercase text-black/55">Answers stored locally</p>
              <p className="text-xl font-black tabular-nums">{answeredQuestions.length}<span className="text-xs"> / {CHANNEL_CONTEXT_QUESTIONS.length}</span></p>
            </div>
            <div className="min-w-0 border-2 border-black bg-[#f8f8f4] p-2">
              <p className="text-[9px] font-black uppercase text-black/55">Required context</p>
              <p className="text-xl font-black tabular-nums">{contextScore.completionScore}%</p>
            </div>
          </div>
          <p className="text-xs font-bold leading-5">
            {creatorProfileEligibleForScope && creatorEvidenceChannelId
              ? `${creatorAnswerEvidence.length} creator-answer evidence records are scoped to ${creatorProfile.channelContext.identity.name || activeChannelLabel || "the selected channel"}. The Brain may use them as USER_PROVIDED context; they are not verified analytics.`
              : creatorProfileEligibleForScope
                ? "The legacy profile matches this channel, but a stable channel ID is required to create evidence references."
                : "Your answers are kept in this browser. To attach them to this channel's evidence, set the exact active channel name in the creator profile first."}
          </p>
          <div className="grid gap-2 sm:grid-cols-2">
            <StudioButton type="button" sizeVariant="standard" tone="neutral" onClick={() => navigate("/settings?panel=ai")}>EDIT CREATOR PROFILE</StudioButton>
            <StudioButton type="button" sizeVariant="standard" tone="neutral" onClick={() => navigate("/ai-brain")}>OPEN BRAIN CHAT</StudioButton>
          </div>
          <StudioCollapsingTwoLineModule title="Saved answers + evidence IDs" description="Inspect every intake answer and its stable evidence reference." sizeVariant="standard" split="double" className="min-w-0">
            <ul className="grid min-w-0 gap-1 p-2">
              {CHANNEL_CONTEXT_QUESTIONS.map(question => {
                const answer = displayProfileValue(readProfileValue(creatorProfile.channelContext, question.contextField))
                const evidenceId = `creator-answer:${creatorEvidenceChannelId || ""}:channelContext.${question.contextField}`
                const hasEvidence = Boolean(answer && evidenceIds.has(evidenceId))
                return <li key={question.id} className="grid min-w-0 gap-1 border-b border-black/15 py-2 last:border-b-0">
                  <span className="text-[10px] font-black uppercase">{question.title}</span>
                  <span className="break-words text-xs font-bold">{answer || "Not answered"}</span>
                  <span className="break-all text-[9px] font-bold text-black/55">{hasEvidence ? evidenceId : answer ? "Evidence waits for an exact active-channel match." : "No answer evidence until answered."}</span>
                </li>
              })}
            </ul>
          </StudioCollapsingTwoLineModule>
        </div>
      </Card>

      <fieldset disabled={!channelId || !scopeReady} className="grid min-w-0 gap-4 border-0 p-0">
        <legend className="sr-only">Channel Brain settings</legend>
        <Card title="Master policy" eyebrow="02 / Brain behavior">{rows(masterRows)}</Card>
        <Card title="Data access" eyebrow="03 / Connected sources">{rows(accessRows)}<p className="mt-3 border-t border-black/25 pt-3 text-xs font-bold leading-4">Permission is not readiness: enabling access does not mean a source is connected, synced, or has usable evidence.</p></Card>
        <Card title="Intelligence engines" eyebrow="04 / Governed subsystems">
          {engineRows.map(([key, label, detail]) => <BrainSettingsSwitch key={key} checked={draft.engines[key]} onChange={value => editEngine(key, value)} label={label} detail={detail} />)}
          <p className="mt-3 border-t border-black/25 pt-3 text-xs font-bold leading-4">Engine preferences remain stored when data access is off. Existing runtime permission gates still decide whether an engine can run.</p>
        </Card>
        <Card title="Evidence thresholds" eyebrow="05 / Quality and uncertainty">
          <BrainSettingsRange label="Maximum evidence items" detail="Limit selected evidence items per supported turn (3–30)." min={3} max={30} value={draft.engines.maxEvidenceItems} onChange={value => editEngine("maxEvidenceItems", value)} />
          <BrainSettingsRange label="Anomaly minimum impact" detail="Minimum impact threshold for eligible anomaly signals." min={0} max={1} step={.05} value={draft.engines.anomalyMinimumImpact} onChange={value => editEngine("anomalyMinimumImpact", value)} />
          <BrainSettingsRange label="Anomaly confidence threshold" detail="Signal-filtering threshold, not a probability that an answer is correct." min={0} max={1} step={.05} value={draft.engines.anomalyMinimumConfidence} onChange={value => editEngine("anomalyMinimumConfidence", value)} />
        </Card>
        <Card title="Safety + learning" eyebrow="06 / Review before retention">{rows(safetyRows)}</Card>
      </fieldset>

      <Card title="Capability inventory" eyebrow="07 / Discover what Brain can do">
        <CapabilityInventory />
      </Card>

      <StudioTopSplitModule as="section" sizeVariant="standard" title={<span>Channel overrides</span>} className="min-w-0">
        <div className="grid gap-3 p-2">
          <p className="text-xs font-bold leading-5">Reset previews inherited global settings or defaults for both policy and engines. It does not delete conversations, profile knowledge, or assets. Reset takes effect only when saved; editing the preview creates a new explicit channel configuration.</p>
          <StudioButton type="button" sizeVariant="standard" tone="neutral" disabled={!channelId || !scopeReady} onClick={stageReset}>PREVIEW RESET</StudioButton>
        </div>
      </StudioTopSplitModule>
    </div>
  </main>
}
