export type VaultMediaKind = "image" | "video" | "audio" | "document"

export type VaultMediaCapabilityId =
  | "inspect"
  | "organize"
  | "compare"
  | "image-edit"
  | "video-process"
  | "audio-process"

export interface VaultMediaCapability {
  id: VaultMediaCapabilityId
  label: string
  available: boolean
  reason?: string
}

export interface VaultMediaCapabilityInput {
  kinds: VaultMediaKind[]
  videoProcessorAvailable?: boolean
  audioProcessorAvailable?: boolean
}

export const resolveVaultMediaCapabilities = (
  input: VaultMediaCapabilityInput,
): VaultMediaCapability[] => {
  const kinds = input.kinds.filter(Boolean)
  if (!kinds.length) return []

  const uniqueKinds = [...new Set(kinds)]
  const singleSelection = kinds.length === 1
  const allImages = uniqueKinds.length === 1 && uniqueKinds[0] === "image"
  const allVideos = uniqueKinds.length === 1 && uniqueKinds[0] === "video"
  const allAudio = uniqueKinds.length === 1 && uniqueKinds[0] === "audio"
  const capabilities: VaultMediaCapability[] = [
    { id: "inspect", label: "Inspect", available: true },
    { id: "organize", label: "Organize", available: true },
  ]

  if (kinds.length >= 2) capabilities.push({ id: "compare", label: "Compare selection", available: true })

  if (allImages && singleSelection) {
    capabilities.push({ id: "image-edit", label: "Image Workbench", available: true })
  }

  if (allVideos && singleSelection) {
    capabilities.push({
      id: "video-process",
      label: "Video operations",
      available: input.videoProcessorAvailable === true,
      reason: input.videoProcessorAvailable === true
        ? undefined
        : "A verified durable video processor is not connected to the Vault Workbench yet.",
    })
  }

  if (allAudio && singleSelection) {
    capabilities.push({
      id: "audio-process",
      label: "Audio operations",
      available: input.audioProcessorAvailable === true,
      reason: input.audioProcessorAvailable === true
        ? undefined
        : "A verified durable audio processor is not connected to the Vault Workbench yet.",
    })
  }

  return capabilities
}
