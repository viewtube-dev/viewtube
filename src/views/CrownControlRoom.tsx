import React, { useMemo, useState } from "react"
import { AlertTriangle, BrainCircuit, CheckCircle2, CircleDot, Code2, Crown, FileCheck2, FileStack, GitBranch, ListChecks, Network, ScrollText, Sparkles, Workflow } from "lucide-react"
import { CROWN_EXCHANGE_RECORDS, CROWN_EXCHANGE_READ_ONLY, CROWN_EXCHANGE_SOURCE } from "../data/crownExchangeGenerated"

type JsonRecord = Record<string, unknown>
type ExchangeRecord = { path: string; record: JsonRecord }
type MissionStatus = "draft" | "planned" | "verification" | "partial" | "complete" | "blocked"
type Mission = {
  id: string; title: string; objective: string; domain: string; status: MissionStatus; risk: string
  owner: string; executionOwner: string; taskIds: string[]; acceptance: string[]
  evidence: string[]; blockers: string[]; artifacts: string[]
}

const RECORDS = CROWN_EXCHANGE_RECORDS as unknown as readonly ExchangeRecord[]
const card = "rounded-[18px] border-[4px] border-black bg-white shadow-[8px_8px_0_0_#000]"
const tones: Record<string, string> = { Observatory: "#36e0f6", Citadel: "#fa618a", Brain: "#b14aed", Forge: "#ffa85c", Compass: "#ffda47", System: "#c0f240" }
const sections = [
  ["today", "Today", Sparkles], ["missions", "Missions", Crown], ["tasks", "Tasks", ListChecks],
  ["artifacts", "Artifacts", FileStack], ["decisions", "Decisions", ScrollText], ["execution", "Execution", Workflow],
  ["verification", "Verification", FileCheck2], ["code", "Code", Code2], ["services", "Services", Network],
  ["brain", "Brain", BrainCircuit], ["release", "Release", GitBranch],
] as const
type SectionId = typeof sections[number][0]

const str = (value: unknown, fallback = "Not recorded") => typeof value === "string" && value.trim() ? value : fallback
const arr = (value: unknown): string[] => Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : []
const object = (value: unknown): JsonRecord => value && typeof value === "object" && !Array.isArray(value) ? value as JsonRecord : {}
const recordsIn = (folder: string) => RECORDS.filter((item) => item.path.startsWith(`.viewtube/exchange/${folder}/`))
const missionId = (item: ExchangeRecord) => str(item.record.missionId, "")
const related = (item: ExchangeRecord, id: string) => missionId(item) === id
const rawText = (value: unknown) => typeof value === "string" ? value : JSON.stringify(value, null, 2)

const missionRecords = recordsIn("missions")
const receiptRecords = recordsIn("receipts")
const workOrderRecords = recordsIn("work-orders")
const artifactRecords = recordsIn("artifacts")
const decisionRecords = recordsIn("decisions")
const conflictRecords = recordsIn("conflicts")
const handoffRecords = recordsIn("handoffs")

