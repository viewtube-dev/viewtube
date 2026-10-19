import { describe, expect, it } from "vitest";
import type { ViewTubeActionPacket, ViewTubeToolCapability } from "./viewTubeToolChains";
import { validateProductionHandoff } from "./productionHandoffContracts";

const packet = (overrides: Partial<ViewTubeActionPacket> = {}): ViewTubeActionPacket => ({
  id: "packet-1",
  version: 1,
  sourceToolId: "metadata-master",
  sourceKind: "studio-tool",
  payloadKind: "metadata",
  title: "Approved metadata proposal",
  summary: "Prepare the optimized package for the publisher.",
  payload: { title: "A better title" },
  workflowId: "workflow-1",
  operationId: "operation-1",
  intent: "prepare",
  approvalState: "not-required",
  identityMode: "canonical",
  contentBuildId: "build-1",
  projectId: "project-1",
  channelId: "channel-1",
  videoId: null,
  evidence: ["comparison-1"],
  provenance: ["metadata-master.seo-package@1"],
  suggestedTargets: ["video-publisher"],
  createdAt: 1,
  ...overrides,
});

const capability = (overrides: Partial<ViewTubeToolCapability> = {}): ViewTubeToolCapability => ({
  id: "video-publisher",
  label: "Video Publisher",
  kind: "studio-tool",
  route: "/publisher",
  accepts: ["metadata"],
  produces: ["metadata"],
  status: "ready",
  description: "Prepare and publish creator-approved content.",
  mutationClass: "external-write",
  ...overrides,
});

describe("validateProductionHandoff", () => {
  it("accepts a compatible preparation handoff without executing an external write", () => {
    expect(validateProductionHandoff(packet(), capability())).toMatchObject({
      ok: true,
      issues: [],
    });
  });

  it("rejects a payload that the destination does not accept", () => {
    const result = validateProductionHandoff(packet({ payloadKind: "script" }), capability());
    expect(result.ok).toBe(false);
    expect(result.issues).toContain("video-publisher cannot accept script payloads.");
  });

  it("fails closed when an external-write execution has no explicit creator approval", () => {
    const result = validateProductionHandoff(packet({
      intent: "execute",
      idempotencyKey: "publish-once-1",
    }), capability());
    expect(result.ok).toBe(false);
    expect(result.issues).toContain("External-write execution requires explicit creator approval.");
  });

  it("requires approval identity and an idempotency key before external-write execution", () => {
    const result = validateProductionHandoff(packet({
      intent: "execute",
      approvalState: "approved",
      approvedBy: "creator-1",
      approvedAt: "2026-10-15T12:00:00.000Z",
    }), capability());
    expect(result.ok).toBe(false);
    expect(result.issues).toContain("External-write execution requires an idempotency key.");
  });

  it("rejects a mismatched approved snapshot instead of silently relinking a publication", () => {
    const result = validateProductionHandoff(packet({
      intent: "execute",
      approvalState: "approved",
      approvedBy: "creator-1",
      approvedAt: "2026-10-15T12:00:00.000Z",
      idempotencyKey: "publish-once-1",
      approvedSnapshotId: "snapshot-1",
      approvedSnapshotHash: "hash-1",
      expectedSnapshotHash: "hash-2",
    }), capability());
    expect(result.ok).toBe(false);
    expect(result.issues).toContain("Approved snapshot hash does not match the expected publication hash.");
  });

  it("requires prompt recipe ID and version to be supplied together", () => {
    const result = validateProductionHandoff(packet({
      promptRecipeId: "metadata-master.seo-package",
      promptRecipeVersion: null,
    }), capability());
    expect(result.ok).toBe(false);
    expect(result.issues).toContain("Prompt recipe ID and version must be recorded together.");
  });

  it("reports incomplete legacy lineage without pretending it is canonical", () => {
    const result = validateProductionHandoff(packet({
      workflowId: undefined,
      operationId: undefined,
      identityMode: "legacy-derived",
    }), capability());
    expect(result.ok).toBe(true);
    expect(result.warnings).toContain("Workflow identity was derived for a legacy packet; producer continuity is not certified.");
  });
});
