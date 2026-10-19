export interface ScriptMarkdownMetadata {
  title: string;
  angle?: string;
  audience?: string;
  tone?: string;
  script: string;
}

const singleLine = (value?: string): string => (value ?? '').replace(/[\r\n]+/g, ' ').trim();

export function formatScriptMarkdown(metadata: ScriptMarkdownMetadata): string {
  const title = singleLine(metadata.title) || 'Untitled Script';
  const lines = [`# ${title}`, ''];
  const fields: Array<[string, string | undefined]> = [
    ['Angle', metadata.angle],
    ['Audience', metadata.audience],
    ['Tone', metadata.tone],
  ];
  for (const [label, value] of fields) {
    const normalized = singleLine(value);
    if (normalized) lines.push(`**${label}:** ${normalized}`);
  }
  return `${lines.join('\n')}\n\n---\n\n${metadata.script}\n`;
}

export function toScriptMarkdownFilename(name: string): string {
  const base = name
    .normalize('NFKC')
    .trim()
    .replace(/[<>:"/\\|?*\u0000-\u001F]/g, '-')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^[.-]+|[.-]+$/g, '')
    .slice(0, 80);
  return `${base || 'viewtube-script'}.md`;
}
