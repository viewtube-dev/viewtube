import { describe, expect, it } from 'vitest';
import { editorReducer, initialState } from './editorState';

const videoClip = {
  id: 'video-1',
  trackId: 't_video',
  start: 2,
  end: 8,
  sourceInSec: 0,
  sourceOutSec: 6,
  layerId: 'layer-1',
};

describe('trimClip source range behavior', () => {
  it('advances sourceInSec when trimming the left edge', () => {
    const state = initialState({ clips: [videoClip] });
    const next = editorReducer(state, { type: 'trimClip', id: videoClip.id, side: 'left', sec: 3 });
    expect(next.project.clips[0]).toMatchObject({
      start: 3,
      end: 8,
      sourceInSec: 1,
      sourceOutSec: 6,
    });
  });

  it('shortens sourceOutSec when trimming the right edge', () => {
    const state = initialState({ clips: [videoClip] });
    const next = editorReducer(state, { type: 'trimClip', id: videoClip.id, side: 'right', sec: 5 });
    expect(next.project.clips[0]).toMatchObject({
      start: 2,
      end: 5,
      sourceInSec: 0,
      sourceOutSec: 3,
    });
  });

  it('leaves source ranges absent for generated text/overlay clips', () => {
    const overlay = { id: 'text-1', trackId: 't_overlay', start: 2, end: 8, text: 'Hello' };
    const state = initialState({ clips: [overlay] });
    const next = editorReducer(state, { type: 'trimClip', id: overlay.id, side: 'left', sec: 3 });
    expect(next.project.clips[0]).toMatchObject({ start: 3, end: 8, text: 'Hello' });
    expect(next.project.clips[0]).not.toHaveProperty('sourceInSec');
    expect(next.project.clips[0]).not.toHaveProperty('sourceOutSec');
  });

  it('records the trim in editor history so undo restores the original range', () => {
    const state = initialState({ clips: [videoClip] });
    const trimmed = editorReducer(state, { type: 'trimClip', id: videoClip.id, side: 'left', sec: 3 });
    const undone = editorReducer(trimmed, { type: 'undo' });
    expect(undone.project.clips[0]).toMatchObject({
      start: 2,
      end: 8,
      sourceInSec: 0,
      sourceOutSec: 6,
    });
  });
});
