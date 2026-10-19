import { describe, expect, it } from "vitest"
import {
  normalizeVaultImageTransform,
  resolveVaultImageOutputDimensions,
  type VaultImageTransform,
} from "./vaultImageWorkbench"

describe("Vault image workbench transform contracts", () => {
  it("keeps output dimensions positive and bounded when resizing", () => {
    expect(resolveVaultImageOutputDimensions(4000, 2000, {
      resizeWidth: 1000,
      resizeHeight: 1000,
      preserveAspectRatio: true,
    })).toEqual({ width: 1000, height: 500 })
  })

  it("uses explicit dimensions when aspect-ratio preservation is disabled", () => {
    expect(resolveVaultImageOutputDimensions(4000, 2000, {
      resizeWidth: 1000,
      resizeHeight: 800,
      preserveAspectRatio: false,
    })).toEqual({ width: 1000, height: 800 })
  })

  it("normalizes invalid crop coordinates and quarter-turn rotation", () => {
    const transform: VaultImageTransform = {
      crop: { x: -20, y: 10, width: 9999, height: 0 },
      rotation: 450,
      flipHorizontal: false,
      flipVertical: false,
      resizeWidth: null,
      resizeHeight: null,
      preserveAspectRatio: true,
      outputFormat: "image/png",
      quality: 0.8,
    }
    expect(normalizeVaultImageTransform(transform, 640, 480)).toMatchObject({
      crop: { x: 0, y: 10, width: 640, height: 1 },
      rotation: 90,
      outputFormat: "image/png",
      quality: 0.8,
    })
  })

  it("clamps quality and falls back from unsupported output formats", () => {
    expect(normalizeVaultImageTransform({
      crop: null,
      rotation: -90,
      flipHorizontal: false,
      flipVertical: false,
      resizeWidth: 0,
      resizeHeight: null,
      preserveAspectRatio: true,
      outputFormat: "image/gif" as VaultImageTransform["outputFormat"],
      quality: 5,
    }, 100, 80)).toMatchObject({
      rotation: 270,
      resizeWidth: null,
      outputFormat: "image/png",
      quality: 1,
    })
  })
})
