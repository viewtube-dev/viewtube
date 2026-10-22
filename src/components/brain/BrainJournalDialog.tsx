import React, { useEffect, useRef } from "react"
import { X } from "lucide-react"
import { StudioButton, StudioTextArea } from "../../studio-ui"

export type BrainJournalDialogProps = {
 value: string
 onChange: (value: string) => void
 onClose: () => void
 onSave: () => void
}

/** Accessible modal wrapper for the existing Brain journal capture action. */
export const BrainJournalDialog: React.FC<BrainJournalDialogProps> = ({
 value,
 onChange,
 onClose,
 onSave,
}) => {
 const dialogRef = useRef<HTMLDivElement | null>(null)
 const closeRef = useRef<HTMLButtonElement | null>(null)
 const inputRef = useRef<HTMLTextAreaElement | null>(null)

 useEffect(() => {
  const previouslyFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null
  inputRef.current?.focus()

  const onKeyDown = (event: KeyboardEvent) => {
   if (event.key === "Escape") {
    event.preventDefault()
    onClose()
    return
   }
   if (event.key !== "Tab") return

   const focusable = Array.from(
    dialogRef.current?.querySelectorAll<HTMLElement>(
     'button:not([disabled]), textarea:not([disabled]), input:not([disabled]), [href], [tabindex]:not([tabindex="-1"])',
    ) || [],
   )
   if (!focusable.length) return
   const first = focusable[0]
   const last = focusable[focusable.length - 1]
   if (event.shiftKey && document.activeElement === first) {
    event.preventDefault()
    last.focus()
   } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault()
    first.focus()
   }
  }

  document.addEventListener("keydown", onKeyDown)
  return () => {
   document.removeEventListener("keydown", onKeyDown)
   previouslyFocused?.focus()
  }
 }, [onClose])

 return (
  <div className="absolute inset-0 z-50 grid place-items-center bg-black/40 p-4">
   <section
    ref={dialogRef}
    role="dialog"
    aria-modal="true"
    aria-labelledby="brain-journal-dialog-title"
    aria-describedby="brain-journal-dialog-help"
    className="w-full max-w-2xl overflow-hidden rounded-[8px] border-[3px] border-black bg-white"
   >
    <div className="flex items-center justify-between gap-3 border-b-[2px] border-black bg-[#36E0F6] px-4 py-3">
     <h2 id="brain-journal-dialog-title" className="text-xl font-[1000] uppercase">Save To AI Journal</h2>
     <StudioButton ref={closeRef} sizeVariant="compact" tone="neutral" type="button" onClick={onClose} aria-label="Close AI Journal dialog">
      <X size={14} aria-hidden="true" /> Close
     </StudioButton>
    </div>
    <div className="grid gap-3 p-4">
     <label htmlFor="brain-journal-entry" className="text-xs font-[1000] uppercase">What should Brain remember?</label>
     <StudioTextArea
      ref={inputRef}
      id="brain-journal-entry"
      data-vt-brain-part="journal-entry-input"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      sizeVariant="standard"
      rows={4}
      placeholder="A goal, content style note, audience insight, constraint, or decision you want the Brain to remember."
      className="min-h-[92px] resize-none"
      aria-describedby="brain-journal-dialog-help"
     />
     <p id="brain-journal-dialog-help" className="text-xs font-bold leading-5 text-black/70">
      This saves a creator note through the existing AI Journal flow. Saving a note does not automatically promote it to confirmed knowledge.
     </p>
     <div className="flex flex-wrap justify-end gap-1">
      <StudioButton data-vt-brain-part="journal-cancel" sizeVariant="compact" tone="neutral" type="button" onClick={onClose}>Cancel</StudioButton>
      <StudioButton data-vt-brain-part="journal-save" sizeVariant="compact" tone="success" type="button" disabled={!value.trim()} onClick={onSave}>Remember this</StudioButton>
     </div>
    </div>
   </section>
  </div>
 )
}

export default BrainJournalDialog
