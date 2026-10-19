import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"
import test from "node:test"

const globalCss = await readFile(new URL("../../src/index.css", import.meta.url), "utf8")
const studioCss = await readFile(new URL("../../src/styles/studio-control-system.css", import.meta.url), "utf8")

test("global field normalization excludes canonical Studio fields in every state", () => {
  const globalFieldBlock = globalCss.slice(
    globalCss.indexOf("/* Global field normalization"),
    globalCss.indexOf("/* Chart interior hard isolation"),
  )
  assert.match(globalFieldBlock, /:not\(\[data-vt-studio-control="true"\]\)/)
  assert.match(globalFieldBlock, /:focus/)
  assert.match(globalFieldBlock, /::placeholder/)
})

test("Studio fields own their fill, caret, border, inset stroke, and secondary focus treatment", () => {
  const fieldBlock = studioCss.slice(
    studioCss.indexOf("/* Canonical text-entry family"),
    studioCss.indexOf("/* 2. Canonical 44px selection-control geometry"),
  )
  assert.match(fieldBlock, /border:\s*var\(--vt-field-stroke\) solid #000/)
  assert.match(fieldBlock, /caret-color:\s*var\(--vt-field-primary\)/)
  assert.match(fieldBlock, /background:\s*color-mix\(in srgb, var\(--vt-field-primary\) var\(--vt-studio-control-default-fill-opacity\), transparent\)/)
  assert.match(fieldBlock, /outline:\s*var\(--vt-field-outline-stroke\) solid var\(--vt-field-secondary\)/)
  assert.match(fieldBlock, /inset 0 0 0 var\(--vt-field-stroke\) var\(--vt-field-primary\)/)
  assert.match(fieldBlock, /min-height:\s*var\(--vt-studio-44-height\)/)
  assert.match(fieldBlock, /min-height:\s*var\(--vt-studio-28-height\)/)
})

test("rounded switches and choice controls are excluded from generic button appearance", () => {
  const genericButtonRule = studioCss.slice(
    studioCss.indexOf("button[data-vt-studio-control]:not(.vt-studio-legend-trigger)"),
    studioCss.indexOf("[data-vt-studio-button-icon]"),
  )
  assert.match(genericButtonRule, /:not\(\.vt-studio-44-switch\)/)
  assert.match(genericButtonRule, /:not\(\.vt-studio-44-choice\)/)
  assert.match(studioCss, /button\.vt-studio-44-choice\.is-round\s*\{\s*border-radius:\s*50%/)
  assert.match(studioCss, /button\.vt-studio-44-switch\.is-round\s*\{\s*border-radius:\s*999px/)
})

test("button faces use the solid primary color and own their aligned shadow", () => {
  assert.match(studioCss, /button\[data-vt-studio-button="true"\]\s*\{[^}]*box-shadow:\s*none/s)
  assert.match(studioCss, /button\[data-vt-studio-button="true"\]\s*>\s*\[data-vt-studio-button-face\]\s*\{[^}]*background:\s*var\(--vt-studio-control-accent/s)
  assert.match(studioCss, /button\[data-vt-studio-button="true"\]\s*>\s*\[data-vt-studio-button-face\]\s*\{[^}]*box-shadow:\s*var\(--vt-studio-control-shadow\)/s)
})

test("textarea typography inherits input size tiers and uses only the .75 description line-height override", () => {
  const textareaBlock = studioCss.slice(
    studioCss.indexOf('textarea[data-vt-studio-control="true"][data-vt-studio-field-kind="textarea"] {'),
    studioCss.indexOf('input[data-vt-studio-control="true"]:not([type="checkbox"])', studioCss.indexOf('textarea[data-vt-studio-control="true"][data-vt-studio-field-kind="textarea"] {')),
  );
  assert.match(textareaBlock, /font-size:\s*var\(--vt-studio-standard-font-size, 38px\)/);
  assert.match(textareaBlock, /line-height:\s*\.75/);
  assert.match(textareaBlock, /--vt-studio-compact-font-size, 24px/);
  assert.match(textareaBlock, /--vt-studio-micro-font-size, 10px/);
  assert.doesNotMatch(textareaBlock, /vt-studio-textarea-(?:standard|compact)-(?:font-size|text-stroke|line-height)/);
  assert.match(studioCss, /textarea\[data-vt-studio-control="true"\]\[data-vt-studio-field-kind="textarea"\]:is\(:focus, :focus-visible\)[\s\S]*?background: color-mix\(in srgb, var\(--vt-field-primary\) var\(--vt-studio-control-focus-fill-opacity\), transparent\)/);
});


test("field focus outline width follows the selected field border width", () => {
  assert.match(studioCss, /--vt-field-outline-stroke:\s*var\(--vt-field-stroke\)/);
  assert.match(studioCss, /--vt-studio-textarea-line-height:\s*\.75/);
  assert.match(studioCss, /font-size:\s*var\(--vt-studio-standard-font-size, 38px\)/);
  assert.match(studioCss, /font-size:\s*var\(--vt-studio-compact-font-size, 24px\)/);
  assert.match(studioCss, /font-size:\s*var\(--vt-studio-micro-font-size, 10px\)/);
});

test("StudioTextBox uses a half-width black border, matching inline and secondary strokes, and no shadow", () => {
  const textBoxBlock = studioCss.slice(
    studioCss.indexOf('.vt-studio-text-box[data-vt-studio-control="true"] {'),
    studioCss.indexOf('.vt-studio-text-box[data-vt-studio-control="true"][data-size="compact"] {'),
  );
  assert.match(textBoxBlock, /--studio-text-box-stroke-width:\s*calc\(var\(--field-border-width\) \* 0\.5\)/);
  assert.match(textBoxBlock, /border:\s*var\(--studio-text-box-stroke-width\) solid #000/);
  assert.match(textBoxBlock, /outline:\s*var\(--studio-text-box-stroke-width\) solid var\(--vt-field-secondary/);
  assert.match(studioCss, /\.vt-studio-text-box\[data-vt-studio-control="true"\]::before[\s\S]*?border:\s*var\(--studio-text-box-stroke-width\) solid var\(--vt-field-primary/);
  assert.doesNotMatch(textBoxBlock, /box-shadow/);
  assert.match(textBoxBlock, /font-size:\s*var\(--vt-studio-standard-font-size, 38px\)/);
  assert.match(textBoxBlock, /line-height:\s*\.75/);
});

test("Vault uses Studio Controls for spectrum tags, import toggles, search, upload, and display text", async () => {
  const vault = await readFile(new URL("../../src/views/CreatorVaultOS.tsx", import.meta.url), "utf8");
  assert.doesNotMatch(vault, /SubToolboxAlphabeticalTag|SubToolboxFileTarget|SubToolboxTextArea/);
  assert.match(vault, /<StudioSpectrumTag/);
  assert.match(vault, /<StudioWordToggle[\s\S]*?words=\{\["TAGS", "IMPORT"\]\}/);
  assert.match(vault, /<StudioWordToggle[\s\S]*?words=\{\["DIRECT", "STAGED"\]\}/);
  assert.match(vault, /<StudioSplitLeftInput/);
  assert.match(vault, /<StudioUploadFrame/);
  assert.match(vault, /data-vault-sort-state-view-stack/);
  assert.match(studioCss, /@media \(max-width: 639px\)[\s\S]*?--vt-legend-height:\s*28px/);
});

test("Studio Hub upload surfaces use StudioUploadFrame instead of SubToolboxFileTarget", async () => {
  const paths = [
    "../../src/views/SeoGenerator.tsx",
    "../../src/views/MediaAnalyzer.tsx",
    "../../src/components/EndScreenTool.tsx",
    "../../src/views/VideoPublisher.tsx",
    "../../src/views/ThumbnailStudio.tsx",
    "../../src/views/VideoDirector.tsx",
    "../../src/components/metadata/CanonicalMetadataSections.tsx",
  ];
  for (const path of paths) {
    const source = await readFile(new URL(path, import.meta.url), "utf8");
    assert.doesNotMatch(source, /SubToolboxFileTarget/, path);
    assert.match(source, /StudioUploadFrame/, path);
  }
});
