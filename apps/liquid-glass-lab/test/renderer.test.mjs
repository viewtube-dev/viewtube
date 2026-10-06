import test from "node:test";
import assert from "node:assert/strict";
import { buildOpticalUniforms } from "../src/renderer/optical-uniforms.js";

test("uniform mapping preserves independent rectangle material controls", () => {
  const uniforms = buildOpticalUniforms({
    refThickness: 20, refDistance: .05, refFactor: 1.4, refDispersion: 7,
    refFresnelRange: 30, refFresnelHardness: 20, refFresnelFactor: 20,
    glareRange: 30, glareHardness: 20, glareFactor: 90,
    glareConvergence: 50, glareOppositeFactor: 80, glareAngle: -45,
    blurRadius: 12, blurEdge: true
  });
  assert.equal(uniforms.uRefThickness, 20);
  assert.equal(uniforms.uRefDispersion, 7);
  assert.equal(uniforms.uGlareAngle, -45);
  assert.equal(uniforms.uBlurRadius, 12);
});
