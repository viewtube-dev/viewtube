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

Component-specific properties must never be inferred from class names when the source does not define them. Renderer state is represented by the actual source state classes/attributes such as `.is-active`, `.is-on`, `.is-selected`, `.is-error`, `.is-processing`, `data-state`, `data-depth`, `data-ratio`, `data-placement`, and `data-vt-control-level`.

# 5. Exact templates for high-value families

The following are source-faithful only where the canonical CSS defines the named family. The requested YouTube composites that have no matching source family are explicitly marked absent rather than fabricated.

**Button**
```html
<button class="vt-subtoolbox-button has-component-level" data-vt-control-level="l0">
  <span class="vt-subtoolbox-button-icon">SVG</span><span class="vt-subtoolbox-button-label">LABEL</span>
</button>
```

**Icon Button**
```html
<button class="vt-subtoolbox-icon-button" aria-label="LABEL">SVG</button>
```

**Input / Search Field**
```html
<input class="vt-subtoolbox-input" type="text" placeholder="SEARCH">
```
Search has no separate canonical search-field class in this source; use the same input primitive with the actual search semantics/icon supplied by the host.

**Text Area**
```html
<textarea class="vt-subtoolbox-textarea"></textarea>
```

**Select / Dropdown**
```html
<div class="vt-subtoolbox-menu">
  <button class="vt-subtoolbox-menu-trigger"><span class="vt-subtoolbox-menu-label">SELECT</span><span class="vt-subtoolbox-menu-context-icon">SVG</span></button>
  <div class="vt-subtoolbox-menu-panel"><button>OPTION</button><button class="is-selected">OPTION</button></div>
</div>
```

**Toggle**
```html
<button class="vt-subtoolbox-toggle-switch is-on" aria-pressed="true"><span></span></button>
```

**Card / Video Card**
```html
<div class="vt-subtoolbox-media-card">
  <div class="vt-subtoolbox-media-card-preview">THUMBNAIL</div>
  <div class="vt-subtoolbox-media-card-copy">TITLE / META</div>
</div>
```

**Video Details / Video Manager**
No `Video Details` or `Video Manager` renderer/family exists in this canonical CSS-only source. Do not fabricate a source template. A Workbench may compose existing media-card, video-selector, labeled-field, toolbar, output, and media-player primitives only when another canonical ViewTube source explicitly defines that composite.

**KPI Metric / Analytics Card / Watch Time Metric**
No exact KPI, Analytics Card, or Watch Time renderer exists. Canonical metric primitives are `vt-subtoolbox-stat-card`, `vt-subtoolbox-metric-strip`, `vt-subtoolbox-data-stats`, and `vt-subtoolbox-name-value`; use their exact classes and source CSS, not a generic metric card.

**Data Table**
No table class is defined in this file. Do not substitute a generic card. If the Workbench exposes a table, it must come from another canonical ViewTube table source.

**Calendar**
No calendar class is defined in this file. Do not invent calendar markup.

**Modal / Dialog**
```html
<button class="vt-subtoolbox-dialog-trigger">OPEN</button>
<div class="vt-subtoolbox-dialog-overlay">
  <div class="vt-subtoolbox-dialog"><div class="vt-subtoolbox-dialog-body">CONTENT</div></div>
</div>
```
Drawer uses the parallel `vt-subtoolbox-drawer-trigger`, `vt-subtoolbox-drawer-overlay`, `vt-subtoolbox-drawer`, `vt-subtoolbox-drawer-body` structure.

**Command Menu**
```html
<div class="vt-subtoolbox-command">COMMAND CONTENT</div>
```
No deeper source markup is defined beyond the class family.

**Navigation Rail / Sidebar**
No standalone sidebar/rail component family exists; the canonical shell/header families are `vt-toolbox-header-icon-rail`, `vt-toolbox-header-actions`, and `vt-subtoolbox-icon-rail-control`.

