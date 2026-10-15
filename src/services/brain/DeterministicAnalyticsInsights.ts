import type {
 CanonicalIntelligenceDatasetManifest,
 CanonicalIntelligenceDatasetRows,
 CanonicalIntelligenceEvidenceBundle,
} from "../analytics-canon"
import { compareEvidenceRecords, projectCanonicalEvidenceRecords, type DerivedSignal } from "./EvidenceRecord"
import type { ViewTubeAnomaly } from "../anomaly-intelligence/contracts"

export type DeterministicAnalyticsInsightKind =
 | "comparison"
 | "material-change"
 | "contribution"
 | "trend"
 | "anomaly"

export interface AnalyticsInsightPeriod {
 label: string
 /** Explicit inclusive calendar date in YYYY-MM-DD form; never inferred by this service. */
 startDate: string
 /** Explicit inclusive calendar date in YYYY-MM-DD form; never inferred by this service. */
 endDate: string
}

export interface AnalyticsInsightEvidencePeriod {
 bundle: CanonicalIntelligenceEvidenceBundle
 period: AnalyticsInsightPeriod
}

export interface DeterministicAnalyticsInsight {
 id: string
 kind: DeterministicAnalyticsInsightKind
 findingType: DeterministicAnalyticsInsightKind
 label: string
 channelId: string
 projectId?: string | null
 entity?: string | null
 datasetId: string
 metric: string
 /** Flat, explicit calculation filters; no implicit UI state is permitted. */
 filters: Record<string, string | number | boolean | null>
 window?: string | null
 sourceSnapshotIds: string[]
 sourceObservedAt?: string | null
 aggregation: "sum" | "average"
 observedFact: {
  currentValue: number
  baselineValue: number | null
  delta: number | null
  relativeDeltaPercent: number | null
  sharePercent?: number
 }
 calculation: {
  formula: string
  algorithmVersion: "vt-deterministic-analytics-insights-v1"
  deterministic: true
 }
 validationState: "validated"
 /** Reserved for a separately authored explanation; deterministic calculation never fabricates interpretation. */
 interpretation: string | null
 /** Reserved for a goal-aware, separately validated recommendation. */
 recommendation: string | null
 trend?: {
  direction: "increasing" | "decreasing" | "stable"
  slopePerObservation: number
  observationCount: number
  firstDate: string
  lastDate: string
 }
 currentValue: number
 baselineValue: number | null
 delta: number | null
 /** Percentage of relative change; null when a valid percentage is undefined. */
 relativeDeltaPercent: number | null
 /** Contribution share, 0–100, only for contribution findings. */
 sharePercent?: number
 unit: "source-metric-value" | "percent"
 confidence: number
 evidenceRefs: string[]
 formula: string
 algorithmVersion: "vt-deterministic-analytics-insights-v1"
 deterministic: true
 period?: {
  current: AnalyticsInsightPeriod
  baseline: AnalyticsInsightPeriod
  window: CanonicalIntelligenceEvidenceBundle["selectedWindow"]
 }
 limitations: string[]
}

export interface PeriodComparisonResult {
 insights: DeterministicAnalyticsInsight[]
 blockedReasons: string[]
}

export interface TrafficContributionResult {
 insights: DeterministicAnalyticsInsight[]
 limitations: string[]
}

export interface TrendInsightResult {
 insights: DeterministicAnalyticsInsight[]
 limitations: string[]
}

const ALGORITHM_VERSION = "vt-deterministic-analytics-insights-v1" as const

const isValidDate = (value: string): boolean => {
 if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false
 const date = new Date(`${value}T00:00:00.000Z`)
 return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value
}

const inclusiveDayCount = (period: AnalyticsInsightPeriod): number =>
 (Date.parse(`${period.endDate}T00:00:00.000Z`) - Date.parse(`${period.startDate}T00:00:00.000Z`)) / 86_400_000 + 1

