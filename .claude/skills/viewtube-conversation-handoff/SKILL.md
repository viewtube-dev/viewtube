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

## Living-log update shortcut

When a user provides a handoff/document link and says **“Update the unfinished work log.”**, resolve the linked existing conversation package and update its `handoff.md`, `worklog.json` and `review.md` in place. Preserve prior history, add individual instruction/work/evidence records, and link every new artifact. Do not create a second living log or duplicate package unless the user is explicitly starting a different conversation.

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
   - inspect current target branch and SHA;
   - identify active branch/PR, Mission/Task IDs and owning authorities;
   - establish the user's current goal.

2. INVENTORY THE ENTIRE CONVERSATION
   Capture completed, in-progress, unfinished, planned, blocked, abandoned and discovered work; decisions; corrections; rejected directions; bugs; failures; ideas; artifacts; branches; PRs; commits; and verification.

3. BUILD THE COMPLETE USER INSTRUCTION REGISTER
   - record every distinct user instruction, request, correction, constraint, preference and prohibition;
   - assign a stable `REQ-###` identifier to each;
   - preserve corrections and supersession links;
   - link requirements to work items, branches, PRs, commits, target branch and evidence;
   - do not create one canonical task per user sentence.

4. RECONCILE BRANCH AND PR HISTORY
   - inspect branch history separately from PR history;
   - capture PR-opening head SHA when recoverable;
   - identify current branch head, post-PR commits and changed paths;
   - record merge commit, target-branch presence, recovery destination and verification;
   - classify unmerged, partial, post-PR, recovered, duplicate, conflicted, missing and unknown states;
   - mark unavailable lineage UNKNOWN rather than guessing.

5. DISTINGUISH CONVERSATION STATE FROM CANONICAL STATE
   Use terms like `COMPLETED_IN_CONVERSATION`, never infer Task Index DONE. Separate local implementation, commit, PR inclusion, merge, target presence, application integration and verification.

6. WRITE `handoff.md`
   Use the template in this skill. Include the readable checkbox instruction register, completed/unfinished work, branch/PR reconciliation, integration gaps, artifacts, blockers and exact next action.

7. WRITE `worklog.json`
   - one record per meaningful unit of work;
   - use the top-level `instructions`, `branchPrReconciliation` and `integrationGaps` collections where applicable;
   - preserve completed and unfinished work;
   - use the existing Task Authority maturity axes and vocabulary.

8. VERIFY
   Check exact paths, branch/PR IDs, post-PR changes, target-branch presence, schema compatibility, evidence references and feature integration claims. Component existence or isolated tests do not prove end-to-end integration.

9. SET NEXT ACTION
   Derive the next action from canonical tasks, Crown missions/work orders, dependencies, blockers and verification receipts. Route improvement proposals through existing Ideas Registry and improvement recommendations. Do not create parallel backlogs or mutate canonical task state.

10. MARK RECONCILIATION
   Normally `UNREVIEWED` until the reconciliation skill runs. Keep the package open while requirements, branch/PR history, integration gaps or work items remain unresolved.
   
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

