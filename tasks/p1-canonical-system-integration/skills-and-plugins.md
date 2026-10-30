# P1 Skills and Plugin Routing Index
**Class:** REFERENCE | **Status:** ACTIVE | **Last edited:** 2026-10-30

This is a routing index, not a repository skill installation or a runtime dependency. Load a skill's full instructions before using it. Repository-local skills and governance remain authoritative over generic plugin guidance.

## Mandatory baseline for all six workstreams
- `viewtube-document-system` and `viewtube-convergence-governance` repository skills.
- `superpowers/using-superpowers` at session start; `superpowers/writing-plans` for multi-step work.
- `agent-skills/test-driven-development` or `superpowers/test-driven-development` before any behavior change.
- `superpowers/verification-before-completion` before completion claims.
- `matt-skills-curated/code-review` or `superpowers/requesting-code-review` before merge.
- `codex-dev-workflows/session-handoff` when handing work to another agent/session.
- `matt-skills-curated/engineering-workflow-guide` when routing a cross-discipline task.

## Workstream-specific routing

| Workstream | Primary skills | Specialist skills | Plugins / tools |
|---|---|---|---|
| Brain continuity | TDD; AI engineering; domain modeling; codebase design | systematic debugging; comprehensive QA; code review; orchestrate-work | GitHub; Browser Use; AI Delivery Evidence Checker; AI App Readiness Checker only for formal AI-app certification |
| Gemini governance | TDD; AI engineering; doubt-driven development | security review; systematic debugging; code review; verification-before-completion | GitHub; Browser Use; AI Delivery Evidence Checker; AI App Readiness Checker when relevant |
| Unified diagnostics | TDD; domain modeling; codebase design | systematic debugging; comprehensive QA; code review | GitHub; Browser Use; AI Delivery Evidence Checker; Docs AI drafting only |
| Priority-25 runtime | spec-driven development; planning/task breakdown; doubt-driven development | TDD after identity resolution; comprehensive QA; resume-interrupted-task | GitHub; Browser Use; AI Delivery Evidence Checker |
| Public resolver | TDD; domain modeling; doubt-driven development | systematic debugging; security review; comprehensive QA | GitHub; Browser Use; AI Delivery Evidence Checker; SiteTriage only for live DNS/TLS/edge incidents |
| Studio Controls | TDD; Product Design audit; UI consistency/accessibility | HTML accessibility; design-QA after implementation exists; code review | GitHub; Browser Use; Product Design audit; AI Delivery Evidence Checker |

## Exact installed skill routes (use when applicable)
- Planning/spec: `skills://plugins/engineering-suite-plan/spec-driven-development`, `planning-and-task-breakdown`, `documentation-and-adrs`, `doubt-driven-development`.
- TDD: `skills://plugins/agent-skills/test-driven-development/skill.md`; `skills://plugins/superpowers/test-driven-development`.
- AI/LLM: `skills://plugins/matt-skills-curated/ai-engineering`.
- Domain/architecture: `skills://plugins/matt-skills-curated/domain-modeling`, `codebase-design`, `improve-codebase-architecture`.
- Debug/review: `skills://plugins/matt-skills-curated/diagnosing-bugs`, `code-review`; `skills://plugins/superpowers/systematic-debugging`, `verification-before-completion`, `requesting-code-review`.
- Parallel work: `skills://plugins/superpowers/dispatching-parallel-agents`, `subagent-driven-development`; `skills://plugins/codex-dev-workflows/orchestrate-work`.
- Browser/runtime: `skills://plugins/codex-dev-workflows/comprehensive-qa`, `feature-testing`, `pre-release-review`.
- UI: `skills://plugins/product-design/audit`, `design-qa`; `skills://plugins/ui-consistency/accessibility`; `skills://plugins/htmlcodegenerator/accessibility`.
- Delivery: `skills://plugins/codex-dev-workflows/session-handoff`, `resume-interrupted-task`; `skills://plugins/matt-skills-curated/handoff`.

## Plugin use boundaries
- **GitHub:** repository source, branch, PR, code review and CI evidence. Never infer runtime success from a merged PR.
- **Browser Use:** approved public/deployed runtime navigation and user-flow verification. Do not expose secrets or private user content.
- **AI Delivery Evidence Checker:** assess whether a completion claim is supported by supplied code/test/runtime evidence.
- **AI App Readiness Checker:** only for a product that is itself an AI app/MCP submission; not a general code quality gate.
- **Product Design audit:** visual UX audit from captured screens. Use design-QA only when both a source visual target and rendered implementation exist.
- **SiteTriage:** only for deployed endpoint DNS/TLS/edge diagnosis, not application logic.
- **Docs AI:** optional copy refinement only; repository source-of-truth docs must be authored and verified in GitHub.
- Plugins require explicit connection/authorization where applicable; do not install or connect anything without the user's action.

## Agent assignment guidance
Use one workstream agent per independent slice and one integrator. Keep shared-file changes serialized (Task Authority, registries, plan families, global diagnostics contracts, shared token/emitter files). An independent verifier reviews evidence and claims; it does not own implementation.
