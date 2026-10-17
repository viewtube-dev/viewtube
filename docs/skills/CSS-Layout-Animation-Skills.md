# CSS, Layout and Motion Skills

Imported upstream skill instructions and supporting references for ViewTube UI work. These are reference resources; they do not automatically change runtime dependencies or activate Tailwind/UnoCSS in the application.

## Installed skills

- [Tailwind CSS](../../skills/tailwindcss/SKILL.md) — utilities, layout, responsive behavior, theming, and transitions.
- [Tailwind CSS Advanced Layouts](../../skills/tailwindcss-advanced-layouts/SKILL.md) — advanced layout patterns.
- [UnoCSS](../../skills/unocss/SKILL.md) — configuration, presets, rules, extraction, and transformers.
- [Tailwind CSS Patterns](../../skills/tailwind-css-patterns/SKILL.md) — reusable component patterns, responsive design, accessibility, and performance.
- [CSS Animation Creator](../../skills/css-animation-creator/SKILL.md) — timing, easing, keyframes, micro-interactions, page/scroll transitions, accessibility, and performance.

## Upstream sources

- https://github.com/hairyf/skills
- https://github.com/josiahsiegel/claude-plugin-marketplace
- https://github.com/antfu/skills
- https://github.com/giuseppe-trisciuoglio/developer-kit
- https://github.com/onewave-ai/claude-skills

## Usage guardrails

1. Read the relevant SKILL.md before changing UI implementation.
2. Resolve every relative reference from that skill's directory, and keep the reference files with the skill.
3. Preserve ViewTube's shared primitive/token architecture; do not add parallel one-off styles or silently introduce Tailwind/UnoCSS runtime dependencies.
4. For motion, prioritize transform and opacity, honor prefers-reduced-motion, and verify performance and interaction alignment.
5. Treat these as imported upstream guidance; verify framework versions and project compatibility before applying examples.
