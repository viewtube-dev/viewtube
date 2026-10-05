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

> This section follows the screenshot-confirmed 66-widget inventory. Widget descriptions are concise creator-facing definitions; detailed controls and implementation remain governed by the Widget and UI documentation.

## 1. About ViewTube

### Description

About ViewTube is an overview of ViewTube's creator system, connected tools, creator loop, and Trust and data controls.

### Inputs

Use the current channel, video, audience, project, or analytics context relevant to this widget.

### Workflow

Open the widget → review the available context → use its controls or analysis → review the result → act on it in the relevant ViewTube workflow.

### Outputs

About ViewTube is an overview of ViewTube's creator system, connected tools, creator loop, and Trust and data controls.

### Connections

- **Analytics** — supplies relevant channel, video, audience, or performance evidence.
- **Projects / Studio Hub** — receives findings or outputs that need a creator action.

## 2. Channel Overview

### Description

Channel Overview is a summary of channel reach, engagement, and overall performance for the selected reporting period.

### Inputs

Use the current channel, video, audience, project, or analytics context relevant to this widget.

### Workflow

Open the widget → review the available context → use its controls or analysis → review the result → act on it in the relevant ViewTube workflow.

### Outputs

Channel Overview is a summary of channel reach, engagement, and overall performance for the selected reporting period.

### Connections

- **Analytics** — supplies relevant channel, video, audience, or performance evidence.
- **Projects / Studio Hub** — receives findings or outputs that need a creator action.

## 3. Community Post

### Description

Community Post is a quick way to create community posts, polls, and image-based updates that keep viewers engaged between video uploads.

### Inputs

Provide the relevant content, creator context, and available source assets.

### Workflow

Provide the source context → configure the available controls → create or edit → review the result → send it to the next workflow.

### Outputs

Community Post is a quick way to create community posts, polls, and image-based updates that keep viewers engaged between video uploads.

### Connections

- **Studio Hub** — receives creative, publishing, or optimization work.
- **Projects / Content Pipeline** — carries selected work into production.

## 4. Comment Responder

### Description

Comment Responder is a way to draft relevant replies to viewer comments and turn comment activity into useful audience engagement.

### Inputs

Provide the relevant content, creator context, and available source assets.

### Workflow

Provide the source context → configure the available controls → create or edit → review the result → send it to the next workflow.

### Outputs

Comment Responder is a way to draft relevant replies to viewer comments and turn comment activity into useful audience engagement.

### Connections

- **Studio Hub** — receives creative, publishing, or optimization work.
- **Projects / Content Pipeline** — carries selected work into production.

## 5. Upload Cadence

### Description

Upload Cadence tracks a channel's publishing rhythm and highlights gaps or changes in the upload schedule.

### Inputs

Use the current channel, video, audience, project, or analytics context relevant to this widget.

### Workflow

Open the widget → review the available context → use its controls or analysis → review the result → act on it in the relevant ViewTube workflow.

### Outputs

Upload Cadence tracks a channel's publishing rhythm and highlights gaps or changes in the upload schedule.

### Connections

- **Analytics** — supplies relevant channel, video, audience, or performance evidence.
- **Projects / Studio Hub** — receives findings or outputs that need a creator action.

## 6. Realtime

### Description

Realtime shows current viewer activity and traffic while a video or channel is receiving live performance.

### Inputs

Use the current channel, video, audience, project, or analytics context relevant to this widget.

### Workflow

Open the widget → review the available context → use its controls or analysis → review the result → act on it in the relevant ViewTube workflow.

### Outputs

Realtime shows current viewer activity and traffic while a video or channel is receiving live performance.

### Connections

- **Analytics** — supplies relevant channel, video, audience, or performance evidence.
- **Projects / Studio Hub** — receives findings or outputs that need a creator action.

## 7. Goals Tracker

### Description

Goals Tracker helps set and monitor channel goals for subscribers, views, revenue, and other growth targets.

### Inputs

Use the current channel, video, audience, project, or analytics context relevant to this widget.

### Workflow

Open the widget → review the available context → use its controls or analysis → review the result → act on it in the relevant ViewTube workflow.

### Outputs

Goals Tracker helps set and monitor channel goals for subscribers, views, revenue, and other growth targets.

### Connections

- **Analytics** — supplies relevant channel, video, audience, or performance evidence.
- **Projects / Studio Hub** — receives findings or outputs that need a creator action.

## 8. Keyword Engine

### Description

Keyword Engine helps find search opportunities and keyword demand to support stronger video topics and positioning.

### Inputs

Use the current channel, video, audience, project, or analytics context relevant to this widget.

### Workflow

Open the widget → review the available context → use its controls or analysis → review the result → act on it in the relevant ViewTube workflow.

### Outputs

Keyword Engine helps find search opportunities and keyword demand to support stronger video topics and positioning.

### Connections

- **Analytics** — supplies relevant channel, video, audience, or performance evidence.
- **Projects / Studio Hub** — receives findings or outputs that need a creator action.

## 9. Daily Oracle

### Description

Daily Oracle provides an evidence-ranked daily strategy focus based on channel context, goals, performance, cadence, effort, and the selected growth lens.

### Inputs

Use the current channel, video, audience, project, or analytics context relevant to this widget.

### Workflow

Open the widget → review the available context → use its controls or analysis → review the result → act on it in the relevant ViewTube workflow.

### Outputs

Daily Oracle provides an evidence-ranked daily strategy focus based on channel context, goals, performance, cadence, effort, and the selected growth lens.

### Connections

- **Analytics** — supplies relevant channel, video, audience, or performance evidence.
- **Projects / Studio Hub** — receives findings or outputs that need a creator action.

## 10. Ask Me

### Description

Ask Me lets YouTubers ask questions about their channel and data and get immediate answers in plain language.

### Inputs

Use the current channel, video, audience, project, or analytics context relevant to this widget.

### Workflow

Open the widget → review the available context → use its controls or analysis → review the result → act on it in the relevant ViewTube workflow.

### Outputs

Ask Me lets YouTubers ask questions about their channel and data and get immediate answers in plain language.

### Connections

- **Analytics** — supplies relevant channel, video, audience, or performance evidence.
- **Projects / Studio Hub** — receives findings or outputs that need a creator action.

## 11. AI Journal

### Description

AI Journal is a place to record what works, what does not, and what is learned so ViewTube can build a persistent Creator Playbook.

### Inputs

