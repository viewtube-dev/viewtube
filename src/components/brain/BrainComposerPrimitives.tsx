import React from "react"
import { StudioButton } from "../../studio-ui"

/** Reusable tool launcher for the Brain composer. All behavior is injected. */
export type BrainComposerToolButtonProps = {
  icon: React.ReactNode
  children: React.ReactNode
  label: string
  onClick: () => void
  className?: string
  style?: React.CSSProperties
  buttonRef?: React.Ref<HTMLButtonElement>
  hasPopup?: boolean
}

export const BrainComposerToolButton: React.FC<BrainComposerToolButtonProps> = ({
  icon,
  children,
  label,
  onClick,
  className = "",
  style,
  buttonRef,
  hasPopup = true,
}) => (
  <StudioButton
    ref={buttonRef}
    type="button"
    sizeVariant="compact"
    tone="neutral"
    onClick={onClick}
    aria-label={label}
    aria-haspopup={hasPopup ? "dialog" : undefined}
    title={label}
    className={`vt-brain-composer-tool ${className}`.trim()}
    style={style}
  >
    <span className="vt-brain-composer-tool__content">
      <span className="vt-brain-composer-tool__icon" aria-hidden="true">{icon}</span>
      <span>{children}</span>
    </span>
  </StudioButton>
)

/** Responsive action rail: controls wrap naturally without becoming a second toolbar. */
export const BrainComposerToolRail: React.FC<{
  children: React.ReactNode
  label?: string
  className?: string
}> = ({ children, label = "Brain tools", className = "" }) => (
  <div
    className={`vt-brain-composer-tool-rail ${className}`.trim()}
    role="group"
    aria-label={label}
  >
    {children}
  </div>
)
