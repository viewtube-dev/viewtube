# ViewTube Analytics

**Status:** REPORTED / CANONICAL TOOL AUTHORITY TARGET  
**Scope:** Analytics page tools

## Purpose
Analytics turns synchronized YouTube data into structured evidence, visual understanding, findings, and creator actions.

## Four tools

| Tool | Primary job |
|---|---|
| Sync Controller | synchronize and refresh analytics data |
| Intelligence Hub | interpret data into findings, opportunities and recommendations |
| Master Data Tables | provide structured/queryable analytics datasets |
| Data Visuals | turn analytics data into charts, comparisons and visual evidence |

## Flow
```text
YouTube data
  ↓
Sync Controller
  ↓
Master Data Tables
  ├── Data Visuals
  └── Intelligence Hub
          ↓
       AI Brain / Projects
```

## Tool contracts

### Sync Controller
**Inputs:** connected channel, sync scope, date range, refresh controls.  
**Outputs:** synchronized datasets, sync status and refresh information.

### Intelligence Hub
**Inputs:** master data, channel/video/audience data, goals and comparison periods.  
**Outputs:** findings, trends, opportunities, explanations and recommendations.

### Master Data Tables
**Inputs:** synchronized YouTube data, video/channel/audience/traffic/revenue/retention data.  
**Outputs:** normalized structured datasets for downstream analytics.

### Data Visuals
**Inputs:** datasets, metrics, dimensions, filters, date ranges and comparisons.  
**Outputs:** charts, trends, comparisons and visual evidence.

## Brain relationship
Analytics supplies **evidence**. The Brain should distinguish evidence from Resource Library knowledge, current research and creator context.

## Current state
The repository establishes this four-tool architecture, but implementation status of every boundary requires current-runtime verification.

**Primary source:** Creator Workspaces Master Tool Context.


## Recovered Analytics / Data Visuals requirements — 2026-10-04

**Status:** REPORTED / RECOVERED CONVERSATION REQUIREMENTS  
**Source:** Current ViewTube conversation, including screenshots of the Analytics/Data Visuals surface and discussion of the analytics test data.  
**Authority:** This section records requirements and observed behavior; it does not claim current-main runtime implementation.

### Required data views and dimensions

The Data Visuals test/data model discussed in the conversation requires distinct evidence for:

1. **Traffic by day** — all seven days of the week must be represented, not only a partial subset.
2. **Videos** — video-level statistics must be available as records that can be compared across videos.
3. **Countries** — country/geography must be a usable dimension for comparison.
4. **Daily** — daily time-series statistics must exist across multiple dates.
5. **Upload times** — upload timing analysis must cover **all days of the week and time-of-day ranges**, so the system can compare day-of-week and time-of-day effects rather than a narrow sample.
6. **Successful videos** — successful-video examples must occur at **different dates and different times**, with enough temporal variation to test whether success is consistent rather than an artifact of identical or clustered timestamps.

### Data-quality / fixture rule

Analytics fixtures should contain temporally diverse records. A successful-video dataset should deliberately vary upload dates, days of week, and times of day while retaining enough repeated observations to evaluate consistency.

This is a **test/data-model requirement**, not evidence that the current runtime already satisfies it.

### Import interoperability requirement

The conversation also exposed a failed attempt to import a versioned JSON analytics bundle into the running `viewtube.live/local-analytics` surface. The UI reported:

> THIS IS NOT A VIEWTUBE ANALYTICS BUNDLE.

A practical recovery direction is to support **individual CSV datasets** as a first-class import path for Analytics fixtures, alongside a validated bundle format. The exact accepted schema and bundle contract remain **UNKNOWN** from current-main inspection and must be established from code before implementation is claimed.

### Screenshot evidence preserved

The conversation captured Analytics table surfaces for:
- traffic/engagement-style metrics;
- video-level watch/revenue/card/playlist metrics;
- country/dimension-style tables;
- daily statistics;
- revenue and watch sections.

These screenshots are evidence of the conversation's observed UI/data shape, not proof of canonical current-main implementation.