Use the current channel, video, audience, project, or analytics context relevant to this widget.

### Workflow

Open the widget → review the available context → use its controls or analysis → review the result → act on it in the relevant ViewTube workflow.

### Outputs

AI Journal is a place to record what works, what does not, and what is learned so ViewTube can build a persistent Creator Playbook.

### Connections

- **Analytics** — supplies relevant channel, video, audience, or performance evidence.
- **Projects / Studio Hub** — receives findings or outputs that need a creator action.

## 12. Brain Hub

### Description

Brain Hub provides access to the AI Brain's evolving understanding of a channel's identity, content DNA, performance, and goals.

### Inputs

Use the current channel, video, audience, project, or analytics context relevant to this widget.

### Workflow

Open the widget → review the available context → use its controls or analysis → review the result → act on it in the relevant ViewTube workflow.

### Outputs

Brain Hub provides access to the AI Brain's evolving understanding of a channel's identity, content DNA, performance, and goals.

### Connections

- **Analytics** — supplies relevant channel, video, audience, or performance evidence.
- **Projects / Studio Hub** — receives findings or outputs that need a creator action.

## 13. Next Best Action

### Description

Next Best Action turns current channel evidence into the highest-value creator move to take next.

### Inputs

Use the current channel, video, audience, project, or analytics context relevant to this widget.

### Workflow

Open the widget → review the available context → use its controls or analysis → review the result → act on it in the relevant ViewTube workflow.

### Outputs

Next Best Action turns current channel evidence into the highest-value creator move to take next.

### Connections

- **Analytics** — supplies relevant channel, video, audience, or performance evidence.
- **Projects / Studio Hub** — receives findings or outputs that need a creator action.

## 14. Opportunity Radar

### Description

Opportunity Radar surfaces evidence-backed follow-up, refresh, and growth opportunities from current channel performance.

### Inputs

Use the current channel, video, audience, project, or analytics context relevant to this widget.

### Workflow

Open the widget → review the available context → use its controls or analysis → review the result → act on it in the relevant ViewTube workflow.

### Outputs

Opportunity Radar surfaces evidence-backed follow-up, refresh, and growth opportunities from current channel performance.

### Connections

- **Analytics** — supplies relevant channel, video, audience, or performance evidence.
- **Projects / Studio Hub** — receives findings or outputs that need a creator action.

## 15. Content Pipeline

### Description

Content Pipeline shows content moving from idea through production, readiness, and publication so creators can manage their production flow.

### Inputs

Use the current channel, video, audience, project, or analytics context relevant to this widget.

### Workflow

Open the widget → review the available context → use its controls or analysis → review the result → act on it in the relevant ViewTube workflow.

### Outputs

Content Pipeline shows content moving from idea through production, readiness, and publication so creators can manage their production flow.

### Connections

- **Analytics** — supplies relevant channel, video, audience, or performance evidence.
- **Projects / Studio Hub** — receives findings or outputs that need a creator action.

## 16. Audience Requests

### Description

Audience Requests surfaces recurring viewer questions and requests and helps turn promising audience demand into content opportunities.

### Inputs

Use the current channel, video, audience, project, or analytics context relevant to this widget.

### Workflow

Open the widget → review the available context → use its controls or analysis → review the result → act on it in the relevant ViewTube workflow.

### Outputs

Audience Requests surfaces recurring viewer questions and requests and helps turn promising audience demand into content opportunities.

### Connections

- **Analytics** — supplies relevant channel, video, audience, or performance evidence.
- **Projects / Studio Hub** — receives findings or outputs that need a creator action.

## 17. Video Asset Engine

### Description

Video Asset Engine helps package, inspect, organize, and hand off durable creator assets for reuse across ViewTube workflows.

### Inputs

Use the current channel, video, audience, project, or analytics context relevant to this widget.

### Workflow

Open the widget → review the available context → use its controls or analysis → review the result → act on it in the relevant ViewTube workflow.

### Outputs

Video Asset Engine helps package, inspect, organize, and hand off durable creator assets for reuse across ViewTube workflows.

### Connections

- **Analytics** — supplies relevant channel, video, audience, or performance evidence.
- **Projects / Studio Hub** — receives findings or outputs that need a creator action.

## 18. Publishing Command

### Description

Publishing Command helps run the final preflight and launch process for a video before it moves into publishing.

### Inputs

Use the current channel, video, audience, project, or analytics context relevant to this widget.

### Workflow

Open the widget → review the available context → use its controls or analysis → review the result → act on it in the relevant ViewTube workflow.

### Outputs

Publishing Command helps run the final preflight and launch process for a video before it moves into publishing.

### Connections

- **Analytics** — supplies relevant channel, video, audience, or performance evidence.
- **Projects / Studio Hub** — receives findings or outputs that need a creator action.

## 19. Channel Progress

### Description

Channel Progress compares current channel performance with active growth targets and shows where the creator should focus next.

### Inputs

Use the current channel, video, audience, project, or analytics context relevant to this widget.

### Workflow

Open the widget → review the available context → use its controls or analysis → review the result → act on it in the relevant ViewTube workflow.

### Outputs

Channel Progress compares current channel performance with active growth targets and shows where the creator should focus next.

### Connections

- **Analytics** — supplies relevant channel, video, audience, or performance evidence.
- **Projects / Studio Hub** — receives findings or outputs that need a creator action.

## 20. Video Director

### Description

Video Director provides a quick way to direct, storyboard, vary, and execute generated video from the dashboard.

### Inputs

Provide the relevant content, creator context, and available source assets.

### Workflow

Provide the source context → configure the available controls → create or edit → review the result → send it to the next workflow.

### Outputs

Video Director provides a quick way to direct, storyboard, vary, and execute generated video from the dashboard.

### Connections

- **Studio Hub** — receives creative, publishing, or optimization work.
- **Projects / Content Pipeline** — carries selected work into production.

## 21. Shorts Multiplier

### Description

Shorts Multiplier helps turn existing content into repost-ready Shorts variants with trim and scheduling plans.

### Inputs

Provide the relevant content, creator context, and available source assets.

### Workflow

Provide the source context → configure the available controls → create or edit → review the result → send it to the next workflow.

### Outputs

Shorts Multiplier helps turn existing content into repost-ready Shorts variants with trim and scheduling plans.

### Connections

- **Studio Hub** — receives creative, publishing, or optimization work.
- **Projects / Content Pipeline** — carries selected work into production.

## 22. Image Generator

