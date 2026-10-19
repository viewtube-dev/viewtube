import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const registryPath = path.join(rootDir, "docs/specifications/prompt-registry.json");
const registry = JSON.parse(fs.readFileSync(registryPath, "utf8"));

test("prompt registry declares the governed v3 inventory contract", () => {
  assert.equal(registry.version, "viewtube-prompt-registry-v3");
  assert.equal(registry.authority, "docs/specifications/PROMPTS.md");
  assert.equal(registry.governance?.registryRole, "inventory_and_reachability_projection_not_runtime_truth_or_work_ledger");
  assert.equal(registry.governance?.phase, "3_prompt_governance");
});

test("prompt registry requires provenance and reachability fields", () => {
  const required = new Set(registry.governance?.requiredRecordContract || []);
  for (const field of [
    "id",
    "source",
    "kind",
    "owner",
    "productionCallers",
    "promptFamily",
    "promptVersion",
    "constitutionVersion",
    "contextResolverVersion",
    "outputSchemaVersion",
    "requestedModel",
    "servedModel",
    "evaluationBaseline",
    "reachabilityStatus",
  ]) {
    assert.ok(required.has(field), `missing required prompt registry field: ${field}`);
  }

  assert.deepEqual(
    registry.governance?.reachabilityStates,
    ["production_reachable", "test_only", "dead_code_candidate", "unverified", "retired"],
  );
});

test("prompt registry keeps legacy migration gated on caller reachability and quality evidence", () => {
  const gates = new Set(registry.governance?.migrationGates || []);
  for (const gate of [
    "inventory_all_callers",
    "define_context_recipe_and_output_schema",
    "add_representative_fixtures",
    "compare_quality_baseline",
    "verify_runtime_reachability",
    "remove_legacy_only_after_zero_production_reachability",
  ]) {
    assert.ok(gates.has(gate), `missing migration gate: ${gate}`);
  }

  assert.equal(
    registry.governance?.status,
    "governance_contract_defined_migration_and_reachability_population_incomplete",
  );
});

test("Brain task profile inventory has stable IDs and source/status references", () => {
  assert.ok(Array.isArray(registry.brainTaskProfiles));
  assert.ok(registry.brainTaskProfiles.length > 0);
  const ids = registry.brainTaskProfiles.map((profile) => profile.id);
  assert.equal(new Set(ids).size, ids.length, "Brain task profile IDs must be unique");
  for (const profile of registry.brainTaskProfiles) {
    assert.ok(profile.id, "task profile requires a stable id");
    assert.ok(profile.source, `task profile ${profile.id} requires a source reference`);
    assert.ok(profile.status, `task profile ${profile.id} requires an explicit inventory status`);
  }
});