const validPeriod = (period: AnalyticsInsightPeriod): boolean =>
 isValidDate(period.startDate)
 && isValidDate(period.endDate)
 && period.startDate <= period.endDate
 && Boolean(period.label.trim())

const metricAggregation = (metric: string): "sum" | null => {
 const key = metric.toLowerCase()
 // The current canonical summary contract exposes row count/sum/arithmetic
 // average, but not enough denominator metadata to aggregate rates correctly.
 if (
  key.includes("average")
  || key.startsWith("avg")
  || key === "ctr"
  || key.endsWith("_ctr")
  || key.includes("percent")
  || key.includes("percentage")
  || key.includes("ratio")
  || key.includes("rate")
  || key.includes("rpm")
  || key.includes("cpm")
  || key.includes("duration")
 ) return null
 return "sum"
}

const valueFor = (
 dataset: CanonicalIntelligenceDatasetManifest,
 metric: string,
 aggregation: "sum",
): number | null => {
 const summary = dataset.metrics[metric]
 if (!summary) return null
 const value = summary.sum
 return Number.isFinite(value) ? value : null
}

const slug = (value: string): string =>
 value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 48)

const stableHash = (value: string): string => {
 let hash = 0x811c9dc5
 for (let index = 0; index < value.length; index += 1) {
  hash ^= value.charCodeAt(index)
  hash = Math.imul(hash, 0x01000193)
 }
 return (hash >>> 0).toString(16).padStart(8, "0")
}

const metricEvidenceRef = (snapshotId: string, datasetId: string, metric: string): string =>
 `analytics:${snapshotId}:${datasetId}:${metric}`

const evidenceRefsFor = (
 current: CanonicalIntelligenceDatasetManifest,
 currentBundle: CanonicalIntelligenceEvidenceBundle,
 baseline: CanonicalIntelligenceDatasetManifest,
 baselineBundle: CanonicalIntelligenceEvidenceBundle,
 metric: string,
): string[] => [...new Set([
 ...current.evidenceRefs,
 ...baseline.evidenceRefs,
 metricEvidenceRef(currentBundle.snapshotId, current.id, metric),
 metricEvidenceRef(baselineBundle.snapshotId, baseline.id, metric),
])].sort()

/**
 * Deterministic comparison over two canonical evidence bundles.
 *
 * The caller must supply explicit period boundaries. This function refuses
 * to infer dates from snapshot timestamps or treat absent metrics as zero.
 */
