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
