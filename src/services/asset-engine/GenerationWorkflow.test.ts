import { describe, expect, it } from "vitest"

import {
 createContentBuild,
 listContentBuildEvents,
 setContentBuildStage,
} from "./ContentBuildRepository"
import {
 prepareGenerationRequest,
 recordToolReceipt,
} from "./GenerationWorkflow"

describe("GenerationWorkflow", () => {
 it("prepares a generation request from one existing ContentBuild identity", () => {
  const build = createContentBuild({
   id: "cb-generation-workflow-1",
   channelId: "channel-1",
   legacyProjectId: "project-1",
   legacyProjectName: "Austerlitz",
  })

  const prepared = prepareGenerationRequest({
   contentBuildId: build.id,
   channelId: "channel-1",
   projectId: "project-1",
   toolId: "video-publisher",
   operation: "generate-package",
   targetSlot: "title",
   mode: "new-option",
   creatorIntent: "Generate packaging options for the active video.",
   requestedSlots: ["script", "title", "thumbnail", "description", "tags"],
   evidenceIds: ["evidence:channel-profile:1"],
  })

  expect(prepared.request.contentBuildId).toBe(build.id)
  expect(prepared.request.projectId).toBe("project-1")
  expect(prepared.request.channelId).toBe("channel-1")
  expect(prepared.request.contextManifestId).toBe(prepared.contextManifest.id)
  expect(prepared.request.operationId).toBe(prepared.request.id)
  expect(prepared.request.workflowId).toBe(`workflow:${build.id}`)
  expect(prepared.request.contextRevision).toBe(build.revision)
  expect(prepared.contextManifest.contentBuildRevision).toBe(build.revision)
  expect(prepared.contextManifest.requestedSlots).toEqual([
   "script",
   "title",
   "thumbnail",
   "description",
   "tags",
  ])
  expect(prepared.contextManifest.evidenceIds).toEqual(["evidence:channel-profile:1"])

  const inputEvent = listContentBuildEvents(build.id)
   .find((event) => event.eventType === "tool.input.received")

  expect(inputEvent?.toolId).toBe("video-publisher")
  expect(inputEvent?.metadata).toMatchObject({
   requestId: prepared.request.id,
   operationId: prepared.request.operationId,
   workflowId: prepared.request.workflowId,
   contextManifestId: prepared.contextManifest.id,
   targetSlot: "title",
   mode: "new-option",
   generationRequest: prepared.request,
   operationRecord: expect.objectContaining({
    schemaVersion: 1,
    operationId: prepared.request.id,
    workflowId: `workflow:${build.id}`,
    status: "running",
    kind: "generation",
    lineage: expect.objectContaining({
     contentBuildId: build.id,
     projectId: "project-1",
     channelId: "channel-1",
     evidenceIds: ["evidence:channel-profile:1"],
    }),
   }),
   contextManifest: prepared.contextManifest,
  })
 })

 it("rejects a request that conflicts with the ContentBuild project or channel scope", () => {
  const build = createContentBuild({
   id: "cb-generation-workflow-scope",
   channelId: "channel-canonical",
   legacyProjectId: "project-canonical",
  })

  expect(() => prepareGenerationRequest({
   contentBuildId: build.id,
   channelId: "channel-other",
   projectId: "project-canonical",
   toolId: "video-publisher",
   operation: "generate-package",
   targetSlot: "title",
   mode: "create",
   creatorIntent: "Generate a title.",
  })).toThrow(/channel scope mismatch/i)

  expect(() => prepareGenerationRequest({
   contentBuildId: build.id,
   channelId: "channel-canonical",
   projectId: "project-other",
   toolId: "video-publisher",
   operation: "generate-package",
   targetSlot: "title",
   mode: "create",
   creatorIntent: "Generate a title.",
  })).toThrow(/project scope mismatch/i)
 })

 it("fails closed for generation requests and receipts after publication", () => {
  const build = createContentBuild({
   id: "cb-generation-workflow-post-publish",
   channelId: "channel-post-publish",
   legacyProjectId: "project-post-publish",
   stage: "published",
  })

  expect(() => prepareGenerationRequest({
   contentBuildId: build.id,
   channelId: "channel-post-publish",
   projectId: "project-post-publish",
   toolId: "video-publisher",
   operation: "generate-package",
   targetSlot: "title",
   mode: "new-option",
   creatorIntent: "Generate a new title after publication.",
  })).toThrow(/not allowed.*stage published/i)

  const request = {
   schemaVersion: 1 as const,
   id: "request-after-publish",
   contentBuildId: build.id,
   projectId: "project-post-publish",
   channelId: "channel-post-publish",
   toolId: "video-publisher",
   operation: "generate-package",
   targetSlot: "title",
   mode: "new-option" as const,
   sourceAssetIds: [],
   evidenceIds: [],
   contextManifestId: "context-after-publish",
   contextRevision: build.revision,
   creatorIntent: "A stale request must not record output.",
   constraints: {},
   outputSpec: {},
   parentAssetId: null,
   variantGroupId: null,
   traceId: null,
   requestedAt: new Date().toISOString(),
  }
  expect(() => recordToolReceipt({ request, outputAssetIds: ["asset-after-publish"] }))
   .toThrow(/not allowed.*stage published/i)
 })

 it("fails closed for a stage that has not been explicitly authorized for generation", () => {
  const build = createContentBuild({
   id: "cb-generation-workflow-unknown-stage",
   channelId: "channel-unknown-stage",
   legacyProjectId: "project-unknown-stage",
   stage: "future-stage" as never,
  })

  expect(() => prepareGenerationRequest({
   contentBuildId: build.id,
   channelId: "channel-unknown-stage",
   projectId: "project-unknown-stage",
   toolId: "video-publisher",
   operation: "generate-package",
   targetSlot: "title",
   mode: "create",
   creatorIntent: "An unknown lifecycle stage must not inherit permission.",
  })).toThrow(/not allowed.*stage future-stage.*not in the generation allowlist/i)
 })

 it("rejects a stale generation request after the canonical build revision changes", () => {
  const build = createContentBuild({
   id: "cb-generation-workflow-stale-revision",
   channelId: "channel-stale-revision",
   legacyProjectId: "project-stale-revision",
  })
  const prepared = prepareGenerationRequest({
   contentBuildId: build.id,
   channelId: "channel-stale-revision",
   projectId: "project-stale-revision",
   toolId: "video-publisher",
   operation: "generate-package",
   targetSlot: "title",
   mode: "new-option",
   creatorIntent: "Generate a title from the captured revision.",
  })

  setContentBuildStage(build.id, "edit")

  expect(() => recordToolReceipt({
   request: prepared.request,
   outputAssetIds: ["asset-from-stale-context"],
  })).toThrow(/revision is stale.*expected current revision/i)
  expect(listContentBuildEvents(build.id).some(event =>
   event.eventType === "tool.output.recorded" && event.outputAssetIds.includes("asset-from-stale-context")
  )).toBe(false)
 })

 it("records a ToolReceipt in the existing ContentBuild event history", () => {
  const build = createContentBuild({
   id: "cb-generation-workflow-receipt",
   channelId: "channel-2",
   legacyProjectId: "project-2",
  })

  const prepared = prepareGenerationRequest({
   contentBuildId: build.id,
   channelId: "channel-2",
   projectId: "project-2",
   toolId: "video-publisher",
   operation: "generate-package",
   targetSlot: "title",
   mode: "new-option",
   creatorIntent: "Generate six title options.",
   sourceAssetIds: ["asset-script-1"],
   evidenceIds: ["evidence:packaging:1"],
  })

  const receipt = recordToolReceipt({
   request: prepared.request,
   outputAssetIds: ["asset-title-1", "asset-title-2"],
   generationRecordId: "generation-1",
   versionIds: ["version-1", "version-2"],
   variantGroupId: "variant-group-1",
   relationshipIds: ["relation-1"],
   traceId: "trace-1",
   summary: "Created two title candidates.",
  })

  expect(receipt.requestId).toBe(prepared.request.id)
  expect(receipt.operationId).toBe(prepared.request.operationId)
  expect(receipt.workflowId).toBe(prepared.request.workflowId)
  expect(receipt.contentBuildId).toBe(build.id)
  expect(receipt.projectId).toBe("project-2")
  expect(receipt.toolId).toBe("video-publisher")
  expect(receipt.inputAssetIds).toEqual(["asset-script-1"])
  expect(receipt.outputAssetIds).toEqual(["asset-title-1", "asset-title-2"])
  expect(receipt.versionIds).toEqual(["version-1", "version-2"])
  expect(receipt.variantGroupId).toBe("variant-group-1")
  expect(receipt.traceId).toBe("trace-1")

  const outputEvent = listContentBuildEvents(build.id)
   .find((event) => event.eventType === "tool.output.recorded")

  expect(outputEvent?.generationRecordId).toBe("generation-1")
  expect(outputEvent?.traceId).toBe("trace-1")
  expect(outputEvent?.outputAssetIds).toEqual(["asset-title-1", "asset-title-2"])
  expect(outputEvent?.metadata).toMatchObject({
   requestId: prepared.request.id,
   operationId: prepared.request.operationId,
   workflowId: prepared.request.workflowId,
   contextManifestId: prepared.request.contextManifestId,
   versionIds: ["version-1", "version-2"],
   variantGroupId: "variant-group-1",
   relationshipIds: ["relation-1"],
   toolReceipt: receipt,
   operationRecord: expect.objectContaining({
    schemaVersion: 1,
    operationId: prepared.request.id,
    workflowId: `workflow:${build.id}`,
    status: "succeeded",
    lineage: expect.objectContaining({
     contentBuildId: build.id,
     toolReceiptId: receipt.id,
     generationRecordId: "generation-1",
     traceId: "trace-1",
     assetIds: ["asset-script-1", "asset-title-1", "asset-title-2"],
    }),
   }),
  })
 })
})
