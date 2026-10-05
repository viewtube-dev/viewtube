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

<PARSED TEXT FOR PAGE: 1 / 9>
ViewTube Studio Hub — Tool Context & 
Learn More
Canonical information hierarchy: Description → Inputs → Workflow → Outputs → 
Connections
1. Video Manager
Description
Manage your published and unpublished videos, update video details, and keep your channel 
content organized and ready for improvement or republishing.
Learn More
Inputs
Select a video to manage and work with its existing title, description, thumbnail, metadata, 
publishing status, and available content information. Use the available controls to update, review, 
or move the video into another Studio workflow.
Workflow
Select a video → review its current content and metadata → make the needed changes → send 
the updated content into the appropriate publishing, analysis, or optimization workflow.
Outputs
Updated video information, metadata, assets, and publishing-ready content.
Connections
 Content Analysis — analyzes the selected video to identify problems and opportunities for 
improvement.
 Thumbnail Studio — creates or replaces the video's thumbnail.
 End-Screen Architect — improves the video's end-screen path and outro.
 Video Publisher — prepares updated metadata and publishing information.
 Publishing Package — brings the video's final assets and publishing information together.
2. Video Director
Description
Direct videos, variations, sequences, and campaigns from a shared creative direction and Video 
DNA system.
<PARSED TEXT FOR PAGE: 2 / 9>
Learn More
Inputs
Start with a video concept, creative direction, existing content, or project context. Provide the 
source material and direction needed to define the video's structure, visuals, variations, or 
production requirements.
Workflow
Choose the project or video → establish the creative direction → define the required production 
→ generate or organize the media → review the result and continue production or publishing.
Outputs
Directed video concepts, production instructions, variations, sequences, campaigns, and 
supporting media assets.
Connections
 Script Architect — provides the timed script, beats, visuals, and scene direction used for 
production.
 Hook Generator — supplies opening hooks and intros that can shape the video's opening.
 Thumbnail Studio — creates visual packaging that represents the finished video.
 Content Analysis — provides analysis that can inform creative and production improvements.
 Publishing Package — receives completed production assets for final publishing preparation.
3. Video Publisher
Description
Create SEO-optimized titles, descriptions, tags, and other publishing information for new and 
existing videos.
Learn More
Inputs
Select a video or provide its content and context. Use the available metadata, analysis, audience 
information, and creative assets to generate and refine the information needed to publish the 
video.
Workflow
Select the video → provide or review its context → generate publishing metadata → review and 
refine the results → prepare the final publishing package.
Outputs
Titles, descriptions, tags, metadata, and other publishing information ready to use with the video.
Connections
 Video Manager — applies or manages publishing information on the selected video.
 Thumbnail Studio — supplies the thumbnail used with the video's publishing package.
 Content Analysis — provides content findings that can inform titles, descriptions, and 
positioning.
<PARSED TEXT FOR PAGE: 3 / 9>
 Publishing Package — combines publisher-generated metadata with the video's other final 
assets.
 Pre-Launch Priming — uses the prepared publishing information as part of the coordinated 
launch process.
4. Publishing Package
Description
Bring a video's publishing details and assets together into one final readiness package.
Learn More
Inputs
Start with a prepared video or ContentBuild and its available metadata, thumbnail, supporting 
assets, and publishing information. Review the package's readiness and any remaining 
requirements before publishing.
Workflow
Select the video or project → gather the required publishing assets → review metadata and 
readiness → resolve missing items → send the completed package to publishing.
Outputs
A consolidated, publishing-ready package containing the video's required metadata, assets, and 
readiness information.
Connections
 Video Publisher — supplies titles, descriptions, tags, and other publishing metadata.
 Thumbnail Studio — supplies the selected thumbnail and supporting visual assets.
 Pre-Launch Priming — uses the prepared package to coordinate the video's launch.
 Video Manager — provides the destination for managing the finished video's publishing 
information.
 Community Posts — can use the finished video's assets and context for launch-related posts.
