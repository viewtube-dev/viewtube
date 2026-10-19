import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';

const root = process.cwd();
const mapPath = path.join(root, 'governance/convergence/capability-evidence-map.json');
const coveragePath = path.join(root, 'governance/convergence/capability-coverage.json');
const generatorPath = path.join(root, 'scripts/governance/build-capability-coverage.mjs');

test('capability coverage is reproducible from curated, existing evidence references', () => {
  const before = fs.readFileSync(coveragePath, 'utf8');
  const map = JSON.parse(fs.readFileSync(mapPath, 'utf8'));

  for (const [capabilityId, evidence] of Object.entries(map.capabilities || {})) {
    for (const ref of [
      ...(evidence.taskRefs || []),
      ...(evidence.tests || []),
      ...(evidence.guideRefs || []),
      ...(evidence.verificationRefs || []),
    ]) {
      assert.ok(fs.existsSync(path.join(root, ref)), `${capabilityId} points to missing repository path: ${ref}`);
    }
  }

  execFileSync(process.execPath, [generatorPath], { cwd: root, stdio: 'pipe' });
  const generated = fs.readFileSync(coveragePath, 'utf8');
  assert.equal(generated, before, 'run generate:capability-coverage and commit the regenerated report');

  const report = JSON.parse(generated);
  const byId = new Map(report.capabilities.map((item) => [item.id, item]));
  for (const id of [
    'CAP-CREATOR-CONTEXT',
    'CAP-EVIDENCE-INTELLIGENCE',
    'CAP-BRAIN-EXPERIENCE',
    'CAP-ANALYTICS-CANON',
  ]) {
    assert.ok(byId.get(id)?.taskRefs.length, `${id} must include a task reference`);
    assert.ok(byId.get(id)?.tests.length, `${id} must include test references`);
    assert.ok(byId.get(id)?.guideRefs.length, `${id} must include guide references`);
    assert.ok(byId.get(id)?.verificationRefs.length, `${id} must include verification references`);
    assert.equal(byId.get(id)?.complete, true, `${id} should be complete only when every required field is mapped`);
  }

  assert.ok(byId.get('CAP-OUTCOME-LEARNING')?.tests.length,
    'Outcome Learning must map its regression test evidence');
  assert.equal(byId.get('CAP-OUTCOME-LEARNING')?.complete, true,
    'Outcome Learning is complete only after all required evidence fields are mapped');
});
