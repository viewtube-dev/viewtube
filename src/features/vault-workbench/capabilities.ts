export type VaultMediaKind = "image" | "video" | "audio" | "document"
export type VaultWorkbenchMode = "browse" | "inspect" | "compare" | "edit" | "process" | "organize" | "workflow"
export type VaultMediaCapabilityId = "inspect" | "organize" | "compare" | "image-edit" | "video-process" | "audio-process" | "metadata-edit" | "lineage" | "archive" | "delete" | "send-to"

export interface VaultMediaCapability {
  id: VaultMediaCapabilityId
  label: string
  mode: VaultWorkbenchMode
  available: boolean
  reason?: string
}

/** UI eligibility only; never a substitute for server-side authorization. */
export interface VaultWorkbenchEligibility {
  inspect?: boolean
  organize?: boolean
  compare?: boolean
  metadataEdit?: boolean
  archive?: boolean
  delete?: boolean
  sendTo?: boolean
}

export interface VaultMediaCapabilityInput {
  kinds: VaultMediaKind[]
  videoProcessorAvailable?: boolean
  audioProcessorAvailable?: boolean
  eligibility?: VaultWorkbenchEligibility
}

const eligible = (input: VaultMediaCapabilityInput, key: keyof VaultWorkbenchEligibility): boolean =>
  input.eligibility?.[key] ?? true

export const resolveVaultMediaCapabilities = (input: VaultMediaCapabilityInput): VaultMediaCapability[] => {
  const kinds = input.kinds.filter(Boolean)
  if (!kinds.length) return []
  const uniqueKinds = [...new Set(kinds)]
  const singleSelection = kinds.length === 1
  const multipleSelection = kinds.length >= 2
  const allImages = uniqueKinds.length === 1 && uniqueKinds[0] === "image"
  const allVideos = uniqueKinds.length === 1 && uniqueKinds[0] === "video"
  const allAudio = uniqueKinds.length === 1 && uniqueKinds[0] === "audio"
  const capabilities: VaultMediaCapability[] = [
    { id: "inspect", label: "Inspect", mode: "inspect", available: eligible(input, "inspect"), reason: eligible(input, "inspect") ? undefined : "Inspection is unavailable for this selection." },
    { id: "organize", label: "Organize", mode: "organize", available: eligible(input, "organize"), reason: eligible(input, "organize") ? undefined : "Organization is unavailable for this selection." },
    { id: "lineage", label: "Lineage", mode: "inspect", available: singleSelection, reason: singleSelection ? undefined : "Select one asset to inspect its lineage." },
    { id: "send-to", label: "Send To", mode: "workflow", available: eligible(input, "sendTo"), reason: eligible(input, "sendTo") ? undefined : "No compatible handoff is available for this selection." },
    { id: "archive", label: "Archive", mode: "organize", available: eligible(input, "archive"), reason: eligible(input, "archive") ? undefined : "Archive is unavailable for this selection." },
    { id: "delete", label: "Delete", mode: "organize", available: eligible(input, "delete"), reason: eligible(input, "delete") ? undefined : "Deletion is unavailable for this selection." },
  ]
  if (multipleSelection) capabilities.push({
    id: "compare", label: "Compare selection", mode: "compare", available: eligible(input, "compare"),
    reason: eligible(input, "compare") ? undefined : "Comparison is unavailable for this selection.",
  })
  if (singleSelection) capabilities.push({
    id: "metadata-edit", label: "Edit metadata", mode: "edit", available: eligible(input, "metadataEdit"),
    reason: eligible(input, "metadataEdit") ? undefined : "Metadata editing is unavailable for this selection.",
  })
  if (allImages && singleSelection) capabilities.push({ id: "image-edit", label: "Image Workbench", mode: "edit", available: true })
  if (allVideos && singleSelection) capabilities.push(input.videoProcessorAvailable === true
    ? { id: "video-process", label: "Video operations", mode: "process", available: true }
    : { id: "video-process", label: "Video operations", mode: "process", available: false, reason: "A verified durable video processor is not connected to the Vault Workbench yet." })
  if (allAudio && singleSelection) capabilities.push(input.audioProcessorAvailable === true
    ? { id: "audio-process", label: "Audio operations", mode: "process", available: true }
    : { id: "audio-process", label: "Audio operations", mode: "process", available: false, reason: "A verified durable audio processor is not connected to the Vault Workbench yet." })
  return capabilities
}

export const VAULT_WORKBENCH_MODES: Array<{ id: VaultWorkbenchMode; label: string }> = [
  { id: "browse", label: "Browse" }, { id: "inspect", label: "Inspect" }, { id: "compare", label: "Compare" },
  { id: "edit", label: "Edit" }, { id: "process", label: "Process" }, { id: "organize", label: "Organize" },
  { id: "workflow", label: "Workflow" },
]

export const getVaultCapabilitiesForMode = (capabilities: VaultMediaCapability[], mode: VaultWorkbenchMode): VaultMediaCapability[] =>
  mode === "browse"
    ? capabilities.filter((item) => item.mode === "inspect" || item.mode === "organize")
    : capabilities.filter((item) => item.mode === mode)