5. Content Analysis
Description
Analyze scripts and videos to identify pacing issues, retention problems, quality issues, and 
opportunities for improvement.
Learn More
Inputs
Provide a video, script, or available content data. Use the analysis controls and available 
metadata or context to focus the evaluation on content quality, pacing, retention, and 
performance issues.
<PARSED TEXT FOR PAGE: 4 / 9>
Workflow
Select the content → run the analysis → review identified issues and evidence → determine 
improvements → send useful findings into the appropriate Studio workflow.
Outputs
Content analysis, identified issues, improvement opportunities, evidence, and actionable findings.
Connections
 Video Manager — provides videos to analyze and can receive resulting improvements.
 Thumbnail Studio — uses analysis to inform thumbnail packaging and visual direction.
 Hook Generator — uses analysis to identify opportunities for stronger openings.
 Tactics Engine — converts evidence and findings into concrete creator tactics.
 End-Screen Architect — uses content context to improve the video's next-video path.
 Video Publisher — uses findings to improve publishing metadata and positioning.
6. Thumbnail Studio
Description
Create and refine thumbnails and visual assets for your videos, end screens, Community Posts, 
polls, and more.
Learn More
Inputs
Start with a video, project, image, or content context. Add available metadata, analysis, hooks, or 
existing visual assets to guide the design. Generate concepts, create variations, compare 
options, and refine the design until you have the asset you want to use.
Workflow
Choose the video or project → provide your creative context → generate thumbnail concepts → 
explore variations → compare and refine → select the final design.
Outputs
Finished thumbnail designs and supporting visual assets ready for videos, end screens, 
Community Posts, polls, and other publishing needs.
Connections
 Video Publisher — uses the finished thumbnail as part of the video's publishing package.
 Publishing Package — brings the selected thumbnail together with the video's other 
publishing assets and metadata.
 Community Posts — uses generated images for posts and polls.
 End-Screen Architect — can use visual assets when building the video's end-screen 
experience.
 Video Director — provides visual assets that support the video's creative and production 
direction.
<PARSED TEXT FOR PAGE: 5 / 9>
7. Community Posts
Description
Create polls and community updates that keep viewers engaged between video uploads.
Learn More
Inputs
Start with a video, image, topic, audience context, or existing content. Choose the post type and 
provide the context needed to generate a community update, image post, or poll.
Workflow
Choose the post type → provide the video or campaign context → create the post or poll → 
review and refine the content and image → prepare it for publishing.
Outputs
Community posts, polls, post copy, and supporting visual assets.
Connections
 Thumbnail Studio — supplies images and visual assets for posts and polls.
 Video Manager — provides existing video content that can be promoted or referenced.
 Video Publisher — connects community activity with a video's publishing workflow.
 Pre-Launch Priming — uses community posts as part of the video's pre-launch and launch 
sequence.
 Publishing Package — provides final video context and assets for coordinated publishing.
8. Comment Responder
Description
Draft on-brand replies and pinned comments that help increase engagement and guide viewers 
to relevant content.
Learn More
Inputs
Provide comments or comment context along with the relevant video, metadata, or content 
analysis. Use the available context to generate replies that match the creator's content and 
audience.
Workflow
Provide comments → select the relevant video or context → generate responses → review and 
refine the replies → select responses or pinned comments to use.
Outputs
Draft replies, pinned-comment copy, recommended responses, and relevant video 
recommendations.
<PARSED TEXT FOR PAGE: 6 / 9>
Connections
 Video Manager — provides the videos and channel content associated with comments.
 Content Analysis — supplies content context that can improve response relevance.
 Video Publisher — provides video metadata and positioning context.
 Video Manager / Video Library — provides relevant videos that can be recommended in 
replies.
9. End-Screen Architect
Description
Design end-screen layouts and outro scripts that guide viewers toward the next video.
Learn More
Inputs
Start with a video and its available metadata, analysis, and content context. Define the desired 
next-video path and use the available controls to shape the end-screen layout and outro.
Workflow
Select the video → review its content and available next-video options → design the end-screen 
flow → create the outro copy → review the viewer path → finalize the end-screen plan.
Outputs
End-screen layouts, next-video recommendations, outro scripts, and viewer-flow metadata.
Connections
 Content Analysis — identifies content context and opportunities for stronger viewer 
