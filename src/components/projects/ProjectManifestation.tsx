import React, { useEffect, useMemo, useRef, useState } from "react"
import { ArrowLeftRight, Boxes, Check, FolderOpen, Layers3, RefreshCw, Save, Sparkles } from "lucide-react"
import type { Project } from "../../types"
import { listVideoPackages } from "../../services/video-package/VideoPackageRepository"
import { setContentBuildSelection } from "../../services/asset-engine/ContentBuildRepository"
import { buildProjectManifest, getManifestPackageForProject, resolveSelectedProjectId, type ProjectManifestation } from "./projectManifestation"
import { SubToolbox } from "../Toolbox"
import { SubToolboxActions, SubToolboxGrid, SubToolboxSection, SubToolboxStack } from "../subtoolbox/SubToolboxLayouts"
import { SplitLeftButton } from "../subtoolbox/SubToolboxSplitPrimitives"
import {
  LegendMultiDropdown,
  SubToolboxButton,
  SubToolboxMediaPoster,
  SubToolboxStatusBadge,
  SubToolboxTag,
  SubToolboxOutputCard,
} from "../subtoolbox/SubToolboxPrimitives"
import "../../styles/project-manifestation.css"

export interface ProjectManifestationProps {
  projects: Project[]
  activeProjectId?: string | null
  onLoadProject: (project: Project) => void
  onSaveProject?: (project: Project) => void
  title?: string
  subtitle?: string
  paletteIndex?: number
  collapsible?: boolean
  isOpenInitial?: boolean
}

