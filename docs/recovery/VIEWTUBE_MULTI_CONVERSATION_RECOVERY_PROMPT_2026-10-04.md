# ViewTube Multi-Conversation Recovery Agent Prompt
## GitHub Account Suspension + Round 1 / Round 2 Shared Recovery Protocol

**Canonical repository:** https://github.com/viewtube-dev/viewtube  
**Canonical shared state:** `Recovery.md` and `Recovery.yaml`  
**Prompt file:** `docs/recovery/VIEWTUBE_MULTI_CONVERSATION_RECOVERY_PROMPT_2026-10-04.md`

---

## PURPOSE

This conversation is one agent in a coordinated ViewTube recovery operation.

The original GitHub account used for ViewTube was suspended. A new GitHub account/repository is being used for recovery. Treat the loss of access to the old account as a recovery condition, not as proof that project work was lost.

Your task is to recover and preserve this conversation's ViewTube knowledge as durable project artifacts and contribute its status to the shared recovery system.

**Do not merely summarize the conversation. Recover it.**

The canonical shared coordination surface is the repository above. Chat history is evidence; durable artifacts and the recovery ledger are the project memory.

---

# 1. FIRST READ — BEFORE DOING ANY WORK

Read the current versions of:

1. `Recovery.md`
2. `Recovery.yaml`
3. `docs/recovery/AGENT_RECOVERY_PLAYBOOK.md`
4. `docs/recovery/VIEWTUBE_CONVERSATION_AGENT_ACTIVATION_PROMPT.md`
5. Any recovery index or handoff directly relevant to this conversation.

**Always fetch the latest version immediately before writing.**

Never overwrite another agent's newer work with a stale copy.

---

# 2. THE TWO-ROUND MODEL

## ROUND 1 — INDEPENDENT RECOVERY

Each conversation agent works independently.

The purpose is to preserve **unique evidence**, not to reconcile the entire project.

In Round 1:

- review the entire conversation;
- identify every important artifact;
- preserve substantive responses;
- recover plans, audits, discoveries, successful work, failures, decisions, code findings, and unresolved questions;
- create/update durable repository documents;
- append a unique recovery log/update entry;
- update structured state when appropriate;
- record provenance and uncertainty;
- do not silently reconcile conflicting conversations.

### Round 1 rule

**Preserve first. Reconcile later.**

Do not delete, replace, or downgrade another agent's evidence merely because your conversation says something different.

---

## ROUND 2 — CROSS-CONVERSATION RECONCILIATION

Round 2 begins only after the Round 1 corpus has been substantially collected.

When this same prompt is submitted again in Round 2:

1. Read the complete current `Recovery.md`.
2. Read the current `Recovery.yaml`.
3. Read all relevant Round 1 handoffs/artifacts.
4. Compare your conversation's evidence with the other agents' evidence.
5. Identify duplicates.
6. Identify contradictions.
7. Identify missing documents.
8. Establish authoritative/current versions using evidence.
9. Reconcile implementation status.
10. Update canonical documents and structured state.
11. Preserve the reasoning behind important reconciliation decisions.

### Round 2 priority

Use this evidence hierarchy:

**current verified implementation > verified tests/deployments > current canonical documents > explicit approved decisions > recovery artifacts > plans > general discussion**

Never convert an unverified historical claim into an implementation fact.

---

# 3. FULL-CONVERSATION FORENSIC RECOVERY

Review the entire conversation, not only the most recent messages.

Inventory:

- explicit documents created;
- files generated;
- drafts;
- document-equivalent assistant responses;
- plans;
- architecture;
- specifications;
- requirements;
- workflows;
- governance;
- audits;
- research;
- discoveries;
- bugs;
- regressions;
- successful fixes;
- code changes;
- source paths;
- branches;
- commits;
- PRs;
- deployments;
- tests;
- verification;
- failures;
- rejected approaches;
- decisions;
- approvals;
- UI/component contracts;
- CSS/token decisions;
- data models;
- schemas;
- APIs/integrations;
- automation;
- tool ideas;
- workflow improvements;
- AI-system ideas;
- security/reliability findings;
- UX findings;
- performance opportunities;
- unresolved questions;
- dependencies;
- assumptions;
- constraints;
- lessons learned.

A substantive response is a **document-equivalent artifact** when it contains reusable project knowledge such as a plan, roadmap, audit, specification, architecture, design decision, implementation detail, research result, workflow, governance rule, decision record, or failure analysis.

---

# 4. DOCUMENT INVENTORY

Create or update an inventory containing:

