export const MATERIAL_DEFAULTS = {
  opacity: 0.48,
  blur: 18,
  refraction: 0.28,
  edgeLight: 0.62,
  glare: 0.36,
  depth: 0.55,
  tint: "#ffffff",
  motion: 0.45,
};

export const PERFORMANCE_TIERS = {
  high: { blurScale: 1, refraction: 1, motion: 1 },
  balanced: { blurScale: 0.7, refraction: 0.72, motion: 0.7 },
  lite: { blurScale: 0.35, refraction: 0.35, motion: 0.35 },
  fallback: { blurScale: 0, refraction: 0, motion: 0 },
};

export function materialStyle(material, tier = "balanced") {
  const scale = PERFORMANCE_TIERS[tier] ?? PERFORMANCE_TIERS.balanced;
  return {
    "--glass-opacity": material.opacity,
    "--glass-blur": `${material.blur * scale.blurScale}px`,
    "--glass-refraction": material.refraction * scale.refraction,
    "--glass-edge": material.edgeLight,
    "--glass-glare": material.glare,
    "--glass-depth": material.depth,
    "--glass-motion": material.motion * scale.motion,
    "--glass-tint": material.tint,
  };
}