function deriveMission(item: ExchangeRecord): Mission {
  const data = item.record
  const id = str(data.missionId, item.path)
  const receipts = receiptRecords.filter((entry) => related(entry, id))
  const workOrders = workOrderRecords.filter((entry) => related(entry, id))
  const conflicts = conflictRecords.filter((entry) => related(entry, id) && entry.record.state !== "resolved")
  const rawState = str(data.state, "draft")
  const hasCompleteReceipt = receipts.some((entry) => entry.record.status === "complete")
  let status: MissionStatus = "draft"
  if (rawState === "blocked" || conflicts.length) status = "blocked"
  else if (rawState === "complete" && hasCompleteReceipt) status = "complete"
  else if (rawState === "complete" || receipts.some((entry) => entry.record.status === "partial")) status = "verification"
  else if (rawState === "executing" || rawState === "in_progress") status = "partial"
  else if (rawState === "approved-for-execution" || workOrders.length) status = "planned"
  const domains = arr(data.domains)
  const domain = domains.some((value) => /brain|ai|evidence|tool-connection/i.test(value)) ? "Brain"
    : domains.some((value) => /auth|account|sync|youtube-api|service/i.test(value)) ? "Citadel"
    : domains.some((value) => /video|editor|render|creator-tools|publishing/i.test(value)) ? "Forge"
    : domains.some((value) => /task-index|planning|artifact|documentation|mission/i.test(value)) ? "Compass"
    : domains.some((value) => /dashboard|analytics|visualization|ui/i.test(value)) ? "Observatory" : "System"
  const owners = Object.values(object(data.canonicalOwners)).filter((value): value is string => typeof value === "string")
  const writers = workOrders.flatMap((entry) => Array.isArray(entry.record.writers) ? entry.record.writers.map((writer) => str(object(writer).role, "")).filter(Boolean) : [])
  const evidence = [
    ...workOrders.map((entry) => `Work order: ${str(entry.record.executionId, entry.path.split("/").pop())}`),
    ...receipts.map((entry) => `Receipt: ${str(entry.record.status, "recorded")}`),
    ...artifactRecords.filter((entry) => related(entry, id)).map((entry) => `Artifact: ${str(entry.record.artifactId, "recorded")}`),
  ]
  const blockers = [
    ...receipts.flatMap((entry) => arr(entry.record.limitations)),
    ...conflicts.map((entry) => str(entry.record.topic || entry.record.question)),
  ]
  if (!receipts.length) blockers.unshift("No verification receipt recorded in the Royal Exchange.")
  if (rawState === "complete" && !hasCompleteReceipt) blockers.unshift("Mission state says complete, but no complete receipt supports that claim.")
  return {
    id, title: str(data.title, id.replace(/^VT-MISSION-/, "").replace(/-/g, " ")), objective: str(data.objective),
    domain, status, risk: str(data.risk, "unknown"), owner: owners.length ? owners.join(" · ") : "No canonical owner recorded",
    executionOwner: writers.length ? [...new Set(writers)].join(" · ") : workOrders.length ? "EMPEROR work order recorded" : "No work order recorded",
    taskIds: arr(data.taskIds), acceptance: arr(data.acceptance), evidence, blockers,
    artifacts: artifactRecords.filter((entry) => related(entry, id)).map((entry) => str(entry.record.artifactId, entry.path)),
  }
}
const missions = missionRecords.map(deriveMission)
const statusLabel = (status: MissionStatus) => status.replaceAll("_", " ")
const pretty = (value: unknown) => rawText(value)
const categoryRecords = (kind: string) => recordsIn(kind)

const RecordCard: React.FC<{ item: ExchangeRecord; accent?: string }> = ({ item, accent = "#fff" }) => {
  const record = item.record
  const title = str(record.title || record.question || record.topic || record.receiptId || record.decisionId || record.artifactId || record.executionId || record.handoffId || record.conflictId, item.path.split("/").pop() || item.path)
  return <article className={`${card} overflow-hidden`}>
    <header className="border-b-[3px] border-black p-3" style={{ backgroundColor: accent }}>
      <div className="text-[9px] font-black uppercase tracking-[.14em]">{item.path}</div>
      <h3 className="mt-1 text-sm font-black uppercase">{title}</h3>
    </header>
    <div className="space-y-2 p-3 text-xs">
      {Object.entries(record).filter(([key]) => key !== "schemaVersion").map(([key, value]) => <div key={key} className="grid gap-1 sm:grid-cols-[125px_1fr]">
        <div className="font-black uppercase text-black/50">{key}</div>
        <pre className="whitespace-pre-wrap break-words font-mono text-[11px]">{pretty(value)}</pre>
      </div>)}
    </div>
  </article>
}

