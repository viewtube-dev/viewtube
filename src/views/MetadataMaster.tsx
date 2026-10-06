import React, { useEffect, useMemo, useState } from "react"
import {
  ArrowRight,
  BarChart3,
  Check,
  CheckCircle2,
  FileText,
  FlaskConical,
  Image as ImageIcon,
  Lock,
  PackageCheck,
  RefreshCcw,
  Send,
  Sparkles,
  Target,
  WandSparkles,
} from "lucide-react"
import { ToolboxScaffold, SubToolbox } from "../components/Toolbox"
import {
  SubToolboxActions,
  SubToolboxGrid,
  SubToolboxSection,
  SubToolboxStack,
} from "../components/subtoolbox/SubToolboxLayouts"
import {
  SubToolboxAlert,
  SubToolboxButton,
  SubToolboxInput,
  SubToolboxOutputCard,
  SubToolboxSelect,
  SubToolboxStatePanel,
  SubToolboxTextArea,
} from "../components/subtoolbox/SubToolboxPrimitives"
import { useBrain } from "../context/useBrain"
import { generateSeoData } from "../services/gemini"
import {
  createMetadataMasterSet,
  createEmptyMetadataMasterPackage,
  finalizeMetadataMasterPackage,
  listMetadataMasterPackages,
  packageFromSeoResult,
  packageToHandoffPayload,
  saveMetadataMasterPackage,
  type MetadataMasterGoal,
  type MetadataMasterIntensity,
  type MetadataMasterPackage,
  type MetadataMasterSet,
  type MetadataMasterSlot,
} from "../services/metadataMaster"
import {
  createViewTubeActionPacket,
  persistViewTubeActionPacket,
} from "../services/viewTubeToolChains"

interface MetadataMasterProps {
  embedded?: boolean
  collapsible?: boolean
  isOpenInitial?: boolean
  paletteIndex?: number
}

const GOALS: Array<{ value: MetadataMasterGoal; label: string }> = [
  { value: "reach", label: "Reach" },
  { value: "search", label: "Search" },
  { value: "browse", label: "Browse" },
  { value: "subscribers", label: "Subscribers" },
  { value: "revenue", label: "Revenue" },
  { value: "authority", label: "Authority" },
]

const SLOTS: Array<{ id: MetadataMasterSlot; label: string }> = [
  { id: "title", label: "Title" },
  { id: "thumbnail", label: "Thumbnail" },
  { id: "description", label: "Description" },
  { id: "tags", label: "Tags" },
  { id: "chapters", label: "Chapters" },
  { id: "category", label: "Category" },
  { id: "playlist", label: "Playlist" },
  { id: "endScreen", label: "End Screen" },
  { id: "schedule", label: "Schedule" },
]

const clampSets = (value: number) => Math.max(1, Math.min(5, value))

