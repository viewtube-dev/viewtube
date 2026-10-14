import type { GeneratedScript } from '../../types';

const IMPORTED_SCRIPT_SECTION_ID = 'imported-script';

/**
 * Represent an imported text document as one editable Script Architect section.
 * This deliberately does not infer scenes, captions, or timestamped segments.
 */
export function buildImportedScript(source: string, fileName = 'Imported Script'): GeneratedScript | null {
  const fullScript = source.replace(/^\uFEFF/, '').replace(/\r\n?/g, '\n');
  if (!fullScript.trim()) return null;

  const wordCount = fullScript.trim().split(/\s+/).filter(Boolean).length;
  const label = fileName.replace(/\.[^.]+$/, '').trim() || 'Imported Script';
  const estMinutes = Math.max(0.1, wordCount / 150);

  return {
    outline: [{ sectionId: IMPORTED_SCRIPT_SECTION_ID, section: label, beats: [] }],
    timeline: [{
      id: IMPORTED_SCRIPT_SECTION_ID,
      label,
      kind: 'chapter',
      estMinutes,
      wordCount,
    }],
    sections: [{
      sectionId: IMPORTED_SCRIPT_SECTION_ID,
      label: 'Imported Script',
      kind: 'chapter',
      script: fullScript,
      lockedFragmentIds: [],
    }],
    fullScript,
    visualSuggestions: [],
    shortsIdeas: [],
    assumptions: ['Imported from a local text file; no AI generation or timestamp inference was performed.'],
    groundingNotes: [],
  };
}
