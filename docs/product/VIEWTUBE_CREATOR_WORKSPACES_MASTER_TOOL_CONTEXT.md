# ViewTube Creator Workspace Tools — Master Context & Learn More

**Canonical information hierarchy:** Description → Inputs → Workflow → Outputs → Connections

**Scope:** Projects, AI Brain, Analytics, Vault, Editor, and Resource Library.

> **Tool boundary:** This document treats the 12 named page-level tools as the canonical tools. Internal capabilities remain inside the tool's Inputs, Workflow, Outputs, or Connections rather than being promoted to separate tools.
>
> **Source note:** The tool boundaries follow the supplied ViewTube structure and the current ViewTubeBUILD feature registry. The registry identifies Projects, AI Brain, ViewTube Editor, and Creator Vault as live surfaces; the four Analytics tools and the four Projects tools below follow the page/tool structure established for this documentation set. Where implementation details are not explicitly exposed by the registry, the descriptions are intentionally functional rather than claims about a specific API.

---

# 1. Projects

## 1.1 Project Builder

### Description
The Project Builder is a workspace for creating and configuring projects that keep their brief, goals, content, assets, tasks, and publishing work together.

### Inputs
Project name, concept or brief, channel context, goals, target content, schedule, and available assets.

### Workflow
Create the project → define its brief and goals → add the content build and required work → organize assets and tasks → move the project through production and publishing.

### Outputs
A structured project with its content plan, production state, tasks, assets, and publishing context.

### Connections
- **Project Board** — manages the project's workflow state.
- **Project Calendar** — places project work and deadlines on the schedule.
- **Storyboard Studio** — develops visual and scene direction.
- **AI Brain** — supplies channel-aware context and strategic assistance.
- **Vault** — provides project-linked assets.

---

## 1.2 Project Board

### Description
The Project Board is a workspace for managing projects through their production lifecycle and seeing what is planned, active, blocked, ready, or complete.

### Inputs
Projects, ContentBuilds, task state, readiness information, deadlines, blockers, and project status.

### Workflow
Open the board → review project state → select or move work → resolve blockers → continue the project in the appropriate workspace.

### Outputs
Updated project status, workflow state, priorities, and visible production progress.

### Connections
- **Project Builder** — creates and configures the work being managed.
- **Project Calendar** — coordinates dates and deadlines.
- **Storyboard Studio** — opens visual planning work.
- **Editor** — continues completed production work.
- **Vault** — supplies project assets.

---

## 1.3 Project Calendar

### Description
The Project Calendar is a calendar-based workspace for planning project timing, deadlines, production milestones, and publishing activity.

### Inputs
Projects, tasks, milestones, planned publish dates, deadlines, and scheduling context.

### Workflow
Review the calendar → select a project or date → create or adjust scheduled work → coordinate milestones → return to the project workflow.

### Outputs
Scheduled project activities, dates, milestones, and publishing timing.

### Connections
- **Project Builder** — supplies project and task context.
- **Project Board** — reflects schedule-driven workflow changes.
- **Publishing workflows** — coordinate release timing.
- **Pre-Launch Priming** — supports launch preparation.

---

## 1.4 Storyboard Studio

### Description
The Storyboard Studio is a visual planning workspace for turning a project's creative direction into an organized plan for scenes, beats, shots, and production.

### Inputs
Project brief, chosen angle, script, beats, visual direction, references, assets, and production requirements.

### Workflow
Open the project → define the visual structure → organize scenes and beats → assign visual direction and assets → review the storyboard → hand it into production.

### Outputs
Storyboard structure, scene plans, visual direction, shot/scene information, and production-ready planning context.

### Connections
- **Project Builder** — provides the project and creative brief.
- **Script Architect** — supplies script structure and scene direction.
- **Video Director** — takes the storyboard into production.
- **Editor** — uses the planned structure during editing.
- **Vault** — supplies reference and production assets.

---

# 2. AI Brain

## 2.1 AI Brain

### Description
The AI Brain is ViewTube's channel-aware intelligence system for conversation, reasoning, knowledge, and orchestration across creator workflows.

### Inputs
Creator questions, channel context, goals, content, analytics, projects, assets, tool state, and available evidence.

### Workflow
Ask or invoke the Brain → assemble the relevant creator context → reason over the available evidence → recommend or perform the appropriate action → return the result and hand off to the relevant tool.

### Outputs
Answers, analysis, recommendations, decisions, generated content, tool actions, workflow handoffs, and persistent creator context where supported.

### Connections
- **Projects** — understands and assists with project state.
- **Analytics** — uses channel and performance evidence.
- **Vault** — works with available creator assets.
- **Editor** — assists with editing and production decisions.
- **Resource Library** — retrieves relevant reference material.
- **Studio Hub** — orchestrates creator tools and handoffs.

---

# 3. Analytics

## 3.1 Sync Controller

### Description
The Sync Controller is the analytics synchronization system that keeps YouTube and ViewTube data current, traceable, and available to downstream analytics tools.

### Inputs
Connected channel, synchronization scope, date range, refresh controls, and available YouTube data sources.

### Workflow
Select the channel and sync scope → start or refresh synchronization → monitor the sync state → validate the updated data → make it available to analytics tools.

### Outputs
Synchronized analytics datasets, sync status, refresh information, and data availability for downstream analysis.

### Connections
- **Master Data Tables** — receives synchronized datasets.
- **Data Visuals** — supplies current data for charts and visual analysis.
- **Intelligence Hub** — supplies evidence for interpretation and recommendations.
- **YouTube data** — source of channel performance information.

---

## 3.2 Intelligence Hub

### Description
The Intelligence Hub is a performance intelligence workspace that turns synchronized YouTube data into findings, opportunities, explanations, and creator decisions.

### Inputs
Master analytics data, channel context, video performance, audience data, goals, comparisons, and selected reporting periods.

### Workflow
Select the channel and analysis context → examine the relevant evidence → identify patterns and changes → interpret their significance → turn findings into recommended creator actions.

### Outputs
Performance findings, trends, opportunities, comparisons, explanations, and actionable recommendations.

### Connections
- **Sync Controller** — supplies refreshed source data.
- **Master Data Tables** — provides structured data for analysis.
- **Data Visuals** — provides visual evidence.
- **AI Brain** — uses intelligence findings in broader reasoning.
- **Projects** — turns findings into planned creator work.

