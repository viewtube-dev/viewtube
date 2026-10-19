import { describe, expect, it } from 'vitest';
import {
  createMediaOperationSession,
  transitionMediaOperation,
} from './mediaOperationLifecycle';

describe('media operation lifecycle', () => {
  it('requires a current preview before accepting an output', () => {
    const initial = createMediaOperationSession({ operationId: 'op-1', assetId: 'asset-1' });
    expect(transitionMediaOperation(initial, { type: 'accept', outputAssetId: 'out-1' })).toBeNull();

    const previewing = transitionMediaOperation(initial, { type: 'previewStarted' })!;
    const ready = transitionMediaOperation(previewing, { type: 'previewReady', configRevision: 0 })!;
    expect(ready.stage).toBe('ready');
    expect(transitionMediaOperation(ready, { type: 'accept', outputAssetId: ' out-1 ' })).toMatchObject({
      stage: 'accepted',
      assetId: 'asset-1',
      outputAssetId: 'out-1',
    });
  });

  it('invalidates stale previews after configuration changes', () => {
    const initial = createMediaOperationSession({ operationId: 'op-2', assetId: 'asset-2', sourceVersionId: 'v1' });
    const previewing = transitionMediaOperation(initial, { type: 'previewStarted' })!;
    const changed = transitionMediaOperation(previewing, { type: 'updateConfig' })!;
    expect(changed).toMatchObject({ stage: 'configuring', configRevision: 1, previewRevision: null, sourceVersionId: 'v1' });
    expect(transitionMediaOperation(changed, { type: 'previewReady', configRevision: 0 })).toBeNull();
    const nextPreview = transitionMediaOperation(changed, { type: 'previewStarted' })!;
    const ready = transitionMediaOperation(nextPreview, { type: 'previewReady', configRevision: 1 })!;
    expect(transitionMediaOperation(ready, { type: 'accept', outputAssetId: 'out-2' })?.stage).toBe('accepted');
  });

  it('supports cancel and retry without mutating the source identity', () => {
    const initial = createMediaOperationSession({ operationId: 'op-3', assetId: 'asset-3', sourceVersionId: 'v4' });
    const failed = transitionMediaOperation(initial, { type: 'fail', message: 'worker unavailable' })!;
    expect(failed).toMatchObject({ stage: 'failed', error: 'worker unavailable' });
    const retry = transitionMediaOperation(failed, { type: 'retry' })!;
    expect(retry).toMatchObject({ stage: 'configuring', assetId: 'asset-3', sourceVersionId: 'v4', error: undefined });
    const cancelled = transitionMediaOperation(retry, { type: 'cancel' })!;
    expect(cancelled.stage).toBe('cancelled');
    expect(transitionMediaOperation(cancelled, { type: 'updateConfig' })).toBeNull();
  });

  it('rejects empty output IDs and invalid terminal transitions', () => {
    const initial = createMediaOperationSession({ operationId: 'op-4', assetId: 'asset-4' });
    const ready = transitionMediaOperation(
      transitionMediaOperation(initial, { type: 'previewStarted' })!,
      { type: 'previewReady', configRevision: 0 },
    )!;
    expect(transitionMediaOperation(ready, { type: 'accept', outputAssetId: '  ' })).toBeNull();
    const accepted = transitionMediaOperation(ready, { type: 'accept', outputAssetId: 'out-4' })!;
    expect(transitionMediaOperation(accepted, { type: 'cancel' })).toBeNull();
  });
});
