import * as React from "react"

export type BrainHubComposerProps = {
  value: string
  onChange: (value: string) => void
  onSend: () => void
  disabled?: boolean
  sending?: boolean
  placeholder?: string
  className?: string
}

const DEFAULT_PLACEHOLDER =
  "Ask anything about your channel, content, or next upload…"

/**
 * Bottom composer: textarea + send only.
 * Prompts / Context / Tools live in BrainHubUtilityRow.
 */
export function BrainHubComposer({
  value,
  onChange,
  onSend,
  disabled = false,
  sending = false,
  placeholder = DEFAULT_PLACEHOLDER,
  className,
}: BrainHubComposerProps) {
  const areaRef = React.useRef<HTMLTextAreaElement>(null)

  const submit = () => {
    if (disabled || sending) return
    if (!value.trim()) return
    onSend()
  }

  const onKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault()
      submit()
    }
  }

  return (
    <div
      className={["vt-brain-hub-composer", className].filter(Boolean).join(" ")}
      role="form"
      aria-label="Message composer"
    >
      <label className="vt-brain-hub-composer__label" htmlFor="brain-hub-composer-input">
        Message
      </label>
      <div className="vt-brain-hub-composer__row">
        <textarea
          ref={areaRef}
          id="brain-hub-composer-input"
          className="vt-brain-hub-composer__input"
          data-vt-studio-control="true"
          data-vt-studio-field-kind="textarea"
          data-size="standard"
          rows={2}
          value={value}
          disabled={disabled || sending}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={onKeyDown}
        />
        <button
          type="button"
          className="vt-brain-hub-composer__send"
          data-vt-studio-control="true"
          data-size="standard"
          data-vt-studio-width="content"
          disabled={disabled || sending || !value.trim()}
          aria-label={sending ? "Sending" : "Send message"}
          onClick={submit}
        >
          <span data-vt-studio-button-face aria-hidden>
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M4 12h12M12 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </button>
      </div>
      <p className="vt-brain-hub-composer__hint">
        Enter to send · Shift+Enter for a new line
      </p>
    </div>
  )
}
