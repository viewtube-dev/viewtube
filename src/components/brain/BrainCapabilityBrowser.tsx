import React, { useMemo, useState } from "react"
import { ArrowRight, Send, Sparkles } from "lucide-react"
import type { AIBrainContextSnapshot } from "../../services/aiBrainCommandInterface"
import {
  BRAIN_CAPABILITY_EVIDENCE_REQUIREMENTS,
  BRAIN_CAPABILITY_REGISTRY,
} from "../../services/brain/BrainCapabilityRegistry"
import type { BrainCapabilityDefinition } from "../../types"
import type { BrainUserControls } from "../../services/brain/BrainUserControls"
import {
  StudioTextInput,
  StudioSplitLeftButton,
  StudioSplitTwoLineButton,
  StudioTopSplitModule,
} from "../../studio-ui"
import { BrainChatStatusBadge } from "./BrainChatPrimitives"
import "./brain-tool-surface.css"

export type BrainCapabilityAvailability = {
  status: "ready" | "needs-channel-data" | "needs-project-context" | "blocked"
  label: string
  reason: string
}

const ANALYTICS_CAPABILITIES = new Set([
  "signal-anomaly-intelligence",
  "statistics-intelligence",
  "algorithm-intelligence",
  "analytics-diagnosis",
  "top-performer-mining",
])
const PERSONALIZED_CAPABILITIES = new Set(["channel-profile", "journal-memory", "goal-coach"])
const PROJECT_CAPABILITIES = new Set(["daily-oracle", "content-generation"])

export const getBrainCapabilityAvailability = (
  capability: BrainCapabilityDefinition,
  controls: BrainUserControls,
  snapshot: Pick<AIBrainContextSnapshot, "inferredProfile" | "brain">,
): BrainCapabilityAvailability => {
  if (!controls.enabled) {
    return {
      status: "blocked",
      label: "Brain is off",
      reason: "Enable Brain in its controls before launching a task.",
    }
  }
  if (ANALYTICS_CAPABILITIES.has(capability.id) && !controls.allowAnalytics) {
    return {
      status: "blocked",
      label: "Analytics access off",
      reason: "Enable analytics access in Brain controls to use this capability.",
    }
  }
  if (PERSONALIZED_CAPABILITIES.has(capability.id) && !controls.personalization) {
    return {
      status: "blocked",
      label: "Personalization off",
      reason: "Enable personalization in Brain controls to use this capability.",
    }
  }
  if (PROJECT_CAPABILITIES.has(capability.id) && !controls.allowProjects) {
    return {
      status: "blocked",
      label: "Project access off",
      reason: "Enable project access in Brain controls to use this capability.",
    }
  }
  if (PROJECT_CAPABILITIES.has(capability.id) && snapshot.brain.activeProjects === 0) {
    return {
      status: "needs-project-context",
      label: "Needs project context",
      reason: "Select or create a project so Brain can use the project-specific context this capability expects.",
    }
  }
  if (capability.requiresChannelData && snapshot.inferredProfile.videoCount === 0) {
    return {
      status: "needs-channel-data",
      label: "Needs channel data",
      reason: "Connect or sync a channel so Brain can check the evidence needed for this task.",
    }
  }
  return {
    status: "ready",
    label: "Available to request",
    reason:
      "Brain will still check request fit, permissions, and available evidence when you send the prompt.",
  }
}

export const filterBrainCapabilities = (
  capabilities: BrainCapabilityDefinition[],
  query: string,
): BrainCapabilityDefinition[] => {
  const normalized = query.trim().toLowerCase()
  if (!normalized) return capabilities
  return capabilities.filter((capability) =>
    [capability.label, capability.description, capability.id, ...capability.intents].some((value) =>
      value.toLowerCase().includes(normalized),
    ),
  )
}

export const capabilityPromptFor = (capability: BrainCapabilityDefinition): string =>
  `Help me with ${capability.label.toLowerCase()}. ${capability.description} Explain what the available evidence supports, call out missing inputs or uncertainty, and give me the most useful next step. Do not claim this capability ran unless the response confirms it.`

/**
 * Capability browser — Studio composition only.
 * Sticky search + scrollable list + sticky detail/actions (mobile-safe).
 */
