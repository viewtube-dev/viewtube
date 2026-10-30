# ViewTube Conversation Intake

**Production Date:** 2026-09-27  
**Last Edited:** 2026-10-29

This directory is the governed staging/provenance workspace for long-conversation handoffs and work reconciliation. Each handoff is also the human-readable living unfinished-work log. Open an existing handoff link and say **“Update the unfinished work log.”** to update its package in place; do not create a duplicate.

It is **not** Task Index and does not own canonical work status.

## Per-conversation structure

```text
tasks/conversation-intake/<conversation-id>/
├── handoff.md
├── worklog.json
└── review.md
```

### handoff.md
Human-readable living continuation log with conversation identity, at-most-ten-sentence summary, single-line instruction/unfinished-work checkboxes, artifact links and next action.

### worklog.json
Comprehensive inventory of planned, started, partial, completed, blocked, abandoned and discovered work from the conversation.

### review.md
Human/agent reconciliation report showing how each work item was valued, deduplicated and routed.

## Lifecycle

```text
OPEN CONVERSATION
→ HANDOFF CREATED
→ WORK LOG CAPTURED
→ REVIEWING
→ PARTIALLY RECONCILED
→ RECONCILED
→ RETAIN / ARCHIVE
```

## Closure

A package is reconciled only when every work item has a disposition and canonical target or explicit no-action/reject/archive result.

Use:
- `.claude/skills/viewtube-conversation-handoff/SKILL.md`
- `.claude/skills/viewtube-conversation-work-reconciliation/SKILL.md`
- `docs/governance/CONVERSATION_HANDOFFS.md`


## Required completion pass

Before calling a package complete, follow the ten-step execution sequence and completion checklist in `docs/governance/CONVERSATION_HANDOFFS.md`. Update the existing package in place for follow-up work. Keep its status PARTIALLY_RECONCILED until every item has a disposition and the applicable document/verification gates have evidence.