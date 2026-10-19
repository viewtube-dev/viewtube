import React from "react"
import { useBrain } from "../../context/useBrain"
import { readBrainUserControls } from "../../services/brain/BrainUserControls"

/** Read-only view of selected context and saved permissions, not data readiness. */
export const BrainScopeSummary: React.FC<{ channelId?: string | null }> = ({ channelId }) => {
  const { brain, authState } = useBrain()
  const scope = channelId === undefined ? authState.channelHandle || authState.channelId || null : channelId
  const [policy, setPolicy] = React.useState(() => scope ? readBrainUserControls(scope) : null)
  React.useEffect(() => {
    const refresh = () => setPolicy(scope ? readBrainUserControls(scope) : null)
    refresh()
    window.addEventListener("vt_brain_user_controls_changed", refresh)
    window.addEventListener("storage", refresh)
    return () => { window.removeEventListener("vt_brain_user_controls_changed", refresh); window.removeEventListener("storage", refresh) }
  }, [scope])
  const project = brain.projects.find(item => item.id === brain.activeProjectId)
  return <section aria-label="Current Brain scope and saved permissions" className="rounded-lg border-2 border-black bg-white p-3 text-sm">
    <h2 className="font-bold">Current context</h2>
    <dl className="mt-2 grid gap-2 break-words"><div><dt className="font-bold">Channel</dt><dd>{scope || "No channel selected"}</dd></div><div><dt className="font-bold">Project</dt><dd>{project?.name || (brain.activeProjectId ? "Selected project could not be resolved" : "No project selected")}</dd></div></dl>
    {scope && policy ? <ul className="mt-3 flex flex-wrap gap-2">{[["Brain", policy.enabled], ["Personalization", policy.enabled && policy.personalization], ["Analytics access", policy.enabled && policy.allowAnalytics], ["Project access", policy.enabled && policy.allowProjects], ["Vault access", policy.enabled && policy.allowVault]].map(([label, allowed]) => <li key={String(label)} className="rounded border border-black px-2 py-1">{label}: {allowed ? "On" : "Off"}</li>)}</ul> : null}
    <p className="mt-2 text-sm text-black/75">Saved permissions only; access does not prove that data is synced or available. Change selections in the existing channel and project controls.</p>
  </section>
}
