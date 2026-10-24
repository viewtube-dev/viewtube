import React from "react"
import "../../styles/studio-chat-action-group.css"

export type StudioChatActionGroupSize = "standard" | "compact" | "micro"

export interface StudioChatActionGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  sizeVariant?: StudioChatActionGroupSize
}

export const StudioChatActionGroup: React.FC<StudioChatActionGroupProps> = ({
  sizeVariant = "compact",
  className,
  children,
  "aria-label": ariaLabel = "Chat response actions",
  ...rest
}) => (
  <div
    {...rest}
    className={["vt-studio-chat-action-group", className].filter(Boolean).join(" ")}
    data-vt-studio-control="chat-action-group"
    data-vt-studio-size={sizeVariant}
    role="group"
    aria-label={ariaLabel}
  >
    {children}
  </div>
)

StudioChatActionGroup.displayName = "StudioChatActionGroup"