### Description

Image Generator creates images with style controls and sends the results into other creator workflows.

### Inputs

Provide the relevant content, creator context, and available source assets.

### Workflow

Provide the source context → configure the available controls → create or edit → review the result → send it to the next workflow.

### Outputs

Image Generator creates images with style controls and sends the results into other creator workflows.

### Connections

- **Studio Hub** — receives creative, publishing, or optimization work.
- **Projects / Content Pipeline** — carries selected work into production.

## 23. Video Uploader

### Description

Video Uploader helps prepare a video, thumbnail, metadata, publishing options, and ad-suitability information for upload and publication.

### Inputs

Provide the relevant content, creator context, and available source assets.

### Workflow

Provide the source context → configure the available controls → create or edit → review the result → send it to the next workflow.

### Outputs

Video Uploader helps prepare a video, thumbnail, metadata, publishing options, and ad-suitability information for upload and publication.

### Connections

- **Studio Hub** — receives creative, publishing, or optimization work.
- **Projects / Content Pipeline** — carries selected work into production.

## 24. Video Manager

### Description

Video Manager helps manage a published video by reviewing and updating its thumbnail, title, description, tags, metadata, and ad-suitability settings.

### Inputs

Provide the relevant content, creator context, and available source assets.

### Workflow

Provide the source context → configure the available controls → create or edit → review the result → send it to the next workflow.

### Outputs

Video Manager helps manage a published video by reviewing and updating its thumbnail, title, description, tags, metadata, and ad-suitability settings.

### Connections

- **Studio Hub** — receives creative, publishing, or optimization work.
- **Projects / Content Pipeline** — carries selected work into production.

## 25. Traffic Sources

### Description

Traffic Sources shows where views come from, including Search, Suggested, Browse, and external sources.

### Inputs

Use the current channel, video, audience, project, or analytics context relevant to this widget.

### Workflow

Open the widget → review the available context → use its controls or analysis → review the result → act on it in the relevant ViewTube workflow.

### Outputs

Traffic Sources shows where views come from, including Search, Suggested, Browse, and external sources.

### Connections

- **Analytics** — supplies relevant channel, video, audience, or performance evidence.
- **Projects / Studio Hub** — receives findings or outputs that need a creator action.

## 26. Long vs Short

### Description

Long vs Short compares long-form and Shorts performance to show how each format contributes to different growth outcomes.

### Inputs

Use the current channel, video, audience, project, or analytics context relevant to this widget.

### Workflow

Open the widget → review the available context → use its controls or analysis → review the result → act on it in the relevant ViewTube workflow.

### Outputs

Long vs Short compares long-form and Shorts performance to show how each format contributes to different growth outcomes.

### Connections

- **Analytics** — supplies relevant channel, video, audience, or performance evidence.
- **Projects / Studio Hub** — receives findings or outputs that need a creator action.

## 27. Published Momentum

### Description

Published Momentum shows when an audience is most active to help time uploads for stronger initial velocity.

### Inputs

Use the current channel, video, audience, project, or analytics context relevant to this widget.

### Workflow

Open the widget → review the available context → use its controls or analysis → review the result → act on it in the relevant ViewTube workflow.

### Outputs

Published Momentum shows when an audience is most active to help time uploads for stronger initial velocity.

### Connections

- **Analytics** — supplies relevant channel, video, audience, or performance evidence.
- **Projects / Studio Hub** — receives findings or outputs that need a creator action.

## 28. Audience Matrix

### Description

Audience Matrix combines geography, device, and sharing data into a unified view of audience behavior.

### Inputs

Use the current channel, video, audience, project, or analytics context relevant to this widget.

### Workflow

Open the widget → review the available context → use its controls or analysis → review the result → act on it in the relevant ViewTube workflow.

### Outputs

Audience Matrix combines geography, device, and sharing data into a unified view of audience behavior.

### Connections

- **Analytics** — supplies relevant channel, video, audience, or performance evidence.
- **Projects / Studio Hub** — receives findings or outputs that need a creator action.

## 29. Settings

### Description

Settings provides quick controls for dashboard visibility and channel-management preferences.

### Inputs

Use the widget's visible controls, selections, and current ViewTube interface context.

### Workflow

Open the widget → review the available controls → make the needed selection or change → continue to the relevant ViewTube workflow.

### Outputs

Settings provides quick controls for dashboard visibility and channel-management preferences.

### Connections

- **ViewTube UI system** — provides shared interface behavior and visual references.
- **Dashboard / Studio Hub** — uses the resulting settings, references, or navigation.

## 30. Keyword Overlap

### Description

Keyword Overlap maps the overlap and value among title keywords to help refine video positioning.

### Inputs

Use the current channel, video, audience, project, or analytics context relevant to this widget.

### Workflow

Open the widget → review the available context → use its controls or analysis → review the result → act on it in the relevant ViewTube workflow.

### Outputs

Keyword Overlap maps the overlap and value among title keywords to help refine video positioning.

### Connections

- **Analytics** — supplies relevant channel, video, audience, or performance evidence.
- **Projects / Studio Hub** — receives findings or outputs that need a creator action.

## 31. Retention Simulator

### Description

Retention Simulator helps identify potential pacing danger zones during editing before a video is published.

### Inputs

Use the current channel, video, audience, project, or analytics context relevant to this widget.

### Workflow

Open the widget → review the available context → use its controls or analysis → review the result → act on it in the relevant ViewTube workflow.

### Outputs

Retention Simulator helps identify potential pacing danger zones during editing before a video is published.

### Connections

- **Analytics** — supplies relevant channel, video, audience, or performance evidence.
- **Projects / Studio Hub** — receives findings or outputs that need a creator action.

## 32. Upload Scheduler

### Description

Upload Scheduler helps plan upcoming content and schedule releases to maintain a consistent publishing rhythm.

### Inputs

Provide the relevant content, creator context, and available source assets.

### Workflow

Provide the source context → configure the available controls → create or edit → review the result → send it to the next workflow.

### Outputs

Upload Scheduler helps plan upcoming content and schedule releases to maintain a consistent publishing rhythm.

### Connections

- **Studio Hub** — receives creative, publishing, or optimization work.
- **Projects / Content Pipeline** — carries selected work into production.

## 33. Thumb AI

### Description

Thumb AI evaluates thumbnail CTR potential and helps generate thumbnail variations.

### Inputs

Use the current channel, video, audience, project, or analytics context relevant to this widget.

