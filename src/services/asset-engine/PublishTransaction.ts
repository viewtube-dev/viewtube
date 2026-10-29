import { appendContentBuildEvent, bindYouTubeVideo, getContentBuild, listContentBuildMetadataHistory, setContentBuildStage } from "./ContentBuildRepository"
import type { ContentBuildYouTubeBinding } from "./contracts"
import { assertContentBuildCapability } from "./ContentBuildCapabilities"
import type { PublishingPackageProjection } from "./PublishingPackageProjection"
import { getApprovedPublishSnapshot, persistApprovedPublishSnapshot, verifyApprovedPublishSnapshot } from "./ApprovedPublishSnapshot"
import { recordBrainPublicationIdentityReceipt } from "../brain/BrainPublicationOutcomeBridge"

export type PublishTransactionStep =
 | "validate-package" | "creator-approval" | "upload-video" | "bind-youtube"
 | "apply-metadata" | "apply-thumbnail" | "apply-captions" | "apply-routing"
 | "apply-schedule-privacy" | "verify-remote-state"
export type PublishTransactionStatus = "awaiting-approval" | "approved" | "running" | "failed" | "completed"
type StepState = { status: "pending" | "running" | "completed" | "failed"; completedAt?: string | null; receipt?: Record<string, unknown>; error?: string | null }

export interface PublishAssetLock {
 projectionRevision: number
 titleAssetId: string
 thumbnailAssetId: string
 finalRenderAssetId: string
 descriptionAssetId: string
 tagsAssetId: string | null
 scheduledAt: string | null
 lockedAt: string
}
export interface ContentBuildPublishTransaction {
 id: string; contentBuildId: string; videoPackageId: string; idempotencyKey: string
 approvedSnapshotId: string; approvedSnapshotHash: string
 // Immutable cross-system identity captured when the publication transaction starts.
 workflowId?: string | null; operationId?: string | null; actionPacketId?: string | null
 recommendationId?: string | null; experimentId?: string | null
 status: PublishTransactionStatus; steps: Partial<Record<PublishTransactionStep, StepState>>
 assetLock: PublishAssetLock; youtubeVideoId?: string | null
 startedAt: string; updatedAt: string; completedAt?: string | null
}

const KEY="viewtube_content_build_publish_transactions_v2"
let memory: ContentBuildPublishTransaction[]=[]
const now=()=>new Date().toISOString()
const uuid=()=>globalThis.crypto?.randomUUID?.()||`publish-${Date.now()}-${Math.random().toString(36).slice(2)}`
const canStore=()=>{try{return typeof localStorage!=="undefined"}catch{return false}}
const read=():ContentBuildPublishTransaction[]=>{
 if(!canStore())return memory
 let raw:string|null
 try{raw=localStorage.getItem(KEY)}catch{throw new Error("Publish transaction storage could not be read.")}
 if(raw===null)return []
 let parsed:unknown
 try{parsed=JSON.parse(raw)}catch{throw new Error("Publish transaction storage is unreadable; refusing to overwrite it.")}
 if(!Array.isArray(parsed)||!parsed.every((item)=>Boolean(item)&&typeof item==="object"&&typeof (item as ContentBuildPublishTransaction).id==="string"&&typeof (item as ContentBuildPublishTransaction).contentBuildId==="string"))throw new Error("Publish transaction storage is malformed; refusing to overwrite it.")
 return parsed as ContentBuildPublishTransaction[]
}
const write=(v:ContentBuildPublishTransaction[])=>{
 if(!canStore()){memory=v;return}
 try{localStorage.setItem(KEY,JSON.stringify(v))}catch{throw new Error("Could not persist publish transaction to browser storage; publishing must not continue without a recorded transaction.")}
}
const save=(t:ContentBuildPublishTransaction)=>{const all=read(),i=all.findIndex(x=>x.id===t.id);if(i>=0)all[i]=t;else all.push(t);write(all);return t}
const assertTransactionSnapshotIntegrity = (transaction: ContentBuildPublishTransaction) => {
 const snapshot = getApprovedPublishSnapshot(transaction.approvedSnapshotId)
 if (!snapshot || !verifyApprovedPublishSnapshot(snapshot)) {
  throw new Error("Publish transaction approved snapshot is missing or failed integrity verification.")
 }
 const assetsMatch =
  transaction.contentBuildId === snapshot.contentBuildId &&
  transaction.videoPackageId === snapshot.videoPackageId &&
  transaction.approvedSnapshotHash === snapshot.hash &&
  transaction.assetLock.projectionRevision === snapshot.contentBuildRevision &&
  transaction.assetLock.titleAssetId === snapshot.assets.titleAssetId &&
  transaction.assetLock.thumbnailAssetId === snapshot.assets.thumbnailAssetId &&
  transaction.assetLock.finalRenderAssetId === snapshot.assets.finalRenderAssetId &&
  transaction.assetLock.descriptionAssetId === snapshot.assets.descriptionAssetId &&
  transaction.assetLock.tagsAssetId === snapshot.assets.tagsAssetId &&
  transaction.assetLock.scheduledAt === snapshot.scheduledAt
 if (!assetsMatch) {
  throw new Error("Publish transaction binding does not match its approved snapshot and locked assets.")
 }
 return transaction
}

