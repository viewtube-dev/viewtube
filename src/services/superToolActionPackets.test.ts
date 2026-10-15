import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  createGenerationRecord: vi.fn(),
  updateGenerationRecord: vi.fn(),
  getSuperTool: vi.fn(),
  ingestGenerationArtifacts: vi.fn(),
  createWorkflowChain: vi.fn(),
  createWorkflowStep: vi.fn(),
  attachArtifactToWorkflow: vi.fn(),
  createViewTubeActionPacket: vi.fn(),
  persistViewTubeActionPacket: vi.fn(),
  ensureContentBuild: vi.fn(),
  attachAssetToContentBuild: vi.fn(),
  recordContentBuildToolInput: vi.fn(),
  recordContentBuildToolOutput: vi.fn(),
}));

vi.mock("./generationStore", () => ({
  createGenerationRecord: mocks.createGenerationRecord,
  updateGenerationRecord: mocks.updateGenerationRecord,
}));
vi.mock("./superToolRegistry", () => ({ getSuperTool: mocks.getSuperTool }));
vi.mock("./superToolRuntimePlanRegistry", () => ({ MOUNTED_INTERNAL_TOOL_IDS: new Set() }));
vi.mock("./vaultAdapter", () => ({ ingestGenerationArtifacts: mocks.ingestGenerationArtifacts }));
vi.mock("./workflowEngine", () => ({
  createWorkflowChain: mocks.createWorkflowChain,
  createWorkflowStep: mocks.createWorkflowStep,
  attachArtifactToWorkflow: mocks.attachArtifactToWorkflow,
}));
vi.mock("./viewTubeToolChains", () => ({
  createViewTubeActionPacket: mocks.createViewTubeActionPacket,
  persistViewTubeActionPacket: mocks.persistViewTubeActionPacket,
}));
vi.mock("./asset-engine/ContentBuildRepository", () => ({
  attachAssetToContentBuild: mocks.attachAssetToContentBuild,
  ensureContentBuild: mocks.ensureContentBuild,
}));
vi.mock("./asset-engine/ToolContext", () => ({
  recordContentBuildToolInput: mocks.recordContentBuildToolInput,
  recordContentBuildToolOutput: mocks.recordContentBuildToolOutput,
}));

import { createSuperToolActionPacket } from "./superToolActionPackets";

describe("createSuperToolActionPacket production handoff continuity", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.ensureContentBuild.mockReturnValue({ id: "build-1" });
    mocks.createGenerationRecord.mockReturnValue({ id: "generation-1" });
    mocks.updateGenerationRecord.mockReturnValue({ id: "generation-1" });
    mocks.ingestGenerationArtifacts.mockReturnValue([{ id: "vault-asset-1" }]);
    mocks.createWorkflowStep.mockImplementation((title, ownerSurface, toolId, details) => ({
      id: `step-${title}`, title, ownerSurface, toolId, details, status: "pending", artifactIds: [],
    }));
    mocks.createWorkflowChain.mockImplementation((input) => ({
      id: "workflow-1",
      title: input.title,
      goal: input.goal,
      projectId: input.projectId,
      primaryToolId: input.primaryToolId,
      status: "pending",
      createdAt: 1,
      updatedAt: 1,
      stepIds: input.steps.map((step: { id: string }) => step.id),
      steps: input.steps,
      artifactIds: [],
      provenance: input.provenance,
    }));
    mocks.attachArtifactToWorkflow.mockImplementation((chainId, artifactId) => ({
      id: chainId,
      artifactIds: [artifactId],
    }));
    mocks.createViewTubeActionPacket.mockImplementation((input) => ({
      ...input, id: "live-packet-1", version: 1, createdAt: 1, suggestedTargets: input.suggestedTargets || [],
    }));
    mocks.persistViewTubeActionPacket.mockReturnValue({ packet: { id: "live-packet-1" } });
  });

  it("shares one workflow and operation identity across the chain, generation receipt, and live ActionPacket", () => {
    const result = createSuperToolActionPacket({
      toolId: "creator-canvas-os",
      moduleId: "content-concept",
      title: "Create concept",
      summary: "A concept grounded in creator context.",
      contentBuildId: "build-1",
      projectId: "project-1",
      channelId: "channel-1",
      videoId: "video-1",
      creatorId: "creator-1",
      promptRecipeId: "content-concept.generate",
      promptRecipeVersion: "3",
      contextManifestId: "context-1",
      recommendationId: "recommendation-1",
      experimentId: "experiment-1",
      inputs: { promptRecipeId: "content-concept.generate" },
      outputs: { concept: "test" },
      confidence: "high",
      evidence: ["evidence-1"],
      missingInputs: [],
      handoffTargets: ["studio:video-publisher"],
      workflowTitle: "Concept to Publish",
      workflowGoal: "Carry a concept into the publishing workflow.",
      workflowSteps: [{ title: "Package", surface: "studio", toolId: "packaging-lab-pro", details: "Build packaging." }],
    });

    expect(result.chain.id).toBe("workflow-1");
    expect(result.packet.workflowId).toBe("workflow-1");
    expect(result.packet.operationId).toBe(result.packet.id);
    expect(mocks.createGenerationRecord).toHaveBeenCalledWith(expect.objectContaining({
      metadata: expect.objectContaining({
        workflowId: "workflow-1",
        operationId: result.packet.id,
        promptRecipeId: "content-concept.generate",
        promptRecipeVersion: "3",
        contextManifestId: "context-1",
      }),
    }));
    expect(mocks.createViewTubeActionPacket).toHaveBeenCalledWith(expect.objectContaining({
      workflowId: "workflow-1",
      operationId: result.packet.id,
      parentPacketId: result.packet.id,
      contentBuildId: "build-1",
      creatorId: "creator-1",
      promptRecipeId: "content-concept.generate",
      promptRecipeVersion: "3",
      contextManifestId: "context-1",
      recommendationId: "recommendation-1",
      experimentId: "experiment-1",
      idempotencyKey: expect.stringContaining(result.packet.id),
    }));
    expect(mocks.persistViewTubeActionPacket).toHaveBeenCalled();
    expect(mocks.attachArtifactToWorkflow).toHaveBeenCalledWith(
      "workflow-1",
      result.artifactId,
      expect.stringContaining("generation-1"),
    );
  });
});
