import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const read = (path) => readFileSync(path, "utf8");
const orchestrator = read("src/services/brain/BrainOrchestrator.ts");
const publication = read("src/services/brain/BrainPublicationOutcomeBridge.ts");
const continuity = read("src/services/brain/BrainAssistantContinuity.ts");
const health = read("src/services/brain/BrainHealthSnapshot.ts");
const lifecycle = read("src/services/brain/BrainProjectLifecycle.ts");
const communication = read("src/services/brain/BrainCommunicationIngestion.ts");
const attribution = read("src/services/brain/BrainAttributionChain.ts");

test("phase 5 quality loop has one bounded repair and independently validates its candidate", () => {
  assert.match(orchestrator, /BRAIN_MODEL_TIMEOUT_MS\s*=\s*30_000/);
  assert.match(orchestrator, /BRAIN_REPAIR_TIMEOUT_MS\s*=\s*20_000/);
  assert.match(orchestrator, /if \(!evaluation\.passed && status === "complete"\)/);
  assert.equal((orchestrator.match(/input\.modelGenerator \|\| generateStructuredBrainResponse/g) || []).length, 2,
    "one initial generation and at most one repair generation are allowed");
  assert.match(orchestrator, /const repairedEvaluation = validateBrainResponse\(/);
  assert.match(orchestrator, /if \(repairedEvaluation\.passed\)/);
  assert.match(orchestrator, /fallbackReason = "validation_failed"/);
  assert.match(orchestrator, /fallbackReason = "repair_failed"/);
  assert.match(orchestrator, /input\.allowModel \? "provider_error" : "model_disabled"/);
  for (const field of ["taskProfileId", "generationPath", "promptVersion", "evaluationId", "repairReasons", "repaired"]) {
    assert.ok(orchestrator.includes(field), `turn/learning receipt must preserve ${field}`);
  }
});

test("phases 6–7 keep publication identity separate from measured performance and causality", () => {
  assert.match(publication, /transaction\.status !== "completed"/);
  assert.match(publication, /build\.youtube\?\.videoId !== transaction\.youtubeVideoId/);
  assert.match(publication, /approvedSnapshotHash/);
  assert.match(publication, /performanceEvaluated:\s*false/);
  assert.match(publication, /causalAttribution:\s*"not-assessed"/);
});

test("phases 8–9 expose bounded context omissions and fail closed on missing evidence health", () => {
  assert.match(continuity, /selectedSectionIds/);
  assert.match(continuity, /omittedSectionIds/);
  assert.match(continuity, /No channel scope was provided/);
  assert.match(continuity, /No evidence identifiers were supplied/);
  assert.match(health, /status = !evidence \|\| evidence\.confidence === "insufficient"/);
  assert.match(health, /"insufficient_data"/);
  assert.match(health, /never promotes learning/);
});

test("phases 10–11 use canonical project state and governed communication evidence", () => {
  assert.match(lifecycle, /status: "insufficient_context"/);
  assert.match(lifecycle, /A canonical ContentBuild snapshot is required/);
  assert.match(lifecycle, /CAPABILITIES_BY_STAGE\[contentBuild\.stage\]/);
  assert.match(communication, /durableMemoryPromoted:\s*false/);
  assert.match(communication, /promotionRequiresGovernedReview:\s*true/);
  assert.match(communication, /Communication ID was already used for different text or scope/);
});

test("phase 12 attribution only joins scoped events and exposes unresolved stages", () => {
  assert.match(attribution, /event\.channelId === channelId/);
  assert.match(attribution, /input\.events\.filter\(\(event\) => event\.channelId === channelId\)/);
  assert.match(attribution, /unresolvedStages/);
  assert.match(attribution, /parentEventIds/);
  assert.match(attribution, /recommendationEventId/);
});
