import { isEvidenceRecord, type EvidenceRecord } from "./EvidenceRecord"
import {
 isBrainEvidenceRecordQualityInSync,
 type BrainEvidenceRecordQualityReport,
} from "./BrainEvidenceQuality"

export type PromptEvidenceIntegrityStatus = "verified" | "unavailable" | "mismatch"

/**
 * Validate the exact prompt evidence snapshot restored from a conversation turn.
 *
 * ID parity alone is insufficient: a stored record can retain its ID while its
 * value, source, freshness, or provenance has changed. For non-empty evidence,
 * require the fingerprint generated from the exact ordered prompt records.
 * Legacy turns without a manifest remain unavailable rather than being labelled
 * as a mismatch.
 */
export const getPromptEvidenceIntegrityStatus = (
 metadata: Record<string, unknown> | undefined,
): PromptEvidenceIntegrityStatus => {
 if (!metadata || !Object.prototype.hasOwnProperty.call(metadata, "promptEvidenceRecordIds")) return "unavailable"
 if (!Array.isArray(metadata.promptEvidenceRecordIds) || !Array.isArray(metadata.evidenceRecords)) return "mismatch"

 const rawRecords: unknown[] = metadata.evidenceRecords
 const rawIds: unknown[] = metadata.promptEvidenceRecordIds
 if (!rawRecords.every(isEvidenceRecord) || !rawIds.every((id) => typeof id === "string")) return "mismatch"

 const records = rawRecords as EvidenceRecord[]
 const ids = rawIds as string[]
 if (records.length !== ids.length || !records.every((record, index) => record.id === ids[index])) return "mismatch"

 // Empty prompt evidence is a valid, explicit selection. There is no record
 // payload to fingerprint, so the manifest and empty record list are sufficient.
 if (records.length === 0) {
  const quality = metadata.evidenceRecordQuality
  if (quality == null) return "verified"
  if (typeof quality !== "object" || Array.isArray(quality)) return "mismatch"
  const report = quality as Partial<BrainEvidenceRecordQualityReport>
  return typeof report.evidenceFingerprint === "string"
   && Array.isArray(report.evidenceRecordIds)
   && isBrainEvidenceRecordQualityInSync(records, report as Pick<BrainEvidenceRecordQualityReport, "evidenceFingerprint" | "evidenceRecordIds">)
   ? "verified"
   : "mismatch"
 }

 const quality = metadata.evidenceRecordQuality
 if (!quality || typeof quality !== "object" || Array.isArray(quality)) return "mismatch"
 const report = quality as Partial<BrainEvidenceRecordQualityReport>
 if (typeof report.evidenceFingerprint !== "string" || !Array.isArray(report.evidenceRecordIds)) return "mismatch"

 return isBrainEvidenceRecordQualityInSync(
  records,
  report as Pick<BrainEvidenceRecordQualityReport, "evidenceFingerprint" | "evidenceRecordIds">,
 ) ? "verified" : "mismatch"
}

export const readPromptEvidenceRecords = (
 metadata: Record<string, unknown> | undefined,
): EvidenceRecord[] | undefined => {
 if (getPromptEvidenceIntegrityStatus(metadata) !== "verified") return undefined
 return metadata?.evidenceRecords as EvidenceRecord[]
}
