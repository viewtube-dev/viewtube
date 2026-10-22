import React from "react"
import { describe, expect, it } from "vitest"
import { renderToStaticMarkup } from "react-dom/server"
import { BrainEvidenceHandoff } from "./BrainEvidenceHandoff"

describe("BrainEvidenceHandoff", () => {
 it("renders the canonical evidence reference and carried request constraints", () => {
  const html = renderToStaticMarkup(
   <BrainEvidenceHandoff search="?brainEvidenceId=analytics%3Asnapshot-1%3Avideo-abc%3Aviews&brainEvidenceSource=analytics-canon&snapshotId=snapshot-1&sourceRef=video-abc&metric=views&window=28d&channelId=channel-9&count=10&since=2026-01-01&until=2026-10-01&format=long&rankBy=views&selectionMode=top&filter=title%3Aanalysis" />,
  )
  expect(html).toContain("Evidence context from AI Brain")
  expect(html).toContain("analytics:snapshot-1:video-abc:views")
  expect(html).toContain("analytics-canon")
  expect(html).toContain("snapshot-1")
  expect(html).toContain("video-abc")
  expect(html).toContain("views")
  expect(html).toContain("28d")
  expect(html).toContain("channel-9")
  expect(html).toContain("10")
  expect(html).toContain("2026-01-01")
  expect(html).toContain("2026-10-01")
  expect(html).toContain("long")
  expect(html).toContain("title:analysis")
  expect(html).toContain("not automatically applied")
  expect(html).toContain("has not confirmed a matching live Analytics row")
 })

 it("renders nothing for ordinary Analytics navigation", () => {
  expect(renderToStaticMarkup(<BrainEvidenceHandoff search="?window=28d" />)).toBe("")
 })
})
