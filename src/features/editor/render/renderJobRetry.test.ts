import { describe, expect, it } from 'vitest';
import { retryableRenderFormats } from './renderJobRetry';

describe('retryableRenderFormats', () => {
  it('returns only selected outputs that failed', () => {
    expect(retryableRenderFormats(['mp4', 'mov', 'webm'], {
      mp4: { jobId: 'a', status: 'succeeded', progress: 1 },
      mov: { jobId: 'b', status: 'failed', progress: 0.4 },
      webm: { jobId: 'c', status: 'queued', progress: 0.1 },
    })).toEqual(['mov']);
  });

  it('does not retry failed formats that are no longer selected', () => {
    expect(retryableRenderFormats(['mp4'], {
      mp4: { jobId: 'a', status: 'failed', progress: 0.4 },
      mov: { jobId: 'b', status: 'failed', progress: 0.2 },
    })).toEqual(['mp4']);
  });

  it('returns no retries when jobs are missing or not failed', () => {
    expect(retryableRenderFormats(['mp4', 'mov'], {})).toEqual([]);
    expect(retryableRenderFormats(['mp4', 'mov'], {
      mp4: { jobId: 'a', status: 'succeeded', progress: 1 },
      mov: { jobId: 'b', status: 'rendering', progress: 0.2 },
    })).toEqual([]);
  });
});
