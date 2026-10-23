import React from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it } from "vitest"
import { buildBrainSparklineSegments, BrainQuickActionCard } from "./BrainAnswerModules"

describe("buildBrainSparklineSegments", () => {
 it("keeps a measured zero as a real data point", () => {
  expect(buildBrainSparklineSegments([
   { label: "A", value: 0 },
   { label: "B", value: 4 },
   { label: "C", value: 8 },
  ])).toEqual([
   [{ label: "A", value: 0 }, { label: "B", value: 4 }, { label: "C", value: 8 }],
  ])
 })

 it("breaks a trend at missing values instead of plotting missing as zero", () => {
  expect(buildBrainSparklineSegments([
   { label: "A", value: 2 },
   { label: "B", value: null },
   { label: "C", value: 7 },
   { label: "D", value: 9 },
  ])).toEqual([
   [{ label: "A", value: 2 }],
   [{ label: "C", value: 7 }, { label: "D", value: 9 }],
  ])
 })
})



describe("BrainQuickActionCard Studio contract", () => {
 const action = { id: "action-1", title: "Improve the opening", body: "Make the viewer promise clear.", effort: 2, reward: 4, routeLabel: "Open plan" }

 it("uses the shared Studio button for the compact card action", () => {
  const html = renderToStaticMarkup(<BrainQuickActionCard action={action} compact onAccept={() => undefined} />)
  expect(html).toContain('data-vt-studio-button="true"')
  expect(html).toContain("Improve the opening")
  expect(html).toContain("Make the viewer promise clear.")
  expect(html).toContain("20 minutes")
  expect(html).toContain("Strong payoff")
 })

 it("uses the shared Studio button for the full card action", () => {
  const html = renderToStaticMarkup(<BrainQuickActionCard action={action} onAccept={() => undefined} />)
  expect(html).toContain('data-vt-studio-button="true"')
  expect(html).toContain("Open plan")
 })
})
