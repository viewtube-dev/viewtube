import React from "react"
import { ChevronDown, Eye, EyeOff, Star } from "lucide-react"
import { getComponentLevelCssVars } from "./tokens"
import type { ToolboxControlLevel } from "./tokens"

const cx=(...v:Array<string|false|undefined|null>)=>v.filter(Boolean).join(" ")
const sty=(l:ToolboxControlLevel|undefined,s:React.CSSProperties|undefined)=>l?({...getComponentLevelCssVars(l),...s} as React.CSSProperties):s

export const SubToolboxCmykMixer=({level="l1",style}:{level?:ToolboxControlLevel;style?:React.CSSProperties})=>{
 const [v,setV]=React.useState({c:20,m:55,y:10,k:5}); const rgb=[v.c,v.m,v.y].map(x=>Math.round(255*(1-x/100)*(1-v.k/100)))
 return <div className="vt-ext-cmyk" style={sty(level,style)}>{(["c","m","y","k"] as const).map(k=><div className={cx("vt-ext-cmyk-row","is-"+k)} key={k}><b>{k.toUpperCase()}</b><input aria-label={k.toUpperCase()} type="range" min="0" max="100" value={v[k]} onChange={e=>setV({...v,[k]:+e.target.value})}/><output>{v[k]}</output></div>)}<div className="vt-ext-cmyk-swatch" style={{background:"rgb("+rgb.join(",")+")"}}/></div>
}

export const SubToolboxXYJoystick=({level="l1",style}:{level?:ToolboxControlLevel;style?:React.CSSProperties})=>{
 const [p,setP]=React.useState({x:50,y:50}); const ref=React.useRef<HTMLDivElement>(null)
 const move=(e:React.PointerEvent)=>{const r=ref.current?.getBoundingClientRect();if(!r)return;setP({x:Math.max(0,Math.min(100,(e.clientX-r.left)/r.width*100)),y:Math.max(0,Math.min(100,(e.clientY-r.top)/r.height*100))})}
 return <div className="vt-ext-joy-wrap" style={sty(level,style)}><div ref={ref} className="vt-ext-joy" onPointerDown={e=>{e.currentTarget.setPointerCapture(e.pointerId);move(e)}} onPointerMove={e=>e.currentTarget.hasPointerCapture(e.pointerId)&&move(e)}><i style={{left:p.x+"%",top:p.y+"%"}}/></div><output>X {Math.round(p.x)} · Y {Math.round(100-p.y)}</output></div>
}

export const SubToolboxAspectRatioSelector=({level="l1",style}:{level?:ToolboxControlLevel;style?:React.CSSProperties})=>{const [v,setV]=React.useState("16:9");return <div className="vt-ext-ratio" style={sty(level,style)}>{["16:9","9:16","1:1","4:3"].map(x=><button className={x===v?"is-on":""} key={x} onClick={()=>setV(x)}>{x}</button>)}</div>}

export const SubToolboxBeforeAfterCompare=({level="l1",style}:{level?:ToolboxControlLevel;style?:React.CSSProperties})=>{const [v,setV]=React.useState(50);return <div className="vt-ext-compare" style={sty(level,style)}><div className="stage"><div>BEFORE</div><div className="after" style={{clipPath:"inset(0 "+(100-v)+"% 0 0)"}}>AFTER</div><i style={{left:v+"%"}}/></div><input aria-label="Compare position" type="range" min="0" max="100" value={v} onChange={e=>setV(+e.target.value)}/></div>}

export const SubToolboxSpringLoadedToggle=({level="l1",style}:{level?:ToolboxControlLevel;style?:React.CSSProperties})=>{const [v,setV]=React.useState(50);return <div className="vt-ext-spring" style={sty(level,style)}><input aria-label="Spring loaded value" type="range" min="0" max="100" value={v} onChange={e=>setV(+e.target.value)}/></div>}

export const SubToolboxAccordion=({level="l1",style}:{level?:ToolboxControlLevel;style?:React.CSSProperties})=>{const [o,setO]=React.useState(false);return <div className="vt-ext-accordion" style={sty(level,style)}><button onClick={()=>setO(!o)}><span>+</span> ADVANCED SETTINGS <ChevronDown className={o?"is-open":""}/></button>{o&&<div>Split-left content</div>}</div>}

