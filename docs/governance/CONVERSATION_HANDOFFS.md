# ViewTube Conversation Handoffs

**Production Date:** 2026-09-27  
**Last Edited:** 2026-10-29  
**Class:** SPECIFICATION  
**Status:** ACTIVE  
**Concern:** long-conversation handoff, conversation work capture, intake review, valuation, deduplication and promotion  
**Owner:** Conversation & Improvement OS + Documentation Governance  
**Registry ID:** DOC-GOV-CONVERSATION-HANDOFFS  
**Last Audited Main SHA:** faa07ed085173f5764db72054f17583ce9a3cb38  
**Supersedes:** scattered domain-specific conversation handoff/update-log procedures after migration  
**Related Authorities:** docs/governance/CONVERSATION_OS.md; docs/governance/DOCUMENTATION.md; docs/governance/TASK_AUTHORITY.md; docs/programs/INTEGRATED_APPLICATION.md

## Purpose

Long ViewTube conversations routinely contain far more durable work than fits safely in one chat: decisions, completed implementation, unfinished implementation, bugs, plans, feature ideas, audits, new workflows, prototypes, references and discoveries.

This specification provides one governed process for:

1. handing a long conversation to another conversation or agent without losing context;
2. logging **all** meaningful work discussed or performed in the conversation;
3. reviewing and auditing that work against current ViewTube truth;
4. valuing and categorizing each item;
5. merging overlapping plans/tasks/features/tools/widgets/pages/processes;
6. promoting surviving work into the correct canonical systems;
7. preserving useful provenance without creating another task/status ledger.

## Two separate jobs

### Conversation Handoff
A resumability package answering:

> What does the next agent/conversation need to know to continue this work correctly without rereading the entire transcript?

### Work Reconciliation
A governed intake review answering:

> What from this conversation should become canonical work, evidence, documentation, a merged plan, a decision, an opportunity/risk, donor history, or no further action?

A handoff may be created immediately. Its work log must later be reconciled before the intake package is considered closed.

## Storage

Each substantial conversation uses:

```text
tasks/conversation-intake/<conversation-id>/
├── handoff.md
├── worklog.json
└── review.md
```

Optional supporting material may be linked, not copied unnecessarily.

Examples of valid conversation IDs:

```text
VT-CONV-TOOLBOX-REDESIGN
VT-CONV-BRAIN-INTEGRATION
VT-CONV-2026-09-27-TASK-INDEX
```

The directory is a **staging/provenance store**.

It is explicitly **not**:
- Task Index;
- a replacement for Integrated Application Program;
- a Domain Authority;
- a second project-management system;
- proof that implementation is complete.

## Domain update logs are projections, not handoffs

A domain authority may retain an append-only update log, Current Work table, implementation checkpoint, certification ledger or technical recovery record when it serves a distinct domain purpose. These records own only their scoped decisions, implementation evidence and acceptance gaps.

They do **not** replace or duplicate the global conversation package:
- the global `handoff.md` owns resumable cross-domain context and the individual instruction/unfinished-action checklist;
- the global `worklog.json` captures all meaningful conversation work, including completed, partial, planned, blocked, abandoned and discovered work;
- the global `review.md` owns reconciliation, deduplication, disposition and canonical-target evidence.

Domain logs should link to the global package when relevant and receive only the domain-specific projection. Do not require every short conversation to create a handoff; apply the global triggers below. Do not create separate Editor, Toolbox, Vault, Widget or other domain conversation handoff packages for the same conversation.

Project-wide recovery ledgers are also scoped records: use them for explicit recovery/activation campaigns and shared recovery-state changes, not as a second mandatory per-conversation log. Link recovery evidence from the global package when both apply.

## Handoff triggers

Create/update a handoff when any of these applies:

- the user explicitly asks for a handoff or new conversation;
- context has become long enough that important details may be lost or repeatedly summarized;
- a multi-day or multi-agent effort is changing owner;
- a major implementation wave/phase is ending while more work remains;
- the active branch/PR is being handed to another agent;
- the conversation is about to change domains while unfinished work remains;
- a long research/planning thread has accumulated many decisions and candidate tasks;
- the agent can no longer confidently resume the work from the normal Conversation OS envelope alone.

Do not wait until context is already lost.

## Handoff content

Every full handoff records:

1. **Goal / creator intent**
2. **Current state**
   - current main SHA;
   - branch/PR;
   - Mission / Work Order if any;
   - task/capability/domain IDs.
3. **Read first**
   - exact authorities/specifications/skills/references.
4. **Settled decisions**
   - accepted choices and constraints;
   - rejected/superseded directions that should not be repeated.
