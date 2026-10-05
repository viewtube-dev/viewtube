# ViewTube Recovery & Knowledge Index

**Goal:** one shallow, easy-to-navigate knowledge system. Keep the number of folders and competing documents low.

## Start here

| File | Purpose |
|---|---|
| `Recovery.md` | Master recovery state, rules, provenance, work log |
| `Recovery.yaml` | Machine-readable recovery state |
| `docs/recovery/Index.md` | This map |
| `docs/recovery/Agent.md` | Full agent activation instructions |
| `docs/recovery/Playbook.md` | Operational recovery procedure |
| `docs/recovery/Knowledge.md` | How ViewTube knowledge is captured and organized |
| `docs/recovery/Findings.md` | Bugs, discoveries, issues, ideas, opportunities |
| `docs/recovery/Handoff.md` | Standard continuation/handoff format |

## Simple structure

```
Recovery.md
Recovery.yaml
docs/
  recovery/
    Index.md
    Agent.md
    Playbook.md
    Knowledge.md
    Findings.md
    Handoff.md
    [project knowledge and historical recovery records]
```

**No routine nested folders are required.** Keep recovery artifacts flat under `docs/recovery/`.

## What belongs where

- **Recovery:** project-wide recovery state and coordination.
- **Agent:** instructions every conversation agent follows.
- **Playbook:** step-by-step operating procedure.
- **Knowledge:** documentation architecture and optimization method.
- **Findings:** bugs, code issues, tool ideas, new tools, workflow/handoff improvements, AI improvements, UX, performance, security, data, and testing findings.
- **Handoff:** reusable continuation template.
- **Other recovery files:** source evidence, detailed plans, audits, design/architecture records, implementation records, and conversation recoveries. Give them short descriptive names.

## Naming rules

Use **short, descriptive, stable names**.

Preferred:
- `Toolbox.md`
- `Architecture.md`
- `Widgets.md`
- `UI.md`
- `AI.md`
- `Account.md`
- `Analytics.md`
- `Plan-Toolbox.md`
- `Audit-Exports.md`
- `Handoff-Toolbox.md`

Avoid:
- repeated `VIEWTUBE_` prefixes
- repeated `2026-10-04` in the filename unless the date is essential to distinguish historical records
- long all-caps filenames
- nested category folders for small numbers of documents
- duplicate documents with overlapping authority

## Classification rule

The **file name says what it is**; the document metadata says status, source, date, owner, and provenance.

Use prefixes only when useful:
- `Plan-`
- `Audit-`
- `Handoff-`
- `Source-`

Do not encode every metadata field into the filename.

## Consolidation rule

Before creating a file:
1. Check this index.
2. Search for an existing owner of the subject.
3. Update or consolidate the existing document when possible.
4. Create a new document only when the knowledge has no suitable owner.
5. Preserve historical evidence without allowing it to become a competing source of truth.

## Knowledge flow

**Evidence → Finding → Knowledge → Decision → Plan → Implementation → Verification → Handoff**

The system optimizes for **clarity, reuse, low duplication, and easy agent navigation**, not maximum document count.

## Document operations

- `docs/Document-System.md` — canonical document lifecycle, editing, merging, restructuring, provenance, verification, and quality standard.
- `docs/Document-Health.md` — health checks, reconciliation, migration gates, and non-destructive audit rules.
- `docs/recovery/History.md` — shared append-only-style operation ledger for substantive document changes.

**Agent rule:** every substantive document operation must update History.md after verification.


## Current conversation recoveries

- [Handoff-Tool-Copy-Knowledge.md](Handoff-Tool-Copy-Knowledge.md) — Round 1 recovery of the tool/widget copy workstream, contextual ? / Learn More model, inventory correction, historical artifacts, findings, and unresolved reconciliation work.

- [Handoff-Widget-UI-Governance-2026-10-04.md](Handoff-Widget-UI-Governance-2026-10-04.md) — preserves the Widget UI Reference Library, default-size, audit-classification, and implementation-routing decisions from the 2026-10-04 conversation.
