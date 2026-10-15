import { promises as fs } from "node:fs";
import os from "node:os";
import path from "node:path";
import crypto from "node:crypto";
import { spawn } from "node:child_process";

const MAX_REQUEST_BYTES = Number(process.env.VAULT_MEDIA_MAX_REQUEST_BYTES || 64 * 1024 * 1024);
const MAX_OUTPUT_BYTES = Number(process.env.VAULT_MEDIA_MAX_OUTPUT_BYTES || 64 * 1024 * 1024);
const MAX_DURATION_SECONDS = Number(process.env.VAULT_MEDIA_MAX_DURATION_SECONDS || 300);
const ALLOWED_MIME_TYPES = new Set([
  "video/mp4", "video/quicktime", "video/webm", "video/x-matroska",
  "video/ogg", "video/x-msvideo", "video/mpeg",
]);
const OUTPUT_TYPES = new Set(["mp4", "webm", "jpg", "png", "m4a"]);
const QUALITY = new Set(["small", "balanced", "high"]);

const json = (res, status, payload) => {
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST,OPTIONS",
    "Cache-Control": "no-store",
  });
  res.end(JSON.stringify(payload));
};

const parseBoundary = (contentType) => {
  const match = String(contentType || "").match(/boundary=(?:"([^"]+)"|([^;]+))/i);
  return match ? (match[1] || match[2]).trim() : "";
};

const parseMultipart = (buffer, boundary) => {
  const delimiter = Buffer.from(`--${boundary}`);
  const parts = [];
  let offset = 0;
  while (true) {
    const start = buffer.indexOf(delimiter, offset);
    if (start < 0) break;
    const next = buffer.indexOf(delimiter, start + delimiter.length);
    if (next < 0) break;
    let part = buffer.subarray(start + delimiter.length, next);
    if (part.subarray(0, 2).toString() === "\r\n") part = part.subarray(2);
    if (part.subarray(part.length - 2).toString() === "\r\n") part = part.subarray(0, part.length - 2);
    const headerEnd = part.indexOf(Buffer.from("\r\n\r\n"));
    if (headerEnd >= 0) {
      const headers = part.subarray(0, headerEnd).toString("utf8");
      const data = part.subarray(headerEnd + 4);
      const name = headers.match(/name="([^"]+)"/i)?.[1] || "";
      const filename = headers.match(/filename="([^"]*)"/i)?.[1];
      const mimeType = headers.match(/content-type:\s*([^\r\n]+)/i)?.[1]?.trim() || "application/octet-stream";
      parts.push({ name, filename, mimeType, data });
    }
    offset = next;
  }
  const file = parts.find((part) => part.name === "file" && part.filename !== undefined);
  const modePart = parts.find((part) => part.name === "mode");
  return { file, mode: modePart?.data.toString("utf8").trim() || "" };
};

const readBody = (req, maxBytes) => new Promise((resolve, reject) => {
  const chunks = [];
  let size = 0;
  let rejected = false;
  const contentLength = Number(req.headers["content-length"] || 0);
  if (contentLength > maxBytes) {
    const error = new Error("Upload exceeds the configured media processing limit.");
    error.statusCode = 413;
    reject(error);
    req.resume();
    return;
  }
  req.on("data", (chunk) => {
    size += chunk.length;
    if (size > maxBytes && !rejected) {
      rejected = true;
      const error = new Error("Upload exceeds the configured media processing limit.");
      error.statusCode = 413;
      reject(error);
      req.resume();
      return;
    }
    if (!rejected) chunks.push(chunk);
  });
  req.on("error", reject);
  req.on("end", () => { if (!rejected) resolve(Buffer.concat(chunks)); });
});

const runFfmpeg = (args) => new Promise((resolve, reject) => {
  const child = spawn("ffmpeg", args, { stdio: ["ignore", "ignore", "pipe"] });
  let stderr = "";
  child.stderr.on("data", (chunk) => {
    stderr = (stderr + String(chunk || "")).slice(-12000);
  });
  child.on("error", reject);
  child.on("close", (code) => {
    if (code === 0) resolve();
    else reject(new Error(stderr || `ffmpeg exited with code ${code}`));
  });
});

const finite = (value) => typeof value === "number" && Number.isFinite(value);
const clamp = (value, low, high) => Math.max(low, Math.min(high, value));

