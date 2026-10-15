import { beforeEach, describe, expect, it, vi } from "vitest";
import { buildGoldenChannelFixture, restorationRichSpec } from "../fixtures";
import { runBrainTurn } from "../BrainOrchestrator";
import { resolveCreatorContext } from "../CreatorContextResolver";
import type { CreatorGrowthContext } from "../../../types";
import type { StructuredBrainModelOutput } from "../../gemini";

vi.mock("../../aiBrainConversationStore", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../../aiBrainConversationStore")>();
  return {
    ...actual,
    beginAIBrainTurn: vi.fn(async () => ({ id: "turn-test-1" })),
    completeAIBrainTurn: vi.fn(async (input: Record<string, unknown>) => ({ id: input.turnId, ...input })),
    formatCreatorGrowthModules: vi.fn((response: { modules?: unknown[] }) => response.modules || []),
    sanitizeCreatorFacingBrainCopy: vi.fn((value: string) => String(value || "").replace(/\\s+/g, " ").trim()),
  };
});

vi.mock("../../aiBrainCommandInterface", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../../aiBrainCommandInterface")>();
  return {
    ...actual,
    buildCreatorBrainLocalFallback: vi.fn(() => "Fallback guidance for the restoration channel."),
    formatCreatorBrainResponse: vi.fn(() => ({
      id: "fallback-response",
      mode: "strategy_brief",
      headline: "Channel strategy",
      keyInsight: "Use the clearest restoration evidence.",
      body: "Review the strongest restoration lane and write a focused title.",
      actions: ["Rewrite one title"],
      modules: [],
      evidenceIds: [],
      evidenceChips: [],
      learningSummary: "",
      questions: [],
      confidence: "medium",
    })),
  };
});

vi.mock("../../aiBrainSelfImprovement", () => ({
  captureAIBrainLearningEvent: vi.fn(async () => ({ id: "learning-test-1" })),
}));

vi.mock("../../gemini", () => ({
  generateStructuredBrainResponse: vi.fn(),
  groundCurrentNicheResearch: vi.fn(),
}));

vi.mock("../BrainContextBroker", () => ({
  buildBrainContextPack: vi.fn(() => ({
    systemInstruction: "Use the supplied evidence. Do not invent metrics.",
    budget: { usedCharacters: 100, maximumCharacters: 12000 },
  })),
}));

vi.mock("../BrainCapabilityRegistry", () => ({
  inferBrainIntent: vi.fn(() => "strategy"),
  selectBrainCapabilities: vi.fn(() => []),
  shouldUseCurrentGrounding: vi.fn(() => false),
}));

vi.mock("../BrainEngineControls", () => ({
  readBrainEngineControls: vi.fn(() => ({
    channelIntelligence: false,
    opportunityIntelligence: false,
    algorithmPriming: false,
    anomalyIntelligence: false,
  })),
}));

vi.mock("../CreatorContextResolver", () => ({
  resolveCreatorContext: vi.fn(async () => null),
}));

const output = (mode: StructuredBrainModelOutput["mode"]): StructuredBrainModelOutput => ({
  headline: "Restoration channel strategy",
  keyInsight: "The restoration lane gives the channel a clear direction.",
  body: "Use the restoration evidence to shape a more focused title and opening hook.",
  mode,
  modules: [],
  actions: ["Rewrite one title"],
});

const run = (modelGenerator: (input: unknown) => Promise<StructuredBrainModelOutput>) => {
  const snapshot = buildGoldenChannelFixture(restorationRichSpec).snapshot;
  return runBrainTurn({
    userText: "Explain my channel strategy",
    snapshot,
    systemPrompt: "Use evidence carefully.",
    growthContext: {} as CreatorGrowthContext,
    allowModel: true,
    modelGenerator: modelGenerator as never,
  });
};

