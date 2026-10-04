# VIEWTUBE — GITHUB SUSPENSION / MULTI-CONVERSATION RECOVERY PROTOCOL

## PURPOSE

This conversation is one agent in a coordinated ViewTube recovery operation.

The original GitHub account used for ViewTube has been suspended. The repository may be inaccessible, moved, recovered under a new account, or reconstructed from surviving sources.

Your job is to recover and preserve the useful work contained in THIS conversation while also contributing your findings to a shared recovery record that other ChatGPT conversations can read.

This is NOT a generic summarization task.

Treat the conversation as a project archive and perform a forensic recovery pass.

---

# SHARED RECOVERY FILES

The canonical shared artifacts are:

1. `VIEWTUBE_MULTI_CONVERSATION_RECOVERY_PROTOCOL_2026-10-02.md`
   - This file: the instructions you are reading.

2. `VIEWTUBE_MULTI_CONVERSATION_RECOVERY_LEDGER_2026-10-02.md`
   - Shared cross-conversation status and knowledge ledger.
   - Read it BEFORE doing recovery work.
   - Update it AFTER completing your first-round recovery.
   - Do not erase another agent's findings.

3. `VIEWTUBE_CONVERSATION_RECOVERY_INDEX_2026-10-02.md`
   - Conversation-specific recovery index created/updated by this agent.
   - If it already exists, update rather than replacing useful prior information.

These files are stored in the ChatGPT Library under:

`/ViewTube/Recovery/`

If the Library search interface does not expose a direct clickable URL, search the exact filenames above. The Library artifact itself is the shared handoff mechanism.

---

# OPERATING MODEL

There are TWO recovery rounds.

## ROUND 1 — INDIVIDUAL CONVERSATION RECOVERY

Each conversation independently:

- reads the shared ledger;
- inventories its own conversation;
- extracts documents and document-equivalent responses;
- recovers technical knowledge;
- identifies successful work;
- records failures and unresolved work;
- creates durable artifacts;
- updates the shared ledger.

Do NOT attempt to reconcile every other conversation during Round 1.

Your primary responsibility is to preserve everything useful from THIS conversation.

## ROUND 2 — CROSS-CONVERSATION RECONCILIATION

After all Round 1 agents have updated the shared ledger, this same protocol is submitted again to the conversations.

Round 2 agents must:

- reread the complete shared ledger;
- inspect relevant artifacts created by other conversations;
- identify duplicates;
- reconcile conflicting versions;
- identify authoritative/current versions;
- identify missing information;
- connect related plans, audits, discoveries, and implementation work;
- update the master recovery architecture;
- produce consolidated artifacts.

Do not assume Round 1 information is authoritative merely because another agent recorded it.

---

# CRITICAL RULE: PRESERVE, DON'T GUESS

Never fabricate:

- GitHub commits
- branches
- PRs
- file paths
- URLs
- implementation status
- test results
- deployment state
- architecture decisions
- approvals
- repository contents
- dates
- code changes

Classify information as:

- VERIFIED — directly confirmed by an authoritative source
- REPORTED — stated in the conversation but not independently verified
- INFERRED — reasoned from evidence
- PROPOSED — planned but not implemented
- IMPLEMENTED — actually completed
- VERIFIED IMPLEMENTATION — implemented and independently verified
- FAILED — attempted and failed
- BLOCKED — cannot continue because of a dependency
- SUPERSEDED — replaced by later work
- UNKNOWN — cannot currently be established

Preserve uncertainty.

---

# 1. FORENSIC INVENTORY

Inspect the ENTIRE conversation.

Identify:

### Explicit documents
Every document, markdown file, specification, plan, audit, handoff, report, prompt, matrix, schema, or other artifact explicitly created.

For each record:

- title
- filename/path
- type
- purpose
- status
- source
- dependencies
- whether it was saved/exported
- whether it should be preserved

### Document-equivalent responses

Identify assistant responses that effectively function as documents even if they were never saved.

Examples:

- architecture specifications
- implementation plans
- technical designs
- audits
- findings
- governance rules
- recovery procedures
- design-system definitions
- deployment diagnoses
- decision records
- handoffs

Convert important ones into durable artifacts.

---

# 2. TECHNICAL RECOVERY

Extract exact information about:

- GitHub repository
- repository URLs
- branches
- commit SHAs
- pull requests
- file paths
- source files
- patches/diffs
- code changes
- tests
- test results
- builds
- deployments
- Render services
- Vercel services
- package/dependency changes
- environment/configuration findings
- integrations
- APIs
- external services
- scripts
- commands

Preserve exact identifiers.

---

# 3. VIEWTUBE PROJECT CATEGORIES

Organize findings into the relevant categories below. Add categories when the conversation contains material that does not fit.

### Core Application
- ViewTube application
- routing
- pages
- layouts
- state
- shared infrastructure

### Toolbox / UI System
- Toolbox
- SubToolbox
- Widget system
- Dashboard UI
- UI primitives
- component contracts
- CSS
- design tokens
- sizing
- responsive behavior
- accessibility
- visual reference library

### Asset / Media Systems
- Asset Engine
- Resource Library
- asset inspection
- image/video/audio tools
- metadata / EXIF
- technical media information
- lineage / provenance
- rights / usage
- derivatives
- transformations

### Projects / Content
- Projects
- ContentBuild
- content workflows
- project structures
- publishing workflows
- asset relationships

### Analytics / Data
- Analytics
- VT Sync
- master data tables
- schemas
- metrics
- KPI definitions
- mock data
- analytics UI
- dashboards
- data quality

### YouTube / Creator Systems
When applicable, preserve:
- YouTube channel data
- videos
- Shorts
- playlists
- livestreams
- comments
- thumbnails
- titles
- descriptions
- tags/metadata
- channel analytics
- audience data
- creator workflows
- publishing workflows
- monetization-related information
- YouTube API integration
- YouTube-specific categories/classifications
- video/content taxonomy
- content performance analysis
- competitor/reference-channel research
- YouTube ingestion/sync architecture

Do NOT invent YouTube data that is not present in the conversation.

### Governance / Development
- Conversation OS
- governance
- implementation rules
- task matrices
- quick wins
- approval gates
- testing rules
- merge requirements
- branch strategy
- recovery procedures

### Deployment / Operations
- Render
- Vercel
- CI/CD
- deployment environments
- build failures
- runtime failures
- logs
- monitoring
- infrastructure

### Other
Create additional categories where appropriate.

---

# 4. SUCCESSFUL WORK HAS HIGH PRIORITY

Explicitly identify work that was actually accomplished.

Examples:

- code fixes
- created files
- merged changes
- passing tests
- successful builds
- successful deployments
- completed audits
- established architecture
- completed data models
- implemented workflows
- resolved bugs
- verified behavior

Preserve successful work even if later superseded.

---

# 5. FAILURES AND DISCOVERIES ALSO MATTER

Record:

- failures
- regressions
- architectural problems
- rejected approaches
- causes discovered
- debugging findings
- dependency problems
- export/import problems
- deployment problems
- account/repository problems
- important negative results

Explain why each matters to recovery.

---

# 6. DECISIONS AND APPROVALS

Recover:

- explicit user decisions
- approvals
- rejected proposals
- constraints
- priorities
- design choices
- architectural decisions
- governance decisions

Distinguish a user-approved decision from an assistant suggestion.

---

# 7. CREATE DURABLE ARTIFACTS

Create the actual documents in the ChatGPT Library where possible.

Use:

`/ViewTube/Recovery/`

Suggested structure:

- `/ViewTube/Recovery/Index/`
- `/ViewTube/Recovery/Architecture/`
- `/ViewTube/Recovery/Plans/`
- `/ViewTube/Recovery/Audits/`
- `/ViewTube/Recovery/Implementation/`
- `/ViewTube/Recovery/Governance/`
- `/ViewTube/Recovery/Design/`
- `/ViewTube/Recovery/Deployment/`
- `/ViewTube/Recovery/Data/`
- `/ViewTube/Recovery/YouTube/`
- `/ViewTube/Recovery/Handoffs/`
- `/ViewTube/Recovery/Technical/`

Do not create meaningless placeholders.

Use original filenames when known.

If unknown:

`VIEWTUBE_<SUBJECT>_<TYPE>_RECOVERY_2026-10-02.md`

---

# 8. MASTER RECOVERY INDEX

Create or update:

`VIEWTUBE_CONVERSATION_RECOVERY_INDEX_2026-10-02.md`

Include:

1. Conversation identity
2. Recovery timestamp
3. Documents recovered
4. Document-equivalent responses
5. Architecture knowledge
6. Technical implementation
7. Successful work
8. Audits
9. Discoveries
10. Plans
11. GitHub history
12. Deployment history
13. Tests / verification
14. Failures
15. Open work
16. Conflicts
17. Unknowns
18. Recovery recommendations
19. Artifact inventory
20. Cross-references

---

# 9. UPDATE THE SHARED LEDGER

Before updating it:

1. Read the latest version.
2. Preserve existing entries.
3. Determine what THIS conversation uniquely contributes.
4. Add your findings under a uniquely identifiable agent/conversation section.
5. Do not silently rewrite another conversation's findings.
6. If you disagree with another entry, record the disagreement and evidence.

Use an entry like:

`AGENT: <short conversation identifier>`
`ROUND: 1`
`DATE: 2026-10-02`

Then include:

- recovered documents
- new artifacts
- important discoveries
- successful work
- failed work
- technical identifiers
- open issues
- dependencies
- conflicts
- recommended follow-up

---

# 10. SHARED LEDGER IS A COORDINATION BUS

The ledger is not merely a report.

It is the cross-conversation coordination mechanism.

Every agent should:

READ → ANALYZE → CONTRIBUTE → PRESERVE → RE-READ IF NECESSARY

Do not assume another conversation will see your chat history.

Put important cross-conversation information into the shared ledger and durable artifacts.

---

# 11. SAFE CONCURRENT EDITING

Multiple conversations may attempt to update the ledger.

Therefore:

- append rather than replace;
- use unique agent sections;
- never delete another agent's contribution;
- never overwrite a newer version with an older copy;
- preserve timestamps;
- preserve conflicting versions until reconciled;
- if simultaneous editing cannot be safely performed, create a clearly named contribution artifact and record that the contribution needs ledger consolidation.

---

# 12. ROUND 2 RULES

When this prompt is submitted again after Round 1:

DO NOT simply repeat your Round 1 work.

Instead:

1. Read the shared ledger from the beginning.
2. Read relevant artifacts created by other agents.
3. Compare their findings with this conversation.
4. Identify overlap.
5. Identify contradictions.
6. Identify missing pieces.
7. Establish provenance.
8. Consolidate related artifacts.
9. Update authoritative/current status.
10. Create reconciliation documents where necessary.

Round 2 is where the project knowledge begins to become a coherent recovery corpus.

---

# 13. RECOVERY PRIORITY

Prioritize information in this order:

1. Actual successful code/implementation
2. Verified architecture
3. Verified tests/builds/deployments
4. Existing project documents
5. Explicit user-approved decisions
6. Technical discoveries
7. Detailed implementation plans
8. Audits and findings
9. Unimplemented proposals
10. General discussion

Do not discard lower-priority information if it may explain higher-priority artifacts.

---

# 14. FINAL REPORT

At the end of this conversation's recovery pass, report:

## RECOVERED
What was preserved.

## ARTIFACTS CREATED
Every artifact created.

## SHARED LEDGER CONTRIBUTIONS
What was added for other conversations.

## IMPORTANT TECHNICAL FINDINGS
Key repository/code/deployment discoveries.

## SUCCESSFUL WORK
What was actually accomplished.

## FAILURES / REGRESSIONS
What went wrong and what was learned.

## UNKNOWN / UNVERIFIED
What requires external verification.

## ROUND 2 INPUT
What later agents should specifically investigate.

---

# FINAL OPERATING PRINCIPLE

The objective is to make ViewTube recoverable without relying on the suspended GitHub account or on memory of individual conversations.

Preserve the project's:

- code knowledge
- architecture
- documents
- decisions
- successful work
- failures
- discoveries
- plans
- audits
- UI system
- data system
- YouTube/creator information
- deployment knowledge
- governance
- workflows

The end state should allow a future engineer or ChatGPT agent to reconstruct and continue ViewTube from the recovery corpus.

BEGIN ROUND 1 RECOVERY NOW.
---

## Repository Canonicalization Addendum

This source document is preserved as an independent source artifact. The live cross-conversation coordination copy is `Recovery` at the repository root. Agents should update the canonical repository copy and register durable artifacts in `docs/recovery/`; do not rely on the ChatGPT Library as the sole handoff mechanism.
