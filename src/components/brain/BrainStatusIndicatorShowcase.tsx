import React from "react"
import { StudioBrainStatusIndicator, type StudioBrainStatusTone } from "../../studio-ui/primitives/StudioControls"

const examples: Array<{ status: StudioBrainStatusTone; label: string }> = [
 { status: "running", label: "Running" },
 { status: "success", label: "Success" },
 { status: "warning", label: "Warning" },
 { status: "error", label: "Error" },
 { status: "info", label: "Info" },
 { status: "paused", label: "Paused" },
 { status: "idle", label: "Idle" },
 { status: "queued", label: "Queued" },
 { status: "processing", label: "Processing" },
 { status: "complete", label: "Complete" },
 { status: "blocked", label: "Blocked" },
 { status: "failed", label: "Failed" },
]

/** Component-library showcase of the canonical Studio Brain status primitive. */
export const BrainStatusIndicatorShowcase: React.FC = () => (
 <section className="grid gap-3" aria-label="Brain status indicator variants">
  <div>
   <h3 className="mb-2 text-[10px] font-[1000] uppercase">Dark fill · white text</h3>
   <div className="flex flex-wrap gap-2">{examples.slice(0, 6).map((item) => <StudioBrainStatusIndicator key={item.status} {...item} variant="dark" size="compact" />)}</div>
  </div>
  <div>
   <h3 className="mb-2 text-[10px] font-[1000] uppercase">Tinted fill · black text</h3>
   <div className="flex flex-wrap gap-2">{examples.slice(0, 6).map((item) => <StudioBrainStatusIndicator key={item.status} {...item} variant="tinted" size="compact" />)}</div>
  </div>
  <div>
   <h3 className="mb-2 text-[10px] font-[1000] uppercase">Extended status set</h3>
   <div className="flex flex-wrap gap-2">{examples.slice(6).map((item) => <StudioBrainStatusIndicator key={item.status} {...item} variant="tinted" size="compact" />)}</div>
  </div>
  <div>
   <h3 className="mb-2 text-[10px] font-[1000] uppercase">Size tiers</h3>
   <div className="flex flex-wrap items-center gap-2">
    <StudioBrainStatusIndicator status="running" label="Standard" size="standard" />
    <StudioBrainStatusIndicator status="running" label="Compact" size="compact" />
    <StudioBrainStatusIndicator status="running" label="Micro" size="micro" pulse={false} />
   </div>
  </div>
 </section>
)
export default BrainStatusIndicatorShowcase
