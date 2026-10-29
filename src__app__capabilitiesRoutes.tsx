import React from "react"
import { Route } from "react-router-dom"
import { lazyRoute } from "./lazyRoute"
import { CAPABILITIES } from "../features/capabilities/registry"

/**
 * Drop-in routes for the 25 roadmap capability scaffolds.
 *
 * 1. In `src/app/AppRoutes.tsx` add:
 *      import { CAPABILITY_ROUTES } from "./capabilitiesRoutes"
 *      ...inside <Routes>: {CAPABILITY_ROUTES}
 * 2. In `src/app/pageRegistry.ts` paste the entries from
 *    `pageRegistry.capabilities-snippet.ts` so the governance test
 *    (`pageRegistry.test.ts` — every route must be classified) passes.
 *
 * Pages are code-split with the repo's own `lazyRoute` helper and a Vite
 * `import.meta.glob`, matching the existing route-level splitting convention.
 */
const hubPages = import.meta.glob("../features/capabilities/**/*Page.tsx")

// Declared before CAPABILITY_ROUTES — const declarations are not hoisted (TDZ).
const CapabilityHubLazy = lazyRoute(() => import("../features/capabilities/CapabilityHub"))

export const CAPABILITY_ROUTES = (
  <>
    <Route path="/capabilities" element={<CapabilityHubLazy />} />
    {CAPABILITIES.map((c) => (
      <Route key={c.slug} path={`/capabilities/${c.slug}`} element={<CapabilityPageLazy slug={c.slug} />} />
    ))}
  </>
)

function pageLoader(slug: string) {
  const path = `../features/capabilities/${slug}/${slug}Page.tsx`
  const loader = hubPages[path]
  if (!loader) {
    throw new Error(`Capability page module not found for ${slug} (expected ${path})`)
  }
  return loader as unknown as () => Promise<{ default: React.ComponentType }>
}

function CapabilityPageLazy({ slug }: { slug: string }) {
  // useMemo keeps one lazy component instance per slug — recreating it every
  // render would remount the page on each state change.
  const Lazy = React.useMemo(() => lazyRoute(() => pageLoader(slug)), [slug])
  return <Lazy />
}
