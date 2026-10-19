import React from "react"
import { CalendarDays, Columns3 } from "lucide-react"
import EmbeddedProjectKanbanWorkspace from "./EmbeddedProjectKanbanWorkspace"
import EmbeddedPublishingSchedule from "./EmbeddedPublishingSchedule"
import { SubToolboxStack } from "../subtoolbox/SubToolboxLayouts"
import { ToolboxHeaderToggle } from "../subtoolbox/SubToolboxPrimitives"
import { useProjectsWorkspace } from "./ProjectsWorkspaceContext"

export const ProjectBoardViewToggle: React.FC = () => {
 const { boardView, setBoardView } = useProjectsWorkspace()
 return (
  <ToolboxHeaderToggle
   value={boardView}
   onValueChange={value => setBoardView(value as "board" | "calendar")}
   aria-label="Choose Project Board view"
   options={[
    { value: "board", label: <span className="inline-flex items-center gap-2"><Columns3 size={14}/> Board</span> },
    { value: "calendar", label: <span className="inline-flex items-center gap-2"><CalendarDays size={14}/> Calendar</span> },
   ]}
  />
 )
}

const ProjectBoardWorkspace: React.FC = () => {
 const { boardView, openProject } = useProjectsWorkspace()
 return (
  <SubToolboxStack density="comfortable" className="w-full min-w-0">
   {boardView === "board" ? <EmbeddedProjectKanbanWorkspace/> : <EmbeddedPublishingSchedule onOpenProject={openProject}/>}
  </SubToolboxStack>
 )
}

export default ProjectBoardWorkspace
