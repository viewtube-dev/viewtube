import React from "react"
import "../../styles/studio-inter-module.css"

export type StudioInterModuleSize = "standard" | "compact" | "micro"

export interface StudioInterModuleProps extends React.HTMLAttributes<HTMLElement> {
  title: React.ReactNode
  startIcon?: React.ReactNode
  endIcon?: React.ReactNode
  children?: React.ReactNode
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  collapsible?: boolean
  sizeVariant?: StudioInterModuleSize
  tone?: "default" | "accent" | "custom"
  headStyle?: React.CSSProperties
  as?: "section" | "article" | "div"
}

export const StudioInterModule: React.FC<StudioInterModuleProps> = ({
  title, startIcon, endIcon, children, open: openProp, defaultOpen = false,
  onOpenChange, collapsible = true, sizeVariant = "compact", tone = "default",
  headStyle, className, as: Comp = "div", onKeyDown, onClick, ...rest
}) => {
  const controlled = openProp !== undefined
  const [uncontrolled, setUncontrolled] = React.useState(defaultOpen)
  const open = controlled ? Boolean(openProp) : uncontrolled
  const hasBody = children !== null && children !== undefined && children !== false

  const toggle = () => {
    if (!collapsible || !hasBody) return
    const next = !open
    if (!controlled) setUncontrolled(next)
    onOpenChange?.(next)
  }
  const handleKeyDown: React.KeyboardEventHandler<HTMLDivElement> = event => {
    onKeyDown?.(event as React.KeyboardEvent<HTMLElement>)
    if (event.defaultPrevented || !collapsible || !hasBody) return
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault()
      toggle()
    }
  }
  const handleClick: React.MouseEventHandler<HTMLDivElement> = event => {
    onClick?.(event as React.MouseEvent<HTMLElement>)
    if (!event.defaultPrevented) toggle()
  }

  return (
    <Comp
      {...rest}
      data-vt-studio-control="true"
      data-vt-studio-inter-module="true"
      data-size={sizeVariant}
      data-tone={tone}
      data-open={open && hasBody ? "true" : "false"}
      className={["vt-studio-inter-module", className].filter(Boolean).join(" ")}
    >
      <div
        className="vt-studio-inter-module__head"
        style={headStyle}
        role={collapsible && hasBody ? "button" : undefined}
        tabIndex={collapsible && hasBody ? 0 : undefined}
        aria-expanded={collapsible && hasBody ? open : undefined}
        onClick={collapsible && hasBody ? handleClick : undefined}
        onKeyDown={collapsible && hasBody ? handleKeyDown : undefined}
      >
        <span className="vt-studio-inter-module__rail" data-rail="start" aria-hidden="true">{startIcon}</span>
        <span className="vt-studio-inter-module__title">{title}</span>
        <span className="vt-studio-inter-module__rail" data-rail="end" aria-hidden="true">
          {endIcon ?? (collapsible ? (open ? "−" : "+") : null)}
        </span>
      </div>
      {open && hasBody ? <div className="vt-studio-inter-module__body">{children}</div> : null}
    </Comp>
  )
}

StudioInterModule.displayName = "StudioInterModule"
