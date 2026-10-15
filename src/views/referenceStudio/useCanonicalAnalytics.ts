import { useMemo } from "react"
import type {
 AnalyticsWindow,
 CanonicalMetricKey,
 CanonicalVideoRow,
 MetricSummary,
} from "../../services/analytics-canon"
import { useCanonicalRows, useCanonicalMetricSummary } from "../../services/analytics-canon"
import { getVtSyncSnapshot } from "../../features/vt-sync-local/adapters/snapshot"

const metricValue = (
 row: CanonicalVideoRow,
 metricKey: CanonicalMetricKey,
): number => {
 const cell = row.metrics[metricKey]
 if (!cell || cell.status === "unavailable" || cell.value === null) return 0
 return cell.value
}

export interface CanonicalAnalyticsView {
 rows: CanonicalVideoRow[]
 summary: MetricSummary
 topRows: Array<{
  id: string
  title: string
  format: CanonicalVideoRow["format"]
  views: number
  likes: number
  comments: number
  shares: number
  watchHours: number
  subscribers: number
  revenue: number
  ctr: number
  avp: number
 }>
 formatBreakdown: Array<{ name: string; value: number }>
 timelineSeries: Array<{
  date: string
  views: number
  watchHours: number
  revenue: number
  subscribers: number
 }>
 channelDailySeries: Array<{
  date: string
  views: number
  watchHours: number
  revenue: number
  subscribers: number
  likes: number
  dislikes: number
  comments: number
  shares: number
  impressions: number
  ctr: number
 }>
}

export const useCanonicalAnalytics = (
 windowKey: AnalyticsWindow = "28d",
): CanonicalAnalyticsView => {
 const rows = useCanonicalRows(windowKey)
 const summary = useCanonicalMetricSummary(windowKey)

 const topRows = useMemo(
  () =>
   [...rows]
    .map((row, index) => ({
     id: row.videoId || `${row.title}-${index}`,
     title: row.title,
     format: row.format,
     views: metricValue(row, "views"),
     likes: metricValue(row, "likes"),
     comments: metricValue(row, "comments"),
     shares: metricValue(row, "shares"),
     watchHours: metricValue(row, "watchHours"),
     subscribers: metricValue(row, "subscribersGained"),
     revenue: metricValue(row, "revenue"),
     ctr: metricValue(row, "ctr"),
     avp: metricValue(row, "avp"),
    }))
    .sort((a, b) => b.views - a.views)
    .slice(0, 50),
  [rows],
 )

 const formatBreakdown = useMemo(() => {
  const map = new Map<string, number>()
  topRows.forEach((row) => {
   map.set(row.format, (map.get(row.format) || 0) + row.views)
  })
  return Array.from(map.entries()).map(([name, value]) => ({ name, value }))
 }, [topRows])

 const timelineSeries = useMemo(() => {
  const dayMap = new Map<
   string,
   { views: number; watchHours: number; revenue: number; subscribers: number }
  >()

  rows.forEach((row) => {
   const parsed = new Date(row.uploadDate)
   if (Number.isNaN(parsed.getTime())) return

   const dateKey = parsed.toISOString().slice(0, 10)
   const bucket = dayMap.get(dateKey) || {
    views: 0,
    watchHours: 0,
    revenue: 0,
    subscribers: 0,
   }

   bucket.views += metricValue(row, "views")
   bucket.watchHours += metricValue(row, "watchHours")
   bucket.revenue += metricValue(row, "revenue")
   bucket.subscribers += metricValue(row, "subscribersGained")

   dayMap.set(dateKey, bucket)
  })

  return Array.from(dayMap.entries())
   .sort(([a], [b]) => a.localeCompare(b))
   .map(([date, bucket]) => ({ date, ...bucket }))
 }, [rows])

 const channelDailySeries = (() => {
  const dailyRows = getVtSyncSnapshot().dailyMetrics
  if (!Array.isArray(dailyRows)) return []
  return dailyRows.map(row => {
   const rawWatchTime = Number(row.watchTime ?? row["Watch time (hours)"] ?? 0)
   return {
    date: String(row.date || row.Date || row.day || ""),
    views: Number(row.views ?? row.Views ?? 0),
    watchHours: row.watchHours !== undefined
     ? Number(row.watchHours)
     : row.watchTime !== undefined
      ? rawWatchTime / 60
      : rawWatchTime,
    revenue: Number(row.revenue ?? row["Estimated revenue (USD)"] ?? 0),
    subscribers: Number(row.subscribersGained ?? row["Subscribers gained"] ?? 0),
    likes: Number(row.likes ?? row.Likes ?? 0),
    dislikes: Number(row.dislikes ?? row.Dislikes ?? 0),
    comments: Number(row.comments ?? row.Comments ?? 0),
    shares: Number(row.shares ?? row.Shares ?? 0),
    impressions: Number(row.impressions ?? row.Impressions ?? 0),
    ctr: Number(row.ctr ?? row["Impressions click-through rate (%)"] ?? 0),
   }
  }).filter(row => row.date).sort((a, b) => a.date.localeCompare(b.date))
 })()

 return {
  rows,
  summary,
  topRows,
  formatBreakdown,
  timelineSeries,
  channelDailySeries,
 }
}

export const formatCompactNumber = (value: number): string => {
 if (!Number.isFinite(value)) return "-"
 if (Math.abs(value) >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`
 if (Math.abs(value) >= 1_000) return `${(value / 1_000).toFixed(1)}K`
 return Math.round(value).toLocaleString()
}

export const formatCurrency = (value: number): string => `$${value.toFixed(2)}`
