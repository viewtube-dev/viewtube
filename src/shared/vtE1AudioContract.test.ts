import { describe, expect, it } from 'vitest';
import { resolveAudioRenderSettings } from './vtE1AudioContract';

describe('resolveAudioRenderSettings', () => {
  it('uses clip edits over layer defaults', () => {
    expect(resolveAudioRenderSettings(
      { volume: 0.35, playbackRate: 1.5 },
      { volume: 0.8, playbackRate: 1, muted: false },
    )).toEqual({ volume: 0.35, playbackRate: 1.5, muted: false });
  });

  it('falls back to layer payload for existing clips without clip-level edits', () => {
    expect(resolveAudioRenderSettings(
      {},
      { volume: 0.6, playbackRate: 1.25, muted: true },
    )).toEqual({ volume: 0.6, playbackRate: 1.25, muted: true });
  });

  it('uses safe defaults and clamps values to renderer-supported bounds', () => {
    expect(resolveAudioRenderSettings(
      { volume: 4, playbackRate: 99 },
      { volume: 0.2 },
    )).toEqual({ volume: 1, playbackRate: 4, muted: false });
    expect(resolveAudioRenderSettings(
      { volume: -2, playbackRate: 0 },
      {},
    )).toEqual({ volume: 0, playbackRate: 0.1, muted: false });
  });
});