---

## 3.3 Master Data Tables

### Description
The Master Data Tables are the structured, queryable analytics datasets that form the canonical data foundation for ViewTube analytics.

### Inputs
Synchronized YouTube data, channel/video records, audience metrics, traffic data, revenue data, retention data, and reporting periods.

### Workflow
Receive synchronized data → normalize and organize the datasets → expose the relevant tables and fields → support queries, comparisons, and downstream analytics.

### Outputs
Structured analytics tables and datasets used by Intelligence Hub, Data Visuals, and other analytics workflows.

### Connections
- **Sync Controller** — supplies refreshed data.
- **Intelligence Hub** — analyzes the structured datasets.
- **Data Visuals** — queries data for charts and visualizations.
- **AI Brain** — can use analytics evidence in reasoning.

---

## 3.4 Data Visuals

### Description
The Data Visuals is a collection of graphs, charts, and data visualizations that turn YouTube data into understandable visual communication.

### Inputs
Master data tables, selected metrics, dimensions, date ranges, filters, comparisons, and channel/video context.

### Workflow
Choose the dataset → select the metric and comparison → apply the relevant filters → render the visualization → inspect the pattern or change.

### Outputs
Charts, graphs, trend views, comparisons, performance visualizations, and visual evidence.

### Connections
- **Master Data Tables** — provides the underlying data.
- **Sync Controller** — keeps the source data current.
- **Intelligence Hub** — interprets visual findings.
- **AI Brain** — can use visualized evidence in broader analysis.

---

# 4. Vault

## 4.1 Vault

### Description
The Vault is an organized system for storing, organizing, inspecting, versioning, and reusing creator assets across projects and ViewTube production workflows.

### Inputs
Uploaded media, generated assets, project context, asset metadata, tags, collections, versions, and existing Vault content.

### Workflow
Import or receive an asset → organize and tag it → inspect or compare versions → link it to projects → select the asset → hand it to the appropriate creator tool.

### Outputs
Organized creator assets, project-linked media, asset metadata, versions, collections, and reusable production resources.

### Connections
- **Projects** — links assets to projects and ContentBuilds.
- **Editor** — supplies media and receives edited outputs.
- **Video Director** — provides production assets.
- **Thumbnail Studio / Studio Hub** — exchanges visual assets.
- **Resource Library** — connects reusable reference resources where applicable.
- **AI Brain** — provides asset context for creator reasoning.

---

# 5. Editor

## 5.1 Editor

### Description
The Editor is a video production workspace for editing and composing media, scenes, audio, captions, overlays, and other production assets on a timeline.

### Inputs
Video and image assets, scenes, clips, audio, voice, captions, transcripts, overlays, transitions, title cards, and project direction.

### Workflow
Open the project → bring in media → arrange and edit the timeline → add audio, captions, visuals, and transitions → preview and refine → render or hand off the finished result.

### Outputs
Edited video timelines, rendered video, captions/subtitles, edited scenes, and production-ready media.

### Connections
- **Projects** — provides the project and production context.
- **Vault** — supplies source and reusable assets.
- **Video Director** — provides directed production plans and generated media.
- **Script Architect** — supplies script and scene structure.
- **AI Brain** — assists with editing decisions and workflow actions.
- **Publishing Package** — receives completed production assets for publishing preparation.

---

# 6. Resource Library

## 6.1 Resource Library

### Description
The Resource Library is an organized collection of documents which contain YouTube-related guides, references, playbooks, and other important creator knowledge and information to help YouTubers best manage their channels and operate ViewTube.

### Inputs
Resource documents, categories, tags, search terms, related-resource context, tool references, and source metadata.

### Workflow
Search or browse the library → filter or select a resource → read the relevant guidance → follow linked resources or tools → apply the information to the current workflow.

### Outputs
Relevant documentation, guides, references, playbooks, contextual help, and reusable knowledge.

### Connections
- **AI Brain** — uses resources as contextual knowledge.
- **Projects** — provides project and workflow guidance.
- **Analytics** — documents analytics concepts and workflows.
- **Vault** — documents asset and library workflows.
- **Editor** — provides editing documentation and references.
- **Studio Hub** — provides contextual tool guidance.

---

# Canonical Tool Inventory

| # | Page | Tool |
|---:|---|---|
| 1 | Projects | Project Builder |
| 2 | Projects | Project Board |
| 3 | Projects | Project Calendar |
| 4 | Projects | Storyboard Studio |
| 5 | AI Brain | AI Brain |
| 6 | Analytics | Sync Controller |
| 7 | Analytics | Intelligence Hub |
| 8 | Analytics | Master Data Tables |
| 9 | Analytics | Data Visuals |
| 10 | Vault | Vault |
| 11 | Editor | Editor |
| 12 | Resource Library | Resource Library |

**Total: 12 tools**


---

# 7. Dashboard Widget Tools

**Canonical information hierarchy:** Description → Inputs → Workflow → Outputs → Connections

**Screenshot-confirmed inventory:** 66 dashboard widget tools.

> This document is based on the supplied ViewTube dashboard screenshots and the current ViewTubeBUILD widget inventory. It preserves the screenshot-visible tool names, including tools whose current registry status or implementation may differ. Where the source only establishes a widget purpose, the remaining fields are concise usage guidance rather than claims of undocumented API behavior.

## 1. About ViewTube

### Description

Explain the ViewTube system, creator loop, connected tools, and Trust/data controls.

### Inputs

Use the current channel, video, audience, project, or analytics context relevant to this widget.

### Workflow

Open the widget → review the available context → use its controls or analysis → act on the result in the relevant ViewTube workflow.

### Outputs

Explain the ViewTube system, creator loop, connected tools, and Trust/data controls.

### Connections

- YouTube Analytics — supplies channel, video, audience, or performance evidence.
- Projects / Studio Hub — receives findings that need a creator action.

## 2. Channel Overview

### Description

Monitor your channel's reach and engagement over the selected reporting period.

### Inputs

Uses the relevant YouTube channel, video, audience, or performance data for the selected reporting context.

### Workflow

