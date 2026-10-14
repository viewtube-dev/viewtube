export interface AudioRenderSettings {
  volume: number;
  playbackRate: number;
  muted: boolean;
}

const finite = (value: unknown): number | null => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

/**
 * Resolve the single render-facing audio contract.
 * Clip-level edits take precedence; layer payload values remain the fallback
 * for existing projects that predate clip-level audio controls.
 */
export function resolveAudioRenderSettings(
  clip: Record<string, unknown>,
  payload: Record<string, unknown>,
): AudioRenderSettings {
  const volume = finite(clip.volume) ?? finite(payload.volume) ?? 0.6;
  const playbackRate = finite(clip.playbackRate) ?? finite(payload.playbackRate) ?? 1;
  return {
    volume: Math.max(0, Math.min(1, volume)),
    playbackRate: Math.max(0.1, Math.min(4, playbackRate)),
    muted: Boolean(payload.muted),
  };
}