export const listPublishTransactions=(contentBuildId:string)=>read().filter(x=>x.contentBuildId===contentBuildId).map(assertTransactionSnapshotIntegrity).sort((a,b)=>b.updatedAt.localeCompare(a.updatedAt))
export const getPublishTransaction=(id:string)=>{
 const transaction=read().find(x=>x.id===id)||null
 return transaction ? assertTransactionSnapshotIntegrity(transaction) : null
}

export const markPublishStepRunning=(input:{transactionId:string;step:PublishTransactionStep})=>{const transaction=getPublishTransaction(input.transactionId);if(!transaction)throw new Error("Unknown publish transaction: "+input.transactionId);const current=transaction.steps[input.step];if(current?.status==="completed"||current?.status==="running")return transaction;const timestamp=now();return save({...transaction,status:"running",steps:{...transaction.steps,[input.step]:{status:"running",startedAt:timestamp}},updatedAt:timestamp})};

export const beginPublishTransaction=(projection:PublishingPackageProjection,toolId="video-publisher",identity:{workflowId?:string|null;operationId?:string|null;actionPacketId?:string|null;recommendationId?:string|null;experimentId?:string|null}={})=>{
 if(!canStore()) throw new Error("Publish transaction requires persistent browser storage; in-memory fallback is not safe for publishing.")
 if(!projection.ready) throw new Error("Publishing Package is not ready: "+projection.missing.join(", "))
 if(!projection.titleAssetId||!projection.thumbnailAssetId||!projection.finalRenderAssetId||!projection.descriptionAssetId) throw new Error("Publishing Package lacks required canonical assets.")
 // Preserve the strongest duplicate-upload guard first: if this exact final
 // render already has a transaction, later metadata/package edits must resume it
 // rather than silently creating another remote upload.
 const existingForRender=read().find(x=>x.contentBuildId===projection.contentBuildId&&x.assetLock.finalRenderAssetId===projection.finalRenderAssetId)
 if(existingForRender) {
  for (const key of ["workflowId","operationId","actionPacketId","recommendationId","experimentId"] as const) {
   const requested=identity[key]
   if (requested && existingForRender[key] !== requested) throw new Error(`Existing publication transaction has immutable ${key} lineage that does not match this request.`)
  }
  return assertTransactionSnapshotIntegrity(existingForRender)
 }

 const canonicalBuild = getContentBuild(projection.contentBuildId)
 if (!canonicalBuild) throw new Error("Publishing requires an existing canonical ContentBuild.")
 assertContentBuildCapability(canonicalBuild, "publish")
 const blockers = canonicalBuild.workflow?.blockerIds || []
 if (blockers.length) {
  throw new Error(`ContentBuild has blockers preventing publication: ${blockers.join(", ")}`)
 }

 const approvedSnapshot=persistApprovedPublishSnapshot(projection)
 const key=`publish:${approvedSnapshot.contentBuildId}:${approvedSnapshot.id}`
 const existing=read().find(x=>x.contentBuildId===approvedSnapshot.contentBuildId&&x.approvedSnapshotId===approvedSnapshot.id)
 if(existing) return assertTransactionSnapshotIntegrity(existing)
 const timestamp=now()
 const transaction:ContentBuildPublishTransaction={
  id:uuid(),contentBuildId:approvedSnapshot.contentBuildId,videoPackageId:approvedSnapshot.videoPackageId,idempotencyKey:key,
  approvedSnapshotId:approvedSnapshot.id,approvedSnapshotHash:approvedSnapshot.hash,
  workflowId:identity.workflowId||null,operationId:identity.operationId||null,actionPacketId:identity.actionPacketId||null,
  recommendationId:identity.recommendationId||null,experimentId:identity.experimentId||null,
  status:"approved",steps:{"validate-package":{status:"completed",completedAt:timestamp},"creator-approval":{status:"completed",completedAt:timestamp}},
  assetLock:{projectionRevision:approvedSnapshot.contentBuildRevision,titleAssetId:approvedSnapshot.assets.titleAssetId,thumbnailAssetId:approvedSnapshot.assets.thumbnailAssetId,finalRenderAssetId:approvedSnapshot.assets.finalRenderAssetId,descriptionAssetId:approvedSnapshot.assets.descriptionAssetId,tagsAssetId:approvedSnapshot.assets.tagsAssetId,scheduledAt:approvedSnapshot.scheduledAt,lockedAt:timestamp},
  youtubeVideoId:projection.publishedVideoId||null,startedAt:timestamp,updatedAt:timestamp,
 }
 save(transaction)
 appendContentBuildEvent({contentBuildId:transaction.contentBuildId,eventType:"publish.transaction.started",entityType:"publish-transaction",entityId:transaction.id,actorType:"tool",toolId,inputAssetIds:[transaction.assetLock.finalRenderAssetId,transaction.assetLock.titleAssetId,transaction.assetLock.thumbnailAssetId,transaction.assetLock.descriptionAssetId],metadata:{idempotencyKey:key,approvedSnapshotId:transaction.approvedSnapshotId,approvedSnapshotHash:transaction.approvedSnapshotHash,workflowId:transaction.workflowId||null,operationId:transaction.operationId||null,actionPacketId:transaction.actionPacketId||null,recommendationId:transaction.recommendationId||null,experimentId:transaction.experimentId||null,assetLock:transaction.assetLock}})
 return transaction
}

