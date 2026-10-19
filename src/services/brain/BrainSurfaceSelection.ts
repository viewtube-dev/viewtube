export interface BrainSurfaceSelection {
 route: string
 sourceId: string
 label: string
 projectId?: string | null
 videoId?: string | null
 commentId?: string | null
 dateRange?: string | null
 evidenceIds?: string[]
 context?: Record<string, unknown>
 updatedAt: string
 locked?: boolean
}

export const BRAIN_SURFACE_SELECTION_EVENT = "vt_brain_surface_selection_changed"
const BRAIN_SURFACE_SELECTION_KEY = "vt_brain_surface_selection_v1"

export const publishBrainSurfaceSelection = (
 input: Omit<BrainSurfaceSelection, "updatedAt" | "locked">,
): BrainSurfaceSelection => {
 const current = readBrainSurfaceSelection()
 if (current?.locked && current.sourceId !== input.sourceId) return current
 const selection: BrainSurfaceSelection = {
  ...input,
  locked: current?.locked || false,
  updatedAt: new Date().toISOString(),
 }
 if (typeof window !== "undefined") {
  try {
   sessionStorage.setItem(BRAIN_SURFACE_SELECTION_KEY, JSON.stringify(selection))
  } catch {
   // Selection context is an optimization; storage failure is non-fatal.
  }
  window.dispatchEvent(new CustomEvent(BRAIN_SURFACE_SELECTION_EVENT, { detail: selection }))
 }
 return selection
}

export const setBrainSurfaceSelectionLocked = (locked: boolean): BrainSurfaceSelection | null => {
 const current = readBrainSurfaceSelection()
 if (!current || typeof window === "undefined") return current
 const selection: BrainSurfaceSelection = { ...current, locked, updatedAt: new Date().toISOString() }
 try {
  sessionStorage.setItem(BRAIN_SURFACE_SELECTION_KEY, JSON.stringify(selection))
 } catch {
  // Selection lock is a convenience; the current in-memory state still updates.
 }
 window.dispatchEvent(new CustomEvent(BRAIN_SURFACE_SELECTION_EVENT, { detail: selection }))
 return selection
}

export const clearBrainSurfaceSelection = (route?: string) => {
 if (typeof window === "undefined") return
 const current = readBrainSurfaceSelection()
 if (route && current?.route !== route) return
 try {
  sessionStorage.removeItem(BRAIN_SURFACE_SELECTION_KEY)
 } catch {
  // Ignore storage failures.
 }
 window.dispatchEvent(new CustomEvent(BRAIN_SURFACE_SELECTION_EVENT, { detail: null }))
}

export const readBrainSurfaceSelection = (
 route?: string,
): BrainSurfaceSelection | null => {
 if (typeof window === "undefined") return null
 try {
  const raw = sessionStorage.getItem(BRAIN_SURFACE_SELECTION_KEY)
  if (!raw) return null
  const parsed = JSON.parse(raw) as BrainSurfaceSelection
  if (route && parsed.route !== route) return null
  return parsed
 } catch {
  return null
 }
}
