import { describe, expect, it } from 'vitest';
import { resolveAudioRenderSettings } from './vtE1AudioContract';

describe('resolveAudioRenderSettings', () => {
  it('uses clip edits over layer defaults', () => {
    expect(resolveAudioRenderSettings(
      { volume: 0.35, playbackRate: 1.5 },
      { volume: 0.8, playbackRate: 1, muted: false },
    )).toEqual({ volume: 0.35, playbackRate: 1.5, muted: false, fadeInSec: 0, fadeOutSec: 0 });
  });

  it('falls back to layer payload for existing clips without clip-level edits', () => {
    expect(resolveAudioRenderSettings(
      {},
      { volume: 0.6, playbackRate: 1.25, muted: true },
    )).toEqual({ volume: 0.6, playbackRate: 1.25, muted: true, fadeInSec: 0, fadeOutSec: 0 });
  });

  it('resolves fade durations from clip edits or legacy payload defaults', () => {
    expect(resolveAudioRenderSettings(
      { fadeInSec: 0.5, fadeOutSec: 1.25 },
      { fadeInSec: 0.2, fadeOutSec: 0.8 },
    )).toMatchObject({ fadeInSec: 0.5, fadeOutSec: 1.25 });
    expect(resolveAudioRenderSettings(
      {},
      { fadeInSec: 0.2, fadeOutSec: 0.8 },
    )).toMatchObject({ fadeInSec: 0.2, fadeOutSec: 0.8 });
  });

  it('uses safe defaults and clamps values to renderer-supported bounds', () => {
    expect(resolveAudioRenderSettings(
      { volume: 4, playbackRate: 99 },
      { volume: 0.2 },
    )).toEqual({ volume: 1, playbackRate: 4, muted: false, fadeInSec: 0, fadeOutSec: 0 });
    expect(resolveAudioRenderSettings(
      { volume: -2, playbackRate: 0 },
      {},
    )).toEqual({ volume: 0, playbackRate: 0.1, muted: false, fadeInSec: 0, fadeOutSec: 0 });
  });
});
