import { describe, expect, it } from "vitest";
import {
  buildVaultVideoFfmpegArgs,
  normalizeVaultVideoOperation,
} from "./vault-media-processing.mjs";

describe("normalizeVaultVideoOperation", () => {
  it("normalizes a valid trim range and output format", () => {
    expect(normalizeVaultVideoOperation({
      operation: "trim",
      startSeconds: 1.25,
      endSeconds: 8.5,
      outputFormat: "mp4",
    }, 20)).toEqual({
      operation: "trim",
      startSeconds: 1.25,
      endSeconds: 8.5,
      outputFormat: "mp4",
      quality: "balanced",
      maxDurationSeconds: 7.25,
    });
  });

  it("rejects a trim whose end does not follow its start", () => {
    expect(() => normalizeVaultVideoOperation({
      operation: "trim",
      startSeconds: 8,
      endSeconds: 8,
    }, 20)).toThrow(/end.*after.*start/i);
  });

  it("rejects ranges that exceed known source duration", () => {
    expect(() => normalizeVaultVideoOperation({
      operation: "trim",
      startSeconds: 2,
      endSeconds: 30,
    }, 20)).toThrow(/source duration/i);
  });

  it("does not accept arbitrary FFmpeg options from the client", () => {
    expect(() => normalizeVaultVideoOperation({
      operation: "trim",
      startSeconds: 0,
      endSeconds: 3,
      args: ["-filter_complex", "malicious"],
    }, 20)).not.toThrow();
    const args = buildVaultVideoFfmpegArgs({
      operation: "trim",
      startSeconds: 0,
      endSeconds: 3,
      outputFormat: "mp4",
      quality: "balanced",
      maxDurationSeconds: 3,
    }, "/tmp/input.mp4", "/tmp/output.mp4");
    expect(args.join(" ")).not.toContain("malicious");
  });

  it("builds an allowlisted frame extraction command", () => {
    const operation = normalizeVaultVideoOperation({
      operation: "extract-frame",
      atSeconds: 2,
      outputFormat: "jpg",
    }, 10);
    const args = buildVaultVideoFfmpegArgs(operation, "/tmp/input.mp4", "/tmp/output.jpg");
    expect(args).toContain("-frames:v");
    expect(args).toContain("1");
    expect(args).toContain("/tmp/output.jpg");
  });

  it("supports proxy creation with conservative resource limits", () => {
    const operation = normalizeVaultVideoOperation({ operation: "proxy", quality: "small" }, 600);
    const args = buildVaultVideoFfmpegArgs(operation, "/tmp/input.mp4", "/tmp/proxy.mp4");
    expect(args.join(" ")).toContain("scale=");
    expect(args).toContain("-t");
    expect(args).toContain("300");
  });
});
