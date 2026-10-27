import React, { useCallback } from "react"
import { BookOpen, LayoutGrid, PanelRight, Send, SlidersHorizontal, Zap } from "lucide-react"
import {
  StudioButton,
  StudioChatComposerDock,
  StudioSquareIconButton,
  StudioTextArea,
  StudioLedBadgeTab,
} from "../../studio-ui"
import { TOOLBOX_PALETTE } from "../../styles/toolboxPalette"
import { BrainChatStatusBadge } from "./BrainChatPrimitives"
import type { BrainChatStatus } from "./BrainChatPrimitives"
import { BrainComposerToolButton, BrainComposerToolRail } from "./BrainComposerPrimitives"
import "./BrainComposerDock.css"
import "./BrainComposerExperience.css"

export type BrainComposerDockProps = {
  value: string
  onChange: (value: string) => void
  onSend: () => void
  busy?: boolean
  status?: BrainChatStatus
  statusLabel?: string
  activePromptTitle?: string | null
  onClearActivePrompt?: () => void
  activeContextLabel?: string | null
  onOpenPrompts: () => void
  onOpenCapabilities: () => void
  onOpenContext: () => void
  onOpenJournal?: () => void
  promptLauncherRef?: React.Ref<HTMLButtonElement>
  contextLauncherRef?: React.Ref<HTMLButtonElement>
  composerRef?: React.Ref<HTMLTextAreaElement>
  maxFieldPx?: number
  className?: string
}

const focusComposer = (node: HTMLTextAreaElement | null) => {
  if (!node) return
  try {
    node.focus({ preventScroll: true })
  } catch {
    node.focus()
  }
}

const actionStyle = (primary: number, secondary: number): React.CSSProperties =>
  ({
    "--vt-studio-control-accent": TOOLBOX_PALETTE[primary],
    "--vt-studio-control-secondary": TOOLBOX_PALETTE[secondary],
  }) as React.CSSProperties

/**
 * Canonical Brain composer composition. The input and send action are visually
 * dominant; prompts, capabilities, context and journal remain one-tap discoverable.
 * The page continues to own submission, prompt selection and Brain state.
 */
