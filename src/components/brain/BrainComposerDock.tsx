import React, { useCallback } from "react"
import { BookOpen, LayoutGrid, PanelRight, Send, Zap } from "lucide-react"
import {
  StudioChatComposerDock,
  StudioSplitTwoLineButton,
  StudioSquareIconButton,
  StudioTextArea,
  StudioLedBadgeTab,
} from "../../studio-ui"
import { TOOLBOX_PALETTE } from "../../styles/toolboxPalette"
import { BrainChatStatusBadge } from "./BrainChatPrimitives"
import type { BrainChatStatus } from "./BrainChatPrimitives"

export type BrainComposerDockProps = {
  value: string
  onChange: (value: string) => void
  onSend: () => void
  busy?: boolean
  status?: BrainChatStatus
  statusLabel?: string
  activePromptTitle?: string | null
  onClearActivePrompt?: () => void
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

/**
 * Brain composer for current branch: mounts inside BrainChatShell.composer.
 * Tray: Prompt Library / Capabilities / Channel Context / Journal.
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
      className={className}
      aria-label="Brain composer"
      status={resolvedStatus ? <BrainChatStatusBadge status={resolvedStatus} label={statusLabel} /> : null}
      chips={
        activePromptTitle ? (
          <StudioLedBadgeTab
            mode="badge"
            label={activePromptTitle}
            tone="pink"
            led="solid"
            animation="steady"
            sizeVariant="mini"
            onClick={onClearActivePrompt}
            aria-label={`Active prompt ${activePromptTitle}. Activate to clear.`}
          />
        ) : null
      }
      tray={
        <>
          <StudioSplitTwoLineButton
            ref={promptLauncherRef}
            sizeVariant="compact"
            icon={<LayoutGrid aria-hidden="true" />}
            firstLine="PROMPT"
            secondLine="LIBRARY"
            onClick={onOpenPrompts}
            aria-label="Open prompt library"
            aria-haspopup="dialog"
            className="min-w-0"
            style={
              {
                "--vt-studio-control-accent": TOOLBOX_PALETTE[11],
                "--vt-studio-control-secondary": TOOLBOX_PALETTE[3],
              } as React.CSSProperties
            }
          />
          <StudioSplitTwoLineButton
            sizeVariant="compact"
            icon={<Zap aria-hidden="true" />}
            firstLine="CAPABILITIES"
            secondLine="BROWSER"
            onClick={onOpenCapabilities}
            aria-label="Open capabilities browser"
            aria-haspopup="dialog"
            className="min-w-0"
            style={
              {
                "--vt-studio-control-accent": TOOLBOX_PALETTE[7],
                "--vt-studio-control-secondary": TOOLBOX_PALETTE[5],
              } as React.CSSProperties
            }
          />
          <StudioSplitTwoLineButton
            ref={contextLauncherRef}
            sizeVariant="compact"
            icon={<PanelRight aria-hidden="true" />}
            firstLine="CHANNEL"
            secondLine="CONTEXT"
            onClick={onOpenContext}
            aria-label="Open channel context"
            aria-haspopup="dialog"
            className="min-w-0"
            style={
              {
                "--vt-studio-control-accent": TOOLBOX_PALETTE[5],
                "--vt-studio-control-secondary": TOOLBOX_PALETTE[9],
              } as React.CSSProperties
            }
          />
          {onOpenJournal ? (
            <StudioSquareIconButton
              sizeVariant="compact"
              iconSizeVariant="large"
              icon={<BookOpen aria-hidden="true" />}
              label="Open AI Journal"
              title="Open AI Journal"
              onClick={onOpenJournal}
              className="shrink-0"
              style={{ backgroundColor: "#36E0F6" }}
            />
          ) : null}
        </>
      }
      field={
        <>
          <label className="sr-only" htmlFor="brain-composer">
            Ask ViewTube Brain
          </label>
          <span id="brain-composer-help" className="sr-only">
            Press Enter to send. Shift+Enter for a new line. Use the tool tray for prompts, capabilities, and channel
            context.
          </span>
          <StudioTextArea
            ref={setRefs}
            id="brain-composer"
            sizeVariant="compact"
            rows={2}
            value={value}
            onChange={(event) => {
              resizeField(event.currentTarget)
              onChange(event.currentTarget.value)
            }}
            placeholder="Ask about your next video, audience, analytics, goals, SEO, or publishing…"
            className="w-full min-h-[44px] min-w-0 resize-none"
            style={{ minHeight: 52, maxHeight: maxFieldPx }}
            aria-label="Ask ViewTube Brain"
            aria-describedby="brain-composer-help"
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
        <StudioSplitTwoLineButton
          data-vt-brain-component="BrainComposerSendAction"
          sizeVariant="compact"
          icon={busy ? <Zap aria-hidden="true" /> : <Send aria-hidden="true" />}
          firstLine={busy ? "BRAIN" : "SEND"}
          secondLine={busy ? "WORKING" : "MESSAGE"}
          disabled={busy || !value.trim()}
          aria-label={busy ? "Sending message" : "Send message"}
          onClick={onSend}
          className="shrink-0 min-w-[4.5rem]"
          style={
            {
              "--vt-studio-control-accent": TOOLBOX_PALETTE[7],
              "--vt-studio-control-secondary": TOOLBOX_PALETTE[5],
            } as React.CSSProperties
          }
        />
      }
    />
  )
}

export default BrainComposerDock

/** Safe focus helper for parent pages (drawers → field). */
export const focusBrainComposer = (ref: React.RefObject<HTMLTextAreaElement | null> | null) => {
  focusComposer(ref?.current ?? null)
}
