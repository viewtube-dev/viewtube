# CSS, Layout, and Utility-First Styling Skills

The five requested skills and their supporting references are already present in this repository's `skills/` directory and are registered in `skills-lock.json`. This index helps contributors find the right instructions and keeps ViewTube-specific constraints explicit.

## Skills and reference paths

| Skill | Entry point | Supporting resources |
|---|---|---|
| Tailwind CSS | `skills/tailwindcss/SKILL.md` | `skills/tailwindcss/references/` — core utilities, responsive design, themes, effects, transforms, typography, layout, and visual styles |
| Tailwind CSS Advanced Layouts | `skills/tailwindcss-advanced-layouts/SKILL.md` | Advanced grid, flexbox, and layout guidance in the entry point |
| UnoCSS | `skills/unocss/SKILL.md` | `skills/unocss/references/` — configuration, rules, variants, shortcuts, presets, transformers, and Vite/Nuxt integration |
| Tailwind CSS Patterns | `skills/tailwind-css-patterns/SKILL.md` | `skills/tailwind-css-patterns/references/` — component, responsive, layout, animation, accessibility, configuration, and performance patterns |
| CSS Animation Creator | `skills/css-animation-creator/SKILL.md` | `skills/css-animation-creator/references/` — timing, transitions, keyframes, loading states, micro-interactions, page/scroll transitions, accessibility, Tailwind config, and performance |

## How to apply them

1. Read the relevant `SKILL.md` before changing CSS, layout, or motion behavior.
2. Resolve relative paths from the individual skill directory. Its supporting files are in `references/`.
3. Follow the skill workflow and validate the actual ViewTube implementation, relevant tests, and build.
4. Treat these resources as guidance; do not add dependencies or replace shared ViewTube primitives without checking the current design system.
5. For Studio controls, prefer canonical shared primitives over duplicated hard-coded variants, preserve the established 44px standard square-control sizing where applicable, and do not reintroduce shadows or gratuitous hover/click movement.
6. For animations, prioritize transform/opacity when appropriate, respect `prefers-reduced-motion`, and verify behavior on lower-end devices. Do not add motion where the product interaction calls for stable, badge-like controls.

## Upstream source repositories

- Tailwind CSS: https://github.com/hairyf/skills
- Tailwind CSS Advanced Layouts: https://github.com/josiahsiegel/claude-plugin-marketplace
- UnoCSS: https://github.com/antfu/skills
- Tailwind CSS Patterns: https://github.com/giuseppe-trisciuoglio/developer-kit
- CSS Animation Creator: https://github.com/onewave-ai/claude-skills

The installed copies are vendored in the repository so that instructions and reference paths are available to every contributor. Refresh them intentionally when updating upstream sources.
