import React from "react"
import { Activity, Brain, FolderKanban, MessageSquare, SlidersHorizontal, Sparkles } from "lucide-react"
import { useLocation, useNavigate } from "react-router-dom"
import { StudioSplitLeftButton } from "../../studio-ui"

type WorkspaceLink = { label: string; description: string; to: string; icon: React.ReactNode }
const WORKSPACE_LINKS: WorkspaceLink[] = [
  { label: "Brain chat", description: "Return to the Brain conversation", to: "/ai-brain", icon: <MessageSquare aria-hidden="true" /> },
  { label: "Brain command", description: "Open Brain command center", to: "/tools/brain-command-center", icon: <Brain aria-hidden="true" /> },
  { label: "Analytics", description: "Open channel analytics", to: "/analytics", icon: <Activity aria-hidden="true" /> },
  { label: "Projects", description: "Open projects and content plans", to: "/projects", icon: <FolderKanban aria-hidden="true" /> },
  { label: "Studio", description: "Open the creator Studio", to: "/studio", icon: <Sparkles aria-hidden="true" /> },
]

/** Responsive route launcher; React Router remains the navigation owner. */
export const BrainWorkspaceNavigation: React.FC<{ className?: string }> = ({ className = "" }) => {
  const location = useLocation()
  const navigate = useNavigate()
  return (
    <nav data-vt-brain-component="BrainWorkspaceNavigation" aria-label="Brain workspace navigation" className={`grid content-start gap-1 ${className}`}>
      <div className="mb-1 hidden items-center gap-2 border-b-2 border-black px-1 pb-2 2xl:flex">
        <SlidersHorizontal size={16} aria-hidden="true" />
        <span data-vt-brain-part="workspace-heading" className="text-[10px] font-[1000] uppercase tracking-[0.08em]">Workspace</span>
      </div>
      {WORKSPACE_LINKS.map((item) => {
        const active = location.pathname === item.to ||
          (item.to === "/tools/brain-command-center" && location.pathname.startsWith("/tools/brain-command-center"))
        return <StudioSplitLeftButton key={item.to} data-vt-brain-part="workspace-route-link" sizeVariant="compact" icon={item.icon} selected={active} aria-current={active ? "page" : undefined} aria-label={item.label} title={item.description} onClick={() => navigate(item.to)} className="w-full min-w-0">{item.label}</StudioSplitLeftButton>
      })}
    </nav>
  )
}
export default BrainWorkspaceNavigation
