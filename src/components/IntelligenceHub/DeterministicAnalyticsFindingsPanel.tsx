import React, { useEffect, useMemo, useState } from "react"
import type { CanonicalIntelligenceEvidenceBundle } from "../../services/analytics-canon"
import { buildCurrentCanonicalAnalyticsInsights } from "../../services/brain/CurrentCanonicalAnalyticsInsights"
import {
 buildAnalyticsRecommendationAction,
 presentAnalyticsFindings,
 recordAnalyticsRecommendationEvent,
} from "../../services/brain/AnalyticsIntelligenceWorkflow"
import { createViewTubeActionPacket, persistViewTubeActionPacket } from "../../services/viewTubeToolChains"
import { recordAlgorithmIntelligenceEvent, listAlgorithmIntelligenceEvents } from "../../services/brain/AlgorithmIntelligenceEventLedger"
import { hydrateBrainIntelligenceFromPersistence, persistBrainIntelligence } from "../../services/brain/BrainIntelligencePersistence"

const number = (value: number | null) => value === null
 ? "Not defined"
 : value.toLocaleString(undefined, { maximumFractionDigits: 2 })

/** Renders only validated trend findings built from full canonical daily rows. */
export const DeterministicAnalyticsFindingsPanel: React.FC<{
 evidence: CanonicalIntelligenceEvidenceBundle | null
}> = ({ evidence }) => {
 const [selectedFindingId, setSelectedFindingId] = useState("")
 const [creatorGoal, setCreatorGoal] = useState("")
 const [proposedAction, setProposedAction] = useState("")
 const [projectId, setProjectId] = useState("")
 const [contentBuildId, setContentBuildId] = useState("")
 const [videoId, setVideoId] = useState("")
 const [expectedDirection, setExpectedDirection] = useState<"increase" | "decrease" | "observe">("observe")
 const [evaluationWindow, setEvaluationWindow] = useState<"7d" | "28d" | "90d" | "365d">("28d")
 const [proposalStatus, setProposalStatus] = useState<string | null>(null)
 const [pendingRecommendation, setPendingRecommendation] = useState<ReturnType<typeof buildAnalyticsRecommendationAction>>(null)
 const [persistenceStatus, setPersistenceStatus] = useState("Checking durable event storage…")
 const [actionPacketId, setActionPacketId] = useState<string | null>(null)

 useEffect(() => {
  if (!evidence?.channelId) return
  let active = true
  hydrateBrainIntelligenceFromPersistence(evidence.channelId).then((result) => {
   if (active) setPersistenceStatus(result ? "Server persistence connected" : "Sign in to sync this channel event history")
  }).catch(() => {
   if (active) setPersistenceStatus("Server persistence unavailable; local cache retained")
  })
  return () => { active = false }
 }, [evidence?.channelId])
 const result = useMemo(() => {
  if (!evidence?.channelId) return { rawFindings: [], findings: [], limitations: ["Resolve a channel-scoped canonical snapshot to calculate findings."] }
  const current = buildCurrentCanonicalAnalyticsInsights({
   channelId: evidence.channelId,
   expectedSnapshotId: evidence.snapshotId,
  })
  return {
   rawFindings: current.findings,
   findings: presentAnalyticsFindings(current.findings, evidence.channelId),
   limitations: current.limitations,
  }
 }, [evidence?.channelId, evidence?.snapshotId])

 const createProposal = (event: React.FormEvent<HTMLFormElement>) => {
  event.preventDefault()
  setProposalStatus(null)
  if (!evidence?.channelId) {
   setProposalStatus("Blocked: canonical channel scope is unavailable.")
   return
  }
  const finding = result.rawFindings.find((candidate) => candidate.id === selectedFindingId)
  if (!finding) {
   setProposalStatus("Choose a validated deterministic finding first.")
   return
  }
  const recommendation = buildAnalyticsRecommendationAction({
   id: `analytics-recommendation:${crypto.randomUUID()}`,
   creatorGoal,
   action: proposedAction,
   channelId: evidence.channelId,
   projectId: projectId.trim() || null,
   contentBuildId: contentBuildId.trim() || null,
   videoId: videoId.trim() || null,
   finding,
   expectedDirection,
   evaluationWindow,
  })
  if (!recommendation) {
   setProposalStatus("Proposal blocked: goal, action, and finding must be valid and channel-matched.")
   return
  }
  try {
   recordAnalyticsRecommendationEvent(recommendation)
   setPendingRecommendation(recommendation)
   setActionPacketId(null)
   setProposalStatus(`Proposal recorded: ${recommendation.id}. It is not approved or executed. Use the explicit approval button below to create the canonical ActionPacket handoff to Projects.`)
   setProposedAction("")
   void persistBrainIntelligence({ channelId: recommendation.channelId, events: listAlgorithmIntelligenceEvents({ channelId: recommendation.channelId }) })
    .then((result) => setPersistenceStatus(result ? "Proposal synced to server-side Brain event storage" : "Proposal is local-only until this channel is signed in and connected"))
    .catch(() => setPersistenceStatus("Server sync failed; proposal remains in local recovery cache"))
  } catch {
   setProposalStatus("Proposal was not recorded. Browser storage may be unavailable.")
  }
 }

 const approveAndHandoff = async () => {
  const recommendation = pendingRecommendation
  if (!recommendation) return
  try {
   const packet = createViewTubeActionPacket({
    sourceToolId: "ai-brain",
    sourceKind: "brain",
    payloadKind: "project",
    title: "Creator-approved analytics action",
    summary: recommendation.action,
    payload: {
     schemaVersion: 1,
     recommendation,
     approval: { status: "creator-approved-for-project-review", approvedAt: new Date().toISOString() },
     externalMutationApproved: false,
     publishingApproved: false,
    },
    projectId: recommendation.projectId,
    contentBuildId: recommendation.contentBuildId,
    channelId: recommendation.channelId,
    videoId: recommendation.videoId,
    evidence: recommendation.evidenceRefs,
    provenance: [...recommendation.findingIds, ...recommendation.baselineSnapshotIds],
    suggestedTargets: ["project-calendar", "video-manager"],
   })
   persistViewTubeActionPacket(packet)
   // Enrich the original proposal event with the creator-approved packet identity.
   // The publication owner later schedules evaluation only if this exact packet's
   // recommendation is bound to the same ContentBuild and published video.
   recordAlgorithmIntelligenceEvent({
    id: `analytics-recommendation:${recommendation.id}`,
    channelId: recommendation.channelId,
    projectId: recommendation.projectId,
    videoId: recommendation.videoId,
    kind: "RECOMMENDATION_CREATED",
    sourceSystem: "decision",
    sourceId: recommendation.findingIds[0] || recommendation.id,
    recommendationId: recommendation.id,
    actionPacketId: packet.id,
    parentEventIds: recommendation.findingIds,
    evidenceIds: recommendation.evidenceRefs,
    confidence: "medium",
    title: "Creator-approved analytics recommendation",
    summary: recommendation.action,
    evaluationTargets: [{
     metric: recommendation.metric,
     direction: recommendation.expectedDirection === "observe" ? "inspect" : recommendation.expectedDirection,
     baselineValue: recommendation.baselineValue,
     windowHours: Number(recommendation.evaluationWindow.replace("d", "")) * 24,
    }],
    metadata: {
     schemaVersion: recommendation.schemaVersion,
     status: "creator-approved-for-project-review",
     creatorGoal: recommendation.creatorGoal,
     contentBuildId: recommendation.contentBuildId,
     publicationTransactionId: recommendation.publicationTransactionId,
     metadataVersionIds: recommendation.metadataVersionIds,
     baselineSnapshotIds: recommendation.baselineSnapshotIds,
     approvalScope: "internal-project-handoff-only",
     externalMutationApproved: false,
     publishingApproved: false,
    },
   })
   recordAlgorithmIntelligenceEvent({
    id: `analytics-creator-approval:${recommendation.id}`,
    channelId: recommendation.channelId,
    projectId: recommendation.projectId,
    videoId: recommendation.videoId,
    kind: "CREATOR_APPROVAL_RECORDED",
    sourceSystem: "decision",
    sourceId: recommendation.id,
    recommendationId: recommendation.id,
    actionPacketId: packet.id,
    parentEventIds: [`analytics-recommendation:${recommendation.id}`],
    evidenceIds: recommendation.evidenceRefs,
    confidence: "medium",
    title: "Creator approved analytics action for Project review",
    summary: "Creator explicitly approved an internal Project/ActionPacket handoff; external publishing and external mutations remain unapproved.",
    evaluationTargets: [{ metric: recommendation.metric, direction: recommendation.expectedDirection === "observe" ? "inspect" : recommendation.expectedDirection, baselineValue: recommendation.baselineValue, windowHours: Number(recommendation.evaluationWindow.replace("d", "")) * 24 }],
    metadata: { recommendationId: recommendation.id, approvalScope: "internal-project-handoff-only", externalMutationApproved: false, publishingApproved: false },
   })
   setActionPacketId(packet.id)
   setProposalStatus(`Creator approval recorded. ActionPacket ${packet.id} was sent through the canonical handoff inbox to Projects. This does not publish or modify external YouTube state.`)
   const durable = await persistBrainIntelligence({ channelId: recommendation.channelId, events: listAlgorithmIntelligenceEvents({ channelId: recommendation.channelId }) })
   setPersistenceStatus(durable ? "Approval and recommendation synced to server-side Brain event storage" : "Approval saved locally; sign in and connect this channel for server sync")
  } catch (error) {
   setProposalStatus(`Approval/handoff failed: ${error instanceof Error ? error.message : String(error)}`)
  }
 }

 return (
  <section aria-labelledby="deterministic-analytics-findings-title" className="mb-6 overflow-hidden rounded-2xl border-[3px] border-black bg-white shadow-[5px_5px_0px_0px_black]">
   <header className="border-b-[3px] border-black bg-[#CCFF00] p-4">
    <p className="text-[9px] font-black uppercase tracking-[0.16em]">Canonical rows · deterministic calculations</p>
    <h3 id="deterministic-analytics-findings-title" className="text-xl font-[1000] uppercase tracking-tight">Analytics Findings</h3>
    <p className="mt-1 text-xs font-bold text-black/65">Observed values and trends are shown separately from explanations and recommendations.</p>
   </header>
   <div className="grid gap-3 p-4 md:grid-cols-2 xl:grid-cols-3">
    {result.findings.map((finding) => (
     <article key={finding.id} className="min-w-0 border-2 border-black bg-[#F7F5EF] p-3">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
       <span className="border-2 border-black bg-white px-2 py-1 text-[9px] font-black uppercase">{finding.kind}</span>
       <span className="text-[9px] font-black uppercase">Confidence heuristic {Math.round(finding.confidence * 100)}%</span>
      </div>
      <h4 className="text-sm font-black uppercase">{finding.title}</h4>
      <p className="mt-2 text-xs font-bold">{finding.layers.fact.text}</p>
      <dl className="mt-3 grid grid-cols-2 gap-2 text-[10px]">
       <div className="border border-black/20 bg-white p-2"><dt className="font-black uppercase">Baseline</dt><dd className="mt-1 text-sm font-black">{number(finding.baselineValue)}</dd></div>
       <div className="border border-black/20 bg-white p-2"><dt className="font-black uppercase">Delta</dt><dd className="mt-1 text-sm font-black">{number(finding.delta)}</dd></div>
      </dl>
      <details className="mt-3 border-t border-black/20 pt-2 text-[10px]">
       <summary className="cursor-pointer font-black uppercase">Formula & provenance</summary>
       <p className="mt-2 break-words font-bold">{finding.formula}</p>
       <p className="mt-1 break-words text-black/65">Snapshots: {finding.sourceSnapshotIds.join(", ")}</p>
       <p className="mt-1 break-words text-black/65">Evidence: {finding.evidenceRefs.join(", ")}</p>
       {finding.limitations.map((limitation) => <p key={limitation} className="mt-1 text-black/65">Limit: {limitation}</p>)}
      </details>
      <div className="mt-3 border-t border-black/20 pt-2">
       <p className="text-[9px] font-black uppercase text-black/50">Interpretation</p>
       <p className="mt-1 text-xs">{finding.layers.interpretation || "Not generated; deterministic facts remain unchanged."}</p>
       <p className="mt-2 text-[9px] font-black uppercase text-black/50">Hypothesis</p>
       <p className="mt-1 text-xs">{finding.layers.hypothesis || "None asserted."}</p>
       <p className="mt-2 text-[9px] font-black uppercase text-black/50">Recommendation</p>
       <p className="mt-1 text-xs">{finding.layers.recommendation || "No action proposed from this trend alone."}</p>
      </div>
     </article>
    ))}
    {result.findings.length === 0 && (
     <div className="border-2 border-dashed border-black/30 bg-white p-4 text-xs font-bold md:col-span-2 xl:col-span-3">
      No validated trend findings are available from this snapshot. The system will not infer missing values or treat the report's bounded sample rows as a complete series.
     </div>
    )}
   </div>
   <form onSubmit={createProposal} className="border-t-[3px] border-black bg-[#E5FAFF] p-4">
    <h4 className="text-sm font-black uppercase">Propose a creator-approved action</h4>
    <p className="mt-1 text-xs font-bold text-black/65">First record a proposal. Then explicitly approve it for an internal ActionPacket handoff to Projects. This approval does not authorize publishing or external YouTube changes.</p>
    <p className="mt-2 text-[10px] font-black uppercase" role="status">Event storage: {persistenceStatus}</p>
    <div className="mt-3 grid gap-3 md:grid-cols-2">
     <label className="block text-[10px] font-black uppercase">Evidence finding
      <select required value={selectedFindingId} onChange={(event) => setSelectedFindingId(event.target.value)} className="mt-1 block min-h-10 w-full border-2 border-black bg-white p-2 text-xs font-bold">
       <option value="">Choose a finding</option>
       {result.findings.map((finding) => <option key={finding.id} value={finding.id}>{finding.title}</option>)}
      </select>
     </label>
     <label className="block text-[10px] font-black uppercase">Evaluation window
      <select value={evaluationWindow} onChange={(event) => setEvaluationWindow(event.target.value as typeof evaluationWindow)} className="mt-1 block min-h-10 w-full border-2 border-black bg-white p-2 text-xs font-bold">
       <option value="7d">7 days</option><option value="28d">28 days</option><option value="90d">90 days</option><option value="365d">365 days</option>
      </select>
     </label>
     <label className="block text-[10px] font-black uppercase">Creator goal
      <input required value={creatorGoal} onChange={(event) => setCreatorGoal(event.target.value)} maxLength={240} className="mt-1 block min-h-10 w-full border-2 border-black bg-white p-2 text-xs font-bold" placeholder="What outcome are you pursuing?"/>
     </label>
     <label className="block text-[10px] font-black uppercase">Proposed action
      <input required value={proposedAction} onChange={(event) => setProposedAction(event.target.value)} maxLength={300} className="mt-1 block min-h-10 w-full border-2 border-black bg-white p-2 text-xs font-bold" placeholder="What will you test or change?"/>
     </label>
     <label className="block text-[10px] font-black uppercase">Project ID (optional)
      <input value={projectId} onChange={(event) => setProjectId(event.target.value)} maxLength={180} className="mt-1 block min-h-10 w-full border-2 border-black bg-white p-2 text-xs font-bold" placeholder="Existing Project identity"/>
     </label>
     <label className="block text-[10px] font-black uppercase">ContentBuild ID (optional; links publish checkpoints)\n      <input value={contentBuildId} onChange={(event) => setContentBuildId(event.target.value)} maxLength={180} className="mt-1 block min-h-10 w-full border-2 border-black bg-white p-2 text-xs font-bold" placeholder="Canonical ContentBuild ID"/>\n     </label>\n     <label className="block text-[10px] font-black uppercase">Published video ID (optional)\n      <input value={videoId} onChange={(event) => setVideoId(event.target.value)} maxLength={180} className="mt-1 block min-h-10 w-full border-2 border-black bg-white p-2 text-xs font-bold" placeholder="YouTube video ID"/>\n     </label>\n     <label className="block text-[10px] font-black uppercase">Expected direction
      <select value={expectedDirection} onChange={(event) => setExpectedDirection(event.target.value as typeof expectedDirection)} className="mt-1 block min-h-10 w-full border-2 border-black bg-white p-2 text-xs font-bold">
       <option value="observe">Observe</option><option value="increase">Increase</option><option value="decrease">Decrease</option>
      </select>
     </label>
    </div>
    <button type="submit" disabled={result.findings.length === 0} className="mt-3 min-h-10 border-2 border-black bg-black px-4 py-2 text-xs font-black uppercase text-white disabled:cursor-not-allowed disabled:opacity-40">Record proposed action</button>
    {proposalStatus && <p role="status" className="mt-3 border-2 border-black bg-white p-3 text-xs font-bold">{proposalStatus}</p>}
    {pendingRecommendation && !actionPacketId && <button type="button" onClick={() => void approveAndHandoff()} className="mt-3 min-h-10 border-2 border-black bg-[#CCFF00] px-4 py-2 text-xs font-black uppercase">Approve &amp; send to Projects</button>}
    {actionPacketId && <p className="mt-3 break-words border-2 border-black bg-white p-3 text-xs font-bold">ActionPacket ID: {actionPacketId}</p>}
   </form>
   {result.limitations.length > 0 && (
    <details className="border-t-[3px] border-black bg-[#FFF9D9] p-4 text-xs">
     <summary className="cursor-pointer font-black uppercase">Calculation limitations ({result.limitations.length})</summary>
     <ul className="mt-2 list-disc space-y-1 pl-5">
      {result.limitations.slice(0, 8).map((limitation) => <li key={limitation}>{limitation}</li>)}
     </ul>
    </details>
   )}
  </section>
 )
}
