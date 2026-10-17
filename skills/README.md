# CSS, Layout, and Utility-First Styling Skills

This directory vendors the skill instructions and their supporting reference files so they are available with the ViewTube repository, independent of a local global skill installation.

## Included skills

| Skill | Primary file | Reference scope |
|---|---|---|
| Tailwind CSS | `skills/tailwindcss/SKILL.md` | Core utilities, responsive design, themes, effects, transforms, typography, layout, and visual styles |
| Tailwind CSS Advanced Layouts | `skills/tailwindcss-advanced-layouts/SKILL.md` | Advanced layout patterns |
| UnoCSS | `skills/unocss/SKILL.md` | Configuration, rules, variants, shortcuts, presets, transformers, and Vite/Nuxt integration |
| Tailwind CSS Patterns | `skills/tailwind-css-patterns/SKILL.md` | Component, responsive, layout, animation, accessibility, configuration, and performance patterns |
| CSS Animation Creator | `skills/css-animation-creator/SKILL.md` | Animation workflow, timing, transitions, keyframes, loading states, micro-interactions, page/scroll transitions, accessibility, Tailwind config, and performance |

## How to use

1. Read the relevant skill's `SKILL.md` before changing CSS, layout, or motion behavior.
2. Resolve every relative reference path from that skill's own directory. Supporting materials live in its `references/` subdirectory.
3. Follow the skill workflow, then validate the actual ViewTube implementation and relevant tests/build.
4. Treat references as implementation guidance, not permission to introduce new dependencies or replace ViewTube's canonical shared primitives without checking the existing design system.
5. For Studio controls, preserve repository-specific requirements: shared primitives over duplicated hard-coded variants, 44px standard square controls where applicable, and avoid introducing shadows or gratuitous hover/click movement.

## Source repositories

- Tailwind CSS: https://github.com/hairyf/skills
- Tailwind CSS Advanced Layouts: https://github.com/josiahsiegel/claude-plugin-marketplace
- UnoCSS: https://github.com/antfu/skills
- Tailwind CSS Patterns: https://github.com/giuseppe-trisciuoglio/developer-kit
- CSS Animation Creator: https://github.com/onewave-ai/claude-skills

The skills and references were copied from the source repositories' `main` branches during this update. Review upstream changes periodically and refresh the vendored files intentionally rather than silently drifting.