const ProjectManifestation: React.FC<ProjectManifestationProps> = ({
  projects,
  activeProjectId,
  onLoadProject,
  onSaveProject,
  title = "PROJECTS / PACKAGES",
  subtitle = "Load, edit and swap complete Project + Publishing Package state",
  paletteIndex = 0,
  collapsible = true,
  isOpenInitial = true,
}) => {
  const [packages, setPackages] = useState(() => listVideoPackages())
  const [selectedProjectId, setSelectedProjectId] = useState(() => resolveSelectedProjectId(activeProjectId, projects, ""))
  const lastAppliedActiveProjectId = useRef<string | null | undefined>(undefined)
  const [swapState, setSwapState] = useState<"idle" | "saving" | "saved">("idle")

  useEffect(() => {
    const activeProjectExists = Boolean(
      activeProjectId && projects.some(project => project.id === activeProjectId),
    )
    const shouldAdoptActiveProject = Boolean(
      activeProjectExists && lastAppliedActiveProjectId.current !== activeProjectId,
    )

    if (activeProjectExists) lastAppliedActiveProjectId.current = activeProjectId
    else if (!activeProjectId) lastAppliedActiveProjectId.current = activeProjectId

    setSelectedProjectId(current =>
      shouldAdoptActiveProject && activeProjectId
        ? activeProjectId
        : resolveSelectedProjectId(null, projects, current),
    )
  }, [activeProjectId, projects])

  const selectedProject = useMemo(
    () => projects.find(project => project.id === selectedProjectId) || null,
    [projects, selectedProjectId],
  )
  const selectedPackage = useMemo(
    () => selectedProject
      ? getManifestPackageForProject(packages, selectedProject.id, selectedProject.contentBuildId)
      : null,
    [packages, selectedProject],
  )
  const manifest: ProjectManifestation | null = selectedProject
    ? buildProjectManifest(selectedProject, selectedPackage)
    : null

  const refreshPackages = () => setPackages(listVideoPackages())

  const loadSelected = () => {
    if (!selectedProject) return
    onLoadProject(selectedProject)
    setSwapState("saved")
  }

  const saveSelected = () => {
    if (!selectedProject || !onSaveProject) return
    setSwapState("saving")
    onSaveProject(selectedProject)
    setSwapState("saved")
  }

  const swapAsset = (slot: string, assetId: string | null) => {
    if (!manifest?.contentBuildId || !assetId) return
    try {
      setContentBuildSelection(manifest.contentBuildId, slot, assetId, {
        toolId: "project-manifestation",
        actorType: "creator",
        final: false,
      })
      refreshPackages()
      setSwapState("saved")
    } catch (error) {
      console.error("Unable to swap Project Manifestation asset", error)
      setSwapState("idle")
    }
  }

  return (
    <SubToolbox
      title={title}
      subtitle={subtitle}
      icon={<Layers3 size={20} strokeWidth={3} />}
      paletteIndex={paletteIndex}
      collapsible={collapsible}
      isOpenInitial={isOpenInitial}
      openUnits={6}
    >
      <SubToolboxStack density="comfortable">
        <SubToolboxGrid minItemWidth="wide" density="dense">
          <SubToolboxSection label="PROJECT LOAD / SWAP">
            <div className="vt-project-manifestation-load">
              <LegendMultiDropdown
                level="l1"
                label="SELECT PROJECT"
                value={selectedProject?.name || "NO PROJECT SELECTED"}
                options={projects.length
                  ? projects.map(project => ({ value: project.id, label: project.name }))
                  : [{ value: "", label: "NO PROJECTS AVAILABLE", disabled: true }]}
                onValueChange={value => {
                  setSelectedProjectId(value)
                  setSwapState("idle")
                }}
                ariaLabel="Choose project to load or swap"
                className="vt-project-manifestation-project-dropdown"
              />
              <SubToolboxActions columns={3} forceRow className="vt-project-manifestation-actions">
                <SplitLeftButton level="l1" icon={<FolderOpen size={22} />} onClick={loadSelected} disabled={!selectedProject}>
                  LOAD
                </SplitLeftButton>
                <SplitLeftButton level="l1" tone="accent" icon={<ArrowLeftRight size={22} />} onClick={loadSelected} disabled={!selectedProject}>
                  SWAP IN
                </SplitLeftButton>
                <SplitLeftButton level="l1" tone="neutral" icon={<RefreshCw size={22} />} onClick={refreshPackages}>
                  REFRESH
                </SplitLeftButton>
              </SubToolboxActions>
            </div>
          </SubToolboxSection>
        </SubToolboxGrid>

        {manifest ? (
          <>
            <div className="vt-project-manifestation-hero">
              <SubToolboxMediaPoster
                level="l1"
                ratio="16:9"
                src={manifest.thumbnailUrl || undefined}
                alt={manifest.title}
              />
              <div className="vt-project-manifestation-identity">
                <div className="vt-project-manifestation-title-row">
                  <strong>{manifest.title}</strong>
                  <SubToolboxStatusBadge level="l1">{manifest.status}</SubToolboxStatusBadge>
                </div>
                <div className="vt-project-manifestation-meta">
                  <span>{manifest.projectName}</span>
                  {manifest.format ? <span>{manifest.format.toUpperCase()}</span> : null}
                  {manifest.contentBuildId ? <span>BUILD {manifest.contentBuildId.slice(0, 8)}</span> : null}
                  {manifest.videoPackageId ? <span>PACKAGE {manifest.videoPackageId.slice(0, 8)}</span> : null}
                </div>
                <div className="vt-project-manifestation-tags">
                  {manifest.tags.slice(0, 8).map(tag => <SubToolboxTag key={tag} level="l2">{tag}</SubToolboxTag>)}
                  {!manifest.tags.length ? <span className="vt-project-manifestation-muted">No tags saved</span> : null}
                </div>
                {manifest.description ? <p>{manifest.description}</p> : <span className="vt-project-manifestation-muted">No description saved</span>}
              </div>
            </div>

            <SubToolboxSection label="SAVED CONTENT / READY TO SWAP">
              <SubToolboxGrid minItemWidth="compact" density="dense">
                {manifest.slots.map(slot => (
                  <SubToolboxOutputCard
                    key={slot.slot}
                    title={slot.label}
                    icon={<Boxes size={16} />}
                    action={
                      slot.assetId
                        ? <SubToolboxButton size="compact" level="l2" onClick={() => swapAsset(slot.slot, slot.assetId)} icon={swapState === "saved" ? <Check size={14} /> : <ArrowLeftRight size={14} />}>SWAP</SubToolboxButton>
                        : undefined
                    }
                  >
                    <div className="vt-project-manifestation-slot">
                      <strong>{slot.artifact?.label || (slot.assetId ? slot.assetId.slice(0, 14) : "EMPTY")}</strong>
                      <span>{slot.availableCount} saved {slot.availableCount === 1 ? "version" : "versions"}</span>
                    </div>
                  </SubToolboxOutputCard>
                ))}
              </SubToolboxGrid>
            </SubToolboxSection>

            <SubToolboxActions columns={2}>
              <SubToolboxButton tone="accent" icon={<Sparkles size={16} />} onClick={loadSelected}>
                LOAD INTO TOOL
              </SubToolboxButton>
              {onSaveProject ? (
                <SubToolboxButton tone="success" icon={<Save size={16} />} onClick={saveSelected}>
                  {swapState === "saving" ? "SAVING…" : "SAVE PROJECT STATE"}
                </SubToolboxButton>
              ) : null}
            </SubToolboxActions>
          </>
        ) : (
          <SubToolboxOutputCard title="NO PROJECT" icon={<FolderOpen size={18} />}>
            Select or create a Project to expose its saved ContentBuild and Publishing Package.
          </SubToolboxOutputCard>
        )}
      </SubToolboxStack>
    </SubToolbox>
  )
}

export default ProjectManifestation