describe("Brain generation quality loop", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(resolveCreatorContext).mockResolvedValue(null);
  });

  it("accepts a repaired candidate only after independent validation and records repair provenance", async () => {
    vi.mocked(resolveCreatorContext).mockResolvedValue({
      version: "vt-creator-context-v1",
      channelId: "channel-restoration",
      controls: {} as never,
      profile: { loadedAt: "2026-10-15T00:00:00.000Z" } as never,
      channelKnowledge: {
        records: [{ id: "knowledge-record-1" }],
        contradictions: [{ id: "knowledge-conflict-1" }],
      } as never,
      styleProfile: {} as never,
      project: null,
      surface: null,
      selection: null,
      evidenceRefs: [],
      provenance: {
        profileLoadedAt: "2026-10-15T00:00:00.000Z",
        selectionUpdatedAt: "2026-10-15T00:01:00.000Z",
        projectSource: "canonical_project",
      },
    } as never);
    const generator = vi.fn()
      .mockResolvedValueOnce(output("analytics_diagnosis"))
      .mockResolvedValueOnce(output("strategy_brief"));

    const result = await run(generator);

    expect(generator).toHaveBeenCalledTimes(2);
    expect(result.generationPath).toBe("repaired_model");
    expect(result.repairOutcome).toMatchObject({ attempted: true, succeeded: true });
    expect(result.fallbackReason).toBeUndefined();
    expect(result.turn.metadata).toMatchObject({
      taskProfileId: "strategy",
      generationPath: "repaired_model",
      promptVersion: expect.any(String),
      contextResolverVersion: "brain-context-resolution-v1",
      outputSchemaVersion: "structured-brain-output-v1",
      requestedModel: null,
      servedModel: null,
      modelIdentityStatus: "generator_identity_unavailable",
      evidenceIds: expect.any(Array),
      channelId: null,
      projectId: null,
      contentBuildId: null,
      creatorContextVersion: "vt-creator-context-v1",
      creatorProfileLoadedAt: "2026-10-15T00:00:00.000Z",
      creatorSelectionUpdatedAt: "2026-10-15T00:01:00.000Z",
      creatorContextProjectSource: "canonical_project",
      creatorStyleProfileAvailable: true,
      channelKnowledgeRecordIds: ["knowledge-record-1"],
      channelKnowledgeConflictIds: ["knowledge-conflict-1"],
      contextBudget: expect.any(Object),
      evaluationId: expect.any(String),
      repaired: true,
      repairAttempted: true,
      repairSucceeded: true,
    });
  });

  it("falls back when the one repaired candidate fails validation", async () => {
    const generator = vi.fn()
      .mockResolvedValueOnce(output("analytics_diagnosis"))
      .mockResolvedValueOnce(output("analytics_diagnosis"));

    const result = await run(generator);

    expect(generator).toHaveBeenCalledTimes(2);
    expect(result.turn.status).toBe("fallback");
    expect(result.generationPath).toBe("basic_guidance");
    expect(result.fallbackReason).toBe("validation_failed");
    expect(result.repairOutcome).toMatchObject({ attempted: true, succeeded: false });
    expect(result.turn.metadata).toMatchObject({
      generationPath: "basic_guidance",
      fallbackReason: "validation_failed",
      repaired: true,
    });
  });

  it("returns a safe fallback and receipt when the initial model provider fails", async () => {
    const generator = vi.fn().mockRejectedValue(new Error("provider unavailable"));

    const result = await run(generator);

    expect(generator).toHaveBeenCalledTimes(1);
    expect(result.turn.status).toBe("fallback");
    expect(result.generationPath).toBe("basic_guidance");
    expect(result.fallbackReason).toBe("provider_error");
    expect(result.repairOutcome).toMatchObject({ attempted: false, succeeded: false });
    expect(result.turn.metadata).toMatchObject({
      generationPath: "basic_guidance",
      fallbackReason: "provider_error",
      repaired: false,
      contextResolverVersion: "brain-context-resolution-v1",
      outputSchemaVersion: "structured-brain-output-v1",
      creatorContextVersion: null,
      creatorContextProjectSource: null,
      channelKnowledgeRecordIds: [],
      channelKnowledgeConflictIds: [],
      modelIdentityStatus: "generator_identity_unavailable",
      evidenceIds: expect.any(Array),
      contextBudget: expect.any(Object),
      repairAttempted: false,
      repairSucceeded: false,
    });
  });
});
