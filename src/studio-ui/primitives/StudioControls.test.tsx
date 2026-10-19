import React from "react"
import { readFileSync } from "node:fs"
import { resolve } from "node:path"
import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it } from "vitest"
import { StudioSplitLeftButton, StudioSplitLeftDropdown, StudioDropdown, StudioSquareIconButton, StudioCircleIconButton, StudioPlayPauseButton, StudioUsernameInput, StudioTextArea, StudioTextInput, StudioSpectrumTag, StudioChoice, StudioUploadFrame, STUDIO_CONTROL_GLOBAL_RULE_EXCEPTIONS } from "./StudioControls"
import { StudioHubCompletePrimitiveCatalog } from "../../components/studio-hub/StudioHubCompletePrimitiveCatalog"
import { StudioHubConfirmedPrimitiveCatalog } from "../../components/studio-hub/StudioHubConfirmedPrimitiveCatalog"

const readStudioControlCss = () => [
  "studio-control-system.css",
  "studio-control-core.css",
  "studio-control-split.css",
  "studio-control-fields.css",
].map((file) => readFileSync(resolve(process.cwd(), "src/styles", file), "utf8")).join("\n");

const canonicalTail = (css: string) => {
  const start = css.lastIndexOf("/* Canonical Studio Controls contract");
  return start >= 0 ? css.slice(start) : css;
};


describe("canonical Studio upload frame", () => {
  it("renders the standard upload frame with accessible file input and layered pair-color anatomy", () => {
    const html = renderToStaticMarkup(<StudioUploadFrame aria-label="Upload media" />);
    expect(html).toContain('data-vt-studio-upload-frame="true"');
    expect(html).toContain('data-vt-library-component="StudioUploadFrame"');
    expect(html).toContain('data-size="standard"');
    expect(html).toContain('type="file"');
    expect(html).toContain('aria-label="Upload media"');
    expect(html).toContain('class="vt-studio-upload-frame__layers"');
    expect(html).toContain('class="vt-studio-upload-frame__layer vt-studio-upload-frame__layer--core"');
    expect(html).toContain("Drop or choose file");
    expect(html).not.toContain("FA618A");
    expect(html).not.toContain("4EE4BE");
    expect(STUDIO_CONTROL_GLOBAL_RULE_EXCEPTIONS.uploadFrame.owner).toBe("StudioUploadFrame");
    expect(STUDIO_CONTROL_GLOBAL_RULE_EXCEPTIONS.uploadFrame.colorPair).toContain("--pair-a");
  });

  it("exposes compact sizing and uses the shared primary/secondary pair rather than fixed colors", () => {
    const html = renderToStaticMarkup(<StudioUploadFrame sizeVariant="compact" accept="image/*" aria-label="Compact upload" />);
    const css = readFileSync(resolve(process.cwd(), "src/styles/studio-control-system.css"), "utf8");
    expect(html).toContain('data-size="compact"');
    expect(html).toContain('accept="image/*"');
    expect(css).toContain(".vt-studio-upload-frame");
    expect(css).toContain("var(--pair-a");
    expect(css).toContain("var(--pair-b");
    expect(css).toContain("prefers-reduced-motion: reduce");
    expect(css).toContain(".vt-studio-upload-frame.is-drag");
    expect(css).toContain(".vt-studio-upload-frame.has-img");
    expect(css).toContain(".vt-studio-upload-frame__icon::before");
    expect(css).toContain("border: 4px solid var(--vt-studio-upload-primary)");
    expect(css).toContain("border: 2px solid var(--vt-studio-upload-secondary)");
    expect(css).toContain(".vt-studio-upload-frame__inset::before");
    expect(css).toContain(".vt-studio-upload-frame__inset::after");
    expect(css).toContain("font-size: var(--vt-studio-28-font-size, 24px)");
    expect(css).toContain("font-weight: 1000");
    expect(css).toContain("letter-spacing: -.02em");
    expect(css).toContain("border-radius: 999px;");
    expect(css).toContain(".vt-studio-upload-frame__icon {");
    expect(css).toContain("overflow: visible");
    expect(css).toContain("font-size: var(--vt-studio-28-font-size, 24px)");
    expect(css).toContain(".vt-studio-upload-frame__icon::before");
    expect(css).toContain(".vt-studio-upload-frame__icon::after");
    expect(css).not.toContain(".vt-studio-upload-frame.has-img .vt-studio-upload-frame__icon {");
    const legacyCatalog = readFileSync(resolve(process.cwd(), "src/components/studio-hub/StudioHubCompletePrimitiveCatalog.tsx"), "utf8");
    expect(legacyCatalog).toContain('if (name === "Upload Frame") return');
    expect(legacyCatalog).toContain("<StudioUploadFrame");
    expect(legacyCatalog).not.toContain("SubToolboxFileTarget");
  });
});

describe("Studio radio build, orbit, and spiral motion contract", () => {
  it("renders the animated indicator inside the stationary 44px radio shell", () => {
    const html = renderToStaticMarkup(<StudioChoice kind="radio" aria-label="Animated radio" />)
    expect(html).toContain('data-radio-motion="build"')
    expect(html).toContain('data-radio-direction="on"')
    expect(html).toContain('class="vt-studio-radio-motion"')
    expect(html).toContain('class="vt-studio-radio-ring vt-studio-radio-ring-outer"')
    expect(html).toContain('class="vt-studio-radio-spiral vt-studio-radio-spiral-a"')
    expect(html).toContain('viewBox="0 0 44 44"')
    expect(html).toContain('class="vt-studio-radio-solid"')
    expect(html).not.toContain('data-radio-motion="inward"')
  })

  it("uses centered SVG attribute animation, clips motion to the control, and honors reduced motion", () => {
    const source = readFileSync(resolve(process.cwd(), "src/studio-ui/primitives/StudioControls.tsx"), "utf8")
    const css = readFileSync(resolve(process.cwd(), "src/styles/studio-control-motion.css"), "utf8")
    expect(source).toContain("requestAnimationFrame")
    expect(source).toContain("prefers-reduced-motion: reduce")
    expect(source).toContain('translate(22 22) scale(')
    expect(source).toContain('cx="22" cy="22"')
    expect(css).toContain("overflow: hidden")
    expect(css).toContain("stroke: #000")
    expect(css).toContain("paint-order: stroke fill")
    expect(css).toContain("filter: drop-shadow(0 0 1px #000)")
    expect(css).not.toContain(".vt-studio-radio-solid { opacity: 0; }")
    expect(css).not.toContain(".vt-studio-radio-rings { opacity: 0; }")
    expect(css).not.toContain(".vt-studio-radio-spirals { opacity: 0; }")
    expect(css).not.toContain("@keyframes vt-studio-radio-build")
    expect(css).not.toContain("@keyframes vt-studio-radio-orbit")
    expect(css).not.toContain("@keyframes vt-studio-radio-spiral")
  })
})


