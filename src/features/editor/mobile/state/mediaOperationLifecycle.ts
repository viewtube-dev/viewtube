/**
 * Shared lifecycle contract for non-destructive creator media operations.
 *
 * UI surfaces may differ between desktop and mobile, but operation semantics
 * stay the same: configure -> preview -> accept/cancel -> derivative/lineage ->
 * optional workflow handoff. This helper intentionally performs no I/O.
 */
export type MediaOperationStage =
  | 'configuring'
  | 'previewing'
  | 'ready'
  | 'accepted'
  | 'cancelled'
  | 'failed';

export interface MediaOperationSession {
  operationId: string;
  assetId: string;
  sourceVersionId?: string;
  stage: MediaOperationStage;
  configRevision: number;
  previewRevision: number | null;
  outputAssetId?: string;
  error?: string;
}

export type MediaOperationEvent =
  | { type: 'updateConfig' }
  | { type: 'previewStarted' }
  | { type: 'previewReady'; configRevision: number }
  | { type: 'accept'; outputAssetId: string }
  | { type: 'cancel' }
  | { type: 'fail'; message: string }
  | { type: 'retry' };

export function createMediaOperationSession(input: {
  operationId: string;
  assetId: string;
  sourceVersionId?: string;
}): MediaOperationSession {
  return {
    ...input,
    stage: 'configuring',
    configRevision: 0,
    previewRevision: null,
  };
}

/**
 * Apply a lifecycle event. Invalid transitions return null so UI callers can
 * disable impossible actions instead of silently advancing operation state.
 * A preview is only current when it was produced from the latest config.
 */
export function transitionMediaOperation(
  session: MediaOperationSession,
  event: MediaOperationEvent,
): MediaOperationSession | null {
  switch (event.type) {
    case 'updateConfig':
      if (session.stage === 'accepted' || session.stage === 'cancelled') return null;
      return {
        ...session,
        stage: 'configuring',
        configRevision: session.configRevision + 1,
        previewRevision: null,
        outputAssetId: undefined,
        error: undefined,
      };
    case 'previewStarted':
      if (session.stage === 'accepted' || session.stage === 'cancelled') return null;
      return { ...session, stage: 'previewing', error: undefined };
    case 'previewReady':
      if (
        session.stage !== 'previewing' ||
        event.configRevision !== session.configRevision
      ) return null;
      return { ...session, stage: 'ready', previewRevision: event.configRevision };
    case 'accept':
      if (
        session.stage !== 'ready' ||
        session.previewRevision !== session.configRevision ||
        !event.outputAssetId.trim()
      ) return null;
      return { ...session, stage: 'accepted', outputAssetId: event.outputAssetId.trim() };
    case 'cancel':
      if (session.stage === 'accepted' || session.stage === 'cancelled') return null;
      return { ...session, stage: 'cancelled', previewRevision: null, outputAssetId: undefined };
    case 'fail':
      if (session.stage === 'accepted' || session.stage === 'cancelled') return null;
      return { ...session, stage: 'failed', error: event.message };
    case 'retry':
      if (session.stage !== 'failed') return null;
      return { ...session, stage: 'configuring', previewRevision: null, error: undefined };
  }
}
