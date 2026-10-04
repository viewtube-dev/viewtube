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
Create and configure a project that keeps its brief, goals, content, assets, tasks, and publishing work together.

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
Manage projects through their production lifecycle and see what is planned, active, blocked, ready, or complete.

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
Plan project timing, deadlines, production milestones, and publishing activity in a calendar view.

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
Turn a project's creative direction into an organized visual plan for scenes, beats, shots, and production.

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
Provide channel-aware intelligence, conversation, reasoning, and orchestration across ViewTube's creator workflows.

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
Control the synchronization of YouTube and ViewTube analytics data so downstream analytics surfaces use current, traceable datasets.

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
Turn synchronized channel data into higher-level performance intelligence, findings, opportunities, and decisions.

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
Provide the structured, queryable analytics datasets that form the canonical data foundation for ViewTube analytics.

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
Turn ViewTube analytics data into charts, graphs, comparisons, and visual performance views.

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
Store, organize, inspect, version, and reuse creator assets across projects and ViewTube production workflows.

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
Edit and compose video from media, scenes, audio, captions, overlays, and other production assets on a timeline.

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
Provide a searchable, organized collection of ViewTube documentation, guides, references, playbooks, and reusable creator resources.

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