describe("Studio checkbox mark animation timing", () => {
  it("slows checkmark and x strokes by 50 percent and draws x strokes sequentially", () => {
    const css = readFileSync(resolve(process.cwd(), "src/styles/studio-control-motion.css"), "utf8")
    const controls = readFileSync(resolve(process.cwd(), "src/studio-ui/primitives/StudioControls.tsx"), "utf8")
    expect(css).toContain("stroke-dashoffset 495ms")
    expect(css).toContain("stroke 405ms")
    expect(css).toContain("opacity 360ms")
    expect(css).toContain(".vt-studio-44-choice.is-checkbox.is-xwide svg path:nth-child(2)")
    expect(css).toContain("transition-delay: 495ms")
    expect(controls).toContain('d="M 10 10 L 40 40"')
    expect(controls).toContain('d="M 40 10 L 10 40"')
  })
})

describe("Studio dropdown chevron and split-left contract", () => {
  it("renders the split-left dropdown with a leading fixed chevron rail and shared listbox behavior", () => {
    const html = renderToStaticMarkup(<StudioSplitLeftDropdown aria-label="Mode" defaultValue="balanced" sizeVariant="compact" options={[{ value: "balanced", label: "Balanced" }, { value: "fast", label: "Fast" }]} />)
    expect(html).toContain('data-vt-studio-dropdown-variant="split-left"')
    expect(html).toContain('class="vt-studio-dropdown-chevron is-leading"')
    expect(html).toContain('data-vt-studio-dropdown-chevron')
    expect(html).not.toContain('class="vt-studio-dropdown-chevron is-trailing"')
    expect(html).toContain('aria-haspopup="listbox"')
    expect(html).toContain('data-size="compact"')
  })

  it("uses a fixed trailing chevron rail and canonical size ratio for regular dropdown menus", () => {
    const html = renderToStaticMarkup(<StudioDropdown aria-label="Mode" defaultValue="balanced" options={[{ value: "balanced", label: "Balanced" }]} />)
    expect(html).toContain('class="vt-studio-dropdown-chevron is-trailing"')
    const css = readStudioControlCss()
    expect(css).toContain('--vt-studio-dropdown-rail-size: 28px')
    expect(css).toContain('--vt-studio-dropdown-chevron-size: 24px')
    expect(css).toContain('--vt-studio-dropdown-rail-size: 44px')
    expect(css).toContain('--vt-studio-dropdown-chevron-size: 38px')
    expect(css).toContain('min-height: var(--vt-studio-control-height, 44px)')
  })
})

describe("standalone Studio text fields", () => {
  it("renders the standard text input with only canonical Studio field markers", () => {
    const html = renderToStaticMarkup(<StudioTextInput aria-label="Title" placeholder="Enter title" />)
    expect(html).toContain('data-vt-studio-control="true"')
    expect(html).toContain('data-vt-studio-field-kind="text-input"')
    expect(html).toContain('data-size="standard"')
    expect(html).toContain('type="text"')
    expect(html).not.toContain("subtoolbox")
  })

  it("renders compact text input with canonical compact size", () => {
    const html = renderToStaticMarkup(<StudioTextInput sizeVariant="compact" aria-label="Compact title" />)
    expect(html).toContain('data-size="compact"')
    expect(html).toContain('data-vt-studio-field-kind="text-input"')
  })

  it("renders standard and compact text areas without SubToolbox wrappers", () => {
    const standard = renderToStaticMarkup(<StudioTextArea aria-label="Description" />)
    const compact = renderToStaticMarkup(<StudioTextArea sizeVariant="compact" aria-label="Short description" />)
    expect(standard).toContain('data-vt-studio-field-kind="textarea"')
    expect(standard).toContain('data-size="standard"')
    expect(standard).toContain('rows="4"')
    expect(standard).not.toContain("subtoolbox")
    expect(compact).toContain('data-vt-studio-field-kind="textarea"')
    expect(compact).toContain('data-size="compact"')
  })

  it("keeps the plain input free of label wrappers while textarea labels remain separate", () => {
    const standardInput = renderToStaticMarkup(<StudioTextInput aria-label="Title" />)
    const compactInput = renderToStaticMarkup(<StudioTextInput sizeVariant="compact" aria-label="Compact title" />)
    const compactArea = renderToStaticMarkup(<StudioTextArea variant="fixed-label" label="DESCRIPTION" sizeVariant="compact" aria-label="Compact description" />)
    expect(standardInput).toContain('class="vt-studio-text-input"')
    expect(standardInput).not.toContain("vt-studio-floating-field")
    expect(standardInput).not.toContain("vt-studio-fixed-field-label")
    expect(standardInput).toContain('data-size="standard"')
    expect(compactInput).toContain('data-size="compact"')
    expect(compactArea).toContain('data-vt-studio-field-kind="textarea"')
    expect(compactArea).toContain('class="vt-studio-fixed-field-label"')
    expect(compactArea).toContain('rows="4"')
  })
})

