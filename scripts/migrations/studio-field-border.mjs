import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import ts from 'typescript'

// Full-checkout migration. Never reconstruct a truncated source response.
const writes = new Map()
const read = name => fs.readFileSync(name, 'utf8')
const parse = (name, text) => ts.createSourceFile(name, text, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX)
const nodes = source => { const all = []; const walk = n => { all.push(n); ts.forEachChild(n, walk) }; walk(source); return all }
const attr = (opening, name, sf) => opening.attributes.properties.find(p => ts.isJsxAttribute(p) && p.name.getText(sf) === name)
const edit = (text, edits) => {
  edits.sort((a,b) => a.start-b.start || a.end-b.end)
  for(let i=1;i<edits.length;i++) if(edits[i].start<edits[i-1].end) throw Error('Overlapping migration edits')
  for(const e of [...edits].reverse()) text=text.slice(0,e.start)+e.text+text.slice(e.end)
  return text
}
const sources = [
  ['src/studio-ui/primitives/StudioTextInput.tsx','fc7a04978575b7780d059f396a347782b68dcbf5',true],
  ['src/studio-ui/primitives/StudioTextArea.tsx','f71df334aab011a73d74552316cfab16f7b41c7c',true],
  ['src/studio-ui/primitives/StudioControls.tsx','70bbf27963cd7000a32b390a40a7902903c4c10f',false],
]
for(const [name,hash,allFields] of sources){
  const text=read(name)
  const result=spawnSync('git',['hash-object','--stdin'],{input:text,encoding:'utf8'})
  if(result.status!==0 || result.stdout.trim()!==hash) throw Error('Source changed; reconcile before migrating: '+name)
  const sf=parse(name,text), list=nodes(sf), edits=[]
  let count=0
  for(const n of list){
    if(!ts.isJsxSelfClosingElement(n) && !ts.isJsxElement(n)) continue
    const opening=ts.isJsxElement(n)?n.openingElement:n
    if(!['input','textarea'].includes(opening.tagName.getText(sf))) continue
    const t=attr(opening,'type',sf)?.initializer
    if(t && ts.isStringLiteral(t) && ['checkbox','radio','range','file','color','hidden','button','submit','reset','image'].includes(t.text)) continue
    if(!allFields && !attr(opening,'data-vt-studio-control',sf) && !/withStudioAttrs\(/.test(n.getText(sf))) continue
    const owners=[]
    for(let p=n.parent;p;p=p.parent) if(ts.isVariableDeclaration(p) && ts.isIdentifier(p.name)) owners.push(p.name.text)
    const owner=owners.find(value=>['StudioSearchInput','StudioNumberInput','StudioUsernameInput'].includes(value))
    if(!allFields && !owner) throw Error('Unreviewed canonical field in '+name+': '+owners.join('/'))
    const embedded=owner==='StudioUsernameInput'?' embedded edge="left"':''
    edits.push({start:n.getStart(sf),end:n.end,text:'<StudioFieldSurface'+embedded+'>'+n.getText(sf)+'</StudioFieldSurface>'})
    console.log('Migrate',name,owner||'canonical field',embedded?'existing perimeter':'shared perimeter')
    count++
  }
  if(allFields && count!==3) throw Error('Expected exactly three field variants: '+name)
  if(!allFields && count<2) throw Error('Search/number migration missing')
  edits.push({start:0,end:0,text:allFields?'import { StudioFieldSurface } from "./StudioFieldSurface"\n':'import { StudioFieldSurface, STUDIO_FIELD_BORDER_CONTRACT } from "./StudioFieldSurface"\n'})
  if(!allFields){
    const d=list.find(n=>ts.isVariableDeclaration(n)&&n.name.getText(sf)==='STUDIO_COMPONENT_GLOBAL_DEFAULTS')
    let value=d?.initializer
    while(value && (ts.isAsExpression(value)||ts.isParenthesizedExpression(value)||ts.isSatisfiesExpression(value))) value=value.expression
    if(!value||!ts.isObjectLiteralExpression(value)) throw Error('Global defaults object missing')
    edits.push({start:value.getStart(sf)+1,end:value.getStart(sf)+1,text:'\n fieldBorder: STUDIO_FIELD_BORDER_CONTRACT,\n'})
  }
  writes.set(name,edit(text,edits))
}
const split='src/studio-ui/primitives/StudioSplitTextInput.tsx'
const original=read(split), sf=parse(split,original)
const outer=nodes(sf).filter(n=>ts.isJsxElement(n)&&attr(n.openingElement,'data-split',sf))
if(outer.length!==1||original.includes('StudioFieldBoundaryProvider')) throw Error('Split structure changed or already migrated')
const body=outer[0].getText(sf).replace(/<span\b/,'<span data-vt-studio-field-owner="composite"')
writes.set(split,edit(original,[{start:0,end:0,text:'import { StudioFieldBoundaryProvider } from "./StudioFieldSurface"\n'},{start:outer[0].getStart(sf),end:outer[0].end,text:'<StudioFieldBoundaryProvider split={split}>'+body+'</StudioFieldBoundaryProvider>'}]))
const cssName='src/styles/studio-text-input.css', oldCss=read(cssName)
const marker='/* Field inline stroke is perimeter paint, not a glyph stroke or shadow.'
if(oldCss.split(marker).length!==2) throw Error('Old gradient block changed; review its removal')
writes.set(cssName,oldCss.slice(0,oldCss.indexOf(marker)))
const entry='src/styles/studio-control-entry.css'
if(read(entry).includes('studio-field-surface.css')) throw Error('Shared foundation already imported')
writes.set(entry,read(entry).trimEnd()+'\n@import "./studio-field-surface.css";\n')
const index='src/studio-ui/index.ts'
writes.set(index,read(index).trimEnd()+'\nexport { StudioFieldSurface, StudioFieldBoundaryProvider, STUDIO_FIELD_BORDER_CONTRACT } from "./primitives/StudioFieldSurface"\n')

writes.set('src/studio-ui/primitives/StudioFieldSurface.tsx',String.raw`import React from "react"
import "../../styles/studio-field-surface.css"
export type StudioFieldSize = "standard" | "compact" | "micro"
type Edge = "standalone" | "left" | "right" | "double"
const Boundary = React.createContext<{ embedded: boolean; edge: Edge }>({ embedded: false, edge: "standalone" })
export const StudioFieldBoundaryProvider: React.FC<{ split: "left" | "right" | "double"; children: React.ReactNode }> = ({ split, children }) => <Boundary.Provider value={{ embedded: true, edge: split }}>{children}</Boundary.Provider>
export const STUDIO_FIELD_BORDER_CONTRACT = { outer: "real black surface border", inner: "real primary native field border", width: "--vt-studio-control-stroke", radius: "--vt-studio-control-radius; inner contour subtracts outer stroke", restFill: "50% primary via global token", focusFill: "15% primary via global token", focusOutline: "secondary; 65% stroke; zero offset" } as const
type Native = React.ReactElement<{ className?: string; style?: React.CSSProperties; "data-size"?: StudioFieldSize }>
export const StudioFieldSurface: React.FC<{ children: Native; embedded?: boolean; edge?: Edge }> = ({ children, embedded, edge }) => {
  const context = React.useContext(Boundary)
  const inside = embedded ?? context.embedded
  const side = edge ?? context.edge
  const size = children.props["data-size"] ?? "standard"
  const kind = children.type === "textarea" ? "textarea" : "input"
  const nativeStyle = { ...children.props.style }
  const surfaceStyle: React.CSSProperties = {}
  if (!inside) {
    for (const key of ["width","height","minWidth","maxWidth","minHeight","maxHeight","aspectRatio","flex","flexGrow","flexShrink","flexBasis","alignSelf","justifySelf","gridColumn","gridRow","order","resize"] as const) {
      if (key in nativeStyle) { Object.assign(surfaceStyle, { [key]: nativeStyle[key] }); delete nativeStyle[key] }
    }
    for (const [key,value] of Object.entries(nativeStyle)) if (key.startsWith("--")) Object.assign(surfaceStyle, { [key]: value })
    if (typeof nativeStyle.borderRadius === "number") { Object.assign(surfaceStyle, { "--vt-studio-control-radius": String(nativeStyle.borderRadius) + "px" }); delete nativeStyle.borderRadius }
  }
  const native = React.cloneElement(children, { className: [children.props.className, "vt-studio-field-native"].filter(Boolean).join(" "), style: nativeStyle, ...{ "data-vt-studio-control": "true", "data-size": size, "data-vt-field-native": "true", "data-vt-field-edge": inside ? side : "standalone" } })
  if (inside) return native
  return <span className="vt-studio-field-surface" data-vt-studio-control="true" data-size={size} data-vt-field-kind={kind} data-vt-field-fill-height={kind === "textarea" || surfaceStyle.height !== undefined || surfaceStyle.aspectRatio !== undefined || undefined} style={surfaceStyle}>{native}</span>
}
`)
writes.set('src/styles/studio-field-surface.css',String.raw`/* One global authority for real field borders, consuming existing Studio tokens. */
html body .vt-studio-field-surface,
html body [data-vt-studio-field-owner="composite"],
html body [data-vt-studio-control="true"][data-vt-studio-split]:has(.vt-studio-field-native) {
 --vt-field-stroke: var(--vt-studio-control-stroke, 3px);
 --vt-field-radius: var(--vt-studio-control-radius, 6px);
 --vt-field-tl: max(0px, calc(var(--vt-field-radius-tl, var(--vt-field-radius)) - var(--vt-field-stroke)));
 --vt-field-tr: max(0px, calc(var(--vt-field-radius-tr, var(--vt-field-radius)) - var(--vt-field-stroke)));
 --vt-field-br: max(0px, calc(var(--vt-field-radius-br, var(--vt-field-radius)) - var(--vt-field-stroke)));
 --vt-field-bl: max(0px, calc(var(--vt-field-radius-bl, var(--vt-field-radius)) - var(--vt-field-stroke)));
 display: grid !important; box-sizing: border-box; width: 100%; min-width: 0; min-height: 0; gap: 0 !important; padding: 0 !important; background: transparent !important; box-shadow: none !important;
}
html body .vt-studio-field-surface { grid-template-columns: minmax(0,1fr); grid-template-rows: minmax(0,1fr); border: var(--vt-field-stroke) solid #000 !important; border-radius: var(--vt-field-radius-tl,var(--vt-field-radius)) var(--vt-field-radius-tr,var(--vt-field-radius)) var(--vt-field-radius-br,var(--vt-field-radius)) var(--vt-field-radius-bl,var(--vt-field-radius)) !important; overflow: hidden; }
html body .vt-studio-field-surface[data-vt-field-kind="textarea"] { resize: vertical; }
html body :is(input,textarea).vt-studio-field-native[data-vt-studio-control="true"][data-size] {
 --vt-field-primary: var(--vt-studio-control-accent,var(--pair-a,#36e0f6));
 display: block !important; box-sizing: border-box !important; width: 100%; min-width: 0 !important; margin: 0 !important;
 border: var(--vt-studio-control-stroke,3px) solid var(--vt-field-primary) !important;
 border-radius: var(--vt-field-tl,0px) var(--vt-field-tr,0px) var(--vt-field-br,0px) var(--vt-field-bl,0px) !important;
 outline: none !important; appearance: none; box-shadow: none !important;
 background: color-mix(in srgb,var(--vt-field-primary) var(--vt-studio-control-default-fill-opacity,50%),transparent) !important; background-clip: padding-box;
 color: var(--vt-field-primary); -webkit-text-fill-color: var(--vt-field-primary); -webkit-text-stroke-color: var(--vt-field-primary); caret-color: var(--vt-field-primary);
}
html body input.vt-studio-field-native[data-vt-studio-control="true"][data-size] { height: calc(var(--vt-studio-control-height,44px) - 2 * var(--vt-studio-control-stroke,3px)) !important; min-height: 0 !important; font-size: var(--vt-studio-control-font-size,38px); }
html body textarea.vt-studio-field-native[data-vt-studio-control="true"][data-size] { min-height: calc(var(--vt-studio-textarea-min-height,92px) - 2 * var(--vt-studio-control-stroke,3px)) !important; height: 100%; resize: none; }
html body .vt-studio-field-surface[data-vt-field-fill-height="true"] > .vt-studio-field-native,
html body :is([data-vt-studio-field-owner="composite"],[data-vt-studio-split]) input.vt-studio-field-native[data-vt-studio-control="true"][data-size] { height: 100% !important; }
html body .vt-studio-field-native[data-vt-field-edge="left"] { --vt-field-tl: 0px; --vt-field-bl: 0px; }
html body .vt-studio-field-native[data-vt-field-edge="right"] { --vt-field-tr: 0px; --vt-field-br: 0px; }
html body .vt-studio-field-native[data-vt-field-edge="double"] { --vt-field-tl: 0px; --vt-field-tr: 0px; --vt-field-br: 0px; --vt-field-bl: 0px; }
html body :is(input,textarea).vt-studio-field-native[data-vt-studio-control="true"][data-size]:is(:focus,:focus-visible) { background: color-mix(in srgb,var(--vt-field-primary) var(--vt-studio-control-focus-fill-opacity,15%),transparent) !important; background-clip: padding-box; border-color: var(--vt-field-primary) !important; outline: none !important; color: #000 !important; -webkit-text-fill-color: #000 !important; -webkit-text-stroke-color: #000 !important; }
html body :is(.vt-studio-field-surface,[data-vt-studio-field-owner="composite"],[data-vt-studio-control="true"][data-vt-studio-split]:has(.vt-studio-field-native)):focus-within { outline: calc(var(--vt-studio-control-stroke,3px) * .65) solid var(--vt-studio-control-secondary,var(--pair-b,#ff7f6b)) !important; outline-offset: 0 !important; }
html body .vt-studio-floating-field > .vt-studio-field-surface:has(:is(input,textarea):is(:focus,:focus-visible,:not(:placeholder-shown))) + .vt-studio-floating-field-label { top: 0; left: 10px; padding: 2.25px 4.5px; border-radius: 3px; background: var(--vt-studio-control-accent,var(--pair-a,#36e0f6)); color: #000; -webkit-text-fill-color: #000; -webkit-text-stroke: .5px #000; font-size: calc(var(--vt-studio-floating-label-size) * .8); transform: translateY(-40%); }
html body .vt-studio-floating-field[data-vt-floating-variant="b"][data-size="compact"] > .vt-studio-field-surface:focus-within + .vt-studio-floating-field-label { outline: var(--vt-studio-control-focus-outline-width,1.3px) solid var(--vt-studio-control-secondary,var(--pair-b,#ff7f6b)); outline-offset: 0; }
`)
writes.set('src/studio-ui/primitives/studio-split-text-input.css',String.raw`/* Geometry only. Border, fills, radii and focus belong to the shared foundation. */
html body .vt-studio-split-text-input { width: 100% !important; max-width: none !important; min-width: 0; grid-template-columns: minmax(0,1fr); border-radius: var(--vt-studio-control-radius,6px); }
html body .vt-studio-split-text-input > [data-vt-studio-control="true"] { display: grid; box-sizing: border-box; width: 100% !important; min-width: 0; max-width: none !important; height: var(--vt-studio-control-height) !important; grid-template-rows: minmax(0,1fr); align-items: stretch; gap: 0 !important; padding: 0 !important; background: transparent !important; }
html body .vt-studio-split-text-input [data-vt-studio-split-label] { display: grid !important; grid-template-columns: minmax(0,1fr); grid-template-rows: minmax(0,1fr); min-width: 0; min-height: 0; height: auto !important; align-self: stretch; margin: 0; padding: 0 !important; border: 0; background: transparent !important; }
html body .vt-studio-split-text-input [data-vt-studio-split-rail] { width: calc(var(--vt-studio-control-height) - var(--vt-studio-control-stroke)); min-width: calc(var(--vt-studio-control-height) - var(--vt-studio-control-stroke)); height: 100%; }
`)
const tests=String.raw`import React from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { readFileSync } from "node:fs"
import { describe,expect,it } from "vitest"
import { StudioFieldSurface,StudioFieldBoundaryProvider } from "./StudioFieldSurface"
describe("shared real field borders",()=>{
 it("preserves native fields and form attributes",()=>{const html=renderToStaticMarkup(<StudioFieldSurface><input name="title" aria-label="Title" defaultValue="Draft" readOnly /></StudioFieldSurface>);expect(html.match(/<input/g)).toHaveLength(1);expect(html).toContain('name="title"');expect(html).toContain('data-vt-field-native="true"')})
 it.each(["left","right","double"] as const)("inherits borders without another black surface in %s compounds",split=>{const html=renderToStaticMarkup(<StudioFieldBoundaryProvider split={split}><StudioFieldSurface><input /></StudioFieldSurface></StudioFieldBoundaryProvider>);expect(html).not.toContain('class="vt-studio-field-surface"');expect(html).toContain('data-vt-field-edge="'+split+'"')})
 it("has one global real border authority and no split paint override",()=>{const css=readFileSync(new URL("../../styles/studio-field-surface.css",import.meta.url),"utf8");const split=readFileSync(new URL("./studio-split-text-input.css",import.meta.url),"utf8");expect(css).toContain('solid var(--vt-field-primary) !important');expect(css).toContain('--vt-studio-control-focus-fill-opacity,15%');expect(css).not.toContain('linear-gradient(');expect(css).not.toContain('::after');expect(split).not.toContain('color-mix(')})
})
`
writes.set('src/studio-ui/primitives/StudioFieldSurface.test.tsx',tests)
writes.set('src/studio-ui/primitives/StudioSplitTextInputStyleContract.test.ts','export {}\n// Split paint ownership is asserted in StudioFieldSurface.test.tsx.\n')

// Audit canonical native text fields throughout src; unknown consumers stop the job.
const walkFiles=dir=>fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?(['node_modules','.git','__tests__'].includes(e.name)?[]:walkFiles(path.join(dir,e.name))):(/\.tsx$/.test(e.name)&&! /\.(test|spec)\.tsx$/.test(e.name)?[path.join(dir,e.name)]:[]))
const unmigrated=[]
for(const name of walkFiles('src')){
 if(name.endsWith('StudioFieldSurface.tsx'))continue
 const text=writes.get(name)||read(name), source=parse(name,text)
 for(const n of nodes(source)){
  if(!ts.isJsxSelfClosingElement(n)&&!ts.isJsxElement(n))continue
  const o=ts.isJsxElement(n)?n.openingElement:n
  if(!['input','textarea'].includes(o.tagName.getText(source)))continue
  const t=attr(o,'type',source)?.initializer
  if(t&&ts.isStringLiteral(t)&&['checkbox','radio','range','file','color','hidden','button','submit','reset','image'].includes(t.text))continue
  const mark=attr(o,'data-vt-studio-control',source)?.initializer
  if(!(mark&&ts.isStringLiteral(mark)&&mark.text==='true')&&!/withStudioAttrs\(/.test(n.getText(source)))continue
  let wrapped=false
  for(let p=n.parent;p;p=p.parent)if(ts.isJsxElement(p)&&p.openingElement.tagName.getText(source)==='StudioFieldSurface')wrapped=true
  if(!wrapped)unmigrated.push(name+':'+(source.getLineAndCharacterOfPosition(n.getStart(source)).line+1))
 }
}
if(unmigrated.length)throw Error('Unreviewed native fields; no source committed: '+unmigrated.join(', '))
for(const [name,text] of writes){
 if(name.endsWith('.tsx')||name.endsWith('.ts')){const p=parse(name,text);if(p.parseDiagnostics.length)throw Error('Syntax diagnostics in '+name+': '+p.parseDiagnostics.map(d=>ts.flattenDiagnosticMessageText(d.messageText,' ')).join('; '))}
}
for(const [name,text] of writes){fs.mkdirSync(path.dirname(name),{recursive:true});fs.writeFileSync(name,text)}
console.log('Applied shared field draft in checkout. CI must pass before any source commit. Browser shape/corner verification remains required.')
