import React, { useMemo, useState } from "react"
import { Check, ChevronRight, Circle, Loader2, Pause, Play, ShieldCheck, X } from "lucide-react"
import {
 createWorkflowChain,
 createWorkflowStep,
 listWorkflowChains,
 updateWorkflowStep,
} from "../../services/workflowEngine"
import type { SuperToolId, SuperToolSurface, WorkflowChain, WorkflowStepStatus } from "../../types"
import { StudioButton, StudioSquareIconButton, StudioSplitLeftBadge } from "../../studio-ui"

export type BrainWorkflowRecommendationStep = {
 title: string
 surface: SuperToolSurface
 toolId: SuperToolId
 details: string
 requiresApproval?: boolean
}

export type BrainWorkflowRecommendation = {
 id: string
 title: string
 goal: string
 reason: string
 confidence?: "high" | "medium" | "low"
 steps: BrainWorkflowRecommendationStep[]
}

export type BrainWorkflowApprovalRequest = (chain: WorkflowChain, stepId: string) => boolean | Promise<boolean>

type Props = {
 recommendation: BrainWorkflowRecommendation
 onStarted?: (chain: WorkflowChain) => void | Promise<void>
 onStatusChanged?: (chain: WorkflowChain, stepId: string, status: WorkflowStepStatus) => void | Promise<void>
 /** Must call the authoritative governance API and return true only after approval is confirmed. */
 onApprovalRequested?: BrainWorkflowApprovalRequest
}

export const requestWorkflowStepApproval = async (input: {
 chain: WorkflowChain
 stepId: string
 onApprovalRequested?: BrainWorkflowApprovalRequest
 updateStep?: typeof updateWorkflowStep
 onStatusChanged?: Props["onStatusChanged"]
}): Promise<WorkflowChain | null> => {
 if (!input.onApprovalRequested) return null
 const approved = await input.onApprovalRequested(input.chain, input.stepId)
 if (!approved) return null
 const updated = (input.updateStep || updateWorkflowStep)(input.chain.id, input.stepId, "active")
 if (!updated) return null
 await input.onStatusChanged?.(updated, input.stepId, "active")
 return updated
}

const statusTone: Record<WorkflowStepStatus, string> = {
 pending: "bg-white",
 active: "bg-[#36E0F6]",
 complete: "bg-[#3FEE56]",
 blocked: "bg-[#FA618A]",
 skipped: "bg-black text-white",
}

const statusIcon = (status: WorkflowStepStatus) => {
 if (status === "complete") return <Check size={13} strokeWidth={4} />
 if (status === "active") return <Loader2 size={13} strokeWidth={3} className="animate-spin" />
 if (status === "blocked") return <X size={13} strokeWidth={4} />
 return <Circle size={11} strokeWidth={3} />
}