describe("global defaults govern the effective primitive CSS", () => {
  it("uses secondary color for both double-split rails and keeps rail faces square", () => {
    const css = readStudioControlCss();
    const split = css.slice(css.indexOf("/* Unified split shell."));
    expect(split).toContain('.vt-studio-split-shell[data-vt-studio-split="double"] > [data-vt-studio-split-rail]');
    expect(split).toContain("Both double-split rails use secondary by contract.");
    const doubleRails = split.match(/\.vt-studio-split-shell\[data-vt-studio-split="double"\] > \[data-vt-studio-split-rail\],\s*\.vt-studio-double-split-badge__rail\s*\{[^}]*\}/)?.[0] || "";
    expect(doubleRails).toContain("background: var(--vt-studio-control-secondary);");
    expect(doubleRails).not.toMatch(/#ff7f6b|#36e0f6/);
    expect(split).toContain("border-radius: 0;");
    expect(split).toContain("place-items: center;");
  });

  it("does not use important declarations to force canonical field type or width", () => {
    const css = readStudioControlCss();
    const fieldStart = css.indexOf('input[data-vt-studio-control="true"],');
    const fieldEnd = fieldStart >= 0 ? css.indexOf("\n}", fieldStart) : -1;
    const fields = fieldStart >= 0 && fieldEnd > fieldStart ? css.slice(fieldStart, fieldEnd) : "";
    expect(fields).not.toMatch(/font-size:[^;]*!important/);
    expect(fields).not.toMatch(/line-height:[^;]*!important/);
    expect(fields).toContain("border: 0;");
    expect(fields).toContain("-webkit-text-stroke: var(--vt-studio-control-text-stroke, 1px) var(--vt-field-primary");
  });

  it("lets compact text buttons fill their row by default while keeping icon-only faces square", () => {
    const css = readStudioControlCss();
    expect(css).toContain('[data-vt-studio-control="true"] {');
    expect(css).toContain('width: 100%;');
    expect(css).toContain('[data-vt-studio-control="true"][data-vt-studio-width="content"] {');
    expect(css).toContain('width: fit-content;');
  });
});

describe("Studio text field library entries", () => {
  it("renders the standalone Studio text input and textarea as distinct catalog specimens", () => {
    const html = renderToStaticMarkup(<StudioHubCompletePrimitiveCatalog />);
    expect(html).toContain('data-vt-library-component="StudioTextInput"');
    expect(html).toContain('data-vt-library-component="StudioTextArea"');
    expect(html).toContain('aria-label="Canonical Studio text input"');
    expect(html).toContain('aria-label="Canonical Studio text area"');
    expect(html).toContain('data-vt-studio-icon-button="true"');
    expect(html).toContain('data-icon-variant="v4"');
  });
});

describe("compact Studio button row-fill sizing", () => {
  it("fills the available row for compact text buttons while preserving square icon-only geometry", () => {
    const css = readStudioControlCss()
    expect(css).toContain('[data-vt-studio-control="true"] {')
    expect(css).toContain('width: 100%;')
    expect(css).toContain('[data-vt-studio-control="true"][data-vt-studio-width="content"] {')
    expect(css).toContain('width: fit-content;')
    expect(css).toContain('[data-vt-studio-control="true"][data-size="compact"]')
    expect(css).toContain("padding-inline: 8px;")
  })

  it("preserves explicit full-width split-left and fixed-square icon button geometry", () => {
    const css = readStudioControlCss()
    expect(css).toContain('.vt-studio-split-face[data-vt-studio-split="left"] { grid-template-columns: auto minmax(0, 1fr); }')
    expect(css).toContain('[data-vt-studio-control="true"] [data-vt-studio-split-rail]')
    expect(css).toContain('aspect-ratio: 1 / 1;')
    expect(css).toContain('width: fit-content;')
  })
})

describe("confirmed square icon button library entry", () => {
  it("registers the actual production square icon primitive with standard, compact, color, selected, and disabled specimens", () => {
    const html = renderToStaticMarkup(<StudioHubConfirmedPrimitiveCatalog />)
    expect(html).toContain("Square Icon Button")
    expect(html).toContain('data-vt-library-component="StudioSquareIconButton"')
    expect(html).toContain('data-icon-variant="v1"')
    expect(html).toContain('data-icon-variant="v2"')
    expect(html).toContain('data-icon-variant="v3"')
    expect(html).toContain('data-icon-variant="v4"')
    expect(html).toContain('data-size="standard"')
    expect(html).toContain('data-size="compact"')
    expect(html).toContain('aria-label="Disabled square icon button"')
    expect(html).toContain('disabled=""')
  })
})
describe("canonical Studio field, selection, and action contracts", () => {
  it("keeps default and placeholder field typography primary and identical", () => {
    const css = readStudioControlCss()
    expect(css).toContain("color: var(--vt-field-primary);")
    expect(css).toContain("-webkit-text-fill-color: var(--vt-field-primary);")
    expect(css).toContain("-webkit-text-stroke: var(--vt-studio-control-text-stroke, 1px) var(--vt-field-primary);")
    expect(css).not.toContain("-webkit-text-stroke: 0 !important")
    expect(css).toContain("font-size: var(--vt-studio-textarea-standard-font-size, 18px);")
    expect(css).toContain("font-size: var(--vt-studio-textarea-compact-font-size, 14px);")
  })

  it("uses the supplied 44px control geometry and explicit indicator colors", () => {
    const css = readStudioControlCss()
    const contract = canonicalTail(css)
    expect(contract).toContain("width: 75.68px")
    expect(contract).toContain("width: 36.667px")
    expect(contract).toContain("transform: translateX(31.68px)")
    expect(contract).toContain(".vt-studio-44-choice.is-checkbox.is-black-indicator svg")
    expect(contract).toContain(".vt-studio-44-choice.is-checkbox.is-white-indicator svg")
    expect(contract).toContain(".vt-studio-44-choice.is-checkbox.is-color-swap.is-on svg")
    expect(contract).toContain(".vt-studio-44-switch.is-black-indicator.is-on")
    expect(contract).toContain(".vt-studio-44-choice.is-white-indicator.is-on")
  })

  it("keeps the split-left primitive catalog aligned with the button face layer", () => {
    const catalogCss = readFileSync(resolve(process.cwd(), "src/components/studio-hub/studio-hub-primitive-catalogs.css"), "utf8")
    expect(catalogCss).toContain('.vt-complete-catalog .vt-catalog-split-primitive[data-vt-studio-button="true"] > [data-vt-studio-button-face]')
    expect(catalogCss).toContain("grid-template-columns: var(--h) minmax(0, 1fr) !important")
    expect(catalogCss).toContain("width: 100% !important")
  })

  it("keeps fixed label boxes on the secondary pair and canonical controls flat", () => {
    const css = readStudioControlCss()
    const controls = readFileSync(resolve(process.cwd(), "src/studio-ui/primitives/StudioControls.tsx"), "utf8")
    expect(css).toContain("background: var(--vt-studio-control-secondary, var(--pair-b, #ff7f6b))")
    expect(css).not.toContain('.vt-studio-fixed-label-field:focus-within > .vt-studio-fixed-field-label')
    expect(css).toContain('.vt-studio-floating-field[data-vt-floating-variant="b"] > :is(input, textarea)[data-size="compact"]:is(:focus, :focus-visible) + .vt-studio-floating-field-label')
    expect(css).toContain('--vt-studio-fixed-label-height: 20px;')
    expect(css).toContain('--vt-studio-fixed-label-font-size: 14px;')
    expect(css).toContain('--vt-studio-fixed-label-height: 14px;')
    expect(css).toContain('--vt-studio-fixed-label-font-size: 9px;')
    expect(css).toContain('letter-spacing: .055em;')
    expect(css).not.toContain('--vt-studio-control-shadow-x:1.5px;')
    expect(css).not.toContain('--vt-studio-control-shadow-y:1.5px;')
    expect(css).not.toContain('button[data-vt-studio-button="true"][data-selected="true"], button[data-vt-studio-button="true"][aria-pressed="true"] { --vt-studio-control-shadow-color:')
    expect(css).toContain("box-shadow: none !important;")
    expect(css).toContain("width: 100%;")
    expect(css).toContain("height: 100%;")
    expect(css).toContain("letter-spacing: -.02em;")
    expect(controls).toContain('letterSpacing: "-0.02em"')
  })


  it("keeps canonical Studio button shells stationary without shadow or press-motion tokens", () => {
    const css = readStudioControlCss()
    const contract = canonicalTail(css)
    expect(contract).not.toContain("--vt-studio-motion-button")
    expect(contract).not.toContain("--vt-studio-motion-press")
    expect(contract).not.toContain('button[data-vt-studio-button="true"]::before {')
    expect(contract).not.toContain("transform:translate(var(--vt-studio-control-shadow-x")
    expect(contract).not.toContain("transition-duration:var(--vt-studio-motion-press")
    expect(contract).toContain('button[data-vt-studio-button="true"][data-split-left="true"] [data-vt-studio-split-rail]')
    expect(contract).not.toContain("transition-duration:300ms")
  })


  it("keeps SubToolbox button state feedback stationary and excludes menu triggers", () => {
    const css = readFileSync(resolve(process.cwd(), "src/styles/subtoolbox-system.css"), "utf8")
    expect(css).toContain("--vt-subtoolbox-motion-button:180ms")
    expect(css).toContain("--vt-subtoolbox-motion-press:80ms")
    expect(css).toContain(".vt-subtoolbox-button:active:not(:disabled)")
    expect(css).toContain("box-shadow:none")
    expect(css).not.toContain("translate(var(--vt-subtoolbox-inner-shadow")
    expect(css).toContain(".vt-subtoolbox-split-action:active:not(:disabled)")
    expect(css).toContain(".vt-subtoolbox-icon-button:active:not(:disabled)")
    expect(css).toContain(".vt-subtoolbox-media-control:active:not(:disabled)")
    expect(css).toContain("transition-duration:var(--vt-subtoolbox-motion-press,80ms)")
    expect(css).not.toContain("translate(var(--vt-subtoolbox-shadow-offset")
    expect(css).toContain("@media (prefers-reduced-motion: reduce)")
    expect(readStudioControlCss()).toContain(".vt-studio-legend-trigger:active")
  })
})

