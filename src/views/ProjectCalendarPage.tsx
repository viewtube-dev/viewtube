import React from "react"
import { Columns3, PanelsTopLeft } from "lucide-react"
import ProjectBuilderModule from "../components/projects/ProjectBuilderModule"
import ProjectBoardWorkspace, { ProjectBoardViewToggle } from "../components/projects/ProjectBoardWorkspace"
import ProjectsToolboxModule from "../components/projects/ProjectsToolboxModule"
import StoryboardStudio from "./StoryboardStudio"
import { ProjectsWorkspaceProvider } from "../components/projects/ProjectsWorkspaceContext"

/**
 * Projects is deliberately narrow:
 * - Project Builder owns channel/project planning and the content itself.
 * - Project Board owns pipeline position plus the page's only publishing calendar.
 * - Storyboard Studio remains a specialist production tool during migration.
 */
const ProjectCalendarPage: React.FC = () => (
 <ProjectsWorkspaceProvider>
 <div className="mx-auto flex max-w-[1800px] flex-col gap-6 pb-24">
  <section id="project-builder" className="scroll-mt-[86px]">
   <ProjectBuilderModule />
  </section>

  <section id="project-board" className="scroll-mt-[86px]">
   <ProjectsToolboxModule
    title="Project Board"
    subtitle="Track production stages and schedule publication dates"
    icon={<Columns3 />}
    paletteIndex={7}
    headerActions={<ProjectBoardViewToggle />}
    headerActionsPlacement="header"
   >
    <ProjectBoardWorkspace />
   </ProjectsToolboxModule>
  </section>

  <section id="storyboard-studio" className="scroll-mt-[86px]">
   <ProjectsToolboxModule
    title="Storyboard Studio"
    subtitle="Shape scenes, sequences, and the visual story before editing"
    icon={<PanelsTopLeft />}
    paletteIndex={9}
    isOpenInitial={false}
   >
    <StoryboardStudio embedded collapsible={false} isOpenInitial paletteIndex={1} />
   </ProjectsToolboxModule>
  </section>
 </div>
 </ProjectsWorkspaceProvider>
)

export default ProjectCalendarPage
