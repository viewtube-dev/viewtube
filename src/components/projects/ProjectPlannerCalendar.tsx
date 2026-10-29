import React, { useMemo, useState } from "react"
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock3,
} from "lucide-react"
import { useBrain } from "../../context/useBrain"
import type { DayTask, Project } from "../../types"
import { SubToolboxSection, SubToolboxStack } from "../subtoolbox/SubToolboxLayouts"
import { StudioButton, StudioCloseableBadge, StudioDropdown, StudioSplitLeftButton, StudioSquareIconButton, StudioCalendarEventChip, StudioCalendarMediaRail } from "../../studio-ui"
import "../../styles/toolbox-entry.css"

type ProjectPlannerCalendarProps = {
  onOpenProject?: (projectId: string) => void
}

const startOfDay = (date: Date) => new Date(date.getFullYear(), date.getMonth(), date.getDate())
const addDays = (date: Date, amount: number) => {
  const next = new Date(date)
  next.setDate(next.getDate() + amount)
  return startOfDay(next)
}
const dateKey = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`
const parseDate = (value?: string | Date | number | null) => {
  if (value == null || value === "") return null
  // Prefer local calendar parsing for date-only ISO strings so timezone offsets
  // cannot shift a scheduled publish date to the previous/next day.
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : startOfDay(value)
  }
  if (typeof value === "number") {
    const parsed = new Date(value)
    return Number.isNaN(parsed.getTime()) ? null : startOfDay(parsed)
  }
  const match = /^(\d{4})-(\d{2})-(\d{2})(?:$|T)/.exec(value.trim())
  if (match) {
    const year = Number(match[1])
    const month = Number(match[2])
    const day = Number(match[3])
    const parsed = new Date(year, month - 1, day)
    // Reject impossible dates rather than silently normalizing them.
    if (parsed.getFullYear() !== year || parsed.getMonth() !== month - 1 || parsed.getDate() !== day) return null
    return startOfDay(parsed)
  }
  // Legacy project records may contain parseable date strings in a display format.
  const fallback = new Date(value)
  return Number.isNaN(fallback.getTime()) ? null : startOfDay(fallback)
}
const dateLabel = (date: Date) =>
  date.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric", year: "numeric" })
const monthLabel = (date: Date) =>
  date.toLocaleDateString(undefined, { month: "long", year: "numeric" })
const projectTitle = (project: Project) => project.videoTitle || project.name

const ProjectPlannerCalendar: React.FC<ProjectPlannerCalendarProps> = ({ onOpenProject }) => {
  const { brain, updateProject } = useBrain()
  const projects = useMemo(() => Array.isArray(brain.projects) ? brain.projects : [], [brain.projects])
  const [cursor, setCursor] = useState(() => startOfDay(new Date()))
  const [selectedDate, setSelectedDate] = useState(() => dateKey(new Date()))
  const [quickAddProjectId, setQuickAddProjectId] = useState("")
  const [scheduleFeedback, setScheduleFeedback] = useState("")
  const todayKey = dateKey(new Date())

  const scheduledProjects = useMemo(
    () => projects.filter(project => Boolean(parseDate(project.publishDate))),
    [projects],
  )
  const unscheduledProjects = useMemo(
    () => projects.filter(project => !parseDate(project.publishDate)),
    [projects],
  )
  const projectsForDate = (key: string) =>
    scheduledProjects.filter(project => { const date = parseDate(project.publishDate); return date ? dateKey(date) === key : false })
  const tasksForDate = (key: string) => projects.flatMap(project =>
    (project.tasks || []).filter((task: DayTask) => {
      const due = parseDate(task.dueDate)
      return Boolean(due && dateKey(due) === key)
    }).map((task: DayTask) => ({ ...task, projectId: project.id, projectTitle: projectTitle(project) }))
  )
  const selectedProjects = useMemo(
    () => projectsForDate(selectedDate),
    [scheduledProjects, selectedDate],
  )
  const selectedTasks = useMemo(() => tasksForDate(selectedDate), [projects, selectedDate])
  const days = useMemo(() => {
    const first = new Date(cursor.getFullYear(), cursor.getMonth(), 1)
    const gridStart = addDays(first, -first.getDay())
    return Array.from({ length: 42 }, (_, index) => addDays(gridStart, index))
  }, [cursor])

  const scheduleSelectedProject = () => {
    const project = projects.find(item => item.id === quickAddProjectId)
    const scheduledDate = parseDate(selectedDate)
    if (!project || !scheduledDate) {
      setScheduleFeedback("Choose a project and a valid date before scheduling.")
      return
    }

    // Keep workflow status (active/completed/archived) independent from schedule status.
    updateProject(project.id, { publishDate: selectedDate, updatedAt: Date.now() })
    setCursor(new Date(scheduledDate.getFullYear(), scheduledDate.getMonth(), 1))
    setScheduleFeedback(projectTitle(project) + " scheduled for " + dateLabel(scheduledDate))
    setQuickAddProjectId("")
  }
  const clearSchedule = (projectId: string) => {
    updateProject(projectId, { publishDate: "", updatedAt: Date.now() })
    const project = projects.find(item => item.id === projectId)
    setScheduleFeedback(project ? projectTitle(project) + " removed from the publishing calendar." : "Schedule cleared.")
  }

  return (
    <SubToolboxStack density="comfortable" className="vt-project-planner-calendar">
      <style>{`
        .vt-project-planner-calendar { display:block; width:100%; min-width:0; max-width:none; margin:0; padding:0; align-self:stretch; color:var(--vt-ink,var(--vt-text,#000)); }
        .vt-project-planner-calendar__shell {
          display:block; width:100%; min-width:0; max-width:none; margin:0; padding:0; overflow:hidden; border:0; border-radius:0; background:var(--vt-surface,#fff); box-shadow:none;
        }
        .vt-project-planner-calendar__toolbar {
          display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between;
          gap: 8px; padding: 10px; border-bottom: 2px solid #000;
          background: color-mix(in srgb, var(--pair-a, #FF4FD8) 22%, #fff);
        }
        .vt-project-planner-calendar__month-nav { display: flex; align-items: center; gap: 8px; min-width: 0; }
        .vt-project-planner-calendar__month-title { font:900 16px/1.15 var(--vt-font,inherit); text-transform: uppercase; }
        .vt-project-planner-calendar__body {
          display:grid; grid-template-columns:minmax(0,1fr); min-width:0;
        }
        .vt-project-planner-calendar__main { min-width: 0; }
        .vt-project-planner-calendar__weekdays, .vt-project-planner-calendar__days {
          display:grid; box-sizing:border-box; width:100%; min-width:0; max-width:none;
          grid-template-columns:repeat(7,minmax(0,1fr)); grid-auto-columns:minmax(0,1fr);
          grid-auto-flow:row; column-gap:0; row-gap:0; gap:0; margin:0; padding:0;
        }
        .vt-project-planner-calendar__days > .vt-project-planner-calendar__day-wrap {
          display:flex; box-sizing:border-box; min-width:0; width:auto; max-width:none; margin:0; padding:0;
        }
        .vt-project-planner-calendar__day-wrap > .vt-project-planner-calendar__day {
          display:block; flex:1 1 0; box-sizing:border-box; width:100%; min-width:0; max-width:none; margin:0;
        }
        .vt-project-planner-calendar__weekdays { background: #000; color: #fff; }
        .vt-project-planner-calendar__weekday { padding: 7px 1px; text-align: center; font: 900 9px/1 var(--vt-font, inherit); text-transform: uppercase; }
        .vt-project-planner-calendar__day {
          display:block; box-sizing:border-box; width:100%; max-width:100%; min-width:0; min-height:92px; margin:0; padding:4px; border:0; border-right:1px solid var(--vt-border,#000);
          border-bottom:1px solid var(--vt-border,#000); background:var(--vt-surface,#fff); text-align:left; cursor:pointer;
        }
        .vt-project-planner-calendar__day:nth-child(7n) { border-right: 0; }
        .vt-project-planner-calendar__day.is-muted { background: #f5f5f5; color: #777; }
        .vt-project-planner-calendar__day.is-selected { background: color-mix(in srgb, var(--pair-a, #FF4FD8) 16%, #fff); box-shadow: inset 0 0 0 2px var(--pair-a, #FF4FD8); }
        .vt-project-planner-calendar__day-number { display: inline-flex; width: 24px; height: 24px; align-items: center; justify-content: center; border-radius: 5px; font: 1000 10px/1 var(--vt-font, inherit); }
        .vt-project-planner-calendar__day-number.is-today { background: #000; color: #fff; }
        .vt-project-planner-calendar__markers { display: grid; gap: 3px; margin-top: 4px; }
        .vt-project-planner-calendar__marker { display:block; width:100%; max-width:100%; overflow:hidden; justify-content:flex-start; font-size:9px; font-weight:800; text-transform:none; text-overflow:ellipsis; white-space:nowrap; }
        .vt-project-planner-calendar__detail {
          min-width:0; border-left:0; border-bottom:var(--vt-subtoolbox-inner-stroke,3px) solid var(--vt-border,#000); background:var(--vt-surface,#fff);
        }
        .vt-project-planner-calendar__detail-head { padding:clamp(10px,2vw,18px); border-bottom:1px solid var(--vt-border,#000); background:var(--pair-b,#36E0F6); }
        .vt-project-planner-calendar__selected-label { display:flex; align-items:center; gap:7px; margin-bottom:5px; font-size:11px; font-weight:900; letter-spacing:.035em; text-transform:uppercase; }
        .vt-project-planner-calendar__selected-date { margin:0; font-size:clamp(18px,3.5vw,28px); font-weight:1000; line-height:1.12; text-transform:uppercase; overflow-wrap:anywhere; }
        .vt-project-planner-calendar__selected-count { margin-top:6px; font-size:12px; font-weight:800; text-transform:uppercase; }
        .vt-project-planner-calendar__project-title { display:block; overflow:hidden; font-size:11px; font-weight:900; text-overflow:ellipsis; text-transform:uppercase; white-space:nowrap; }
        .vt-project-planner-calendar__project-meta { display:block; margin-top:3px; color:var(--vt-text-muted,#555); font-size:9px; font-weight:800; text-transform:uppercase; }
        .vt-project-planner-calendar__project-row { display: flex; min-width: 0; gap: 7px; align-items: flex-start; padding: 9px; border-bottom: 1px solid #000; background: #fff; }
        .vt-project-planner-calendar__media-rail { width: clamp(84px, 24%, 140px); flex: 0 0 clamp(84px, 24%, 140px); align-self: flex-start; }
        .vt-project-planner-calendar__unschedule { flex: 0 0 auto; }
        .vt-project-planner-calendar__project-open { min-width: 0; flex: 1; text-align: left; }
        .vt-project-planner-calendar__quick-add { display: grid; gap: 7px; padding: 10px; border-top: 2px solid #000; }
        .vt-project-planner-calendar__empty { padding: 18px 10px; text-align: center; color: #666; font: 800 9px/1.4 var(--vt-font, inherit); text-transform: uppercase; }
        .vt-project-planner-calendar__feedback { padding:8px 9px; border:2px solid #000; background:color-mix(in srgb,var(--pair-b,#36E0F6) 28%,#fff); color:#000; font:900 10px/1.35 var(--vt-font,inherit); overflow-wrap:anywhere; }
        .vt-project-planner-calendar__footer { display: flex; flex-wrap: wrap; gap: 8px 18px; padding: 9px 10px; border-top: 2px solid #000; background: #fff; font: 900 9px/1.3 var(--vt-font, inherit); text-transform: uppercase; }
        @media (max-width: 760px) {
          .vt-project-planner-calendar__body { grid-template-columns: minmax(0, 1fr); }
          .vt-project-planner-calendar__detail { border-left:0; border-top:0; }
          .vt-project-planner-calendar__day { min-height: 72px; padding: 2px; }
          .vt-project-planner-calendar__day-number { width: 21px; height: 21px; }
          .vt-project-planner-calendar__marker { font-size:8px; }
        }
        @media (max-width: 420px) {
          .vt-project-planner-calendar__weekday { font-size: 8px; }
          .vt-project-planner-calendar__day { min-height: 58px; }
          .vt-project-planner-calendar__marker { height:14px; min-height:14px; font-size:8px; }
        }
      `}</style>

      <div className="vt-project-planner-calendar__shell">
          <section className="vt-project-planner-calendar__detail" aria-label="Selected date details">
            <header className="vt-project-planner-calendar__detail-head">
              <div className="vt-project-planner-calendar__selected-label"><CalendarDays size={17} /><strong>Selected date</strong></div>
              <h2 className="vt-project-planner-calendar__selected-date">{dateLabel(parseDate(selectedDate) || new Date())}</h2>
              <div className="vt-project-planner-calendar__selected-count">{selectedProjects.length} scheduled project{selectedProjects.length === 1 ? "" : "s"} · {selectedTasks.length} task{selectedTasks.length === 1 ? "" : "s"}</div>
            </header>

            <div>
              {selectedProjects.length ? selectedProjects.map(project => (
                <div key={project.id} className="vt-project-planner-calendar__project-row">
                  <StudioCalendarMediaRail aspectRatio={project.plan?.format === "short" || project.plan?.videoFormat === "short" ? "9:16" : "16:9"} split="double" thumbnailSrc={project.thumbnailUrl} label={projectTitle(project)} leftLabel="VIDEO" rightLabel="PUBLISH" className="vt-project-planner-calendar__media-rail" />
                  <button type="button" className="vt-project-planner-calendar__project-open" onClick={() => onOpenProject?.(project.id)}>
                    <span className="vt-project-planner-calendar__project-title">{projectTitle(project)}</span>
                    <span className="vt-project-planner-calendar__project-meta">{project.status || "Project"} · Open project</span>
                  </button>
                  <StudioCloseableBadge label="UNSCHEDULE" entering={false} onClose={() => clearSchedule(project.id)} className="vt-project-planner-calendar__unschedule" />
                </div>
              )) : null}
              {selectedTasks.map(task => (
                <div key={`${task.projectId}-${task.id}`} className="vt-project-planner-calendar__project-row">
                  <StudioCalendarEventChip label="TASK" kind="task" status={task.completed ? "done" : "open"} />
                  <div className="vt-project-planner-calendar__project-open">
                    <span className="vt-project-planner-calendar__project-title">{task.text}</span>
                    <span className="vt-project-planner-calendar__project-meta">{task.projectTitle} · {task.completed ? "Complete" : "Open task"}</span>
                  </div>
                  <StudioCalendarEventChip label={task.completed ? "DONE" : "OPEN"} kind={task.completed ? "milestone" : "task"} />
                </div>
              ))}
              {!selectedProjects.length && !selectedTasks.length ? <div className="vt-project-planner-calendar__empty">Nothing planned for this day yet. Choose a project below to schedule it.</div> : null}
            </div>

            <div className="vt-project-planner-calendar__quick-add">
              <SubToolboxSection label="Add a project to this date">
                <StudioDropdown value={quickAddProjectId} onChange={value => { setQuickAddProjectId(value); setScheduleFeedback("") }} ariaLabel="Choose project to schedule or move" placeholder="CHOOSE A PROJECT" options={[{ value: "", label: "Choose a project" }, ...projects.map(project => { const existingDate = parseDate(project.publishDate); return { value: project.id, label: `${project.name}${existingDate ? ` · currently ${dateKey(existingDate)}` : " · unscheduled"}` } })]} />
              </SubToolboxSection>
              <StudioSplitLeftButton sizeVariant="standard" tone="accent" icon={<Clock3 size={14} />} disabled={!quickAddProjectId} onClick={scheduleSelectedProject}>
                {projects.some(project => project.id === quickAddProjectId && parseDate(project.publishDate)) ? "Move to selected date" : "Schedule on selected date"}
              </StudioSplitLeftButton>
              {scheduleFeedback ? <div role="status" aria-live="polite" className="vt-project-planner-calendar__feedback">{scheduleFeedback}</div> : null}
              {!projects.length ? <StudioCalendarEventChip label="NO PROJECTS AVAILABLE" kind="reminder" status="create a project first" /> : null}
            </div>
          </section>

        <header className="vt-project-planner-calendar__toolbar">
          <div className="vt-project-planner-calendar__month-nav">
            <StudioSquareIconButton label="Previous month" icon={<ChevronLeft size={15} />} sizeVariant="compact" onClick={() => setCursor(date => new Date(date.getFullYear(), date.getMonth() - 1, 1))} />
            <div className="vt-project-planner-calendar__month-title" aria-live="polite">{monthLabel(cursor)}</div>
            <StudioSquareIconButton label="Next month" icon={<ChevronRight size={15} />} sizeVariant="compact" onClick={() => setCursor(date => new Date(date.getFullYear(), date.getMonth() + 1, 1))} />
          </div>
          <StudioButton sizeVariant="compact" tone="neutral" onClick={() => { const today = startOfDay(new Date()); setCursor(today); setSelectedDate(dateKey(today)); setScheduleFeedback("") }}>Today</StudioButton>
        </header>

        <div className="vt-project-planner-calendar__body">
          <main className="vt-project-planner-calendar__main">
            <div className="vt-project-planner-calendar__weekdays" aria-hidden="true">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => <div className="vt-project-planner-calendar__weekday" key={day}>{day}</div>)}
            </div>
            <div className="vt-project-planner-calendar__days">
              {days.map(day => {
                const key = dateKey(day)
                const dayProjects = projectsForDate(key)
                const dayTasks = tasksForDate(key)
                const dayItems = [
                  ...dayProjects.map(project => ({ id: project.id, label: projectTitle(project), type: "project" as const, color: project.color })),
                  ...dayTasks.map(task => ({ id: `${task.projectId}-${task.id}`, label: `TASK · ${task.text}`, type: "task" as const, color: undefined })),
                ]
                const currentMonth = day.getMonth() === cursor.getMonth()
                return (
                  <section key={key} className={`vt-project-planner-calendar__day-wrap`} style={{ minWidth: 0 }}>
                    <button
                      type="button"
                      className={`vt-project-planner-calendar__day ${currentMonth ? "" : "is-muted"} ${selectedDate === key ? "is-selected" : ""}`}
                      aria-label={dateLabel(day)}
                      aria-pressed={selectedDate === key}
                      onClick={() => {
                        setSelectedDate(key)
                        // Keep the month heading and selected date in sync when a
                        // user chooses a leading/trailing day from the adjacent month.
                        if (!currentMonth) setCursor(new Date(day.getFullYear(), day.getMonth(), 1))
                        setScheduleFeedback("")
                      }}
                    >
                      <span className={`vt-project-planner-calendar__day-number ${key === todayKey ? "is-today" : ""}`}>{day.getDate()}</span>
                      <span className="vt-project-planner-calendar__markers" aria-hidden="true">
                        {dayItems.slice(0, 2).map(item => (
                          <StudioCalendarEventChip key={item.id} label={item.label} kind={item.type === "project" ? "publish" : "task"} status={item.type === "project" ? "scheduled" : "task"} className="vt-project-planner-calendar__marker" />
                        ))}
                        {dayItems.length > 2 ? <StudioCalendarEventChip label={`+${dayItems.length - 2} MORE`} kind="reminder" className="vt-project-planner-calendar__marker" /> : null}
                      </span>
                    </button>
                  </section>
                )
              })}
            </div>
          </main>


        </div>

        <footer className="vt-project-planner-calendar__footer">
          <span>{scheduledProjects.length} scheduled</span>
          <span>{unscheduledProjects.length} unscheduled</span>
          <span>Date changes save to the project record</span>
        </footer>
      </div>
    </SubToolboxStack>
  )
}

export default ProjectPlannerCalendar