5. **Work completed in the conversation**
   - what was actually changed;
   - files/PRs/commits/artifacts;
   - verification/evidence;
   - whether completion is merely conversation-local or canonically proven.
6. **Work currently in progress**
7. **Planned / unfinished work**
8. **Bugs / failures / blockers**
9. **New ideas / opportunities / risks**
10. **Documentation / skills / workflows / prototypes created or proposed**
11. **Important resources / donor files / external references**
12. **Do not redo**
13. **Verification still needed**
14. **Exact next action**
15. **Work-log path**
16. **Reconciliation status**

## Emergency handoff

If context pressure is severe, capture at minimum:

- goal;
- branch/PR/main SHA;
- top current task;
- completed work with evidence;
- unfinished work;
- decisions;
- blockers;
- changed paths;
- next action;
- worklog pointer.

The next conversation can expand the handoff after resuming.

## Conversation work log

`worklog.json` records every meaningful piece of work or potential work from the conversation, including work that is already complete.

Conversation-local states are:

- `PLANNED`
- `STARTED`
- `PARTIAL`
- `COMPLETED_IN_CONVERSATION`
- `VERIFIED_IN_CONVERSATION`
- `BLOCKED`
- `ABANDONED`
- `DISCOVERED`

These states describe the source conversation only. They never mutate canonical Task Index lifecycle automatically.

Each work item records:
- stable conversation-work-item ID;
- title / summary / details;
- kind;
- conversation-local state;
- affected domains/capabilities/surfaces;
- files/branches/PRs/artifacts;
- evidence/verification;
- dependencies/blockers;
- similarity/search keys;
- value assessment;
- suggested destination;
- review status;
- final disposition/targets after reconciliation.

## Work-item kinds

Suggested kinds:

- FEATURE
- BUG
- INTEGRATION
- REFACTOR
- OPTIMIZATION
- DESIGN
- PLAN
- AUDIT
- REPORT
- DOCUMENTATION
- SKILL
- WORKFLOW
- PROTOTYPE
- STANDALONE_HTML
- RESEARCH
- REFERENCE
- MIGRATION
- VERIFICATION
- CLEANUP
- IDEA
- RISK
- DECISION

## Valuation

Review should explicitly evaluate usefulness before promoting work.

Use evidence-backed fields such as:

- creatorImpact: LOW | MEDIUM | HIGH | CRITICAL
- systemLeverage: LOW | MEDIUM | HIGH | CRITICAL
- urgency: NONE | LOW | MEDIUM | HIGH | CRITICAL
- reusePotential: LOW | MEDIUM | HIGH
- confidence: LOW | MEDIUM | HIGH
- estimatedEffort: SMALL | MEDIUM | LARGE | UNKNOWN
- implementationRisk: LOW | MEDIUM | HIGH | UNKNOWN
- rationale: short explanation

Value is not permission to skip deduplication or verification.

## Reconciliation workflow

For **every** work item:

1. Inspect current `main` where implementation is claimed.
2. Search Task Index / Task Authority records.
3. Search Integrated Application Program.
4. Search Product Architecture / Capability Registry.
5. Search owning Domain Authority / Specification.
6. Search existing plans, audits, handoffs and related conversation-intake packages.
7. Search active branches / PRs / missions.
8. Search relevant Master Sources and donor artifacts when appropriate.
9. Classify relationship:
   - NEW
   - CONTINUATION
   - ALREADY_TRACKED
   - DUPLICATE
   - OVERLAPS
   - EXPANDS
   - SUPERSEDES
   - BUG_IN_EXISTING
   - VERIFICATION_ONLY
   - COMPLETED_ALREADY
   - DONOR_ONLY
10. Evaluate value / urgency / effort / risk.
11. Choose exactly one primary disposition.
12. Link the canonical target(s).
13. Record what unique material was harvested.
14. Mark the item RECONCILED only when its destination is explicit.

## Dispositions

Allowed primary dispositions include:

- `ALREADY_TRACKED`
- `MERGE_INTO_EXISTING_TASK`
- `CREATE_TASK_CANDIDATE`
- `UPDATE_INTEGRATED_APPLICATION_PROGRAM`
- `UPDATE_PRODUCT_ARCHITECTURE`
- `UPDATE_DOMAIN_AUTHORITY`
- `UPDATE_SPECIFICATION`
- `UPDATE_EXISTING_PLAN`
- `MERGE_PLANS`
- `CREATE_PLAN`
- `CREATE_DECISION_RECORD`
- `CREATE_OPPORTUNITY`
- `CREATE_RISK`
- `ATTACH_RECEIPT_EVIDENCE`
- `ARCHIVE_AS_DONOR`
- `NO_ACTION_REQUIRED`
- `REJECT`