**Tab Bar**
```html
<div class="vt-subtoolbox-tabs" style="--vt-tab-count:3">
  <button class="is-active">ONE</button><button>TWO</button><button>THREE</button>
</div>
```

**Progress Bar**
```html
<div class="vt-subtoolbox-progress"><span class="vt-subtoolbox-progress-value"></span></div>
```

**File Upload**
```html
<div class="vt-subtoolbox-file-target">
  <button class="vt-subtoolbox-file-target-button">
    <span class="vt-subtoolbox-file-target-icon">SVG</span>
    <span class="vt-upload-tight-reveal-label">UPLOAD</span>
  </button>
</div>
```

**Upload Queue**
No upload-specific queue family exists. Media queue is `vt-subtoolbox-media-queue`; do not rename it to an upload queue.

**Workflow Step**
```html
<div class="vt-subtoolbox-step-indicator">STEP</div>
```

**Alert**
```html
<div class="vt-subtoolbox-alert"><span class="vt-subtoolbox-alert-icon">SVG</span><div class="vt-subtoolbox-alert-copy">MESSAGE</div><button>DISMISS</button></div>
```

**Toast / Notification**
```html
<div class="vt-subtoolbox-toast">
  <span class="vt-subtoolbox-toast-rail">STATUS</span><div class="vt-subtoolbox-toast-copy">MESSAGE</div>
</div>
```
Notification is not a separate source family; use the toast family where appropriate.

**Empty State**
No named empty-state family exists. Do not create a generic empty card. Use the source's surface/output/state primitives only when another source defines the empty-state composition.

**Comment Thread**
No comment-thread family exists in this source.

**Kanban Board**
No kanban family exists in this source.

**Media Controls**
```html
<div class="vt-subtoolbox-media-transport">
  <div class="vt-subtoolbox-media-transport-cluster">
    <button class="vt-subtoolbox-media-control">SVG</button>
    <button class="vt-subtoolbox-media-caption">CC</button>
    <div class="vt-subtoolbox-media-speed"><select><option>1×</option></select></div>
  </div>
  <div class="vt-subtoolbox-media-timecode"><b>00:00</b><span>/ 00:00</span></div>
</div>
```

# 6. Workbench integration rules

1. Load the canonical token layer once. Switching renderer/family must not reset global style state.
2. Renderer changes only the component family/archetype; shared token state persists.
3. Every editable token has one target property. Do not let typography edits resize frames.
4. Title/body/label/metric/button font sizes target only their corresponding text roles.
5. Width/height affect only the component frame. Padding, margin, gap, border, radius, inner radius, shadow X/Y, opacity remain independent.
6. Surface, secondary surface, accent, secondary accent, ink/text, border, shadow and individual text roles each receive dedicated targets.
7. Preserve `--pair-a`/ `--pair-b` resolution and the source fallback values; do not collapse the pair system into one accent.
8. Menus, selects, tooltips, calendars, command menus, dialogs, drawers and flyouts must be mounted in a body-level fixed overlay root when rendered interactively so parent overflow cannot clip them. This is a Workbench integration rule; the canonical CSS itself only establishes the overlay/z-index behavior.
9. Preview frames use the source's 16:9 constraints: `data-vt-preview-canvas-16x9` and `data-vt-preview-16x9` use `aspect-ratio:16/9`, `height:auto`, `min-height:0`, `overflow:hidden`, and child media is constrained to 100%.
10. Do not create large fixed empty preview heights. Let the selected component frame determine its natural height/aspect.
11. Export must instantiate the same renderer/class template and token values used by preview; never export a visually approximated duplicate.
12. Preserve container-query behavior: adaptive visual density is compact below 479px and full/normal at 720px+.
13. Preserve mobile toolbox behavior: portrait visual frames become full-width; controller roots become a 2-column 30px grid; landscape controller roots become a horizontal 44px rail.
14. Preserve `prefers-reduced-motion: reduce` rules.
15. Workbench L0 enhancement: keep the source's 2:1 height/text ratio but use the requested larger 48px/24px L0 scale; do not change border/radius/shadow proportions merely because text becomes larger.

