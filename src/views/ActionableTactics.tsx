import React, { useState, useEffect, useCallback } from "react"
import {
 Zap,
 Search,
 TrendingUp,
 Loader2,
 Sparkles,
 Settings,
 Copy,
 ChevronUp,
} from "lucide-react"
import Markdown from "react-markdown"
import {
 generateActionableTactics,
 elaborateTactic,
 TACTICS_SYSTEM_INSTRUCTIONS,
} from "../services/gemini"
import type { Tactic, CreatorStrategyInput } from "../types"
import { useBrain } from "../context/useBrain"
import { CustomIcon } from "../components/CustomIcon"
import {
 ToolboxScaffold,
 SubToolbox,
} from "../components/Toolbox"
import { toolboxSystem } from "../components/toolboxSystem"
import { PostActionReflection } from "../components/PostActionReflection"
import { ViewTubeHandoffReceiver } from "../components/ViewTubeHandoffReceiver"
import type { ViewTubeActionPacket } from "../services/viewTubeToolChains"
import { validateTacticProposal, type OpportunityTacticsPacket, type TacticProposal } from "../services/brain/OpportunityIntelligence"
import { SubToolboxButton } from "../components/subtoolbox/SubToolboxPrimitives"
import {
 StudioActionButton,
  StudioButton,
 StudioInput,
 StudioTextInput,
 select,
 StudioTextArea,
} from "../studio-ui"

// --- Sub-components ---

const TacticCard: React.FC<{
 tactic: Tactic
 index: number
 niche: string
 setToast: (msg: string) => void
}> = ({ tactic, index, niche, setToast }) => {
 const [expanded, setExpanded] = useState(false)
 const [elaboration, setElaboration] = useState<string | null>(null)
 const [loading, setLoading] = useState(false)

 const handleExpand = async () => {
  if (!expanded && !elaboration) {
   setLoading(true)
   try {
    const result = await elaborateTactic(tactic, niche)
    setElaboration(result || "No elaboration available.")
   } catch (e) {
    console.error(e)
    setElaboration("Failed to load elaboration.")
   } finally {
    setLoading(false)
   }
  }
  setExpanded(!expanded)
 }

 return (
  <div className="bg-white border-[4px] border-black rounded-2xl shadow-[6px_6px_0px_0px_black] overflow-hidden flex flex-col transform hover:-translate-y-1 transition-all mb-4">
   <div className="p-6 flex gap-6">
    <span className="font-black text-4xl opacity-10 transition-all duration-500 shrink-0">
     {(index + 1).toString().padStart(2, "0")}
    </span>
    <div className="flex-1 space-y-3">
     <div className="flex items-start justify-between gap-4">
      <h3 className="font-black uppercase tracking-tight text-xl text-black">
       {tactic.title}
      </h3>
      <SubToolboxButton
       level="l2"
       size="compact"
       tone="neutral"
       selected={expanded}
       onClick={handleExpand}
       icon={loading ? <Loader2 className="animate-spin" size={14} /> : expanded ? <ChevronUp size={14} /> : <Sparkles size={14} />}>
       {expanded ? "Hide Details" : "Elaborate"}
      </SubToolboxButton>
     </div>
     <p className="text-sm font-bold leading-relaxed text-black/70">
      {tactic.action}
     </p>

     {expanded && (
      <div className="pt-4 mt-4 border-t-[3px] border-black/10 space-y-4">
       {loading ? (
        <div className="flex items-center gap-3 py-4">
         <Loader2 className="animate-spin text-[#FF3399]" size={20} />
         <span className="font-black text-[10px] uppercase tracking-widest opacity-40">
          Deep Dive Analysis...
         </span>
        </div>
       ) : (
        <div className="space-y-4">
         <div className="flex justify-end">
          <SubToolboxButton
           level="l2"
           size="compact"
           tone="neutral"
           icon={<Copy size={12} />}
           onClick={() => {
            navigator.clipboard.writeText(elaboration || "")
            setToast("Copied to clipboard")
           }}>
           Copy Analysis
          </SubToolboxButton>
         </div>
         <div className="prose prose-sm max-w-none font-bold text-black/80">
          <Markdown>{elaboration || ""}</Markdown>
         </div>
        </div>
       )}
      </div>
     )}

     <div className="pt-4 border-t-[3px] border-black/10">
      <div className="flex items-center gap-2">
       <Zap size={14} className="text-[#FF3399] fill-[#FF3399]" />
       <p className="text-[10px] font-black uppercase tracking-wider text-[#FF3399] opacity-80">
        Edge: {tactic.whyItWorks}
       </p>
      </div>
     </div>
    </div>
   </div>
  </div>
 )
}