Open the widget → review the current signal → compare the relevant values or periods → identify the important finding → follow the appropriate optimization or planning action.

### Outputs

Monitor your channel's reach and engagement over the selected reporting period.

### Connections

- YouTube Analytics — supplies channel, video, audience, or performance evidence.
- Projects / Studio Hub — receives findings that need a creator action.

## 3. Community Post

### Description

Create community posts, polls, and image-based updates to keep viewers engaged between video uploads.

### Inputs

Provide the relevant content or creator context and use the available controls to define what you want to create, change, schedule, or analyze.

### Workflow

Provide the source context → configure the available controls → generate or edit → review the result → send it to the next workflow.

### Outputs

Create community posts, polls, and image-based updates to keep viewers engaged between video uploads.

### Connections

- Studio Hub — receives creative, packaging, or optimization work.
- Projects / Content Pipeline — carries selected work into production.

## 4. Comment Responder

### Description

Draft replies to viewer comments and help turn comment activity into useful audience engagement.

### Inputs

Provide the relevant content or creator context and use the available controls to define what you want to create, change, schedule, or analyze.

### Workflow

Provide the source context → configure the available controls → generate or edit → review the result → send it to the next workflow.

### Outputs

Draft replies to viewer comments and help turn comment activity into useful audience engagement.

### Connections

- Studio Hub — receives creative, packaging, or optimization work.
- Projects / Content Pipeline — carries selected work into production.

## 5. Upload Cadence

### Description

Track your publishing rhythm and identify gaps or changes in your upload schedule.

### Inputs

Uses the relevant YouTube channel, video, audience, or performance data for the selected reporting context.

### Workflow

Open the widget → review the current signal → compare the relevant values or periods → identify the important finding → follow the appropriate optimization or planning action.

### Outputs

Track your publishing rhythm and identify gaps or changes in your upload schedule.

### Connections

- YouTube Analytics — supplies channel, video, audience, or performance evidence.
- Projects / Studio Hub — receives findings that need a creator action.

## 6. Realtime

### Description

Monitor current viewer activity and traffic while a video or channel is receiving live performance.

### Inputs

Uses the relevant YouTube channel, video, audience, or performance data for the selected reporting context.

### Workflow

Open the widget → review the current signal → compare the relevant values or periods → identify the important finding → follow the appropriate optimization or planning action.

### Outputs

Monitor current viewer activity and traffic while a video or channel is receiving live performance.

### Connections

- YouTube Analytics — supplies channel, video, audience, or performance evidence.
- Projects / Studio Hub — receives findings that need a creator action.

## 7. Goals Tracker

### Description

Set and monitor channel goals for subscribers, views, revenue, and other growth targets.

### Inputs

Uses the relevant YouTube channel, video, audience, or performance data for the selected reporting context.

### Workflow

Open the widget → review the current signal → compare the relevant values or periods → identify the important finding → follow the appropriate optimization or planning action.

### Outputs

Set and monitor channel goals for subscribers, views, revenue, and other growth targets.

### Connections

- YouTube Analytics — supplies channel, video, audience, or performance evidence.
- Projects / Studio Hub — receives findings that need a creator action.

## 8. Keyword Engine

### Description

Find search opportunities and keyword demand to help choose stronger video topics and positioning.

### Inputs

Use the current channel, video, audience, project, or analytics context relevant to this widget.

### Workflow

Open the widget → review the available context → use its controls or analysis → act on the result in the relevant ViewTube workflow.

### Outputs

Find search opportunities and keyword demand to help choose stronger video topics and positioning.

### Connections

- YouTube Analytics — supplies channel, video, audience, or performance evidence.
- Projects / Studio Hub — receives findings that need a creator action.

## 9. Daily Oracle

### Description

Provide an evidence-ranked daily strategy focus based on your channel context, goals, performance, cadence, effort, and selected growth lens.

### Inputs

Use the current channel, video, audience, project, or analytics context relevant to this widget.

### Workflow

Open the widget → review the available context → use its controls or analysis → act on the result in the relevant ViewTube workflow.

### Outputs

Provide an evidence-ranked daily strategy focus based on your channel context, goals, performance, cadence, effort, and selected growth lens.

### Connections

- Brain Hub — supplies or receives strategic creator context.
- AI Journal / Analytics — preserve lessons and evidence for future decisions.

## 10. Ask Me

### Description

Ask questions about your channel and data and get an immediate answer in plain language.

### Inputs

Use the current channel, video, audience, project, or analytics context relevant to this widget.

### Workflow

Open the widget → review the available context → use its controls or analysis → act on the result in the relevant ViewTube workflow.

### Outputs

Ask questions about your channel and data and get an immediate answer in plain language.

### Connections

- Brain Hub — supplies or receives strategic creator context.
- AI Journal / Analytics — preserve lessons and evidence for future decisions.

## 11. AI Journal

### Description

Record what works, what does not, and what you learn so ViewTube can build a persistent Creator Playbook.

### Inputs

Provide the relevant content or creator context and use the available controls to define what you want to create, change, schedule, or analyze.

### Workflow

Provide the source context → configure the available controls → generate or edit → review the result → send it to the next workflow.

### Outputs

Record what works, what does not, and what you learn so ViewTube can build a persistent Creator Playbook.

### Connections

- Brain Hub — supplies or receives strategic creator context.
- AI Journal / Analytics — preserve lessons and evidence for future decisions.

## 12. Brain Hub

### Description

View and work with the Brain's evolving understanding of your channel identity, content DNA, performance, and goals.

### Inputs

Use the current channel, video, audience, project, or analytics context relevant to this widget.

### Workflow

Open the widget → review the available context → use its controls or analysis → act on the result in the relevant ViewTube workflow.

### Outputs

View and work with the Brain's evolving understanding of your channel identity, content DNA, performance, and goals.

### Connections

- Brain Hub — supplies or receives strategic creator context.
- AI Journal / Analytics — preserve lessons and evidence for future decisions.

## 13. Next Best Action

### Description

Turn current channel evidence into the highest-value creator move to take next.

### Inputs

Use the current channel, video, audience, project, or analytics context relevant to this widget.

### Workflow

Open the widget → review the available context → use its controls or analysis → act on the result in the relevant ViewTube workflow.

### Outputs

