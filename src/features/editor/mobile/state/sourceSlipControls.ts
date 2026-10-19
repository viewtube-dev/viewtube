export const SOURCE_SLIP_STEPS = [
  { deltaSec: -1, label: '−1s', ariaLabel: 'Slip source backward one second' },
  { deltaSec: -0.1, label: '−0.1s', ariaLabel: 'Slip source backward 0.1 seconds' },
  { deltaSec: 0.1, label: '+0.1s', ariaLabel: 'Slip source forward 0.1 seconds' },
  { deltaSec: 1, label: '+1s', ariaLabel: 'Slip source forward one second' },
] as const;

/** Enable a source-slip action only when the entire source window stays in bounds. */
export function canSlipSourceWindow(
  sourceInSec: number,
  sourceOutSec: number,
  sourceDurationSec: number,
  deltaSec: number,
): boolean {
  if (
    !Number.isFinite(sourceInSec) ||
    !Number.isFinite(sourceOutSec) ||
    !Number.isFinite(sourceDurationSec) ||
    !Number.isFinite(deltaSec) ||
    sourceInSec < 0 ||
    sourceOutSec <= sourceInSec ||
    sourceDurationSec <= 0 ||
    sourceOutSec > sourceDurationSec
  ) return false;

  return sourceInSec + deltaSec >= -1e-9 &&
    sourceOutSec + deltaSec <= sourceDurationSec + 1e-9;
}
