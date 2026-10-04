# ViewTube Knowledge Index

**Purpose:** Fast map of the durable ViewTube knowledge system. This index tells an agent where to look; it does not duplicate the underlying documents.

## Start here
1. Recovery.md — recovery rules, provenance, work log, reconciliation.
2. Recovery.yaml — machine-readable recovery state.
3. docs/recovery/VIEWTUBE_CONVERSATION_AGENT_ACTIVATION_PROMPT.md — agent activation instructions.
4. docs/recovery/AGENT_RECOVERY_PLAYBOOK.md — operational recovery procedure.
5. docs/recovery/VIEWTUBE_KNOWLEDGE_OPERATING_SYSTEM.md — how project knowledge is captured, classified, connected, and optimized.
6. docs/recovery/FINDINGS_REGISTER.md — centralized engineering/product findings and opportunities.

## Knowledge map
| Knowledge | Canonical location | Role |
|---|---|---|
| Recovery governance | Recovery.md, Recovery.yaml | State + operating rules |
| Agent operation | docs/recovery/AGENT_RECOVERY_PLAYBOOK.md | Execution procedure |
| Agent activation | docs/recovery/VIEWTUBE_CONVERSATION_AGENT_ACTIVATION_PROMPT.md | Activation contract |
| Knowledge system | docs/recovery/VIEWTUBE_KNOWLEDGE_OPERATING_SYSTEM.md | Documentation architecture |
| Findings | docs/recovery/FINDINGS_REGISTER.md | Bugs + ideas + discoveries |
| Plans | docs/recovery/plans/ | Actionable work |
| Audits | docs/recovery/audits/ | Investigations/evidence |
| Architecture | docs/recovery/architecture/ | System structure |
| Design | docs/recovery/design/ | UI/UX/design-system knowledge |
| Implementation | docs/recovery/implementation/ | Code/implementation evidence |
| Governance | docs/recovery/governance/ | Development rules |
| Data | docs/recovery/data/ | Data/schema knowledge |
| Deployment | docs/recovery/deployment/ | Operations/deployment |
| YouTube | docs/recovery/youtube/ | Creator/YouTube systems |
| Technical | docs/recovery/technical/ | Technical investigations |
| Handoffs | docs/recovery/handoffs/ | Continuation packages |
| Archive | docs/recovery/archive/ | Superseded historical material |

## Knowledge relationships
Use links between artifacts rather than copying content:
**Finding → Evidence/Audit → Decision → Plan → Implementation → Verification → Handoff**

## Navigation rule
If you do not know where information belongs, start here, then follow the canonical owner of the subject. Do not create a new document until you have checked this index and the relevant domain directory.

## Consolidation rule
When multiple documents contain overlapping knowledge, prefer one authoritative current document plus linked historical evidence over parallel competing documents.