export const completePublishStep=(input:{transactionId:string;step:PublishTransactionStep;receipt?:Record<string,unknown>;youtubeVideoId?:string|null;youtubeBinding?:Partial<Omit<ContentBuildYouTubeBinding,"videoId"|"canonicalUrl"|"status">>&{status?:ContentBuildYouTubeBinding["status"]};toolId?:string})=>{
 const transaction=getPublishTransaction(input.transactionId);if(!transaction)throw new Error("Unknown publish transaction: "+input.transactionId)
 if(transaction.steps[input.step]?.status==="completed") return transaction
 const timestamp=now(),videoId=input.youtubeVideoId||transaction.youtubeVideoId||null
 const next=save({...transaction,status:"running",youtubeVideoId:videoId,steps:{...transaction.steps,[input.step]:{status:"completed",completedAt:timestamp,receipt:input.receipt}},updatedAt:timestamp})
 // Persist remote identity immediately on the upload step, not a later bind step.
 if(videoId){
  const build=getContentBuild(next.contentBuildId)
  bindYouTubeVideo({contentBuildId:next.contentBuildId,videoId,channelId:build?.channelId||null,status:input.youtubeBinding?.status||build?.youtube?.status||"uploaded",uploadStartedAt:input.youtubeBinding?.uploadStartedAt||build?.youtube?.uploadStartedAt||null,uploadCompletedAt:input.youtubeBinding?.uploadCompletedAt||build?.youtube?.uploadCompletedAt||null,scheduledAt:input.youtubeBinding?.scheduledAt||next.assetLock.scheduledAt||build?.youtube?.scheduledAt||null,premiereAt:input.youtubeBinding?.premiereAt||build?.youtube?.premiereAt||null,publishedAt:input.youtubeBinding?.publishedAt||build?.youtube?.publishedAt||null,initialTitleAssetId:next.assetLock.titleAssetId,initialThumbnailAssetId:next.assetLock.thumbnailAssetId,finalRenderAssetId:next.assetLock.finalRenderAssetId,lastVerifiedAt:input.youtubeBinding?.lastVerifiedAt||build?.youtube?.lastVerifiedAt||null,toolId:input.toolId||"video-publisher"})
 }
 appendContentBuildEvent({contentBuildId:next.contentBuildId,eventType:"publish.transaction.step.completed",entityType:"publish-transaction",entityId:next.id,actorType:input.step==="bind-youtube"?"youtube":"tool",toolId:input.toolId||"video-publisher",metadata:{step:input.step,youtubeVideoId:videoId,receipt:input.receipt||null}})
 return next
}

