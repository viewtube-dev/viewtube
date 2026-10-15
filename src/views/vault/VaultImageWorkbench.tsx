import React from "react"
import { Download, Image as ImageIcon, RotateCcw, WandSparkles } from "lucide-react"
import { SubToolboxInnerActionButton } from "../components/Toolbox"
import {
  SubToolboxInput,
  SubToolboxSelect,
  SubToolboxStatePanel,
} from "../components/subtoolbox/SubToolboxPrimitives"
import { createImportedVaultAsset } from "../services/vaultAdapter"
import {
  DEFAULT_VAULT_IMAGE_TRANSFORM,
  transformVaultImage,
  type VaultImageCrop,
  type VaultImageOutputFormat,
  type VaultImageTransform,
  type VaultImageTransformResult,
} from "../services/vaultImageWorkbench"
import type { VaultAsset } from "../types"

const MAX_INLINE_VAULT_DERIVATIVE_BYTES = 750 * 1024

const blobToDataUrl = (blob: Blob) => new Promise<string>((resolve, reject) => {
  const reader = new FileReader()
  reader.onload = () => typeof reader.result === "string" ? resolve(reader.result) : reject(new Error("Could not read the derivative output."))
  reader.onerror = () => reject(new Error("Could not read the derivative output."))
  reader.readAsDataURL(blob)
})

const extensionFor = (mimeType: string) => mimeType === "image/jpeg" ? "jpg" : mimeType === "image/webp" ? "webp" : "png"

export interface VaultImageWorkbenchProps {
  asset: VaultAsset
  onDerivativeCreated?: () => void
}