export const buildPeriodComparisonInsights = (input: {
 baseline: AnalyticsInsightEvidencePeriod
 current: AnalyticsInsightEvidencePeriod
 minimumMaterialChangePercent?: number
}): PeriodComparisonResult => {
 const { baseline, current } = input
 const blockedReasons = new Set<string>()
 const insights: DeterministicAnalyticsInsight[] = []
 const baselineBundle = baseline.bundle
 const currentBundle = current.bundle

 if (!baselineBundle.channelId || !currentBundle.channelId) {
  blockedReasons.add("Both periods must have a known channel identity.")
 }
 if (baselineBundle.channelId !== currentBundle.channelId) {
  blockedReasons.add("Channel identity does not match.")
 }
 if (baselineBundle.selectedWindow !== currentBundle.selectedWindow) {
  blockedReasons.add("Canonical reporting-window semantics do not match.")
 }
 if (!validPeriod(baseline.period) || !validPeriod(current.period)) {
  blockedReasons.add("Period boundaries must be valid YYYY-MM-DD dates.")
 }
 if (validPeriod(baseline.period) && validPeriod(current.period)) {
  if (baseline.period.endDate >= current.period.startDate) {
   blockedReasons.add("Comparison periods overlap or are not in chronological order.")
  }
  if (inclusiveDayCount(baseline.period) !== inclusiveDayCount(current.period)) {
   blockedReasons.add("Comparison periods have different inclusive day counts.")
  }
  const expectedDays: Record<string, number> = { "7d": 7, "28d": 28, "90d": 90, "365d": 365 }
  const window = currentBundle.selectedWindow as string
  if (window === "lifetime") {
   blockedReasons.add("Lifetime snapshots cannot be treated as equal-length reporting periods.")
  } else if (expectedDays[window] !== undefined
   && (inclusiveDayCount(baseline.period) !== expectedDays[window]
    || inclusiveDayCount(current.period) !== expectedDays[window])) {
   blockedReasons.add("Explicit period lengths do not match the selected canonical reporting window.")
  }
 }
 if (baselineBundle.snapshotId === currentBundle.snapshotId) {
  blockedReasons.add("Baseline and current evidence must refer to distinct source snapshots.")
 }
 if (blockedReasons.size > 0) return { insights, blockedReasons: [...blockedReasons].sort() }

 const baselineById = new Map<string, CanonicalIntelligenceDatasetManifest>(
  baselineBundle.datasets.map((dataset) => [dataset.id, dataset] as const),
 )
 const baselineEvidenceByMetric = new Map<string, ReturnType<typeof projectCanonicalEvidenceRecords>[number]>(
  projectCanonicalEvidenceRecords(baselineBundle).map((record) => [`${record.datasetId}:${record.metric}`, record] as const),
 )
 const currentEvidenceByMetric = new Map<string, ReturnType<typeof projectCanonicalEvidenceRecords>[number]>(
  projectCanonicalEvidenceRecords(currentBundle).map((record) => [`${record.datasetId}:${record.metric}`, record] as const),
 )
 const materialThreshold = input.minimumMaterialChangePercent ?? 20
 if (!Number.isFinite(materialThreshold) || materialThreshold <= 0) {
  return {
   insights: [],
   blockedReasons: ["Minimum material-change threshold must be a finite positive percentage."],
  }
 }

 for (const currentDataset of [...currentBundle.datasets].sort((a, b) => a.id.localeCompare(b.id))) {
  const baselineDataset = baselineById.get(currentDataset.id)
  if (!baselineDataset) {
   blockedReasons.add(`Dataset ${currentDataset.id} is missing from the baseline period.`)
   continue
  }
  if (currentDataset.status !== "available" || baselineDataset.status !== "available") {
   blockedReasons.add(`Dataset ${currentDataset.id} is not fully available in both periods.`)
   continue
  }

  const metrics = [...new Set([
   ...Object.keys(currentDataset.metrics),
   ...Object.keys(baselineDataset.metrics),
  ])].sort()

  for (const metric of metrics) {
   if (!Object.prototype.hasOwnProperty.call(currentDataset.metrics, metric)) {
    blockedReasons.add(`Metric ${metric} is missing from the current period in dataset ${currentDataset.id}.`)
    continue
   }
   if (!Object.prototype.hasOwnProperty.call(baselineDataset.metrics, metric)) {
    blockedReasons.add(`Metric ${metric} is missing from the baseline period in dataset ${currentDataset.id}.`)
    continue
   }
   if (currentDataset.missingMetrics.includes(metric) || baselineDataset.missingMetrics.includes(metric)) {
    blockedReasons.add(`Metric ${metric} is marked missing in dataset ${currentDataset.id}.`)
    continue
   }
   const aggregation = metricAggregation(metric)
   if (!aggregation) {
    blockedReasons.add(`Metric ${metric} in dataset ${currentDataset.id} requires denominator-aware aggregation not provided by the canonical summary contract.`)
    continue
   }
   const currentValue = valueFor(currentDataset, metric, aggregation)
   const baselineValue = valueFor(baselineDataset, metric, aggregation)
   if (currentValue === null || baselineValue === null) {
    blockedReasons.add(`Metric ${metric} in dataset ${currentDataset.id} has no finite value in both periods.`)
    continue
   }
   const evidenceKey = `${currentDataset.id}:${metric}`
   const currentEvidence = currentEvidenceByMetric.get(evidenceKey)
   const baselineEvidence = baselineEvidenceByMetric.get(evidenceKey)
   if (!currentEvidence || !baselineEvidence) {
    blockedReasons.add(`Metric ${metric} in dataset ${currentDataset.id} lacks a canonical evidence record for comparability validation.`)
    continue
   }
   const comparability = compareEvidenceRecords(baselineEvidence, currentEvidence)
   if (!comparability.comparable) {
    blockedReasons.add(`Metric ${metric} in dataset ${currentDataset.id} is not comparable: ${comparability.reasons.join(" ")}`)
    continue
   }

   const delta = currentValue - baselineValue
   const relativeDeltaPercent = baselineValue === 0 ? null : (delta / Math.abs(baselineValue)) * 100
   const evidenceRefs = evidenceRefsFor(
    currentDataset,
    currentBundle,
    baselineDataset,
    baselineBundle,
    metric,
   )
   const identity = [
    currentBundle.channelId,
    currentDataset.id,
    metric,
    baseline.period.startDate,
    baseline.period.endDate,
    current.period.startDate,
    current.period.endDate,
   ].join(":")

   const limitations = [
    ...(relativeDeltaPercent === null ? ["Relative change is undefined because the baseline value is zero."] : []),
    "Comparison is descriptive and does not establish causation.",
   ]
   const common = {
    channelId: currentBundle.channelId as string,
    datasetId: currentDataset.id,
    metric,
    aggregation,
    currentValue,
    baselineValue,
    delta,
    relativeDeltaPercent,
    unit: "source-metric-value" as const,
    confidence: 0.9,
    evidenceRefs,
    formula: "current=sum; baseline=sum; delta=current-baseline; relativeDeltaPercent=(delta/abs(baseline))*100 when baseline!=0",
    algorithmVersion: ALGORITHM_VERSION,
    deterministic: true as const,
    findingType: "comparison" as const,
    filters: {
     window: currentBundle.selectedWindow,
     baselineStartDate: baseline.period.startDate,
     baselineEndDate: baseline.period.endDate,
     currentStartDate: current.period.startDate,
     currentEndDate: current.period.endDate,
    },
    window: currentBundle.selectedWindow,
    sourceSnapshotIds: [...new Set([baselineBundle.snapshotId, currentBundle.snapshotId])].sort(),
    sourceObservedAt: currentBundle.capturedAt,
    observedFact: {
     currentValue,
     baselineValue,
     delta,
     relativeDeltaPercent,
    },
    calculation: {
     formula: "current=sum; baseline=sum; delta=current-baseline; relativeDeltaPercent=(delta/abs(baseline))*100 when baseline!=0",
     algorithmVersion: ALGORITHM_VERSION,
     deterministic: true as const,
    },
    validationState: "validated" as const,
    interpretation: null,
    recommendation: null,
    period: {
     current: { ...current.period },
     baseline: { ...baseline.period },
     window: currentBundle.selectedWindow,
    },
    limitations,
   }

   insights.push({
    ...common,
    id: `analytics-insight:comparison:${slug(currentDataset.id)}:${slug(metric)}:${stableHash(identity)}`,
    kind: "comparison",
    label: `${metric} changed from ${baselineValue} to ${currentValue}`,
   })

   if (relativeDeltaPercent !== null && Math.abs(relativeDeltaPercent) >= materialThreshold) {
    insights.push({
     ...common,
     observedFact: { currentValue, baselineValue, delta, relativeDeltaPercent },
     id: `analytics-insight:material-change:${slug(currentDataset.id)}:${slug(metric)}:${stableHash(identity)}`,
     kind: "material-change",
     label: `${metric} ${delta >= 0 ? "increased" : "decreased"} ${Math.abs(relativeDeltaPercent).toFixed(1)}% versus baseline`,
     formula: `period-comparison formula; emit material-change when abs(relativeDeltaPercent)>=${materialThreshold}`,
     calculation: {
      formula: `period-comparison formula; emit material-change when abs(relativeDeltaPercent)>=${materialThreshold}`,
      algorithmVersion: ALGORITHM_VERSION,
      deterministic: true as const,
     },
     findingType: "material-change" as const,
     limitations: [
      ...limitations,
      "Threshold-based materiality is not a statistical significance test.",
     ],
    })
   }
  }
 }

 return {
  insights: insights.sort((a, b) => a.id.localeCompare(b.id)),
  blockedReasons: [...blockedReasons].sort(),
 }
}

