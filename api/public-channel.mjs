const YOUTUBE_HOSTS = new Set(["youtube.com", "www.youtube.com", "m.youtube.com"]);
const CHANNEL_ID_PATTERN = /^UC[\w-]{20,}$/;
const HANDLE_PATTERN = /^[a-zA-Z0-9._-]{1,100}$/;
const MAX_INPUT_LENGTH = 512;
const MAX_PAGE_LENGTH = 5_000_000;

const decodePathPart = (value) => {
  try {
    return decodeURIComponent(value);
  } catch {
    return null;
  }
};

const normalizeHandle = (input) => {
  const value = String(input || "").trim();
  if (!value || value.length > MAX_INPUT_LENGTH) return null;

  const channelId = value.match(/^(UC[\w-]{20,})$/)?.[1];
  if (channelId) return { handle: null, channelId, legacyName: null, legacyType: null };

  const looksLikeUrl = /^(?:https?:\/\/|www\.)/i.test(value);
  if (looksLikeUrl) {
    let url;
    try {
      url = new URL(/^www\./i.test(value) ? "https://" + value : value);
    } catch {
      return null;
    }
    if (url.protocol !== "https:" && url.protocol !== "http:") return null;
    if (!YOUTUBE_HOSTS.has(url.hostname.toLowerCase())) return null;

    const path = url.pathname.replace(/\/+$/, "") || "/";
    const handleMatch = path.match(/^\/@([^/]+)(?:\/.*)?$/);
    if (handleMatch) {
      const handle = decodePathPart(handleMatch[1]);
      return handle && HANDLE_PATTERN.test(handle)
        ? { handle, channelId: null, legacyName: null, legacyType: null }
        : null;
    }
    const idMatch = path.match(/^\/channel\/(UC[\w-]{20,})(?:\/.*)?$/i);
    if (idMatch) return { handle: null, channelId: idMatch[1], legacyName: null, legacyType: null };
    const legacyMatch = path.match(/^\/(c|user)\/([^/]+)(?:\/.*)?$/i);
    if (legacyMatch) {
      const legacyName = decodePathPart(legacyMatch[2]);
      if (!legacyName || !HANDLE_PATTERN.test(legacyName)) return null;
      return { handle: null, channelId: null, legacyName, legacyType: legacyMatch[1].toLowerCase() };
    }
    return null;
  }

  const bare = value.replace(/^@+/, "");
  if (CHANNEL_ID_PATTERN.test(bare)) return { handle: null, channelId: bare, legacyName: null, legacyType: null };
  if (!HANDLE_PATTERN.test(bare)) return null;
  return { handle: bare, channelId: null, legacyName: null, legacyType: null };
};

