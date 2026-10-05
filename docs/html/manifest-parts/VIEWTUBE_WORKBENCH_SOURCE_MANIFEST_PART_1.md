# 1. Canonical source

- Repository: viewtube-dev/viewtube
- Commit: 65fc38870748e928f489d5b5b67881b658647fb5
- Path: docs/html/VIEWTUBE_TOOLBOX_COMPONENT_LIBRARY-7.html
- Source role: canonical visual and structural reference
- Important source fact: this commit is a CSS component library, not a populated component catalog. The document contains `<html><head>...<style>...</style></head>` and no source HTML body, script, renderer registry, analytics, or runtime component data. Therefore this manifest treats the CSS selectors/tokens as canonical and does not invent absent source markup.

# 2. Foundations and tokens

The source loads Inter 400–900 and falls back through the ViewTube/Tailwind sans stack. The ViewTube pair system is consumed as `var(--pair-a,fallback)` and `var(--pair-b,fallback)`; this file does not define root `--pair-a/--pair-b` values. Canonical fallbacks are cyan `#36e0f6` and coral `#ff7f6b`. The recurring semantic accents are pink `#fa618a`, yellow `#ffe357`, green `#57f15c`, dark `#080808`, white `#fff`, black `#000`, and cyan shadow `#73deff73`.

```css
:root{
  --vt-toolbox-header-height:80px;
  --vt-toolbox-stroke:5px;
  --vt-toolbox-radius:16px;
  --vt-toolbox-shadow-offset:10px;
  --vt-toolbox-title-size:26px;
  --vt-toolbox-component-stroke:3px;
  --vt-toolbox-component-radius:8px;
  --vt-toolbox-component-shadow:4px;
  --vt-toolbox-component-compact:32px;
  --vt-toolbox-component-standard:48px;
  --vt-toolbox-component-action:56px;
  --vt-toolbox-content-padding:4px;
  --vt-toolbox-content-gap:4px;
  --vt-level1-stroke:4px;
  --vt-level1-radius:12px;
  --vt-level1-shadow:6px;
  --vt-inner-stroke:3px;
  --vt-inner-radius:8px;
  --vt-inner-shadow:4px;
  --vt-subtoolbox-stroke:4px;
  --vt-subtoolbox-radius:12px;
  --vt-subtoolbox-shadow-offset:6px;
  --vt-subtoolbox-header-height:56px;
  --vt-subtoolbox-title-size:20px;
  --vt-mini-height:40px;
  --vt-mini-stroke:3px;
  --vt-mini-radius:8px;
  --vt-mini-shadow:4px;
  --vt-subtoolbox-inner-stroke:3px;
  --vt-subtoolbox-inner-radius:8px;
  --vt-subtoolbox-inner-shadow:4px;
  --vt-subtoolbox-gap-micro:4px;
  --vt-subtoolbox-gap-dense:8px;
  --vt-subtoolbox-gap:12px;
  --vt-subtoolbox-section-gap:16px;
  --vt-subtoolbox-control-micro:26px;
  --vt-subtoolbox-control-compact:32px;
  --vt-subtoolbox-control-standard:48px;
  --vt-subtoolbox-control-action:56px;
  --vt-subtoolbox-motion-control:.18s;
  --vt-subtoolbox-motion-collapse:.6s;
  --vt-toolbox-shell-gutter:6px;
  --vt-toolbox-header-edge-clearance:10px;
  --vt-keyboard-occlusion:0px;
}
[data-vt-toolbox][data-vt-toolbox-level="main"] > div > div > main{
  --vt-level1-stroke:4px;--vt-level1-radius:12px;--vt-level1-shadow:6px;
  --vt-inner-stroke:3px;--vt-inner-radius:8px;--vt-inner-shadow:4px;
}
[data-vt-toolbox][data-vt-toolbox-level="main"] [data-vt-toolbox-level="sub"]{
  --vt-subtoolbox-stroke:4px;--vt-subtoolbox-radius:12px;
  --vt-subtoolbox-shadow-offset:6px;--vt-subtoolbox-header-height:56px;
  --vt-subtoolbox-title-size:20px;
}
[data-vt-toolbox-level="sub"],[data-vt-subtoolbox-module="true"]{
  --vt-subtoolbox-stroke:4px;--vt-subtoolbox-radius:12px;--vt-subtoolbox-shadow-offset:6px;
  --vt-subtoolbox-header-height:56px;--vt-subtoolbox-title-size:20px;
  --vt-subtoolbox-inner-stroke:3px;--vt-subtoolbox-inner-radius:8px;--vt-subtoolbox-inner-shadow:4px;
  --vt-subtoolbox-gap-micro:4px;--vt-subtoolbox-gap-dense:8px;--vt-subtoolbox-gap:12px;
  --vt-subtoolbox-section-gap:16px;--vt-subtoolbox-control-micro:26px;
  --vt-subtoolbox-control-compact:32px;--vt-subtoolbox-control-standard:48px;
  --vt-subtoolbox-control-action:56px;--vt-subtoolbox-motion-control:.18s;
  --vt-subtoolbox-motion-collapse:.6s;
}
```