### Workflow

Open the widget → review the available context → use its controls or analysis → review the result → act on it in the relevant ViewTube workflow.

### Outputs

Thumb AI evaluates thumbnail CTR potential and helps generate thumbnail variations.

### Connections

- **Analytics** — supplies relevant channel, video, audience, or performance evidence.
- **Projects / Studio Hub** — receives findings or outputs that need a creator action.

## 34. Quick Actions

### Description

Quick Actions provides shortcuts to common dashboard surfaces and ViewTube creator workflows.

### Inputs

Use the widget's visible controls, selections, and current ViewTube interface context.

### Workflow

Open the widget → review the available controls → make the needed selection or change → continue to the relevant ViewTube workflow.

### Outputs

Quick Actions provides shortcuts to common dashboard surfaces and ViewTube creator workflows.

### Connections

- **ViewTube UI system** — provides shared interface behavior and visual references.
- **Dashboard / Studio Hub** — uses the resulting settings, references, or navigation.

## 35. Revenue Momentum

### Description

Revenue Momentum tracks how revenue is changing over time and where revenue peaks occur.

### Inputs

Use the current channel, video, audience, project, or analytics context relevant to this widget.

### Workflow

Open the widget → review the available context → use its controls or analysis → review the result → act on it in the relevant ViewTube workflow.

### Outputs

Revenue Momentum tracks how revenue is changing over time and where revenue peaks occur.

### Connections

- **Analytics** — supplies relevant channel, video, audience, or performance evidence.
- **Projects / Studio Hub** — receives findings or outputs that need a creator action.

## 36. Title Rewriter

### Description

Title Rewriter generates title alternatives from a video's core hook and helps compare different angles.

### Inputs

Provide the relevant content, creator context, and available source assets.

### Workflow

Provide the source context → configure the available controls → create or edit → review the result → send it to the next workflow.

### Outputs

Title Rewriter generates title alternatives from a video's core hook and helps compare different angles.

### Connections

- **Studio Hub** — receives creative, publishing, or optimization work.
- **Projects / Content Pipeline** — carries selected work into production.

## 37. Description Editor

### Description

Description Editor helps edit descriptions in bulk and apply reusable SEO, link, and social blocks.

### Inputs

Provide the relevant content, creator context, and available source assets.

### Workflow

Provide the source context → configure the available controls → create or edit → review the result → send it to the next workflow.

### Outputs

Description Editor helps edit descriptions in bulk and apply reusable SEO, link, and social blocks.

### Connections

- **Studio Hub** — receives creative, publishing, or optimization work.
- **Projects / Content Pipeline** — carries selected work into production.

## 38. Hashtag Analyzer

### Description

Hashtag Analyzer shows which hashtags are trending or oversaturated and helps select relevant tags.

### Inputs

Use the current channel, video, audience, project, or analytics context relevant to this widget.

### Workflow

Open the widget → review the available context → use its controls or analysis → review the result → act on it in the relevant ViewTube workflow.

### Outputs

Hashtag Analyzer shows which hashtags are trending or oversaturated and helps select relevant tags.

### Connections

- **Analytics** — supplies relevant channel, video, audience, or performance evidence.
- **Projects / Studio Hub** — receives findings or outputs that need a creator action.

## 39. Social Channels

### Description

Social Channels provides a broader view of channel reach and engagement across longer-term trends and seasonality.

### Inputs

Use the current channel, video, audience, project, or analytics context relevant to this widget.

### Workflow

Open the widget → review the available context → use its controls or analysis → review the result → act on it in the relevant ViewTube workflow.

### Outputs

Social Channels provides a broader view of channel reach and engagement across longer-term trends and seasonality.

### Connections

- **Analytics** — supplies relevant channel, video, audience, or performance evidence.
- **Projects / Studio Hub** — receives findings or outputs that need a creator action.

## 40. Mini Calendar

### Description

Mini Calendar shows upcoming tasks and deadlines so creators can plan their work and avoid production bottlenecks.

### Inputs

Use the current channel, video, audience, project, or analytics context relevant to this widget.

### Workflow

Open the widget → review the available context → use its controls or analysis → review the result → act on it in the relevant ViewTube workflow.

### Outputs

Mini Calendar shows upcoming tasks and deadlines so creators can plan their work and avoid production bottlenecks.

### Connections

- **Analytics** — supplies relevant channel, video, audience, or performance evidence.
- **Projects / Studio Hub** — receives findings or outputs that need a creator action.

## 41. Task Stack

### Description

Task Stack helps manage production work from ideation through publishing and keep multiple edits moving.

### Inputs

Use the current channel, video, audience, project, or analytics context relevant to this widget.

### Workflow

Open the widget → review the available context → use its controls or analysis → review the result → act on it in the relevant ViewTube workflow.

### Outputs

Task Stack helps manage production work from ideation through publishing and keep multiple edits moving.

### Connections

- **Analytics** — supplies relevant channel, video, audience, or performance evidence.
- **Projects / Studio Hub** — receives findings or outputs that need a creator action.

## 42. Recent Uploads

### Description

Recent Uploads compares recent videos to identify topics, thumbnails, and releases that are currently resonating.

### Inputs

Use the current channel, video, audience, project, or analytics context relevant to this widget.

### Workflow

Open the widget → review the available context → use its controls or analysis → review the result → act on it in the relevant ViewTube workflow.

### Outputs

Recent Uploads compares recent videos to identify topics, thumbnails, and releases that are currently resonating.

### Connections

- **Analytics** — supplies relevant channel, video, audience, or performance evidence.
- **Projects / Studio Hub** — receives findings or outputs that need a creator action.

## 43. Top Performer

### Description

Top Performer analyzes the strongest-performing videos to identify patterns worth repeating.

### Inputs

Use the current channel, video, audience, project, or analytics context relevant to this widget.

### Workflow

Open the widget → review the available context → use its controls or analysis → review the result → act on it in the relevant ViewTube workflow.

### Outputs

Top Performer analyzes the strongest-performing videos to identify patterns worth repeating.

### Connections

- **Analytics** — supplies relevant channel, video, audience, or performance evidence.
- **Projects / Studio Hub** — receives findings or outputs that need a creator action.

## 44. Alerts Feed

### Description

Alerts Feed brings important channel, performance, publishing, and workflow alerts into one place so creators can respond quickly.

### Inputs

Use the current channel, video, audience, project, or analytics context relevant to this widget.

### Workflow

