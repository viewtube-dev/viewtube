import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const ROOT = process.cwd()
const EXCHANGE_ROOT = path.resolve(ROOT, ".viewtube/exchange")
const OUTPUT = path.resolve(ROOT, "src/data/crownExchangeGenerated.ts")

export function collectExchangeRecords(root = EXCHANGE_ROOT) {
  if (!fs.existsSync(root)) throw new Error(`Crown Exchange source directory is missing: ${root}`)
  const records = []
  const visit = (directory) => {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
      const absolute = path.join(directory, entry.name)
      if (entry.isDirectory()) visit(absolute)
      else if (entry.isFile() && entry.name.endsWith(".json")) {
        const relative = path.relative(ROOT, absolute).split(path.sep).join("/")
        let record
        try { record = JSON.parse(fs.readFileSync(absolute, "utf8")) }
        catch (error) { throw new Error(`Invalid Crown Exchange JSON at ${relative}: ${error.message}`) }
        if (!record || typeof record !== "object" || Array.isArray(record)) throw new Error(`Crown Exchange record must be a JSON object: ${relative}`)
        records.push({ path: relative, record })
      }
    }
  }
  visit(root)
  records.sort((a, b) => a.path.localeCompare(b.path))
  const missionCount = records.filter((item) => item.path.startsWith(".viewtube/exchange/missions/")).length
  if (!missionCount) throw new Error("Crown Exchange contains no mission records; refusing to generate an empty Control Room.")
  return records
}

export function renderGeneratedModule(records) {
  const payload = JSON.stringify(records, null, 2)
  return `// Generated from .viewtube/exchange/**. Do not edit by hand.\nexport const CROWN_EXCHANGE_SOURCE = ".viewtube/exchange/**" as const\nexport const CROWN_EXCHANGE_READ_ONLY = true as const\nexport const CROWN_EXCHANGE_RECORDS = ${payload} as const\n`
}

export function generateCrownControlRoom({ root = EXCHANGE_ROOT, output = OUTPUT } = {}) {
  const records = collectExchangeRecords(root)
  fs.mkdirSync(path.dirname(output), { recursive: true })
  fs.writeFileSync(output, renderGeneratedModule(records))
  return { output, records: records.length, missions: records.filter((item) => item.path.startsWith(".viewtube/exchange/missions/")).length }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const result = generateCrownControlRoom()
  console.log(`Crown Control Room snapshot generated from Royal Exchange: ${result.missions} missions, ${result.records} records → ${path.relative(ROOT, result.output)}`)
}
