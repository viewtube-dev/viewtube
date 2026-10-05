# ViewTube Sync

**Purpose:** Short activation prompt for any ViewTube conversation.

## Canonical activation phrase

> **VIEWTUBE SYNC**

When a conversation receives the phrase **VIEWTUBE SYNC**, it must treat this file as a command to load and execute the current ViewTube documentation/recovery system from GitHub.

## Required behavior

Do not treat “VIEWTUBE SYNC” as a request for a summary. It is an activation command.

Upon receiving it:

1. Open the canonical repository:
   `https://github.com/viewtube-dev/viewtube`
2. Read the current `main` versions of:
   - `Recovery.md`
   - `Recovery.yaml`
   - `docs/Index.md`
   - `docs/Organization.md`
   - `docs/Document-System.md`
   - `docs/Document-Health.md`
   - `docs/recovery/Index.md`
   - `docs/recovery/Agent.md`
   - `docs/recovery/History.md`
3. Treat `docs/recovery/Agent.md` as the detailed agent operating protocol.
4. Treat `docs/Document-System.md` as the document-operation standard.
5. Treat `docs/Document-Health.md` as the migration/reconciliation and health standard.
6. Review the entire current conversation, not merely the latest messages.
7. Identify all important ViewTube knowledge in the conversation: documents, substantive responses, decisions, plans, audits, discoveries, bugs, architecture, UI, code/implementation information, tool ideas, workflow improvements, AI improvements, UX ideas, optimizations, risks, testing findings, and unresolved questions.
8. Map that knowledge to the current canonical documentation system.
9. Update an existing canonical document when one exists; consolidate overlapping material rather than creating competing sources of truth.
10. Create a new document only when no suitable canonical owner exists.
11. Preserve unique historical evidence, provenance, conflicts, uncertainty, and verification status.
12. Inspect current GitHub content and blob SHA before changing a file.
13. Verify every substantive change after writing it.
14. Record every substantive document operation in `docs/recovery/History.md` using a unique `DOC-YYYYMMDD-NNN` receipt with the required exact Eastern timestamp and operation details.
15. Follow the completion gate:

```
SYNCHRONIZE
→ READ CANONICAL SYSTEM
→ REVIEW CONVERSATION
→ CLASSIFY KNOWLEDGE
→ PRESERVE
→ UPDATE / CONSOLIDATE / CREATE
→ VERIFY
→ HISTORY RECEIPT
→ RECOVERY REGISTRATION
→ HANDOFF
```

## Safety rules

- `main` is the canonical working branch.
- `recovery/pre-document-system-migration-2026-10-04` is the pre-migration safety snapshot, not a competing source of truth.
- Never silently delete substantive knowledge.
- Never assume an unchecked condition is healthy; mark it `UNKNOWN`.
- Do not claim implementation, merge, deployment, or production verification without evidence.
- Do not perform destructive cleanup until the Document Health migration gates have passed.

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

Also review and report on bugs, code-structure problems, tool ideas, new tools, workflow/handoff improvements, AI improvements, UX improvements, performance opportunities, security/reliability issues, data improvements, and testing improvements. Do not invent findings.

## One-line activation

In a ViewTube conversation, the intended shorthand is simply:

**VIEWTUBE SYNC**

That phrase means: **read this GitHub prompt and execute the complete current ViewTube synchronization/documentation protocol.**