Do not create a new plan/task/document simply because a conversation contains a new name for old work.

## Plan-family consolidation

When several conversations or documents plan similar work:

1. identify the shared job/capability/system;
2. inventory every plan/handoff/source;
3. choose the current survivor or create one only if no suitable survivor exists;
4. harvest unique requirements, acceptance criteria, UI ideas, code references, tests, dependencies and decisions;
5. merge duplicate work items into shared canonical tasks/capabilities;
6. preserve source provenance;
7. mark superseded plans as donor/history after no-loss accounting;
8. update the Integrated Application Program when the merged work crosses systems.

Examples:
- multiple Widget plans → one widget/system plan family + exact VT tasks;
- multiple Vault redesign conversations → Vault authority/plan + deduped tasks;
- multiple mobile fixes → shared responsive workstream where appropriate;
- multiple AI Brain integration plans → Brain authority + Integration Program + shared task candidates.

## Completed work handling

Completed conversation work is still logged because it may:

- prove that a task is already implemented;
- provide verification evidence;
- prevent duplicate implementation;
- identify documentation that must be updated;
- reveal incomplete integration;
- contribute a receipt or decision.

But `COMPLETED_IN_CONVERSATION` is not canonical DONE.

Task Authority decides canonical completion from current evidence.

## Review closure rule

A conversation intake package is CLOSED only when:

- every work item is RECONCILED;
- every promoted item has a canonical target;
- completed work has evidence/receipt routing where useful;
- duplicated work identifies its survivor;
- plan merges preserve unique content;
- important decisions are recorded;
- outstanding blockers are routed;
- the handoff has a clear next action or explicitly says no continuation is needed.

## Archive / retention

Conversation intake packages are retained as provenance after reconciliation.

They may later move to the Removed Archive when:
- all unique material is harvested;
- inbound references are checked;
- no active workflow depends on the package;
- the canonical targets retain the needed information.

## Cross-agent rule

ChatGPT, Codex, Claude and future agents use the same handoff/work-log contract.

Host-specific memory is never the only place unfinished ViewTube work is stored.


## Complete user-instruction register

Every distinct user instruction, request, correction, constraint, preference and prohibition must be recorded as an individual conversation-level requirement. Do not collapse materially different instructions into a general summary.

The structured work log may carry an optional top-level `instructions` array. Each record uses a stable conversation-local `instructionId`, concise `text`, `status`, related work-item IDs, branch/PR/commit references, target branch, delivery state and evidence references. The handoff renders these records as a readable checkbox register.

Instruction status is distinct from work-item state and canonical Task Index lifecycle. A request may be implemented locally, committed, included in a PR, merged, present on target, integrated and verified at different times. Record the actual stage. Never mark a local implementation as delivered, or a merged PR as verified without acceptance evidence. If multiple PRs contributed, list every contributing PR. If no PR applies, record commit/artifact evidence or explicit N/A.

Use stable IDs such as `REQ-001`. Preserve corrections and supersession links. Do not create one canonical task per user sentence; link related instructions to shared work items and canonical tasks where they exist.

## Branch and PR history reconciliation

Branch history and PR history are separate evidence streams. For each relevant branch/PR pair, record source and target branches, PR number, opening head SHA when recoverable, current head SHA, commits and changed paths added after PR opening, merge commit, current target-branch presence, recovery destination and verification.

Explicitly classify unmerged, partially merged, post-PR work, orphaned, recovered, duplicate, conflicted, missing and unknown states. Do not assume a PR contains all later branch commits. If the PR-opening snapshot or branch history cannot be recovered, mark it UNKNOWN. Preserve unique work from closed or abandoned PRs through a reconciled recovery branch; do not blindly merge stale branches.

## Feature integration gap register

Each feature/capability may have a top-level `integrationGaps` record with maturity across the existing Task Authority axes: architecture, backend, frontend, integration, tests, runtime, responsive, documentation and release. Reuse the existing maturity vocabulary: `NONE`, `PLANNED`, `PARTIAL`, `IMPLEMENTED`, `VERIFIED`, `NOT_APPLICABLE`.

Record concrete missing connections, user-visible impact, dependencies and acceptance evidence. Explicitly detect components without application integration, backend without frontend, frontend without backend, APIs without authorization, data without persistence, workflows without feedback, tests without runtime proof and release blockers. Component existence or isolated tests do not prove end-to-end application integration.

## Ideas and next-best-action routing

The five-idea evolution pass and next-best-action recommendation extend existing Conversation OS and Convergence capabilities; they do not create parallel registries or backlogs. Route improvement proposals through `ideas/registry.json` and `governance/convergence/improvements.json`. Keep unapproved ideas as proposals.