/**
 * Groups complete canonical dataset rows into source contributions.
 * Do not pass report-bundle sampleRows here: those are deliberately bounded.
 */
export const buildTrafficSourceContributionInsights = (input: {
 dataset: CanonicalIntelligenceDatasetRows
 metricKey: string
 dimensionKey: string
 /** Required expected count from the canonical row query; mismatch or omission fails closed. */
 sourceRowCount: number
}): TrafficContributionResult => {
 const { dataset, metricKey, dimensionKey } = input
 const aggregation = metricAggregation(metricKey)
 if (dataset.status !== "available") {
  return { insights: [], limitations: [`Dataset ${dataset.datasetId} is not fully available.`] }
 }
 if (!dataset.channelId) {
  return { insights: [], limitations: ["Traffic contribution requires a known channel identity."] }
 }
 if (dataset.missingMetrics.includes(metricKey)) {
  return { insights: [], limitations: [`Metric ${metricKey} is marked missing by the canonical dataset.`] }
 }
 if (!aggregation) {
  return { insights: [], limitations: [`Metric ${metricKey} requires denominator-aware aggregation; source contributions are unsupported for this metric.`] }
 }
 if (dataset.rows.length === 0) {
  return { insights: [], limitations: ["Traffic contribution requires at least one canonical row."] }
 }
 if (!Number.isInteger(input.sourceRowCount) || input.sourceRowCount < 0 || input.sourceRowCount !== dataset.rows.length) {
  return { insights: [], limitations: ["Canonical row count does not match the supplied complete-row count."] }
 }

 const grouped = new Map<string, number>()
 for (const [index, row] of dataset.rows.entries()) {
  const dimension = row[dimensionKey]
  const metricValue = row[metricKey]
  if (typeof dimension !== "string" || !dimension.trim()) {
   return { insights: [], limitations: [`Canonical row ${index} has no usable ${dimensionKey} dimension.`] }
  }
  if (typeof metricValue !== "number" || !Number.isFinite(metricValue) || metricValue < 0) {
   return { insights: [], limitations: [`Canonical row ${index} has no valid non-negative numeric ${metricKey} value.`] }
  }
  grouped.set(dimension.trim(), (grouped.get(dimension.trim()) || 0) + metricValue)
 }

 const total = [...grouped.values()].reduce((sum, value) => sum + value, 0)
 if (!Number.isFinite(total) || total <= 0) {
  return { insights: [], limitations: ["Contribution shares require a positive metric total."] }
 }

 const refs = [...new Set([
  `analytics:${dataset.snapshotId}:${dataset.datasetId}:${metricKey}`,
  ...dataset.sources.map((source) => `source:${source}`),
 ])].sort()
 const insights = [...grouped.entries()]
  .map(([label, value]) => ({
   id: `analytics-insight:contribution:${slug(dataset.datasetId)}:${slug(metricKey)}:${stableHash([
    dataset.channelId,
    dataset.snapshotId,
    dataset.datasetId,
    metricKey,
    dimensionKey,
    label,
   ].join(":"))}`,
   kind: "contribution" as const,
   label,
   channelId: dataset.channelId as string,
   datasetId: dataset.datasetId,
   metric: metricKey,
   aggregation,
   currentValue: value,
   baselineValue: total,
   delta: null,
   relativeDeltaPercent: null,
   sharePercent: (value / total) * 100,
   unit: "percent" as const,
   confidence: 0.9,
   evidenceRefs: refs,
   formula: `sourceSum=sum(${metricKey} where ${dimensionKey}=${JSON.stringify(label)}); sharePercent=sourceSum/sum(all ${metricKey})*100`,
   algorithmVersion: ALGORITHM_VERSION,
   deterministic: true as const,
   findingType: "contribution" as const,
   entity: label,
   filters: { metricKey, dimensionKey },
   sourceSnapshotIds: [dataset.snapshotId],
   sourceObservedAt: dataset.updatedAt ?? null,
   observedFact: {
    currentValue: value,
    baselineValue: total,
    delta: null,
    relativeDeltaPercent: null,
    sharePercent: (value / total) * 100,
   },
   calculation: {
    formula: `sourceSum=sum(${metricKey} where ${dimensionKey}=${JSON.stringify(label)}); sharePercent=sourceSum/sum(all ${metricKey})*100`,
    algorithmVersion: ALGORITHM_VERSION,
    deterministic: true as const,
   },
   validationState: "validated" as const,
   interpretation: null,
   recommendation: null,
   limitations: [
    "Contribution describes distribution, not causation.",
    "Confidence reflects canonical data availability and row completeness, not statistical certainty.",
   ],
  }))
  .sort((a, b) => b.currentValue - a.currentValue || a.label.localeCompare(b.label))

 return { insights, limitations: [] }
}