Open the widget → review the available context → use its controls or analysis → review the result → act on it in the relevant ViewTube workflow.

### Outputs

Alerts Feed brings important channel, performance, publishing, and workflow alerts into one place so creators can respond quickly.

### Connections

- **Analytics** — supplies relevant channel, video, audience, or performance evidence.
- **Projects / Studio Hub** — receives findings or outputs that need a creator action.

## 45. News Ticker

### Description

News Ticker keeps creators informed about relevant YouTube news, platform changes, trends, and creator-impacting updates.

### Inputs

Use the current channel, video, audience, project, or analytics context relevant to this widget.

### Workflow

Open the widget → review the available context → use its controls or analysis → review the result → act on it in the relevant ViewTube workflow.

### Outputs

News Ticker keeps creators informed about relevant YouTube news, platform changes, trends, and creator-impacting updates.

### Connections

- **Analytics** — supplies relevant channel, video, audience, or performance evidence.
- **Projects / Studio Hub** — receives findings or outputs that need a creator action.

## 46. Tag Generator

### Description

Tag Generator helps generate and refine relevant tags for videos based on their content, topic, and positioning.

### Inputs

Provide the relevant content, creator context, and available source assets.

### Workflow

Provide the source context → configure the available controls → create or edit → review the result → send it to the next workflow.

### Outputs

Tag Generator helps generate and refine relevant tags for videos based on their content, topic, and positioning.

### Connections

- **Studio Hub** — receives creative, publishing, or optimization work.
- **Projects / Content Pipeline** — carries selected work into production.

## 47. Revenue Tracker

### Description

Revenue Tracker monitors channel revenue and shows changes across videos, periods, and revenue sources.

### Inputs

Use the current channel, video, audience, project, or analytics context relevant to this widget.

### Workflow

Open the widget → review the available context → use its controls or analysis → review the result → act on it in the relevant ViewTube workflow.

### Outputs

Revenue Tracker monitors channel revenue and shows changes across videos, periods, and revenue sources.

### Connections

- **Analytics** — supplies relevant channel, video, audience, or performance evidence.
- **Projects / Studio Hub** — receives findings or outputs that need a creator action.

## 48. Retention Dip

### Description

Retention Dip highlights significant audience-retention drops so creators can identify where viewers are losing interest.

### Inputs

Use the current channel, video, audience, project, or analytics context relevant to this widget.

### Workflow

Open the widget → review the available context → use its controls or analysis → review the result → act on it in the relevant ViewTube workflow.

### Outputs

Retention Dip highlights significant audience-retention drops so creators can identify where viewers are losing interest.

### Connections

- **Analytics** — supplies relevant channel, video, audience, or performance evidence.
- **Projects / Studio Hub** — receives findings or outputs that need a creator action.

## 49. Longform Optimizer

### Description

Longform Optimizer helps analyze and improve long-form videos for stronger retention, engagement, packaging, and performance.

### Inputs

Use the current channel, video, audience, project, or analytics context relevant to this widget.

### Workflow

Open the widget → review the available context → use its controls or analysis → review the result → act on it in the relevant ViewTube workflow.

### Outputs

Longform Optimizer helps analyze and improve long-form videos for stronger retention, engagement, packaging, and performance.

### Connections

- **Analytics** — supplies relevant channel, video, audience, or performance evidence.
- **Projects / Studio Hub** — receives findings or outputs that need a creator action.

## 50. Reach Funnel

### Description

Reach Funnel shows how viewers move from impressions and discovery through views and deeper channel engagement.

### Inputs

Use the current channel, video, audience, project, or analytics context relevant to this widget.

### Workflow

Open the widget → review the available context → use its controls or analysis → review the result → act on it in the relevant ViewTube workflow.

### Outputs

Reach Funnel shows how viewers move from impressions and discovery through views and deeper channel engagement.

### Connections

- **Analytics** — supplies relevant channel, video, audience, or performance evidence.
- **Projects / Studio Hub** — receives findings or outputs that need a creator action.

## 51. Algo Benchmark

### Description

Algo Benchmark compares performance signals against relevant benchmarks to help creators understand how content is performing.

### Inputs

Use the current channel, video, audience, project, or analytics context relevant to this widget.

### Workflow

Open the widget → review the available context → use its controls or analysis → review the result → act on it in the relevant ViewTube workflow.

### Outputs

Algo Benchmark compares performance signals against relevant benchmarks to help creators understand how content is performing.

### Connections

- **Analytics** — supplies relevant channel, video, audience, or performance evidence.
- **Projects / Studio Hub** — receives findings or outputs that need a creator action.

## 52. The Ad Stack

### Description

The Ad Stack organizes advertising and monetization information to help creators understand and improve ad-related performance.

### Inputs

Use the current channel, video, audience, project, or analytics context relevant to this widget.

### Workflow

Open the widget → review the available context → use its controls or analysis → review the result → act on it in the relevant ViewTube workflow.

### Outputs

The Ad Stack organizes advertising and monetization information to help creators understand and improve ad-related performance.

### Connections

- **Analytics** — supplies relevant channel, video, audience, or performance evidence.
- **Projects / Studio Hub** — receives findings or outputs that need a creator action.

## 53. Bridge Efficiency

### Description

Bridge Efficiency helps evaluate how effectively content, audience activity, and channel workflows connect to one another.

### Inputs

Use the current channel, video, audience, project, or analytics context relevant to this widget.

### Workflow

Open the widget → review the available context → use its controls or analysis → review the result → act on it in the relevant ViewTube workflow.

### Outputs

Bridge Efficiency helps evaluate how effectively content, audience activity, and channel workflows connect to one another.

### Connections

- **Analytics** — supplies relevant channel, video, audience, or performance evidence.
- **Projects / Studio Hub** — receives findings or outputs that need a creator action.

## 54. Burnout Monitor

### Description

Burnout Monitor tracks creator workload and activity patterns to identify signs of overextension and support a sustainable publishing rhythm.

### Inputs

Use the current channel, video, audience, project, or analytics context relevant to this widget.

### Workflow

Open the widget → review the available context → use its controls or analysis → review the result → act on it in the relevant ViewTube workflow.

### Outputs

Burnout Monitor tracks creator workload and activity patterns to identify signs of overextension and support a sustainable publishing rhythm.

### Connections

- **Analytics** — supplies relevant channel, video, audience, or performance evidence.
- **Projects / Studio Hub** — receives findings or outputs that need a creator action.

