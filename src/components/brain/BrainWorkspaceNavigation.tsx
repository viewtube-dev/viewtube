import React from "react"
import { Activity, Brain, FolderKanban, MessageSquare, SlidersHorizontal, Sparkles } from "lucide-react"
import { Link, useLocation } from "react-router-dom"

type WorkspaceLink = {
  label: string
  description: string
  to: string
  icon: React.ReactNode
}

const WORKSPACE_LINKS: WorkspaceLink[] = [
  { label: "Brain chat", description: "Return to the Brain conversation", to: "/ai-brain", icon: <MessageSquare aria-hidden="true" /> },
  { label: "Brain command", description: "Open Brain command center", to: "/tools/brain-command-center", icon: <Brain aria-hidden="true" /> },
  { label: "Analytics", description: "Open channel analytics", to: "/analytics", icon: <Activity aria-hidden="true" /> },
  { label: "Projects", description: "Open projects and content plans", to: "/projects", icon: <FolderKanban aria-hidden="true" /> },
  { label: "Studio", description: "Open the creator Studio", to: "/studio", icon: <Sparkles aria-hidden="true" /> },
]

/**
 * Responsive navigation for the existing Brain page identity.
 * This is deliberately a route launcher, not a second Brain router or capability registry.
 */
export const BrainWorkspaceNavigation: React.FC<{ className?: string }> = ({ className = "" }) => {
  const location = useLocation()

  return (
    <nav data-vt-brain-component="BrainWorkspaceNavigation" aria-label="Brain workspace navigation" className={`grid content-start gap-1 ${className}`}>
      <div className="mb-1 hidden items-center gap-2 border-b-2 border-black px-1 pb-2 2xl:flex">
        <SlidersHorizontal size={16} aria-hidden="true" />
        <span className="text-[10px] font-[1000] uppercase tracking-[0.08em]">Workspace</span>
      </div>
      {WORKSPACE_LINKS.map((item) => {
        const active = location.pathname === item.to ||
          (item.to === "/tools/brain-command-center" && location.pathname.startsWith("/tools/brain-command-center"))
        return (
          <Link
            data-vt-brain-part="workspace-route-link"
            key={item.to}
            to={item.to}
            aria-label={item.label}
            aria-current={active ? "page" : undefined}
            title={item.description}
            className={`group flex min-h-11 min-w-0 items-center gap-2 border-2 border-black px-2 py-2 text-left text-[10px] font-[1000] uppercase leading-4 outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 ${active ? "bg-[#FFDA47]" : "bg-white hover:bg-[#36E0F6]"}`}
          >
            <span className="grid h-7 w-7 shrink-0 place-items-center" aria-hidden="true">{item.icon}</span>
            <span className="hidden min-w-0 break-words 2xl:block">{item.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}

export default BrainWorkspaceNavigation
