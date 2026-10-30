import type { StructuredBrainModelOutput } from "../../gemini"

export interface BrainStructuredGenerationInput {
 history: any[]
 userText: string
 systemInstruction: string
 /** Shared identity from the initiating creator action; not a provider-generated ID. */
 operationId?: string
}

export interface BrainJsonGenerationInput {
 userText: string
 systemInstruction: string
 responseSchema?: Record<string, unknown>
 capability?: "analysis" | "thinking"
 history?: any[]
 tools?: Array<Record<string, unknown>>
}

/**
 * Provider-neutral operations required by creator-facing Brain generation.
 *
 * Implementations own provider SDKs and translate their native behavior into
 * these stable inputs and outputs. They must not own creator context, evidence,
 * authorization policy, orchestration, or usage ledgers.
 */
export interface BrainModelProvider {
 generateStructuredResponse(input: BrainStructuredGenerationInput): Promise<StructuredBrainModelOutput>
 generateJsonObject(input: BrainJsonGenerationInput): Promise<unknown>
}

export interface BrainModelGateway {
 generateStructuredResponse(input: BrainStructuredGenerationInput): Promise<StructuredBrainModelOutput>
 generateJsonObject?(input: BrainJsonGenerationInput): Promise<unknown>
}

/**
 * Builds the canonical gateway around an injected provider implementation.
 * The factory makes provider substitution explicit without introducing a
 * second runtime, context broker, or orchestration layer.
 */
export const createBrainModelGateway = (provider: BrainModelProvider): BrainModelGateway => ({
 generateStructuredResponse: (input) => provider.generateStructuredResponse(input),
 generateJsonObject: (input) => provider.generateJsonObject(input),
})

/**
 * Gemini remains the compatibility provider for this migration phase.
 * Load it only when generation is requested, keeping the gateway contract
 * independent of the provider module's runtime and SDK initialization.
 */
const geminiBrainModelProvider: BrainModelProvider = {
 generateStructuredResponse: async (input) => {
  const { generateStructuredBrainResponse } = await import("../../gemini")
  return generateStructuredBrainResponse(input)
 },
 generateJsonObject: async (input) => {
  const { generateBrainJsonObject } = await import("../../gemini")
  return generateBrainJsonObject(input)
 },
}

export const defaultBrainModelGateway = createBrainModelGateway(geminiBrainModelProvider)
