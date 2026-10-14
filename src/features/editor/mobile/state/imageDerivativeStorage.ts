export interface StoredRenderAsset {
  assetUrl: string;
  fileName: string;
  mimeType: string;
  bytes: number;
}

export interface UploadImageDerivativeOptions {
  fetchImpl?: typeof fetch;
  appOrigin?: string;
  maxBytes?: number;
}

/**
 * Store an image derivative on the configured VT_E1 render worker's asset
 * endpoint. The browser uses the same-origin proxy; the worker secret never
 * leaves the server. Returned URLs are normalized to the same-origin path so
 * assets remain accessible through the app's render proxy.
 */
export async function uploadImageDerivative(
  file: File,
  options: UploadImageDerivativeOptions = {},
): Promise<StoredRenderAsset> {
  const maxBytes = options.maxBytes ?? 20 * 1024 * 1024;
  if (!file || !Number.isFinite(file.size) || file.size <= 0) {
    throw new Error('The derivative file is empty or invalid.');
  }
  if (file.size > maxBytes) {
    throw new Error(`Image derivatives must be ${Math.floor(maxBytes / (1024 * 1024))} MB or smaller.`);
  }
  if (!file.type.startsWith('image/')) {
    throw new Error('Only image derivatives can be saved through this action.');
  }

  const request = options.fetchImpl ?? fetch;
  const response = await request('/api/vt-e1/render/assets', {
    method: 'POST',
    headers: {
      'Content-Type': file.type || 'application/octet-stream',
      'X-VT-File-Name': file.name || 'image-derivative.png',
      'X-VT-Mime-Type': file.type || 'application/octet-stream',
    },
    body: file,
  });

  let body: {
    ok?: boolean;
    error?: string;
    message?: string;
    asset?: { assetUrl?: string; fileName?: string; mimeType?: string; bytes?: number };
  };
  try {
    body = await response.json() as typeof body;
  } catch {
    throw new Error(`Image storage returned an unreadable response (HTTP ${response.status}).`);
  }
  if (!response.ok || body.ok !== true || !body.asset?.assetUrl) {
    throw new Error(body.message || body.error || `Image storage failed (HTTP ${response.status}).`);
  }

  let parsedUrl: URL;
  try {
    parsedUrl = new URL(body.asset.assetUrl, options.appOrigin || 'https://viewtube.live');
  } catch {
    throw new Error('Image storage returned an invalid asset URL.');
  }
  if (
    (parsedUrl.protocol !== 'https:' && parsedUrl.protocol !== 'http:') ||
    !parsedUrl.pathname.startsWith('/api/vt-e1/render/assets/')
  ) {
    throw new Error('Image storage returned an unsupported asset URL.');
  }

  return {
    assetUrl: `${parsedUrl.pathname}${parsedUrl.search}`,
    fileName: String(body.asset.fileName || file.name || 'image-derivative.png'),
    mimeType: String(body.asset.mimeType || file.type),
    bytes: Number.isFinite(Number(body.asset.bytes)) ? Number(body.asset.bytes) : file.size,
  };
}