describe("Studio primitive catalog control layout", () => {
  it("puts standard word toggles one per row and centers three compact word-toggle skins", () => {
    const html = renderToStaticMarkup(<StudioHubCompletePrimitiveCatalog />)
    expect(html).toContain('class="vt-catalog-control-variants is-word-toggle-44"')
    expect(html).toContain('class="vt-catalog-control-variants is-word-toggle-28"')
    expect(html).toContain('class="vt-catalog-control-row vt-catalog-word-toggle-row is-word-toggle-44"')
    expect(html).toContain('class="vt-catalog-control-row vt-catalog-word-toggle-row is-word-toggle-28"')
  })
})


describe("Studio text-field module ownership and typography", () => {
  it("exports the plain input and keeps label treatment out of its primitive module", async () => {
    const inputModule = await import("./StudioTextInput")
    const areaModule = await import("./StudioTextArea")
    const html = renderToStaticMarkup(<StudioTextInput aria-label="Title" />)
    const inputSource = readFileSync(resolve(process.cwd(), "src/studio-ui/primitives/StudioTextInput.tsx"), "utf8")
    expect(inputModule.StudioTextInput).toBeDefined()
    expect(areaModule.StudioTextArea).toBeDefined()
    expect(html).toContain('class="vt-studio-text-input"')
    expect(html).not.toContain("vt-studio-floating-field")
    expect(inputSource).not.toContain("studio-control-entry.css")
    expect(inputSource).not.toContain("floating-label")
    expect(renderToStaticMarkup(<StudioTextArea variant="floating-label" label="Description" />)).toContain("vt-studio-floating-field")
  })

  it("uses literal 38px/24px/10px input sizes and separate 18px/14px textarea typography", () => {
    const inputCss = readFileSync(resolve(process.cwd(), "src/styles/studio-text-input.css"), "utf8")
    const css = readStudioControlCss()
    expect(inputCss).toContain("font-size: 38px;")
    expect(inputCss).toContain("font-size: 24px;")
    expect(inputCss).toContain("font-size: 10px;")
    expect(inputCss).toContain("--vt-studio-input-height: var(--vt-studio-standard-height, 44px)")
    expect(inputCss).toContain("--vt-studio-input-height: var(--vt-studio-compact-height, 28px)")
    expect(inputCss).toContain("--vt-studio-input-height: var(--vt-studio-micro-height, 14px)")
    expect(css).toContain("--vt-studio-textarea-standard-font-size: 18px")
    expect(css).toContain("--vt-studio-textarea-compact-font-size: 14px")
    expect(css).toContain("font-size: var(--vt-studio-textarea-standard-font-size, 18px);")
    expect(css).toContain("font-size: var(--vt-studio-textarea-compact-font-size, 14px);")
  })
})