Turn current channel evidence into the highest-value creator move to take next.

### Connections

- Brain Hub — supplies or receives strategic creator context.
- AI Journal / Analytics — preserve lessons and evidence for future decisions.

## 14. Opportunity Radar

### Description

Surface evidence-backed follow-up, refresh, and growth opportunities from current channel performance.

### Inputs

Uses the relevant YouTube channel, video, audience, or performance data for the selected reporting context.

### Workflow

Open the widget → review the current signal → compare the relevant values or periods → identify the important finding → follow the appropriate optimization or planning action.

### Outputs

Surface evidence-backed follow-up, refresh, and growth opportunities from current channel performance.

### Connections

- YouTube Analytics — supplies channel, video, audience, or performance evidence.
- Projects / Studio Hub — receives findings that need a creator action.

## 15. Content Pipeline

### Description

Show the current production flow from idea through build, ready, and published content.

### Inputs

Use the current channel, video, audience, project, or analytics context relevant to this widget.

### Workflow

Open the widget → review the available context → use its controls or analysis → act on the result in the relevant ViewTube workflow.

### Outputs

Show the current production flow from idea through build, ready, and published content.

### Connections

- YouTube Analytics — supplies channel, video, audience, or performance evidence.
- Projects / Studio Hub — receives findings that need a creator action.

## 16. Audience Requests

### Description

Surface recurring viewer questions and requests and turn promising demand into content opportunities.

### Inputs

Use the current channel, video, audience, project, or analytics context relevant to this widget.

### Workflow

Open the widget → review the available context → use its controls or analysis → act on the result in the relevant ViewTube workflow.

### Outputs

Surface recurring viewer questions and requests and turn promising demand into content opportunities.

### Connections

- Audience data — supplies viewer and community context.
- Content Pipeline / Community workflows — turn audience signals into actions.

## 17. Video Asset Engine

### Description

Package, inspect, and hand off durable creator assets for reuse across ViewTube workflows.

### Inputs

Use the current channel, video, audience, project, or analytics context relevant to this widget.

### Workflow

Open the widget → review the available context → use its controls or analysis → act on the result in the relevant ViewTube workflow.

### Outputs

Package, inspect, and hand off durable creator assets for reuse across ViewTube workflows.

### Connections

- YouTube Analytics — supplies channel, video, audience, or performance evidence.
- Projects / Studio Hub — receives findings that need a creator action.

## 18. Publishing Command

### Description

Run the final preflight and launch process for a video before sending it to publishing.

### Inputs

Use the current channel, video, audience, project, or analytics context relevant to this widget.

### Workflow

Open the widget → review the available context → use its controls or analysis → act on the result in the relevant ViewTube workflow.

### Outputs

Run the final preflight and launch process for a video before sending it to publishing.

### Connections

- Video Manager / Publishing workflows — manage the affected video and release state.
- Studio Hub / Projects — provide the production context used before or after publishing.

## 19. Channel Progress

### Description

Compare current channel performance with active growth targets and use the trajectory signal to decide where to focus next.

### Inputs

Uses the relevant YouTube channel, video, audience, or performance data for the selected reporting context.

### Workflow

Open the widget → review the current signal → compare the relevant values or periods → identify the important finding → follow the appropriate optimization or planning action.

### Outputs

Compare current channel performance with active growth targets and use the trajectory signal to decide where to focus next.

### Connections

- YouTube Analytics — supplies channel, video, audience, or performance evidence.
- Projects / Studio Hub — receives findings that need a creator action.

## 20. Video Director

### Description

Direct, storyboard, vary, and execute generated video from the dashboard, with a handoff to the full Studio Director.

### Inputs

Provide the relevant content or creator context and use the available controls to define what you want to create, change, schedule, or analyze.

### Workflow

Provide the source context → configure the available controls → generate or edit → review the result → send it to the next workflow.

### Outputs

Direct, storyboard, vary, and execute generated video from the dashboard, with a handoff to the full Studio Director.

### Connections

- Studio Hub — receives creative, packaging, or optimization work.
- Projects / Content Pipeline — carries selected work into production.

## 21. Shorts Multiplier

### Description

Create repost-ready Shorts variants from existing content with trim and scheduling plans.

### Inputs

Provide the relevant content or creator context and use the available controls to define what you want to create, change, schedule, or analyze.

### Workflow

Provide the source context → configure the available controls → generate or edit → review the result → send it to the next workflow.

### Outputs

Create repost-ready Shorts variants from existing content with trim and scheduling plans.

### Connections

- Studio Hub — receives creative, packaging, or optimization work.
- Projects / Content Pipeline — carries selected work into production.

## 22. Image Generator

### Description

Create images with style controls and send the results directly into other creator workflows.

### Inputs

Provide the relevant content or creator context and use the available controls to define what you want to create, change, schedule, or analyze.

### Workflow

Provide the source context → configure the available controls → generate or edit → review the result → send it to the next workflow.

### Outputs

Create images with style controls and send the results directly into other creator workflows.

### Connections

- Studio Hub — receives creative, packaging, or optimization work.
- Projects / Content Pipeline — carries selected work into production.

## 23. Video Uploader

### Description

Prepare a video, thumbnail, metadata, publishing options, and ad-suitability information for upload and publication.

### Inputs

Provide the relevant content or creator context and use the available controls to define what you want to create, change, schedule, or analyze.

### Workflow

Provide the source context → configure the available controls → generate or edit → review the result → send it to the next workflow.

### Outputs

Prepare a video, thumbnail, metadata, publishing options, and ad-suitability information for upload and publication.

### Connections

- Video Manager / Publishing workflows — manage the affected video and release state.
- Studio Hub / Projects — provide the production context used before or after publishing.

## 24. Video Manager

### Description

Manage a published video by reviewing and updating its thumbnail, title, description, tags, metadata, and ad-suitability settings.

### Inputs

Use the current channel, video, audience, project, or analytics context relevant to this widget.

### Workflow

Open the widget → review the available context → use its controls or analysis → act on the result in the relevant ViewTube workflow.

### Outputs

Manage a published video by reviewing and updating its thumbnail, title, description, tags, metadata, and ad-suitability settings.

### Connections

