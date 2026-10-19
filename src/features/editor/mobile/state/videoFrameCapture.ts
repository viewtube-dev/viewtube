export function sourceFrameTime(
  playheadSec: number,
  clipStartSec: number,
  sourceInSec: number,
  sourceDurationSec: number,
): number | null {
  if (![playheadSec, clipStartSec, sourceInSec, sourceDurationSec].every(Number.isFinite)) return null;
  if (clipStartSec < 0 || sourceInSec < 0 || sourceDurationSec <= 0) return null;
  const offset = playheadSec - clipStartSec;
  if (offset < 0) return null;
  return Math.max(0, Math.min(sourceDurationSec - 0.001, sourceInSec + offset));
}

/** Capture a browser-accessible video URL at a source timestamp as a JPEG File. */
export async function captureVideoFrameAsFile(
  sourceUrl: string,
  sourceTimeSec: number,
  fileName = 'video-frame.jpg',
): Promise<File | null> {
  if (!sourceUrl || !Number.isFinite(sourceTimeSec) || sourceTimeSec < 0 || typeof document === 'undefined') return null;
  return new Promise((resolve) => {
    const video = document.createElement('video');
    const canvas = document.createElement('canvas');
    let settled = false;
    let frameStarted = false;
    let timeout: number | undefined;
    let targetTime = 0;
    const finish = (file: File | null) => {
      if (settled) return;
      settled = true;
      if (timeout !== undefined) window.clearTimeout(timeout);
      video.pause();
      video.removeAttribute('src');
      video.load();
      resolve(file);
    };
    const captureFrame = () => {
      if (settled || frameStarted || video.readyState < 2 || Math.abs(video.currentTime - targetTime) > 0.02) return;
      frameStarted = true;
      try {
        const context = canvas.getContext('2d');
        if (!context) return finish(null);
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        canvas.toBlob((blob) => {
          if (!blob) return finish(null);
          try {
            finish(new File([blob], fileName, { type: 'image/jpeg', lastModified: Date.now() }));
          } catch {
            finish(null);
          }
        }, 'image/jpeg', 0.92);
      } catch {
        finish(null);
      }
    };
    video.preload = 'auto';
    video.muted = true;
    video.playsInline = true;
    video.crossOrigin = 'anonymous';
    video.onerror = () => finish(null);
    video.onloadeddata = captureFrame;
    video.onseeked = captureFrame;
    video.onloadedmetadata = () => {
      if (!Number.isFinite(video.duration) || video.duration <= 0 || !video.videoWidth || !video.videoHeight) {
        finish(null);
        return;
      }
      targetTime = Math.max(0, Math.min(sourceTimeSec, video.duration - 0.001));
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      video.currentTime = targetTime;
      // Some browsers do not fire seeked when the target is already the current frame.
      captureFrame();
    };
    timeout = window.setTimeout(() => finish(null), 15000);
    video.src = sourceUrl;
    video.load();
  });
}