# 7. Source fidelity checks

- [ ] Canonical repository, commit and path are exact.
- [ ] The source's CSS-only nature is respected; absent renderers are not invented.
- [ ] All 217 ViewTube `vt-*` CSS families/classes found in the source are represented in the registry above or as explicit subparts of their family group.
- [ ] Pair A/B fallbacks remain exactly `#36e0f6` and `#ff7f6b`.
- [ ] Black structural strokes, hard-shadow offsets and radius levels remain exact.
- [ ] Inter 400–900 and the source fallback font stack remain intact.
- [ ] Main/sub/mini/L0/L1/L2 scale tokens remain available.
- [ ] Requested L0 enhancement preserves the 2:1 ratio and uses larger 48px/24px values only in the Workbench enhancement layer.
- [ ] Menu, tooltip, dialog, drawer, command and other overlay families retain their named structures.
- [ ] Media aspect-ratio and player/queue/inspector/review structures retain their exact class names.
- [ ] No generic fallback card replaces a real family.
- [ ] No source-supported value is replaced with “standard styling,” “etc.” or an unspecified implementation.
- [ ] Manifest remains below 100,000 characters; size may expand when exact source rules materially improve rebuild fidelity.


# Canonical CSS implementation appendix

The following rules are copied from the canonical source for high-value renderer fidelity. They are not approximations.

## Component-level sizing contract
The source's component-level variants use these variables: `--vt-component-height`, `--vt-component-font-size`, `--vt-component-stroke`, `--vt-component-radius`, `--vt-component-shadow-offset`, `--pair-a`, and `--pair-b`. The Workbench must keep each independently editable.

## Button
```css
.vt-subtoolbox-button{--vt-subtoolbox-button-fill:var(--vt-subtoolbox-fill,#73deff);justify-content:center;align-items:center;gap:var(--vt-subtoolbox-gap-dense,8px);border:var(--vt-subtoolbox-inner-stroke,3px) solid #000;border-radius:var(--vt-subtoolbox-inner-radius,8px);background:var(--vt-subtoolbox-button-fill);width:100%;min-width:0;box-shadow:var(--vt-subtoolbox-inner-shadow,4px) var(--vt-subtoolbox-inner-shadow,4px) 0 0 var(--vt-subtoolbox-shadow,#73deff73);color:#000;cursor:pointer;text-align:center;text-transform:uppercase;transition:filter var(--vt-subtoolbox-motion-control,.18s) ease-out,transform var(--vt-subtoolbox-motion-control,.18s) ease-out,box-shadow var(--vt-subtoolbox-motion-control,.18s) ease-out;font-weight:900;line-height:1;text-decoration:none;display:inline-flex}
.vt-subtoolbox-button.is-micro{height:var(--vt-subtoolbox-control-micro,26px);min-height:var(--vt-subtoolbox-control-micro,26px);border-width:2px;border-radius:6px;padding:2px 7px;font-size:9px}.vt-subtoolbox-button.is-compact{min-height:var(--vt-subtoolbox-control-compact,32px);padding:6px 8px;font-size:10px}.vt-subtoolbox-button.is-standard{min-height:var(--vt-subtoolbox-control-standard,48px);padding:8px 12px;font-size:14px}.vt-subtoolbox-button.is-action{min-height:var(--vt-subtoolbox-control-action,56px);padding:10px 16px;font-size:20px}
.vt-subtoolbox-button.is-neutral{--vt-subtoolbox-button-fill:#fff}.vt-subtoolbox-button.is-ink{--vt-subtoolbox-button-fill:#000;color:#fff}.vt-subtoolbox-button.is-danger{--vt-subtoolbox-button-fill:#ff77d6}.vt-subtoolbox-button.is-warning{--vt-subtoolbox-button-fill:#ffe357}.vt-subtoolbox-button.is-success{--vt-subtoolbox-button-fill:#57f15c}.vt-subtoolbox-button.is-selected,.vt-subtoolbox-button[aria-pressed="true"]{--vt-subtoolbox-button-fill:#fff}
```