## Existing documents

For every document explicitly created in this conversation:

- title
- filename/path
- type
- purpose
- status
- whether saved/exported
- dependencies
- recovery priority

## Document-equivalent responses

For every major response that should become durable project documentation:

- source/context
- proposed document title
- canonical filename
- subject/category
- implementation status
- verification status
- dependencies
- whether created/updated in Round 1

## Do not create unnecessary duplicates

If a canonical document already exists:

**update the canonical document rather than creating a competing copy.**

If a document is conversation-specific or historical, create a recovery handoff and preserve provenance.

---

# 5. PRESERVE SUCCESSFUL WORK

Give high priority to work that actually succeeded:

- code changes;
- fixes;
- files;
- tests;
- builds;
- deployments;
- audits;
- architecture;
- verified decisions;
- completed workflows;
- successful integrations.

Preserve exact:

- repository names;
- URLs;
- branches;
- commit SHAs;
- PR numbers;
- paths;
- commands;
- test names;
- deployment IDs;
- service names.

Never alter identifiers for readability.

---

# 6. PRESERVE FAILURES AND REGRESSIONS

Failures are recovery evidence.

Record:

- what was attempted;
- what failed;
- affected files/systems;
- reproduction evidence;
- likely cause;
- confirmed cause when known;
- workaround;
- whether fixed;
- whether rolled back;
- lessons learned;
- approaches that should not be repeated.

For the Toolbox/SubToolbox system in particular, preserve regressions and architectural drift findings rather than treating them as disposable debugging history.

---

# 7. ENGINEERING + PRODUCT INTELLIGENCE

For every material discovery, capture:

- Finding ID
- category
- title
- affected area/file/tool
- discovery
- provenance
- evidence
- status
- impact/severity
- recommended improvement
- proposed implementation direction
- dependencies
- related documents/issues
- verification required

Explicitly review for:

- bugs;
- code-structure problems;
- duplicated authorities;
- technical debt;
- fragile abstractions;
- architecture inconsistencies;
- new tools;
- tool improvements;
- workflow improvements;
- handoff improvements;
- AI improvements;
- UX improvements;
- performance;
- security/reliability;
- data quality;
- testing/verification.

Do not require implementation before recording a valuable finding.

---

# 8. VIEWTUBE CATEGORIES

Cross-reference relevant findings with these categories:

- Core Application
- Toolbox / SubToolbox / Widget UI
- CSS / Design Tokens / Primitives
- UI Reference Library
- Asset Engine
- Resource Library
- Projects / ContentBuild
- Vault
- Analytics
- VT Sync
- Master Data
- Dashboard
- Studio Hub
- YouTube / Creator Systems
- Account / Identity / Login
- AI Brain
- Context System
- Governance / Conversation OS
- Deployment / Render / Vercel
- Data / Schemas / Mock Data
- Testing / Verification
- Recovery / Repository Reconstruction

Add a category when necessary.

---

# 9. YOUTUBE-SPECIFIC RECOVERY

When relevant, preserve:

- YouTube APIs;
- OAuth/account state;
- creator/channel systems;
- publishing;
- analytics;
- VT Sync;
- video/project systems;
- Google Cloud dependencies;
- credential boundaries;
- dataset/master-table contracts;
- transport migrations;
- verification blockers;
- account-access limitations.

Place YouTube-specific recovery material under the appropriate existing canonical location, or use:

`docs/recovery/youtube/`

Do not assume YouTube work is complete merely because a plan exists.

---

# 10. AI BRAIN / ACCOUNT / CONTEXT

Treat these as first-class ViewTube architecture areas when they occur in the conversation.

Preserve:

- Brain architecture;
- knowledge structures;
- prompts;
- context flow;
- identity/account architecture;
- login;
- channel identity;
- permissions;
- state projections;
- relationships between Account → Context → Brain → tools.

Do not create competing authorities when canonical documents already exist.

---

# 11. CHATGPT LIBRARY + GITHUB ARTIFACT MODEL

The durable source of truth for the multi-conversation recovery operation is the canonical repository.

Where ChatGPT Library/file creation is available, create the same recovery artifacts there as durable project files.

Use GitHub as the shared coordination surface and ChatGPT Library as a durable conversation-accessible artifact surface.

Suggested recovery organization:

`/ViewTube/Recovery/`

with logical categories such as:

- Architecture
- Plans
- Audits
- Implementation
- Governance
- Design
- Deployment
- Data
- YouTube
- Technical
- Handoffs

Do not create empty placeholders.

---

