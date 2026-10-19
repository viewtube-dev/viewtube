# ViewTube Sync

**Purpose:** Self-contained activation prompt for any ViewTube conversation, including a completely new AI conversation with no prior knowledge of ViewTube or its GitHub documentation system.

## Canonical activation phrase

> **VIEWTUBE SYNC — GO TO GITHUB**

This phrase is intentionally self-contained. It tells an unfamiliar AI conversation where to go and which file to open.

## What the activation phrase means

When a conversation receives:

**VIEWTUBE SYNC — GO TO GITHUB**

it MUST treat the phrase as an instruction to visit the canonical ViewTube GitHub repository first, open this exact file, and follow the complete protocol:

https://github.com/viewtube-dev/viewtube/blob/main/docs/recovery/Sync.md

Do **not** assume prior knowledge of ViewTube. Do **not** assume the conversation already knows what “VIEWTUBE SYNC” means. Do **not** substitute a remembered summary for reading the current GitHub instructions.

## Fresh-conversation bootstrap

Upon receiving the activation phrase:

1. Go directly to the canonical repository: https://github.com/viewtube-dev/viewtube
2. Use the main branch unless the current protocol explicitly identifies another branch for a specific operation.
3. Open this exact file: docs/recovery/Sync.md
4. Read this file completely.
5. Follow the current instructions in this file and load the required canonical system files below.
6. If GitHub/repository access is unavailable, explicitly report that synchronization cannot be verified. Do not pretend the protocol was loaded.

## Required canonical system files

Read the current main versions of:

- Recovery.md
- Recovery.yaml
- docs/Index.md
- docs/Organization.md
- docs/Document-System.md
- docs/Document-Health.md
- docs/recovery/Index.md
- docs/recovery/Agent.md
- docs/recovery/History.md

Then follow their applicable instructions.

## Authority of the loaded files

- Recovery.md = human-readable canonical recovery/operations state.
- Recovery.yaml = machine-readable canonical recovery state.
- docs/Index.md = top-level documentation navigation.
- docs/Organization.md = repository organization and consolidation strategy.
- docs/Document-System.md = canonical document lifecycle and operation standard.
- docs/Document-Health.md = document health, migration, reconciliation, and cleanup gates.
- docs/recovery/Index.md = recovery/knowledge navigation.
- docs/recovery/Agent.md = detailed recovery-agent operating protocol.
- docs/recovery/History.md = durable document-operation ledger.

## Synchronization work

After loading the canonical system:

1. Review the entire current conversation, not merely the latest messages.
2. Preserve important project knowledge, including:
   - documents and artifacts
   - substantive assistant responses
   - decisions and approvals
   - plans and audits
   - discoveries and research
   - bugs and code-structure issues
   - architecture and implementation information
   - UI/design/system decisions
   - tool and new-tool ideas
   - workflow and handoff improvements
   - AI/Brain improvements
   - UX/product improvements
   - optimizations and performance opportunities
   - security/reliability issues
   - data/model findings
   - testing and verification findings
   - unresolved questions, conflicts, and blockers
3. Map each item to the current canonical documentation structure.
4. Update the existing canonical authority when one exists.
5. Consolidate overlapping knowledge instead of creating competing sources of truth.
6. Create a new document only when no suitable canonical owner exists.
7. Preserve unique historical evidence, provenance, conflicts, uncertainty, and verification status.
8. Inspect the current GitHub file content and blob SHA before changing any existing file.
9. Verify every substantive repository change after writing it.
10. Record every substantive document operation in docs/recovery/History.md with a unique DOC-YYYYMMDD-NNN receipt and exact America/New_York timestamp including EST/EDT.
11. Follow the detailed completion requirements in Agent.md, Document-System.md, and Document-Health.md.

## Completion gate

SYNCHRONIZE
→ GO TO GITHUB
→ OPEN docs/recovery/Sync.md
→ READ CANONICAL SYSTEM
→ REVIEW ENTIRE CONVERSATION
→ CLASSIFY KNOWLEDGE
→ PRESERVE
→ UPDATE / CONSOLIDATE / CREATE
→ VERIFY
→ HISTORY RECEIPT
→ RECOVERY REGISTRATION
→ HANDOFF

## Safety rules

- main is the canonical working branch.
- recovery/pre-document-system-migration-2026-10-04 is the pre-migration safety snapshot, not a competing source of truth.
- Never silently delete substantive knowledge.
- Never assume an unchecked condition is healthy; mark it UNKNOWN.
- Do not claim implementation, merge, deployment, or production verification without evidence.
- Do not perform destructive cleanup until the Document Health migration gates have passed.
- Do not treat a chat response, branch, PR, or commit alone as proof of implementation or production verification.

## Final receipt

After synchronization, report:

- UPDATE-ID
- exact Eastern timestamp with EST/EDT
- conversation title
- main focus
- files added/edited/moved/merged/superseded
- commits
- discoveries
- code discoveries
- optimizations
- recommended improvements
- conflicts
- verification
- blockers
- next actions

Also explicitly review and report on:

- bugs
- code-structure problems
- tool ideas
- new tools
- workflow/handoff improvements
- AI improvements
- UX improvements
- performance opportunities
- security/reliability issues
- data improvements
- testing improvements

If a category has no findings, state that it was reviewed and none were identified. Do not invent findings.

## Short internal shorthand

Once a conversation has already loaded this file, VIEWTUBE SYNC may be used as shorthand for the same protocol.

For a completely unfamiliar conversation, use the full self-contained activation phrase:

**VIEWTUBE SYNC — GO TO GITHUB**

That phrase is the recommended cross-conversation activation command because it explicitly tells a fresh AI where to begin.