## Input and text area
```css
.vt-subtoolbox-input{width:100%;min-width:0;min-height:var(--vt-subtoolbox-control-standard,48px);appearance:none;border:var(--vt-subtoolbox-inner-stroke,3px) solid #000;border-radius:var(--vt-subtoolbox-inner-radius,8px);background:color-mix(in srgb,var(--vt-subtoolbox-fill,#f6f6f6) 16%,#fff);box-shadow:var(--vt-subtoolbox-inner-shadow,4px) var(--vt-subtoolbox-inner-shadow,4px) 0 0 var(--vt-subtoolbox-shadow,#73deff73);color:#000;font-family:inherit;transition:background-color var(--vt-subtoolbox-motion-control,.18s) ease-out,box-shadow var(--vt-subtoolbox-motion-control,.18s) ease-out,outline-color var(--vt-subtoolbox-motion-control,.18s) ease-out,transform var(--vt-subtoolbox-motion-control,.18s) ease-out;padding:10px 12px;font-size:14px;font-weight:800;line-height:1.3}
.vt-subtoolbox-input.is-micro{height:var(--vt-subtoolbox-control-micro,26px);min-height:var(--vt-subtoolbox-control-micro,26px);border-width:2px;border-radius:6px;padding:2px 8px;font-size:10px}.vt-subtoolbox-input:disabled,.vt-subtoolbox-input[readonly]{cursor:not-allowed;opacity:.55}
.vt-subtoolbox-input.has-component-level{--field-accent:var(--pair-a,#36e0f6);--field-glow:var(--pair-b,#ff7f6b);box-sizing:border-box!important;width:100%!important;height:var(--vt-component-height)!important;min-height:var(--vt-component-height)!important;border:var(--vt-component-stroke) solid #000!important;border-radius:var(--vt-component-radius)!important;color:#000!important;caret-color:var(--field-accent)!important;background:color-mix(in srgb,var(--field-accent) 50%,white)!important;box-shadow:inset 0 0 0 var(--vt-component-stroke) var(--field-accent)!important;font:1000 var(--vt-component-font-size)/1 var(--vt-studio-toolbox-font,var(--font-sans,ui-sans-serif,system-ui))!important;letter-spacing:-.055em!important;text-transform:uppercase!important;outline:0!important;padding:0 12px!important}
.vt-subtoolbox-textarea{resize:vertical;background:color-mix(in srgb,var(--vt-subtoolbox-fill,#f6f6f6) 10%,#fff);min-height:144px}.vt-subtoolbox-textarea.is-compact{min-height:96px}.vt-subtoolbox-textarea.is-fill{resize:none;min-height:100%}.vt-subtoolbox-textarea.has-component-level{height:calc(var(--vt-component-height)*1.65)!important;min-height:calc(var(--vt-component-height)*1.65)!important;resize:vertical!important;padding:12px!important}
```

## Menu
```css
.vt-subtoolbox-menu{--vt-menu-shadow:color-mix(in srgb,var(--pair-a,#36e0f6) 42%,transparent);min-width:min(280px,100%);display:inline-block;position:relative}.vt-subtoolbox-menu-trigger{height:var(--vt-component-height);border:var(--vt-component-stroke) solid #000;border-radius:var(--vt-component-radius);background:var(--pair-b,#ff7f6b);color:#000;min-width:min(280px,100%);box-shadow:var(--vt-component-shadow-offset) var(--vt-component-shadow-offset) 0 var(--vt-menu-shadow);font:1000 var(--vt-component-font-size)/.86 var(--vt-studio-toolbox-font,var(--font-sans,ui-sans-serif,system-ui));letter-spacing:-.055em;text-transform:uppercase;padding:0;overflow:hidden}.vt-subtoolbox-menu-label{grid-template-columns:1fr var(--vt-component-height);align-items:center;height:100%;display:grid}.vt-subtoolbox-menu-label>b{text-align:left;padding-left:12px}.vt-subtoolbox-menu-label>span{place-items:center;display:grid}.vt-subtoolbox-menu-panel{z-index:160;border:var(--vt-component-stroke) solid #000;border-radius:var(--vt-component-radius);min-width:100%;box-shadow:var(--vt-component-shadow-offset) var(--vt-component-shadow-offset) 0 var(--vt-menu-shadow);background:#fff;position:absolute;top:calc(100% + 5px);left:0;overflow:hidden}
```