export const VaultImageWorkbench: React.FC<VaultImageWorkbenchProps> = ({ asset, onDerivativeCreated }) => {
  const [transform, setTransform] = React.useState<VaultImageTransform>({ ...DEFAULT_VAULT_IMAGE_TRANSFORM })
  const [cropEnabled, setCropEnabled] = React.useState(false)
  const [crop, setCrop] = React.useState<VaultImageCrop>({ x: 0, y: 0, width: 1, height: 1 })
  const [sourceDimensions, setSourceDimensions] = React.useState({ width: 1, height: 1 })
  const [result, setResult] = React.useState<VaultImageTransformResult | null>(null)
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null)
  const [busy, setBusy] = React.useState(false)
  const [error, setError] = React.useState("")
  const [message, setMessage] = React.useState("")

  React.useEffect(() => {
    let cancelled = false
    const loadDimensions = async () => {
      const sourceUrl = asset.url || asset.previewUrl
      if (!sourceUrl) {
        setError("This image has no readable source URL. Re-import the original image to edit it.")
        return
      }
      try {
        const response = await fetch(sourceUrl)
        if (!response.ok) throw new Error(`Image source returned HTTP ${response.status}.`)
        const blob = await response.blob()
        const bitmap = await createImageBitmap(blob)
        if (cancelled) {
          bitmap.close()
          return
        }
        const dimensions = { width: bitmap.width, height: bitmap.height }
        bitmap.close()
        setSourceDimensions(dimensions)
        setCrop({ x: 0, y: 0, ...dimensions })
        setTransform((current) => ({ ...current, crop: null }))
        setError("")
      } catch {
        if (!cancelled) setError("The source image cannot be read by this browser. Check its access/CORS permissions or import a local copy.")
      }
    }
    void loadDimensions()
    return () => {
      cancelled = true
    }
  }, [asset.id, asset.url, asset.previewUrl])

  React.useEffect(() => () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl)
  }, [previewUrl])

  const patchTransform = (patch: Partial<VaultImageTransform>) => {
    setTransform((current) => ({ ...current, ...patch }))
    setMessage("")
  }

  const apply = async () => {
    setBusy(true)
    setError("")
    setMessage("")
    try {
      const sourceUrl = asset.url || asset.previewUrl
      if (!sourceUrl) throw new Error("This image has no readable source URL.")
      const response = await fetch(sourceUrl)
      if (!response.ok) throw new Error(`Image source returned HTTP ${response.status}.`)
      const sourceBlob = await response.blob()
      const nextTransform = { ...transform, crop: cropEnabled ? crop : null }
      const transformed = await transformVaultImage(sourceBlob, nextTransform)
      const nextUrl = URL.createObjectURL(transformed.blob)
      setPreviewUrl((previous) => {
        if (previous) URL.revokeObjectURL(previous)
        return nextUrl
      })
      setResult(transformed)
      setMessage("Preview generated from real image bytes. The source asset has not been changed.")
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "The image transformation failed.")
    } finally {
      setBusy(false)
    }
  }

  const reset = () => {
    setTransform({ ...DEFAULT_VAULT_IMAGE_TRANSFORM })
    setCropEnabled(false)
    setCrop({ x: 0, y: 0, ...sourceDimensions })
    setResult(null)
    setPreviewUrl((previous) => {
      if (previous) URL.revokeObjectURL(previous)
      return null
    })
    setError("")
    setMessage("Operation settings reset. The source asset remains unchanged.")
  }

  const download = () => {
    if (!result) return
    const url = URL.createObjectURL(result.blob)
    const anchor = document.createElement("a")
    anchor.href = url
    anchor.download = `${asset.name.replace(/\.[^.]+$/, "")}-derivative.${extensionFor(result.mimeType)}`
    anchor.click()
    URL.revokeObjectURL(url)
  }

  const saveToVault = async () => {
    if (!result) return
    try {
      const dataUrl = await blobToDataUrl(result.blob)
      const outputName = `${asset.name.replace(/\.[^.]+$/, "")}-derivative.${extensionFor(result.mimeType)}`
      const created = createImportedVaultAsset({
        name: outputName,
        kind: "image",
        projectId: asset.projectId,
        projectName: asset.projectName,
        toolId: "creator-vault-os",
        url: dataUrl,
        previewUrl: dataUrl,
        mimeType: result.mimeType,
        tags: [...new Set([...(asset.tags || []), "derivative"])],
        metadata: {
          derivativeOfAssetId: asset.id,
          sourceAssetId: asset.id,
          derivativeOperation: "image-transform",
          transform: {
            crop: cropEnabled ? crop : null,
            rotation: transform.rotation,
            flipHorizontal: transform.flipHorizontal,
            flipVertical: transform.flipVertical,
            resizeWidth: transform.resizeWidth,
            resizeHeight: transform.resizeHeight,
            preserveAspectRatio: transform.preserveAspectRatio,
            outputFormat: result.mimeType,
            quality: transform.quality,
          },
          width: result.width,
          height: result.height,
          byteSize: result.byteSize,
          lifecycle: "CANDIDATE",
          sourceName: asset.name,
        },
      })
      if (!created.id) throw new Error("Vault did not return an asset identity.")
      setMessage("Derivative registered in Vault with its source asset ID and transformation metadata.")
      onDerivativeCreated?.()
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not register this derivative in Vault.")
    }
  }

  if (asset.kind !== "image") {
    return <SubToolboxStatePanel level="l1" state="empty" message="Select one image asset to use the Image Workbench." />
  }

  return (
    <section className="flex min-w-0 flex-col gap-3 rounded-md border-2 border-current p-3" data-vault-image-workbench aria-label="Image Workbench">
      <header className="flex items-start gap-2">
        <ImageIcon aria-hidden="true" className="mt-0.5 shrink-0" />
        <div>
          <h3 className="text-sm font-black uppercase">Image Workbench</h3>
          <p className="text-xs font-bold opacity-65">Non-destructive crop, transform, resize, optimize, and derivative preview</p>
        </div>
      </header>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-black uppercase">Source: {asset.name}</span>
          <span className="text-xs font-bold opacity-65">{sourceDimensions.width} × {sourceDimensions.height}</span>
          <span className="text-xs font-bold opacity-65">{Math.ceil((asset.metadata?.byteSize as number || 0) / 1024)} KB source metadata</span>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-black uppercase" htmlFor="vault-image-rotation">Rotate</label>
            <SubToolboxSelect id="vault-image-rotation" value={String(transform.rotation)} onChange={(event) => patchTransform({ rotation: Number(event.target.value) })}>
              <option value="0">0°</option><option value="90">90°</option><option value="180">180°</option><option value="270">270°</option>
            </SubToolboxSelect>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-black uppercase" htmlFor="vault-image-format">Output format</label>
            <SubToolboxSelect id="vault-image-format" value={transform.outputFormat} onChange={(event) => patchTransform({ outputFormat: event.target.value as VaultImageOutputFormat })}>
              <option value="image/png">PNG · lossless</option><option value="image/jpeg">JPEG · compressed</option><option value="image/webp">WebP · compact</option>
            </SubToolboxSelect>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <label className="flex items-center gap-2 text-xs font-black uppercase">
            <input type="checkbox" checked={transform.flipHorizontal} onChange={(event) => patchTransform({ flipHorizontal: event.target.checked })} /> Flip horizontal
          </label>
          <label className="flex items-center gap-2 text-xs font-black uppercase">
            <input type="checkbox" checked={transform.flipVertical} onChange={(event) => patchTransform({ flipVertical: event.target.checked })} /> Flip vertical
          </label>
          <label className="flex items-center gap-2 text-xs font-black uppercase">
            <input type="checkbox" checked={transform.preserveAspectRatio} onChange={(event) => patchTransform({ preserveAspectRatio: event.target.checked })} /> Preserve aspect ratio
          </label>
          <label className="flex items-center gap-2 text-xs font-black uppercase">
            <input type="checkbox" checked={cropEnabled} onChange={(event) => { setCropEnabled(event.target.checked); setMessage("") }} /> Enable pixel crop
          </label>
        </div>

        {cropEnabled ? (
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {(["x", "y", "width", "height"] as const).map((key) => (
              <label className="flex min-w-0 flex-col gap-1 text-xs font-black uppercase" key={key}>
                {key}
                <SubToolboxInput type="number" min={key === "width" || key === "height" ? 1 : 0} max={key === "x" ? sourceDimensions.width - 1 : key === "y" ? sourceDimensions.height - 1 : undefined} value={crop[key]} onChange={(event) => setCrop((current) => ({ ...current, [key]: Number(event.target.value) }))} />
              </label>
            ))}
          </div>
        ) : null}

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <label className="flex min-w-0 flex-col gap-1 text-xs font-black uppercase">
            Resize width
            <SubToolboxInput type="number" min={1} max={16384} placeholder="Original" value={transform.resizeWidth ?? ""} onChange={(event) => patchTransform({ resizeWidth: event.target.value ? Number(event.target.value) : null })} />
          </label>
          <label className="flex min-w-0 flex-col gap-1 text-xs font-black uppercase">
            Resize height
            <SubToolboxInput type="number" min={1} max={16384} placeholder="Original" value={transform.resizeHeight ?? ""} onChange={(event) => patchTransform({ resizeHeight: event.target.value ? Number(event.target.value) : null })} />
          </label>
          <label className="flex min-w-0 flex-col gap-1 text-xs font-black uppercase">
            JPEG / WebP quality
            <SubToolboxInput type="number" min={0.1} max={1} step={0.05} value={transform.quality} onChange={(event) => patchTransform({ quality: Number(event.target.value) })} />
          </label>
        </div>

        <div className="flex flex-wrap gap-2">
          <SubToolboxInnerActionButton label={busy ? "Processing…" : "Apply & Preview"} iconName="image" tone="cyan" onClick={() => void apply()} disabled={busy} />
          <SubToolboxInnerActionButton label="Reset" iconName="refresh" tone="yellow" onClick={reset} disabled={busy} />
        </div>

        {error ? <SubToolboxStatePanel level="l1" state="error" message={error} /> : null}
        {message ? <SubToolboxStatePanel level="l1" state="ready" message={message} /> : null}

        {result && previewUrl ? (
          <section className="flex min-w-0 flex-col gap-3 rounded-md border-2 border-current p-3" aria-label="Image transformation result">
            <div className="text-xs font-black uppercase">Result · {result.width} × {result.height} · {(result.byteSize / 1024).toFixed(1)} KB · {result.mimeType}</div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <figure className="min-w-0">
                <figcaption className="mb-1 text-xs font-black uppercase">Source</figcaption>
                <img src={asset.previewUrl || asset.url || ""} alt={`Source image: ${asset.name}`} className="max-h-72 w-full object-contain" />
              </figure>
              <figure className="min-w-0">
                <figcaption className="mb-1 text-xs font-black uppercase">Before / After</figcaption>
                <img src={previewUrl} alt={`Transformed preview of ${asset.name}`} className="max-h-72 w-full object-contain" />
              </figure>
            </div>
            <div className="flex flex-wrap gap-2">
              <SubToolboxInnerActionButton label="Download Output" iconName="download" tone="green" onClick={download} />
              {result.byteSize <= MAX_INLINE_VAULT_DERIVATIVE_BYTES ? (
                <SubToolboxInnerActionButton label="Save Derivative to Vault" iconName="database" tone="purple" onClick={() => void saveToVault()} />
              ) : (
                <p className="text-xs font-bold">Output exceeds the safe inline Vault limit. Download it and import it through Import &amp; Tags to avoid exhausting local storage.</p>
              )}
            </div>
          </section>
        ) : null}
        <p className="text-xs font-bold opacity-60">The source is never overwritten. Larger outputs are downloaded instead of being embedded in browser storage. Smart crop suggestions are intentionally omitted until a real vision provider is configured.</p>
    </section>
  )
}

export default VaultImageWorkbench
