# Evidence Unification Plan

**Status:** Draft  
**Priority:** P0 — blocks trustworthy claim-level evidence, “Based on” UI, quality gates, and evaluation provenance  
**Principle:** One array of `EvidenceRecord` objects is produced, rendered into the prompt, graded, and recorded in the runtime snapshot. No schema migration. Undo = revert.

---

## 1. Goal

Make the evidence the model **reads** and the evidence the system **grades** the same data, and make that data the data the runtime **records**.

After this change:

- `BrainContextBroker` renders from `EvidenceRecord[]`.
- `BrainEvidenceQuality` grades the identical `EvidenceRecord[]`.
- `BrainRuntimeSnapshot` carries the same records (or a stable projection that preserves owner, freshness, confidence, source reference, and observation time) instead of bare id strings.
- A green quality grade can only appear on numbers that were actually present in the prompt.
- A red grade can only appear on numbers that were actually present in the prompt.
- Evaluation harness provenance requirements become satisfiable.

---

## 2. Problem Statement (current)

| Stage | What exists today | Defect |
|-------|-------------------|--------|
| Production | Resolver / projection produces `EvidenceRecord[]` (typed contract) | Correct starting point |
| Prompt assembly | `BrainContextBroker.buildBrainContextPack` builds prose from `snapshot.inferredProfile.topEvidenceVideos` | Different source; prose, not records |
| Quality grading | `BrainEvidenceQuality.buildBrainEvidenceQuality` grades a separate `EvidenceRecord[]` | Not the array that was rendered |
| Runtime record | `BrainRuntimeSnapshot` stores flat evidence id strings | No owner, freshness, confidence, source, or observation time |
| Evaluation | Harness demands model served + evidence ids + omissions | Runtime cannot supply the required provenance |

Consequences:

- Green grade over ungraded numbers.
- Red grade over numbers that never reached the prompt.
- Cross-version evaluation comparisons are guesswork.
- Trust in the evidence gate erodes.

---

## 3. Target Data Flow

```
Resolver / projection
        │
        ▼
EvidenceRecord[]          ◄── single source of truth for this turn
        │
        ├──────────────────► BrainContextBroker  (render into prompt)
        │
        ├──────────────────► BrainEvidenceQuality (grade the same array)
        │
        └──────────────────► BrainRuntimeSnapshot (record the same array
                                                  or a faithful projection)
```

Single seam in the orchestrator owns the hand-off. No other module independently invents evidence for the prompt.

---

## 4. Scope

### In scope (this change)

1. Route the resolver’s `EvidenceRecord[]` into the prompt builder.
2. Grade exactly the array that was rendered.
3. Persist that array (or a lossless projection) into the runtime snapshot for the turn.
4. Preserve existing public behaviour for callers that only need ids (backward-compatible projection).
5. Re-run and deliberately re-baseline the golden suite.
6. Add or extend a focused unit/integration test that asserts prompt evidence ≡ graded evidence ≡ recorded evidence for a turn.

### Out of scope (explicit non-goals)

- Schema migration or database backfill.
- Expanding `EvidenceOwner` beyond currently produced values (only `analytics-canon` is live).
- Implementing the full ten knowledge states from the spec.
- Collapsing the third epistemic vocabulary inside the quality module (follow-on).
- Fixing observation-time vs capture-time stamping (follow-on, see §8).
- Removing hardcoded absolute paths or adding documentation-import CI (separate hygiene).
- Changing model provider selection (Gemini direct vs gateway).
- Creating a new skill.

---

## 5. Implementation Steps (ordered, surgical)

### Step 0 — Inventory & confirmation (read-only)

- Confirm every caller of `buildBrainContextPack` / the prompt builder (orchestrator is the expected primary; verify no others).
- Confirm the exact shape of `EvidenceRecord` and what the quality module currently receives.
- Confirm what `BrainRuntimeSnapshot` currently stores for evidence and which consumers read the flat id list.
- Note any test helpers that construct `topEvidenceVideos` or parallel evidence arrays.

**Exit criterion:** Written call graph and type map checked into the PR description.

### Step 1 — Single seam in the orchestrator

- In the orchestrator turn path, obtain the `EvidenceRecord[]` once from the resolver/projection.
- Pass that same array (by reference or explicit copy) to:
  - the context/prompt builder,
  - the quality grader,
  - the snapshot writer.
- Remove or dead-code any parallel construction of prompt evidence from `inferredProfile.topEvidenceVideos` for Brain turns that go through this path.

**Exit criterion:** One variable in the orchestrator is the sole source for all three consumers on a Brain turn.

### Step 2 — Prompt builder consumes `EvidenceRecord[]`

- Update `BrainContextBroker.buildBrainContextPack` (or the narrow function that builds the evidence section) to accept `EvidenceRecord[]`.
- Render the prompt evidence section from those records (owner, metric, value, freshness/observation time, source reference as available).
- Keep the rendered prose readable for the model; do not dump raw JSON unless a structured evidence block is already the established pattern.
- Preserve any existing truncation / top-N logic, but apply it to the typed records so the graded set and the rendered set stay identical after truncation.

**Exit criterion:** Prompt evidence section is produced only from the passed `EvidenceRecord[]`. No residual read of `topEvidenceVideos` for this path.

### Step 3 — Quality grader receives the identical array

