import type { ContentBuildSnapshot } from "../asset-engine/contracts"
import type { ContentBuildPublishTransaction } from "../asset-engine/PublishTransaction"
import { listAlgorithmIntelligenceEvents, recordAlgorithmIntelligenceEvent } from "./AlgorithmIntelligenceEventLedger"

export interface BrainPublicationIdentityReceipt {
 schemaVersion: "brain-publication-identity-receipt-v1"
 id: string
 channelId: string
 contentBuildId: string
 contentBuildRevision: number
 videoPackageId: string
 publishTransactionId: string
 idempotencyKey: string
 approvedSnapshotId: string
 approvedSnapshotHash: string
 youtubeVideoId: string
 titleAssetId: string
 thumbnailAssetId: string
 finalRenderAssetId: string
 descriptionAssetId: string
 tagsAssetId: string | null
 scheduledAt: string | null
 publicationStatus: "published"
 publishedAt: string
 projectId: string | null
 projectAssociationStatus: "snapshot-only" | "not-provided"
}

export const recordBrainPublicationIdentityReceipt = (input: {
 transaction: ContentBuildPublishTransaction
 build: ContentBuildSnapshot
 publishedAt?: string
}) => {
 const { transaction, build } = input
 if (transaction.status !== "completed") throw new Error("Only a completed publish transaction can create a publication identity receipt.")
 if (!transaction.youtubeVideoId) throw new Error("Publication identity requires the exact YouTube video ID.")
 if (!build.channelId?.trim()) throw new Error("Publication identity requires the canonical ContentBuild channel scope.")
 if (build.youtube?.videoId !== transaction.youtubeVideoId) throw new Error("ContentBuild YouTube binding does not match the publish transaction.")
 if (build.youtube?.status !== "published") throw new Error("Publication identity requires verified published status.")
 if (!transaction.approvedSnapshotId || !transaction.approvedSnapshotHash) throw new Error("Publication identity requires approved snapshot lineage.")
 const id = `publication-confirmed:${transaction.id}`
 const existing = listAlgorithmIntelligenceEvents({ channelId: build.channelId }).find((event) => event.id === id)
 if (existing) {
  const receipt = existing.metadata?.publicationIdentityReceipt as BrainPublicationIdentityReceipt | undefined
  if (!receipt || receipt.youtubeVideoId !== transaction.youtubeVideoId || receipt.approvedSnapshotHash !== transaction.approvedSnapshotHash) {
   throw new Error("Publication idempotency identity conflicts with the existing receipt.")
  }
  return { receipt, event: existing, idempotentReplay: true }
 }
 const receipt: BrainPublicationIdentityReceipt = {
  schemaVersion: "brain-publication-identity-receipt-v1",
  id,
  channelId: build.channelId,
  contentBuildId: transaction.contentBuildId,
  contentBuildRevision: transaction.assetLock.projectionRevision,
  videoPackageId: transaction.videoPackageId,
  publishTransactionId: transaction.id,
  idempotencyKey: transaction.idempotencyKey,
  approvedSnapshotId: transaction.approvedSnapshotId,
  approvedSnapshotHash: transaction.approvedSnapshotHash,
  youtubeVideoId: transaction.youtubeVideoId,
  titleAssetId: transaction.assetLock.titleAssetId,
  thumbnailAssetId: transaction.assetLock.thumbnailAssetId,
  finalRenderAssetId: transaction.assetLock.finalRenderAssetId,
  descriptionAssetId: transaction.assetLock.descriptionAssetId,
  tagsAssetId: transaction.assetLock.tagsAssetId,
  scheduledAt: transaction.assetLock.scheduledAt,
  publicationStatus: "published",
  publishedAt: input.publishedAt || build.youtube.publishedAt || transaction.completedAt || transaction.updatedAt,
  projectId: build.legacyProjectId || null,
  projectAssociationStatus: build.legacyProjectId ? "snapshot-only" : "not-provided",
 }
 const event = recordAlgorithmIntelligenceEvent({
  id,
  channelId: build.channelId,
  projectId: build.legacyProjectId || null,
  videoId: transaction.youtubeVideoId,
  kind: "PUBLICATION_CONFIRMED",
  sourceSystem: "workflow",
  sourceId: transaction.id,
  parentEventIds: [],
  evidenceIds: [
   transaction.approvedSnapshotId,
   transaction.approvedSnapshotHash,
   transaction.contentBuildId,
   transaction.videoPackageId,
   transaction.assetLock.finalRenderAssetId,
   transaction.assetLock.titleAssetId,
   transaction.assetLock.thumbnailAssetId,
   transaction.assetLock.descriptionAssetId,
   ...(transaction.assetLock.tagsAssetId ? [transaction.assetLock.tagsAssetId] : []),
  ],
  confidence: "high",
  title: "Publication identity confirmed",
  summary: `Published video ${transaction.youtubeVideoId} bound to approved snapshot ${transaction.approvedSnapshotId}.`,
  evaluationTargets: [],
  metadata: {
   publicationIdentityReceipt: receipt,
   performanceEvaluated: false,
   causalAttribution: "not-assessed",
   projectAssociationStatus: receipt.projectAssociationStatus,
  },
 })
 return { receipt, event, idempotentReplay: false }
}

export const getBrainPublicationIdentityReceipt = (input: { channelId: string; youtubeVideoId: string }) => {
 const event = listAlgorithmIntelligenceEvents({ channelId: input.channelId })
  .find((candidate) => candidate.kind === "PUBLICATION_CONFIRMED" && candidate.videoId === input.youtubeVideoId)
 const receipt = event?.metadata?.publicationIdentityReceipt as BrainPublicationIdentityReceipt | undefined
 return receipt || null
}