export const failPublishTransaction=(id:string,step:PublishTransactionStep,error:unknown,toolId="video-publisher")=>{
 const transaction=getPublishTransaction(id);if(!transaction)throw new Error("Unknown publish transaction: "+id)
 const message=error instanceof Error?error.message:String(error),timestamp=now()
 const next=save({...transaction,status:"failed",steps:{...transaction.steps,[step]:{status:"failed",error:message}},updatedAt:timestamp})
 appendContentBuildEvent({contentBuildId:next.contentBuildId,eventType:"publish.transaction.failed",entityType:"publish-transaction",entityId:next.id,actorType:"tool",toolId,metadata:{step,error:message,youtubeVideoId:next.youtubeVideoId||null}})
 return next
}
export const completePublishTransaction=(id:string,toolId="video-publisher")=>{
 const transaction=getPublishTransaction(id);if(!transaction)throw new Error("Unknown publish transaction: "+id)
 if(transaction.status==="completed") {
  const completedBuild=getContentBuild(transaction.contentBuildId)
  if(completedBuild?.youtube?.status==="published" && completedBuild.channelId) recordBrainPublicationIdentityReceipt({ transaction, build: completedBuild })
  return transaction
 }
 if(!transaction.youtubeVideoId)throw new Error("Cannot complete publishing without a bound YouTube video ID.")
 if(transaction.steps["verify-remote-state"]?.status!=="completed")throw new Error("Cannot complete publishing before remote verification.")
 const timestamp=now(),next=save({...transaction,status:"completed",completedAt:timestamp,updatedAt:timestamp})
 const build=getContentBuild(next.contentBuildId)
 if(build?.youtube?.status==="published"){
  setContentBuildStage(next.contentBuildId,"published",{actorType:"youtube",toolId})
  appendContentBuildEvent({
   contentBuildId:next.contentBuildId,
   eventType:"package.published",
   entityType:"publishing-package",
   entityId:next.videoPackageId,
   actorType:"youtube",
   toolId,
   timestamp,
   previousState:{status:"approved",approvedSnapshotId:next.approvedSnapshotId},
   resultingState:{status:"published",videoId:next.youtubeVideoId,completedAt:timestamp},
   metadata:{
    videoPackageId:next.videoPackageId,
    approvedSnapshotId:next.approvedSnapshotId,
    approvedSnapshotHash:next.approvedSnapshotHash,
    projectionRevision:next.assetLock.projectionRevision,
    youtubeVideoId:next.youtubeVideoId,
    publicationState:"published",
   },
  })
 } else if(build?.youtube?.status==="scheduled")setContentBuildStage(next.contentBuildId,"scheduled",{actorType:"youtube",toolId})
 appendContentBuildEvent({contentBuildId:next.contentBuildId,eventType:"publish.transaction.completed",entityType:"publish-transaction",entityId:next.id,actorType:"tool",toolId,metadata:{youtubeVideoId:next.youtubeVideoId}})
 if (build?.youtube?.status === "published" && build.channelId) recordBrainPublicationIdentityReceipt({ transaction: next, build })
 // Publication identity is recorded into the canonical Brain event stream so a
 // later VT-SYNC checkpoint can join by channel/video/transaction. This event
 // is not a metric observation and does not claim the transaction caused results.
 const metadataVersionIds = listContentBuildMetadataHistory(next.contentBuildId).map((entry) => entry.metadataVersionId).filter(Boolean)
 if (build?.youtube?.status === "published" && build.channelId && next.youtubeVideoId) {
  appendContentBuildEvent({
   contentBuildId: next.contentBuildId,
   eventType: "analytics.checkpoint",
   entityType: "publication-checkpoint",
   entityId: next.id,
   actorType: "analytics",
   toolId: "post-publication-outcome-pipeline",
   timestamp,
   evidenceIds: [next.approvedSnapshotId, next.approvedSnapshotHash],
   metadata: {
    checkpointId: `publication-checkpoint:${next.id}`,
    videoId: next.youtubeVideoId,
    channelId: build.channelId,
    publicationTransactionId: next.id,
    approvedSnapshotId: next.approvedSnapshotId,
    metadataVersionIds,
    status: "awaiting-follow-up-analytics",
    causalConclusion: null,
   },
  })
  void import("../brain/AlgorithmIntelligenceEventLedger").then(({ listAlgorithmIntelligenceEvents, recordAlgorithmIntelligenceEvent }) => {
   // Only recommendations explicitly bound to this exact ContentBuild + video
   // receive a due checkpoint. A proposal for another package is never joined.
   listAlgorithmIntelligenceEvents({ channelId: build.channelId as string })
    .filter((event) => event.kind === "RECOMMENDATION_CREATED" && event.metadata?.contentBuildId === next.contentBuildId && (!event.videoId || event.videoId === next.youtubeVideoId) && Boolean(event.actionPacketId) && !event.checkpointAt)
    .forEach((event) => {
     const windowHours = Math.max(1, ...event.evaluationTargets.map((target) => Number(target.windowHours || 0)))
     recordAlgorithmIntelligenceEvent({
      id: event.id,
      channelId: event.channelId,
      projectId: event.projectId,
      videoId: next.youtubeVideoId as string,
      kind: event.kind,
      sourceSystem: event.sourceSystem,
      sourceId: event.sourceId,
      recommendationId: event.recommendationId,
      actionPacketId: event.actionPacketId,
      workflowId: event.workflowId,
      primingPlanId: event.primingPlanId,
      primingStepId: event.primingStepId,
      parentEventIds: event.parentEventIds,
      evidenceIds: event.evidenceIds,
      confidence: event.confidence,
      title: event.title,
      summary: event.summary,
      evaluationTargets: event.evaluationTargets,
      checkpointAt: Date.parse(timestamp) + windowHours * 3600000,
      metadata: { ...event.metadata, publicationTransactionId: next.id, approvedSnapshotId: next.approvedSnapshotId, metadataVersionIds, checkpointId: `publication-checkpoint:${next.id}`, publicationCheckpointAt: timestamp, checkpointStatus: "scheduled-for-follow-up-evaluation" },
     })
    })
   recordAlgorithmIntelligenceEvent({
    id: `publish-checkpoint:${next.id}`,
    channelId: build.channelId as string,
    projectId: build.legacyProjectId || null,
    videoId: next.youtubeVideoId as string,
    kind: "PUBLICATION_CHECKPOINT_RECORDED",
    sourceSystem: "workflow",
    sourceId: next.id,
    parentEventIds: [],
    evidenceIds: [next.approvedSnapshotId, next.approvedSnapshotHash],
    confidence: "medium",
    title: "Canonical publishing transaction checkpoint",
    summary: "A creator-approved publishing transaction completed. Await canonical post-publication analytics before evaluating outcome.",
    evaluationTargets: [],
    checkpointAt: Date.parse(timestamp),
    metadata: {
     contentBuildId: next.contentBuildId,
     videoPackageId: next.videoPackageId,
     publicationTransactionId: next.id,
     approvedSnapshotId: next.approvedSnapshotId,
     approvedSnapshotHash: next.approvedSnapshotHash,
     projectionRevision: next.assetLock.projectionRevision,
     metadataVersionIds,
     publicationState: build.youtube?.status || "unknown",
     youtubeVideoId: next.youtubeVideoId,
     finalRenderAssetId: next.assetLock.finalRenderAssetId,
     titleAssetId: next.assetLock.titleAssetId,
     thumbnailAssetId: next.assetLock.thumbnailAssetId,
     descriptionAssetId: next.assetLock.descriptionAssetId,
     scheduledAt: next.assetLock.scheduledAt,
     awaitingCanonicalAnalyticsCheckpoint: true,
     checkpointId: `publication-checkpoint:${next.id}`,
     causalConclusion: null,
    },
   })
  }).catch(() => undefined)
 }
 return next
}
export const resetPublishTransactionRepositoryForTests=()=>{memory=[];if(canStore())localStorage.removeItem(KEY)}
