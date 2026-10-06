import test from "node:test";
import assert from "node:assert/strict";
import { MATERIAL_DEFAULTS, normalizeMaterial } from "../src/glass/materials.js";

test("material defaults expose the optical parameters required by the reference pipeline", () => {
  for (const key of ["refThickness","refDistance","refFactor","refDispersion","refFresnelRange","refFresnelHardness","refFresnelFactor","glareRange","glareHardness","glareFactor","glareConvergence","glareOppositeFactor","glareAngle","blurRadius","blurEdge"]) {
    assert.ok(key in MATERIAL_DEFAULTS, key);
  }
});

test("normalizeMaterial clamps optical controls to their declared ranges", () => {
  const m = normalizeMaterial({ refFactor: 99, refDistance: -1, refDispersion: 999, glareAngle: 999 });
  assert.equal(m.refFactor, 4);
  assert.equal(m.refDistance, 0);
  assert.equal(m.refDispersion, 50);
  assert.equal(m.glareAngle, 180);
});