describe("canonical square icon button family", () => {
  it("renders all four icon color variants at standard and compact square sizes", () => {
    const standard = renderToStaticMarkup(
      <>
        <StudioSquareIconButton icon={<span>ICON</span>} label="Default" />
        <StudioSquareIconButton icon={<span>ICON</span>} label="Secondary" variant="v2" />
        <StudioSquareIconButton icon={<span>ICON</span>} label="Selectable" variant="v3" />
        <StudioSquareIconButton icon={<span>ICON</span>} label="Black" variant="v4" />
      </>,
    )
    const compact = renderToStaticMarkup(
      <StudioSquareIconButton icon={<span>ICON</span>} label="Compact" sizeVariant="compact" />,
    )
    expect(standard.match(/data-vt-studio-icon-button="true"/g)).toHaveLength(4)
    expect(standard).toContain('data-icon-variant="v1"')
    expect(standard).toContain('data-icon-variant="v2"')
    expect(standard).toContain('data-icon-variant="v3"')
    expect(standard).toContain('data-icon-variant="v4"')
    expect(standard).toContain('aria-pressed="false"')
    expect(renderToStaticMarkup(<StudioSquareIconButton icon={<span>ICON</span>} label="Selected" variant="v3" selected />)).toContain('aria-pressed="true"')
    expect(standard).toContain('data-size="standard"')
    expect(standard).toContain('data-height-variant="44"')
    expect(compact).toContain('data-size="compact"')
    expect(compact).toContain('data-height-variant="28"')
    expect(compact).toContain('data-icon-variant="v1"')
  })

  it("defines opposite fill/shadow pairs, selectable inversion, and the black/primary-icon variant", () => {
    const css = readStudioControlCss()
    expect(css).toContain('button[data-vt-studio-icon-button="true"][data-icon-variant="v2"]')
    expect(css).toContain('button[data-vt-studio-icon-button="true"][data-icon-variant="v3"][aria-pressed="true"]')
    expect(css).toContain('button[data-vt-studio-icon-button="true"][data-icon-variant="v4"]')
    expect(css).toContain('background: #000;')
    expect(css).toContain('color: var(--vt-studio-control-accent, var(--pair-a, #36e0f6));')
  })
})


describe("shared Studio icon-size comparison contract", () => {
  it("supports all three icon sizes on both production primitives without changing button dimensions", () => {
    const html = renderToStaticMarkup(
      <>
        <StudioSquareIconButton icon={<span>ICON</span>} label="Current" iconSizeVariant="current" />
        <StudioSquareIconButton icon={<span>ICON</span>} label="Moderate" iconSizeVariant="moderate" />
        <StudioSquareIconButton icon={<span>ICON</span>} label="Large" iconSizeVariant="large" sizeVariant="compact" />
        <StudioSplitLeftButton icon={<span>ICON</span>} iconSizeVariant="moderate">Moderate split</StudioSplitLeftButton>
        <StudioSplitLeftButton icon={<span>ICON</span>} iconSizeVariant="large" heightVariant="28">Large compact split</StudioSplitLeftButton>
      </>,
    )
    expect(html.match(/data-icon-size-variant="current"/g)).toHaveLength(1)
    expect(html.match(/data-icon-size-variant="moderate"/g)).toHaveLength(2)
    expect(html.match(/data-icon-size-variant="large"/g)).toHaveLength(2)
  })

  it("defaults square and split-left controls to the large 38px/24px preset", () => {
    const html = renderToStaticMarkup(
      <>
        <StudioSquareIconButton icon={<span>ICON</span>} label="Default square" />
        <StudioSplitLeftButton icon={<span>ICON</span>}>Default split</StudioSplitLeftButton>
      </>,
    )
    expect(html.match(/data-icon-size-variant="large"/g)).toHaveLength(2)
  })

  it("defines the requested icon dimensions while preserving standard and compact border geometry", () => {
    const css = readStudioControlCss()
    expect(css).toContain('data-icon-size-variant="moderate"][data-size="standard"] { --vt-studio-control-icon-size:34px')
    expect(css).toContain('data-icon-size-variant="moderate"][data-size="compact"] { --vt-studio-control-icon-size:22px')
    expect(css).toContain('data-icon-size-variant="large"][data-size="standard"] { --vt-studio-control-icon-size:38px; --vt-studio-control-icon-stroke:1.9;')
    expect(css).toContain('data-icon-size-variant="large"][data-size="compact"] { --vt-studio-control-icon-size:24px; --vt-studio-control-icon-stroke:2.0;')
    expect(css).toContain('--vt-studio-control-stroke:3px')
    expect(css).toContain('--vt-studio-control-stroke:2px')
  })

  it("shows production specimens without icon-size testing components and labels real states", () => {
    const html = renderToStaticMarkup(<StudioHubConfirmedPrimitiveCatalog />)
    for (const label of [
      "Square icon button V1 primary fill",
      "Compact square icon button V1",
      "44px standard · default",
      "28px compact · neutral tone",
      "44px standard · selected",
      "28px compact · selected + disabled",
      "28px compact · disabled",
      "NOTIFICATION BADGE · STATIC PREVIEW",
      "SUCCESS STATE · STATIC PREVIEW",
      "44px standard · selected values · multiselect trigger",
    ]) {
      expect(html).toContain(label)
    }
    for (const label of ["Current · 28px", "Moderate · 34px", "Large · 38px", "Current · 18px", "Moderate · 22px", "Large · 24px"]) {
      expect(html).not.toContain(label)
    }
    expect(html).toContain('data-vt-library-component="StudioSquareIconButton"')
    expect(html).toContain('data-vt-library-component="StudioSplitLeftButton"')
    expect(html).toContain("default large icon preset")
  })
})

