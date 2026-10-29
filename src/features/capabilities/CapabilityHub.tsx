import React, { useMemo, useState } from "react"
import { Link } from "react-router-dom"
import { CAPABILITIES } from "./registry"
import { CAPABILITY_FLAGS, isCapabilityFlagEnabled } from "../../flags/featureFlags"

/**
 * Unified discovery surface (roadmap item 25 scaffold): searchable index of all
 * 25 candidates with flag state and audit classification. Canonical registries
 * (pageRegistry / BrainCapabilityRegistry / toolbox) remain the owners of real
 * navigation and actions — this hub links to scaffold pages only.
 */
export default function CapabilityHub() {
  const [query, setQuery] = useState("")
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return CAPABILITIES
    return CAPABILITIES.filter(
      (c) => c.title.toLowerCase().includes(q) || c.slug.includes(q) || String(c.number) === q,
    )
  }, [query])

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-4 p-4">
      <header className="flex flex-col gap-1">
        <p className="text-xs uppercase tracking-wide opacity-60">Roadmap Priority 25 · 25 candidates</p>
        <h1 className="text-xl font-semibold">Capability Scaffolds</h1>
        <p className="text-sm opacity-80">
          Every entry is a scaffold until its A/B/C/D classification is verified on the target
          branch. Registry ownership stays with pageRegistry / BrainCapabilityRegistry.
        </p>
      </header>

      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search capabilities…"
        className="rounded-md border px-3 py-2 text-sm"
      />

      <ul className="grid grid-cols-1 gap-2 md:grid-cols-2">
        {filtered.map((c) => (
          <li key={c.slug} className="rounded-md border p-3">
            <Link to={c.route} className="text-sm font-medium underline-offset-2 hover:underline">
              {c.number}. {c.title}
            </Link>
            <p className="mt-1 text-xs opacity-70">{c.userValue}</p>
            <p className="mt-1 text-xs">
              flag <code>{c.flag}</code> · {isCapabilityFlagEnabled(c.slug) ? "enabled" : "disabled"} ·{" "}
              classification: {c.classification}
            </p>
          </li>
        ))}
      </ul>

      <p className="text-xs opacity-60">
        {Object.keys(CAPABILITY_FLAGS).length} flags registered in <code>src/flags/featureFlags.ts</code>.
      </p>
    </div>
  )
}