Derive next-best action from canonical tasks, active Crown missions/work orders, dependencies, blockers and verification receipts. Do not mutate canonical task lifecycle from a handoff. Task Authority remains the only authorized task-state mutation path after canonical Task Index storage/writer is positively resolved.

## Closure additions

A package is not fully reconciled until every distinct user instruction is registered and linked to its work/evidence; branch and PR histories have been reconciled including post-PR changes; feature integration gaps are explicit; completed work distinguishes implementation, delivery, integration and verification; and the next agent has an executable next action.

The conversation intake workspace remains provenance and staging, not a second Task Index or feature maturity authority.


## Unfinished-work living log contract

The handoff is also the human-readable living document log for an oversized conversation. Its opening block must identify the conversation date and name, application/product, source application, source conversation link (or UNKNOWN), repository, intended target branch, last-updated date and package status. When a user supplies the log link and says **“Update the unfinished work log.”**, agents update that existing package in place; they do not create a duplicate log.

The human-readable log contains: (1) no more than ten factual executive sentences; (2) a separate one-line checkbox for every distinct user instruction and every meaningful unfinished action; (3) links to all documents and artifacts created or materially changed; (4) independent branch/PR and post-PR reconciliation; (5) integration gaps using Task Authority's nine maturity axes; and (6) five evidence-based finishing/improvement proposals routed through existing Ideas Registry and improvement recommendations. Each checkbox records truthful achievement/delivery status and PR/commit evidence. Missing links or lineage remain UNKNOWN. The package remains provenance/handoff storage, not a second Task Index, task backlog or idea registry.


## Standard execution sequence

Every substantial handoff follows this single sequence; do not create a second process or tracker:

1. **Resolve identity:** use the current conversation's descriptive ID, source date/host, repository and intended target. Record a source link only when supplied or verified; otherwise use `UNKNOWN`.
2. **Find the survivor:** inspect `tasks/conversation-intake/INDEX.md` and existing packages. If this is a continuation or the user supplies an existing handoff link, update that package in place. Create a new package only for a genuinely distinct source conversation.
3. **Capture the full conversation:** record every distinct user instruction as a stable `REQ-###`; record every meaningful completed, partial, blocked, planned or discovered work item as `VT-CWI-###`. Keep one-line checkboxes in the handoff and structured records in `worklog.json`.
4. **Reconcile delivery:** inspect PR metadata and branch history independently. Record opening/current heads when recoverable, post-open commits/paths, merge commit, target presence, recovery destination and unknown lineage. Distinguish local, committed, in-PR, merged, present, integrated and verified.
5. **Reconcile work:** compare each item with current code, Task Authority, Integrated Application, Product Architecture, Domain Authorities, plans, intake packages and active PRs. Give each item one disposition and explicit target or no-action rationale.
6. **Assess integration:** use only Task Authority's nine axes and maturity vocabulary. Record concrete missing seams and acceptance evidence; use `NOT_APPLICABLE` where a surface does not exist.
7. **Write the package:** maintain `handoff.md`, `worklog.json` and `review.md`; the handoff has at most ten executive sentences, all instruction checkboxes, unfinished actions, artifact links, branch/PR history, integration gaps, five proposals and an executable next action.
8. **Route proposals:** route five evidence-based improvement proposals through the existing Ideas Registry and improvement recommendations. They remain proposals until accepted; never create a parallel idea/task registry.
9. **Validate and deliver:** check JSON/schema compatibility, internal IDs/links, exact PR/commit evidence and index entry. Run the existing document-system tests/audits. Put the package and governance changes on a reviewable PR against the current target; do not claim merged or verified before GitHub/CI confirms it.
10. **Close correctly:** leave the package `PARTIALLY_RECONCILED` while any item lacks disposition or verification remains outstanding. Mark `RECONCILED` only when every item has a destination and evidence; retain the package as provenance.

### Required handoff completion checklist

- [ ] Conversation metadata complete; unavailable source link explicitly `UNKNOWN`.
- [ ] Ten-sentence maximum executive handoff.
- [ ] Every distinct user instruction has an individual REQ entry and delivery evidence.
- [ ] Every meaningful work item has a CWI record, value, relationship, disposition and target.
- [ ] Every created/changed artifact is linked.
- [ ] Branch and PR history reconciled independently, including post-PR work and unknowns.
- [ ] Nine-axis integration-gap matrix uses Task Authority vocabulary.
- [ ] Exactly five proposals are routed through existing idea authorities, or a documented reason fewer are justified.
- [ ] Exact next action and acceptance/verification criteria are executable.
- [ ] Package index, schema/document checks and PR delivery state are current.

The conversation package remains provenance/staging; it never mutates Task Index lifecycle and never replaces canonical task, idea, capability or program ownership.