## Toggle
```css
.vt-subtoolbox-toggle-switch{width:calc(var(--vt-component-height)*1.72);height:var(--vt-component-height);background:color-mix(in srgb,var(--pair-a,#36e0f6) 50%,transparent);border:0;border-radius:999px;outline:0;padding:0;display:block;position:relative}.vt-subtoolbox-toggle-switch>span{aspect-ratio:1;background:var(--pair-b,#ff7f6b);border-radius:50%;height:84%;transition:transform .18s ease-out;position:absolute;top:8%;left:5%;transform:translate(0)}.vt-subtoolbox-toggle-switch.is-on{background:var(--pair-a,#36e0f6)}.vt-subtoolbox-toggle-switch.is-on>span{transform:translateX(calc(var(--vt-component-height)*.72))}.vt-subtoolbox-toggle-switch:focus-visible{outline:3px solid var(--pair-b,#ff7f6b);outline-offset:3px}
```

## Media card and player
```css
.vt-subtoolbox-media-card{grid-template-columns:calc(var(--vt-component-height)*1.65) minmax(0,1fr) auto;border:var(--vt-component-stroke) solid #000;border-radius:var(--vt-component-radius);color:#000;width:100%;min-width:0;box-shadow:var(--vt-component-shadow-offset) var(--vt-component-shadow-offset) 0 color-mix(in srgb,var(--pair-b,#ff7f6b) 35%,transparent);text-align:left;background:#fff;align-items:stretch;padding:0;display:grid;overflow:hidden}.vt-subtoolbox-media-card.is-selected{box-shadow:inset 0 0 0 var(--vt-component-stroke) var(--pair-a,#36e0f6),var(--vt-component-shadow-offset) var(--vt-component-shadow-offset) 0 color-mix(in srgb,var(--pair-b,#ff7f6b) 35%,transparent)}.vt-subtoolbox-media-card-preview{min-height:calc(var(--vt-component-height)*1.05);border-right:var(--vt-component-stroke) solid #000;background:var(--pair-a,#36e0f6);place-items:center;display:grid;overflow:hidden}.vt-subtoolbox-media-card-preview img{object-fit:cover;width:100%;height:100%}.vt-subtoolbox-media-card-copy{min-width:0;padding:calc(var(--vt-component-height)*.16);align-content:center;gap:3px;display:grid}.vt-subtoolbox-media-card-copy strong{font-size:calc(var(--vt-component-font-size)*.74);text-transform:uppercase;white-space:nowrap;text-overflow:ellipsis;font-weight:1000;overflow:hidden}.vt-subtoolbox-media-card-copy small{font-size:calc(var(--vt-component-font-size)*.52);opacity:.58;font-weight:900}
.vt-subtoolbox-media-player{width:min(100%,calc(var(--vt-component-height)*8.4));border:var(--vt-component-stroke) solid #000;border-radius:var(--vt-component-radius);box-shadow:var(--vt-component-shadow-offset) var(--vt-component-shadow-offset) 0 color-mix(in srgb,var(--pair-b,#ff7f6b) 32%,transparent);background:#fff;overflow:hidden}.vt-subtoolbox-media-player-head{min-height:var(--vt-component-height);justify-content:space-between;align-items:center;gap:calc(var(--vt-component-height)*.16);padding:calc(var(--vt-component-height)*.12) calc(var(--vt-component-height)*.18);border-bottom:var(--vt-component-stroke) solid #000;background:var(--pair-a,#36e0f6);display:flex}.vt-subtoolbox-media-player-timeline{align-items:center;gap:calc(var(--vt-component-height)*.12);padding:calc(var(--vt-component-height)*.1) calc(var(--vt-component-height)*.14);border-top:var(--vt-component-stroke) solid #000;grid-template-columns:minmax(0,1fr) auto;display:grid}.vt-subtoolbox-media-player-footer{padding:calc(var(--vt-component-height)*.1) calc(var(--vt-component-height)*.14);border-top:var(--vt-component-stroke) solid #000;background:#fff;display:flex}
```

