/**
 * Shared fetch wrapper for capability scaffolds.
 *
 * Integration note: confirm the canonical base URL / auth contract on the
 * target branch before any capability goes live (see
 * `src/services/publicHandleMode.ts` for the existing direct-fetch convention).
 * Nothing here fabricates data — failures propagate as real errors to the
 * honest-state store.
 */
export class ScaffoldEndpointError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "ScaffoldEndpointError"
  }
}

export const API_BASE = "/api" // Integration note: confirm on the target branch

/**
 * Configured capability endpoint (systems 1 and 2 resolve it before falling
 * back to a registered canonical adapter). Set from the app shell once the
 * backend contract is confirmed, e.g. setCapabilityEndpoint("/api/capabilities").
 */
let configuredCapabilityEndpoint: string | null = null

export function setCapabilityEndpoint(endpoint: string): void {
  configuredCapabilityEndpoint = endpoint.replace(/\/$/, "")
}

export function clearCapabilityEndpoint(): void {
  configuredCapabilityEndpoint = null
}

export function capabilityEndpoint(): string | null {
  return configuredCapabilityEndpoint
}

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  if (path.startsWith("scaffold://")) {
    throw new ScaffoldEndpointError(
      `VIEWTUBE_SCAFFOLD: endpoint not wired (${path}) — confirm the canonical endpoint on the target branch, then wire this path.`,
    )
  }
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
  })
  if (!res.ok) {
    throw new Error(`API ${res.status} ${res.statusText} for ${path}`)
  }
  return (await res.json()) as T
}