| Token family | Canonical values / rule |
|---|---|
| Pair A / Pair B | `--pair-a` → fallback `#36e0f6`; `--pair-b` → fallback `#ff7f6b`. A is primary fill/accent; B is paired secondary fill, border-adjacent accent, active/alternate state and hard-shadow tint where selectors specify it. |
| Main toolbox | 80px header, 5px stroke, 16px radius, 10px hard shadow, 26px title. Accordion variant overrides to 56px/12px/20px and 4px border. |
| Level 1 | 4px stroke, 12px radius, 6px hard shadow. |
| Inner component | 3px stroke, 8px radius, 4px hard shadow. |
| Subtoolbox | 4px stroke, 12px radius, 6px shadow, 56px header, 20px title. |
| Mini | 40px height, 3px stroke, 8px radius, 4px shadow; mobile 36px/7px/3px. |
| Control scale | micro 26px, compact 32px, standard 48px, action 56px. |
| Spacing | micro 4px, dense 8px, normal 12px, section 16px. |
| Motion | control .18s; collapse .6s; reduced-motion disables component transitions/animations. |
| Typography | Inter 400–900; source component emphasis commonly uses weight 800–1000, uppercase, negative tracking around -.045em to -.055em, compact line-height around .88–1.3. |
| Focus | core controls use 3px outline with 3px offset; color follows component fill/pair. |
| Global base | `box-sizing:border-box`; black structural borders; `button,input,select,optgroup,textarea{font:inherit;letter-spacing:inherit;color:inherit}`. |
| Hard shadow | structural shadows are literal X/Y offsets with no blur; common formulas are 4/4, 6/6, 10/10. |

## Level tokens and requested Workbench normalization

The source has explicit control levels: L0 = 28px/14px, L1 = 24px/12px, L2 = 18px/9px, preserving a 2:1 height:text ratio. Source also uses L0/L1/L2 icon stroke widths 3.75/3.4/3px. For the requested Workbench improvement, retain the 2:1 ratio but make L0 the full readable workbench control scale: L0 = 48px/24px; L1 = 32px/16px; L2 = 24px/12px. This is an explicit Workbench enhancement layer, not a replacement for the canonical source values; the source values remain available for fidelity mode.

```css
[data-vt-control-level="l0"]{height:48px;min-height:48px;font-size:24px}
[data-vt-control-level="l1"]{height:32px;min-height:32px;font-size:16px}
[data-vt-control-level="l2"]{height:24px;min-height:24px;font-size:12px}
[data-vt-control-level="l0"] svg{stroke-width:3.75px}
[data-vt-control-level="l1"] svg{stroke-width:3.4px}
[data-vt-control-level="l2"] svg{stroke-width:3px}
```

