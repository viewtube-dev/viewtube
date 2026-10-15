import { describe, expect, it, vi } from "vitest";
import { normalizeVaultVideoOperation, processVaultVideo } from "./vaultVideoWorkbench";

describe("normalizeVaultVideoOperation", () => {
  it("validates trim ranges and clamps operation choices", () => {
    expect(normalizeVaultVideoOperation({
      operation: "trim", startSeconds: 1.25, endSeconds: 8.5, outputFormat: "webm",
    })).toMatchObject({ operation: "trim", startSeconds: 1.25, endSeconds: 8.5, outputFormat: "mp4", quality: "balanced" });
  });

  it("rejects invalid or excessive trim ranges", () => {
    expect(() => normalizeVaultVideoOperation({ operation: "trim", startSeconds: 5, endSeconds: 5 })).toThrow(/end.*after.*start/i);
    expect(() => normalizeVaultVideoOperation({ operation: "trim", startSeconds: 0, endSeconds: 301 })).toThrow(/300 seconds/i);
  });

  it("rejects frame extraction outside a known duration", () => {
    expect(() => normalizeVaultVideoOperation({ operation: "extract-frame", atSeconds: 12, sourceDurationSeconds: 10 })).toThrow(/within the source duration/i);
  });
});

describe("processVaultVideo", () => {
  it("sends the normalized operation and returns a real binary response", async () => {
    const fetcher = vi.fn().mockResolvedValue(new Response(new Blob(["encoded video"], { type: "video/mp4" }), {
      status: 200,
      headers: { "X-VT-Output-Mime-Type": "video/mp4", "X-VT-Source-Bytes": "11" },
    }));
    const file = new File(["video source"], "source.mp4", { type: "video/mp4" });
    const result = await processVaultVideo(file, { operation: "trim", startSeconds: 0, endSeconds: 2 }, fetcher);
    expect(result.byteSize).toBeGreaterThan(0);
    expect(result.mimeType).toBe("video/mp4");
    expect(fetcher).toHaveBeenCalledWith("/api/media/compress-analysis", expect.objectContaining({
      method: "POST",
      headers: { "X-VT-Vault-Operation": "1" },
    }));
  });

  it("rejects non-video inputs before sending a request", async () => {
    const fetcher = vi.fn();
    await expect(processVaultVideo(new File(["doc"], "doc.txt", { type: "text/plain" }), { operation: "proxy" }, fetcher)).rejects.toThrow(/video file/i);
    expect(fetcher).not.toHaveBeenCalled();
  });
});
