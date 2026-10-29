import { readFileSync } from "node:fs"
import { describe, expect, it } from "vitest"

const boundarySource = readFileSync(new URL("./BrainRouteErrorBoundary.tsx", import.meta.url), "utf8")
const routesSource = readFileSync(new URL("./AppRoutes.tsx", import.meta.url), "utf8")

describe("AI Brain route crash diagnostics", () => {
 it("records render failures with the React component stack and current route", () => {
  expect(boundarySource).toContain("componentDidCatch")
  expect(boundarySource).toContain("recordDiagnostic")
  expect(boundarySource).toContain("componentStack")
  expect(boundarySource).toContain("window.location.pathname")
  expect(boundarySource).toContain('"brain:render-crash"')
 })

 it("wraps the AI Brain page without changing its route or lazy loading", () => {
  expect(routesSource).toContain('import { BrainRouteErrorBoundary } from "./BrainRouteErrorBoundary"')
  expect(routesSource).toContain('<Route path="/ai-brain" element={<BrainRouteErrorBoundary><AIBrainCommandInterface /></BrainRouteErrorBoundary>} />')
 })

 it("offers a recovery path instead of leaving the Brain page blank", () => {
  expect(boundarySource).toContain("Brain encountered a rendering error")
  expect(boundarySource).toContain("window.location.assign(\"/\")")
  expect(boundarySource).toContain("Try again")
 })
})
