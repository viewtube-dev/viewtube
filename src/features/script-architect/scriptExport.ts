/**
 * Produce a portable filename for a plain-text Script Architect export.
 * Keep the generated script content unchanged; only the filename is normalized.
 */
export function toScriptExportFilename(name: string): string {
  const base = name
    .normalize("NFKC")
    .trim()
    .replace(/[<>:"/\\|?*\u0000-\u001F]/g, "-")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^[.-]+|[.-]+$/g, "")
    .slice(0, 80);

  return `${base || "viewtube-script"}.txt`;
}
