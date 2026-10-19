# CSS, Layout and Motion Skills

Upstream skill instructions and supporting references for ViewTube UI work. These resources are guidance only; adding them does not automatically add Tailwind or UnoCSS runtime dependencies or change the app's styling architecture.

## Installed skills

- [Tailwind CSS](../../skills/tailwindcss/SKILL.md) — utilities, responsive behavior, themes, and transitions.
- [Tailwind CSS Advanced Layouts](../../skills/tailwindcss-advanced-layouts/SKILL.md) — advanced responsive layout patterns.
- [UnoCSS](../../skills/unocss/SKILL.md) — configuration, presets, rules, extraction, and transformers.
- [Tailwind CSS Patterns](../../skills/tailwind-css-patterns/SKILL.md) — reusable components, responsive design, accessibility, and performance.
- [CSS Animation Creator](../../skills/css-animation-creator/SKILL.md) — timing, easing, keyframes, micro-interactions, page/scroll transitions, accessibility, and performance.

## Upstream repositories

- https://github.com/hairyf/skills
- https://github.com/josiahsiegel/claude-plugin-marketplace
- https://github.com/antfu/skills
- https://github.com/giuseppe-trisciuoglio/developer-kit
- https://github.com/onewave-ai/claude-skills

## ViewTube-specific usage rules

1. Read the relevant SKILL.md and resolve its reference links relative to that skill's directory.
2. Preserve the shared Studio primitives and token architecture; do not introduce one-off copies of shared controls.
3. Do not silently add Tailwind or UnoCSS as runtime/build dependencies. Check the actual project stack before applying framework-specific examples.
4. For motion, prefer transform/opacity, honor prefers-reduced-motion, and check performance.
5. ViewTube's existing motion requirements take precedence: do not reintroduce global hover/click movement, shadows, or transitions where the Studio controls specification explicitly removes them. Keep only explicitly approved motion such as floating-label behavior and square-icon animation.
6. Verify changes with focused tests, typecheck, and build before shipping.
