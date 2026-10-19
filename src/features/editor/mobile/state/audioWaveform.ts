/** Reduce decoded audio channels to compact, normalized peak amplitudes. */
export function buildWaveformPeaks(
  channels: readonly Float32Array[],
  peakCount = 64,
): number[] {
  if (!Number.isFinite(peakCount) || peakCount < 1 || channels.length === 0) return [];
  const count = Math.min(512, Math.floor(peakCount));
  const length = Math.max(0, ...channels.map((channel) => channel.length));
  if (length === 0) return [];
  const peaks: number[] = [];
  for (let bin = 0; bin < count; bin += 1) {
    const start = Math.floor((bin * length) / count);
    const end = Math.max(start + 1, Math.floor(((bin + 1) * length) / count));
    let peak = 0;
    for (const channel of channels) {
      for (let index = start; index < Math.min(end, channel.length); index += 1) {
        const sample = channel[index];
        if (Number.isFinite(sample)) peak = Math.max(peak, Math.abs(sample));
      }
    }
    peaks.push(Math.min(1, peak));
  }
  return peaks;
}