export const normalizeVaultVideoOperation = (input, sourceDurationSeconds = null) => {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    throw new Error("An operation configuration is required.");
  }
  const operation = String(input.operation || "");
  if (!["trim", "proxy", "extract-frame", "extract-audio", "transcode"].includes(operation)) {
    throw new Error("Unsupported video operation.");
  }
  const outputFormat = String(input.outputFormat || (operation === "extract-frame" ? "jpg" : operation === "extract-audio" ? "m4a" : "mp4"));
  if (!OUTPUT_TYPES.has(outputFormat)) throw new Error("Unsupported output format.");
  const quality = QUALITY.has(input.quality) ? input.quality : "balanced";
  const duration = finite(sourceDurationSeconds) && sourceDurationSeconds > 0 ? sourceDurationSeconds : null;

  if (operation === "trim") {
    const startSeconds = Number(input.startSeconds);
    const endSeconds = Number(input.endSeconds);
    if (!finite(startSeconds) || !finite(endSeconds) || startSeconds < 0 || endSeconds <= startSeconds) {
      throw new Error("Trim end must be after trim start.");
    }
    if (endSeconds - startSeconds > MAX_DURATION_SECONDS) {
      throw new Error(`Trim duration cannot exceed ${MAX_DURATION_SECONDS} seconds.`);
    }
    if (duration !== null && endSeconds > duration + 0.05) {
      throw new Error("Trim range exceeds the source duration.");
    }
    return { operation, startSeconds, endSeconds, outputFormat: "mp4", quality, maxDurationSeconds: endSeconds - startSeconds };
  }

  if (operation === "extract-frame") {
    const atSeconds = Number(input.atSeconds ?? 0);
    if (!finite(atSeconds) || atSeconds < 0 || (duration !== null && atSeconds > duration)) {
      throw new Error("Frame time must be within the source duration.");
    }
    return { operation, atSeconds, outputFormat: outputFormat === "png" ? "png" : "jpg", quality, maxDurationSeconds: 1 };
  }

  if (operation === "extract-audio") {
    return { operation, outputFormat: "m4a", quality, maxDurationSeconds: Math.min(duration ?? MAX_DURATION_SECONDS, MAX_DURATION_SECONDS) };
  }

  const maxDurationSeconds = Math.min(duration ?? MAX_DURATION_SECONDS, MAX_DURATION_SECONDS);
  return { operation, outputFormat: operation === "transcode" && outputFormat === "webm" ? "webm" : "mp4", quality, maxDurationSeconds };
};

export const buildVaultVideoFfmpegArgs = (config, inputPath, outputPath) => {
  const args = ["-nostdin", "-hide_banner", "-y", "-i", inputPath];
  if (config.operation === "trim") {
    args.push("-ss", String(config.startSeconds), "-t", String(config.maxDurationSeconds), "-map", "0:v:0?", "-map", "0:a:0?", "-c:v", "libx264", "-preset", "veryfast");
    args.push(...(config.quality === "small" ? ["-crf", "30"] : config.quality === "high" ? ["-crf", "20"] : ["-crf", "24"]));
    args.push("-c:a", "aac", "-movflags", "+faststart");
  } else if (config.operation === "proxy") {
    const maxWidth = config.quality === "high" ? 1280 : config.quality === "balanced" ? 854 : 480;
    const maxHeight = config.quality === "high" ? 720 : config.quality === "balanced" ? 480 : 270;
    args.push("-map", "0:v:0?", "-map", "0:a:0?", "-vf", `scale='min(${maxWidth},iw)':'min(${maxHeight},ih)':force_original_aspect_ratio=decrease`, "-c:v", "libx264", "-preset", "veryfast", "-crf", config.quality === "small" ? "30" : "26", "-c:a", "aac", "-movflags", "+faststart");
  } else if (config.operation === "extract-frame") {
    args.push("-ss", String(config.atSeconds), "-frames:v", "1");
    if (config.outputFormat === "jpg") args.push("-q:v", "3");
  } else if (config.operation === "extract-audio") {
    args.push("-map", "0:a:0", "-vn", "-c:a", "aac", "-b:a", config.quality === "high" ? "192k" : config.quality === "small" ? "64k" : "128k");
  } else if (config.operation === "transcode") {
    args.push("-map", "0:v:0?", "-map", "0:a:0?", "-c:v", "libx264", "-preset", "veryfast", "-crf", config.quality === "small" ? "30" : config.quality === "high" ? "20" : "24", "-c:a", "aac", "-movflags", "+faststart");
    if (config.outputFormat === "webm") args.push("-c:v", "libvpx-vp9", "-c:a", "libopus");
  }
  if (config.operation !== "extract-frame") args.push("-t", String(config.maxDurationSeconds));
  args.push(outputPath);
  return args;
};