continuation.
 Video Manager — provides the source video and its available channel content.
 Thumbnail Studio — supplies visual assets used in the end-screen experience.
 Video Publisher — uses the resulting metadata and outro information when preparing the 
video.
 Video Director — can incorporate the outro and end-screen direction into production.
10. Pre-Launch Priming
Description
Plan the rollout before publishing with coordinated warm-up content and launch tactics.
Learn More
Inputs
Start with a prepared video, thumbnail, metadata, analysis, or project. Use the available content 
and launch context to determine the steps, timing, and supporting activities needed before 
publication.
<PARSED TEXT FOR PAGE: 7 / 9>
Workflow
Select the upcoming video → review its readiness → define the pre-launch activities → create 
warm-up tactics and supporting content → organize the launch sequence.
Outputs
Pre-launch plans, launch tactics, warm-up activities, supporting metadata, and coordinated 
project steps.
Connections
 Publishing Package — provides the prepared video, metadata, and assets that the launch 
plan supports.
 Thumbnail Studio — supplies the thumbnail and visual assets needed for promotion.
 Community Posts — executes warm-up posts, polls, and audience engagement.
 Video Publisher — provides the publishing information used to coordinate the launch.
 Content Analysis — provides evidence and findings that can inform launch tactics.
11. Hook Generator
Description
Generate strong opening hooks and intros designed to capture attention in the first moments of a 
video.
Learn More
Inputs
Provide a script, video, topic, strategy, analysis, or metadata. Use the available context to 
generate hooks that match the video's subject, audience, and intended direction.
Workflow
Provide the content context → generate hook options → compare the openings → refine the 
strongest option → use the selected hook in the script or video.
Outputs
Opening hooks, intro variations, and revised script openings.
Connections
 Script Architect — incorporates the selected hook into the timed script and overall structure.
 Content Analysis — identifies opening and retention opportunities that can guide hook 
generation.
 Tactics Engine — provides strategy and tactics that can influence the hook direction.
 Video Director — uses the selected hook to guide the video's opening production.
 Video Publisher — can use the video's opening positioning when preparing publishing 
metadata.
<PARSED TEXT FOR PAGE: 8 / 9>
12. Tactics Engine
Description
Turn channel evidence and strategy into concrete creator actions you can use, test, and execute.
Learn More
Inputs
Provide analysis, evidence, video or channel context, metadata, audience information, and 
strategic goals. Use the available context to focus the generated tactics on a specific content or 
growth objective.
Workflow
Provide the evidence and goal → generate strategic tactics → review and prioritize the 
recommendations → select actionable tactics → apply them to the relevant project or content 
workflow.
Outputs
Actionable tactics, strategic recommendations, and project-level actions.
Connections
 Content Analysis — provides evidence and findings that become inputs for tactical 
recommendations.
 Hook Generator — uses tactics to guide stronger openings and hooks.
 Pre-Launch Priming — turns selected tactics into launch and warm-up actions.
 Video Director — applies relevant tactics to creative and production decisions.
 Script Architect — can use strategic direction to shape script structure and content choices.
13. Script Architect
Description
Turn an idea or complete creative brief into a timed script, visual direction, and production-ready 
content plan.
Learn More
Inputs
Start with a spark, topic, chosen angle, or complete brief. Provide available research, evidence, 
strategy, hooks, and content context, then set the desired script direction and length.
Workflow
Provide the idea or brief → choose the angle → build the structure → generate the timed script 
and visual direction → review the beats and transitions → refine the final production plan.
Outputs
Timed scripts, structured beats, visual direction, storyboard-ready scene packets, and priming 
Shorts.
<PARSED TEXT FOR PAGE: 9 / 9>
Connections
 Hook Generator — supplies and improves the opening hook used by the script.
 Tactics Engine — provides strategic direction that can shape the script and content angle.
 Content Analysis — provides evidence and improvement findings that can inform the script.
 Video Director — takes the script and visual direction into production.
 Thumbnail Studio — uses the finished content direction to inform visual packaging.
 Pre-Launch Priming — can use the resulting content and priming Shorts as part of the launch
plan.