describe("tactile button press accessibility and exclusion contract", () => {
  it("keeps keyboard focus visible and prevents disabled controls from depressing", () => {
    const css = readStudioControlCss()
    expect(css).toContain('button[data-vt-studio-button="true"]:focus-visible { outline:3px solid')
    expect(css).toContain('button[data-vt-studio-button="true"]:disabled { cursor:not-allowed; opacity:.5; transform:none; }')
    expect(css).toContain('button[data-vt-studio-control="true"][data-vt-studio-action-button="true"]:disabled { cursor: not-allowed; opacity: .5; transform: none; }')
    expect(css).toContain('button[data-vt-studio-button="true"]:active:not(:disabled)')
    expect(css).toContain('transform: none !important;')
    expect(css).toContain('@media (prefers-reduced-motion:reduce)')
    expect(css).toContain('transition: none !important;')
  })

  it("keeps dropdown triggers and options outside the extruded-button press selectors", () => {
    const css = readStudioControlCss()
    expect(css).toContain('.vt-studio-dropdown button[data-dropdown-trigger="true"]')
    expect(css).toContain('.vt-studio-dropdown-option:focus-visible')
    expect(css).toContain('.vt-studio-dropdown-menu')
    expect(css).not.toContain('.vt-studio-dropdown-option:active')
    expect(css).not.toContain('button[data-dropdown-trigger="true"]:active')
    // Menu panels may own a stationary shadow; trigger and option buttons do not
    // receive the data-vt-studio-button marker used by the tactile press model.
    expect(css).toContain('button[data-vt-studio-button="true"]:active:not(:disabled)')
    expect(css).toContain('transform: none !important;')
  })

  it("keeps standard/compact icon metrics tokenized without displacement or shadow offsets", () => {
    const css = readStudioControlCss()
    expect(css).not.toContain("--vt-studio-control-shadow-x")
    expect(css).not.toContain("--vt-studio-control-shadow-y")
    expect(css).toContain('--vt-studio-control-icon-size:38px; --vt-studio-control-icon-stroke:1.9;')
    expect(css).toContain('--vt-studio-control-icon-size:24px; --vt-studio-control-icon-stroke:2.0;')
    expect(css).toContain('button[data-vt-studio-icon-button="true"][data-icon-variant="v2"]')
    expect(css).toContain('button[data-vt-studio-icon-button="true"][data-icon-variant="v3"][aria-pressed="true"]')
    expect(css).toContain('button[data-vt-studio-icon-button="true"][data-icon-variant="v4"]')
  })

  it("preserves SubToolbox disabled, menu, and reduced-motion boundaries", () => {
    const css = readFileSync(resolve(process.cwd(), "src/styles/subtoolbox-system.css"), "utf8")
    expect(css).toContain('.vt-subtoolbox-button:active:not(:disabled)')
    expect(css).toContain('.vt-subtoolbox-split-action:active:not(:disabled)')
    expect(css).toContain('.vt-subtoolbox-icon-button:active:not(:disabled)')
    expect(css).toContain('.vt-subtoolbox-media-control:active:not(:disabled)')
    expect(css).toMatch(/dropdown\/menu\s+triggers intentionally remain stationary and shadow-free/)
    expect(css).toContain('@media (prefers-reduced-motion: reduce)')
    expect(css).toContain('.vt-subtoolbox-button,')
    expect(css).toContain('transition:none !important')
  })
})


describe("SubToolbox grid button width ownership", () => {
  it("lets grid cells control component-level button width instead of global intrinsic sizing", () => {
    const css = readFileSync(resolve(process.cwd(), "src/styles/subtoolbox-system.css"), "utf8")
    expect(css).toContain('.vt-subtoolbox-button.has-component-level{')
    expect(css).toContain('.vt-subtoolbox-grid > .vt-subtoolbox-button.has-component-level {')
    expect(css).toContain('width: 100% !important;')
    expect(css).toContain('justify-self: stretch;')
    expect(css).toContain('.vt-subtoolbox-grid.is-compact{grid-template-columns:repeat(auto-fit,minmax(min(100%,112px),1fr))}')
    expect(css).toContain('.vt-subtoolbox-grid.is-wide{grid-template-columns:repeat(auto-fit,minmax(min(100%,220px),1fr))}')
  })
})


describe("documented global-rule exception: Vault Spectrum Tags", () => {
  it("renders the donor-exact monochromatic tag as a named Studio exception", () => {
    const html = renderToStaticMarkup(<StudioSpectrumTag label="camera" selected />)
    expect(html).toContain('class="vt-studio-spectrum-tag is-selected"')
    expect(html).toContain('data-vt-studio-exception="vault-spectrum-tag"')
    expect(html).toContain('data-tag="CAMERA"')
    expect(html).toContain('aria-pressed="true"')
    expect(html).toContain("CAMERA")
  })

  it("keeps the exact Vault chip geometry and palette rules in the exception registry", () => {
    const exception = STUDIO_CONTROL_GLOBAL_RULE_EXCEPTIONS.vaultSpectrumTag
    expect(exception.globalRuleException).toBe(true)
    expect(exception.height).toBe(15)
    expect(exception.borderWidth).toBe(2)
    expect(exception.radius).toBe(4)
    expect(exception.fontSize).toBe(8)
    expect(exception.fontWeight).toBe(900)
    expect(exception.letterSpacing).toBe("0.3px")
    expect(exception.colorResolver).toBe("getAlphabeticalSpectrumColor")
    const css = readStudioControlCss()
    expect(css).toContain(".vt-studio-spectrum-tag {")
    expect(css).toContain("height: 15px;")
    expect(css).toContain("border: 2px solid var(--vt-spectrum-tag-color);")
    expect(css).toContain("font-size: 8px;")
    expect(css).toContain("color-mix(in srgb, var(--vt-spectrum-tag-color) 35%, white)")
  })

  it("uses the canonical Studio Spectrum Tag in Vault assets instead of duplicating its color and chip geometry", () => {
    const vault = readFileSync(resolve(process.cwd(), "src/components/subtoolbox/VaultAssetModule.tsx"), "utf8")
    expect(vault).toContain('import { StudioSpectrumTag } from "../../studio-ui/primitives/StudioControls"')
    expect(vault).toContain("<StudioSpectrumTag")
    expect(vault).not.toContain("getAlphabeticalSpectrumColor(normalized)")
    const vaultCss = readFileSync(resolve(process.cwd(), "src/styles/vault-asset-module.css"), "utf8")
    expect(vaultCss).not.toContain(".vt-vault-tag-badge{")
  })
})


describe("Studio Play/Pause Split-Left Button", () => {
  it("reserves both labels so toggling does not change the label region width", () => {
    const html = renderToStaticMarkup(<StudioPlayPauseButton playLabel="Play" pauseLabel="Pause" />)
    expect(html).toContain('data-vt-studio-play-pause="true"')
    expect(html).toContain('aria-pressed="false"')
    expect(html).toContain('data-vt-studio-play-pause-measure="play"')
    expect(html).toContain('data-vt-studio-play-pause-measure="pause"')
    expect(html).toContain('data-vt-studio-play-pause-label="true">Play</span>')
    const selected = renderToStaticMarkup(<StudioPlayPauseButton playing playLabel="Play" pauseLabel="Pause" />)
    expect(selected).toContain('aria-pressed="true"')
    expect(selected).toContain('data-vt-studio-play-pause-label="true">Pause</span>')
    expect(selected).toContain('data-size="standard"')
    expect(renderToStaticMarkup(<StudioPlayPauseButton sizeVariant="compact" />)).toContain('data-size="compact"')
  })
})

