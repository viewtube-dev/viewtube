---
name: viewtube-conversation-handoff
description: Create or update a durable ViewTube handoff when a conversation becomes long, changes owner/phase, moves to a new chat, or contains unfinished work that must survive context loss. Captures completed, in-progress, planned, blocked, discovered and abandoned work without pretending conversation-local status is canonical.
---

# ViewTube Conversation Handoff

Authority:
- `docs/governance/CONVERSATION_HANDOFFS.md`
- `docs/governance/CONVERSATION_OS.md`

Storage:
- `tasks/conversation-intake/<conversation-id>/handoff.md`
- `tasks/conversation-intake/<conversation-id>/worklog.json`
- `tasks/conversation-intake/<conversation-id>/review.md`

## Trigger

Use when:
- user asks for a handoff/new conversation;
- the thread is long enough that context loss/repetition is becoming likely;
- a phase/agent/branch owner is changing;
- substantial unfinished work exists at a stopping point;
- a multi-day effort needs a resumable package.

Do not wait until context is already lost.

## Procedure

1. ORIENT
   - current main SHA;
   - branch/PR;
   - active Mission/Task IDs;
   - owning authorities;
   - current goal.

2. INVENTORY THE ENTIRE CONVERSATION
   Capture meaningful:
   - completed work;
   - in-progress work;
   - unfinished/planned work;
   - bugs/failures/blockers;
   - decisions;
   - rejected/superseded directions;
   - new ideas/opportunities/risks;
   - documentation/skill/workflow/prototype work;
   - files/branches/PRs/artifacts;
   - verification performed and still needed.

3. DISTINGUISH CONVERSATION STATE FROM CANONICAL STATE
   Use terms like `COMPLETED_IN_CONVERSATION`, never infer Task Index DONE.

4. WRITE `handoff.md`
   Use the template in this skill.

5. WRITE `worklog.json`
   One record per meaningful unit of work.
   Preserve both completed and unfinished work.

6. VERIFY
   Check exact paths, branch/PR IDs, important current-main claims and references where practical.

7. SET NEXT ACTION
   Make the first continuation step explicit.

8. MARK RECONCILIATION
   Normally `UNREVIEWED` until the reconciliation skill runs.

## Emergency mode

If context is critically constrained, capture:
goal + repo state + decisions + completed + unfinished + blockers + changed paths + next action + worklog path.

Expand later.

## Do not

- write a second Task Index;
- silently drop completed work;
- summarize away rejected decisions that prevent repetition;
- claim verification that was not performed;
- treat memory as evidence when repo/PR evidence exists;
- promote every idea directly to a task.

## Required extraction and reconciliation

1. Extract every distinct user instruction, request, correction, constraint, preference and prohibition into a stable `REQ-###` register. Preserve corrections and supersession.
2. Link each requirement to related conversation work items, PRs, commits, target branch, delivery state and evidence. Do not create one canonical task per user sentence.
3. Distinguish local implementation, commit, PR inclusion, merge, target presence, application integration and verification.
4. Inspect branch and PR history independently. Record PR-opening SHA when recoverable, current head, post-PR commits/files, target presence and recovery disposition. Mark unknown lineage UNKNOWN.
5. Record feature integration maturity on the existing Task Authority axes: architecture, backend, frontend, integration, tests, runtime, responsive, documentation and release.
6. Record concrete missing connections; component existence or isolated tests do not prove end-to-end integration.
7. Route improvement ideas and next-best-action recommendations through existing Conversation OS, Ideas Registry, improvement recommendations, Task Authority and Crown records. Do not create parallel backlogs or mutate canonical task state.
8. Keep the package open until instruction, branch/PR, integration and work-item reconciliation is complete or explicitly marked unknown/blocked.
