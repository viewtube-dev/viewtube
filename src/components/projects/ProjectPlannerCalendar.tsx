import React, { useMemo, useState } from "react"
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock3,
  X,
} from "lucide-react"
import { useBrain } from "../../context/useBrain"
import type { Project } from "../../types"
import {
  SubToolboxButton,
  SubToolboxIconButton,
  SubToolboxSelect,
  SubToolboxStatusBadge,
} from "../subtoolbox/SubToolboxPrimitives"
import { SubToolboxSection, SubToolboxStack } from "../subtoolbox/SubToolboxLayouts"
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
const parseDate = (value?: string) => {
  if (!value) return null
  const match = /^(\\d{4})-(\\d{2})-(\\d{2})/.exec(value)
  if (!match) return null
  const parsed = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]))
  return Number.isNaN(parsed.getTime()) ? null : startOfDay(parsed)
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
    scheduledProjects.filter(project => project.publishDate?.slice(0, 10) === key)
  const selectedProjects = useMemo(
    () => projectsForDate(selectedDate),
    [scheduledProjects, selectedDate],
  )
  const days = useMemo(() => {
    const first = new Date(cursor.getFullYear(), cursor.getMonth(), 1)
    const gridStart = addDays(first, -first.getDay())
    return Array.from({ length: 42 }, (_, index) => addDays(gridStart, index))
  }, [cursor])

  const scheduleSelectedProject = () => {
    if (!quickAddProjectId) return
    updateProject(quickAddProjectId, { publishDate: selectedDate } as Partial<Project>)
    setQuickAddProjectId("")
  }
  const clearSchedule = (projectId: string) =>
    updateProject(projectId, { publishDate: "" } as Partial<Project>)

  return (
    <SubToolboxStack density="comfortable" className="vt-project-planner-calendar">
      <style>{`
        .vt-project-planner-calendar { width:100%; min-width:0; align-self:stretch; color:var(--vt-ink,var(--vt-text,#000)); }
        .vt-project-planner-calendar__shell {
          width:100%; min-width:0; overflow:hidden; border:0; border-radius:0; background:var(--vt-surface,#fff); box-shadow:none;
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
          display: grid; grid-template-columns: repeat(7, minmax(0, 1fr));
        }
        .vt-project-planner-calendar__weekdays { background: #000; color: #fff; }
        .vt-project-planner-calendar__weekday { padding: 7px 1px; text-align: center; font: 900 9px/1 var(--vt-font, inherit); text-transform: uppercase; }
        .vt-project-planner-calendar__day {
          min-width: 0; min-height: 92px; padding: 4px; border: 0; border-right: 1px solid #000;
          border-bottom: 1px solid #000; background: #fff; text-align: left; cursor: pointer;
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
        .vt-project-planner-calendar__project-row { display: flex; min-width: 0; gap: 7px; align-items: flex-start; padding: 9px; border-bottom: 1px solid #000; background: #fff; }
        .vt-project-planner-calendar__project-open { min-width: 0; flex: 1; text-align: left; }
        .vt-project-planner-calendar__quick-add { display: grid; gap: 7px; padding: 10px; border-top: 2px solid #000; }
        .vt-project-planner-calendar__empty { padding: 18px 10px; text-align: center; color: #666; font: 800 9px/1.4 var(--vt-font, inherit); text-transform: uppercase; }
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
              <div className="flex items-center gap-2"><CalendarDays size={15} /><strong className="text-[10px] font-black uppercase">Selected date</strong></div>
              <div className="mt-1 text-[11px] font-black uppercase">{dateLabel(parseDate(selectedDate) || new Date())}</div>
              <div className="mt-1 text-[8px] font-bold uppercase">{selectedProjects.length} scheduled project{selectedProjects.length === 1 ? "" : "s"}</div>
            </header>

            <div>
              {selectedProjects.length ? selectedProjects.map(project => (
                <div key={project.id} className="vt-project-planner-calendar__project-row">
                  <div className="mt-1 h-3 w-3 shrink-0 border border-black" style={{ backgroundColor: project.color || "var(--pair-a, #FF4FD8)" }} aria-hidden="true" />
                  <button type="button" className="vt-project-planner-calendar__project-open" onClick={() => onOpenProject?.(project.id)}>
                    <span className="block truncate text-[10px] font-black uppercase">{projectTitle(project)}</span>
                    <span className="mt-1 block text-[8px] font-bold uppercase text-black/55">{project.status || "Project"} · Open project</span>
                  </button>
                  <SubToolboxIconButton level="l1" icon={<X size={12} />} ariaLabel={`Unschedule ${projectTitle(project)}`} onClick={() => clearSchedule(project.id)} />
                </div>
              )) : <div className="vt-project-planner-calendar__empty">No projects scheduled for this date</div>}
            </div>

            <div className="vt-project-planner-calendar__quick-add">
              <SubToolboxSection label="Quick schedule project">
                <SubToolboxSelect value={quickAddProjectId} onChange={event => setQuickAddProjectId(event.target.value)} aria-label="Choose unscheduled project">
                  <option value="">Choose an unscheduled project</option>
                  {unscheduledProjects.map(project => <option key={project.id} value={project.id}>{project.name}</option>)}
                </SubToolboxSelect>
              </SubToolboxSection>
              <SubToolboxButton tone="accent" disabled={!quickAddProjectId} onClick={scheduleSelectedProject} icon={<Clock3 size={14} />}>Schedule on selected date</SubToolboxButton>
              {!unscheduledProjects.length ? <SubToolboxStatusBadge level="l1">All projects have a publish date</SubToolboxStatusBadge> : null}
            </div>
          </section>

        <header className="vt-project-planner-calendar__toolbar">
          <div className="vt-project-planner-calendar__month-nav">
            <SubToolboxIconButton level="l1" icon={<ChevronLeft size={15} />} ariaLabel="Previous month" onClick={() => setCursor(date => new Date(date.getFullYear(), date.getMonth() - 1, 1))} />
            <div className="vt-project-planner-calendar__month-title" aria-live="polite">{monthLabel(cursor)}</div>
            <SubToolboxIconButton level="l1" icon={<ChevronRight size={15} />} ariaLabel="Next month" onClick={() => setCursor(date => new Date(date.getFullYear(), date.getMonth() + 1, 1))} />
          </div>
          <SubToolboxButton tone="neutral" onClick={() => { const today = startOfDay(new Date()); setCursor(today); setSelectedDate(dateKey(today)) }}>Today</SubToolboxButton>
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
                const currentMonth = day.getMonth() === cursor.getMonth()
                return (
                  <section key={key} className={`vt-project-planner-calendar__day-wrap`} style={{ minWidth: 0 }}>
                    <button
                      type="button"
                      className={`vt-project-planner-calendar__day ${currentMonth ? "" : "is-muted"} ${selectedDate === key ? "is-selected" : ""}`}
                      aria-label={dateLabel(day)}
                      aria-pressed={selectedDate === key}
                      onClick={() => setSelectedDate(key)}
                    >
                      <span className={`vt-project-planner-calendar__day-number ${key === todayKey ? "is-today" : ""}`}>{day.getDate()}</span>
                      <span className="vt-project-planner-calendar__markers" aria-hidden="true">
                        {dayProjects.slice(0, 2).map(project => (
                          <SubToolboxStatusBadge key={project.id} level="l2" className="is-dense vt-project-planner-calendar__marker" title={projectTitle(project)} style={{ "--pair-a": project.color || "var(--pair-a,#FF4FD8)" } as React.CSSProperties}>{projectTitle(project)}</SubToolboxStatusBadge>
                        ))}
                        {dayProjects.length > 2 ? <span className="vt-project-planner-calendar__marker">+{dayProjects.length - 2} more</span> : null}
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
