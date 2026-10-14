import { describe, expect, it } from 'vitest';
import { formatScriptMarkdown, toScriptMarkdownFilename } from './scriptMarkdownExport';

describe('Script Architect Markdown export', () => {
  it('wraps exact script text with title and available metadata', () => {
    const script = 'LOCKED INTRO\n\nKeep this sentence exactly.';
    const markdown = formatScriptMarkdown({
      title: 'A Script',
      angle: 'Three practical tips',
      audience: 'New creators',
      tone: 'Calm authority',
      script,
    });
    expect(markdown).toContain('# A Script');
    expect(markdown).toContain('**Angle:** Three practical tips');
    expect(markdown).toContain('**Audience:** New creators');
    expect(markdown).toContain('**Tone:** Calm authority');
    expect(markdown.endsWith(`---\n\n${script}\n`)).toBe(true);
  });

  it('uses a fallback title and omits empty metadata', () => {
    const markdown = formatScriptMarkdown({ title: ' \n ', audience: ' ', script: 'Script body' });
    expect(markdown.startsWith('# Untitled Script')).toBe(true);
    expect(markdown).not.toContain('**Audience:**');
    expect(markdown.endsWith('Script body\n')).toBe(true);
  });

  it('creates a safe Markdown filename', () => {
    expect(toScriptMarkdownFilename('  My / Script  ')).toBe('My-Script.md');
    expect(toScriptMarkdownFilename('')).toBe('viewtube-script.md');
  });
});
