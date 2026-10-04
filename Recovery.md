# ViewTube Recovery — Master Operations Document

**Repository:** `viewtube-dev/viewtube`  
**Branch:** `main`  
**Human-readable master:** `Recovery.md`  
**Structured state:** `Recovery.yaml`  
**Source protocol:** `docs/recovery/VIEWTUBE_MULTI_CONVERSATION_RECOVERY_PROTOCOL_2026-10-02.md`  
**Source ledger:** `docs/recovery/VIEWTUBE_MULTI_CONVERSATION_RECOVERY_LEDGER_2026-10-02.md`

> This is the **human-maintained canonical recovery document**. The old extensionless `Recovery` file is retained as a compatibility pointer. Use this file for instructions, decisions, work-log entries, reconciliation notes, and agent handoffs. Use `Recovery.yaml` for structured state that agents/tools need to parse reliably.

## 1. Operating model

The repository is the durable shared coordination surface for ViewTube recovery. Chat history is evidence, not the canonical storage location.

**Flow:**

`CONVERSATION → RECOVERY → ARTIFACT → GITHUB → LEDGER → VERIFICATION → RECONCILIATION`

### Every conversation agent must

1. **READ FIRST** — fetch the current `Recovery.md` and `Recovery.yaml`.
2. **RECOVER** — inventory the conversation for documents, document-equivalent responses, implementation evidence, decisions, discoveries, failures, plans, and unknowns.
3. **WRITE DURABLY** — add every material recovered document/artifact to this repository.
4. **LOG** — add a unique work-log entry to this document.
5. **REGISTER** — add/update the artifact in `Recovery.yaml`.
6. **PRESERVE PROVENANCE** — never turn a report or inference into a verified fact without evidence.
7. **RE-READ BEFORE WRITE** — fetch the latest files and SHAs before updating them.
8. **NEVER STALE-WRITE** — if a file changed, re-fetch and merge instead of overwriting newer work.
9. **ROUND 1** — preserve unique conversation evidence; do not prematurely reconcile.
10. **ROUND 2** — reconcile the complete repository recovery corpus and establish authoritative/current versions.

## 2. Status vocabulary

Use exactly these statuses where applicable:

- `VERIFIED`
- `REPORTED`
- `INFERRED`
- `PROPOSED`
- `IMPLEMENTED`
- `VERIFIED IMPLEMENTATION`
- `FAILED`
- `BLOCKED`
- `SUPERSEDED`
- `UNKNOWN`

Implementation completion is not established by a plan, audit, or discussion. For tracked task/quick-win completion, implementation must be actually completed, merged to `main`, and verified.

## 3. Provenance chain

When reconstructing or recovering an artifact, preserve:

`SOURCE → DISCOVERY → DECISION → IMPLEMENTATION → VERIFICATION`

Record missing stages as `UNKNOWN`; never invent them.

## 4. Artifact placement

Use the existing canonical project path when one is known. Otherwise use:

- `docs/recovery/handoffs/`
- `docs/recovery/architecture/`
- `docs/recovery/plans/`
- `docs/recovery/audits/`
- `docs/recovery/implementation/`
- `docs/recovery/governance/`
- `docs/recovery/design/`
- `docs/recovery/deployment/`
- `docs/recovery/data/`
- `docs/recovery/youtube/`
- `docs/recovery/technical/`

Preserve original filenames where known.

## 5. Work-log format

Every material recovery event gets a unique ID:

`LOG-ID: REC-YYYYMMDD-<agent>-<sequence>`

Use:

| Field | Required |
|---|---|
| LOG-ID | Yes |
| Timestamp | Yes |
| Agent / conversation | Yes |
| Round | Yes |
| Category | Yes |
| Action | Yes |
| Source | Yes |
| Evidence | Yes |
| Status | Yes |
| Artifact / file | When applicable |
| External identifier | When applicable |
| Dependencies | When applicable |
| Result | Yes |
| Next action | Yes |
| Verification | Yes |

### Work-log entries

<!-- APPEND ONLY during Round 1. Never delete another agent's entry. -->

#### LOG-ID: REC-20261004-system-001

