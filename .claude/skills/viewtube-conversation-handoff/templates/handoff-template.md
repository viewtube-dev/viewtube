# Unfinished Work — Living Conversation Log

> **Update instruction:** Open this document and say **“Update the unfinished work log.”** Update this existing document and its matching `worklog.json` / `review.md` in place. Do not create a duplicate log. Preserve prior entries and link every new artifact.

**Conversation date:** YYYY-MM-DD  
**Conversation name:**  
**Application / product:**  
**Source application:** ChatGPT / Codex / Claude / Other  
**Source conversation link:** [link or UNKNOWN]  
**Repository:**  
**Intended target branch:**  
**Last updated:** YYYY-MM-DD  
**Package status:** UNREVIEWED / PARTIALLY_RECONCILED / RECONCILED / CLOSED

## Ten facts to resume safely

Write no more than ten short, factual sentences. Include the goal, current repository state, verified completion, unmerged/local work, key user constraints, integration gaps, blockers, canonical authorities and exact next action.

1. 
2. 
3. 
4. 
5. 
6. 
7. 
8. 
9. 
10. 

## Unfinished work — single-line checklist

Every meaningful unfinished action gets one concise line. Keep each checkbox on one line and include the work ID, truthful status, relevant PR/commit and next action.

- [ ] `CWI-001` — [unfinished action] — [status] — [PR / commit / N/A] — Next: [specific action]

## Complete user instruction register

Record every distinct user instruction, request, correction, constraint, preference and prohibition separately. Do not collapse materially different requests.

| ID | User instruction / requirement | Status | Related work item | PR(s) / commit(s) | Delivery state | Evidence |
|---|---|---|---|---|---|---|
| REQ-001 | | NOT_STARTED | | | UNKNOWN | |

Allowed statuses: NOT_STARTED, IN_PROGRESS, PARTIAL, IMPLEMENTED_LOCALLY, COMMITTED, IN_PR, MERGED, VERIFIED_DELIVERED, BLOCKED, DEFERRED, REJECTED_WITH_REASON, SUPERSEDED_WITH_REFERENCE.

A merged PR is not proof of application integration or acceptance. Link all contributing PRs and commits; use UNKNOWN when evidence is unavailable.

## Links to documents created or changed

Link every document, code artifact, prototype, report, test, PR, commit and deployment artifact created or materially updated in this conversation. Do not invent URLs.

| Artifact | Type | Repository path / URL | Status | Related work |
|---|---|---|---|---|
| | | | | |

## Work and delivery register

| Work ID | Work | Kind | Conversation state | Canonical destination | Priority | Next action |
|---|---|---|---|---|---|---|

## Branch and PR reconciliation

Inspect branch history and PR history independently. Capture opening head SHA when recoverable, current head, post-opening commits/files, merge SHA, target presence and recovery disposition. Preserve unique post-PR work. Unknown lineage remains UNKNOWN.

| Branch | Target | PR | Opened SHA | Current SHA | Post-PR work | Merge SHA | Target presence | Classification |
|---|---|---|---|---|---|---|---|---|

## Feature and application integration gaps

Use Task Authority's nine maturity axes and existing vocabulary: architecture, backend, frontend, integration, tests, runtime, responsive, documentation and release. Do not invent a completion percentage.

| Feature | Architecture | Backend | Frontend | Integration | Tests | Runtime | Responsive | Documentation | Release | Concrete gap / acceptance evidence |
|---|---|---|---|---|---|---|---|---|---|---|

Track components without application entry points, missing UI/frontend, disconnected backend/API, authorization, persistence, workflow feedback and runtime proof.

## Decisions, failures, blockers and risks

| ID | Decision / failure / blocker / risk | Reason or impact | Evidence | Next action |
|---|---|---|---|---|

## Five best finishing and improvement ideas

Provide exactly five useful proposals when evidence supports five; otherwise state why fewer are justified. Route proposals through the existing Ideas Registry / improvement recommendations. Do not create a parallel backlog or treat proposals as approved work.

1. **Idea:** — **Benefit:** — **Existing owner:** — **Effort/risk:** — **Disposition:** PROPOSED
2. **Idea:** — **Benefit:** — **Existing owner:** — **Effort/risk:** — **Disposition:** PROPOSED
3. **Idea:** — **Benefit:** — **Existing owner:** — **Effort/risk:** — **Disposition:** PROPOSED
4. **Idea:** — **Benefit:** — **Existing owner:** — **Effort/risk:** — **Disposition:** PROPOSED
5. **Idea:** — **Benefit:** — **Existing owner:** — **Effort/risk:** — **Disposition:** PROPOSED

## Exact next action

**Action:**  
**Reason:**  
**Expected outcome:**  
**Canonical task / mission:**  
**Required branch:**  
**Acceptance criteria:**  
**Verification evidence:**  

## Package links

- Handoff: `tasks/conversation-intake/<conversation-id>/handoff.md`
- Worklog: `tasks/conversation-intake/<conversation-id>/worklog.json`
- Review: `tasks/conversation-intake/<conversation-id>/review.md`

## Closure checklist

- [ ] Every distinct user instruction is registered.
- [ ] Every unfinished item has a single-line checkbox and next action.
- [ ] All created/changed artifacts are linked.
- [ ] Branches, PRs and post-PR work are reconciled.
- [ ] Integration gaps use the existing maturity axes.
- [ ] Decisions, corrections, failures and blockers are preserved.
- [ ] Five improvement ideas are evaluated and routed through existing authorities.
- [ ] Required tests and runtime evidence are recorded truthfully.
- [ ] No competing Task Index, backlog or idea registry was created.
- [ ] Review is reconciled or the remaining blockers are explicit.

**Full normative contract:** `docs/governance/CONVERSATION_HANDOFFS.md`.
