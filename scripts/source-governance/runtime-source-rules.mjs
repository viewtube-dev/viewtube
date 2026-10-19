export const findRuntimeSourceViolations = (entries) => {
 const documentationImports = []
 const absoluteFileLinks = []
 for (const entry of entries || []) {
  if (/(?:from\s*|import\s*\()\s*["'][^"']*(?:^|[./\\])docs\//m.test(entry.text)) {
   documentationImports.push(entry.path)
  }
  if (/file:\/\/(?:\/Users\/|\/home\/|[A-Za-z]:[\\/])/i.test(entry.text)) {
   absoluteFileLinks.push(entry.path)
  }
 }
 return {
  documentationImports: [...new Set(documentationImports)].sort(),
  absoluteFileLinks: [...new Set(absoluteFileLinks)].sort(),
 }
}