const extensionFor = (config) => config.operation === "extract-frame" ? config.outputFormat : config.outputFormat;
const mimeFor = (config) => ({
  mp4: "video/mp4", webm: "video/webm", jpg: "image/jpeg", png: "image/png", m4a: "audio/mp4",
})[config.outputFormat];

const safeUnlink = async (filePath) => {
  if (!filePath) return;
  try { await fs.unlink(filePath); } catch {}
};

export const handleVaultMediaProcessingRoute = async (req, res) => {
  let tempRoot = null;
  let inputPath = null;
  let outputPath = null;
  try {
    const contentType = String(req.headers["content-type"] || "");
    if (!contentType.toLowerCase().includes("multipart/form-data")) {
      return json(res, 400, { error: "INVALID_CONTENT_TYPE", message: "Use multipart/form-data." });
    }
    const boundary = parseBoundary(contentType);
    if (!boundary) return json(res, 400, { error: "MISSING_BOUNDARY", message: "Multipart boundary missing." });
    const body = await readBody(req, MAX_REQUEST_BYTES);
    const { file, mode } = parseMultipart(body, boundary);
    if (!file?.data?.length) return json(res, 400, { error: "FILE_REQUIRED", message: "A source media file is required." });
    if (!ALLOWED_MIME_TYPES.has(file.mimeType.toLowerCase())) {
      return json(res, 415, { error: "UNSUPPORTED_MEDIA_TYPE", message: "This video format is not supported.", mimeType: file.mimeType });
    }
    let requested;
    try { requested = JSON.parse(mode); } catch { return json(res, 400, { error: "INVALID_OPERATION", message: "Operation configuration must be valid JSON in the mode field." }); }
    const config = normalizeVaultVideoOperation(requested, finite(requested.sourceDurationSeconds) ? requested.sourceDurationSeconds : null);
    tempRoot = await fs.mkdtemp(path.join(os.tmpdir(), "vt-vault-media-"));
    const inputExt = file.mimeType === "video/webm" ? "webm" : file.mimeType === "video/quicktime" ? "mov" : file.mimeType === "video/x-matroska" ? "mkv" : "mp4";
    inputPath = path.join(tempRoot, `input-${crypto.randomUUID()}.${inputExt}`);
    outputPath = path.join(tempRoot, `output-${crypto.randomUUID()}.${extensionFor(config)}`);
    await fs.writeFile(inputPath, file.data);
    await runFfmpeg(buildVaultVideoFfmpegArgs(config, inputPath, outputPath));
    const output = await fs.readFile(outputPath);
    if (!output.length) return json(res, 422, { error: "EMPTY_OUTPUT", message: "FFmpeg produced an empty output." });
    if (output.length > MAX_OUTPUT_BYTES) {
      return json(res, 413, { error: "OUTPUT_TOO_LARGE", message: "Output exceeds the configured processing limit.", maxOutputBytes: MAX_OUTPUT_BYTES });
    }
    res.writeHead(200, {
      "Content-Type": mimeFor(config),
      "Content-Length": String(output.length),
      "Cache-Control": "no-store",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Methods": "POST,OPTIONS",
      "X-VT-Operation": config.operation,
      "X-VT-Output-Bytes": String(output.length),
      "X-VT-Output-Mime-Type": mimeFor(config),
      "X-VT-Source-Bytes": String(file.data.length),
    });
    res.end(output);
  } catch (error) {
    const status = Number(error?.statusCode) || (String(error?.message || "").includes("Upload exceeds") ? 413 : 500);
    console.error("[vault-media-processing] failed", error);
    return json(res, status, {
      error: status === 413 ? "MEDIA_LIMIT_EXCEEDED" : "MEDIA_PROCESSING_FAILED",
      message: status === 413 ? "Media processing size limit exceeded." : "Media processing failed. Check that FFmpeg is installed and the source media is valid.",
    });
  } finally {
    await safeUnlink(inputPath);
    await safeUnlink(outputPath);
    if (tempRoot) {
      try { await fs.rmdir(tempRoot); } catch {}
    }
  }
};
