import "fake-indexeddb/auto";
import { beforeEach, describe, expect, it } from "vitest";
import {
  deleteVaultMediaBinary,
  getVaultMediaBinary,
  listVaultMediaBinaries,
  saveVaultMediaBinary,
} from "./vaultMediaBinaryStore";

describe("Vault media binary store", () => {
  beforeEach(async () => {
    const request = indexedDB.deleteDatabase("viewtube-vault-media-binary");
    await new Promise<void>((resolve) => { request.onsuccess = () => resolve(); request.onerror = () => resolve(); request.onblocked = () => resolve(); });
  });

  it("persists the actual Blob and source lineage across reads", async () => {
    const blob = new Blob(["processed output"], { type: "video/mp4" });
    const saved = await saveVaultMediaBinary({
      blob, name: "trimmed.mp4", mimeType: "video/mp4", sourceAssetId: "asset-source",
      operation: "trim", parameters: { startSeconds: 2, endSeconds: 5 },
    });
    const loaded = await getVaultMediaBinary(saved.id);
    expect(loaded?.blob.size).toBe(blob.size);
    expect(loaded?.sourceAssetId).toBe("asset-source");
    expect(loaded?.parameters).toEqual({ startSeconds: 2, endSeconds: 5 });
  });

  it("lists derivatives by source and removes an explicit record", async () => {
    const saved = await saveVaultMediaBinary({
      blob: new Blob(["x"]), name: "frame.jpg", mimeType: "image/jpeg", sourceAssetId: "source-a",
      operation: "extract-frame", parameters: { atSeconds: 2 },
    });
    expect((await listVaultMediaBinaries("source-a")).map((item) => item.id)).toContain(saved.id);
    await deleteVaultMediaBinary(saved.id);
    expect(await getVaultMediaBinary(saved.id)).toBeNull();
  });

  it("requires a source ID before persisting a derivative", async () => {
    await expect(saveVaultMediaBinary({
      blob: new Blob(["x"]), name: "output.mp4", mimeType: "video/mp4", sourceAssetId: " ",
      operation: "proxy", parameters: {},
    })).rejects.toThrow(/source asset ID/i);
  });
});
