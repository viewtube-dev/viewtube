# ViewTube Document History

Repository-wide append-only-style ledger for substantive documentation operations.

## Rules

- Append operations; do not silently rewrite history.
- Use unique IDs: DOC-YYYYMMDD-NNN.
- Record exact America/New_York timestamp with EST or EDT.
- Record action, source, destination, files, commit, summary, preserved information, verification, conflicts, blockers, and follow-up.
- A commit proves a repository write, not implementation or production verification.

## Operation Ledger

| Update ID | Timestamp | Conversation | Agent | Application | Action | Source | Destination | Commit | Summary | Important Information | Verification | Follow-up |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| DOC-20261004-001 | 2026-10-04 19:20:42 EDT | Studio Hub / ViewTube documentation operations | GPT-5.6 Luna | ChatGPT + GitHub | CREATE | docs/Document-System.md; recovery agent rules | docs/recovery/History.md | pending | Created shared document operation ledger. | Future agents have one durable place to record document operations and provenance. | File creation commit will be recorded in the agent receipt. | Update Agent.md to require this ledger for every substantive document operation. |

## Receipt Template

### DOC-YYYYMMDD-NNN

- Timestamp:
- Conversation:
- Agent / model:
- Application / tool:
- Action:
- Reason:
- Source(s):
- Destination(s):
- Files added:
- Files edited:
- Files moved:
- Files merged:
- Files superseded:
- Files archived:
- Commit(s):
- What changed:
- Why:
- Important information preserved:
- Discoveries:
- Conflicts:
- Verification:
- Blockers / unresolved items:
- Recommended follow-up:
- Next agent action:

## Correction Protocol

If an earlier entry is incomplete or inaccurate, add a new correction entry with a new Update ID. Identify the original entry, state the correction, and preserve the original evidence when possible.

## Relationships

- docs/Document-System.md = document lifecycle and operation protocol.
- docs/recovery/Agent.md = agent behavior and ledger requirement.
- docs/recovery/Index.md = recovery navigation.
- Recovery.md and Recovery.yaml = canonical recovery state.
- History.md records operations; it does not replace substantive project knowledge.
