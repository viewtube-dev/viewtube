import type { ViewTubeActionPacket, ViewTubeToolCapability } from "./viewTubeToolChains";

export interface ProductionHandoffValidation {
  ok: boolean;
  issues: string[];
  warnings: string[];
}

const hasContext = (packet: ViewTubeActionPacket, key: string): boolean => {
  switch (key) {
    case "creator": return Boolean(packet.creatorId);
    case "project": return Boolean(packet.projectId);
    case "contentBuild": return Boolean(packet.contentBuildId);
    case "channel": return Boolean(packet.channelId);
    case "video": return Boolean(packet.videoId);
    case "asset": return Boolean(packet.assetIds?.length);
    case "evidence": return Boolean(packet.evidence?.length);
    case "approvedSnapshot": return Boolean(packet.approvedSnapshotId && packet.approvedSnapshotHash);
    case "promptRecipe": return Boolean(packet.promptRecipeId && packet.promptRecipeVersion);
    default: return false;
  }
};

/**
 * Validate a packet at the destination boundary. This is deliberately a
 * validation contract, not a second workflow store or an external-write API.
 * Publisher/Manager remain the owners of remote mutations.
 */
export const validateProductionHandoff = (
  packet: ViewTubeActionPacket,
  target: ViewTubeToolCapability,
): ProductionHandoffValidation => {
  const issues: string[] = [];
  const warnings: string[] = [];

  if (!packet.id?.trim() || !packet.sourceToolId?.trim()) {
    issues.push("Handoff requires packet and source-tool identities.");
  }
  if (packet.sourceToolId === target.id) {
    issues.push("A tool cannot hand a packet to itself.");
  }
  if (!target.accepts.includes(packet.payloadKind)) {
    issues.push(`${target.id} cannot accept ${packet.payloadKind} payloads.`);
  }
  if (target.status === "planned") {
    issues.push(`${target.id} is planned and cannot receive production handoffs yet.`);
  }

  for (const required of target.requiredContext || []) {
    if (!hasContext(packet, required)) {
      issues.push(`Handoff to ${target.id} requires ${required} context.`);
    }
  }

  if (packet.identityMode === "legacy-derived" || !packet.workflowId || !packet.operationId) {
    warnings.push("Workflow identity was derived for a legacy packet; producer continuity is not certified.");
  }

  const hasRecipeId = Boolean(packet.promptRecipeId);
  const hasRecipeVersion = Boolean(packet.promptRecipeVersion);
  if (hasRecipeId !== hasRecipeVersion) {
    issues.push("Prompt recipe ID and version must be recorded together.");
  }

  if (packet.expectedSnapshotHash && packet.approvedSnapshotHash !== packet.expectedSnapshotHash) {
    issues.push("Approved snapshot hash does not match the expected publication hash.");
  }

  const isExternalWrite = target.mutationClass === "external-write"
    || target.mutationClass === "user-approved-write";
  if (packet.intent === "execute" && isExternalWrite) {
    if (
      packet.approvalState !== "approved"
      || !packet.approvedBy?.trim()
      || !packet.approvedAt?.trim()
    ) {
      issues.push("External-write execution requires explicit creator approval.");
    }
    if (!packet.idempotencyKey?.trim()) {
      issues.push("External-write execution requires an idempotency key.");
    }
    if (packet.approvalState === "rejected") {
      issues.push("A rejected handoff cannot execute an external write.");
    }
  }

  return { ok: issues.length === 0, issues, warnings };
};