## Dialog
```css
.vt-subtoolbox-dialog-trigger,.vt-subtoolbox-drawer-trigger{width:100%;height:var(--vt-component-height);border:var(--vt-component-stroke) solid #000;border-radius:var(--vt-component-radius);background:var(--pair-a,#36e0f6);color:#000;box-shadow:var(--vt-component-shadow-offset) var(--vt-component-shadow-offset) 0 color-mix(in srgb,var(--pair-b,#ff7f6b) 38%,transparent);font:1000 calc(var(--vt-component-font-size)*.72)/1 var(--vt-studio-toolbox-font,var(--font-sans,ui-sans-serif,system-ui));text-transform:uppercase}.vt-subtoolbox-dialog-overlay,.vt-subtoolbox-drawer-overlay{z-index:2200;background:rgba(0,0,0,.44);place-items:center;padding:18px;display:grid;position:fixed;inset:0}.vt-subtoolbox-dialog{border:var(--vt-component-stroke) solid #000;border-radius:calc(var(--vt-component-radius)*1.35);width:min(520px,92vw);box-shadow:calc(var(--vt-component-shadow-offset)*1.6) calc(var(--vt-component-shadow-offset)*1.6) 0 var(--pair-a,#36e0f6);background:#fff;overflow:hidden}.vt-subtoolbox-dialog-body,.vt-subtoolbox-drawer-body{padding:calc(var(--vt-component-height)*.28);font-weight:800}
```

