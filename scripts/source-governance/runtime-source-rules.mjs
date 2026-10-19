export const findRuntimeSourceViolations = (entries) => {
 const documentationImports = []
 const absoluteFileLinks = []
 for (const entry of entries || []) {
  const isTestSource = /(?:\.test\.[cm]?[jt]sx?$|\/__tests__\/)/i.test(entry.path)
  if (!isTestSource && /(?:from\s*|import\s*\()\s*["'][^"']*(?:^|[./\\])docs\//m.test(entry.text)) {
   documentationImports.push(entry.path)
  }
  if (/(?:^|[\s"'\x60=({])(?:file:\/\/)?(?:\/Users\/|\/home\/|\/Volumes\/)|(?:^|[\s"'\x60=({])[A-Za-z]:[\\/](?!\/)[^\s"'\x60),;]+/m.test(entry.text)) {
   absoluteFileLinks.push(entry.path)
  }
 }
 return {
  documentationImports: [...new Set(documentationImports)].sort(),
  absoluteFileLinks: [...new Set(absoluteFileLinks)].sort(),
 }
}
