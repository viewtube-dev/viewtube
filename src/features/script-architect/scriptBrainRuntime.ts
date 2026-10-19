import type { BrainJsonTaskRequest } from "../../services/brain/runtime/BrainRuntime";

/** Build the stable BrainRuntime request envelope for Script Architect generation. */
export function buildScriptArchitectBrainTaskRequest(input: {
  userText: string;
  systemInstruction: string;
  responseSchema: Record<string, unknown>;
  projectId?: string | null;
  contentBuildId?: string | null;
  visibleContext?: Record<string, unknown> | null;
}): BrainJsonTaskRequest {
  return {
    surface: "studio-tool",
    assetType: "script",
    capability: "analysis",
    projectId: input.projectId || null,
    contentBuildId: input.contentBuildId || null,
    userText: input.userText,
    systemInstruction: input.systemInstruction,
    responseSchema: input.responseSchema,
    visibleContext: input.visibleContext || null,
  };
}
