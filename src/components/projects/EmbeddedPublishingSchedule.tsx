import React from "react"
import ProjectPlannerCalendar from "./ProjectPlannerCalendar"

/**
 * The Project Board owns the surrounding toolbox and Board/Calendar switch.
 * This adapter deliberately adds no second header or independent shell: it mounts
 * the reusable 13B-inspired planner inside the existing Calendar view.
 */
const EmbeddedPublishingSchedule: React.FC<{ onOpenProject?: (projectId: string) => void }> = ({ onOpenProject }) => (
  <div className="vt-projects-embedded-schedule w-full min-w-0 max-w-none m-0 p-0">
    <ProjectPlannerCalendar onOpenProject={onOpenProject} />
  </div>
)

export default EmbeddedPublishingSchedule
