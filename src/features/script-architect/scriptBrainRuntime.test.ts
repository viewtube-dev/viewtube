import { describe, expect, it } from "vitest";
import { buildScriptArchitectBrainTaskRequest } from "./scriptBrainRuntime";

describe("buildScriptArchitectBrainTaskRequest", () => {
  it("preserves the script prompt/schema and associates the request with project work", () => {
    const responseSchema = { type: "OBJECT", properties: { sections: { type: "ARRAY" } } };
    const request = buildScriptArchitectBrainTaskRequest({
      userText: "Script prompt",
      systemInstruction: "Return Script Architect JSON.",
      responseSchema,
      projectId: "project-123",
      contentBuildId: "build-456",
      visibleContext: { tool: "script-architect", topic: "Example topic" },
    });

    expect(request).toMatchObject({
      surface: "studio-tool",
      assetType: "script",
      capability: "analysis",
      projectId: "project-123",
      contentBuildId: "build-456",
      userText: "Script prompt",
      systemInstruction: "Return Script Architect JSON.",
      responseSchema,
      visibleContext: { tool: "script-architect", topic: "Example topic" },
    });
  });

  it("supports script drafts without an active project", () => {
    const request = buildScriptArchitectBrainTaskRequest({
      userText: "Prompt",
      systemInstruction: "System",
      responseSchema: {},
    });

    expect(request.projectId).toBeNull();
    expect(request.contentBuildId).toBeNull();
    expect(request.assetType).toBe("script");
    expect(request.capability).toBe("analysis");
  });
});