const MissionCard: React.FC<{ mission: Mission }> = ({ mission }) => (
  <article className={`${card} overflow-hidden`}>
    <header className="flex items-start justify-between gap-3 border-b-[4px] border-black p-4" style={{ backgroundColor: tones[mission.domain] }}>
      <div><div className="text-[10px] font-black uppercase tracking-[.16em]">{mission.domain}</div><h3 className="mt-1 text-xl font-black uppercase leading-[.95]">{mission.title}</h3></div>
      <span className="inline-flex items-center gap-1 rounded-full border-[2px] border-black bg-white px-2 py-1 text-[10px] font-black uppercase">{mission.status === "complete" ? <CheckCircle2 size={12}/> : mission.status === "blocked" ? <AlertTriangle size={12}/> : <CircleDot size={12}/>} {statusLabel(mission.status)}</span>
    </header>
    <div className="p-4"><p className="text-sm font-bold leading-5">{mission.objective}</p>
      <div className="mt-3 grid gap-2 sm:grid-cols-2"><div className="rounded-lg border-2 border-black bg-[#f4f4ef] p-3"><div className="text-[9px] font-black uppercase text-black/50">Desired-state owner</div><div className="mt-1 text-xs font-black">{mission.owner}</div></div><div className="rounded-lg border-2 border-black bg-[#f4f4ef] p-3"><div className="text-[9px] font-black uppercase text-black/50">Execution owner</div><div className="mt-1 text-xs font-black">{mission.executionOwner}</div></div></div>
      <div className="mt-3 text-[10px] font-black uppercase">Acceptance · {mission.acceptance.length}</div><ul className="mt-1 list-disc pl-5 text-xs font-bold">{mission.acceptance.map((item) => <li key={item}>{item}</li>)}</ul>
      <div className="mt-3 text-[10px] font-black uppercase">Exchange evidence · {mission.evidence.length}</div><ul className="mt-1 list-disc pl-5 text-xs font-bold">{mission.evidence.map((item) => <li key={item}>{item}</li>)}</ul>
      {mission.blockers.length > 0 ? <div className="mt-3 rounded-lg border-2 border-black bg-[#ffefae] p-3"><div className="text-[10px] font-black uppercase">Unresolved / missing evidence</div><ul className="mt-1 list-disc pl-5 text-xs font-bold">{mission.blockers.map((item, index) => <li key={index}>{item}</li>)}</ul></div> : null}
    </div>
  </article>
)

const Panel: React.FC<{ title: string; note: string; children: React.ReactNode }> = ({ title, note, children }) => <section className="mt-4 grid gap-4 lg:grid-cols-[.72fr_1.28fr]"><div className={`${card} p-5 h-fit`}><h2 className="text-2xl font-black uppercase">{title}</h2><p className="mt-3 text-sm font-bold leading-5">{note}</p><div className="mt-4 rounded-xl border-2 border-black bg-[#c0f240] p-3 text-xs font-black uppercase">Royal Exchange · read only</div></div><div className="grid gap-3">{children}</div></section>

