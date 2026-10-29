/**
 * Roadmap item 7: Veo Video Generation Integration
 * Scaffold page — wire into real Studio primitives (`src/studio-ui`) and
 * replace the generic panel once the audit footholds are confirmed.
 */
import React from "react"
import { CapabilityPageShell } from "../shared/CapabilityPageShell"
import { AsyncStateView } from "../shared/AsyncStateView"
import { useVeoVideoGeneration } from "./useVeoVideoGeneration"
import { CAPABILITY_BY_SLUG } from "../../capabilities/registry"

const capability = CAPABILITY_BY_SLUG["veo-video-generation"]

export default function VeoVideoGenerationPage() {
  const { snapshot, load, reset } = useVeoVideoGeneration({})
  return (
    <CapabilityPageShell capability={capability}>
      <div className="flex flex-col gap-3">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={load}
            className="rounded-md border px-3 py-1.5 text-sm hover:bg-black/5 dark:hover:bg-white/10"
          >
            Load (stub API)
          </button>
          <button
            type="button"
            onClick={reset}
            className="rounded-md border px-3 py-1.5 text-sm hover:bg-black/5 dark:hover:bg-white/10"
          >
            Reset
          </button>
        </div>

        <AsyncStateView
          snapshot={snapshot}
          renderData={(data) => (
            <pre className="overflow-auto rounded-md bg-black/5 p-3 text-xs dark:bg-white/10">
              {JSON.stringify(data, null, 2)}
            </pre>
          )}
          emptyHint={`Expected fields when wired: ["jobId", "status", "settings", "resultAssetId", "error"]`}
        />

        <p className="text-xs opacity-60">
          TODO list for this capability lives in the scaffold README under “Per-capability TODOs”
          (item 7).
        </p>
      </div>
    </CapabilityPageShell>
  )
}
