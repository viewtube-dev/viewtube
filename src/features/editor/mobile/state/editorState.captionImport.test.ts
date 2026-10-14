import { describe, expect, it } from 'vitest';
import { editorReducer, type EditorState } from './editorState';

describe('importCaptionBatch reducer action', () => {
  it('adds a caption track, layers, and exact cue timings as one history step', () => {
    const state = {
      project: {
        clips: [],
        transitions: [],
        tracks: [{ id: 'video_1', name: 'Video', kind: 'video' }],
        layers: [],
        durationSec: 30,
      },
      playheadSec: 0,
      playing: false,
      playbackRate: 1,
      zoomPxPerSec: 40,
      selection: { clipIds: [], trackId: null, transitionId: null },
      tool: 'select',
      panel: { open: false, id: 'select', height: 0.55 },
      history: { past: [], future: [] },
    } as unknown as EditorState;
    const track = { id: 'caption_1', name: 'Captions', kind: 'caption' as const };
    const layers = [
      { id: 'layer_1', trackId: track.id, type: 'text', visible: true, payload: { text: 'Hello' } },
      { id: 'layer_2', trackId: track.id, type: 'text', visible: true, payload: { text: 'World' } },
    ];
    const clips = [
      { id: 'clip_1', trackId: track.id, layerId: 'layer_1', start: 1.25, end: 2.5, keyframes: [] },
      { id: 'clip_2', trackId: track.id, layerId: 'layer_2', start: 2.1, end: 3.75, keyframes: [] },
    ];
    const next = editorReducer(state, { type: 'importCaptionBatch', track, layers, clips });
    expect(next.project.tracks).toContainEqual(track);
    expect(next.project.layers).toHaveLength(2);
    expect(next.project.clips.map((clip) => [clip.start, clip.end])).toEqual([[1.25, 2.5], [2.1, 3.75]]);
    expect(next.project.durationSec).toBe(30);
    expect(next.history.past).toHaveLength(1);
    expect(next.selection.clipIds).toEqual(['clip_2']);
  });

  it('uses an existing caption track without adding a duplicate', () => {
    const track = { id: 'caption_existing', name: 'Captions', kind: 'caption' as const };
    const state = {
      project: { clips: [], transitions: [], tracks: [track], layers: [], durationSec: 5 },
      playheadSec: 0, playing: false, playbackRate: 1, zoomPxPerSec: 40,
      selection: { clipIds: [], trackId: null, transitionId: null }, tool: 'select',
      panel: { open: false, id: 'select', height: 0.55 }, history: { past: [], future: [] },
    } as unknown as EditorState;
    const clip = { id: 'clip_1', trackId: track.id, layerId: 'layer_1', start: 8, end: 9, keyframes: [] };
    const next = editorReducer(state, {
      type: 'importCaptionBatch', track: null,
      layers: [{ id: 'layer_1', trackId: track.id, type: 'text', payload: { text: 'Later' } }],
      clips: [clip],
    });
    expect(next.project.tracks).toEqual([track]);
    expect(next.project.durationSec).toBe(9);
  });
});
