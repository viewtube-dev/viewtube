import type {
 CanonicalIntelligenceDatasetManifest,
 CanonicalIntelligenceDatasetRows,
 CanonicalIntelligenceEvidenceBundle,
} from "../analytics-canon"

export type DeterministicAnalyticsInsightKind =
 | "comparison"
 | "material-change"
 | "contribution"

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
 label: string
 channelId: string
 datasetId: string
 metric: string
 aggregation: "sum" | "average"
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

 const baselineById = new Map(baselineBundle.datasets.map((dataset) => [dataset.id, dataset]))
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
     id: `analytics-insight:material-change:${slug(currentDataset.id)}:${slug(metric)}:${stableHash(identity)}`,
     kind: "material-change",
     label: `${metric} ${delta >= 0 ? "increased" : "decreased"} ${Math.abs(relativeDeltaPercent).toFixed(1)}% versus baseline`,
     formula: `period-comparison formula; emit material-change when abs(relativeDeltaPercent)>=${materialThreshold}`,
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
 if (dataset.status !== "available") {
  return { insights: [], limitations: [`Dataset ${dataset.datasetId} is not fully available.`] }
 }
 if (!dataset.channelId) {
  return { insights: [], limitations: ["Traffic contribution requires a known channel identity."] }
 }
 if (dataset.missingMetrics.includes(metricKey)) {
  return { insights: [], limitations: [`Metric ${metricKey} is marked missing by the canonical dataset.`] }
 }
 if (!metricAggregation(metricKey)) {
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
 const aggregation = metricAggregation(metricKey)
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
   limitations: [
    "Contribution describes distribution, not causation.",
    "Confidence reflects canonical data availability and row completeness, not statistical certainty.",
   ],
  }))
  .sort((a, b) => b.currentValue - a.currentValue || a.label.localeCompare(b.label))

 return { insights, limitations: [] }
}