# 3. Shared primitives

The canonical reusable primitives are class-based. Preserve these names and their nesting; do not substitute generic cards.

```html
<button class="vt-subtoolbox-button has-component-level">
  <span class="vt-subtoolbox-button-icon">…</span>
  <span class="vt-subtoolbox-button-label">LABEL</span>
</button>
<button class="vt-subtoolbox-icon-button" aria-label="Action">…</button>
<input class="vt-subtoolbox-input" type="text">
<textarea class="vt-subtoolbox-textarea"></textarea>
<div class="vt-subtoolbox-labeled-field">
  <input class="vt-subtoolbox-labeled-control" placeholder="">
  <span class="vt-subtoolbox-labeled-field-overlay">LABEL</span>
</div>
<div class="vt-subtoolbox-segmented" style="--vt-segment-count:3">
  <button>ONE</button><button class="is-active">TWO</button><button>THREE</button>
</div>
<button class="vt-subtoolbox-toggle-switch is-on"><span></span></button>
<div class="vt-subtoolbox-button-group"><button>ONE</button><button class="is-active">TWO</button></div>
<div class="vt-subtoolbox-tabs" style="--vt-tab-count:3">
  <button class="is-active">ONE</button><button>TWO</button><button>THREE</button>
</div>
<div class="vt-subtoolbox-progress"><span class="vt-subtoolbox-progress-value"></span></div>
<div class="vt-subtoolbox-alert"><span class="vt-subtoolbox-alert-icon">…</span><div class="vt-subtoolbox-alert-copy">MESSAGE</div><button>…</button></div>
<div class="vt-subtoolbox-surface">CONTENT</div>
<div class="vt-subtoolbox-state">STATE</div>
<div class="vt-subtoolbox-output">
  <header class="vt-subtoolbox-output-header"><strong class="vt-subtoolbox-output-title">OUTPUT</strong><span class="vt-subtoolbox-output-badge">STATUS</span></header>
  <div class="vt-subtoolbox-output-body">…</div>
</div>
```

Cards/surfaces use black structural strokes, white base surfaces, paired-color fills, and hard shadows. Tags use `vt-subtoolbox-removable-tag` or `vt-subtoolbox-selectable-tag`; status uses `vt-subtoolbox-status-badge`; metrics use `vt-subtoolbox-stat-card`, `vt-subtoolbox-metric-strip`, `vt-subtoolbox-data-stats`, or `vt-subtoolbox-name-value`.

Media primitives preserve the actual aspect and player system:
```html
<div class="vt-subtoolbox-aspect-frame" data-ratio="16:9">
  <div class="vt-subtoolbox-aspect-frame-canvas">MEDIA</div>
  <span class="vt-subtoolbox-aspect-frame-label">LABEL</span>
</div>
<div class="vt-subtoolbox-media-card">
  <div class="vt-subtoolbox-media-card-preview">THUMBNAIL</div>
  <div class="vt-subtoolbox-media-card-copy">TITLE / META</div>
</div>
<div class="vt-subtoolbox-media-player">
  <header class="vt-subtoolbox-media-player-head">TITLE / META</header>
  <div class="vt-subtoolbox-media-poster" data-ratio="16:9"><img alt=""></div>
  <div class="vt-subtoolbox-media-player-timeline">
    <div class="vt-subtoolbox-media-seek"><div class="vt-subtoolbox-media-seek-track"><i class="buffered"></i><i class="played"></i></div><input type="range"></div>
    <div class="vt-subtoolbox-media-timecode"><b>00:00</b><span>/ 00:00</span></div>
  </div>
  <div class="vt-subtoolbox-media-transport">
    <div class="vt-subtoolbox-media-transport-cluster">CONTROLS</div>
  </div>
</div>
```

