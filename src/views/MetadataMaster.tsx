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
  Clock3,
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
  PrimaryButton,
  SubToolboxButton,
  SubToolboxInput,
  SubToolboxOutputCard,
  SubToolboxSelect,
  SubToolboxStatePanel,
  SubToolboxTextArea,
} from "../components/subtoolbox/SubToolboxPrimitives"
import { useBrain } from "../context/useBrain"
import { generateVideoPublisherSeoPackage } from "../services/brain/creatorAssets"
import { resolveWorkspaceContentBuildToolContext } from "../services/asset-engine/ToolContext"
import {
  applyMetadataSetVariant,
  buildMetadataStrategyBrief,
  createMetadataMasterSet,
  getMetadataCandidateStyles,
  metadataStrategyForStyle,
  createEmptyMetadataMasterPackage,
  finalizeMetadataMasterPackage,
  listMetadataMasterPackages,
  packageFromSeoResult,
  packageToHandoffPayload,
  saveMetadataMasterPackage,
  type MetadataMasterGoal,
  type MetadataMasterIntensity,
  type MetadataMasterStyle,
  type MetadataMasterPackage,
  type MetadataMasterSet,
  type MetadataMasterSlot,
} from "../services/metadataMaster"
import { listMetadataHistory, recordMetadataPackageVersion } from "../services/metadataHistory"
import type { ContentBuildEvent } from "../services/asset-engine/contracts"
import { recordMetadataOperationProvenance } from "../services/MetadataOperationProvenance"
import { listPromotedMetadataLearningCandidates } from "../services/MetadataLearningGovernance"
import { resolveHistoricalMetadataContext } from "../services/historicalMetadataIntelligence"
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

const GOALS: Array<{ value: MetadataMasterGoal; label: string; description: string }> = [
  { value: "reach", label: "Reach", description: "Broaden qualified exposure without overstating the video's promise." },
  { value: "search", label: "Search", description: "Match clear viewer queries and search intent." },
  { value: "browse", label: "Browse", description: "Earn recommendation clicks with a compelling, honest angle." },
  { value: "subscribers", label: "Subscribers", description: "Turn the right viewers into subscribers and repeat viewers." },
  { value: "revenue", label: "Revenue", description: "Align audience fit and monetization context while preserving trust." },
  { value: "authority", label: "Authority", description: "Emphasize expertise, evidence, and a credible point of view." },
]

