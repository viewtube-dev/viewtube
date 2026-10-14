export interface SrtCaptionCue {
  startSec: number;
  endSec: number;
  text: string;
}

function parseTimestamp(value: string): number | null {
  const match = value.trim().match(/^(?:(\d{2,}):)?(\d{2}):(\d{2})[,.](\d{1,3})$/);
  if (!match) return null;
  const hours = Number(match[1] ?? 0);
  const minutes = Number(match[2]);
  const seconds = Number(match[3]);
  const millis = Number(match[4].padEnd(3, '0'));
  if (minutes > 59 || seconds > 59) return null;
  return hours * 3600 + minutes * 60 + seconds + millis / 1000;
}

/** Parse standard SRT blocks; invalid or empty cues are skipped, not guessed. */
export function parseSrtCaptions(source: string): SrtCaptionCue[] {
  if (!source.trim()) return [];
  const cues: SrtCaptionCue[] = [];
  for (const block of source.replace(/^\uFEFF/, '').split(/\r?\n\s*\r?\n+/)) {
    const lines = block.split(/\r?\n/);
    const timeIndex = lines.findIndex((line) => line.includes('-->'));
    if (timeIndex < 0) continue;
    const times = lines[timeIndex].split('-->');
    if (times.length !== 2) continue;
    const startSec = parseTimestamp(times[0]);
    const endSec = parseTimestamp(times[1].trim().split(/\s+/)[0]);
    const text = lines.slice(timeIndex + 1).join('\n').trim();
    if (startSec === null || endSec === null || endSec <= startSec || !text) continue;
    cues.push({ startSec, endSec, text });
    if (cues.length >= 5000) break;
  }
  return cues.sort((a, b) => a.startSec - b.startSec || a.endSec - b.endSec);
}