- Video Manager / Publishing workflows — manage the affected video and release state.
- Studio Hub / Projects — provide the production context used before or after publishing.

## 25. Traffic Sources

### Description

Identify where your views come from, including Search, Suggested, Browse, and external sources.

### Inputs

Uses the relevant YouTube channel, video, audience, or performance data for the selected reporting context.

### Workflow

Open the widget → review the current signal → compare the relevant values or periods → identify the important finding → follow the appropriate optimization or planning action.

### Outputs

Identify where your views come from, including Search, Suggested, Browse, and external sources.

### Connections

- YouTube Analytics — supplies channel, video, audience, or performance evidence.
- Projects / Studio Hub — receives findings that need a creator action.

## 26. Long vs Short

### Description

Compare long-form and Shorts performance to understand which format is driving different growth outcomes.

### Inputs

Use the current channel, video, audience, project, or analytics context relevant to this widget.

### Workflow

Open the widget → review the available context → use its controls or analysis → act on the result in the relevant ViewTube workflow.

### Outputs

Compare long-form and Shorts performance to understand which format is driving different growth outcomes.

### Connections

- YouTube Analytics — supplies channel, video, audience, or performance evidence.
- Projects / Studio Hub — receives findings that need a creator action.

## 27. Published Momentum

### Description

Visualize when your audience is most active to help time uploads for maximum initial velocity.

### Inputs

Uses the relevant YouTube channel, video, audience, or performance data for the selected reporting context.

### Workflow

Open the widget → review the current signal → compare the relevant values or periods → identify the important finding → follow the appropriate optimization or planning action.

### Outputs

Visualize when your audience is most active to help time uploads for maximum initial velocity.

### Connections

- YouTube Analytics — supplies channel, video, audience, or performance evidence.
- Projects / Studio Hub — receives findings that need a creator action.

## 28. Audience Matrix

### Description

Analyze geography, device, and sharing data in a unified audience view.

### Inputs

Uses the relevant YouTube channel, video, audience, or performance data for the selected reporting context.

### Workflow

Open the widget → review the current signal → compare the relevant values or periods → identify the important finding → follow the appropriate optimization or planning action.

### Outputs

Analyze geography, device, and sharing data in a unified audience view.

### Connections

- YouTube Analytics — supplies channel, video, audience, or performance evidence.
- Projects / Studio Hub — receives findings that need a creator action.

## 29. Settings

### Description

Toggle dashboard visibility and quick channel-management settings.

### Inputs

Use the widget's visible controls, selections, and current ViewTube workspace context.

### Workflow

Open the widget → review the available context → use its controls or analysis → act on the result in the relevant ViewTube workflow.

### Outputs

Toggle dashboard visibility and quick channel-management settings.

### Connections

- YouTube Analytics — supplies channel, video, audience, or performance evidence.
- Projects / Studio Hub — receives findings that need a creator action.

## 30. Keyword Overlap

### Description

Map overlap and value among title keywords.

### Inputs

Use the current channel, video, audience, project, or analytics context relevant to this widget.

### Workflow

Open the widget → review the available context → use its controls or analysis → act on the result in the relevant ViewTube workflow.

### Outputs

Map overlap and value among title keywords.

### Connections

- YouTube Analytics — supplies channel, video, audience, or performance evidence.
- Projects / Studio Hub — receives findings that need a creator action.

## 31. Retention Simulator

### Description

Analyze potential pacing danger zones during editing before publication.

### Inputs

Uses the relevant YouTube channel, video, audience, or performance data for the selected reporting context.

### Workflow

Open the widget → review the current signal → compare the relevant values or periods → identify the important finding → follow the appropriate optimization or planning action.

### Outputs

Analyze potential pacing danger zones during editing before publication.

### Connections

- YouTube Analytics — supplies channel, video, audience, or performance evidence.
- Projects / Studio Hub — receives findings that need a creator action.

## 32. Upload Scheduler

### Description

Map out upcoming content and schedule releases to maintain a consistent publishing rhythm.

### Inputs

Provide the relevant content or creator context and use the available controls to define what you want to create, change, schedule, or analyze.

### Workflow

Provide the source context → configure the available controls → generate or edit → review the result → send it to the next workflow.

### Outputs

Map out upcoming content and schedule releases to maintain a consistent publishing rhythm.

### Connections

- Video Manager / Publishing workflows — manage the affected video and release state.
- Studio Hub / Projects — provide the production context used before or after publishing.

## 33. Thumb AI

### Description

Evaluate thumbnail CTR potential and generate thumbnail variations.

### Inputs

Use the current channel, video, audience, project, or analytics context relevant to this widget.

### Workflow

Open the widget → review the available context → use its controls or analysis → act on the result in the relevant ViewTube workflow.

### Outputs

Evaluate thumbnail CTR potential and generate thumbnail variations.

### Connections

- Studio Hub — receives creative, packaging, or optimization work.
- Projects / Content Pipeline — carries selected work into production.

## 34. Quick Actions

### Description

Quickly jump to the most common dashboard surfaces and ViewTube workflows.

### Inputs

Use the widget's visible controls, selections, and current ViewTube workspace context.

### Workflow

Open the widget → review the available context → use its controls or analysis → act on the result in the relevant ViewTube workflow.

### Outputs

Quickly jump to the most common dashboard surfaces and ViewTube workflows.

### Connections

- YouTube Analytics — supplies channel, video, audience, or performance evidence.
- Projects / Studio Hub — receives findings that need a creator action.

## 35. Revenue Momentum

### Description

Track how fast revenue is changing and where it peaks.

### Inputs

Uses the relevant YouTube channel, video, audience, or performance data for the selected reporting context.

### Workflow

Open the widget → review the current signal → compare the relevant values or periods → identify the important finding → follow the appropriate optimization or planning action.

### Outputs

Track how fast revenue is changing and where it peaks.

### Connections

- YouTube Analytics — supplies channel, video, audience, or performance evidence.
- Projects / Studio Hub — receives findings that need a creator action.

## 36. Title Rewriter

### Description

Generate title alternatives from a video's core hook and compare different angles.

### Inputs

Provide the relevant content or creator context and use the available controls to define what you want to create, change, schedule, or analyze.

### Workflow

Provide the source context → configure the available controls → generate or edit → review the result → send it to the next workflow.

