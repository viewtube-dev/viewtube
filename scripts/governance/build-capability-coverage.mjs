import fs from 'node:fs';
import { evaluateCapabilityCoverage } from './convergence.mjs';

const caps=JSON.parse(fs.readFileSync('docs/architecture/capabilities.json','utf8'));
const owners=JSON.parse(fs.readFileSync('governance/convergence/code-ownership.json','utf8'));
const homes=JSON.parse(fs.readFileSync('governance/convergence/capability-homes.json','utf8'));
const evidenceMap=JSON.parse(fs.readFileSync('governance/convergence/capability-evidence-map.json','utf8'));
const evidenceByCapability=evidenceMap.capabilities||{};

const records=caps.capabilities.map(cap=>{
  const evidence=evidenceByCapability[cap.id]||{};
  const references=[...(evidence.taskRefs||[]),...(evidence.tests||[]),...(evidence.guideRefs||[]),...(evidence.verificationRefs||[])];
  const missingReferences=references.filter(ref=>!fs.existsSync(ref));
  if(missingReferences.length) throw new Error(`Capability ${cap.id} has missing evidence references: ${missingReferences.join(', ')}`);
  const ownership=owners.records.filter(r=>(r.capabilityIds||[]).includes(cap.id));
  const home=homes.homes.find(h=>h.capabilityId===cap.id);
  const record={
    id:cap.id,
    name:cap.name,
    authority:cap.authority,
    home:home?.path||null,
    codeOwners:[...new Set(ownership.flatMap(r=>r.patterns||[]))],
    taskRefs:evidence.taskRefs||[],
    tests:evidence.tests||[],
    uiSurfaces:cap.masterTools||[],
    guideRefs:evidence.guideRefs||[],
    verificationRefs:evidence.verificationRefs||[],
  };
  return {...record,...evaluateCapabilityCoverage(record),lastAudited:evidenceByCapability[cap.id]?evidenceMap.lastEdited:'2026-09-27'};
});

fs.writeFileSync('governance/convergence/capability-coverage.json',JSON.stringify({
  schemaVersion:'viewtube.capability-coverage.v1',
  lastEdited:evidenceMap.lastEdited,
  source:'docs/architecture/capabilities.json',
  capabilities:records
},null,2)+'\n');
