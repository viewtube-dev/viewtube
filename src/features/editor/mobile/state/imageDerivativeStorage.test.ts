import { describe, expect, it, vi } from 'vitest';
import { uploadImageDerivative } from './imageDerivativeStorage';

const makeFile = (name = 'crop.png', type = 'image/png', size = 5) =>
  Object.assign(new Blob([new Uint8Array(size)], { type }), { name }) as File;

const response = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

describe('uploadImageDerivative', () => {
  it('uploads through the same-origin proxy and normalizes the worker URL', async () => {
    const fetchImpl = vi.fn(async (_input: RequestInfo | URL, _init?: RequestInit) =>
      response({
        ok: true,
        asset: {
          fileName: 'stored_crop.png',
          originalFileName: 'crop.png',
          mimeType: 'image/png',
          bytes: 5,
          assetUrl: 'https://viewtube.live/api/vt-e1/render/assets/stored_crop.png',
        },
      }),
    );

    const result = await uploadImageDerivative(makeFile(), {
      fetchImpl: fetchImpl as unknown as typeof fetch,
      appOrigin: 'https://viewtube-system-convergence.onrender.com',
    });

    expect(fetchImpl).toHaveBeenCalledOnce();
    expect(fetchImpl.mock.calls[0][0]).toBe('/api/vt-e1/render/assets');
    expect(fetchImpl.mock.calls[0][1]?.method).toBe('POST');
    expect((fetchImpl.mock.calls[0][1]?.headers as Record<string, string>)['X-VT-File-Name']).toBe('crop.png');
    expect(result).toEqual({
      assetUrl: '/api/vt-e1/render/assets/stored_crop.png',
      fileName: 'stored_crop.png',
      mimeType: 'image/png',
      bytes: 5,
    });
  });

  it('surfaces render-worker errors without pretending the file was saved', async () => {
    const fetchImpl = vi.fn(async () => response({
      ok: false,
      error: 'RENDERER_NOT_CONFIGURED',
      message: 'Configure the render worker.',
    }, 503));

    await expect(uploadImageDerivative(makeFile(), {
      fetchImpl: fetchImpl as unknown as typeof fetch,
    })).rejects.toThrow('Configure the render worker.');
  });

  it('rejects unsupported returned URLs', async () => {
    const fetchImpl = vi.fn(async () => response({
      ok: true,
      asset: {
        assetUrl: 'https://example.com/not-the-render-asset-endpoint',
        fileName: 'crop.png',
        mimeType: 'image/png',
        bytes: 5,
      },
    }));

    await expect(uploadImageDerivative(makeFile(), {
      fetchImpl: fetchImpl as unknown as typeof fetch,
    })).rejects.toThrow('unsupported asset URL');
  });

  it('rejects oversized and non-image files before network access', async () => {
    const fetchImpl = vi.fn(async () => response({ ok: true, asset: { assetUrl: '/api/vt-e1/render/assets/x.png' } }));
    await expect(uploadImageDerivative(makeFile('large.png', 'image/png', 21 * 1024 * 1024), {
      fetchImpl: fetchImpl as unknown as typeof fetch,
    })).rejects.toThrow('20 MB or smaller');
    await expect(uploadImageDerivative(makeFile('clip.mp4', 'video/mp4'), {
      fetchImpl: fetchImpl as unknown as typeof fetch,
    })).rejects.toThrow('Only image derivatives');
    expect(fetchImpl).not.toHaveBeenCalled();
  });
});
