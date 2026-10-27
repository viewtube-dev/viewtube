const normalizeHandle = (input) => {
  const value = String(input || "").trim();
  if (!value) return null;
  try {
    const url = new URL(value.startsWith("@") ? `https://www.youtube.com/${value}` : value);
    if (!["youtube.com", "www.youtube.com", "m.youtube.com"].includes(url.hostname.toLowerCase())) return null;
    const match = url.pathname.match(/^\/@([^/]+)|^\/channel\/([^/]+)|^\/c\/([^/]+)|^\/user\/([^/]+)/i);
    if (!match) return null;
    return { handle: match[1] || null, channelId: match[2] || null, legacyName: match[3] || match[4] || null, legacyType: match[3] ? "c" : match[4] ? "user" : null };
  } catch {
    const bare = value.replace(/^@+/, "").split(/[/?#]/)[0];
    return /^UC[\w-]{20,}$/.test(bare) ? { handle: null, channelId: bare, legacyName: null, legacyType: null } : /^[\w.-]{1,100}$/.test(bare) ? { handle: bare, channelId: null, legacyName: null, legacyType: null } : null;
  }
};

const textFromHtml = (value) => String(value || "")
  .replace(/&quot;/g, '"')
  .replace(/&#39;|&apos;/g, "'")
  .replace(/&amp;/g, "&")
  .replace(/&lt;/g, "<")
  .replace(/&gt;/g, ">");

const parsePublicChannel = (html) => {
  const channelId = html.match(/"channelId"\s*:\s*"(UC[\w-]{20,})"/)?.[1]
    || html.match(/"externalId"\s*:\s*"(UC[\w-]{20,})"/)?.[1]
    || html.match(/<meta\s+itemprop="channelId"\s+content="(UC[\w-]{20,})"/i)?.[1];
  const title = html.match(/<meta\s+property="og:title"\s+content="([^"]+)"/i)?.[1]
    || html.match(/"title"\s*:\s*\{"runs":\[\{"text":"([^"]+)"/)?.[1];
  const canonical = html.match(/<link\s+rel="canonical"\s+href="https:\/\/www\.youtube\.com\/@([^"/?]+)"/i)?.[1];
  return { channelId: channelId || null, title: title ? textFromHtml(title) : null, handle: canonical || null };
};

const parseFeed = (xml) => [...String(xml || "").matchAll(/<entry>([\s\S]*?)<\/entry>/g)].slice(0, 15).map((match) => {
  const entry = match[1];
  const videoId = entry.match(/<yt:videoId>([^<]+)<\/yt:videoId>/)?.[1] || "";
  const title = entry.match(/<title>([\s\S]*?)<\/title>/)?.[1] || "";
  const publishedAt = entry.match(/<published>([^<]+)<\/published>/)?.[1] || "";
  return { videoId, title: textFromHtml(title), publishedAt, viewCount: null, likeCount: null, commentCount: null };
}).filter((item) => item.videoId);

const fetchText = async (url) => {
  const response = await fetch(url, {
    headers: { "User-Agent": "Mozilla/5.0 (compatible; ViewTubePublicChannel/1.0)", Accept: "text/html,application/atom+xml,application/xml;q=0.9,*/*;q=0.8" },
    redirect: "follow",
    signal: AbortSignal.timeout(12000),
  });
  if (!response.ok) throw new Error(`Public channel source returned HTTP ${response.status}.`);
  return response.text();
};

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed." });
  }
  const parsed = normalizeHandle(req.query?.handle || new URL(req.url, "https://viewtube.invalid").searchParams.get("handle"));
  if (!parsed) return res.status(400).json({ error: "Enter a YouTube handle or public channel URL." });
  try {
    let channelId = parsed.channelId;
    let title = null;
    let resolvedHandle = parsed.handle;
    if (!channelId) {
      const path = parsed.handle ? `/@${encodeURIComponent(parsed.handle)}` : parsed.legacyName ? `/${parsed.legacyType || "c"}/${encodeURIComponent(parsed.legacyName)}` : "";
      if (!path) return res.status(400).json({ error: "This channel URL format is not supported. Use a handle such as @channel." });
      const html = await fetchText(`https://www.youtube.com${path}`);
      const page = parsePublicChannel(html);
      channelId = page.channelId;
      title = page.title;
      resolvedHandle = page.handle || resolvedHandle;
    }
    if (!channelId) return res.status(404).json({ error: "The public channel page did not expose a channel ID. Try its @handle URL." });
    const xml = await fetchText(`https://www.youtube.com/feeds/videos.xml?channel_id=${encodeURIComponent(channelId)}`).catch(() => "");
    const topVideos = parseFeed(xml);
    return res.status(200).json({
      resolution: { resolvedChannelId: channelId, resolvedHandle, channelTitle: title, reason: null },
      snapshot: {
        mode: "public_handle",
        source: "public_page",
        fetchedAt: new Date().toISOString(),
        channelId,
        handle: resolvedHandle,
        title,
        subscriberCount: null,
        videoCount: null,
        viewCount: null,
        topVideos,
      },
      limitations: ["Public page and RSS feed only; no login, OAuth, API key, private analytics, or video statistics."],
    });
  } catch (error) {
    return res.status(502).json({ error: error instanceof Error ? error.message : "Public channel ingestion failed." });
  }
}