### Outputs

Generate title alternatives from a video's core hook and compare different angles.

### Connections

- Studio Hub — receives creative, packaging, or optimization work.
- Projects / Content Pipeline — carries selected work into production.

## 37. Description Editor

### Description

Bulk edit or template descriptions with reusable SEO, link, and social blocks.

### Inputs

Provide the relevant content or creator context and use the available controls to define what you want to create, change, schedule, or analyze.

### Workflow

Provide the source context → configure the available controls → generate or edit → review the result → send it to the next workflow.

### Outputs

Bulk edit or template descriptions with reusable SEO, link, and social blocks.

### Connections

- Studio Hub — receives creative, packaging, or optimization work.
- Projects / Content Pipeline — carries selected work into production.

## 38. Hashtag Analyzer

### Description

See which hashtags are trending or oversaturated and select relevant tags.

### Inputs

Use the current channel, video, audience, project, or analytics context relevant to this widget.

### Workflow

Open the widget → review the available context → use its controls or analysis → act on the result in the relevant ViewTube workflow.

### Outputs

See which hashtags are trending or oversaturated and select relevant tags.

### Connections

- Studio Hub — receives creative, packaging, or optimization work.
- Projects / Content Pipeline — carries selected work into production.

## 39. Social Channels

### Description

Provide a holistic view of channel reach and engagement for longer-term trends and seasonality.

### Inputs

Use the current channel, video, audience, project, or analytics context relevant to this widget.

### Workflow

Open the widget → review the available context → use its controls or analysis → act on the result in the relevant ViewTube workflow.

### Outputs

Provide a holistic view of channel reach and engagement for longer-term trends and seasonality.

### Connections

- YouTube Analytics — supplies channel, video, audience, or performance evidence.
- Projects / Studio Hub — receives findings that need a creator action.

## 40. Mini Calendar

### Description

Show upcoming tasks and deadlines so the creator can plan the week and avoid production bottlenecks.

### Inputs

Use the widget's visible controls, selections, and current ViewTube workspace context.

### Workflow

Open the widget → review the available context → use its controls or analysis → act on the result in the relevant ViewTube workflow.

### Outputs

Show upcoming tasks and deadlines so the creator can plan the week and avoid production bottlenecks.

### Connections

- YouTube Analytics — supplies channel, video, audience, or performance evidence.
- Projects / Studio Hub — receives findings that need a creator action.

## 41. Task Stack

### Description

Manage production work from ideation through publish and keep multiple edits moving.

### Inputs

Use the widget's visible controls, selections, and current ViewTube workspace context.

### Workflow

Open the widget → review the available context → use its controls or analysis → act on the result in the relevant ViewTube workflow.

### Outputs

Manage production work from ideation through publish and keep multiple edits moving.

### Connections

- YouTube Analytics — supplies channel, video, audience, or performance evidence.
- Projects / Studio Hub — receives findings that need a creator action.

## 42. Recent Uploads

### Description

Compare recent videos to spot topics, thumbnails, and releases that are currently resonating.

### Inputs

Use the current channel, video, audience, project, or analytics context relevant to this widget.

### Workflow

Open the widget → review the available context → use its controls or analysis → act on the result in the relevant ViewTube workflow.

### Outputs

Compare recent videos to spot topics, thumbnails, and releases that are currently resonating.

### Connections

- YouTube Analytics — supplies channel, video, audience, or performance evidence.
- Projects / Studio Hub — receives findings that need a creator action.

## 43. Top Performer

### Description

Analyze the strongest-performing videos to identify patterns worth repeating.

### Inputs

Uses the relevant YouTube channel, video, audience, or performance data for the selected reporting context.

### Workflow

Open the widget → review the current signal → compare the relevant values or periods → identify the important finding → follow the appropriate optimization or planning action.

### Outputs

Analyze the strongest-performing videos to identify patterns worth repeating.

### Connections

- YouTube Analytics — supplies channel, video, audience, or performance evidence.
- Projects / Studio Hub — receives findings that need a creator action.

## 44. Alerts Feed

### Description

---

# 8. Studio Hub Tools

**Canonical Studio Hub inventory:** 13 user-facing Round 1 tools.  
**Canonical information hierarchy:** Description → Learn More → Inputs → Workflow → Outputs → Connections

> **Status:** Proposed / Round 1 architecture. Runtime ownership and implementation remain subject to the Studio Hub documentation and Round 2 reconciliation.

## 8.1 Opportunity Radar

### Description
The Opportunity Radar identifies promising opportunities for channel growth, content development, audience engagement, and monetization from signals and evidence.

### Learn More
Use it to discover and prioritize opportunities before deciding exactly what content or action to create.

### Inputs
Channel context, audience signals, performance evidence, demand signals, trends, goals, constraints, prior findings, and relevant project context.

### Workflow
Collect signals → detect potential opportunities → score freshness, demand, fit, effort, and confidence → compare opportunities → select or hand off the strongest opportunity.

### Outputs
Ranked opportunities, opportunity evidence, scores, confidence, watchlists, and recommended next steps.

### Connections
- **Content Architect** — develops selected opportunities into content concepts.
- **Audience Studio** — turns audience opportunities into relationship actions.
- **Revenue Architect** — evaluates monetization opportunities.
- **Creator Strategy Engine** — uses validated opportunities in strategic recommendations.
- **Post-Publication Analysis** — supplies performance evidence that can reveal new opportunities.

---

## 8.2 Content Architect

### Description
The Content Architect turns selected opportunities and creator goals into concrete content concepts and creative directions.

### Learn More
Use it to decide what should be made from an opportunity before moving into detailed production.

### Inputs
Opportunities, channel strategy, audience context, research, evidence, goals, constraints, hooks, existing content, and project context.

### Workflow
Select an opportunity → define the content objective → explore concepts and angles → develop the strongest concept → hand it into story, production, analysis, or project workflows.

### Outputs
Content concepts, angles, briefs, creative directions, concept comparisons, and production-ready content context.

### Connections
- **Opportunity Radar** — supplies opportunities to develop.
- **Video Director** — takes approved concepts into production direction.
- **Asset Forge** — identifies and resolves required production assets.
- **Pre-Publication Analysis** — evaluates content before publication.
- **Creator Strategy Engine** — uses concepts when recommending next-best moves.
- **Projects** — carries approved concepts into execution.

