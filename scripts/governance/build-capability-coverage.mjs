import fs from 'node:fs';
import path from 'node:path';
import { evaluateCapabilityCoverage } from './convergence.mjs';

const root = process.cwd();
const readJson = (relativePath) => JSON.parse(
  fs.readFileSync(path.join(root, relativePath), 'utf8'),
);
const caps = readJson('docs/architecture/capabilities.json');
const owners = readJson('governance/convergence/code-ownership.json');
const homes = readJson('governance/convergence/capability-homes.json');
const evidenceMap = readJson('governance/convergence/capability-evidence-map.json');
const outputPath = path.join(root, 'governance/convergence/capability-coverage.json');
const checkOnly = process.argv.includes('--check');

if (evidenceMap.schemaVersion !== 'viewtube.capability-evidence-map.v1') {
  throw new Error('Unsupported capability evidence map schemaVersion');
}
if (!evidenceMap.lastEdited || !evidenceMap.capabilities || typeof evidenceMap.capabilities !== 'object') {
  throw new Error('Capability evidence map requires lastEdited and capabilities');
}

const capabilityIds = new Set(caps.capabilities.map((capability) => capability.id));
for (const capabilityId of Object.keys(evidenceMap.capabilities)) {
  if (!capabilityIds.has(capabilityId)) {
    throw new Error(`Capability evidence map references unknown capability: ${capabilityId}`);
  }
}

const referenceFields = ['taskRefs', 'tests', 'guideRefs', 'verificationRefs'];
const validateReferences = (capabilityId, mapping = {}) => {
  const validated = {};
  for (const field of referenceFields) {
    const refs = mapping[field] ?? [];
    if (!Array.isArray(refs) || refs.some((ref) => typeof ref !== 'string' || !ref.trim())) {
      throw new Error(`${capabilityId}.${field} must be an array of non-empty repository paths`);
    }
    for (const ref of refs) {
      const absolutePath = path.resolve(root, ref);
      if (!absolutePath.startsWith(`${root}${path.sep}`) || !fs.existsSync(absolutePath)) {
        throw new Error(`Missing or unsafe capability evidence reference: ${capabilityId}.${field} -> ${ref}`);
      }
    }
    validated[field] = refs;
  }
  return validated;
};

const records = caps.capabilities.map((capability) => {
  const ownership = owners.records.filter((record) => (record.capabilityIds || []).includes(capability.id));
  const home = homes.homes.find((entry) => entry.capabilityId === capability.id);
  const mappedEvidence = evidenceMap.capabilities[capability.id] || {};
  const references = validateReferences(capability.id, mappedEvidence);
  const record = {
    id: capability.id,
    name: capability.name,
    authority: capability.authority,
    home: home?.path || null,
    codeOwners: [...new Set(ownership.flatMap((entry) => entry.patterns || []))],
    taskRefs: references.taskRefs,
    tests: references.tests,
    uiSurfaces: capability.masterTools || [],
    guideRefs: references.guideRefs,
    verificationRefs: references.verificationRefs,
  };
  return {
    ...record,
    ...evaluateCapabilityCoverage(record),
    lastAudited: Object.keys(mappedEvidence).length ? evidenceMap.lastEdited : '2026-09-27',
  };
});

const generated = JSON.stringify({
  schemaVersion: 'viewtube.capability-coverage.v1',
  lastEdited: evidenceMap.lastEdited,
  source: 'docs/architecture/capabilities.json',
  capabilities: records,
}, null, 2) + '\n';

const sortKeys = (value) => {
  if (Array.isArray(value)) return value.map(sortKeys);
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.keys(value).sort().map((key) => [key, sortKeys(value[key])]));
  }
  return value;
};

if (checkOnly) {
  const existing = fs.readFileSync(outputPath, 'utf8');
  if (JSON.stringify(sortKeys(JSON.parse(existing))) !== JSON.stringify(sortKeys(JSON.parse(generated)))) {
    throw new Error('Capability coverage report is stale. Run npm run generate:capability-coverage and commit the regenerated report.');
  }
  console.log('Capability coverage report is current; all mapped repository references exist.');
} else {
  fs.writeFileSync(outputPath, generated);
  console.log(`Generated capability coverage for ${records.length} capabilities.`);
}