## 55. Collab Matchmaker

### Description

Collab Matchmaker helps identify potential collaboration opportunities by comparing creator, audience, content, and channel fit.

### Inputs

Use the current channel, video, audience, project, or analytics context relevant to this widget.

### Workflow

Open the widget → review the available context → use its controls or analysis → review the result → act on it in the relevant ViewTube workflow.

### Outputs

Collab Matchmaker helps identify potential collaboration opportunities by comparing creator, audience, content, and channel fit.

### Connections

- **Analytics** — supplies relevant channel, video, audience, or performance evidence.
- **Projects / Studio Hub** — receives findings or outputs that need a creator action.

## 56. UI Reference Library

### Description

UI Reference Library provides the shared visual reference for ViewTube's primitives, components, styles, tokens, and default widget sizes.

### Inputs

Use the widget's visible controls, selections, and current ViewTube interface context.

### Workflow

Open the widget → review the available controls → make the needed selection or change → continue to the relevant ViewTube workflow.

### Outputs

UI Reference Library provides the shared visual reference for ViewTube's primitives, components, styles, tokens, and default widget sizes.

### Connections

- **ViewTube UI system** — provides shared interface behavior and visual references.
- **Dashboard / Studio Hub** — uses the resulting settings, references, or navigation.

## 57. Video Autopsy

### Description

Video Autopsy provides a detailed post-performance review of a video to identify what worked, what failed, and what should change next.

### Inputs

Use the current channel, video, audience, project, or analytics context relevant to this widget.

### Workflow

Open the widget → review the available context → use its controls or analysis → review the result → act on it in the relevant ViewTube workflow.

### Outputs

Video Autopsy provides a detailed post-performance review of a video to identify what worked, what failed, and what should change next.

### Connections

- **Analytics** — supplies relevant channel, video, audience, or performance evidence.
- **Projects / Studio Hub** — receives findings or outputs that need a creator action.

## 58. A/B Thumbnail Test

### Description

A/B Thumbnail Test helps compare thumbnail variations and evaluate which packaging option performs better.

### Inputs

Use the current channel, video, audience, project, or analytics context relevant to this widget.

### Workflow

Open the widget → review the available context → use its controls or analysis → review the result → act on it in the relevant ViewTube workflow.

### Outputs

A/B Thumbnail Test helps compare thumbnail variations and evaluate which packaging option performs better.

### Connections

- **Analytics** — supplies relevant channel, video, audience, or performance evidence.
- **Projects / Studio Hub** — receives findings or outputs that need a creator action.

## 59. Algorithm Benchmark

### Description

Algorithm Benchmark provides a deeper comparison of algorithm-related performance signals against relevant benchmarks.

### Inputs

Use the current channel, video, audience, project, or analytics context relevant to this widget.

### Workflow

Open the widget → review the available context → use its controls or analysis → review the result → act on it in the relevant ViewTube workflow.

### Outputs

Algorithm Benchmark provides a deeper comparison of algorithm-related performance signals against relevant benchmarks.

### Connections

- **Analytics** — supplies relevant channel, video, audience, or performance evidence.
- **Projects / Studio Hub** — receives findings or outputs that need a creator action.

## 60. CPM by Geography

### Description

CPM by Geography compares estimated CPM across viewer locations to show where audience geography affects monetization.

### Inputs

Use the current channel, video, audience, project, or analytics context relevant to this widget.

### Workflow

Open the widget → review the available context → use its controls or analysis → review the result → act on it in the relevant ViewTube workflow.

### Outputs

CPM by Geography compares estimated CPM across viewer locations to show where audience geography affects monetization.

### Connections

- **Analytics** — supplies relevant channel, video, audience, or performance evidence.
- **Projects / Studio Hub** — receives findings or outputs that need a creator action.

## 61. Device Matrix

### Description

Device Matrix compares performance across viewer devices to show how audience behavior changes by device type.

### Inputs

Use the current channel, video, audience, project, or analytics context relevant to this widget.

### Workflow

Open the widget → review the available context → use its controls or analysis → review the result → act on it in the relevant ViewTube workflow.

### Outputs

Device Matrix compares performance across viewer devices to show how audience behavior changes by device type.

### Connections

- **Analytics** — supplies relevant channel, video, audience, or performance evidence.
- **Projects / Studio Hub** — receives findings or outputs that need a creator action.

## 62. Guest Ratio

### Description

Guest Ratio shows the share of audience or content activity associated with guests and compares it with the channel's broader performance.

### Inputs

Use the current channel, video, audience, project, or analytics context relevant to this widget.

### Workflow

Open the widget → review the available context → use its controls or analysis → review the result → act on it in the relevant ViewTube workflow.

### Outputs

Guest Ratio shows the share of audience or content activity associated with guests and compares it with the channel's broader performance.

### Connections

- **Analytics** — supplies relevant channel, video, audience, or performance evidence.
- **Projects / Studio Hub** — receives findings or outputs that need a creator action.

## 63. Playback Origins

### Description

Playback Origins shows where video playback begins, helping creators understand the sources and surfaces driving views.

### Inputs

Use the current channel, video, audience, project, or analytics context relevant to this widget.

### Workflow

Open the widget → review the available context → use its controls or analysis → review the result → act on it in the relevant ViewTube workflow.

### Outputs

Playback Origins shows where video playback begins, helping creators understand the sources and surfaces driving views.

### Connections

- **Analytics** — supplies relevant channel, video, audience, or performance evidence.
- **Projects / Studio Hub** — receives findings or outputs that need a creator action.

## 64. Premium Pulse

### Description

Premium Pulse tracks signals from YouTube Premium viewers and shows how premium audience activity contributes to channel performance.

### Inputs

Use the current channel, video, audience, project, or analytics context relevant to this widget.

### Workflow

Open the widget → review the available context → use its controls or analysis → review the result → act on it in the relevant ViewTube workflow.

### Outputs

Premium Pulse tracks signals from YouTube Premium viewers and shows how premium audience activity contributes to channel performance.

### Connections

- **Analytics** — supplies relevant channel, video, audience, or performance evidence.
- **Projects / Studio Hub** — receives findings or outputs that need a creator action.

## 65. Sharing DNA

### Description

Sharing DNA analyzes sharing behavior to identify what content characteristics encourage viewers to share videos.

### Inputs

Use the current channel, video, audience, project, or analytics context relevant to this widget.

### Workflow