/**
 * Calculates a simple least-squares trend over explicitly observed daily rows.
 * It never fills missing dates with zero and rejects duplicate or malformed dates.
 */
export const buildTrendInsights = (input: {
 dataset: CanonicalIntelligenceDatasetRows
 metricKey: string
 dateKey: string
 minimumObservations?: number
 entityKey?: string
}): TrendInsightResult => {
 const { dataset, metricKey, dateKey, entityKey } = input
 const minimumObservations = input.minimumObservations ?? 5
 const fail = (reason: string): TrendInsightResult => ({ insights: [], limitations: [reason] })
 if (dataset.status !== "available") return fail(`Dataset ${dataset.datasetId} is not fully available for trend analysis.`)
 if (!dataset.channelId) return fail("Trend analysis requires a known channel identity.")
 if (dataset.missingMetrics.includes(metricKey)) return fail(`Metric ${metricKey} is marked missing by the canonical dataset.`)
 if (!metricAggregation(metricKey)) return fail(`Metric ${metricKey} requires denominator-aware aggregation; trend analysis is unsupported for this metric.`)
 if (!Number.isInteger(minimumObservations) || minimumObservations < 3) return fail("Trend analysis requires a minimum observation count of at least 3.")
 const groups = new Map<string, Array<{ date: string; value: number }>>()
 for (const [index, row] of dataset.rows.entries()) {
  const date = row[dateKey]
  const rawValue = row[metricKey]
  const entity = entityKey ? row[entityKey] : "all"
  if (typeof date !== "string" || !isValidDate(date)) {
   return fail(`Canonical row ${index} has no valid YYYY-MM-DD ${dateKey} value.`)
  }
  if (typeof rawValue !== "number" || !Number.isFinite(rawValue) || rawValue < 0) {
   return fail(`Canonical row ${index} has no valid non-negative numeric ${metricKey} value.`)
  }
  if (typeof entity !== "string" || !entity.trim()) {
   return fail(`Canonical row ${index} has no usable ${entityKey || "entity"} value.`)
  }
  const key = entity.trim()
  const observations = groups.get(key) || []
  if (observations.some((point) => point.date === date)) {
   return fail(`Duplicate observation date ${date} for entity ${key}; aggregate duplicate rows canonically before trend analysis.`)
  }
  observations.push({ date, value: rawValue })
  groups.set(key, observations)
 }
 if (groups.size === 0) return fail("Trend analysis requires canonical dated rows.")
 const insights: DeterministicAnalyticsInsight[] = []
 for (const [entity, unsorted] of [...groups.entries()].sort(([a], [b]) => a.localeCompare(b))) {
  const observations = [...unsorted].sort((a, b) => a.date.localeCompare(b.date))
  if (observations.length < minimumObservations) {
   return fail(`Entity ${entity} requires at least ${minimumObservations} valid dated observations; found ${observations.length}.`)
  }
  const values = observations.map((point) => point.value)
  const xMean = (observations.length - 1) / 2
  const yMean = values.reduce((sum, value) => sum + value, 0) / values.length
  const numerator = observations.reduce((sum, point, index) => sum + (index - xMean) * (point.value - yMean), 0)
  const denominator = observations.reduce((sum, _point, index) => sum + (index - xMean) ** 2, 0)
  const slope = denominator === 0 ? 0 : numerator / denominator
  const first = observations[0]
  const last = observations[observations.length - 1]
  const delta = last.value - first.value
  const relativeDeltaPercent = first.value === 0 ? null : (delta / Math.abs(first.value)) * 100
  const direction = Math.abs(slope) < 1e-9 ? "stable" : slope > 0 ? "increasing" : "decreasing"
  const formula = "slope=leastSquaresLinearRegression(observed values by ascending date); delta=lastObserved-firstObserved; no missing-date imputation"
  const refs = [...new Set([
   `analytics:${dataset.snapshotId}:${dataset.datasetId}:${metricKey}`,
   ...dataset.sources.map((source) => `source:${source}`),
  ])].sort()
  insights.push({
   id: `analytics-insight:trend:${slug(dataset.datasetId)}:${slug(metricKey)}:${stableHash([dataset.channelId, dataset.snapshotId, entity, first.date, last.date].join(":"))}`,
   kind: "trend",
   findingType: "trend",
   entity,
   filters: { metricKey, dateKey, entityKey: entityKey ?? null, minimumObservations },
   sourceSnapshotIds: [dataset.snapshotId],
   sourceObservedAt: dataset.updatedAt ?? null,
   label: `${metricKey} trend for ${entity}: ${direction}`,
   channelId: dataset.channelId,
   datasetId: dataset.datasetId,
   metric: metricKey,
   aggregation: "sum",
   currentValue: last.value,
   baselineValue: first.value,
   delta,
   relativeDeltaPercent,
   unit: "source-metric-value",
   confidence: Math.min(0.95, 0.65 + observations.length * 0.02),
   evidenceRefs: refs,
   formula,
   algorithmVersion: ALGORITHM_VERSION,
   deterministic: true,
   observedFact: { currentValue: last.value, baselineValue: first.value, delta, relativeDeltaPercent },
   calculation: { formula, algorithmVersion: ALGORITHM_VERSION, deterministic: true },
   validationState: "validated",
   interpretation: null,
   recommendation: null,
   trend: {
    direction,
    slopePerObservation: slope,
    observationCount: observations.length,
    firstDate: first.date,
    lastDate: last.date,
   },
   limitations: [
    "Trend is descriptive, not causal.",
    "Only observed rows are included; absent dates are not assumed to be zero.",
    "Confidence is a deterministic completeness heuristic, not a statistical confidence interval.",
   ],
  })
 }
 return { insights: insights.sort((a, b) => a.id.localeCompare(b.id)), limitations: [] }
}