## Data, feedback and upload
```css
.vt-subtoolbox-tabs{grid-template-columns:repeat(var(--vt-tab-count,3),minmax(0,1fr));width:100%;height:var(--vt-component-height);border:var(--vt-component-stroke) solid #000;border-radius:var(--vt-component-radius);background:#fff;display:grid;overflow:hidden}.vt-subtoolbox-tabs button{border:0;border-right:var(--vt-component-stroke) solid #000;background:color-mix(in srgb,var(--pair-b,#ff7f6b) 22%,white);color:#000;min-width:0;font:1000 calc(var(--vt-component-font-size)*.7)/1 var(--vt-studio-toolbox-font,var(--font-sans,ui-sans-serif,system-ui));text-transform:uppercase}.vt-subtoolbox-tabs button:last-child{border-right:0}.vt-subtoolbox-tabs button.is-active{background:var(--pair-a,#36e0f6)}
.vt-subtoolbox-progress{width:100%;height:calc(var(--vt-component-height)*.42);border:var(--vt-component-stroke) solid #000;background:var(--pair-b,#ff7f6b);overflow:hidden}.vt-subtoolbox-progress.is-rounded{border-radius:999px}.vt-subtoolbox-progress.is-rect{border-radius:calc(var(--vt-component-radius)*.4)}.vt-subtoolbox-progress span{background:var(--pair-a,#36e0f6);height:100%;display:block}
.vt-subtoolbox-stat-card{border:var(--vt-component-stroke) solid #000;border-radius:var(--vt-component-radius);background:var(--pair-b,#ff7f6b);color:#000;grid-template-columns:1fr auto;gap:2px 8px;padding:8px;display:grid}.vt-subtoolbox-stat-card small{text-transform:uppercase;font-weight:1000}.vt-subtoolbox-stat-card strong{font-size:calc(var(--vt-component-font-size)*1.45);line-height:.9}.vt-subtoolbox-stat-card span{background:var(--pair-a,#36e0f6);border-radius:999px;grid-area:1/2/3;align-self:center;padding:4px;font-weight:1000}
.vt-subtoolbox-alert{min-height:var(--vt-component-height);grid-template-columns:var(--vt-component-height) minmax(0,1fr) auto;border:var(--vt-component-stroke) solid #000;border-radius:var(--vt-component-radius);color:#000;background:#fff;display:grid;overflow:hidden}.vt-subtoolbox-alert-icon{border-right:var(--vt-component-stroke) solid #000;background:var(--pair-a,#36e0f6);place-items:center;display:grid}.vt-subtoolbox-alert-copy{padding:calc(var(--vt-component-height)*.15) calc(var(--vt-component-height)*.18);align-content:center;gap:2px;display:grid}.vt-subtoolbox-alert.is-success .vt-subtoolbox-alert-icon{background:#3fee56}.vt-subtoolbox-alert.is-warning .vt-subtoolbox-alert-icon{background:#ffda47}.vt-subtoolbox-alert.is-danger .vt-subtoolbox-alert-icon{background:#fa618a}
.vt-subtoolbox-toast{min-height:var(--vt-component-height);grid-template-columns:calc(var(--vt-component-height)*.22) minmax(0,1fr) auto;border:var(--vt-component-stroke) solid #000;border-radius:var(--vt-component-radius);color:#000;box-shadow:var(--vt-component-shadow-offset) var(--vt-component-shadow-offset) 0 color-mix(in srgb,var(--pair-a,#36e0f6) 34%,transparent);background:#fff;display:grid;overflow:hidden}.vt-subtoolbox-toast-rail{background:var(--pair-a,#36e0f6)}.vt-subtoolbox-toast.is-success .vt-subtoolbox-toast-rail{background:#3fee56}.vt-subtoolbox-toast.is-warning .vt-subtoolbox-toast-rail{background:#ffda47}.vt-subtoolbox-toast.is-danger .vt-subtoolbox-toast-rail{background:#fa618a}
.vt-subtoolbox-file-target.vt-upload-tight-reveal{aspect-ratio:16/9;background:#fff;padding:0;display:flex;position:relative;overflow:hidden;min-height:var(--vt-upload-target-min-height,220px)!important}.vt-upload-tight-reveal .vt-subtoolbox-file-target-button{border-radius:calc(var(--vt-subtoolbox-inner-radius,8px) - 1px);color:#000;cursor:pointer;text-transform:uppercase;background:#fff;border:0;place-items:center;width:100%;min-height:100%;padding:0;display:grid;position:relative;overflow:hidden}.vt-upload-tight-reveal .vt-subtoolbox-file-target-icon{background:var(--vt-subtoolbox-fill,#73deff);color:#fff;width:78px;height:78px;border-radius:50%;place-items:center;display:grid}.vt-upload-tight-reveal .vt-subtoolbox-file-target-button:focus-visible{outline:3px solid var(--vt-subtoolbox-fill,#0cf);outline-offset:-6px}
```

## Exact family inventory
The canonical source contains 217 unique `vt-*` class names. The registry in §4 is the compressed family mapping; every listed child class is a real source selector. The Workbench must retain these exact names rather than translating them into generic design-system names.

## Final fidelity constraint
When a requested high-value family is not actually present in this canonical source—Video Manager, Video Details, Calendar, Data Table, Comment Thread, Kanban Board, standalone Sidebar, standalone Empty State, etc.—the Workbench must not invent a “close enough” visual and label it canonical. It must either compose source primitives or obtain the missing canonical family from the appropriate ViewTube source.
