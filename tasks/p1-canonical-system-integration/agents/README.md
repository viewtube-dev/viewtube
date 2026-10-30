# P1 Agent Routing and Instructions
**Production Date:** 2026-10-29 | **Last Edited:** 2026-10-29 | **Class:** REFERENCE | **Status:** ACTIVE
**Concern:** multi-agent routing for six P1 integrations | **Owner:** Integrated Application Program

## Roles
Program integrator (sequencing, dependency, receipts); discovery/audit agent (current code/callers/PRs); Brain continuity agent; provider governance agent; diagnostics agent; Priority-25 runtime agent; public resolver agent; Studio Controls agent; independent verification agent. Agents do not own cross-domain truth outside their assigned canonical owner.

## Mandatory sequence
1. Read root AGENTS.md.
2. Read Documentation, Convergence, Task Authority, Verification, Product Completion, Product Architecture and Integrated Application authorities.
3. Load viewtube-document-system and viewtube-convergence-governance skills.
4. Read owning Domain Authority and workstream plan.
5. Search Task Index, capability home, plan family, active PRs/branches, conversation handoffs and current source/tests.
6. Record Existing Work Checked and ownership before edits.
7. Follow TDD for behavior changes; visible UI changes require runtime/screenshot review.
8. Use short-lived branch based on latest target SHA; do not edit target directly; do not use Codespaces.
9. Open focused PR to master/consolidated-feature-integration.
10. Update owning authority/registry and Task Authority proposals only when warranted. Use existing Conversation OS handoff/worklog/review.

## Skills
Verified in target: .claude/skills/viewtube-document-system/SKILL.md; .claude/skills/viewtube-convergence-governance/SKILL.md; .claude/skills/viewtube-youtube-editor-system/SKILL.md (only for editor scope).
Verify presence before loading: viewtube-ai-system-governor; viewtube-prince-brain; viewtube-verification-chancellor; viewtube-toolbox-builder; viewtube-skill-finder; viewtube-source-driven-development; viewtube-conversation-handoff; viewtube-conversation-work-reconciliation.
General engineering: Test-Driven Development. Discover repo commands; write failing focused test before behavior change.

## Plugins/tools
GitHub integration: source/branch/PR/task inspection and review. Browser Use: approved runtime verification. AI Delivery Evidence Checker: independent assessment of claims against supplied code/tests/runtime artifacts. AI App Readiness Checker only if an AI app/agent itself is submitted or certified. Docs AI is optional drafting/review assistance, never repository authority. Do not add plugins as runtime dependencies.

## Prohibited
No duplicate BrainRuntime, gateway, provider/prompt registry, profile/evidence/outcome store, event ledger, diagnostics database, task ledger, public resolver, Studio token/catalog system. No direct provider calls from UI. No private data in public mode. No fabricated runtime proof. No broad mixed-purpose code PR. No destructive cleanup before caller inventory, parity and rollback proof.


## Workstream-specific agent briefs
Every workstream has a self-contained agent brief, audit checklist and test/runtime plan. Start from the relevant folder rather than copying generic role prompts:
- `workstreams/brain-continuity/agent-brief.md`
- `workstreams/gemini-governance/agent-brief.md`
- `workstreams/unified-diagnostics/agent-brief.md`
- `workstreams/priority-25-runtime/agent-brief.md`
- `workstreams/public-resolver/agent-brief.md`
- `workstreams/studio-controls/agent-brief.md`

See [skills and plugin routing](../skills-and-plugins.md) for exact installed skill routes and plugin boundaries. Keep shared-file edits serialized; the six agents must not concurrently mutate global registries, Task Authority, diagnostics contracts or Studio token/emitter ownership.
