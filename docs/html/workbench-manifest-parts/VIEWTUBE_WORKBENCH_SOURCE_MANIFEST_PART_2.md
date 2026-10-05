`.

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
.vt-subtoolbox-dialog-trigger,.vt-subtoolbox-drawer-trigger{width:100%;height:var(--vt-component-height);border:var(--vt-component-stroke) solid #000;border-radius:var(--vt-component-radius);background:var(--pair-a,#36e0f6);color:#000;box-shadow:var(--vt-component-shadow-offset) var(--vt-component-shadow-offset) 0 color-mix(in srgb,var(--pair-b,#ff7f6b) 38%,transparent);font:1000 calc(var(--vt-component-font-size)*.72)/1 var(--vt-studio-toolbox-font,var(--font-sans,ui-sans-serif,system-ui));text-transform:uppercase}.vt-subtoolbox-dialog-overlay,.vt-subtoolbox-drawer-overlay{z-index:2200;background:rgba(0,0,0,.44);place-items:center;padding:18px;display:grid;position:fixed;inset:0}.vt-subtoolbox-dialog{border:var(--vt-component-stroke) solid #000;border-radius:calc(var(--vt-component-radius)*1.35);width:min(520px,92vw);box-shadow:calc(var(--vt-component-shadow-offset)*1.6) calc(var(--vt-component-shadow-offset)*1.6) 0 var(--pair-a,#36e0f6);background:#fff;