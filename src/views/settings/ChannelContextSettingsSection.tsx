import React, { useMemo, useState } from "react"
import { StudioButton, StudioTextInput } from "../../studio-ui"
import { CHANNEL_CONTEXT_QUESTIONS, type ChannelContextQuestion } from "../../context/channelContextQuestions"
import type { ChannelContextProfile } from "../../context/ChannelContextProfile"
import { scoreContext } from "../../context/ChannelContextScoring"
import { loadAiBrainContext, saveAiBrainContext } from "../../services/aiBrainContext"

const CATEGORIES = [
  ["identity", "Channel identity"],
  ["goals", "Goals & outcomes"],
  ["audience", "Audience"],
  ["content", "Content strategy"],
  ["brand", "Brand voice"],
  ["intelligence", "Brain intelligence"],
] as const

const readField = (profile: ChannelContextProfile, path: string): unknown =>
  path.split(".").reduce<unknown>((value, key) =>
    value && typeof value === "object" ? (value as Record<string, unknown>)[key] : undefined, profile)

const writeField = (profile: ChannelContextProfile, path: string, value: unknown): ChannelContextProfile => {
  const [section, field] = path.split(".")
  const current = profile[section as keyof ChannelContextProfile]
  return { ...profile, [section]: { ...current, [field]: value } } as ChannelContextProfile
}

const displayValue = (value: unknown): string =>
  Array.isArray(value) ? value.join(", ") : value === undefined || value === null ? "" : String(value)

const parseAnswer = (question: ChannelContextQuestion, value: string): unknown => {
  if (["subNiches", "competitors", "priorityRanking", "offers", "segments", "types", "bestFormats", "priorityThemes", "blockedThemes", "influences", "sources", "capabilities"].includes(question.contextField.split(".")[1])) {
    return value.split(",").map((item) => item.trim()).filter(Boolean)
  }
  if (question.contextField === "brand.creativity") {
    if (!value.trim()) return undefined
    const parsed = Number(value)
    return Number.isFinite(parsed) ? Math.max(1, Math.min(10, parsed)) : undefined
  }
  return value
}

export const ChannelContextSettingsSection: React.FC = () => {
  const [profile, setProfile] = useState<ChannelContextProfile>(() => loadAiBrainContext().channelContext)
  const [saved, setSaved] = useState(false)
  const score = useMemo(() => scoreContext(profile), [profile])

  const update = (question: ChannelContextQuestion, value: string) => {
    setProfile((current) => writeField(current, question.contextField, parseAnswer(question, value)))
    setSaved(false)
  }

  const save = () => {
    const current = loadAiBrainContext()
    saveAiBrainContext({ channelContext: profile, source: current.source === "system" ? "wizard" : current.source })
    setSaved(true)
  }

  return (
    <section className="min-w-0 space-y-4" aria-labelledby="channel-context-title">
      <header className="space-y-2">
        <p className="text-xs font-black uppercase tracking-widest">Creator Brain · Context</p>
        <h2 id="channel-context-title" className="text-2xl font-black uppercase">Teach the Brain your channel</h2>
        <p className="max-w-3xl text-sm">Set the strategy, audience, content boundaries, and intelligence permissions that should shape future assistance. Your answers are saved with the existing Creator Brain profile.</p>
        <div className="flex flex-wrap items-center gap-3" aria-live="polite">
          <strong className="text-lg tabular-nums">{score.completionScore}%</strong>
          <span className="text-sm">required context complete · {score.requiredCount - score.missingFields.length} of {score.requiredCount} required answers</span>
          <div className="h-2 min-w-28 flex-1 overflow-hidden rounded-full border border-black" role="progressbar" aria-label="Required context completion" aria-valuemin={0} aria-valuemax={100} aria-valuenow={score.completionScore}>
            <div className="h-full bg-[var(--pair-a)]" style={{ width: `${score.completionScore}%` }} />
          </div>
        </div>
      </header>
      {CATEGORIES.map(([category, title]) => (
        <section key={category} className="min-w-0 space-y-3 border-2 border-black p-3 sm:p-4" aria-labelledby={`channel-context-${category}`}>
          <h3 id={`channel-context-${category}`} className="text-base font-black uppercase">{title}</h3>
          <div className="grid min-w-0 grid-cols-1 gap-3 lg:grid-cols-2">
            {CHANNEL_CONTEXT_QUESTIONS.filter((question) => question.category === category).map((question) => {
              const value = displayValue(readField(profile, question.contextField))
              const missing = question.required && score.missingFields.includes(question.contextField)
              const arrayField = ["subNiches", "competitors", "priorityRanking", "offers", "segments", "types", "bestFormats", "priorityThemes", "blockedThemes", "influences", "sources", "capabilities"].includes(question.contextField.split(".")[1])
              return (
                <label key={question.id} className="min-w-0 space-y-1">
                  <span className="flex items-start gap-2 text-sm font-bold">
                    <span className="min-w-0 flex-1">{question.title}</span>
                    {question.required ? <span aria-label="Required" className="shrink-0 text-xs">REQUIRED</span> : <span className="shrink-0 text-xs opacity-60">OPTIONAL</span>}
                  </span>
                  <StudioTextInput
                    sizeVariant="standard"
                    value={value}
                    onChange={(event) => update(question, event.currentTarget.value)}
                    placeholder={arrayField ? "Separate items with commas" : question.contextField === "brand.creativity" ? "1–10" : "Add your answer"}
                    type={question.contextField === "brand.creativity" ? "number" : "text"}
                    min={question.contextField === "brand.creativity" ? 1 : undefined}
                    max={question.contextField === "brand.creativity" ? 10 : undefined}
                    aria-invalid={missing}
                    aria-describedby={missing ? `${question.id}-required` : undefined}
                  />
                  {missing ? <span id={`${question.id}-required`} className="block text-xs font-bold">Add an answer to complete required context.</span> : null}
                </label>
              )
            })}
          </div>
        </section>
      ))}
      <footer className="flex flex-wrap items-center justify-between gap-3 border-2 border-black p-3">
        <p className="text-sm" role="status">{saved ? "Channel context saved to your Creator Brain profile." : "Changes stay local until you save."}</p>
        <StudioButton onClick={save}>Save channel context</StudioButton>
      </footer>
    </section>
  )
}

export default ChannelContextSettingsSection
