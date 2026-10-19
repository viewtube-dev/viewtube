# ViewTube Findings Register

**Purpose:** Single durable register for bugs, code-structure issues, discoveries, tool improvements, new-tool ideas, workflow improvements, handoff improvements, AI improvements, UX opportunities, optimization opportunities, and technical risks.

This is a register, not a replacement for detailed domain documents. Large findings should link to their detailed audit, plan, architecture, or implementation artifact.

## Finding schema
| Field | Required |
|---|---|
| ID | Yes |
| Category | Yes |
| Title | Yes |
| Affected area/tool/file | Yes when known |
| Discovery | Yes |
| Source | Yes |
| Evidence | Yes when available |
| Status | Yes |
| Impact | Yes when material |
| Recommended improvement | Yes when applicable |
| Proposed implementation | When applicable |
| Dependencies | When applicable |
| Related docs | When applicable |
| Verification needed | Yes |
| Owner/next action | When known |

## Categories
BUG · REGRESSION · CODE_STRUCTURE · ARCHITECTURE · TOOL_IMPROVEMENT · NEW_TOOL · WORKFLOW · HANDOFF · AI_IMPROVEMENT · UX_PRODUCT · PERFORMANCE · SECURITY_RELIABILITY · DATA_MODEL · TESTING_VERIFICATION · DEPENDENCY · DEPLOYMENT

## Priority
- P0: blocks core operation/security or causes severe data loss
- P1: major user/project impact or significant architectural risk
- P2: meaningful improvement, recurring friction, or technical debt
- P3: useful optimization or future opportunity

## Active findings
<!-- Agents append findings here. Detailed findings belong in linked artifacts when needed. -->

## Reconciliation
During Round 2, merge duplicate findings, preserve conflicting evidence, establish authoritative status, and link implemented fixes back to the original finding.
