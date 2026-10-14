import type { RenderJob, RenderOutputFormat } from './renderJobContract';

/** Keep retries scoped to failed selected outputs; successful renders stay available. */
export function retryableRenderFormats(
  selected: RenderOutputFormat[],
  jobs: Partial<Record<RenderOutputFormat, RenderJob>>,
): RenderOutputFormat[] {
  return selected.filter((format) => jobs[format]?.status === 'failed');
}
