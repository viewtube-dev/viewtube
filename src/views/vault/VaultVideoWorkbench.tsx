import React from "react";
import { Film, HardDrive } from "lucide-react";
import { SubToolboxInnerActionButton } from "../components/Toolbox";
import { SubToolboxInput, SubToolboxSelect, SubToolboxStatePanel } from "../components/subtoolbox/SubToolboxPrimitives";
import { createImportedVaultAsset } from "../services/vaultAdapter";
import { extractVaultVideoThumbnail } from "../services/vaultVideoThumbnail";
import { processVaultVideo, type VaultVideoOperation, type VaultVideoQuality } from "../services/vaultVideoWorkbench";
import { getVaultMediaBinary, saveVaultMediaBinary } from "../services/vaultMediaBinaryStore";
import type { VaultAsset } from "../types";

export interface VaultVideoWorkbenchProps {
  asset: VaultAsset;
  onDerivativeCreated?: () => void;
}

const extensionFor = (mimeType: string) => mimeType === "image/jpeg" ? "jpg" : mimeType === "image/png" ? "png" : mimeType === "audio/mp4" ? "m4a" : mimeType === "video/webm" ? "webm" : "mp4";

const blobToDataUrl = (blob: Blob): Promise<string> => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.onload = () => typeof reader.result === "string" ? resolve(reader.result) : reject(new Error("Could not create a compact media preview."));
  reader.onerror = () => reject(new Error("Could not create a compact media preview."));
  reader.readAsDataURL(blob);
});

const loadVaultVideoSourceBlob = async (asset: VaultAsset): Promise<Blob> => {
  const binaryStoreId = typeof asset.metadata?.binaryStoreId === "string" ? asset.metadata.binaryStoreId : "";
  if (binaryStoreId) {
    const record = await getVaultMediaBinary(binaryStoreId);
    if (record?.blob) return record.blob;
    throw new Error("This derivative's local binary is missing. Re-import the source or restore the derivative.");
  }
  const sourceUrl = asset.url || asset.previewUrl;
  if (!sourceUrl) throw new Error("This video has no readable source URL. Re-import the original video file.");
  const response = await fetch(sourceUrl);
  if (!response.ok) throw new Error(`Video source returned HTTP ${response.status}.`);
  return response.blob();
};