export const BrainCapabilityBrowser: React.FC<{
  snapshot: AIBrainContextSnapshot
  controls: BrainUserControls
  busy?: boolean
  headingId?: string
  onPrompt: (prompt: string) => void
  onEdit?: (prompt: string) => void
}> = ({
  snapshot,
  controls,
  busy = false,
  headingId = "brain-capability-browser-title",
  onPrompt,
  onEdit,
}) => {
  const [query, setQuery] = useState("")
  const [selectedId, setSelectedId] = useState<string | null>(() => BRAIN_CAPABILITY_REGISTRY[0]?.id ?? null)
  const capabilities = useMemo(() => filterBrainCapabilities(BRAIN_CAPABILITY_REGISTRY, query), [query])
  const selected = capabilities.find((capability) => capability.id === selectedId) || null
  const selectedAvailability = selected
    ? getBrainCapabilityAvailability(selected, controls, snapshot)
    : null

  return (
    <section
      aria-labelledby={headingId}
      aria-busy={busy || undefined}
      data-vt-brain-component="BrainCapabilityBrowser"
      className="vt-brain-tool-surface"
    >
      <div className="vt-brain-tool-surface__header">
        <StudioTopSplitModule
          as="div"
          sizeVariant="compact"
          title={<span id={headingId}>Capability Browser</span>}
          className="min-w-0"
        >
          <p className="text-xs font-bold leading-4">
            Find a Brain capability and prepare a guided request. Launching a prompt does not bypass evidence checks or
            permissions.
          </p>
        </StudioTopSplitModule>
      </div>

      <div className="vt-brain-tool-surface__filters">
        <StudioTextInput
          type="search"
          sizeVariant="compact"
          value={query}
          onChange={(event) => {
            const nextQuery = event.target.value
            const matchingCapabilities = filterBrainCapabilities(BRAIN_CAPABILITY_REGISTRY, nextQuery)
            setQuery(nextQuery)
            setSelectedId(matchingCapabilities[0]?.id ?? null)
          }}
          placeholder="Search capabilities, topics, or intent…"
          className="w-full min-w-0"
          aria-label="Search Brain capabilities"
          aria-controls={`${headingId}-results`}
        />
      </div>

      <p className="vt-brain-tool-surface__meta" role="status" aria-live="polite">
        {capabilities.length} of {BRAIN_CAPABILITY_REGISTRY.length} capabilities
      </p>

      <ul
        id={`${headingId}-results`}
        className="vt-brain-tool-surface__list"
        aria-label="Available Brain capabilities"
      >
        {capabilities.map((capability) => {
          const availability = getBrainCapabilityAvailability(capability, controls, snapshot)
          const isSelected = selectedId === capability.id
          return (
            <li key={capability.id} className="grid min-w-0 gap-1">
              <StudioSplitLeftButton
                sizeVariant="compact"
                icon={<Sparkles aria-hidden="true" />}
                disabled={busy}
                selected={isSelected}
                aria-pressed={isSelected}
                onClick={() => setSelectedId(isSelected ? null : capability.id)}
                className="w-full min-w-0"
                title={capability.label}
              >
                {capability.label}
              </StudioSplitLeftButton>
              <p className="px-1 text-xs font-bold leading-4">{capability.description}</p>
              <div className="px-1">
                <BrainChatStatusBadge
                  status={
                    availability.status === "ready"
                      ? "ready"
                      : availability.status === "blocked"
                        ? "error"
                        : "warning"
                  }
                  label={availability.label}
                />
              </div>
            </li>
          )
        })}
        {!capabilities.length ? (
          <li className="p-2 text-xs font-bold">
            No capabilities match “{query}”. Try analytics, SEO, audience, or publishing.
          </li>
        ) : null}
      </ul>

      <div className="vt-brain-tool-surface__detail">
        {selected && selectedAvailability ? (
          <>
            <h3 className="text-[11px] font-[1000] uppercase">{selected.label}</h3>
            <p className="mt-1 text-[10px] font-bold leading-4 text-black/70">{selectedAvailability.reason}</p>
            <p className="mt-1 text-xs font-bold leading-4">
              Evidence sections:{" "}
              {(BRAIN_CAPABILITY_EVIDENCE_REQUIREMENTS[selected.id] || []).join(", ") || "requirements not listed"}
            </p>
            <div className={`vt-brain-tool-surface__actions mt-2 ${onEdit ? "is-pair" : ""}`}>
              {onEdit ? (
                <StudioSplitTwoLineButton
                  sizeVariant="compact"
                  icon={<ArrowRight aria-hidden="true" />}
                  firstLine="EDIT"
                  secondLine="FIRST"
                  className="w-full min-w-0"
                  onClick={() => {
                    onEdit(capabilityPromptFor(selected))
                    setSelectedId(null)
                  }}
                />
              ) : null}
              <StudioSplitTwoLineButton
                sizeVariant="compact"
                icon={<Send aria-hidden="true" />}
                firstLine="SEND TO"
                secondLine="CHAT"
                disabled={busy || selectedAvailability.status === "blocked"}
                className="w-full min-w-0"
                onClick={() => {
                  onPrompt(capabilityPromptFor(selected))
                  setSelectedId(null)
                }}
              />
            </div>
          </>
        ) : (
          <p className="text-xs font-bold">Choose a capability to see prerequisites and launch a request.</p>
        )}
      </div>
    </section>
  )
}

export default BrainCapabilityBrowser