const ActionableTactics: React.FC<{
 collapsible?: boolean
 isOpenInitial?: boolean
 paletteIndex?: number
}> = ({ collapsible = false, isOpenInitial = true, paletteIndex = 0 }) => {
 const { brain } = useBrain()
 const [isOpen, setIsOpen] = useState(isOpenInitial)
 const [loading, setLoading] = useState(false)
 const [tactics, setTactics] = useState<Tactic[]>([])
 const [incomingOpportunity, setIncomingOpportunity] = useState<OpportunityTacticsPacket | null>(null)
 const [linkedProposals, setLinkedProposals] = useState<TacticProposal[]>([])
 const validLinkedProposalCount = incomingOpportunity
  ? linkedProposals.filter((proposal) => validateTacticProposal(incomingOpportunity, proposal).length === 0).length
  : 0
 const [filterText, setFilterText] = useState("")
 const [toast, setToast] = useState<string | null>(null)
 const [input, setInput] = useState<CreatorStrategyInput>({
  niche: brain.targetNiche || "",
  videoLength: "10-15 mins",
  topic: brain.coreConcept || "",
  audience: "",
  timeAvailable: "5 hours",
  tools: "",
  systemInstructionId: "viral-growth",
  avoidTopics: "",
 })

 const handleIncomingPacket = useCallback((packet: ViewTubeActionPacket) => {
  if (packet.sourceToolId !== "opportunity-radar" || packet.payloadKind !== "evidence") return
  const payload = packet.payload as Partial<OpportunityTacticsPacket> | null
  if (!payload || payload.schemaVersion !== "vt-opportunity-tactics-handoff-v1"
   || payload.validationState !== "accepted"
   || typeof payload.opportunityId !== "string"
   || typeof payload.channelId !== "string"
   || !Array.isArray(payload.evidenceIds)) return
  const opportunity = payload as OpportunityTacticsPacket
  setIncomingOpportunity(opportunity)
  setInput((current) => ({
   ...current,
   topic: (opportunity.entity || opportunity.opportunityId) + " — accepted opportunity " + opportunity.opportunityId,
   avoidTopics: [
    current.avoidTopics,
    "Radar evidence IDs: " + opportunity.evidenceIds.join(", ") + ".",
    "Snapshot/window: " + (opportunity.provenance.sourceSnapshotId || "unknown") + " / " + (opportunity.provenance.window || "unknown") + ".",
    "Limitations: " + opportunity.limitations.join(" ") + " Treat all tactics as hypotheses; do not claim causality.",
   ].filter(Boolean).join("\n"),
  }))
 }, [])
 useEffect(() => {
  if (toast) {
   const timer = setTimeout(() => setToast(null), 3000)
   return () => clearTimeout(timer)
  }
 }, [toast])

 const handleGenerate = async () => {
  setLoading(true)
  try {
   const result = await generateActionableTactics(input)
   setTactics(result)
   setLinkedProposals(incomingOpportunity ? result.map((tactic, index): TacticProposal => ({
    id: "tactic:" + incomingOpportunity.opportunityId + ":" + (index + 1),
    sourceOpportunityId: incomingOpportunity.opportunityId,
    channelId: incomingOpportunity.channelId,
    evidenceIds: [...incomingOpportunity.evidenceIds],
    targetOutcome: tactic.title,
    actionSteps: [tactic.action],
    prerequisites: [],
    expectedImpact: { hypothesis: tactic.whyItWorks, confidence: null, horizon: null },
    risks: [...incomingOpportunity.limitations, "Expected impact is a hypothesis and has not been measured."],
    successMetrics: incomingOpportunity.metric
     ? [{ metricId: incomingOpportunity.metric, targetDirection: "increase", guardrail: false }]
     : [],
    approvalState: "pending",
    operationId: null,
   })) : [])
  } catch (error) {
   console.error(error)
  } finally {
   setLoading(false)
  }
 }

 const filteredTactics = tactics.filter(
  (t) =>
   t.title.toLowerCase().includes(filterText.toLowerCase()) ||
   t.action.toLowerCase().includes(filterText.toLowerCase()) ||
   t.whyItWorks.toLowerCase().includes(filterText.toLowerCase()),
 )

 return (
  <ToolboxScaffold
   title="Tactics Engine"
   subtitle="Actionable Strategy Synthesis"
   headerColor="bg-[#CCFF00]"
   icon={<CustomIcon name="zap" size={40} />}
   iconBoxColor="bg-[#FF3399]"
   paletteIndex={paletteIndex}
   collapsible={collapsible}
   isOpen={isOpen}
   onToggle={() => setIsOpen(!isOpen)}>
   <div className="animate-fade-in">
    <ViewTubeHandoffReceiver targetToolId="tactics-engine" onPacket={handleIncomingPacket} />
    {incomingOpportunity && (
     <div className="mb-4 rounded-xl border-[3px] border-black bg-[#E7FFB0] p-4 shadow-[4px_4px_0_#000]">
      <div className="text-[10px] font-black uppercase tracking-widest">Accepted Opportunity · Tactic Draft Context</div>
      <div className="mt-1 text-lg font-black">{incomingOpportunity.entity || incomingOpportunity.opportunityId}</div>
      <div className="mt-1 text-xs font-bold">Source {incomingOpportunity.opportunityId} · {incomingOpportunity.evidenceIds.length} evidence reference(s) · {incomingOpportunity.provenance.window || "window unknown"}</div>
      <p className="mt-2 text-xs font-semibold">Generated tactics remain proposals. No project, experiment, or external action is created by generating them.</p>
      {linkedProposals.length > 0 && <p className="mt-2 text-xs font-black uppercase">{linkedProposals.length} linked tactic draft(s) · {validLinkedProposalCount} ready for review · all pending creator review</p>}
     </div>
    )}
    <div className={toolboxSystem.shellRow}>
     {/* Left Column: Input Form */}
     <div className={toolboxSystem.inputColumn}>
      <SubToolbox
       title="Strategy Params"
       icon={<Settings size={20} />}
       headerColor="bg-[#CCFF00]"
       paletteIndex={paletteIndex}
       collapsible
       isOpenInitial={true}>
       <div className="space-y-3 p-1">
        <div className="space-y-1">
         <label className={toolboxSystem.label}>Niche</label>
         <StudioInput
          value={input.niche}
          onChange={(e) => setInput({ ...input, niche: e.target.value })}
          placeholder="e.g. Tech Reviews"
         />
        </div>
        <div className="space-y-1">
         <label className={toolboxSystem.label}>Topic</label>
         <StudioInput
          value={input.topic}
          onChange={(e) => setInput({ ...input, topic: e.target.value })}
          placeholder="Video subject?"
         />
        </div>
        <div className="space-y-1">
         <label className={toolboxSystem.label}>Audience</label>
         <StudioInput
          value={input.audience}
          onChange={(e) => setInput({ ...input, audience: e.target.value })}
          placeholder="Who are they?"
         />
        </div>
        <div className="space-y-1">
         <label className={toolboxSystem.label}>Video Length</label>
         <StudioInput
          value={input.videoLength}
          onChange={(e) => setInput({ ...input, videoLength: e.target.value })}
         />
        </div>
        <div className="space-y-1">
         <label className={toolboxSystem.label}>Constraints</label>
         <StudioTextArea
          value={input.avoidTopics}
          onChange={(e) => setInput({ ...input, avoidTopics: e.target.value })}
          placeholder="e.g. No clickbait..."
         />
        </div>
        <div className="space-y-1">
         <label className={toolboxSystem.label}>AI Mode</label>
         <select data-vt-studio-control="true" data-size="standard"
          value={input.systemInstructionId}
          onChange={(e) =>
           setInput({ ...input, systemInstructionId: e.target.value })
          }>
          {Object.keys(TACTICS_SYSTEM_INSTRUCTIONS).map((id) => (
           <option key={id} value={id}>
            {id.replace("-", " ").toUpperCase()}
           </option>
          ))}
         </select>
        </div>
        <StudioActionButton
         className="w-full"
         onClick={handleGenerate}
         loading={loading}>
         {loading ? (
          <Loader2 className="animate-spin" size={20} />
         ) : (
          <Zap size={20} className="fill-black" />
         )}
         {loading ? "Analyzing..." : "Gen 20 Tactics"}
        </StudioActionButton>
       </div>
      </SubToolbox>
     </div>

     {/* Right Column: Tactics List */}
     <div className={toolboxSystem.resultPanel}>
      <div className="flex items-center justify-between mb-8 border-b-[4px] border-black pb-4">
       <div className="flex items-center gap-3">
        <TrendingUp size={32} />
        <h2 className="text-4xl font-[1000] uppercase tracking-tighter">
         Tactics
        </h2>
       </div>
       {tactics.length > 0 && (
        <div className="flex items-center gap-4">
         <div className="relative w-48">
          <Search
           className="pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2 text-black/30"
           size={16}
          />
          <StudioTextInput type="search"
           placeholder="FILTER..."
           value={filterText}
           onChange={(e) => setFilterText(e.target.value)}
           className="pl-10 text-[10px] uppercase"
          />
         </div>
        </div>
       )}
      </div>

      {filteredTactics.length > 0 ? (
       <div className="space-y-4">
        {filteredTactics.map((tactic, i) => (
         <TacticCard
          key={i}
          tactic={tactic}
          index={i}
          niche={input.niche}
          setToast={setToast}
         />
        ))}

        {/* Brain Reflection UI */}
        <div className="mt-8 animate-in slide-in-from-bottom-4 duration-700">
         <PostActionReflection toolId="ACTIONABLE_TACTICS" />
        </div>
       </div>
      ) : (
       <div className="h-96 rounded-[32px] border-[4px] border-black border-dashed flex flex-col items-center justify-center opacity-20 space-y-6">
        <TrendingUp size={80} />
        <p className="font-black text-sm uppercase tracking-[0.4em]">
         {tactics.length > 0 ? "No Matches" : "Awaiting Strategy"}
        </p>
       </div>
      )}
     </div>
    </div>
   </div>

   {/* Toast */}
   {toast && (
    <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] px-8 py-4 rounded-2xl bg-black text-[#CCFF00] font-black uppercase text-sm tracking-widest shadow-[8px_8px_0px_0px_#CCFF00] flex items-center gap-4 border-[3px] border-[#CCFF00] animate-bounce-in">
     <Sparkles size={20} />
     {toast}
    </div>
   )}
  </ToolboxScaffold>
 )
}

export default ActionableTactics