export const VaultVideoWorkbench: React.FC<VaultVideoWorkbenchProps> = ({ asset, onDerivativeCreated }) => {
  const [operation, setOperation] = React.useState<VaultVideoOperation>("trim");
  const [quality, setQuality] = React.useState<VaultVideoQuality>("balanced");
  const [startSeconds, setStartSeconds] = React.useState(0);
  const [endSeconds, setEndSeconds] = React.useState(10);
  const [atSeconds, setAtSeconds] = React.useState(0);
  const [durationSeconds, setDurationSeconds] = React.useState<number | null>(null);
  const [result, setResult] = React.useState<Awaited<ReturnType<typeof processVaultVideo>> | null>(null);
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);
  const [savedId, setSavedId] = React.useState<string | null>(null);
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState("");
  const [message, setMessage] = React.useState("");

  React.useEffect(() => {
    let cancelled = false;
    const loadDuration = async () => {
      if (!asset.url && !asset.previewUrl && !asset.metadata?.binaryStoreId) return;
      try {
        const blob = await loadVaultVideoSourceBlob(asset);
        const objectUrl = URL.createObjectURL(blob);
        try {
          const duration = await new Promise<number>((resolve, reject) => {
            const video = document.createElement("video");
            video.preload = "metadata";
            video.onloadedmetadata = () => { const value = video.duration; video.src = ""; resolve(value); };
            video.onerror = () => reject(new Error("Could not read source duration."));
            video.src = objectUrl;
          });
          if (!cancelled && Number.isFinite(duration) && duration > 0) {
            setDurationSeconds(duration);
            setEndSeconds(Math.min(10, duration));
          }
        } finally { URL.revokeObjectURL(objectUrl); }
      } catch { /* Duration is optional; the server still validates trim values. */ }
    };
    if (asset.kind === "video") void loadDuration();
    return () => { cancelled = true; };
  }, [asset.id, asset.kind, asset.url, asset.previewUrl]);

  React.useEffect(() => () => { if (previewUrl) URL.revokeObjectURL(previewUrl); }, [previewUrl]);

  const clearResult = () => {
    setResult(null);
    setSavedId(null);
    setMessage("");
    setPreviewUrl((previous) => { if (previous) URL.revokeObjectURL(previous); return null; });
  };

  const run = async () => {
    setBusy(true);
    setError("");
    setMessage("");
    clearResult();
    try {
      const source = await loadVaultVideoSourceBlob(asset);
      const config = {
        operation,
        quality,
        sourceDurationSeconds: durationSeconds,
        startSeconds,
        endSeconds,
        atSeconds,
      } as const;
      const processed = await processVaultVideo(new File([source], asset.name, { type: source.type || asset.mimeType || "video/mp4" }), config);
      setResult(processed);
      setPreviewUrl(URL.createObjectURL(processed.blob));
      setMessage("Processing produced real output bytes. The original asset has not been changed.");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Video processing failed.");
    } finally {
      setBusy(false);
    }
  };

  const download = () => {
    if (!result || !previewUrl) return;
    const link = document.createElement("a");
    link.href = previewUrl;
    link.download = `${asset.name.replace(/\.[^.]+$/, "")}-${operation}.${extensionFor(result.mimeType)}`;
    link.click();
  };

  const saveDerivative = async () => {
    if (!result || !previewUrl || savedId) return;
    try {
      const outputName = `${asset.name.replace(/\.[^.]+$/, "")}-${operation}.${extensionFor(result.mimeType)}`;
      const binary = await saveVaultMediaBinary({
        blob: result.blob,
        name: outputName,
        mimeType: result.mimeType,
        sourceAssetId: asset.id,
        operation,
        parameters: { operation, quality, startSeconds, endSeconds, atSeconds, sourceDurationSeconds: durationSeconds },
      });
      let durablePreviewUrl: string | null = null;
      if (result.mimeType.startsWith("video/")) {
        durablePreviewUrl = await extractVaultVideoThumbnail(new File([result.blob], outputName, { type: result.mimeType }));
      } else if (result.mimeType.startsWith("image/")) {
        durablePreviewUrl = await blobToDataUrl(result.blob);
      }
      const created = createImportedVaultAsset({
        name: outputName,
        kind: result.mimeType.startsWith("image/") ? "image" : result.mimeType.startsWith("audio/") ? "audio" : "video",
        projectId: asset.projectId,
        projectName: asset.projectName,
        toolId: "creator-vault-os",
        url: null,
        previewUrl: durablePreviewUrl,
        mimeType: result.mimeType,
        tags: [...new Set([...(asset.tags || []), "derivative", "processed"])],
        metadata: {
          binaryStoreId: binary.id,
          derivativeOfAssetId: asset.id,
          sourceAssetId: asset.id,
          derivativeOperation: operation,
          operationParameters: { operation, quality, startSeconds, endSeconds, atSeconds },
          byteSize: result.byteSize,
          lifecycle: "CANDIDATE",
          storage: "indexeddb-local",
          durableAcrossReloads: true,
        },
      });
      if (!created.id) throw new Error("Vault did not return an asset identity.");
      setSavedId(created.id);
      setMessage("Derivative bytes are stored in browser IndexedDB with source lineage. Storage is local to this browser/device, not cloud-synced.");
      onDerivativeCreated?.();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not store the media derivative.");
    }
  };

  if (asset.kind !== "video") {
    return <SubToolboxStatePanel level="l1" state="empty" message="Select one video asset to use the Video Workbench." />;
  }

  return (
    <section className="flex min-w-0 flex-col gap-3 rounded-md border-2 border-current p-3" data-vault-video-workbench aria-label="Video Workbench">
      <header className="flex items-start gap-2">
        <Film aria-hidden="true" className="mt-0.5 shrink-0" />
        <div>
          <h3 className="text-sm font-black uppercase">Video Workbench</h3>
          <p className="text-xs font-bold opacity-65">Trim, create proxy, transcode, extract a frame, or extract audio. The original remains unchanged.</p>
        </div>
      </header>
      <div className="text-xs font-black uppercase">Source · {asset.name}</div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <label className="flex min-w-0 flex-col gap-1 text-xs font-black uppercase">
          Operation
          <SubToolboxSelect value={operation} onChange={(event) => { setOperation(event.target.value as VaultVideoOperation); clearResult(); }}>
            <option value="trim">Trim clip</option>
            <option value="proxy">Create proxy</option>
            <option value="transcode">Convert format / compress</option>
            <option value="extract-frame">Extract frame</option>
            <option value="extract-audio">Extract audio</option>
          </SubToolboxSelect>
        </label>
        <label className="flex min-w-0 flex-col gap-1 text-xs font-black uppercase">
          Quality / size
          <SubToolboxSelect value={quality} onChange={(event) => { setQuality(event.target.value as VaultVideoQuality); clearResult(); }}>
            <option value="small">Small file</option>
            <option value="balanced">Balanced</option>
            <option value="high">Higher quality</option>
          </SubToolboxSelect>
        </label>
        {operation === "trim" ? (
          <>
            <label className="flex min-w-0 flex-col gap-1 text-xs font-black uppercase">Start (seconds)
              <SubToolboxInput type="number" min={0} max={durationSeconds ?? 300} step={0.1} value={startSeconds} onChange={(event) => { setStartSeconds(Number(event.target.value)); clearResult(); }} />
            </label>
            <label className="flex min-w-0 flex-col gap-1 text-xs font-black uppercase">End (seconds)
              <SubToolboxInput type="number" min={0.1} max={durationSeconds ?? 300} step={0.1} value={endSeconds} onChange={(event) => { setEndSeconds(Number(event.target.value)); clearResult(); }} />
            </label>
          </>
        ) : null}
        {operation === "extract-frame" ? (
          <label className="flex min-w-0 flex-col gap-1 text-xs font-black uppercase">Frame time (seconds)
            <SubToolboxInput type="number" min={0} max={durationSeconds ?? 300} step={0.1} value={atSeconds} onChange={(event) => { setAtSeconds(Number(event.target.value)); clearResult(); }} />
          </label>
        ) : null}
      </div>
      <p className="text-xs font-bold opacity-65">
        Processing is limited to 64 MB source/output and 300 seconds per job. The server must have FFmpeg installed. Large files must be imported or reduced before processing.
        {durationSeconds ? ` Source duration: ${durationSeconds.toFixed(1)} seconds.` : ""}
      </p>
      <div className="flex flex-wrap gap-2">
        <SubToolboxInnerActionButton label={busy ? "Processing…" : "Process & Preview"} iconName="refresh" tone="cyan" onClick={() => void run()} disabled={busy} />
        {result ? <SubToolboxInnerActionButton label="Download Output" iconName="download" tone="green" onClick={download} /> : null}
        {result ? <SubToolboxInnerActionButton label={savedId ? "Derivative Stored" : "Save Derivative"} iconName="database" tone="purple" onClick={() => void saveDerivative()} disabled={Boolean(savedId)} /> : null}
      </div>
      {error ? <SubToolboxStatePanel level="l1" state="error" message={error} /> : null}
      {message ? <SubToolboxStatePanel level="l1" state="ready" message={message} /> : null}
      {result && previewUrl ? (
        <section className="flex min-w-0 flex-col gap-2 border-t-2 border-current pt-3" aria-label="Video processing result">
          <div className="text-xs font-black uppercase">Output · {result.mimeType} · {(result.byteSize / 1024 / 1024).toFixed(2)} MB</div>
          {result.mimeType.startsWith("image/") ? <img src={previewUrl} alt="Extracted video frame" className="max-h-80 w-full object-contain" /> :
            result.mimeType.startsWith("audio/") ? <audio controls src={previewUrl} className="w-full" /> :
              <video controls playsInline src={previewUrl} className="max-h-80 w-full bg-black" />}
          <p className="text-xs font-bold opacity-65"><HardDrive aria-hidden="true" className="mr-1 inline h-3 w-3" />Output is a new derivative; it does not replace the source.</p>
        </section>
      ) : null}
    </section>
  );
};

export default VaultVideoWorkbench;