---

## 8.3 Video Director

### Description
The Video Director coordinates creative and production execution from an approved concept through the media and production work required to make the video.

### Learn More
Use it to direct how a video should be produced, including structure, visuals, sequences, variations, and production requirements.

### Inputs
Content concepts, creative briefs, scripts, story structures, visual direction, assets, production requirements, analysis findings, and project context.

### Workflow
Select the production context → establish creative direction → define production requirements → organize or generate production work → review the result → continue into editing or publishing.

### Outputs
Production direction, video structures, sequences, variations, shot or scene plans, production instructions, and supporting media requirements.

### Connections
- **Content Architect** — provides the approved concept and creative direction.
- **Asset Forge** — resolves required production assets.
- **Editor** — receives production direction and media for editing.
- **Video Publisher** — receives completed production work for publication.
- **Pre-Publication Analysis** — evaluates production-ready content.

---

## 8.4 Asset Forge

### Description
The Asset Forge determines what production assets are required and creates, sources, organizes, or packages those assets for use in production.

### Learn More
Use it when a project needs visual, audio, or other production assets resolved before editing or publishing.

### Inputs
Production requirements, storyboards, scripts, creative direction, existing assets, asset references, project context, and output specifications.

### Workflow
Inspect production requirements → identify missing or reusable assets → create or source the required assets → validate them → package and hand them into production.

### Outputs
Production asset packages, generated assets, asset manifests, resolved requirements, and references to reusable assets.

### Connections
- **Video Director** — supplies production requirements.
- **Vault** — stores and retrieves reusable assets.
- **Editor** — supplies assets for editing.
- **Video Publisher** — supplies publication-ready supporting assets.
- **Revenue Architect** — can identify assets with monetization or reuse value.

---

## 8.5 Thumbnail Studio

### Description
The Thumbnail Studio creates, evaluates, compares, and refines visual packaging for videos and related publishing surfaces.

### Learn More
Use it to develop thumbnail concepts and visual variations and evaluate their fit with the video's content and audience.

### Inputs
Video context, content concepts, audience information, creative direction, existing thumbnails, assets, performance evidence, and packaging requirements.

### Workflow
Select the video or project → define the packaging direction → create concepts and variations → compare and evaluate them → refine the selected design → hand it into publishing or experimentation.

### Outputs
Thumbnail concepts, finished thumbnails, variations, packaging evaluations, comparison results, and supporting visual assets.

### Connections
- **Video Director** — provides creative and production context.
- **Video Publisher** — uses the selected thumbnail in publication preparation.
- **Pre-Publication Analysis** — evaluates packaging before publication.
- **Post-Publication Analysis** — evaluates packaging performance.
- **Experiment Lab** — supports thumbnail experiments.

---

## 8.6 Video Manager

### Description
The Video Manager manages metadata and optimization for videos that already exist in the channel's published-content system.

### Learn More
Use it to change, compare, generate, and improve titles, descriptions, thumbnails, and related metadata for existing videos.

### Inputs
Published video context, existing metadata, thumbnails, performance evidence, audience information, optimization goals, and historical metadata.

### Workflow
Select the video → inspect current metadata and performance → identify the required change → generate or edit variants → review the result → apply or hand off the selected update.

### Outputs
Updated metadata, metadata variants, thumbnail changes, optimization recommendations, and historical/current metadata context.

### Connections
- **Post-Publication Analysis** — supplies performance findings.
- **Thumbnail Studio** — supplies or evaluates thumbnail changes.
- **Video Publisher** — coordinates publication-related metadata.
- **Opportunity Radar** — can use changes and performance as future opportunity evidence.

---

## 8.7 Video Publisher

### Description
The Video Publisher prepares and compiles projects and content for publication, including publication metadata and readiness requirements.

### Learn More
Use it to turn completed production work into a publication-ready package and coordinate publication preparation across projects.

### Inputs
Projects, completed media, titles, descriptions, tags, thumbnails, metadata, publishing requirements, readiness information, and launch context.

### Workflow
Select the content or projects → gather required assets and metadata → validate publication readiness → resolve missing requirements → prepare the final publication package.

### Outputs
Publication-ready content, metadata, readiness status, publishing packages, and coordinated publication context.

### Connections
- **Video Manager** — manages existing video metadata.
- **Thumbnail Studio** — supplies selected visual packaging.
- **Pre-Publication Analysis** — evaluates readiness.
- **Projects** — provides execution and scheduling context.
- **Pre-Launch Priming** — supports launch preparation where applicable.

---

## 8.8 Pre-Publication Analysis

### Description
The Pre-Publication Analysis evaluates planned content before release to identify quality, packaging, pacing, retention, readiness, and other preventable risks.

### Learn More
Use it before publishing to find issues that can still be corrected and convert evidence into specific improvements.

### Inputs
Scripts, story structures, edited videos, thumbnails, metadata, audience context, project goals, production context, and analysis settings.

### Workflow
Select the content → choose the analysis depth → evaluate the relevant evidence → identify issues and opportunities → prioritize improvements → hand findings into the responsible tool.

### Outputs
Pre-publication findings, evidence, risks, improvement opportunities, readiness assessments, and recommended actions.

### Connections
- **Content Architect** — receives concept-level improvements.
- **Video Director** — receives production improvements.
- **Thumbnail Studio** — receives packaging findings.
- **Video Publisher** — receives publication-readiness findings.
- **Tactics Engine** — converts findings into executable tactics.
- **Creator Strategy Engine** — can use validated findings for strategic recommendations.

---

## 8.9 Post-Publication Analysis

### Description
The Post-Publication Analysis evaluates released content and performance to identify what happened, what changed, what may explain the result, and what should be learned.

### Learn More
Use it after publication to turn performance evidence into findings, experiments, opportunities, and improvements.

### Inputs
Published videos, performance metrics, audience behavior, metadata history, thumbnail history, traffic sources, comparisons, goals, and relevant channel context.

### Workflow
Select the content and reporting context → examine performance evidence → identify meaningful changes and patterns → interpret likely explanations → produce findings and hand them into optimization or strategy workflows.