const decodeHtml = (value) => String(value || "")
  .replace(/&quot;/gi, '"')
  .replace(/&#39;|&apos;/gi, "'")
  .replace(/&amp;/gi, "&")
  .replace(/&lt;/gi, "<")
  .replace(/&gt;/gi, ">")
  .replace(/&#(\d+);/g, (_, number) => String.fromCodePoint(Number(number)))
  .replace(/&#x([\da-f]+);/gi, (_, number) => String.fromCodePoint(parseInt(number, 16)));

const attribute = (tag, name) => {
  const escaped = name;
  const match = String(tag).match(new RegExp("(?:^|\\s)" + escaped + "\\s*=\\s*(?:\"([^\"]*)\"|'([^']*)'|([^\\s>]+))", "i"));
  return match ? (match[1] ?? match[2] ?? match[3] ?? "") : null;
};

const parsePublicChannel = (html) => {
  const source = String(html || "");
  const channelId = source.match(/(?:\\?["'])(?:channelId|externalId)(?:\\?["'])\s*:\s*(?:\\?["'])(UC[\w-]{20,})(?:\\?["'])/i)?.[1]
    || [...source.matchAll(/<meta\b[^>]*>/gi)].map(([tag]) => attribute(tag, "itemprop")?.toLowerCase() === "channelid" ? attribute(tag, "content") : null).find(Boolean)
    || null;
  let title = null;
  let canonicalHandle = null;

  for (const [tag] of source.matchAll(/<meta\b[^>]*>/gi)) {
    if (attribute(tag, "property")?.toLowerCase() === "og:title" || attribute(tag, "name")?.toLowerCase() === "title") {
      title = attribute(tag, "content");
      if (title) break;
    }
  }
  for (const [tag] of source.matchAll(/<link\b[^>]*>/gi)) {
    if (attribute(tag, "rel")?.toLowerCase().split(/\s+/).includes("canonical")) {
      const href = attribute(tag, "href");
      if (!href) continue;
      try {
        const canonical = new URL(href, "https://www.youtube.com");
        if (!YOUTUBE_HOSTS.has(canonical.hostname.toLowerCase())) continue;
        canonicalHandle = canonical.pathname.match(/^\/@([^/]+)/)?.[1] || null;
        if (canonicalHandle) canonicalHandle = decodePathPart(canonicalHandle);
      } catch {
        // Ignore malformed canonical URLs and keep the page-derived handle.
      }
      if (canonicalHandle) break;
    }
  }

  if (!title) {
    title = source.match(/(?:\\?["'])title(?:\\?["'])\s*:\s*\{\s*(?:\\?["'])runs(?:\\?["'])\s*:\s*\[\s*\{\s*(?:\\?["'])text(?:\\?["'])\s*:\s*(?:\\?["'])(.*?)(?:\\?["'])/i)?.[1] || null;
  }
  return {
    channelId: channelId && CHANNEL_ID_PATTERN.test(channelId) ? channelId : null,
    title: title ? decodeHtml(title) : null,
    handle: canonicalHandle && HANDLE_PATTERN.test(canonicalHandle) ? canonicalHandle : null,
  };
};

const parseFeed = (xml) => [...String(xml || "").matchAll(/<entry\b[^>]*>([\s\S]*?)<\/entry>/gi)].slice(0, 15).map((match) => {
  const entry = match[1];
  const videoId = decodeHtml(entry.match(/<yt:videoId\b[^>]*>([^<]+)<\/yt:videoId>/i)?.[1] || "").trim();
  const title = entry.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i)?.[1] || "";
  const publishedAt = entry.match(/<published\b[^>]*>([^<]+)<\/published>/i)?.[1] || "";
  return { videoId, title: decodeHtml(title), publishedAt: decodeHtml(publishedAt), viewCount: null, likeCount: null, commentCount: null };
}).filter((item) => /^[a-zA-Z0-9_-]{1,64}$/.test(item.videoId));

const fetchText = async (url) => {
  const response = await fetch(url, {
    headers: { "User-Agent": "Mozilla/5.0 (compatible; ViewTubePublicChannel/1.0)", Accept: "text/html,application/atom+xml,application/xml;q=0.9,*/*;q=0.8" },
    redirect: "follow",
    signal: AbortSignal.timeout(12000),
  });
  if (response.url) {
    let finalUrl;
    try {
      finalUrl = new URL(response.url);
    } catch {
      throw new Error("The public channel source returned an invalid redirect URL.");
    }
    if (!YOUTUBE_HOSTS.has(finalUrl.hostname.toLowerCase()) || !["http:", "https:"].includes(finalUrl.protocol)) {
      throw new Error("The public channel source redirected outside the YouTube host allowlist.");
    }
  }
  if (!response.ok) throw new Error("Public channel source returned HTTP " + response.status + ".");
  const text = await response.text();
  if (text.length > MAX_PAGE_LENGTH) throw new Error("The public channel response exceeded the allowed size.");
  return text;
};

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed." });
  }

  const rawHandle = req.query?.handle || new URL(req.url || "/", "https://viewtube.invalid").searchParams.get("handle");
  const parsed = normalizeHandle(rawHandle);
  if (!parsed) return res.status(400).json({ error: "Enter a valid YouTube handle, channel ID, or public channel URL." });

  try {
    let channelId = parsed.channelId;
    let title = null;
    let resolvedHandle = parsed.handle;
    if (!channelId) {
      const path = parsed.handle
        ? "/@" + encodeURIComponent(parsed.handle)
        : parsed.legacyName
          ? "/" + (parsed.legacyType || "c") + "/" + encodeURIComponent(parsed.legacyName)
          : "";
      if (!path) return res.status(400).json({ error: "This channel URL format is not supported. Use a handle such as @channel." });
      const html = await fetchText("https://www.youtube.com" + path);
      const page = parsePublicChannel(html);
      channelId = page.channelId;
      title = page.title;
      resolvedHandle = page.handle || resolvedHandle;
    }
    if (!channelId) return res.status(404).json({ error: "The public channel page did not expose a channel ID. Try its @handle URL." });

    let feedUnavailable = false;
    const xml = await fetchText("https://www.youtube.com/feeds/videos.xml?channel_id=" + encodeURIComponent(channelId)).catch(() => {
      feedUnavailable = true;
      return "";
    });
    const topVideos = parseFeed(xml);
    const limitations = [
      "Public page and RSS feed only; no login, OAuth, API key, private analytics, or video statistics.",
      ...(feedUnavailable ? ["The channel was resolved, but its public RSS feed was unavailable during this request."] : []),
    ];
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
      limitations,
    });
  } catch (error) {
    return res.status(502).json({ error: error instanceof Error ? error.message : "Public channel ingestion failed." });
  }
}
