import React, { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { useBrain } from "../context/useBrain"
import { BrainScopeSummary } from "../components/brain/BrainScopeSummary"
import { BrainSettingsSwitch, BrainSettingsRange, brainSettingsButtonClass } from "../components/brain/BrainSettingsControls"
import { BRAIN_USER_CONTROLS_STORAGE_KEY, DEFAULT_BRAIN_USER_CONTROLS, clearBrainUserControlOverride, readBrainUserControls, writeBrainUserControls, type BrainUserControls } from "../services/brain/BrainUserControls"
import { readBrainEngineControls, resetBrainEngineControls, writeBrainEngineControls, type BrainEngineControls } from "../services/brain/BrainEngineControls"
import { StudioButton, StudioTopSplitModule } from "../studio-ui"

type Settings = { policy: BrainUserControls; engines: BrainEngineControls }
type PolicyRow = readonly [keyof BrainUserControls, string, string]
type EngineKey = "channelIntelligence" | "anomalyIntelligence" | "opportunityIntelligence" | "algorithmPriming" | "videoPackages" | "autoLoadEvidence"
const masterRows: PolicyRow[] = [
  ["enabled", "Brain enabled", "Master switch for Brain reasoning and governed capabilities."],
  ["personalization", "Personalization", "Use creator knowledge, history and style preferences."],
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
const engineRows: ReadonlyArray<readonly [EngineKey, string, string]> = [
  ["channelIntelligence", "Channel Intelligence", "Use channel patterns and outcome history."],
  ["anomalyIntelligence", "Signal / Anomaly Intelligence", "Use detected material changes in recommendation context."],
  ["opportunityIntelligence", "Opportunity Intelligence", "Use strategic opportunities when ranking recommendations."],
  ["algorithmPriming", "Algorithm Priming + Momentum", "Prepare pre-launch, launch, post-launch, sustain and learn plans."],
  ["videoPackages", "Video Package access", "Use matching package artifacts, subject to data-access permissions."],
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
const Card: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => {
  const id = React.useId()
  return (
    <StudioTopSplitModule
      as="section"
      sizeVariant="standard"
      title={<span id={id}>{title}</span>}
      aria-labelledby={id}
      className="min-w-0"
    >
      {children}
    </StudioTopSplitModule>
  )
}

export default function BrainControlsPage() {
  const { authState } = useBrain()
  const channelId = authState.channelId || authState.channelHandle || null
  const [draft, setDraft] = useState(() => loadSettings(channelId))
  const [saved, setSaved] = useState(() => loadSettings(channelId))
  const [loadedScope, setLoadedScope] = useState(channelId)
  const [resetPending, setResetPending] = useState(false)
  const [status, setStatus] = useState("")
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
  return <main className="min-h-screen bg-[#f5f5f2] p-3 md:p-6"><div className="mx-auto max-w-[1240px] space-y-4">
    <header><h1 className="text-2xl font-bold">Brain Controls</h1><p className="mt-1 text-sm">Channel-scoped settings in this browser. Changes apply only after Save.</p><Link to="/ai-brain" className={`${brainSettingsButtonClass} mt-2 bg-white`} onClick={event => { if (dirty && !window.confirm("Discard unsaved Brain settings and open the Brain?")) event.preventDefault() }}>Open Brain</Link></header>
    <BrainScopeSummary channelId={channelId} />
    <StudioTopSplitModule
      as="section"
      sizeVariant="standard"
      title={<span>{resetPending ? "Reset preview — not saved" : dirty ? "Unsaved changes" : "No unsaved changes"}</span>}
      className="sticky top-0 z-20 min-w-0"
    >
      <div className="flex flex-wrap items-center justify-between gap-3 p-2">
        <p role="status" aria-live="polite" className="min-w-0 text-sm">{status}</p>
        <div className="flex flex-wrap gap-2">
          <StudioButton type="button" sizeVariant="standard" tone="success" disabled={!channelId || !scopeReady || !dirty} onClick={save}>SAVE CHANGES</StudioButton>
          <StudioButton type="button" sizeVariant="standard" tone="neutral" disabled={!scopeReady} onClick={() => { reload(); setStatus("Reloaded saved settings. Draft changes were discarded.") }}>CANCEL / RELOAD</StudioButton>
        </div>
      </div>
    </StudioTopSplitModule>
    {!channelId ? <p role="note">Select a channel before changing settings. No channel overrides will be written without an explicit channel.</p> : null}
    <fieldset disabled={!channelId || !scopeReady} className="grid min-w-0 gap-4 border-0 p-0 lg:grid-cols-2"><legend className="sr-only">Channel Brain settings</legend>
      <Card title="Master Brain Policy">{rows(masterRows)}</Card>
      <Card title="Data Access">{rows(accessRows)}<p className="mt-3 text-sm">Permission is not readiness: enabled access does not mean the source is connected or synced.</p></Card>
      <Card title="Intelligence Engines">{engineRows.map(([key, label, detail]) => <BrainSettingsSwitch key={key} checked={draft.engines[key]} onChange={value => editEngine(key, value)} label={label} detail={detail} />)}<p className="mt-3 text-sm">Engine preferences remain stored when access is off; execution is still governed by existing permissions.</p></Card>
      <Card title="Evidence + Safety"><BrainSettingsSwitch checked={draft.engines.autoLoadEvidence} onChange={value => editEngine("autoLoadEvidence", value)} label="Auto-load evidence" detail="Attach bounded relevant evidence to supported Brain turns." />{rows([["externalActionsRequireApproval", "Require approval for external actions", "Existing external-action approval rules still apply. Publisher access alone is not publishing approval."], ["contributeDeidentifiedResearch", "De-identified research contribution", "Optional research contribution; disabled by default."]])}
        <details className="mt-3 rounded-lg border border-black p-3"><summary className="min-h-11 cursor-pointer font-bold focus-visible:outline focus-visible:outline-4 focus-visible:outline-black">Advanced evidence thresholds</summary>
          <BrainSettingsRange label="Maximum evidence items" detail="Limit the number of selected evidence items, from 3 to 30." min={3} max={30} value={draft.engines.maxEvidenceItems} onChange={value => editEngine("maxEvidenceItems", value)} />
          <BrainSettingsRange label="Anomaly minimum impact" detail="Minimum impact threshold for eligible anomaly signals." min={0} max={1} step={.05} value={draft.engines.anomalyMinimumImpact} onChange={value => editEngine("anomalyMinimumImpact", value)} />
          <BrainSettingsRange label="Anomaly confidence threshold" detail="Signal-filtering threshold, not a probability that an answer is correct." min={0} max={1} step={.05} value={draft.engines.anomalyMinimumConfidence} onChange={value => editEngine("anomalyMinimumConfidence", value)} />
        </details>
      </Card>
    </fieldset>
    <footer className="rounded-lg border-2 border-black bg-white p-4"><h2 className="font-bold">Channel overrides</h2><p className="my-2 text-sm">Reset previews inherited global settings or defaults for both policy and engines. It does not delete conversations, profile knowledge or assets. Reset takes effect only when saved. Editing the preview creates a new explicit channel configuration instead.</p><StudioButton type="button" sizeVariant="standard" tone="neutral" disabled={!channelId || !scopeReady} onClick={stageReset}>PREVIEW RESET</StudioButton></footer>
  </div></main>
}
