export { default } from "./EvidenceConnectedBrainPage"
export { useEvidenceConnectedBrain } from "./useEvidenceConnectedBrain"
export {
  runEvidenceConnectedBrain,
  CapabilityEndpointError,
  type EvidenceConnectedBrainTurn,
} from "./EvidenceConnectedBrainApi"
export {
  buildEvidenceConnectedAnswer,
  detectUnsupportedNumbers,
  linkAnswerToEvidence,
  deriveAnswerLimits,
  type SuppliedEvidenceRef,
  type LinkedEvidenceRef,
  type EvidenceLinkResult,
} from "./evidenceLink"
