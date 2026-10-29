import { readFileSync } from "node:fs"
import { describe, expect, it } from "vitest"

const boundarySource = readFileSync(new URL("./BrainRouteErrorBoundary.tsx", import.meta.url), "utf8")
const routesSource = readFileSync(new URL("./AppRoutes.tsx", import.meta.url), "utf8")
const diagnosticsSource = readFileSync(new URL("./onScreenDiagnostics.ts", import.meta.url), "utf8")

describe("AI Brain route crash diagnostics", () => {
 it("records render failures with the React component stack and current route", () => {
  expect(boundarySource).toContain("componentDidCatch")
  expect(boundarySource).toContain("recordDiagnostic")
  expect(boundarySource).toContain("componentStack")
  expect(boundarySource).toContain("window.location.pathname")
  expect(boundarySource).toContain('"brain:render-crash"')
 })

 it("preserves the original stack, filename, and route for uncaught browser errors", () => {
  expect(diagnosticsSource).toContain('const errorStack = event.error instanceof Error ? event.error.stack : undefined')
  expect(diagnosticsSource).toContain('filename: event.filename || undefined')
  expect(diagnosticsSource).toContain('column: event.colno || undefined')
  expect(diagnosticsSource).toContain('subsystem: /ai-brain|brain-controls/.test(window.location.pathname) ? "brain" : "frontend"')
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