- Ensure `BrainEvidenceQuality.buildBrainEvidenceQuality` is called with the exact array (or the post-truncation array) that was rendered.
- Do not re-query, re-project, or re-filter inside the quality module for the turn under evaluation.
- If the quality module currently builds its own list, replace that construction with the injected array.

**Exit criterion:** For a given turn, `promptEvidence === gradedEvidence` (same object identity or deep equality of the records used).

### Step 4 — Runtime snapshot carries rich evidence

- Extend the snapshot evidence field to hold either:
  - the full `EvidenceRecord[]`, or
  - a stable projection that retains at minimum: id, owner, freshness/observation time, confidence (if present), source reference, and the metric/value pair.
- Keep a derived `evidenceIds: string[]` (or equivalent) for any existing consumers that only need ids, so this step stays backward-compatible.
- Do **not** import the evidence type into unrelated modules; keep the type boundary where it already lives and have the snapshot module accept a DTO or the existing type if it is already a shared contract.

**Exit criterion:** A completed turn’s snapshot can answer “what evidence was graded and shown to the model” without consulting a second store.

### Step 5 — Tests & golden baseline

- Add a focused test (unit or integration) that:
  1. Builds a turn with a known `EvidenceRecord[]`.
  2. Asserts the prompt builder received and rendered from that array.
  3. Asserts the quality grader received the same array.
  4. Asserts the snapshot recorded the same array (or faithful projection).
- Run the existing golden suite (≥24 scenarios).
- Deliberately re-baseline only the scenarios whose evidence source legitimately changed. Do not weaken assertions that catch unsupported numbers, cross-channel leakage, or vocabulary bleed.
- Confirm the evaluation harness can now obtain evidence ids + omissions from the snapshot for a turn.

**Exit criterion:** New equivalence test green; golden suite green against the updated baseline; no regression in grounding checks.

### Step 6 — Cleanup & documentation

- Remove dead paths that still construct prompt evidence from `topEvidenceVideos` for the unified turn path.
- Add a short comment at the orchestrator seam: “Single evidence array for prompt, grade, and snapshot — do not re-derive.”
- Update `docs/brain/AI_BRAIN_MASTER_RESOURCE.md` with a one-paragraph note that claim-level evidence and “Based on” UI are gated on this unification.
- Do **not** create a new skill; if authority-mapping or evaluation-provenance skills exist, add a pointer to this plan.

---

## 6. Acceptance Criteria

- [ ] One `EvidenceRecord[]` is produced per Brain turn and is the sole input to prompt rendering, quality grading, and snapshot recording.
- [ ] Prompt text and quality grade cannot diverge for the same turn.
- [ ] Runtime snapshot retains owner, freshness/observation time, and source reference (not only ids).
- [ ] Existing id-only consumers continue to work via a derived list.
- [ ] Golden suite re-run and re-baselined deliberately; grounding regressions still fail.
- [ ] New equivalence test exists and is green.
- [ ] Change is reversible by a single revert; no migration or backfill required.
- [ ] No new skill created; no schema change.

---

## 7. Rollback

```
git revert <unification-commit(s)>
```

No data migration, no feature flag required for the first landing if the change is kept behind the existing Brain turn path. If a flag is desired for extra safety, gate only the new seam; the old `topEvidenceVideos` path can remain as fallback until the golden baseline is stable.

---

## 8. Follow-on work (explicitly after this plan)

These are real defects from the same audit but are **not** part of the unification change:

| ID | Issue | Suggested later step |
|----|-------|----------------------|
| F1 | Observation time stamped from capture time | Distinguish `observedAt` from `capturedAt` in the record and projection |
| F2 | Missing metrics vanish instead of being recorded as missing | Emit explicit `missing` records (or attach a stable missing list to the turn) so absence leaves a trace |
| F3 | Three epistemic vocabularies | Collapse to the typed contract; implement states required by the evaluation harness |
| F4 | Only one `EvidenceOwner` value produced | Expand producers only when real transcript/vault/publishing/etc. evidence exists |
| F5 | Hardcoded absolute paths | Relativise or remove; fix `file://` documentation links |
| F6 | Dual model entry points | Enforce gateway or document the deliberate exception |
| F7 | No CI check for documentation imports | Add the check the Brain system report already requests |
| F8 | Architecture tests are text-matching only | Keep them; do not rely on them to catch dual-ownership bugs |

---

## 9. Relationship to existing plans

- **AI_BRAIN_MASTER_RESOURCE.md** — Claim-level evidence, “Based on” sections, and readiness display assume this unification. Add a gate note under the quick-wins section.
- **Quick-wins 3, 4, 12, 14** (Based on, readiness, evidence button, statistics routing) — May land in parallel only if they consume the unified array; otherwise sequence them after Step 5.
- **Skills** — Fold any required guidance into the existing authority-mapping and evaluation-provenance skills. Do not add a 37th skill.

---

## 10. Open questions (resolve in Step 0)

1. Are there callers of the prompt builder besides the orchestrator?
2. What exact states does the quality module’s internal epistemic type declare?
3. Which snapshot consumers read the flat evidence id list and must keep working?
4. Does the golden suite already contain a scenario that would have caught prompt-vs-grade divergence if the two arrays had been forced equal?

Resolve these with source inspection before writing production code.

---

*End of plan. Keep the change narrow. One array. Prompt, grade, and record it. Re-baseline deliberately. Revert if needed.*
