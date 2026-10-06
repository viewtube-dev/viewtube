import React,{useEffect,useRef,useState} from "react";
import {createRoot} from "react-dom/client";
import {GlassRenderer} from "./renderer/GlassRenderer.js";
import {drawEnvironment} from "./renderer/environment.js";
import {MATERIAL_DEFAULTS,normalizeMaterial,MATERIAL_RANGES} from "./glass/materials.js";
import "./styles.css";

const CONTROL_GROUPS=[
 ["REFRACTION",[["refFactor","Factor"],["refThickness","Thickness"],["refDistance","Distance"],["refDispersion","Dispersion"]]],
 ["FRESNEL",[["refFresnelRange","Range"],["refFresnelHardness","Hardness"],["refFresnelFactor","Factor"]]],
 ["GLARE",[["glareRange","Range"],["glareHardness","Hardness"],["glareFactor","Factor"],["glareConvergence","Convergence"],["glareOppositeFactor","Opposite"],["glareAngle","Angle"]]],
 ["ENVIRONMENT",[["blurRadius","Blur radius"]]]
];

function App(){
 const canvas=useRef(null),env=useRef(null),frame=useRef(null),[material,setMaterial]=useState({...MATERIAL_DEFAULTS}),[active,setActive]=useState(0),[step,setStep]=useState("FINAL"),[paused,setPaused]=useState(false);
 useEffect(()=>{
  const renderer=new GlassRenderer(canvas.current),ctx=env.current.getContext("2d");let raf;
  const draw=(time)=>{
   const box=frame.current.getBoundingClientRect();const w=Math.max(1,box.width),h=Math.max(1,box.height);env.current.width=Math.floor(w*devicePixelRatio);env.current.height=Math.floor(h*devicePixelRatio);ctx.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0);
   drawEnvironment(ctx,w,h,paused?0:time);renderer.resize(w,h);renderer.uploadEnvironment(env.current);
   const m=material;const a={...m,x:.09,y:.17,w:.36,h:.54,radius:Math.min(w,h)*.055};const b={...m,x:.55,y:.27,w:.31,h:.43,radius:Math.min(w,h)*.055};
   renderer.render(active===0?[a,b]:active===1?[a]:[b]);raf=requestAnimationFrame(draw);
  };raf=requestAnimationFrame(draw);return()=>cancelAnimationFrame(raf);
 },[material,active,paused]);
 const set=(key,value)=>setMaterial(m=>normalizeMaterial({...m,[key]:value}));
 return <main className="lab">
  <header className="bar"><div><span className="eyebrow">VIEWTUBE / LIQUID GLASS SYSTEM</span><h1>Material Observatory</h1><p>Renderer-first laboratory for reconstructing the optical material before composing application components.</p></div><div className="live"><i/> WEBGL2 · LIVE</div></header>
  <section className="layout">
   <aside className="panel controls">
    <div className="panel-head"><span>MATERIAL</span><b>01</b></div>
    <div className="seg"><button className={active===0?"on":""} onClick={()=>setActive(0)}>TWO</button><button className={active===1?"on":""} onClick={()=>setActive(1)}>A</button><button className={active===2?"on":""} onClick={()=>setActive(2)}>B</button></div>
    {CONTROL_GROUPS.map(([group,items])=><div className="group" key={group}><h3>{group}</h3>{items.map(([key,label])=>{const range=MATERIAL_RANGES[key];return <label key={key}><span>{label}<em>{typeof material[key]==="number"?material[key].toFixed(key==="refDistance"?3:0):""}</em></span><input type="range" min={range[0]} max={range[1]} step={key==="refDistance"?.001: key==="refFactor"?.01:1} value={material[key]} onChange={e=>set(key,Number(e.target.value))}/></label>})}</div>)}
    <div className="group"><h3>APPEARANCE</h3><label><span>Tint</span><input type="color" value={material.tint} onChange={e=>setMaterial(m=>({...m,tint:e.target.value}))}/></label><label><span>Tint strength<em>{material.tintAlpha.toFixed(2)}</em></span><input type="range" min="0" max="1" step=".01" value={material.tintAlpha} onChange={e=>set("tintAlpha",Number(e.target.value))}/></label></div>
    <div className="actions"><button onClick={()=>setStep(step==="FINAL"?"SDF":"FINAL")}>SHOW STEP · {step}</button><button onClick={()=>setPaused(!paused)}>{paused?"RESUME":"PAUSE"} ENVIRONMENT</button><button onClick={()=>setMaterial({...MATERIAL_DEFAULTS})}>RESET MATERIAL</button></div>
   </aside>
   <section className="stage" ref={frame}>
    <canvas className="environment" ref={env}/><canvas className="glass-canvas" ref={canvas}/>
    <div className="scene-label"><b>LIVE OPTICAL FIELD</b><span>environment → blur → SDF → refraction → dispersion → Fresnel → glare</span></div>
    <div className="rect-label a">A / PRIMARY</div><div className="rect-label b">B / SECONDARY</div>
    <div className={"step "+(step==="FINAL"?"":"show")}><b>{step==="FINAL"?"FINAL COMPOSITE":step}</b><span>same live environment · material response</span></div>
   </section>
   <aside className="panel inspector"><div className="panel-head"><span>OPTICAL STACK</span><b>08</b></div>{["Environment","Gaussian Blur V","Gaussian Blur H","SDF Geometry","Refraction","Chromatic Dispersion","Fresnel Response","Directional Glare"].map((x,i)=><div className="stack-row" key={x}><span>{String(i+1).padStart(2,"0")}</span><b>{x}</b><i/></div>)}<div className="readout"><span>REFRACTION</span><strong>{material.refFactor.toFixed(2)}</strong><span>THICKNESS</span><strong>{material.refThickness}</strong><span>DISPERSION</span><strong>{material.refDispersion}</strong><span>GLARE</span><strong>{material.glareFactor}</strong></div></aside>
  </section>
 </main>;
}
createRoot(document.getElementById("root")).render(<App/>);