- **Timestamp:** 2026-10-04
- **Agent:** repository recovery coordinator
- **Round:** 1
- **Category:** GOVERNANCE / RECOVERY
- **Action:** Converted the recovery system to a human-readable Markdown master plus structured YAML state.
- **Source:** Existing unified `Recovery` document and repository recovery artifacts.
- **Evidence:** Current repository files and successful GitHub writes.
- **Status:** VERIFIED IMPLEMENTATION
- **Artifact:** `Recovery.md`, `Recovery.yaml`
- **Result:** Recovery instructions and structured state now have separate roles.
- **Next action:** All subsequent conversation agents use the new files as the first read/write surface.
- **Verification:** Files committed to repository.

<!-- New agents append below this line. -->

## 6. Conversation recovery record

Each agent should add a concise contribution here or create a dedicated handoff under `docs/recovery/handoffs/`.

Required minimum:

`WHAT WAS FOUND → WHERE IT CAME FROM → WHAT IT MEANS → WHAT IS VERIFIED → WHAT IS NOT → WHAT MUST HAPPEN NEXT`

### Round 1

<!-- Append unique agent sections. -->

### Round 2 — reconciliation

Do not finalize until Round 1 evidence is substantially collected.

Record:

- authoritative documents;
- authoritative implementation;
- verified deployment state;
- conflicts and evidence;
- missing artifacts;
- unresolved unknowns;
- reconciliation decisions.

## 7. Project recovery categories

Track relevant findings under:

- Core Application
- Toolbox / SubToolbox / Widget UI
- CSS / Design Tokens / Primitives
- UI Reference Library
- Asset Engine / Resource Library
- Projects / ContentBuild
- Analytics / VT Sync / Master Data
- YouTube / Creator Systems
- Governance / Conversation OS
- Deployment / Render / Vercel
- Data / Schemas / Mock Data
- Testing / Verification
- Recovery / Repository Reconstruction

Add categories when required.

## 8. Recovery rules

### Preserve, don't guess

Never fabricate commits, branches, PRs, paths, URLs, implementation state, test results, deployments, architecture decisions, approvals, dates, or repository contents.

### Successful work has priority

Preserve actual successful code, fixes, files, merges, tests, builds, deployments, audits, and verified architecture.

### Failures are evidence

Preserve regressions, rejected approaches, debugging discoveries, dependency failures, deployment problems, account/repository problems, and negative results.

### Conflicts are preserved

Do not silently choose between conflicting records. Record the conflict, preserve both sources, and resolve it using evidence during Round 2.

## 9. Round 1

Each conversation independently:

- reads `Recovery.md` and `Recovery.yaml`;
- inventories its conversation;
- extracts documents and document-equivalent responses;
- creates durable artifacts;
- appends a unique work-log entry;
- updates structured state;
- records open questions.

Do not attempt full reconciliation.

## 10. Round 2

Agents:

1. read the complete recovery corpus;
2. inspect relevant artifacts;
3. compare evidence;
4. identify duplicates and contradictions;
5. establish authoritative/current versions;
6. identify missing information;
7. update the consolidated state;
8. record reconciliation decisions.

Priority for resolving conflicts:

**current verified implementation > verified tests/deployments > current canonical docs > explicit approved decisions > recovery artifacts > plans > general discussion**

## 11. Final recovery state

Complete only after reconciliation:

- Repository recoverability:
- Code recoverability:
- Documentation recoverability:
- Architecture recoverability:
- Deployment recoverability:
- Data/schema recoverability:
- YouTube/creator-system recoverability:
- Remaining gaps:
- Recommended reconstruction order:

## 12. Source documents

The original protocol and ledger remain preserved as source artifacts:

- `docs/recovery/VIEWTUBE_MULTI_CONVERSATION_RECOVERY_PROTOCOL_2026-10-02.md`
- `docs/recovery/VIEWTUBE_MULTI_CONVERSATION_RECOVERY_LEDGER_2026-10-02.md`

The broader recovered ChatGPT document catalog remains at:

- `docs/recovery/VIEWTUBE_CHATGPT_DOCUMENT_CATALOG_2026-10-04.md`

## 13. Final principle

The recovery system must let a future engineer or ChatGPT agent reconstruct and continue ViewTube from durable evidence without relying on one conversation's memory.

**READ → INVENTORY → EXTRACT → CLASSIFY → PRESERVE → LOG → CONTRIBUTE → VERIFY → RECONCILE → CONTINUE**