/** Maps a canonical finding to the repository's existing derived-signal contract. */
export const toDerivedSignal = (finding: DeterministicAnalyticsInsight): DerivedSignal => ({
 id: finding.id,
 kind: finding.findingType === "material-change" ? "comparison" : finding.findingType,
 channelId: finding.channelId,
 projectId: finding.projectId ?? null,
 label: finding.label,
 metric: finding.metric,
 currentValue: finding.currentValue,
 baselineValue: finding.baselineValue,
 delta: finding.delta,
 relativeDelta: finding.relativeDeltaPercent === null ? null : finding.relativeDeltaPercent / 100,
 confidence: finding.confidence,
 impact: finding.sharePercent ?? (finding.delta === null ? null : Math.abs(finding.delta)),
 evidenceIds: [...finding.evidenceRefs],
 derivation: {
  method: finding.calculation.formula,
  version: finding.calculation.algorithmVersion,
  deterministic: true,
 },
 limitations: [...finding.limitations],
 metadata: {
  datasetId: finding.datasetId,
  findingType: finding.findingType,
  entity: finding.entity ?? null,
  window: finding.window ?? null,
  sourceSnapshotIds: finding.sourceSnapshotIds.join(","),
  sourceObservedAt: finding.sourceObservedAt ?? null,
  filters: JSON.stringify(finding.filters),
  unit: finding.unit,
  validationState: finding.validationState,
  interpretation: finding.interpretation,
  recommendation: finding.recommendation,
  currentValue: finding.currentValue,
  baselineValue: finding.baselineValue,
  relativeDeltaPercent: finding.relativeDeltaPercent,
  sharePercent: finding.sharePercent ?? null,
  trendDirection: finding.trend?.direction ?? null,
 },
})

