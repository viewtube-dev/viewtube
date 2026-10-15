export type VaultVideoOperation = "trim" | "proxy" | "extract-frame" | "extract-audio" | "transcode";
export type VaultVideoQuality = "small" | "balanced" | "high";
export type VaultVideoOutputFormat = "mp4" | "webm" | "jpg" | "png" | "m4a";

export interface VaultVideoOperationConfig {
  operation: VaultVideoOperation;
  startSeconds?: number;
  endSeconds?: number;
  atSeconds?: number;
  sourceDurationSeconds?: number | null;
  outputFormat?: VaultVideoOutputFormat;
  quality?: VaultVideoQuality;
}

export interface VaultVideoOperationResult {
  blob: Blob;
  mimeType: string;
  byteSize: number;
  operation: VaultVideoOperation;
  sourceBytes: number | null;
}

const OUTPUT_MIME_TYPES: Record<VaultVideoOutputFormat, string> = {
  mp4: "video/mp4", webm: "video/webm", jpg: "image/jpeg", png: "image/png", m4a: "audio/mp4",
};

export const normalizeVaultVideoOperation = (input: VaultVideoOperationConfig): Required<Pick<VaultVideoOperationConfig, "operation" | "outputFormat" | "quality">> & VaultVideoOperationConfig => {
  if (!input || !["trim", "proxy", "extract-frame", "extract-audio", "transcode"].includes(input.operation)) {
    throw new Error("Choose a supported video operation.");
  }
  const quality = input.quality && ["small", "balanced", "high"].includes(input.quality) ? input.quality : "balanced";
  const outputFormat = input.operation === "extract-frame"
    ? (input.outputFormat === "png" ? "png" : "jpg")
    : input.operation === "extract-audio"
      ? "m4a"
      : input.operation === "transcode" && input.outputFormat === "webm" ? "webm" : input.operation === "transcode" ? "mp4" : "mp4";
  const duration = typeof input.sourceDurationSeconds === "number" && Number.isFinite(input.sourceDurationSeconds) && input.sourceDurationSeconds > 0
    ? input.sourceDurationSeconds
    : null;
  if (input.operation === "trim") {
    const start = Number(input.startSeconds);
    const end = Number(input.endSeconds);
    if (!Number.isFinite(start) || !Number.isFinite(end) || start < 0 || end <= start) {
      throw new Error("Trim end must be after trim start.");
    }
    if (end - start > 300) throw new Error("Trim duration cannot exceed 300 seconds per operation.");
    if (duration !== null && end > duration + 0.05) throw new Error("Trim range exceeds the source duration.");
    return { ...input, operation: input.operation, startSeconds: start, endSeconds: end, outputFormat, quality };
  }
  if (input.operation === "extract-frame") {
    const atSeconds = Number(input.atSeconds ?? 0);
    if (!Number.isFinite(atSeconds) || atSeconds < 0 || (duration !== null && atSeconds > duration)) {
      throw new Error("Frame time must be within the source duration.");
    }
    return { ...input, operation: input.operation, atSeconds, outputFormat, quality };
  }
  return { ...input, operation: input.operation, outputFormat, quality };
};

export const processVaultVideo = async (
  source: File | Blob,
  requested: VaultVideoOperationConfig,
  fetcher: typeof fetch = fetch,
): Promise<VaultVideoOperationResult> => {
  if (!(source instanceof Blob) || source.size <= 0) throw new Error("Select a non-empty video file.");
  if (!source.type.startsWith("video/")) throw new Error("Select a video asset for this operation.");
  if (source.size > 64 * 1024 * 1024) throw new Error("Video uploads are limited to 64 MB per operation.");
  const config = normalizeVaultVideoOperation(requested);
  const form = new FormData();
  form.append("mode", JSON.stringify(config));
  form.append("file", source, source instanceof File ? source.name : "vault-source.mp4");
  const response = await fetcher("/api/media/compress-analysis?vaultOperation=1", {
    method: "POST",
    body: form,
  });
  if (!response.ok) {
    let message = "Video processing failed. Confirm that the server has FFmpeg enabled.";
    try {
      const payload = await response.json() as { message?: string };
      if (payload.message) message = payload.message;
    } catch {}
    throw new Error(message);
  }
  const blob = await response.blob();
  if (!blob.size) throw new Error("The processor returned an empty output.");
  const mimeType = response.headers.get("X-VT-Output-Mime-Type") || blob.type || OUTPUT_MIME_TYPES[config.outputFormat];
  return {
    blob,
    mimeType,
    byteSize: blob.size,
    operation: config.operation,
    sourceBytes: Number(response.headers.get("X-VT-Source-Bytes")) || source.size,
  };
};
