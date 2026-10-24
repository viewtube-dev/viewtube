import React, { useId } from "react"
import { BookOpen, LayoutGrid, PanelRight, Plus, Send } from "lucide-react"
import { StudioSplitLeftButton, StudioSquareIconButton, StudioTextArea } from "../../studio-ui"
import "./BrainChatShell.css"

export type BrainComposerBarProps = {
  value: string; onChange: (value: string) => void; onSend: () => void; busy?: boolean; placeholder?: string
  textareaRef?: React.RefObject<HTMLTextAreaElement | null>; onKeyDown?: React.KeyboardEventHandler<HTMLTextAreaElement>
  onOpenPrompts?: () => void; onOpenContext?: () => void; onOpenJournal?: () => void
  accessories?: React.ReactNode; className?: string
}
export const BrainComposerBar: React.FC<BrainComposerBarProps> = ({
  value, onChange, onSend, busy = false, placeholder = "Ask about your next video, audience, analytics, or goals…",
  textareaRef, onKeyDown, onOpenPrompts, onOpenContext, onOpenJournal, accessories, className = "",
}) => {
  const fieldId = useId()
  const canSend = Boolean(value.trim()) && !busy
  return <div data-vt-brain-composition="BrainComposerBar" className={`vt-brain-composer-bar ${className}`.trim()}>
    {(onOpenPrompts || onOpenContext) ? <div className="vt-brain-composer-bar__launchers" role="group" aria-label="Open Brain tools">
      {onOpenPrompts ? <StudioSplitLeftButton sizeVariant="compact" icon={<LayoutGrid aria-hidden="true" />} onClick={onOpenPrompts} className="min-w-0 w-full" aria-label="Open prompt library">PROMPT LIBRARY</StudioSplitLeftButton> : null}
      {onOpenContext ? <StudioSplitLeftButton sizeVariant="compact" icon={<PanelRight aria-hidden="true" />} onClick={onOpenContext} className="min-w-0 w-full" aria-label="Open channel context">CHANNEL CONTEXT</StudioSplitLeftButton> : null}
    </div> : null}
    {(accessories || onOpenJournal) ? <div className="vt-brain-composer-bar__accessories" role="group" aria-label="Composer options">
      {onOpenJournal ? <StudioSquareIconButton sizeVariant="compact" icon={<BookOpen aria-hidden="true" />} label="Journal" title="Open AI Journal" onClick={onOpenJournal} /> : null}{accessories}
    </div> : null}
    <div className="vt-brain-composer-bar__row">
      <label className="sr-only" htmlFor={fieldId}>Message to ViewTube Brain</label>
      <StudioTextArea ref={textareaRef as React.Ref<HTMLTextAreaElement>} id={fieldId} sizeVariant="compact" rows={2} value={value} disabled={busy} placeholder={placeholder} onChange={event => onChange(event.target.value)} onKeyDown={onKeyDown} className="vt-brain-composer-bar__field" aria-label="Message to ViewTube Brain" />
      <StudioSplitLeftButton sizeVariant="compact" icon={<Send aria-hidden="true" />} disabled={!canSend} onClick={onSend} aria-label={busy ? "Sending" : "Send message"} className="vt-brain-composer-bar__send shrink-0">SEND</StudioSplitLeftButton>
    </div>
  </div>
}
BrainComposerBar.displayName = "BrainComposerBar"
export const BrainComposerMoreButton: React.FC<{ onClick?: () => void }> = ({ onClick }) => <StudioSquareIconButton sizeVariant="compact" icon={<Plus aria-hidden="true" />} label="More" title="More tools" onClick={onClick} />