const MetadataMaster: React.FC<MetadataMasterProps> = ({
  embedded = false,
  collapsible = false,
  isOpenInitial = true,
  paletteIndex = 12,
}) => {
  const { brain } = useBrain()
  const [isOpen, setIsOpen] = useState(isOpenInitial)
  const [goal, setGoal] = useState<MetadataMasterGoal>("reach")
  const [intensity, setIntensity] = useState<MetadataMasterIntensity>("balanced")
  const [setCount, setSetCount] = useState(3)
  const [concept, setConcept] = useState(brain.coreConcept || "")
  const [niche, setNiche] = useState(brain.targetNiche || "")
  const [audience, setAudience] = useState("")
  const [script, setScript] = useState("")
  const [videoLength, setVideoLength] = useState("10:00")
  const [channelHandle, setChannelHandle] = useState("")
  const [resourceLinks, setResourceLinks] = useState("")
  const [publishedVideoId, setPublishedVideoId] = useState("")
  const [packageDraft, setPackageDraft] = useState<MetadataMasterPackage>(() => createEmptyMetadataMasterPackage())
  const [sets, setSets] = useState<MetadataMasterSet[]>([])
  const [selectedSetId, setSelectedSetId] = useState<string | null>(null)
  const [lockedSlots, setLockedSlots] = useState<MetadataMasterSlot[]>([])
  const [appliedSlots, setAppliedSlots] = useState<MetadataMasterSlot[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastAction, setLastAction] = useState<string>("Ready")
  const [history, setHistory] = useState<MetadataMasterPackage[]>([])

  useEffect(() => {
    setHistory(listMetadataMasterPackages())
  }, [])

  useEffect(() => {
    setPackageDraft(current => finalizeMetadataMasterPackage({
      ...current,
      lockedSlots,
      appliedSlots,
    }))
  }, [lockedSlots, appliedSlots])

  const selectedSet = useMemo(
    () => sets.find(set => set.id === selectedSetId) ?? sets[0] ?? null,
    [selectedSetId, sets],
  )

  const currentScore = packageDraft.score
  const readinessLabel = currentScore >= 85 ? "READY" : currentScore >= 65 ? "REVIEW" : "NEEDS WORK"

  const toggleLock = (slot: MetadataMasterSlot) => {
    setLockedSlots(current =>
      current.includes(slot) ? current.filter(value => value !== slot) : [...current, slot],
    )
  }

  const toggleApply = (slot: MetadataMasterSlot) => {
    setAppliedSlots(current =>
      current.includes(slot) ? current.filter(value => value !== slot) : [...current, slot],
    )
  }

  const updatePackage = (patch: Partial<MetadataMasterPackage>) => {
    setPackageDraft(current => finalizeMetadataMasterPackage({ ...current, ...patch, lockedSlots, appliedSlots }))
  }

  const generate = async () => {
    if (!concept.trim() || !niche.trim()) {
      setError("Add a core concept and niche before generating the publication package.")
      return
    }

    setLoading(true)
    setError(null)
    setLastAction("Analyzing context and generating package candidates…")

    try {
      const result = await generateSeoData(
        concept,
        niche,
        script,
        audience,
        videoLength,
        channelHandle || "current channel",
        resourceLinks,
        "Longform",
        undefined,
        brain,
      )

      const generated = packageFromSeoResult(result, {
        goal,
        intensity,
        videoId: publishedVideoId || null,
      })

      const candidates = result.titleSets.slice(0, clampSets(setCount)).map((titleSet, index) => {
        const candidate = finalizeMetadataMasterPackage({
          ...generated,
          id: crypto.randomUUID(),
          version: index + 1,
          title: titleSet.title || generated.title,
          thumbnailPrompt: titleSet.thumbnailPrompt || generated.thumbnailPrompt,
          thumbnailText: titleSet.thumbnailText || generated.thumbnailText,
          lockedSlots,
          appliedSlots,
          provenance: ["Content context", "ViewTube Brain", "generateSeoData", "Metadata Master"],
        })
        const strategy: MetadataMasterSet["strategy"] =
          index === 0 ? "search" : index === 1 ? "curiosity" : index === 2 ? "authority" : "custom"
        return createMetadataMasterSet(candidate, `PACKAGE ${String.fromCharCode(65 + index)}`, strategy)
      })

      const primary = candidates[0]?.package ?? generated
      setSets(candidates)
      setSelectedSetId(candidates[0]?.id ?? null)
      setPackageDraft(primary)
      saveMetadataMasterPackage(primary)
      setHistory(listMetadataMasterPackages())
      setAppliedSlots(["title", "description", "tags", "thumbnail", "category"])
      setLastAction(`Generated ${candidates.length} coherent publication package${candidates.length === 1 ? "" : "s"}.`)
    } catch (generationError) {
      setError(generationError instanceof Error ? generationError.message : String(generationError))
      setLastAction("Generation failed")
    } finally {
      setLoading(false)
    }
  }

  const applySelectedSet = (set: MetadataMasterSet) => {
    setPackageDraft(finalizeMetadataMasterPackage({
      ...set.package,
      lockedSlots,
      appliedSlots,
    }))
    setSelectedSetId(set.id)
    setLastAction(`${set.label} selected as the working publication package.`)
  }

  const savePackage = () => {
    const finalized = finalizeMetadataMasterPackage({
      ...packageDraft,
      lockedSlots,
      appliedSlots,
      version: packageDraft.version + 1,
    })
    setPackageDraft(finalized)
    saveMetadataMasterPackage(finalized)
    setHistory(listMetadataMasterPackages())
    setLastAction("Publication Package saved.")
  }

  const handoff = (targetToolId: "video-publisher" | "video-manager" | "thumbnail-studio") => {
    if (targetToolId === "video-manager" && !publishedVideoId) {
      setError("Video Manager handoff requires a published video ID so the live-video owner can target the correct video.")
      return
    }

    const finalized = finalizeMetadataMasterPackage({ ...packageDraft, lockedSlots, appliedSlots })
    saveMetadataMasterPackage(finalized)

    const packet = createViewTubeActionPacket({
      sourceToolId: "metadata-master",
      sourceKind: "studio-tool",
      payloadKind: "metadata",
      title: `Metadata Master → ${targetToolId}`,
      summary: `Publication Package v${finalized.version} prepared for ${targetToolId}.`,
      payload: packageToHandoffPayload(finalized),
      projectId: finalized.projectId,
      contentBuildId: finalized.contentBuildId,
      videoId: finalized.videoId || publishedVideoId || null,
      evidence: finalized.provenance,
      provenance: ["Metadata Master", "Publication Package"],
      suggestedTargets: [targetToolId],
    })
    persistViewTubeActionPacket(packet)
    setLastAction(`Publication Package handed off to ${targetToolId}.`)
    setError(null)
  }

  const reset = () => {
    setSets([])
    setSelectedSetId(null)
    setPackageDraft(createEmptyMetadataMasterPackage({
      goal,
      intensity,
      videoId: publishedVideoId || null,
    }))
    setAppliedSlots([])
    setLockedSlots([])
    setLastAction("Working package reset.")
  }

  return (
    <ToolboxScaffold
      title="METADATA MASTER"
      subtitle="Optimize and assemble the publication package"
      icon={<PackageCheck size={40} strokeWidth={3} className="text-black" />}
      paletteIndex={paletteIndex}
      collapsible={collapsible}
      isOpen={isOpen}
      onToggle={() => setIsOpen(value => !value)}
      embedded={embedded}
      helpText="Generate, evaluate, compare and package publication metadata. Video Publisher publishes it; Video Manager owns live-video changes."
      contentClassName={embedded ? "p-0" : "p-4 md:p-6 lg:p-8"}
    >
      <div className="flex min-w-0 flex-col gap-4">
        <SubToolboxStatePanel
          level="l0"
          state={loading ? "loading" : error ? "error" : "ready"}
          message={loading ? lastAction : error ?? `PACKAGE READINESS: ${readinessLabel} · ${currentScore}/100`}
          action={error ? <SubToolboxButton size="compact" tone="neutral" icon={<RefreshCcw size={15} />} onClick={() => setError(null)}>Clear</SubToolboxButton> : undefined}
        />

        <SubToolbox
          title="01 CONTEXT + OPTIMIZATION BRIEF"
          icon={<Target size={22} />}
          paletteIndex={paletteIndex + 1}
          collapsible
          isOpenInitial
        >
          <SubToolboxStack density="dense">
            <SubToolboxGrid minItemWidth="standard" density="dense">
              <SubToolboxSection label="CORE CONTEXT">
                <SubToolboxInput value={concept} onChange={event => setConcept(event.target.value)} placeholder="Core concept / video promise" aria-label="Core concept" />
                <SubToolboxInput value={niche} onChange={event => setNiche(event.target.value)} placeholder="Niche / topic" aria-label="Niche" />
                <SubToolboxInput value={audience} onChange={event => setAudience(event.target.value)} placeholder="Target audience" aria-label="Target audience" />
              </SubToolboxSection>
              <SubToolboxSection label="VIDEO CONTEXT">
                <SubToolboxInput value={videoLength} onChange={event => setVideoLength(event.target.value)} placeholder="10:00" aria-label="Video length" />
                <SubToolboxInput value={channelHandle} onChange={event => setChannelHandle(event.target.value)} placeholder="Channel URL or handle" aria-label="Channel handle" />
                <SubToolboxInput value={publishedVideoId} onChange={event => setPublishedVideoId(event.target.value)} placeholder="Published video ID (optional)" aria-label="Published video ID" />
              </SubToolboxSection>
            </SubToolboxGrid>

            <SubToolboxSection label="OPTIMIZATION GOAL">
              <SubToolboxSelect value={goal} onChange={event => setGoal(event.target.value as MetadataMasterGoal)} aria-label="Optimization goal">
                {GOALS.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
              </SubToolboxSelect>
            </SubToolboxSection>

            <SubToolboxSection label="OPTIMIZATION INTENSITY">
              <SubToolboxActions columns={3}>
                {(["light", "balanced", "aggressive"] as MetadataMasterIntensity[]).map(value => (
                  <SubToolboxButton key={value} size="compact" selected={intensity === value} onClick={() => setIntensity(value)}>
                    {value}
                  </SubToolboxButton>
                ))}
              </SubToolboxActions>
            </SubToolboxSection>

            <SubToolboxSection label="SOURCE MATERIAL">
              <SubToolboxTextArea
                height="compact"
                value={script}
                onChange={event => setScript(event.target.value)}
                placeholder="Paste script/transcript context when available…"
                aria-label="Script or transcript context"
              />
              <SubToolboxInput
                value={resourceLinks}
                onChange={event => setResourceLinks(event.target.value)}
                placeholder="Reference links / research context"
                aria-label="Reference links"
              />
            </SubToolboxSection>
          </SubToolboxStack>
        </SubToolbox>

        <SubToolbox
          title="02 GENERATE + OPTIMIZE"
          icon={<WandSparkles size={22} />}
          paletteIndex={paletteIndex + 2}
          collapsible
          isOpenInitial
        >
          <SubToolboxActions columns={2}>
            <SubToolboxButton
              size="action"
              icon={<Sparkles size={20} />}
              onClick={() => void generate()}
              disabled={loading}
            >
              {loading ? "GENERATING…" : "OPTIMIZE PACKAGE"}
            </SubToolboxButton>
            <SubToolboxButton
              size="action"
              tone="neutral"
              icon={<FlaskConical size={20} />}
              onClick={() => setSetCount(value => clampSets(value + 1))}
              disabled={setCount >= 5}
            >
              {setCount} PACKAGE SETS
            </SubToolboxButton>
          </SubToolboxActions>

          <SubToolboxSection label="GENERATION SCOPE">
            <SubToolboxActions columns={3}>
              <SubToolboxButton size="compact" selected={setCount === 1} onClick={() => setSetCount(1)}>1 SET</SubToolboxButton>
              <SubToolboxButton size="compact" selected={setCount === 3} onClick={() => setSetCount(3)}>3 SETS</SubToolboxButton>
              <SubToolboxButton size="compact" selected={setCount === 5} onClick={() => setSetCount(5)}>5 SETS</SubToolboxButton>
            </SubToolboxActions>
          </SubToolboxSection>

          <SubToolboxSection label="LOCKED COMPONENTS">
            <SubToolboxGrid minItemWidth="compact" density="dense">
              {SLOTS.map(slot => (
                <SubToolboxButton
                  key={slot.id}
                  size="compact"
                  tone={lockedSlots.includes(slot.id) ? "warning" : "neutral"}
                  icon={lockedSlots.includes(slot.id) ? <Lock size={13} /> : undefined}
                  selected={lockedSlots.includes(slot.id)}
                  onClick={() => toggleLock(slot.id)}
                >
                  {slot.label}
                </SubToolboxButton>
              ))}
            </SubToolboxGrid>
          </SubToolboxSection>
        </SubToolbox>

        <SubToolbox
          title="03 PUBLICATION PACKAGE CANVAS"
          icon={<FileText size={22} />}
          paletteIndex={paletteIndex + 3}
          collapsible
          isOpenInitial
        >
          <SubToolboxStack density="dense">
            <SubToolboxGrid minItemWidth="standard" density="dense">
              <SubToolboxOutputCard title="TITLE" badge={packageDraft.title ? "READY" : "MISSING"}>
                <SubToolboxInput
                  value={packageDraft.title}
                  onChange={event => updatePackage({ title: event.target.value, source: "manual" })}
                  placeholder="Working title"
                  aria-label="Publication title"
                />
              </SubToolboxOutputCard>

              <SubToolboxOutputCard title="THUMBNAIL DIRECTION" badge={packageDraft.thumbnailPrompt ? "READY" : "MISSING"}>
                <SubToolboxStack density="dense">
                  <SubToolboxTextArea
                    height="compact"
                    value={packageDraft.thumbnailPrompt}
                    onChange={event => updatePackage({ thumbnailPrompt: event.target.value, source: "manual" })}
                    placeholder="Visual direction for Thumbnail Studio"
                    aria-label="Thumbnail direction"
                  />
                  <SubToolboxInput
                    value={packageDraft.thumbnailText}
                    onChange={event => updatePackage({ thumbnailText: event.target.value, source: "manual" })}
                    placeholder="Thumbnail text"
                    aria-label="Thumbnail text"
                  />
                </SubToolboxStack>
              </SubToolboxOutputCard>

              <SubToolboxOutputCard title="DESCRIPTION" badge={packageDraft.description ? "READY" : "MISSING"}>
                <SubToolboxTextArea
                  height="standard"
                  value={packageDraft.description}
                  onChange={event => updatePackage({ description: event.target.value, source: "manual" })}
                  placeholder="Publication description"
                  aria-label="Publication description"
                />
              </SubToolboxOutputCard>

              <SubToolboxOutputCard title="TAGS" badge={packageDraft.tags.length}>
                <SubToolboxInput
                  value={packageDraft.tags.join(", ")}
                  onChange={event => updatePackage({
                    tags: event.target.value.split(",").map(value => value.trim()).filter(Boolean),
                    source: "manual",
                  })}
                  placeholder="tag one, tag two, tag three"
                  aria-label="Publication tags"
                />
              </SubToolboxOutputCard>
            </SubToolboxGrid>

            <SubToolboxGrid minItemWidth="standard" density="dense">
              <SubToolboxOutputCard title="CHAPTERS / TIMESTAMPS">
                <SubToolboxTextArea
                  height="compact"
                  value={packageDraft.chapters}
                  onChange={event => updatePackage({ chapters: event.target.value, source: "manual" })}
                  placeholder="00:00 Intro\n01:20 Main point…"
                  aria-label="Chapters"
                />
              </SubToolboxOutputCard>
              <SubToolboxOutputCard title="CATEGORY">
                <SubToolboxInput value={packageDraft.category} onChange={event => updatePackage({ category: event.target.value, source: "manual" })} placeholder="YouTube category" aria-label="Category" />
              </SubToolboxOutputCard>
              <SubToolboxOutputCard title="PLAYLISTS">
                <SubToolboxInput value={packageDraft.playlistIds.join(", ")} onChange={event => updatePackage({ playlistIds: event.target.value.split(",").map(value => value.trim()).filter(Boolean), source: "manual" })} placeholder="Playlist IDs" aria-label="Playlist IDs" />
              </SubToolboxOutputCard>
              <SubToolboxOutputCard title="END SCREEN / RELATED VIDEO">
                <SubToolboxTextArea height="compact" value={packageDraft.endScreen} onChange={event => updatePackage({ endScreen: event.target.value, source: "manual" })} placeholder="Next-video destination / rationale" aria-label="End screen plan" />
              </SubToolboxOutputCard>
            </SubToolboxGrid>

            <SubToolboxSection label="APPLY TO DOWNSTREAM PACKAGE">
              <SubToolboxGrid minItemWidth="compact" density="dense">
                {SLOTS.map(slot => (
                  <SubToolboxButton
                    key={slot.id}
                    size="compact"
                    selected={appliedSlots.includes(slot.id)}
                    onClick={() => toggleApply(slot.id)}
                  >
                    {appliedSlots.includes(slot.id) ? "✓ " : ""}{slot.label}
                  </SubToolboxButton>
                ))}
              </SubToolboxGrid>
            </SubToolboxSection>
          </SubToolboxStack>
        </SubToolbox>

        <SubToolbox
          title="04 EVALUATE + COMPARE"
          icon={<BarChart3 size={22} />}
          paletteIndex={paletteIndex + 4}
          collapsible
          isOpenInitial
        >
          <SubToolboxGrid minItemWidth="standard" density="dense">
            <SubToolboxOutputCard title="PACKAGE SCORE" badge={readinessLabel} icon={<BarChart3 size={18} />}>
              <div className="flex items-end gap-3">
                <strong className="text-5xl font-black">{currentScore}</strong>
                <span className="pb-1 text-[10px] font-black uppercase opacity-50">/ 100 heuristic</span>
              </div>
              <p className="mt-2 text-xs font-bold opacity-60">
                Completeness, clarity, description quality, title/thumbnail complementarity and tag hygiene.
              </p>
            </SubToolboxOutputCard>

            <SubToolboxOutputCard title="WARNINGS" badge={packageDraft.warnings.length}>
              {packageDraft.warnings.length ? (
                <SubToolboxStack density="dense">
                  {packageDraft.warnings.map(warning => <SubToolboxAlert key={warning} level="l2" tone="warning" title="Review" detail={warning} />)}
                </SubToolboxStack>
              ) : (
                <SubToolboxStatePanel level="l2" state="ready" message="No current package conflicts detected." />
              )}
            </SubToolboxOutputCard>
          </SubToolboxGrid>

          {sets.length > 0 ? (
            <SubToolboxSection label="PACKAGE SETS">
              <SubToolboxGrid minItemWidth="standard" density="dense">
                {sets.map(set => (
                  <SubToolboxOutputCard
                    key={set.id}
                    title={set.label}
                    badge={set.score}
                    action={
                      <SubToolboxButton size="micro" tone={selectedSet?.id === set.id ? "success" : "neutral"} onClick={() => applySelectedSet(set)}>
                        {selectedSet?.id === set.id ? "SELECTED" : "USE"}
                      </SubToolboxButton>
                    }
                  >
                    <p className="text-xs font-black uppercase opacity-50">{set.strategy} strategy</p>
                    <p className="mt-2 text-sm font-black leading-tight">{set.package.title}</p>
                    <p className="mt-2 line-clamp-3 text-[11px] font-bold opacity-60">{set.package.description}</p>
                  </SubToolboxOutputCard>
                ))}
              </SubToolboxGrid>
            </SubToolboxSection>
          ) : (
            <SubToolboxStatePanel level="l1" state="empty" message="Generate 1–5 package sets to compare coherent title, description and thumbnail directions." />
          )}
        </SubToolbox>

        <SubToolbox
          title="05 HANDOFF + PUBLISHING CONTROL"
          icon={<Send size={22} />}
          paletteIndex={paletteIndex + 5}
          collapsible
          isOpenInitial
        >
          <SubToolboxAlert
            level="l1"
            tone="info"
            icon={<CheckCircle2 size={18} />}
            title="OWNERSHIP"
            detail="Metadata Master optimizes the package. Video Publisher executes publication. Video Manager owns changes to already-published videos."
          />
          <SubToolboxActions columns={3}>
            <SubToolboxButton icon={<Send size={18} />} onClick={() => handoff("video-publisher")}>SEND TO PUBLISHER</SubToolboxButton>
            <SubToolboxButton tone="neutral" icon={<ImageIcon size={18} />} onClick={() => handoff("thumbnail-studio")}>SEND THUMBNAIL BRIEF</SubToolboxButton>
            <SubToolboxButton tone="warning" icon={<ArrowRight size={18} />} onClick={() => handoff("video-manager")} disabled={!publishedVideoId}>PROPOSE LIVE UPDATE</SubToolboxButton>
          </SubToolboxActions>
          <SubToolboxActions columns={2}>
            <SubToolboxButton tone="success" icon={<PackageCheck size={18} />} onClick={savePackage}>SAVE PACKAGE</SubToolboxButton>
            <SubToolboxButton tone="neutral" icon={<RefreshCcw size={18} />} onClick={reset}>RESET WORKING PACKAGE</SubToolboxButton>
          </SubToolboxActions>
        </SubToolbox>

        <SubToolbox
          title="06 PACKAGE HISTORY"
          icon={<RefreshCcw size={22} />}
          paletteIndex={paletteIndex + 6}
          collapsible
          isOpenInitial={false}
        >
          {history.length ? (
            <SubToolboxStack density="dense">
              {history.slice(0, 5).map(item => (
                <SubToolboxOutputCard key={item.id} title={`PACKAGE v${item.version}`} badge={item.score}>
                  <div className="flex flex-wrap items-center gap-2 text-xs font-bold">
                    <span>{item.title || "Untitled"}</span>
                    <span className="opacity-40">·</span>
                    <span>{new Date(item.generatedAt).toLocaleString()}</span>
                  </div>
                </SubToolboxOutputCard>
              ))}
            </SubToolboxStack>
          ) : (
            <SubToolboxStatePanel state="empty" message="Saved publication packages will appear here." />
          )}
        </SubToolbox>

        <div className="flex flex-wrap items-center gap-2 px-1 text-[10px] font-black uppercase tracking-[.12em] opacity-40">
          <span>{lastAction}</span>
          <span>·</span>
          <span>Package authority</span>
          <span>·</span>
          <span>ActionPacket handoff</span>
        </div>
      </div>
    </ToolboxScaffold>
  )
}

export default MetadataMaster