describe("floating label geometry and circular icon scale", () => {
  it("floats labels at 80% scale with the border crossing the 40% height line", () => {
    const css = readStudioControlCss()
    expect(css).toContain("transform: translateY(-40%)")
    expect(css).not.toContain("transform 180ms ease-out, font-size 180ms ease-out")
    expect(css).toContain("font-size: calc(var(--vt-studio-floating-label-size) * .8)")
    expect(css).toContain("font-size: var(--vt-studio-floating-label-size)")
    expect(css).toContain("padding: 2.25px 4.5px;")
  })

  it("matches the floating-label secondary focus stroke width and color to the compact focus outline", () => {
    const css = readStudioControlCss()
    expect(css).toContain('outline: var(--vt-studio-control-focus-outline-width, 2px) solid var(--vt-studio-control-secondary, var(--pair-b, #ff7f6b))')
    expect(css).toContain('outline-width: var(--vt-studio-control-focus-outline-width, 2px)')
  })

  it("scales circle-button SVG icons to 80% without changing the canonical button size", () => {
    const css = readStudioControlCss()
    expect(css).toContain('button[data-vt-studio-circle-icon-button="true"] [data-vt-square-icon-current] svg')
    expect(css).toContain("width: calc(var(--vt-studio-control-icon-size, 28px) * .8)")
    expect(css).toContain("height: calc(var(--vt-studio-control-icon-size, 28px) * .8)")
    expect(css).toContain("--vt-studio-control-icon-size: 38px")
    expect(css).toContain("--vt-studio-control-icon-size: 24px")
  })
})