export const BrainComposerDock: React.FC<BrainComposerDockProps> = ({
  value,
  onChange,
  onSend,
  busy = false,
  status,
  statusLabel,
  activePromptTitle,
  onClearActivePrompt,
  activeContextLabel,
  onOpenPrompts,
  onOpenCapabilities,
  onOpenContext,
  onOpenJournal,
  promptLauncherRef,
  contextLauncherRef,
  composerRef,
  maxFieldPx = 144,
  className = "",
}) => {
  const resizeField = useCallback(
    (element: HTMLTextAreaElement | null) => {
      if (!element) return
      element.style.height = "auto"
      element.style.height = `${Math.min(element.scrollHeight, maxFieldPx)}px`
    },
    [maxFieldPx],
  )

  const setRefs = useCallback(
    (node: HTMLTextAreaElement | null) => {
      if (typeof composerRef === "function") composerRef(node)
      else if (composerRef && "current" in composerRef) {
        ;(composerRef as React.MutableRefObject<HTMLTextAreaElement | null>).current = node
      }
      if (node) resizeField(node)
    },
    [composerRef, resizeField],
  )

  const resolvedStatus = status ?? (busy ? "loading" : undefined)

  return (
    <StudioChatComposerDock
      layout="toolbar-actions"
      className={`vt-brain-composer-dock ${className}`.trim()}
      aria-label="Brain message composer"
      status={
        resolvedStatus ? (
          <BrainChatStatusBadge status={resolvedStatus} label={statusLabel} />
        ) : (
          <span className="vt-brain-composer-hint">Enter to send <span aria-hidden="true">·</span> Shift+Enter for a new line</span>
        )
      }
      chips={
        activePromptTitle || activeContextLabel ? (
          <div className="flex min-w-0 flex-wrap items-center gap-1" data-vt-brain-part="composer-attachments" aria-label="Active prompt and context">
            {activePromptTitle ? (
              <StudioLedBadgeTab
                mode="badge"
                label={`Prompt: ${activePromptTitle}`}
                tone="pink"
                led="solid"
                animation="steady"
                sizeVariant="mini"
                onClick={onClearActivePrompt}
                aria-label={`Active prompt ${activePromptTitle}. Activate to clear.`}
                title="Clear active prompt"
              />
            ) : null}
            {activeContextLabel ? (
              <StudioLedBadgeTab
                mode="badge"
                label={`Context: ${activeContextLabel}`}
                tone="cyan"
                led="solid"
                animation="steady"
                sizeVariant="mini"
                onClick={onOpenContext}
                aria-label={`Active context ${activeContextLabel}. Activate to review context.`}
                title="Review active context"
              />
            ) : null}
          </div>
        ) : null
      }
      tray={
        <BrainComposerToolRail label="Brain tools">
          <BrainComposerToolButton
            buttonRef={promptLauncherRef}
            icon={<LayoutGrid size={14} />}
            label="Open Prompt Library"
            onClick={onOpenPrompts}
            style={actionStyle(11, 3)}
          >
            Prompts
          </BrainComposerToolButton>
          <BrainComposerToolButton
            icon={<SlidersHorizontal size={14} />}
            label="Open Brain capabilities"
            onClick={onOpenCapabilities}
            style={actionStyle(7, 5)}
          >
            Tools
          </BrainComposerToolButton>
          <BrainComposerToolButton
            buttonRef={contextLauncherRef}
            icon={<PanelRight size={14} />}
            label="Open channel context"
            onClick={onOpenContext}
            style={actionStyle(5, 9)}
          >
            Context
          </BrainComposerToolButton>
          {onOpenJournal ? (
            <StudioSquareIconButton
              sizeVariant="compact"
              iconSizeVariant="large"
              icon={<BookOpen aria-hidden="true" />}
              label="Open AI Journal"
              title="Open AI Journal"
              onClick={onOpenJournal}
              className="vt-brain-composer-journal"
              style={{ backgroundColor: "#36E0F6" }}
            />
          ) : null}
        </BrainComposerToolRail>
      }
      field={
        <>
          <label className="sr-only" htmlFor="brain-composer">
            Message to ViewTube Brain
          </label>
          <span id="brain-composer-help" className="sr-only">
            Press Enter to send. Shift+Enter for a new line. Use Prompts to browse saved prompts, Tools to explore Brain
            capabilities, and Context to inspect channel context.
          </span>
          <StudioTextArea
            ref={setRefs}
            id="brain-composer"
            sizeVariant="standard"
            rows={2}
            value={value}
            onChange={(event) => {
              resizeField(event.currentTarget)
              onChange(event.currentTarget.value)
            }}
            placeholder="What would you like to work on?"
            className="vt-brain-composer-input w-full min-w-0 resize-none"
            style={{ minHeight: 60, maxHeight: maxFieldPx }}
            aria-label="Message to ViewTube Brain"
            aria-describedby="brain-composer-help"
            aria-keyshortcuts="Enter Shift+Enter"
            onFocus={(event) => {
              focusComposer(event.currentTarget)
            }}
            onKeyDown={(event) => {
              if (event.key !== "Enter" || event.shiftKey || event.nativeEvent.isComposing) return
              event.preventDefault()
              if (!busy && value.trim()) onSend()
            }}
          />
        </>
      }
      action={
        <StudioButton
          data-vt-brain-component="BrainComposerSendAction"
          type="button"
          sizeVariant="standard"
          tone="accent"
          disabled={busy || !value.trim()}
          aria-label={busy ? "Sending message" : "Send message"}
          title={busy ? "Brain is working" : "Send message"}
          onClick={onSend}
          className="vt-brain-composer-send"
          style={actionStyle(7, 5)}
        >
          <span className="vt-brain-composer-send__content">
            {busy ? <Zap size={18} aria-hidden="true" /> : <Send size={18} aria-hidden="true" />}
            <span>{busy ? "Working" : "Send"}</span>
          </span>
        </StudioButton>
      }
    />
  )
}

export default BrainComposerDock

/** Safe focus helper for parent pages (drawers → field). */
export const focusBrainComposer = (ref: React.RefObject<HTMLTextAreaElement | null> | null) => {
  focusComposer(ref?.current ?? null)
}
