import { describe, expect, it } from "vitest";
import {
  BRAIN_CAPABILITY_EVIDENCE_REQUIREMENTS,
  BRAIN_CAPABILITY_REGISTRY,
} from "./BrainCapabilityRegistry";

describe("Brain capability evidence requirements", () => {
  it("defines explicit evidence requirements for every registered capability", () => {
    const registeredIds = BRAIN_CAPABILITY_REGISTRY.map((capability) => capability.id).sort();
    const requirementIds = Object.keys(BRAIN_CAPABILITY_EVIDENCE_REQUIREMENTS).sort();
    expect(requirementIds).toEqual(registeredIds);
    for (const capabilityId of registeredIds) {
      expect(BRAIN_CAPABILITY_EVIDENCE_REQUIREMENTS[capabilityId].length).toBeGreaterThan(0);
    }
  });

  it("uses only canonical context section IDs", () => {
    const knownSectionIds = new Set([
      "confirmed_creator_context",
      "channel_knowledge",
      "channel_evidence",
      "evidence_quality",
      "shared_evidence_contract",
      "deterministic_statistics_intelligence",
      "deterministic_analytics_findings",
      "algorithm_channel_opportunity_intelligence",
      "audience_intelligence",
      "creator_style",
      "public_niche_knowledge",
      "active_project_context",
      "current_public_research",
    ]);
    for (const requiredIds of Object.values(BRAIN_CAPABILITY_EVIDENCE_REQUIREMENTS)) {
      for (const sectionId of requiredIds) expect(knownSectionIds.has(sectionId)).toBe(true);
    }
  });
});