describe("Studio Circle Icon Button", () => {
  it("reuses the canonical icon button contract and marks the circular shape explicitly", () => {
    const html = renderToStaticMarkup(<StudioCircleIconButton icon={<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8" /></svg>} label="Profile" variant="v3" />)
    expect(html).toContain('data-vt-studio-circle-icon-button="true"')
    expect(html).toContain('data-vt-studio-icon-button="true"')
    expect(html).toContain('data-icon-variant="v3"')
    expect(html).toContain('aria-label="Profile"')
    expect(renderToStaticMarkup(<StudioCircleIconButton icon={<span>U</span>} label="Compact profile" sizeVariant="compact" />)).toContain('data-size="compact"')
  })
})

describe("Studio Username Split-Left Input", () => {
  it("composes the canonical Studio text input with a split icon rail", () => {
    const html = renderToStaticMarkup(<StudioUsernameInput icon={<svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4" /></svg>} aria-label="Username" placeholder="Username" />)
    expect(html).toContain('data-vt-studio-username-input="true"')
    expect(html).toContain('data-vt-studio-username-rail="true"')
    expect(html).toContain('data-icon-size-variant="large"')
    expect(html).toContain('data-vt-studio-field-kind="text-input"')
    expect(html).toContain('aria-label="Username"')
    expect(html).not.toContain('data-vt-studio-button="true"')
    expect(renderToStaticMarkup(<StudioUsernameInput icon={<span>U</span>} sizeVariant="compact" aria-label="Compact username" />)).toContain('data-size="compact"')
  })

  it("uses the primary inline stroke at the selected border width without important overrides", () => {
    const css = readStudioControlCss()
    const start = css.indexOf('.vt-studio-username-input input.vt-studio-username-input__input[data-vt-studio-control="true"] {')
    const end = css.indexOf('.vt-studio-username-input[data-disabled="true"]', start)
    const fieldRules = css.slice(start, end)
    expect(fieldRules).toContain("-webkit-text-stroke: var(--vt-studio-control-text-stroke, 1px) var(--vt-field-primary)")
    expect(fieldRules).toContain("-webkit-text-stroke: var(--vt-studio-control-text-stroke, 1px) #000")
    expect(fieldRules).toContain("-webkit-text-stroke: var(--vt-studio-control-text-stroke, 1px) #8b8b8b")
    expect(fieldRules).not.toContain("!important")
  })

  it("keeps the composite outline and inset strokes on the wrapper without a button shadow or seam", () => {
    const css = readStudioControlCss()
    expect(css).toContain('.vt-studio-username-input:focus-within')
    expect(css).not.toContain('inset 0 var(--vt-studio-control-stroke) 0 0 var(--vt-field-primary)')
    expect(css).not.toContain('inset calc(0px - var(--vt-studio-control-stroke)) 0 0 0 var(--vt-field-primary)')
    expect(css).toContain('input.vt-studio-username-input__input[data-vt-studio-control="true"]:is(:focus, :focus-visible)')
    expect(css).toContain('box-shadow: none !important;')
    expect(css).toContain('button[data-vt-studio-circle-icon-button="true"] > [data-vt-studio-button-face]')
    expect(css).toContain('.vt-studio-username-input[data-size="standard"] {\n  --vt-studio-control-icon-size: 38px;\n  --vt-studio-control-icon-stroke: 1.9;')
    expect(css).toContain('.vt-studio-username-input[data-size="compact"] {\n  --vt-studio-control-icon-size: 24px;\n  --vt-studio-control-icon-stroke: 2;')
  })
})


describe("confirmed Studio primitive catalog ownership", () => {
  it("registers the simple dropdown and split stepper from the canonical Studio Controls module", () => {
    const catalog = readFileSync(resolve(process.cwd(), "src/components/studio-hub/StudioHubConfirmedPrimitiveCatalog.tsx"), "utf8")
    const controls = readFileSync(resolve(process.cwd(), "src/studio-ui/primitives/StudioControls.tsx"), "utf8")
    const publicApi = readFileSync(resolve(process.cwd(), "src/studio-ui/index.ts"), "utf8")
    expect(catalog).toContain('import {')
    expect(catalog).toContain('StudioSplitStepper')
    expect(catalog).not.toContain('SubToolboxSplitStepper')
    expect(catalog).toContain('primitive="StudioSplitStepper"')
    expect(catalog).toContain('tsx="src/studio-ui/primitives/StudioControls.tsx"')
    expect(catalog).toContain('primitive="StudioSimpleDropdown" tsx="src/studio-ui/primitives/StudioControls.tsx"')
    expect(catalog).toContain('data-vt-library-component="StudioSplitStepper"')
    expect(controls).toContain("export const StudioSplitStepper")
    expect(controls).toContain("export const StudioSimpleDropdown")
    expect(publicApi).toContain("StudioSplitStepper")
    expect(publicApi).toContain("StudioSimpleDropdown")
  })
})


describe("canonical Studio dropdown menu visual contract", () => {
  it("keeps the multi-select panel primary-filled with white rows and secondary selected rows", () => {
    const css = readStudioControlCss()
    const optionStart = css.indexOf(".vt-studio-legend-option {")
    const optionEnd = css.indexOf("}", optionStart)
    const optionBlock = css.slice(optionStart, optionEnd)
    expect(css).toContain(".vt-studio-legend-menu")
    expect(optionBlock).toContain("background: #fff; color: #000;")
    expect(css).toContain('.vt-studio-legend-option[data-selected="true"] {')
    expect(css).toContain("background: var(--vt-legend-b);")
    expect(css).toContain("color-mix(in srgb, var(--vt-legend-b) 22%, #fff)")
    expect(css).toContain('.vt-studio-dropdown-option[data-selected="true"]')
    expect(css).toContain("background: var(--vt-studio-control-secondary, var(--pair-b, #ff7f6b));")
  })
})

describe("Studio Controls owns dropdown and stepper implementations", () => {
  it("keeps the simple dropdown and both stepper variants inside the canonical StudioControls module", async () => {
    const controls = readFileSync(resolve(process.cwd(), "src/studio-ui/primitives/StudioControls.tsx"), "utf8")
    const css = readStudioControlCss()
    expect(controls).toContain("export const StudioSimpleDropdown")
    expect(controls).toContain("export const StudioSplitStepper")
    expect(controls).toContain("export const StudioInlineStepper")
    expect(controls).toContain("export const StudioDropdown")
    expect(controls).toContain("export const StudioLegendMultiDropdown")
    expect(controls).not.toContain('from "./StudioSimpleDropdown"')
    expect(controls).not.toContain('from "./StudioSplitStepper"')
    expect(controls).not.toContain('from "./StudioInlineStepper"')
    expect(css).toContain(".vt-studio-split-stepper")
    expect(css).toContain(".vt-studio-inline-stepper")
  })

  it("uses the canonical compact square-button size for tag editor actions", () => {
    const controls = readFileSync(resolve(process.cwd(), "src/studio-ui/primitives/StudioControls.tsx"), "utf8")
    const css = readStudioControlCss()
    expect(controls).toContain('data-size="compact" data-vt-studio-tag-editor-action="true"')
    expect(css).toContain(".vt-studio-tag-editor__square-action[data-size=\"compact\"]")
    expect(css).toContain("width: 28px")
    const actionBlock = css.slice(css.indexOf(".vt-studio-tag-editor__square-action {"), css.indexOf("\n}", css.indexOf(".vt-studio-tag-editor__square-action {")) + 2)
    expect(actionBlock).not.toContain("32px")
    expect(actionBlock).not.toContain("box-shadow: 1.5px 1.5px 0 0")
    expect(actionBlock).not.toContain("4px 4px 0 0")
  })
})


describe("Studio text input and split-left badge typography parity", () => {
  it("uses the isolated plain input typography and excludes catalog demo overrides", () => {
    const css = readStudioControlCss()
    const inputCss = readFileSync(resolve(process.cwd(), "src/styles/studio-text-input.css"), "utf8")
    const catalogCss = readFileSync(resolve(process.cwd(), "src/components/studio-hub/studio-hub-primitive-catalogs.css"), "utf8")
    const input = readFileSync(resolve(process.cwd(), "src/studio-ui/primitives/StudioTextInput.tsx"), "utf8")
    expect(input).toContain('className={["vt-studio-text-input", className]')
    expect(input).toContain('import "../../styles/studio-control-entry.css"')
    expect(input).toContain('variant: "floating-label"')
    expect(input).toContain('variant: "fixed-label"')
    expect(inputCss).toContain("font-size: var(--vt-studio-standard-font-size, 38px);")
    expect(inputCss).toContain("font-size: var(--vt-studio-compact-font-size, 24px);")
    expect(inputCss).toContain("font-size: var(--vt-studio-micro-font-size, 10px);")
    expect(inputCss).toContain('input.vt-studio-text-input[data-size="compact"]')
    expect(css).toContain("font-size: calc(var(--vt-studio-floating-label-size) * .8)")
    expect(catalogCss).toContain('.vt-complete-catalog .vt-catalog-field:not([data-vt-studio-control="true"])')
    expect(catalogCss).not.toMatch(/\.vt-complete-catalog \.vt-catalog-field\s*\{\s*--field-accent:var\(--pair-a\)/)
    expect(catalogCss).not.toMatch(/\.vt-complete-catalog \.vt-catalog-field:focus\s*\{\s*background:#fff/)
    expect(catalogCss).toContain(".vt-confirmed-split-left-badge-family > span:not(.vt-studio-split-left-badge)")
    expect(catalogCss).not.toContain(".vt-confirmed-split-left-badge-family > span {")
    expect(catalogCss).toContain('.vt-confirmed-variant > span:not([data-vt-studio-control="true"])')
    expect(catalogCss).not.toContain(".vt-confirmed-variant > span {")
  })

  it("uses one shared split-label primitive and typography inherited from its size owner", () => {
    const controls = readFileSync(resolve(process.cwd(), "src/studio-ui/primitives/StudioControls.tsx"), "utf8")
    const css = readStudioControlCss()
    expect(controls).toContain("const StudioSplitShell: React.FC<StudioSplitShellProps>")
    expect(controls).toContain("<StudioSplitShell layout=\"left\" sizeVariant={sizeVariant} iconLeft={icon} faceOnly>")
    expect(controls).toContain("<StudioSplitShell layout={layout} sizeVariant={sizeVariant}")
    expect(css).toContain("[data-vt-studio-split-label]")
    expect(css).toContain("font-size: var(--vt-studio-control-font-size, 38px)")
    const badgeRule = css.slice(css.indexOf(".vt-studio-split-left-badge,"))
    expect(badgeRule).toContain("font-size: var(--vt-studio-control-font-size, 38px)")
    expect(badgeRule).toContain("font-weight: var(--vt-studio-control-font-weight, 1000)")
    expect(badgeRule).toContain("-webkit-text-stroke: var(--vt-studio-control-text-stroke, 1px) currentColor")
  })
})
