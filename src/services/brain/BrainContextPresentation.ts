export interface BrainContextDisplayItem {
 id: "channel" | "project" | "content-build" | "selection"
 label: string
 value: string
 provenance: string
}

export interface BrainContextDisplayInput {
 channelId: string | null
 project: {
  projectId: string
  contentBuildId: string | null
  title: string | null
  source: string | null
 } | null
 selection: {
  sourceId: string
  label: string
 } | null
}

/**
 * Convert the exact context snapshot into creator-facing labels.
 *
 * These labels describe scope and source provenance only. They must not imply
 * that a fact is confirmed, inferred, or temporary unless the canonical owner
 * supplies that epistemic state explicitly.
 */
export const buildBrainContextDisplayItems = (
 input: BrainContextDisplayInput,
): BrainContextDisplayItem[] => {
 const projectProvenance = input.project
  ? input.project.source === "canonical_project_content_build"
   ? "Canonical project + ContentBuild"
   : input.project.source === "canonical_project"
    ? "Canonical project"
    : input.project.source === "visible_context"
     ? "Visible UI context"
     : "Project source unavailable"
  : "Not supplied"

 return [
  {
   id: "channel",
   label: "Channel",
   value: input.channelId || "No channel ID",
   provenance: input.channelId ? "Active scope" : "No channel scope",
  },
  {
   id: "project",
   label: "Project",
   value: input.project
    ? `${input.project.title || input.project.projectId} · ${input.project.projectId}`
    : "No project in this answer's context",
   provenance: projectProvenance,
  },
  {
   id: "content-build",
   label: "ContentBuild",
   value: input.project?.contentBuildId || "No linked ContentBuild",
   provenance: input.project?.contentBuildId ? "Linked ID" : "Not supplied",
  },
  {
   id: "selection",
   label: "Selected video / asset",
   value: input.selection
    ? `${input.selection.label} · ${input.selection.sourceId}`
    : "No selected video or asset was supplied",
   provenance: input.selection ? "Surface selection" : "Not supplied",
  },
 ]
}