Navigation primitives are `vt-subtoolbox-breadcrumb`, `vt-subtoolbox-tabs`, `vt-subtoolbox-toolbar`, `vt-subtoolbox-tree`, `vt-subtoolbox-list-row`, `vt-subtoolbox-reorder-row`, `vt-subtoolbox-pagination`, and the top-title dropdown family. Overlay primitives include menu, popover, hover-card, dialog, drawer, command and tooltip families.

# 4. Component-family renderer registry

This canonical file supplies CSS archetypes, not JS renderers. The Workbench renderer must therefore map each family to the exact class structure below; it must not invent a visual fallback.

| Family | Renderer/archetype | Required structure | Editable properties | States |
|---|---|---|---|---|
| Shell | one or more exact CSS family primitives in the group | vt-toolbox, vt-toolbox-header-identity, vt-toolbox-header-title-slot, vt-toolbox-header-actions, vt-toolbox-header-extras, vt-toolbox-title, vt-subtoolbox-title, vt-toolbox-header-toggle, vt-toolbox-header-icon-rail, vt-toolbox-header-title, vt-toolbox-header-control, vt-toolbox-header-help, vt-toolbox-header-collapse, vt-subtoolbox-content, vt-subtoolbox-stack, vt-subtoolbox-grid, vt-subtoolbox-actions, vt-subtoolbox-section, vt-mini-subtoolbox, vt-mini-subtoolbox-header, vt-mini-subtoolbox-icon, vt-mini-subtoolbox-title, vt-mini-subtoolbox-actions, vt-mini-subtoolbox-content | class-specific content/ARIA; do not rename | source selectors define state classes; preserve them |
| Core controls | one or more exact CSS family primitives in the group | vt-subtoolbox-button, vt-subtoolbox-button-icon, vt-subtoolbox-button-label, vt-subtoolbox-icon-button, vt-subtoolbox-input, vt-subtoolbox-textarea, vt-subtoolbox-chip, vt-subtoolbox-stepper, vt-subtoolbox-segmented, vt-subtoolbox-toggle-switch, vt-subtoolbox-check-control, vt-subtoolbox-radio-control, vt-subtoolbox-status-badge | class-specific content/ARIA; do not rename | source selectors define state classes; preserve them |
| Menus / overlays | one or more exact CSS family primitives in the group | vt-subtoolbox-tooltip, vt-subtoolbox-tooltip-trigger, vt-subtoolbox-tooltip-bubble, vt-subtoolbox-menu, vt-subtoolbox-menu-trigger, vt-subtoolbox-menu-label, vt-subtoolbox-menu-context-icon, vt-subtoolbox-menu-panel, vt-subtoolbox-popover, vt-subtoolbox-popover-trigger, vt-subtoolbox-popover-panel, vt-subtoolbox-hover-card, vt-subtoolbox-hover-card-trigger, vt-subtoolbox-hover-card-panel, vt-subtoolbox-hover-card-content, vt-subtoolbox-dialog-trigger, vt-subtoolbox-drawer-trigger, vt-subtoolbox-dialog-overlay, vt-subtoolbox-drawer-overlay, vt-subtoolbox-dialog, vt-subtoolbox-drawer, vt-subtoolbox-dialog-body, vt-subtoolbox-drawer-body, vt-subtoolbox-command | class-specific content/ARIA; do not rename | source selectors define state classes; preserve them |
| Fields / selectors | one or more exact CSS family primitives in the group | vt-subtoolbox-split-field, vt-subtoolbox-split-field-rail, vt-subtoolbox-split-field-action, vt-subtoolbox-slider, vt-subtoolbox-range, vt-subtoolbox-slider-rail, vt-subtoolbox-slider-center, vt-subtoolbox-range-center, vt-subtoolbox-range-track, vt-subtoolbox-range-fill, vt-subtoolbox-settings-switch, vt-subtoolbox-button-group, vt-subtoolbox-removable-tag, vt-subtoolbox-selectable-tag, vt-subtoolbox-tag-editor, vt-subtoolbox-tag-editor-tags, vt-subtoolbox-color-picker, vt-subtoolbox-color-swatch, vt-subtoolbox-color-value, vt-subtoolbox-labeled-field, vt-subtoolbox-labeled-control, vt-subtoolbox-labeled-field-overlay, vt-subtoolbox-video-selector, vt-subtoolbox-video-selector-trigger, vt-subtoolbox-video-selector-rail, vt-subtoolbox-video-selector-empty-thumb, vt-subtoolbox-video-selector-badges | class-specific content/ARIA; do not rename | source selectors define state classes; preserve them |
| Data / navigation | one or more exact CSS family primitives in the group | vt-subtoolbox-tabs, vt-subtoolbox-progress-stack, vt-subtoolbox-progress, vt-subtoolbox-progress-value, vt-subtoolbox-stat-card, vt-subtoolbox-alpha-tag-row, vt-subtoolbox-alpha-tag, vt-subtoolbox-list-row, vt-subtoolbox-reorder-row, vt-subtoolbox-list-row-leading, vt-subtoolbox-list-row-copy, vt-subtoolbox-reorder-row-copy, vt-subtoolbox-list-row-trailing, vt-subtoolbox-reorder-row-actions, vt-subtoolbox-metric-strip, vt-subtoolbox-data-stats, vt-subtoolbox-tree, vt-subtoolbox-tree-row, vt-subtoolbox-tree-icon, vt-subtoolbox-tree-children, vt-subtoolbox-breadcrumb, vt-subtoolbox-carousel, vt-subtoolbox-carousel-stage, vt-subtoolbox-pagination, vt-subtoolbox-scrollbar, vt-subtoolbox-scrollbar-track, vt-subtoolbox-toolbar, vt-subtoolbox-toolbar-leading, vt-subtoolbox-toolbar-main, vt-subtoolbox-toolbar-trailing, vt-subtoolbox-top-title-dropdown, vt-subtoolbox-top-title-dropdown-panel, vt-subtoolbox-top-title-dropdown-trigger, vt-subtoolbox-top-title-dropdown-title, vt-subtoolbox-top-title-dropdown-value, vt-subtoolbox-top-title-dropdown-chevron | class-specific content/ARIA; do not rename | source selectors define state classes; preserve them |
| Feedback / loading | one or more exact CSS family primitives in the group | vt-subtoolbox-alert, vt-subtoolbox-alert-icon, vt-subtoolbox-alert-copy, vt-subtoolbox-step-indicator, vt-subtoolbox-loader, vt-subtoolbox-loader-spinner, vt-subtoolbox-loader-progress, vt-subtoolbox-loader-split-rail, vt-subtoolbox-loader-split-title, vt-subtoolbox-loader-orbit, vt-subtoolbox-loader-bars, vt-subtoolbox-skeleton, vt-subtoolbox-skeleton-shimmer, vt-subtoolbox-skeleton-line, vt-subtoolbox-skeleton-compact-icon, vt-subtoolbox-skeleton-compact-copy, vt-subtoolbox-skeleton-compact-action, vt-subtoolbox-skeleton-media-frame, vt-subtoolbox-skeleton-media-meta, vt-subtoolbox-toast, vt-subtoolbox-toast-rail, vt-subtoolbox-toast-copy, vt-subtoolbox-led-ripple, vt-subtoolbox-led, vt-subtoolbox-led-emitter, vt-subtoolbox-led-core, vt-subtoolbox-led-dot, vt-subtoolbox-disclosure, vt-subtoolbox-disclosure-head, vt-subtoolbox-disclosure-body | class-specific content/ARIA; do not rename | source selectors define state classes; preserve them |
| Media / content | one or more exact CSS family primitives in the group | vt-subtoolbox-media-card, vt-subtoolbox-media-card-preview, vt-subtoolbox-media-card-copy, vt-subtoolbox-aspect-frame, vt-subtoolbox-aspect-frame-canvas, vt-subtoolbox-aspect-frame-label, vt-subtoolbox-media-control, vt-subtoolbox-media-caption, vt-subtoolbox-media-speed, vt-subtoolbox-media-timecode, vt-subtoolbox-media-duration, vt-subtoolbox-media-status, vt-subtoolbox-media-volume, vt-subtoolbox-media-seek, vt-subtoolbox-media-seek-track, vt-subtoolbox-media-poster, vt-subtoolbox-media-poster-placeholder, vt-subtoolbox-media-poster-overlay, vt-subtoolbox-media-transport, vt-subtoolbox-media-transport-cluster, vt-subtoolbox-media-player, vt-subtoolbox-media-player-head, vt-subtoolbox-media-player-timeline, vt-subtoolbox-media-player-footer, vt-subtoolbox-media-queue, vt-subtoolbox-media-queue-list, vt-subtoolbox-media-queue-row, vt-subtoolbox-media-queue-index, vt-subtoolbox-media-queue-thumb, vt-subtoolbox-media-queue-copy, vt-subtoolbox-media-inspector, vt-subtoolbox-media-inspector-body, vt-subtoolbox-media-inspector-actions, vt-subtoolbox-media-review, vt-subtoolbox-media-review-main, vt-subtoolbox-media-review-side, vt-subtoolbox-media-review-notes, vt-subtoolbox-media-review-actions | class-specific content/ARIA; do not rename | source selectors define state classes; preserve them |
| Surfaces / outputs | one or more exact CSS family primitives in the group | vt-subtoolbox-surface, vt-subtoolbox-state, vt-subtoolbox-output, vt-subtoolbox-output-header, vt-subtoolbox-output-title, vt-subtoolbox-output-badge, vt-subtoolbox-output-body, vt-subtoolbox-file-target, vt-subtoolbox-file-target-button, vt-subtoolbox-file-target-icon, vt-upload-tight-reveal, vt-upload-tight-reveal-layers, vt-upload-tight-reveal-layer, vt-upload-tight-reveal-center, vt-upload-tight-reveal-label, vt-subtoolbox-icon-rail-control, vt-subtoolbox-name-value, vt-subtoolbox-avatar, vt-subtoolbox-avatar-image, vt-subtoolbox-avatar-copy, vt-subtoolbox-split-button, vt-subtoolbox-controller-switch, vt-subtoolbox-controller-track, vt-subtoolbox-controller-thumb, vt-subtoolbox-meter | class-specific content/ARIA; do not rename | source selectors define state classes; preserve them |
| Media card / player | media archetype | `vt-subtoolbox-media-card`, `vt-subtoolbox-media-player`, poster/transport/timeline children as applicable | media, title, metadata, progress, status | active, paused, processing, error |
| Video selector | selector archetype | `vt-subtoolbox-video-selector` → trigger → rail/badges/content | thumbnail, title, badges, selected item | selected, open, empty |
| Upload | upload archetype | `vt-subtoolbox-file-target` or `vt-upload-tight-reveal` and its named children | label, file, progress, state | idle, drag, uploading, complete, error |
| Data visual frame | visual-frame archetype | `data-vt-visual-frame`, optional `data-vt-chart-body`; preview canvas uses `data-vt-preview-canvas-16x9` | aspect, data, density | desktop, portrait, landscape, reduced motion |
| Toolbox shell | shell archetype | `data-vt-toolbox` + `data-vt-toolbox-level` + named header/content classes | title, actions, level, variant | open/closed, main/sub, accordion |

Component-specific properties must never be inferred from class names when the source does not define them. Renderer state is represented by the actual source state classes/attributes such as `.is-active`, `.is-on`, `.is-selected`, `.is-error`, `.is-processing`, `data-state`, `data-depth`, `data-ratio`, `data-placement`, and `data-vt-control-leve