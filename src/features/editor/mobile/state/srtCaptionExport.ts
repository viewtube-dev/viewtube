import type { SrtCaptionCue } from './srtCaptionImport';

/** Format a non-negative timeline time as an SRT timestamp. */
export function formatSrtTimestamp(seconds: number): string | null {
  if (!Number.isFinite(seconds) || seconds < 0) return null;
  const totalMs = Math.round(seconds * 1000);
  const hours = Math.floor(totalMs / 3_600_000);
  const minutes = Math.floor((totalMs % 3_600_000) / 60_000);
  const wholeSeconds = Math.floor((totalMs % 60_000) / 1000);
  const milliseconds = totalMs % 1000;
  const pad = (value: number, length = 2) => String(value).padStart(length, '0');
  return `${pad(hours)}:${pad(minutes)}:${pad(wholeSeconds)},${pad(milliseconds, 3)}`;
}

/**
 * Serialize timed editor caption clips to SRT. Invalid/empty cues are skipped,
 * valid cues are ordered by timeline time, and multiline text is preserved.
 */
export function buildSrtCaptions(cues: readonly SrtCaptionCue[]): string {
  const valid = cues
    .filter((cue) =>
      Number.isFinite(cue.startSec) &&
      Number.isFinite(cue.endSec) &&
      cue.startSec >= 0 &&
      cue.endSec > cue.startSec &&
      Boolean(cue.text.trim()),
    )
    .map((cue) => ({
      startSec: cue.startSec,
      endSec: cue.endSec,
      text: cue.text.trim().replace(/\r\n?/g, '\n'),
    }))
    .sort((a, b) => a.startSec - b.startSec || a.endSec - b.endSec);

  const blocks = valid.map((cue, index) => {
    const start = formatSrtTimestamp(cue.startSec);
    const end = formatSrtTimestamp(cue.endSec);
    if (!start || !end) return '';
    return `${index + 1}\n${start} --> ${end}\n${cue.text}`;
  }).filter(Boolean);

  return blocks.length ? blocks.join('\n\n') + '\n' : '';
}
