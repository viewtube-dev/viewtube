import { describe, expect, it } from 'vitest';
import { applyGeneratedSections } from '../../services/scriptQuality';
import { buildImportedScript } from './scriptImport';

describe('buildImportedScript', () => {
  it('preserves imported prose as one editable section without adding headings', () => {
    const source = '# Opening\n\nKeep this wording exactly.\nSecond line.';
    const imported = buildImportedScript(source, 'opening-script.md');
    expect(imported?.fullScript).toBe(source);
    expect(imported?.sections).toHaveLength(1);
    expect(imported?.sections[0]).toMatchObject({
      sectionId: 'imported-script',
      label: 'Imported Script',
      kind: 'chapter',
      script: source,
      lockedFragmentIds: [],
    });

    const edited = applyGeneratedSections(imported!, [
      { ...imported!.sections[0], script: 'Edited imported prose.' },
    ]);
    expect(edited.fullScript).toBe('Edited imported prose.');
  });

  it('removes a BOM and normalizes line endings without trimming script prose', () => {
    const imported = buildImportedScript('\uFEFFFirst line.\r\n\r\nSecond line.\r', 'draft.txt');
    expect(imported?.fullScript).toBe('First line.\n\nSecond line.\n');
  });

  it('returns null for an empty or whitespace-only file', () => {
    expect(buildImportedScript('')).toBeNull();
    expect(buildImportedScript('\uFEFF \r\n')).toBeNull();
  });
});