const CrownControlRoom: React.FC = () => {
  const [section, setSection] = useState<SectionId>("today")
  const [domain, setDomain] = useState("All")
  const visibleMissions = useMemo(() => domain === "All" ? missions : missions.filter((mission) => mission.domain === domain), [domain])
  const openConflicts = conflictRecords.filter((item) => item.record.state !== "resolved")
  const pendingDecisions = decisionRecords.filter((item) => ["proposed", "needs-creator-decision"].includes(str(item.record.state, "")))
  const incomplete = missions.filter((mission) => mission.status !== "complete")
  const missionEvidence = (id: string) => receiptRecords.filter((item) => related(item, id))
  const codeRecords = [...workOrderRecords, ...receiptRecords.filter((item) => Array.isArray(item.record.changedPaths) || Array.isArray(item.record.changed))]
  const serviceMissions = missions.filter((mission) => mission.domain === "Citadel")
  const brainMissions = missions.filter((mission) => mission.domain === "Brain")
  const releaseRecords = receiptRecords.filter((item) => /release|deploy|production|live|preview|commit|pull request/i.test(JSON.stringify(item.record)))
  const todayItems = [
    ...openConflicts.map((item) => ({ title: str(item.record.topic || item.record.question, "Open conflict"), detail: str(item.record.recommendedResolution || item.record.executableConstraint), path: item.path })),
    ...pendingDecisions.map((item) => ({ title: str(item.record.question), detail: str(item.record.recommendation), path: item.path })),
    ...incomplete.map((item) => ({ title: item.title, detail: item.blockers[0] || "Awaiting evidence-backed completion.", path: `.viewtube/exchange/missions/${item.id}.json` })),
  ]
  const metrics: [string, number, string][] = [
    ["Missions", missions.length, "#36e0f6"],
    ["Receipt-backed complete", missions.filter((mission) => mission.status === "complete").length, "#c0f240"],
    ["Open conflicts", openConflicts.length, "#fa618a"],
    ["Exchange records", RECORDS.length, "#ffda47"],
  ]
  const noData = (label: string) => <div className={`${card} p-5 text-sm font-bold`}>No {label} evidence is recorded in <code>.viewtube/exchange/**</code>. State remains unknown; Crown does not query another runtime owner to fill the gap.</div>

  return <main className="min-h-full bg-[#efefe8] px-3 py-4 text-black sm:px-5 sm:py-6 lg:px-7">
    <section className={`${card} overflow-hidden`}><div className="grid lg:grid-cols-[1.45fr_.55fr]">
      <div className="bg-[#c0f240] p-5 sm:p-7"><div className="inline-flex items-center gap-2 rounded-full border-2 border-black bg-white px-3 py-1 text-[10px] font-black uppercase tracking-[.14em]"><Crown size={14}/> Crown Control Room</div><h1 className="mt-4 max-w-4xl text-4xl font-black uppercase leading-[.86] sm:text-6xl">Creator intent → verified execution</h1><p className="mt-4 max-w-3xl text-sm font-bold leading-6 sm:text-base">Read-only governance across mission, task, artifact, execution, code, services, Brain and release evidence.</p></div>
      <div className="border-t-4 border-black bg-black p-5 text-white lg:border-l-4 lg:border-t-0"><div className="text-[10px] font-black uppercase tracking-[.16em] text-white/50">Runtime contract</div><div className="mt-3 text-2xl font-black uppercase">Read only</div><div className="mt-4 space-y-2 text-xs font-bold text-white/80"><div>Source: {CROWN_EXCHANGE_SOURCE}</div><div>Records: {RECORDS.length}</div><div>Generated from repository Exchange at Vite startup/build</div><div>No Task Index / service / Brain / release API reads</div><div>No writes, deploy, billing or OAuth authority</div></div></div>
    </div></section>
    <section className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{metrics.map(([label, value, tone]) => <div key={label} className={`${card} p-4`} style={{ backgroundColor: tone }}><div className="text-[10px] font-black uppercase tracking-[.14em]">{label}</div><div className="mt-1 text-4xl font-black">{value}</div></div>)}</section>
    <nav className="mt-5 flex gap-2 overflow-x-auto pb-2" aria-label="Crown Control Room sections">{sections.map(([id, label, Icon]) => <button key={id} type="button" onClick={() => setSection(id)} className={`inline-flex shrink-0 items-center gap-2 rounded-xl border-[3px] border-black px-3 py-2 text-[11px] font-black uppercase shadow-[4px_4px_0_0_#000] ${section === id ? "bg-[#c0f240]" : "bg-white"}`}><Icon size={15} strokeWidth={3}/>{label}</button>)}</nav>

    {section === "today" ? <section className="mt-4 grid gap-4 xl:grid-cols-[.7fr_1.3fr]"><div className={`${card} bg-[#ffefae] p-5`}><Sparkles size={20}/><h2 className="mt-3 text-2xl font-black uppercase">Evidence-led priorities</h2><p className="mt-3 text-sm font-bold">Priorities are derived only from Exchange missions, decisions, conflicts and receipts. A mission, plan, commit or schema check is not proof of production behavior.</p><div className="mt-4 text-4xl font-black">{todayItems.length}</div><div className="text-[10px] font-black uppercase">Items requiring attention</div></div><div className="grid gap-3">{todayItems.length ? todayItems.map((item, index) => <article key={item.path + index} className={`${card} p-4`}><div className="text-[9px] font-black uppercase text-black/50">{item.path}</div><h3 className="mt-1 text-sm font-black uppercase">{item.title}</h3><p className="mt-2 text-xs font-bold">{item.detail}</p></article>) : noData("priority")}</div></section> : null}

    {section === "missions" ? <section className="mt-4"><div className="mb-4 flex flex-wrap gap-2">{["All", "Observatory", "Citadel", "Brain", "Forge", "Compass", "System"].map((item) => <button key={item} type="button" onClick={() => setDomain(item)} className={`rounded-full border-2 border-black px-3 py-1.5 text-[10px] font-black uppercase ${domain === item ? "bg-black text-white" : "bg-white"}`}>{item}</button>)}</div><div className="grid gap-4 xl:grid-cols-2">{visibleMissions.map((mission) => <MissionCard key={mission.id} mission={mission}/>)}</div></section> : null}

    {section === "tasks" ? <Panel title="Task references" note="Only taskIds explicitly recorded on Exchange mission records are shown. The canonical Task Index is not read or mirrored here.">{missions.map((mission) => <article key={mission.id} className={`${card} p-4`}><div className="text-[10px] font-black uppercase">{mission.domain} · {mission.id}</div><div className="mt-2 text-xs font-bold">Task references: {mission.taskIds.length ? mission.taskIds.join(", ") : "None recorded in mission packet."}</div></article>)}</Panel> : null}
    {section === "artifacts" ? <Panel title="Artifacts" note="Artifact provenance and verification claims are displayed exactly from Exchange records.">{categoryRecords("artifacts").length ? categoryRecords("artifacts").map((item) => <RecordCard key={item.path} item={item} accent="#36e0f6"/>) : noData("artifact")}</Panel> : null}
    {section === "decisions" ? <Panel title="Decisions" note="Decision records retain their state, rationale, alternatives and supporting evidence.">{decisionRecords.length ? decisionRecords.map((item) => <RecordCard key={item.path} item={item} accent="#f1dcff"/>) : noData("decision")}</Panel> : null}
    {section === "execution" ? <Panel title="Execution" note="Work orders prove that an execution packet was recorded. They do not prove implementation success.">{workOrderRecords.length ? workOrderRecords.map((item) => <RecordCard key={item.path} item={item} accent="#ffa85c"/>) : noData("work-order")}</Panel> : null}
    {section === "verification" ? <Panel title="Verification" note="Receipts are independent evidence records. Partial receipts, schema checks and limitations are never promoted to live success.">{receiptRecords.length ? receiptRecords.map((item) => <RecordCard key={item.path} item={item} accent="#c0f240"/>) : noData("receipt")}</Panel> : null}
    {section === "code" ? <Panel title="Code evidence" note="Code and repository claims appear only when an Exchange work order or receipt records them. No GitHub, Git or deployment query runs from this view.">{codeRecords.length ? codeRecords.map((item) => <RecordCard key={item.path} item={item} accent="#36e0f6"/>) : noData("code")}</Panel> : null}
    {section === "services" ? <Panel title="Service evidence" note="Service and account status is not polled. This panel exposes only Citadel/service-related mission and receipt evidence already recorded in the Exchange.">{serviceMissions.length ? serviceMissions.map((mission) => <MissionCard key={mission.id} mission={mission}/>) : noData("service")}{receiptRecords.filter((item) => /auth|account|sync|youtube|service/i.test(JSON.stringify(item.record))).map((item) => <RecordCard key={item.path} item={item}/>)}</Panel> : null}
    {section === "brain" ? <Panel title="Brain evidence" note="Brain context, capability, memory and tool claims are shown only when explicitly recorded in Exchange mission or receipt records. No live Brain context or memory store is queried.">{brainMissions.length ? brainMissions.map((mission) => <MissionCard key={mission.id} mission={mission}/>) : noData("Brain")}{receiptRecords.filter((item) => /brain|evidence|tool|memory/i.test(JSON.stringify(item.record))).map((item) => <RecordCard key={item.path} item={item}/>)}</Panel> : null}
    {section === "release" ? <Panel title="Release evidence" note="Commit, PR, preview, deployment and live verification are separate claims. Only explicit Exchange receipts are rendered; absence means unknown, not successful.">{releaseRecords.length ? releaseRecords.map((item) => <RecordCard key={item.path} item={item} accent="#fa618a"/>) : noData("release")}</Panel> : null}

    <footer className="mt-5 grid gap-2 text-[10px] font-black uppercase sm:grid-cols-2"><div className={`${card} p-3`}>Read-only projection: {String(CROWN_EXCHANGE_READ_ONLY)}</div><div className={`${card} p-3`}>Exchange records: {RECORDS.length} · {missionRecords.length} missions · {receiptRecords.length} receipts · {workOrderRecords.length} work orders · {artifactRecords.length} artifacts · {decisionRecords.length} decisions · {conflictRecords.length} conflicts · {handoffRecords.length} handoffs</div></footer>
  </main>
}

export default CrownControlRoom
