import React, { useEffect, useRef, useState } from "react"
import { StudioButton, StudioTextArea } from "../../studio-ui"
import {
 submitBrainContextCorrection,
 type BrainContextCorrectionResult,
 type BrainContextCorrectionSource,
} from "../../services/brain/BrainContextCorrection"

export interface BrainContextCorrectionItem {
 id: string
 statement: string
 knowledgeClass: string
 lifecycleState: string
 confirmationState: string | null
 source: BrainContextCorrectionSource
 sourceId: string
 evidenceRefs: string[]
 status: "confirmed" | "inferred"
}

export const BrainContextCorrectionDialog: React.FC<{
 channelId: string | null
 item: BrainContextCorrectionItem
 onClose: () => void
 onApplied: () => void
}> = ({ channelId, item, onClose, onApplied }) => {
 const [correctedStatement, setCorrectedStatement] = useState(item.statement)
 const [busy, setBusy] = useState(false)
 const busyRef = useRef(false)
 const [result, setResult] = useState<BrainContextCorrectionResult | null>(null)
 const [error, setError] = useState<string | null>(null)
 const valueRef = useRef<HTMLTextAreaElement | null>(null)
 const dialogRef = useRef<HTMLElement | null>(null)

 busyRef.current = busy

 useEffect(() => {
  const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null
  valueRef.current?.focus()
  const handleKeyDown = (event: KeyboardEvent) => {
   if (event.key === "Escape" && !busyRef.current) {
    event.preventDefault()
    onClose()
    return
   }
   if (event.key === "Tab") {
    const focusable = Array.from(dialogRef.current?.querySelectorAll<HTMLElement>(
     'button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])',
    ) || []).filter((element) => element.getAttribute("aria-hidden") !== "true")
    if (!focusable.length) {
     event.preventDefault()
     return
    }
    const first = focusable[0]
    const last = focusable[focusable.length - 1]
    const active = document.activeElement
    if (event.shiftKey && (active === first || !dialogRef.current?.contains(active))) {
     event.preventDefault()
     last.focus()
    } else if (!event.shiftKey && (active === last || !dialogRef.current?.contains(active))) {
     event.preventDefault()
     first.focus()
    }
   }
  }
  document.addEventListener("keydown", handleKeyDown)
  return () => {
   document.removeEventListener("keydown", handleKeyDown)
   previousFocus?.focus()
  }
 }, [onClose])

 const submit = async (event: React.FormEvent<HTMLFormElement>) => {
  event.preventDefault()
  if (!channelId || busy || result) return
  setBusy(true)
  setError(null)
  try {
   const next = await submitBrainContextCorrection({
    channelId,
    source: item.source,
    sourceId: item.sourceId,
    currentStatement: item.statement,
    correctedStatement,
    evidenceRefs: item.evidenceRefs,
   })
   setResult(next)
  } catch (caught) {
   setError(caught instanceof Error ? caught.message : "The correction could not be submitted.")
  } finally {
   setBusy(false)
  }
 }

 const applied = result?.status === "applied"
 return (
  <div className="fixed inset-0 z-[100] grid place-items-center bg-black/55 p-3" data-vt-brain-context-correction-backdrop>
   <section
    ref={dialogRef}
    role="dialog"
    aria-modal="true"
    aria-labelledby="brain-context-correction-title"
    aria-describedby="brain-context-correction-description"
    data-vt-brain-component="BrainContextCorrectionDialog"
    className="grid max-h-[90vh] w-full max-w-xl gap-3 overflow-y-auto border-[3px] border-black bg-white p-4 shadow-[5px_5px_0_0_#000]"
   >
    <header className="grid gap-1 border-b-2 border-black pb-2">
     <p className="text-[9px] font-[1000] uppercase tracking-[0.12em]">Brain context governance</p>
     <h2 id="brain-context-correction-title" className="text-base font-[1000] uppercase leading-5">Propose context correction</h2>
     <p id="brain-context-correction-description" className="text-sm font-semibold leading-5">
      Review the current statement and enter the correction. A proposal is not treated as applied until the canonical owner confirms it.
     </p>
    </header>
    <div className="grid gap-1 rounded border border-black/25 bg-[#f8f8f4] p-2">
     <p className="text-[9px] font-[1000] uppercase">Current statement · {item.knowledgeClass.replace(/_/g, " ")}</p>
     <p className="break-words text-sm font-bold">{item.statement}</p>
     <p className="break-all text-[10px] font-semibold text-black/60">Source: {item.source} · {item.sourceId}</p>
     <p className="text-[10px] font-semibold text-black/60">State: {item.status} · lifecycle {item.lifecycleState} · confirmation {item.confirmationState || "not recorded"}</p>
    </div>
    {result ? (
     <div
      role={result.status === "blocked" || result.status === "held" || result.status === "unresolved" ? "alert" : "status"}
      aria-live="polite"
      data-vt-brain-context-correction-status={result.status}
      className="grid gap-1 border-2 border-black bg-[#f8f8f4] p-3"
     >
      <p className="text-[10px] font-[1000] uppercase">{result.status.replace(/_/g, " ")}</p>
      <p className="break-words text-sm font-semibold leading-5">{result.message}</p>
      <p className="break-all text-[10px] font-bold">Learning entry: {result.entryId}</p>
      {"claimId" in result ? <p className="break-all text-[10px] font-bold">Canonical claim: {result.claimId}</p> : null}
     </div>
    ) : (
     <form className="grid gap-2" onSubmit={submit}>
      <label htmlFor="brain-context-correction-value" className="text-[10px] font-[1000] uppercase">Corrected statement</label>
      <StudioTextArea
       ref={valueRef}
       id="brain-context-correction-value"
       name="correctedStatement"
       sizeVariant="standard"
       required
       rows={4}
       placeholder="Corrected statement"
       value={correctedStatement}
       onChange={(event) => setCorrectedStatement(event.target.value)}
       aria-describedby="brain-context-correction-hint"
       className="min-h-24 w-full resize-y"
      />
      <p id="brain-context-correction-hint" className="text-xs font-semibold leading-4 text-black/65">
       Nothing changes until you submit this correction. Hypotheses and learning candidates are recorded as proposals because they do not share the memory-claim update contract.
      </p>
      {error ? <p role="alert" className="border-2 border-black bg-[#FF7AC8] p-2 text-xs font-bold">{error}</p> : null}
      {!channelId ? <p role="alert" className="text-xs font-bold">An active channel is required to submit a correction.</p> : null}
      <div className="flex flex-wrap justify-end gap-2 border-t-2 border-black pt-2">
       <StudioButton type="button" sizeVariant="standard" tone="neutral" disabled={busy} onClick={onClose}>Cancel</StudioButton>
       <StudioButton type="submit" sizeVariant="standard" tone="accent" disabled={busy || !channelId}>{busy ? "Submitting…" : "Save correction"}</StudioButton>
      </div>
     </form>
    )}
    {result ? (
     <div className="flex flex-wrap justify-end gap-2 border-t-2 border-black pt-2">
      <StudioButton type="button" sizeVariant="standard" tone="neutral" onClick={onClose}>Close</StudioButton>
      {applied ? <StudioButton type="button" sizeVariant="standard" tone="success" onClick={() => { onApplied(); onClose() }}>Close and verify next turn</StudioButton> : null}
     </div>
    ) : null}
   </section>
  </div>
 )
}

export default BrainContextCorrectionDialog
