import test from "node:test";
import assert from "node:assert/strict";
import { GLASS_FRAGMENT_SHADER } from "../src/renderer/shaders.js";

test("glass shader contains the optical stages instead of CSS-only glass", () => {
  for (const stage of ["uEnvironment", "uBlurredEnvironment", "refract", "Fresnel", "dispersion", "glare", "sdRoundRect"]) {
    assert.match(GLASS_FRAGMENT_SHADER, new RegExp(stage, "i"), stage);
  }
});