export const BrainWorkflowRunPanel: React.FC<Props> = ({ recommendation, onStarted, onStatusChanged, onApprovalRequested }) => {
 const [chainId, setChainId] = useState<string | null>(null)
 const [tick, setTick] = useState(0)
 const [busy, setBusy] = useState(false)
 const [approvalNotice, setApprovalNotice] = useState<string | null>(null)

 const chain = useMemo(
  () => (chainId ? listWorkflowChains().find((item) => item.id === chainId) || null : null),
  [chainId, tick],
 )

 const completed = chain?.steps.filter((step) => step.status === "complete").length || 0
 const progress = chain?.steps.length ? Math.round((completed / chain.steps.length) * 100) : 0

 const start = async () => {
  if (busy || chain) return
  setBusy(true)
  try {
   const steps = recommendation.steps.map((step, index) =>
    createWorkflowStep(
     step.title,
     step.surface,
     step.toolId,
     [
      step.details,
      step.requiresApproval ? "Approval gate: required before execution." : "Approval gate: not required.",
     ].join("\n"),
     index === 0 && !step.requiresApproval ? "active" : "pending",
    ),
   )
   const created = createWorkflowChain({
    title: recommendation.title,
    goal: recommendation.goal,
    primaryToolId: "brain-command-center",
    steps,
    provenance: [
     `brain.recommendation.${recommendation.id}`,
     `brain.confidence.${recommendation.confidence || "medium"}`,
    ],
   })
   setChainId(created.id)
   setTick((value) => value + 1)
   await onStarted?.(created)
  } finally {
   setBusy(false)
  }
 }

 const approveStep = async (stepId: string) => {
  if (!chain || busy || !onApprovalRequested) return
  setBusy(true)
  setApprovalNotice(null)
  try {
   const updated = await requestWorkflowStepApproval({ chain, stepId, onApprovalRequested, onStatusChanged })
   if (!updated) {
    setApprovalNotice("Approval was not granted. This step remains pending.")
    return
   }
   setTick((value) => value + 1)
  } catch {
   setApprovalNotice("Approval could not be confirmed. This step remains pending.")
  } finally {
   setBusy(false)
  }
 }

 const setStepStatus = async (stepId: string, status: WorkflowStepStatus) => {
  if (!chain || busy) return
  setBusy(true)
  try {
   const updated = updateWorkflowStep(chain.id, stepId, status)
   if (!updated) return
   setTick((value) => value + 1)
   await onStatusChanged?.(updated, stepId, status)
  } finally {
   setBusy(false)
  }
 }

 return (
  <section data-vt-brain-component="BrainActionPlanTracker" className="grid min-w-0 overflow-hidden border-[2px] border-black bg-white">
   <header className="border-b-[3px] border-black bg-[#FFDA47] p-3">
    <div className="flex flex-wrap items-start justify-between gap-3">
     <div className="min-w-0 flex-1">
      <div className="text-[9px] font-black uppercase tracking-[0.16em] text-black/55">Recommended action tracker</div>
      <h3 className="mt-1 text-base font-[1000] uppercase leading-tight">{recommendation.title}</h3>
      <p className="mt-1 text-[11px] font-bold leading-4 text-black/70">{recommendation.reason}</p>
     </div>
     <StudioSplitLeftBadge sizeVariant="micro" className="shrink-0">{recommendation.confidence || "medium"} confidence</StudioSplitLeftBadge>
    </div>
   </header>

   <p role="note" className="border-b border-black/20 px-3 py-2 text-[10px] font-bold leading-4 text-black/65">This tracker records your progress in this browser. It does not run tools, publish, or create canonical output records.</p>
   {chain ? (
    <div>
     <div className="border-b-[2px] border-black p-3">
      <div className="mb-1 flex items-center justify-between gap-3 text-[10px] font-black uppercase">
       <span>Tracking progress</span><span>{progress}%</span>
      </div>
      <div role="progressbar" aria-label="Local action-plan tracking progress" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress} aria-valuetext={`${completed} of ${chain.steps.length} steps marked complete`} className="h-4 overflow-hidden border-[2px] border-black bg-white">
       <div className="h-full border-r-[2px] border-black bg-[#3FEE56]" style={{ width: `${progress}%` }} />
      </div>
     </div>
     <ol className="divide-y-2 divide-black">
      {chain.steps.map((step, index) => {
       const source = recommendation.steps[index]
       const approvalPending = Boolean(source?.requiresApproval && step.status === "pending")
       return (
        <li key={step.id} className="grid grid-cols-[28px_minmax(0,1fr)_auto] items-center gap-2 p-2.5">
         <span className={`grid h-7 w-7 place-items-center rounded-[6px] border-[2px] border-black ${statusTone[step.status]}`}>
          {statusIcon(step.status)}
         </span>
         <div className="min-w-0">
          <div className="truncate text-[11px] font-[1000] uppercase">{step.title}</div>
          <div className="truncate text-[9px] font-bold uppercase tracking-[0.06em] text-black/50">{step.ownerSurface} · {step.toolId}</div>
          {approvalPending && !onApprovalRequested ? <p id={`approval-unavailable-${step.id}`} role="note" className="mt-1 break-words text-[9px] font-bold leading-4 text-black/65">Approval is required, but no governance handler is connected. This tracker cannot approve or execute the action.</p> : null}
         </div>
         <div className="flex items-center gap-1">
          {approvalPending ? (
           <StudioButton type="button" sizeVariant="compact" tone="success" disabled={busy || !onApprovalRequested} aria-describedby={!onApprovalRequested ? `approval-unavailable-${step.id}` : undefined} title={!onApprovalRequested ? "Governance approval is not connected" : "Request authoritative approval"} onClick={() => approveStep(step.id)} icon={<ShieldCheck size={12} aria-hidden="true" />}>{onApprovalRequested ? "Request approval" : "Approval required"}</StudioButton>
          ) : step.status === "active" ? (
           <>
            <StudioSquareIconButton sizeVariant="compact" tone="success" icon={<Check size={13} strokeWidth={4} aria-hidden="true" />} label={`Mark tracking step complete: ${step.title}`} disabled={busy} onClick={() => setStepStatus(step.id, "complete")} />
            <StudioSquareIconButton sizeVariant="compact" tone="danger" icon={<Pause size={12} aria-hidden="true" />} label={`Mark tracking step blocked: ${step.title}`} disabled={busy} onClick={() => setStepStatus(step.id, "blocked")} />
           </>
          ) : step.status === "pending" ? (
           <StudioSquareIconButton sizeVariant="compact" tone="accent" icon={<Play size={12} fill="currentColor" aria-hidden="true" />} label={`Start tracking step: ${step.title}`} disabled={busy} onClick={() => setStepStatus(step.id, "active")} />
          ) : null}
          <ChevronRight size={14} className="text-black/35" />
         </div>
        </li>
       )
      })}
     </ol>
    </div>
   ) : (
    <div className="p-3">
     <p className="mb-3 text-[11px] font-bold leading-4 text-black/65">{recommendation.goal}</p>
     <StudioButton type="button" sizeVariant="standard" tone="success" disabled={busy} loading={busy} onClick={start} icon={busy ? <Loader2 size={14} aria-hidden="true" /> : <Play size={14} fill="currentColor" aria-hidden="true" />}>Track action plan</StudioButton>
    </div>
   )}
   {approvalNotice ? <p role="status" className="border-t border-black/20 px-3 py-2 text-[10px] font-bold leading-4">{approvalNotice}</p> : null}
  </section>
 )
}

export default BrainWorkflowRunPanel
