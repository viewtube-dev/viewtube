# AI Brain text-to-component assignment

This is the composition contract for visible AI Brain page copy. Text should be owned by a named page composition or semantic part, rather than styled as an unrelated free-floating label.

## App shell and navigation

| Visible text | Owning composition | Text role |
|---|---|---|
| ViewTube, Search, `⌘K` | Global application header/search composition | Brand, global search trigger, keyboard hint; outside the Brain conversation |
| Brain, Brain chat, Brain command, Analytics, Projects, Studio, Workspace | `BrainWorkspaceNavigation` | Route links and navigation heading |
| Project, ContentBuild, Context, Generation, Receipt, Brain Trace | `BrainRuntimePanel` → `BrainRuntimeCell` / compact runtime cell | Runtime pipeline status |
| Capabilities, Outcomes, Accepted, Selected, Events, YouTube, Latest, Metadata versions, Comparisons, Learning candidates, Promoted, Relations, Evidence gaps, Repairs, Publish events, Analytics, Trace | `BrainRuntimePanel` → `BrainRuntimeMetricPill` | Compact runtime counters and status values |

Runtime text must remain data-backed. Empty states such as “No project”, “Unbound”, “Waiting”, “Idle”, “None”, and “Fallback” are values inside the relevant runtime cell—not standalone cards.

## Active creator context

| Visible text | Owning composition | Text role |
|---|---|---|
| Channel · … | `BrainContextStrip` → channel context badge | Active channel |
| Project · … | `BrainContextStrip` → project context badge | Active project |
| ContentBuild · … | `BrainContextStrip` → content-build context badge | Bound content build |
| Selected · … | `BrainContextStrip` → selection context badge | Selected asset/video |
| Lock selection / Unlock selection | `BrainContextStrip` → standard `StudioSplitLeftButton` | Selection lock action |
| Clear selection | `BrainContextStrip` → standard `StudioSplitLeftButton` | Selection reset action |
| Clear project | `BrainContextStrip` → standard `StudioSplitLeftButton` | Project context reset action |

Context badges are one compact status group. The three actions share a single row and use the canonical Studio split-left primitive.

## Conversation and answer

| Visible text | Owning composition | Text role |
|---|---|---|
| You: and the submitted prompt | `UserMessage` | User turn |
| ViewTube Copilot and assistant response copy | `BrainResponseCard` | Assistant turn and answer |
| Preparing response…, interrupted/retry copy | `BrainInterruptedResponseCard` | Pending/error/retry state |
| Basic Guidance, Refined Answer, Full Brain | `BrainGenerationBadge` | Response provenance/status badge |
| Creator Asset Drafts, Description Drafts, headline and key insight | `BrainResponseCard` | Response sections and draft content |
| Prepare metadata draft, Review in Projects, Open in Thumbnail Studio | `BrainResponseCard` contextual handoff actions | Destination-specific actions derived from response intent |
| Rate answer, Saving…, Saved, Try again | `BrainAnswerFeedback` | Feedback actions and live result |
| Learning receipt / correction and rejection copy | `BrainLearningReceiptCard` | Learning outcome receipt and review actions |

## Evidence and provenance

| Visible text | Owning composition | Text role |
|---|---|---|
| Data readiness and its status summary | `BrainEvidenceReadiness` | Expandable readiness summary |
| Metrics available for this answer | `BrainEvidenceReadiness` → available metrics | Evidence metric list / empty state |
| Missing inputs | `BrainEvidenceReadiness` → evidence diagnostics | Missing-input list |
| Dataset status | `BrainEvidenceReadiness` → evidence diagnostics | Per-source status rows |
| Sync notes | `BrainEvidenceReadiness` → evidence diagnostics | Diagnostic warnings |
| Evidence snapshot: timestamp | `BrainEvidenceReadiness` → snapshot timestamp | Capture time |
| Missing metrics are not estimated… | `BrainEvidenceReadiness` → provenance note | Evidence interpretation disclaimer |
| Context used and its count | `BrainContextUsedDrawer` | Disclosure trigger |
| Channel, Project, ContentBuild, Selected video / asset, evidence refs, resolver/profile metadata | `BrainContextUsedDrawer` | Context/provenance detail |

Evidence gaps, prepared/cited counts, and missing-input totals must come from the same evidence snapshot. Do not hard-code a gap count or infer the missing-input list from visible copy.

## Clarification and creator preferences

| Visible text | Owning composition | Text role |
|---|---|---|
| Goal check, Content style, Audience fit, Growth signal, Confirm direction | `BrainQuestionPrompt` → question heading | Question category |
| What topic or working video title should these drafts be about? | Topic/title clarification in the response/question flow | Required subject input |
| Practical, Cinematic, Funny, Premium, Fast, Calm | `BrainQuestionPrompt` only for `content_style` | Content-style options |
| Or say it your way / Type your answer | `BrainQuestionPrompt` → `StudioTextInput` | Free-text answer |
| Save | `BrainQuestionPrompt` → `StudioSplitRightButton` | Save free-text answer |
| One Detail Needed and “A topic or video title is required…” | Response clarification state | Missing required subject, not a style selection |

Topic/title clarification and content-style preference are separate semantic prompts. Style options must never be presented as answers to a required topic/title question.

## Prompt library, channel context, and composer

| Visible text | Owning composition | Text role |
|---|---|---|
| Prompt Library and its search/help copy | `BrainPromptLibrary` | Prompt discovery and selection |
| Prompt Library / Capabilities | `BrainLauncherModeSwitch` → standard `StudioSplitLeftButton` controls | Switch launchpad mode |
| Channel Context | Channel-context launcher / `BrainContextRail` | Open creator context panel |
| Press Enter to send; use Shift+Enter for a new line… | `BrainComposer` → accessible help text | Keyboard instructions |
| Ask about your next video, audience, analytics, goals, thumbnails, SEO, publishing, or revenue… | `BrainComposer` → `StudioTextArea` | Main prompt composer |
| Send / Sending message | `BrainComposerSendAction` | Submit action and busy state |
| Open AI Journal | `BrainComposer` → `StudioSquareIconButton` | Journal launcher |

## Implementation identifiers

Source-level markers make assignments inspectable in the rendered DOM:

- `data-vt-app-component`: global application shell owner.
- `data-vt-app-part`: global brand/search part.
- `data-vt-brain-component`: named composition owner.
- `data-vt-brain-part`: named text/interaction part within a composition.
- `data-vt-brain-context`: active context badge.
- `data-vt-brain-question-category`: semantic question category.

Markers identify ownership; they do not replace accessible labels, state, data lineage, or the actual Studio primitive used for an interactive control.