### Outputs
Performance findings, evidence, patterns, hypotheses, opportunities, experiment candidates, and actionable recommendations.

### Connections
- **Video Manager** — receives metadata optimization opportunities.
- **Opportunity Radar** — receives newly discovered opportunities.
- **Content Architect** — receives content-learning inputs.
- **Audience Studio** — receives audience and relationship findings.
- **Thumbnail Studio** — receives packaging performance findings.
- **Experiment Lab** — receives test candidates and results.
- **Tactics Engine** — converts findings into actions.

---

## 8.10 Audience Studio

### Description
The Audience Studio manages audience relationships and turns audience behavior, requests, comments, and engagement signals into useful creator actions.

### Learn More
Use it to understand who needs attention and coordinate the appropriate audience-facing response.

### Inputs
Audience behavior, comments, community activity, viewer requests, audience segments, content context, publishing context, and relationship goals.

### Workflow
Review audience signals → identify relationship opportunities → determine the appropriate response → create or coordinate audience-facing actions → measure the resulting relationship activity.

### Outputs
Audience opportunities, community content, response drafts, audience segments, relationship actions, and engagement plans.

### Connections
- **Opportunity Radar** — receives audience-derived opportunities.
- **Content Architect** — turns audience needs into content concepts.
- **Projects** — carries approved audience actions into execution.
- **Revenue Architect** — evaluates audience value and monetization opportunities.
- **Tactics Engine** — turns audience findings into executable tactics.

---

## 8.11 Tactics Engine

### Description
The Tactics Engine converts evidence, findings, and strategy into concrete creator actions, interventions, tests, and execution steps.

### Learn More
Use it when a finding needs to become a specific action that can be implemented, tested, or measured.

### Inputs
Analysis findings, evidence, strategic goals, content context, audience information, project context, constraints, and validated recommendations.

### Workflow
Provide the evidence and objective → generate possible tactics → evaluate and prioritize them → select actionable tactics → apply them to the appropriate workflow or experiment.

### Outputs
Actionable tactics, interventions, tests, prioritized actions, and project-level execution steps.

### Connections
- **Pre-Publication Analysis** — supplies preventable issues and improvement findings.
- **Post-Publication Analysis** — supplies performance findings.
- **Audience Studio** — receives audience tactics.
- **Video Director** — applies production tactics.
- **Video Publisher** — applies publication tactics.
- **Experiment Lab** — turns selected tactics into measurable tests.
- **Creator Strategy Engine** — uses tactics when forming prioritized next-best moves.

---

## 8.12 Revenue Architect

### Description
The Revenue Architect turns creator, audience, content, asset, and channel intelligence into monetization opportunities, models, and plans.

### Learn More
Use it to identify practical ways the channel can create and capture additional economic value.

### Inputs
Channel intelligence, audience value, content and asset inventory, creator capabilities, revenue history, goals, constraints, and available monetization models.

### Workflow
Assess the creator and audience context → identify monetization opportunities → model options and tradeoffs → prioritize viable paths → turn the selected opportunity into an executable plan.

### Outputs
Revenue opportunities, monetization models, scenarios, unit-economic considerations, priorities, and revenue plans.

### Connections
- **Opportunity Radar** — supplies monetization opportunities.
- **Asset Forge** — identifies reusable or monetizable assets.
- **Audience Studio** — supplies audience and relationship context.
- **Projects** — carries approved revenue initiatives into execution.
- **Creator Strategy Engine** — incorporates monetization into broader strategic recommendations.

---

## 8.13 Creator Strategy Engine

### Description
The Creator Strategy Engine synthesizes validated intelligence across Studio Hub and connected ViewTube systems into prioritized next-best moves for the creator.

### Learn More
Use it when multiple findings, opportunities, constraints, or goals need to be combined into a clear strategic decision.

### Inputs
Validated findings, opportunities, experiments, audience intelligence, revenue intelligence, channel state, projects, goals, constraints, evidence, assumptions, and uncertainty.

### Workflow
Assemble relevant validated context → compare opportunities and constraints → reason across evidence → prioritize possible moves → explain the recommendation and assumptions → hand the selected move into execution or experimentation.

### Outputs
Prioritized next-best moves, strategic recommendations, decision context, supporting evidence, assumptions, confidence, and recommended handoffs.

### Connections
- **Opportunity Radar** — provides prioritized opportunities.
- **Content Architect** — receives strategic content direction.
- **Video Director** — receives production priorities.
- **Tactics Engine** — turns strategic recommendations into executable actions.
- **Revenue Architect** — incorporates monetization strategy.
- **Experiment Lab** — turns strategic uncertainty into measurable tests.
- **Causal Intelligence / Channel Flywheel** — provide deeper explanations and system-level diagnosis.
- **Projects** — receives approved strategic actions for execution.
- **AI Brain** — supplies and preserves validated creator knowledge without replacing evidence or ownership.

---

## Canonical Studio Hub Tool Inventory

| # | Tool | Primary transformation |
|---:|---|---|
| 1 | Opportunity Radar | Signals → Opportunities |
| 2 | Content Architect | Opportunities → Content Concepts |
| 3 | Video Director | Concepts → Production Direction |
| 4 | Asset Forge | Production Requirements → Asset Packages |
| 5 | Thumbnail Studio | Content → Visual Packaging |
| 6 | Video Manager | Published Content → Metadata Optimization |
| 7 | Video Publisher | Completed Content → Publication Package |
| 8 | Pre-Publication Analysis | Planned Content → Readiness Findings |
| 9 | Post-Publication Analysis | Published Content → Performance Findings |
| 10 | Audience Studio | Audience Behavior → Relationship Actions |
| 11 | Tactics Engine | Findings → Executable Tactics |
| 12 | Revenue Architect | Intelligence → Monetization Opportunities |
| 13 | Creator Strategy Engine | Validated Intelligence → Next Best Move |

**Total: 13 user-facing Studio Hub tools**

**Ownership note:** Capability engines such as Video Genome, Story Engine, Audience Pulse, Content Autopilot, Experiment Lab, Causal Intelligence, Channel Simulator, and Channel Flywheel remain documented as capabilities in the canonical Studio Hub architecture. They are not incorrectly promoted here as additional page-level tools.