export const SubToolboxOutputInput=({level="l1",style}:{level?:ToolboxControlLevel;style?:React.CSSProperties})=><div className="vt-ext-output-input" style={sty(level,style)}><input aria-label="Output" defaultValue="GENERATED OUTPUT"/><b>OUTPUT</b></div>
export const SubToolboxPasswordInput=({level="l1",style}:{level?:ToolboxControlLevel;style?:React.CSSProperties})=>{const [show,setShow]=React.useState(false);return <div className="vt-ext-password" style={sty(level,style)}><input aria-label="Password" type={show?"text":"password"} defaultValue="ViewTube!2026"/><button aria-label={show?"Hide password":"Show password"} onClick={()=>setShow(!show)}>{show?<EyeOff/>:<Eye/>}</button></div>}
export const SubToolboxRating=({level="l1",style}:{level?:ToolboxControlLevel;style?:React.CSSProperties})=>{const [v,setV]=React.useState(3);return <div className="vt-ext-rating" style={sty(level,style)}>{[1,2,3,4,5].map(n=><button key={n} className={n<=v?"is-on":""} onClick={()=>setV(n)} aria-label={"Rate "+n}><Star/></button>)}</div>}
export const SubToolboxProductionChecklist=({level="l1",style}:{level?:ToolboxControlLevel;style?:React.CSSProperties})=>{const [a,setA]=React.useState([true,false,true]);return <div className="vt-ext-checklist" style={sty(level,style)}>{["SCRIPT","THUMBNAIL","PUBLISH"].map((x,i)=><button key={x} className={a[i]?"is-on":""} onClick={()=>setA(s=>s.map((v,j)=>j===i?!v:v))}><b>{a[i]?"✓":"○"}</b>{x}</button>)}</div>}
export const SubToolboxNavigation=({level="l1",style,top=false}:{level?:ToolboxControlLevel;style?:React.CSSProperties;top?:boolean})=>{const [a,setA]=React.useState(0);const items=top?["STUDIO","PROJECTS","ANALYTICS"]:["OVERVIEW","ASSETS","OUTPUT","SETTINGS"];return <nav className={cx("vt-ext-nav",top&&"is-top")} style={sty(level,style)}>{items.map((x,i)=><button className={i===a?"is-on":""} key={x} onClick={()=>setA(i)}>{x}</button>)}</nav>}
export const SubToolboxVideoSelector=({level="l1",style}:{level?:ToolboxControlLevel;style?:React.CSSProperties})=>{const [o,setO]=React.useState(false);return <div className="vt-ext-video-selector" style={sty(level,style)}><button onClick={()=>setO(!o)}><span className="thumb">16:9</span><b>READY</b><span>AUSTERLITZ</span><ChevronDown className={o?"is-open":""}/></button>{o&&<div>{["AUSTERLITZ","WATERLOO","BORODINO"].map((x,i)=><button key={x} onClick={()=>setO(false)}><span className="thumb">16:9</span><b>{i?"DRAFT":"READY"}</b><span>{x}</span></button>)}</div>}</div>}
export const SubToolboxTimeline=({level="l1",style}:{level?:ToolboxControlLevel;style?:React.CSSProperties})=><div className="vt-ext-timeline" style={sty(level,style)}>{["HOOK","SCRIPT","B-ROLL","MUSIC"].map((x,i)=><div key={x}><b>{x}</b><i style={{left:(10+i*22)+"%",width:(18+i*3)+"%"}}/></div>)}</div>
export const SubToolboxMediaFrame=({level="l1",style}:{level?:ToolboxControlLevel;style?:React.CSSProperties})=><div className="vt-ext-frame" style={sty(level,style)}>16:9</div>
export const SubToolboxColorSwitchToggle=({level="l1",style}:{level?:ToolboxControlLevel;style?:React.CSSProperties})=>{const [o,setO]=React.useState(false);return <button className={cx("vt-ext-color-toggle",o&&"is-on")} style={sty(level,style)} onClick={()=>setO(!o)}><i/></button>}
export const SubToolboxToolboxToggle=({level="l0",style,variant="pill"}:{level?:ToolboxControlLevel;style?:React.CSSProperties;variant?:"pill"|"underline"|"black-fill"})=>{const [o,setO]=React.useState(false);return <button className={cx("vt-ext-toolbox-toggle","is-"+variant,o&&"is-on")} style={sty(level,style)} onClick={()=>setO(!o)}><span>{o?"ON":"OFF"}</span><i/></button>}
export const SubToolboxProgress=({level="l1",style}:{level?:ToolboxControlLevel;style?:React.CSSProperties})=><div className="vt-ext-progress" style={sty(level,style)}><i/></div>
export const SubToolboxDataGrid=({level="l1",style}:{level?:ToolboxControlLevel;style?:React.CSSProperties})=><div className="vt-ext-grid" style={sty(level,style)}>{["TITLE","STATUS","VIEWS"].map((x,i)=><div key={x}><b>{x}</b><span>{i===1?"READY":i===2?"12.4K":"AUSTERLITZ"}</span></div>)}</div>