/** Adapts existing anomaly output; detector semantics remain owned by anomaly-intelligence. */
export const adaptAnomalyToAnalyticsFinding = (anomaly: ViewTubeAnomaly): DeterministicAnalyticsInsight => {
 const delta = anomaly.currentValue - anomaly.baselineValue
 const relativeDeltaPercent = Number.isFinite(anomaly.relativeDelta) ? anomaly.relativeDelta * 100 : null
 const formula = "existing anomaly-intelligence robust magnitude detector; values and scores preserved without recomputation"
 const refs = [...new Set(anomaly.evidence.map((evidence) =>
  evidence.id || `analytics:${evidence.snapshotId}:${evidence.datasetId}:${anomaly.metric}`,
 ))].sort()
 return {
  id: `analytics-insight:anomaly:${slug(anomaly.datasetId)}:${stableHash(anomaly.id)}`,
  kind: "anomaly",
  findingType: "anomaly",
  entity: anomaly.entity ?? null,
  filters: { family: anomaly.family, anomalyKind: anomaly.kind, detectedAt: anomaly.detectedAt },
  sourceSnapshotIds: [...new Set(anomaly.evidence.map((evidence) => evidence.snapshotId))].sort(),
  sourceObservedAt: anomaly.detectedAt,
  label: `${anomaly.metric} ${anomaly.kind.replace(/_/g, " ")}${anomaly.entity ? ` for ${anomaly.entity}` : ""}`,
  channelId: anomaly.channelId || "",
  datasetId: anomaly.datasetId,
  metric: anomaly.metric,
  aggregation: "sum",
  currentValue: anomaly.currentValue,
  baselineValue: anomaly.baselineValue,
  delta,
  relativeDeltaPercent,
  unit: "source-metric-value",
  confidence: Math.max(0, Math.min(1, anomaly.confidence > 1 ? anomaly.confidence / 100 : anomaly.confidence)),
  evidenceRefs: refs,
  formula,
  algorithmVersion: ALGORITHM_VERSION,
  deterministic: true,
  observedFact: { currentValue: anomaly.currentValue, baselineValue: anomaly.baselineValue, delta, relativeDeltaPercent },
  calculation: { formula, algorithmVersion: ALGORITHM_VERSION, deterministic: true },
  validationState: "validated",
  interpretation: null,
  recommendation: null,
  limitations: [
   "Anomaly scores are produced by the existing anomaly-intelligence detector.",
   "An anomaly is a signal for review, not evidence of cause.",
  ],
 }
}


/** Deterministically adapts an existing anomaly batch without changing detector results. */
export const adaptAnomaliesToAnalyticsFindings = (
 anomalies: readonly ViewTubeAnomaly[],
): DeterministicAnalyticsInsight[] =>
 anomalies
  .map(adaptAnomalyToAnalyticsFinding)
  .sort((left, right) => left.id.localeCompare(right.id))
