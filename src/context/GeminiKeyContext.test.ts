import { describe, expect, it, vi } from "vitest"
import { validateGeminiConnection } from "./GeminiKeyContext"

const iterable = async function* (models: Array<{ name: string; supportedGenerationMethods: string[] }>) {
  for (const model of models) yield model
}

describe("validateGeminiConnection", () => {
  it("tries another key-authorized Gemini model when the preferred model is unavailable", async () => {
    const generateContent = vi.fn()
      .mockRejectedValueOnce(Object.assign(new Error("models/gemini-2.5-flash is not found"), { status: 404 }))
      .mockResolvedValueOnce({ text: "OK" })
    const ai = {
      models: {
        list: vi.fn().mockResolvedValue(iterable([
          { name: "models/gemini-2.5-flash", supportedGenerationMethods: ["generateContent"] },
          { name: "models/gemini-2.0-flash", supportedGenerationMethods: ["generateContent"] },
        ])),
        generateContent,
      },
    }

    await expect(validateGeminiConnection(ai)).resolves.toBe("gemini-2.0-flash")
    expect(generateContent).toHaveBeenCalledTimes(2)
    expect(generateContent.mock.calls.map(([call]) => call.model)).toEqual([
      "gemini-2.5-flash",
      "gemini-2.0-flash",
    ])
  })

  it("does not treat authentication or permission errors as model fallback", async () => {
    const generateContent = vi.fn().mockRejectedValue(Object.assign(new Error("permission denied"), { status: 403 }))
    const ai = {
      models: {
        list: vi.fn().mockResolvedValue(iterable([
          { name: "models/gemini-2.5-flash", supportedGenerationMethods: ["generateContent"] },
          { name: "models/gemini-2.0-flash", supportedGenerationMethods: ["generateContent"] },
        ])),
        generateContent,
      },
    }

    await expect(validateGeminiConnection(ai)).rejects.toMatchObject({ status: 403 })
    expect(generateContent).toHaveBeenCalledTimes(1)
  })

  it("reports when the API key has no listed Gemini generateContent model", async () => {
    const ai = {
      models: {
        list: vi.fn().mockResolvedValue(iterable([
          { name: "models/embedding-001", supportedGenerationMethods: ["embedContent"] },
        ])),
        generateContent: vi.fn(),
      },
    }

    await expect(validateGeminiConnection(ai)).rejects.toThrow("NO_COMPATIBLE_GEMINI_MODEL")
    expect(ai.models.generateContent).not.toHaveBeenCalled()
  })
})