Open the widget → review the available context → use its controls or analysis → review the result → act on it in the relevant ViewTube workflow.

### Outputs

Sharing DNA analyzes sharing behavior to identify what content characteristics encourage viewers to share videos.

### Connections

- **Analytics** — supplies relevant channel, video, audience, or performance evidence.
- **Projects / Studio Hub** — receives findings or outputs that need a creator action.

## 66. Video Comment Operator

### Description

Video Comment Operator helps review, organize, and act on viewer comments and comment-driven opportunities across videos.

### Inputs

Provide the relevant content, creator context, and available source assets.

### Workflow

Provide the source context → configure the available controls → create or edit → review the result → send it to the next workflow.

### Outputs

Video Comment Operator helps review, organize, and act on viewer comments and comment-driven opportunities across videos.

### Connections

- **Studio Hub** — receives creative, publishing, or optimization work.
- **Projects / Content Pipeline** — carries selected work into production.

# 8. Studio Hub Tools

**Canonical information hierarchy:** Description → Learn More → Inputs → Workflow → Outputs → Connections

## 8.1 Video Manager
### Description
Manage your published and unpublished videos, update video details, and keep your channel 
content organized and ready for improvement or republishing.
### Learn More
### Inputs
Select a video to manage and work with its existing title, description, thumbnail, metadata, 
publishing status, and available content information. Use the available controls to update, review, 
or move the video into another Studio workflow.
### Workflow
Select a video → review its current content and metadata → make the needed changes → send 
the updated content into the appropriate publishing, analysis, or optimization workflow.
### Outputs
Updated video information, metadata, assets, and publishing-ready content.
### Connections
- Content Analysis — analyzes the selected video to identify problems and opportunities for 
improvement.
- Thumbnail Studio — creates or replaces the video's thumbnail.
- End-Screen Architect — improves the video's end-screen path and outro.
- Video Publisher — prepares updated metadata and publishing information.
- Publishing Package — brings the video's final assets and publishing information together.
## 8.2 Video Director
### Description
Direct videos, variations, sequences, and campaigns from a shared creative direction and Video 
DNA system.
### Learn More
### Inputs
Start with a video concept, creative direction, existing content, or project context. Provide the 
source material and direction needed to define the video's structure, visuals, variations, or 
production requirements.
### Workflow
Choose the project or video → establish the creative direction → define the required production 
→ generate or organize the media → review the result and continue production or publishing.
### Outputs
Directed video concepts, production instructions, variations, sequences, campaigns, and 
supporting media assets.
### Connections
- Script Architect — provides the timed script, beats, visuals, and scene direction used for 
production.
- Hook Generator — supplies opening hooks and intros that can shape the video's opening.
- Thumbnail Studio — creates visual packaging that represents the finished video.
- Content Analysis — provides analysis that can inform creative and production improvements.
- Publishing Package — receives completed production assets for final publishing preparation.
## 8.3 Video Publisher
### Description
Create SEO-optimized titles, descriptions, tags, and other publishing information for new and 
existing videos.
### Learn More
### Inputs
Select a video or provide its content and context. Use the available metadata, analysis, audience 
information, and creative assets to generate and refine the information needed to publish the 
video.
### Workflow
Select the video → provide or review its context → generate publishing metadata → review and 
refine the results → prepare the final publishing package.
### Outputs
Titles, descriptions, tags, metadata, and other publishing information ready to use with the video.
### Connections
- Video Manager — applies or manages publishing information on the selected video.
- Thumbnail Studio — supplies the thumbnail used with the video's publishing package.
- Content Analysis — provides content findings that can inform titles, descriptions, and 
positioning.
- Publishing Package — combines publisher-generated metadata with the video's other final 
assets.
- Pre-Launch Priming — uses the prepared publishing information as part of the coordinated 
launch process.
## 8.4 Publishing Package
### Description
Bring a video's publishing details and assets together into one final readiness package.
### Learn More
### Inputs
Start with a prepared video or ContentBuild and its available metadata, thumbnail, supporting 
assets, and publishing information. Review the package's readiness and any remaining 
requirements before publishing.
### Workflow
Select the video or project → gather the required publishing assets → review metadata and 
readiness → resolve missing items → send the completed package to publishing.
### Outputs
A consolidated, publishing-ready package containing the video's required metadata, assets, and 
readiness information.
### Connections
- Video Publisher — supplies titles, descriptions, tags, and other publishing metadata.
- Thumbnail Studio — supplies the selected thumbnail and supporting visual assets.
- Pre-Launch Priming — uses the prepared package to coordinate the video's launch.
- Video Manager — provides the destination for managing the finished video's publishing 
information.
- Community Posts — can use the finished video's assets and context for launch-related posts.
## 8.5 Content Analysis
### Description
Analyze scripts and videos to identify pacing issues, retention problems, quality issues, and 
opportunities for improvement.
### Learn More
### Inputs
Provide a video, script, or available content data. Use the analysis controls and available 
metadata or context to focus the evaluation on content quality, pacing, retention, and 
performance issues.
### Workflow
Select the content → run the analysis → review identified issues and evidence → determine 
improvements → send useful findings into the appropriate Studio workflow.
### Outputs
Content analysis, identified issues, improvement opportunities, evidence, and actionable findings.
### Connections
- Video Manager — provides videos to analyze and can receive resulting improvements.
- Thumbnail Studio — uses analysis to inform thumbnail packaging and visual direction.
- Hook Generator — uses analysis to identify opportunities for stronger openings.
- Tactics Engine — converts evidence and findings into concrete creator tactics.
- End-Screen Architect — uses content context to improve the video's next-video path.
- Video Publisher — uses findings to improve publishing metadata and positioning.
## 8.6 Thumbnail Studio
### Description
Create and refine thumbnails and visual assets for your videos, end screens, Community Posts, 
polls, and more.
### Learn More
### Inputs
Start with a video, project, image, or content context. Add available metadata, analysis, hooks, or 
existing visual assets to guide the design. Generate concepts, create variations, compare 
options, and refine the design until you have the asset you want to use.
### Workflow
Choose the video or project → provide your creative context → generate thumbnail concepts → 
explore variations → compare and refine → select the final design.
### Outputs
Finished thumbnail designs and supporting visual assets ready for videos, end screens, 
Community Posts, polls, and other publishing needs.
### Connections
- Video Publisher — uses the finished thumbnail as part of the video's publishing package.
- Publishing Package — brings the selected thumbnail together with the video's other 
publishing assets and metadata.
- Community Posts — uses generated images for posts and polls.
- End-Screen Architect — can use visual assets when building the video's end-screen 
experience.
- Video Director — provides visual assets that support the video's creative and production 
direction.
## 8.7 Community Posts
### Description
Create polls and community updates that keep viewers engaged between video uploads.
### Learn More
### Inputs
Start with a video, image, topic, audience context, or existing content. Choose the post type and 
provide the context needed to generate a community update, image post, or poll.
### Workflow
Choose the post type → provide the video or campaign context → create the post or poll → 
review and refine the content and image → prepare it for publishing.
### Outputs
Community posts, polls, post copy, and supporting visual assets.
### Connections
- Thumbnail Studio — supplies images and visual assets for posts and polls.
- Video Manager — provides existing video content that can be promoted or referenced.
- Video Publisher — connects community activity with a video's publishing workflow.
- Pre-Launch Priming — uses community posts as part of the video's pre-launch and launch 
sequence.
- Publishing Package — provides final video context and assets for coordinated publishing.
## 8.8 Comment Responder
### Description
Draft on-brand replies and pinned comments that help increase engagement and guide viewers 
to relevant content.
### Learn More
### Inputs
Provide comments or comment context along with the relevant video, metadata, or content 
analysis. Use the available context to generate replies that match the creator's content and 
audience.
### Workflow
Provide comments → select the relevant video or context → generate responses → review and 
refine the replies → select responses or pinned comments to use.
### Outputs
Draft replies, pinned-comment copy, recommended responses, and relevant video 
recommendations.
### Connections
- Video Manager — provides the videos and channel content associated with comments.
- Content Analysis — supplies content context that can improve response relevance.
- Video Publisher — provides video metadata and positioning context.
- Video Manager / Video Library — provides relevant videos that can be recommended in 
replies.
## 8.9 End-Screen Architect
### Description
Design end-screen layouts and outro scripts that guide viewers toward the next video.
### Learn More
### Inputs
Start with a video and its available metadata, analysis, and content context. Define the desired 
next-video path and use the available controls to shape the end-screen layout and outro.
### Workflow
Select the video → review its content and available next-video options → design the end-screen 
flow → create the outro copy → review the viewer path → finalize the end-screen plan.
### Outputs
End-screen layouts, next-video recommendations, outro scripts, and viewer-flow metadata.
### Connections
- Content Analysis — identifies content context and opportunities for stronger viewer 
continuation.
- Video Manager — provides the source video and its available channel content.
- Thumbnail Studio — supplies visual assets used in the end-screen experience.
- Video Publisher — uses the resulting metadata and outro information when preparing the 
video.
- Video Director — can incorporate the outro and end-screen direction into production.
## 8.10 Pre-Launch Priming
### Description
Plan the rollout before publishing with coordinated warm-up content and launch tactics.
### Learn More
### Inputs
Start with a prepared video, thumbnail, metadata, analysis, or project. Use the available content 
and launch context to determine the steps, timing, and supporting activities needed before 
publication.
### Workflow
Select the upcoming video → review its readiness → define the pre-launch activities → create 
warm-up tactics and supporting content → organize the launch sequence.
### Outputs
Pre-launch plans, launch tactics, warm-up activities, supporting metadata, and coordinated 
project steps.
### Connections
- Publishing Package — provides the prepared video, metadata, and assets that the launch 
plan supports.
- Thumbnail Studio — supplies the thumbnail and visual assets needed for promotion.
- Community Posts — executes warm-up posts, polls, and audience engagement.
- Video Publisher — provides the publishing information used to coordinate the launch.
- Content Analysis — provides evidence and findings that can inform launch tactics.
## 8.11 Hook Generator
### Description
Generate strong opening hooks and intros designed to capture attention in the first moments of a 
video.
### Learn More
### Inputs
Provide a script, video, topic, strategy, analysis, or metadata. Use the available context to 
generate hooks that match the video's subject, audience, and intended direction.
### Workflow
Provide the content context → generate hook options → compare the openings → refine the 
strongest option → use the selected hook in the script or video.
### Outputs
Opening hooks, intro variations, and revised script openings.
### Connections
- Script Architect — incorporates the selected hook into the timed script and overall structure.
- Content Analysis — identifies opening and retention opportunities that can guide hook 
generation.
- Tactics Engine — provides strategy and tactics that can influence the hook direction.
- Video Director — uses the selected hook to guide the video's opening production.
- Video Publisher — can use the video's opening positioning when preparing publishing 
metadata.
## 8.12 Tactics Engine
### Description
Turn channel evidence and strategy into concrete creator actions you can use, test, and execute.
### Learn More
### Inputs
Provide analysis, evidence, video or channel context, metadata, audience information, and 
strategic goals. Use the available context to focus the generated tactics on a specific content or 
growth objective.
### Workflow
Provide the evidence and goal → generate strategic tactics → review and prioritize the 
recommendations → select actionable tactics → apply them to the relevant project or content 
workflow.
### Outputs
Actionable tactics, strategic recommendations, and project-level actions.
### Connections
- Content Analysis — provides evidence and findings that become inputs for tactical 
recommendations.
- Hook Generator — uses tactics to guide stronger openings and hooks.
- Pre-Launch Priming — turns selected tactics into launch and warm-up actions.
- Video Director — applies relevant tactics to creative and production decisions.
- Script Architect — can use strategic direction to shape script structure and content choices.
## 8.13 Script Architect
### Description
Turn an idea or complete creative brief into a timed script, visual direction, and production-ready 
content plan.
### Learn More
### Inputs
Start with a spark, topic, chosen angle, or complete brief. Provide available research, evidence, 
strategy, hooks, and content context, then set the desired script direction and length.
### Workflow
Provide the idea or brief → choose the angle → build the structure → generate the timed script 
and visual direction → review the beats and transitions → refine the final production plan.
### Outputs
Timed scripts, structured beats, visual direction, storyboard-ready scene packets, and priming 
Shorts.
### Connections
- Hook Generator — supplies and improves the opening hook used by the script.
- Tactics Engine — provides strategic direction that can shape the script and content angle.
- Content Analysis — provides evidence and improvement findings that can inform the script.
- Video Director — takes the script and visual direction into production.
- Thumbnail Studio — uses the finished content direction to inform visual packaging.
- Pre-Launch Priming — can use the resulting content and priming Shorts as part of the launch
plan.