const STYLES: Array<{ value: MetadataMasterStyle; label: string; description: string }> = [
  { value: "search-first", label: "Search First", description: "Clear query intent and topical relevance" },
  { value: "curiosity-led", label: "Curiosity Led", description: "A strong open loop with an honest payoff" },
  { value: "authority-led", label: "Authority Led", description: "Expertise, proof, and specificity" },
  { value: "channel-native", label: "Channel Native", description: "Creator voice and audience expectations" },
  { value: "story-led", label: "Story Led", description: "Transformation, stakes, and payoff" },
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
  const [style, setStyle] = useState<MetadataMasterStyle>("channel-native")
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
  const [lifecycleHistory, setLifecycleHistory] = useState<ContentBuildEvent[]>([])

  useEffect(() => {
    setHistory(listMetadataMasterPackages())
  }, [])

  useEffect(() => {
    const contentBuildId = packageDraft.contentBuildId
    setLifecycleHistory(contentBuildId ? listMetadataHistory(contentBuildId) : [])
  }, [packageDraft.contentBuildId, packageDraft.version, lastAction])

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
      const workspaceContext = resolveWorkspaceContentBuildToolContext(
        brain,
        "metadata-master",
        ["title", "thumbnail", "description", "tags", "category"],
      )
      const historicalContext = workspaceContext ? resolveHistoricalMetadataContext({
        contentBuildId: workspaceContext.contentBuildId,
        videoId: publishedVideoId || workspaceContext.build.youtube?.videoId || "",
        changeAt: Date.now(),
        daysBefore: 90,
        daysAfter: 0,
      }) : null
      const historicalComparisons = (historicalContext?.analyticsCheckpointEvents || [])
        .filter(item => item.result.status === "ready" || item.result.status === "partial")
        .slice(-3)
        .map(item => {
          const changes = Array.isArray(item.result.fieldChanges)
            ? item.result.fieldChanges as Array<Record<string, unknown>>
            : []
          const metrics = Array.isArray(item.result.metrics)
            ? item.result.metrics as Array<Record<string, unknown>>
            : []
          const changeText = changes.slice(0, 3).map(change =>
            `${String(change.field)}: ${String(change.before ?? "—").slice(0, 100)} → ${String(change.after ?? "—").slice(0, 100)}`
          ).join("; ")
          const metricText = metrics.filter(metric =>
            typeof metric.baselineAverage === "number" && typeof metric.followUpAverage === "number"
          ).slice(0, 3).map(metric =>
            `${String(metric.metric)} ${Number(metric.baselineAverage).toFixed(2)} → ${Number(metric.followUpAverage).toFixed(2)}`
          ).join("; ")
          return `Status ${String(item.result.status)} · ${String(item.result.baselineStartDate || "")}–${String(item.result.baselineEndDate || "")} vs ${String(item.result.followUpStartDate || "")}–${String(item.result.followUpEndDate || "")}. Changes: ${changeText || "not available"}. Metrics: ${metricText || "incomplete"}.`
        })
      const promotedLearning = workspaceContext
        ? listPromotedMetadataLearningCandidates(workspaceContext.contentBuildId).slice(-5)
        : []
      const promotedLearningBrief = promotedLearning.map(event => {
        const state = event.resultingState && typeof event.resultingState === "object"
          ? event.resultingState as Record<string, unknown>
          : {}
        return `Creator-approved observed association: ${String(state.field || "metadata")} changes were associated with ${String(state.direction || "a change")} in ${String(state.metric || "performance")} across ${String(state.independentComparisonCount || 0)} distinct metadata versions. This is not causal proof; check current context and confounders before applying.`
      })
      const historicalEvidenceBrief = [
        historicalComparisons.length
          ? `HISTORICAL METADATA EVIDENCE (descriptive association only; not causal proof):\n${historicalComparisons.join("\n")}\nDo not infer causation from these comparisons. Treat missing metrics as unknown, note confounders, and use the evidence as context rather than a rule.`
          : "",
        promotedLearningBrief.length
          ? `CREATOR-APPROVED BRAIN LEARNING (still observational, not causal):\n${promotedLearningBrief.join("\n")}`
          : "",
      ].filter(Boolean).join("\n\n")
      const operationStrategyBrief = [
        buildMetadataStrategyBrief(goal, intensity, style),
        historicalEvidenceBrief,
      ].filter(Boolean).join("\n\n")

      const generationOperationId = "metadata-generation-" + Date.now()
      const suppliedHandle = channelHandle.trim()
      const channelId = workspaceContext?.build.channelId || brain.channelId || (suppliedHandle ? "public-channel:" + suppliedHandle.toLowerCase() : "")
      if (!channelId) throw new Error("Connect a channel or enter its public handle before generating governed metadata.")
      const generatedAsset = await generateVideoPublisherSeoPackage({
        context: { channelId, channelName: suppliedHandle || undefined },
        instruction: "Generate the complete metadata package. Apply this strategy brief while preserving factual grounding:\\n" + operationStrategyBrief,
        inputs: { concept, niche, audience, script, videoLength, channelHandle, resourceLinks, videoFormat: "Longform" },
        projectId: workspaceContext?.build.legacyProjectId || undefined,
        contentBuildId: workspaceContext?.contentBuildId || undefined,
        contextRevision: workspaceContext?.build.revision,
        operationId: generationOperationId,
        workflowId: "workflow:metadata-master:" + generationOperationId,
      })
      const result = generated.output

      const generated = packageFromSeoResult(result, {
        goal,
        intensity,
        style,
        projectId: workspaceContext?.build.legacyProjectId || null,
        contentBuildId: workspaceContext?.contentBuildId || null,
        videoId: publishedVideoId || workspaceContext?.build.youtube?.videoId || null,
      })

      const candidateStyles = getMetadataCandidateStyles(style)
      const candidates = result.titleSets.slice(0, clampSets(setCount)).map((titleSet, index) => {
        const candidateStyle = candidateStyles[index] ?? style
        const candidate = finalizeMetadataMasterPackage({
          ...applyMetadataSetVariant(generated, titleSet, candidateStyle),
          id: crypto.randomUUID(),
          version: index + 1,
          lockedSlots,
          appliedSlots,
          provenance: ["Content context", "ViewTube Brain", "creator-asset-generator", "Metadata Master", `Style: ${candidateStyle}`, `Goal: ${goal}`],
        })
        const strategy = metadataStrategyForStyle(candidateStyle)
        return createMetadataMasterSet(candidate, `PACKAGE ${String.fromCharCode(65 + index)}`, strategy, candidateStyle)
      })

      if (workspaceContext?.contentBuildId) {
        recordMetadataOperationProvenance({
          contentBuildId: workspaceContext.contentBuildId,
          operationId: generationOperationId,
          operation: "generate",
          toolId: "metadata-master",
          projectId: workspaceContext.build.legacyProjectId || null,
          videoId: publishedVideoId || workspaceContext.build.youtube?.videoId || null,
          contentBuildRevision: workspaceContext.build.revision,
          fields: ["title", "thumbnailPrompt", "thumbnailText", "description", "tags", "chapters", "category", "playlistIds", "endScreen"],
          recipeId: "metadata-master.seo-package",
          recipeVersion: "1",
          outputPackageIds: candidates.map(candidate => candidate.package.id),
          evidenceIds: [...workspaceContext.evidenceIds, ...(historicalContext?.evidenceIds || [])],
          provider: "creator-asset-generator",
          model: generatedAsset.record.promptReceipt?.servedModel || null,
          actorType: "brain",
          inputFingerprintSource: {
            concept, niche, audience, script, videoLength, channelHandle, resourceLinks,
            goal, intensity, style, setCount,
          },
        })
      }
      for (const candidateSet of candidates) {
        const candidatePackage = candidateSet.package
        if (!candidatePackage.contentBuildId) continue
        recordMetadataPackageVersion({
          contentBuildId: candidatePackage.contentBuildId,
          projectId: candidatePackage.projectId,
          videoId: candidatePackage.videoId,
          operation: "generated",
          actorType: "brain",
          operationId: generationOperationId,
          package: candidatePackage,
        })
      }

      const primary = candidates[0]?.package ?? generated
      if (primary.contentBuildId && candidates[0]) {
        recordMetadataPackageVersion({
          contentBuildId: primary.contentBuildId,
          projectId: primary.projectId,
          videoId: primary.videoId,
          operation: "selected",
          actorType: "creator",
          operationId: generationOperationId,
          package: primary,
        })
      }
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
    if (set.package.contentBuildId) {
      recordMetadataPackageVersion({
        contentBuildId: set.package.contentBuildId,
        projectId: set.package.projectId,
        videoId: set.package.videoId,
        operation: "selected",
        actorType: "creator",
        operationId: `metadata-select-${set.id}-${Date.now()}`,
        package: set.package,
      })
    }
    setPackageDraft(finalizeMetadataMasterPackage({
      ...set.package,
      lockedSlots,
      appliedSlots,
    }))
    setSelectedSetId(set.id)
    setStyle(set.style)
    setGoal(set.package.goal)
    setIntensity(set.package.intensity)
    setLastAction(`${set.label} selected as the working publication package.`)
  }

  const savePackage = () => {
    const finalized = finalizeMetadataMasterPackage({
      ...packageDraft,
      lockedSlots,
      appliedSlots,
      version: packageDraft.version + 1,
    })
    const previousPackage = listMetadataMasterPackages().find(item => item.id === finalized.id) ?? null
    if (finalized.contentBuildId) {
      recordMetadataPackageVersion({
        contentBuildId: finalized.contentBuildId,
        projectId: finalized.projectId,
        videoId: finalized.videoId,
        operation: finalized.source === "manual" ? "manual" : "refined",
        actorType: "creator",
        operationId: `metadata-save-${finalized.id}-v${finalized.version}`,
        previousPackage,
        package: finalized,
      })
    }
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
      style,
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
          isOpenInitial={false}
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
              <p className="mt-1 text-[11px] font-bold opacity-55">{GOALS.find(option => option.value === goal)?.description}</p>
            </SubToolboxSection>

            <SubToolboxSection label="METADATA STYLE">
               <SubToolboxSelect value={style} onChange={event => setStyle(event.target.value as MetadataMasterStyle)} aria-label="Metadata style">
                 {STYLES.map(option => <option key={option.value} value={option.value}>{option.label.toUpperCase()}</option>)}
               </SubToolboxSelect>
               <p className="mt-1 text-[11px] font-bold opacity-55">{STYLES.find(option => option.value === style)?.description}</p>
             </SubToolboxSection>

             <SubToolboxSection label="OPTIMIZATION INTENSITY">
              <SubToolboxActions columns={3} forceRow>
                {(["light", "balanced", "aggressive"] as MetadataMasterIntensity[]).map(value => (
                  <PrimaryButton key={value} level="l1" selected={intensity === value} onClick={() => setIntensity(value)}>
                    {value}
                  </PrimaryButton>
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
            <SubToolboxActions columns={3} forceRow>
              <PrimaryButton level="l1" selected={setCount === 1} onClick={() => setSetCount(1)}>1 SET</PrimaryButton>
              <PrimaryButton level="l1" selected={setCount === 3} onClick={() => setSetCount(3)}>3 SETS</PrimaryButton>
              <PrimaryButton level="l1" selected={setCount === 5} onClick={() => setSetCount(5)}>5 SETS</PrimaryButton>
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
              <SubToolboxActions columns={3} forceRow className="vt-metadata-master-downstream-actions">
                {SLOTS.map(slot => (
                  <PrimaryButton
                    key={slot.id}
                    level="l1"
                    selected={appliedSlots.includes(slot.id)}
                    onClick={() => toggleApply(slot.id)}
                  >
                    {appliedSlots.includes(slot.id) ? "✓ " : ""}{slot.label}
                  </PrimaryButton>
                ))}
              </SubToolboxActions>
            </SubToolboxSection>
          </SubToolboxStack>
        </SubToolbox>

        <SubToolbox
          title="04 EVALUATE + COMPARE"
          icon={<BarChart3 size={22} />}
          paletteIndex={paletteIndex + 4}
          collapsible
          isOpenInitial={false}
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
                    <p className="text-xs font-black uppercase opacity-50">{set.strategy} · {set.style}</p>
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
          isOpenInitial={false}
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
          title="06 SAVED PACKAGES"
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
            <SubToolboxStatePanel state="empty" message="Saved package drafts appear here; lifecycle events and metadata performance comparisons are shown below." />
          )}
        </SubToolbox>

        <SubToolbox
          title="07 CHANGE + OUTCOME HISTORY"
          icon={<Clock3 size={22} />}
          paletteIndex={paletteIndex + 7}
          collapsible
          isOpenInitial={false}
        >
          {packageDraft.contentBuildId ? (
            lifecycleHistory.length ? (
              <SubToolboxStack density="dense">
                {lifecycleHistory.slice(0, 12).map(event => {
                  const metadata = (event.metadata || {}) as Record<string, unknown>
                  const comparison = event.entityType === "metadata-performance-comparison" &&
                    event.resultingState && typeof event.resultingState === "object"
                    ? event.resultingState as Record<string, unknown>
                    : null
                  const fieldChanges = Array.isArray(comparison?.fieldChanges)
                    ? comparison.fieldChanges as Array<Record<string, unknown>>
                    : []
                  const metrics = Array.isArray(comparison?.metrics)
                    ? comparison.metrics as Array<Record<string, unknown>>
                    : []
                  const metricLine = metrics
                    .filter(metric => typeof metric.absoluteChange === "number")
                    .slice(0, 3)
                    .map(metric => {
                      const delta = metric.absoluteChange as number
                      const percent = typeof metric.percentChange === "number"
                        ? ` (${metric.percentChange > 0 ? "+" : ""}${metric.percentChange.toFixed(1)}%)`
                        : ""
                      return `${String(metric.metric)}: ${delta > 0 ? "+" : ""}${delta.toFixed(2)}${percent}`
                    })
                  const title = comparison
                    ? `PERFORMANCE COMPARISON · ${String(comparison.status || "unknown").toUpperCase()}`
                    : event.entityType === "metadata-version"
                      ? `METADATA ${String(metadata.operation || "CHANGE").toUpperCase()} · ${String(event.entityId || "").slice(0, 28)}`
                      : event.eventType.replaceAll(".", " ").toUpperCase()
                  return (
                    <SubToolboxOutputCard key={event.id} title={title} badge={comparison ? String(comparison.status || "recorded").toUpperCase() : event.actorType.toUpperCase()}>
                      <div className="flex flex-wrap items-center gap-2 text-[11px] font-bold opacity-65">
                        <span>{new Date(event.timestamp).toLocaleString()}</span>
                        <span>·</span>
                        <span>{event.toolId || "system"}</span>
                        {typeof metadata.operationId === "string" ? <><span>·</span><span>OP {metadata.operationId.slice(0, 18)}</span></> : null}
                      </div>
                      {fieldChanges.length ? (
                        <div className="mt-2 flex flex-col gap-1 text-xs font-bold">
                          {fieldChanges.slice(0, 4).map((change, index) => (
                            <div key={`${String(change.field)}-${index}`} className="grid grid-cols-[auto_1fr] gap-2">
                              <span className="uppercase opacity-55">{String(change.field)}</span>
                              <span className="break-words">{String(change.before ?? "—")} <span className="opacity-40">→</span> {String(change.after ?? "—")}</span>
                            </div>
                          ))}
                        </div>
                      ) : null}
                      {comparison ? (
                        <div className="mt-2 flex flex-col gap-1 text-xs font-bold">
                          <p>Baseline: {String(comparison.baselineStartDate)}–{String(comparison.baselineEndDate)} · Follow-up: {String(comparison.followUpStartDate)}–{String(comparison.followUpEndDate)}</p>
                          {metricLine.length ? <p>{metricLine.join(" · ")}</p> : <p>Metrics are incomplete; missing observations remain unknown, not zero.</p>}
                          <p className="opacity-60">Evidence: {event.evidenceIds.length} reference(s). Temporal association only; this comparison does not establish causation.</p>
                        </div>
                      ) : event.entityType === "metadata-operation" ? (
                        <p className="mt-2 text-xs font-bold opacity-65">Prompt recipe: {String(metadata.recipeId || "unknown")} v{String(metadata.recipeVersion || "unknown")} · Fields: {Array.isArray(metadata.fields) ? metadata.fields.join(", ") : "not recorded"}</p>
                      ) : event.evidenceIds.length ? (
                        <p className="mt-2 text-xs font-bold opacity-60">Evidence references: {event.evidenceIds.length}</p>
                      ) : null}
                    </SubToolboxOutputCard>
                  )
                })}
              </SubToolboxStack>
            ) : (
              <SubToolboxStatePanel level="l1" state="empty" message="No ContentBuild metadata changes or performance comparisons have been recorded for this project yet." />
            )
          ) : (
            <SubToolboxStatePanel level="l1" state="empty" message="Load or generate a package from an active Project to connect this history view to its canonical ContentBuild." />
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
