import React from "react"
import { recordDiagnostic } from "../services/diagnostics"

interface BrainRouteErrorBoundaryProps {
 children: React.ReactNode
}

interface BrainRouteErrorBoundaryState {
 error: Error | null
}

/**
 * Isolates render-time failures on /ai-brain so a component crash doesn't
 * blank the entire application. Captures the React component stack in the
 * shared diagnostics buffer for remote/mobile debugging.
 */
export class BrainRouteErrorBoundary extends React.Component<
 BrainRouteErrorBoundaryProps,
 BrainRouteErrorBoundaryState
> {
 state: BrainRouteErrorBoundaryState = { error: null }

 static getDerivedStateFromError(error: Error): BrainRouteErrorBoundaryState {
  return { error }
 }

 componentDidCatch(error: Error, info: React.ErrorInfo): void {
  const componentStack = info.componentStack || "(React component stack unavailable)"
  const route = typeof window !== "undefined"
   ? `${window.location.pathname}${window.location.search}`
   : "/ai-brain"
  recordDiagnostic("error", "brain:render-crash", error.message || "Unknown Brain render error", {
   source: "AIBrainCommandInterface",
   subsystem: "brain",
   kind: "react-render-error",
   status: "failed",
   explanation: "The AI Brain route threw while rendering. The route boundary kept the rest of ViewTube mounted.",
   actual: error.stack || error.message,
   recommendedActions: [
    "Capture the component stack below.",
    "Check the first application-owned frame for a missing import, invalid callback, or unexpected value.",
    "Retry the Brain route after correcting the originating component.",
   ],
   privacy: "sanitized",
   metadata: {
    route,
    componentStack,
    errorName: error.name,
   },
  })
 }

 private retry = (): void => {
  this.setState({ error: null })
 }

 render(): React.ReactNode {
  if (!this.state.error) return this.props.children

  return (
   <section
    role="alert"
    aria-live="assertive"
    data-vt-brain-render-error="true"
    style={{
     margin: "16px auto",
     padding: 16,
     maxWidth: 640,
     border: "2px solid #111",
     background: "#fff",
     color: "#111",
    }}
   >
    <h2 style={{ marginTop: 0 }}>Brain encountered a rendering error</h2>
    <p>
     The Brain workspace failed to render, but the rest of ViewTube is still available.
     The error and React component stack have been added to diagnostics.
    </p>
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
     <button type="button" onClick={this.retry}>Try again</button>
     <a href="/">Return to dashboard</a>
    </div>
   </section>
  )
 }
}