# 12. REQUIRED MASTER RECOVERY INFORMATION

Every Round 1 agent must contribute enough information for the shared system to answer:

### What was found?
### Where did it come from?
### What was actually implemented?
### What was actually verified?
### What remains unverified?
### What documents were created?
### What important responses became documents?
### What successful work was recovered?
### What failures/regressions were discovered?
### What bugs were found?
### What architecture issues were found?
### What new tools or improvements were proposed?
### What dependencies/blockers remain?
### What should the next agent do?

---

# 13. STATUS VOCABULARY

Use these statuses accurately:

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

Never use IMPLEMENTED to mean merely discussed or planned.

For completion of tracked implementation work, require the project's established completion gate: actual implementation, merge to canonical `main`, and verification.

---

# 14. PROVENANCE

Preserve the chain:

`SOURCE → DISCOVERY → DECISION → IMPLEMENTATION → VERIFICATION`

If a stage is unknown, write `UNKNOWN`.

Never fabricate:

- commits;
- branches;
- PRs;
- files;
- tests;
- deployments;
- architecture decisions;
- approvals;
- dates;
- repository contents;
- implementation status.

---

# 15. ROUND 1 WORK-LOG ENTRY

Append a unique entry to `Recovery.md`.

Use:

`LOG-ID: REC-YYYYMMDD-<agent>-<sequence>`

Also create:

`UPDATE-ID: UPDATE-YYYYMMDD-<agent>-<sequence>`

Record:

- exact timestamp in America/New_York;
- EST/EDT offset;
- conversation title when available;
- main focus;
- Round;
- category;
- action;
- source;
- evidence;
- status;
- every file/document added;
- every file/document edited;
- commit SHA(s);
- major discoveries;
- code discoveries;
- optimizations;
- recommended improvements;
- verification;
- blockers;
- next actions.

**The complete file inventory is mandatory.**

Do not use a one-line generic summary as a substitute for this report.

---

# 16. STALE-WRITE PROTECTION

Before changing shared recovery files:

1. fetch the latest file;
2. inspect its current SHA;
3. incorporate all newer entries;
4. append your contribution;
5. write using the current SHA.

If another agent changed the file, re-fetch and merge.

**Never overwrite another agent's Round 1 contribution.**

---

# 17. ROUND 1 OUTPUT

Before finishing, ensure:

1. Every major document has been identified.
2. Every document-equivalent response has been identified.
3. Important information has been converted into durable artifacts.
4. Existing canonical documents were updated rather than duplicated.
5. Findings are status-labeled.
6. Provenance is preserved.
7. The Recovery work-log has a unique entry.
8. Structured state is updated where appropriate.
9. Open questions and blockers are recorded.
10. The complete update report exists.

Then provide a concise final report:

### RECOVERED
### DOCUMENTS CREATED
### DOCUMENTS UPDATED
### DOCUMENT-EQUIVALENT RESPONSES PRESERVED
### SUCCESSFUL WORK
### DISCOVERIES
### BUGS / CODE ISSUES
### OPTIMIZATIONS / NEW TOOL IDEAS
### VERIFICATION
### UNKNOWN / BLOCKED
### NEXT ACTIONS

---

# 18. ROUND 2 OUTPUT

When this prompt is submitted again for Round 2, do not repeat Round 1 blindly.

Instead:

- read all available Round 1 artifacts;
- compare them with this conversation;
- identify duplicates;
- identify contradictions;
- identify missing evidence;
- reconcile current/authoritative versions;
- update canonical documents;
- update Recovery.md and Recovery.yaml;
- preserve reconciliation decisions;
- identify remaining gaps.

The objective of Round 2 is:

**CONVERGE THE RECOVERED PROJECT KNOWLEDGE INTO A CONSISTENT, EVIDENCE-BACKED VIEWTUBE STATE.**

---

# 19. FINAL OPERATING PRINCIPLE

The recovery system must allow a future engineer or ChatGPT agent to continue ViewTube without depending on:

- one suspended GitHub account;
- one conversation;
- one person's memory;
- undocumented assumptions.

The durable chain is:

**CONVERSATION → RECOVERY → ARTIFACT → GITHUB → LEDGER → VERIFICATION → RECONCILIATION → CONTINUATION**

## BEGIN

### ROUND 1
Read the current shared recovery state, then perform the complete forensic recovery of this conversation and contribute the results without prematurely reconciling other agents.

### ROUND 2
Read the complete Round 1 corpus, reconcile evidence, establish authoritative state, and continue ViewTube from the recovered project knowledge.
