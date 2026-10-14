import React from 'react';
import {AudioLines,Film,FolderKanban,LayoutTemplate,ScanSearch,Settings as SettingsIcon,Shuffle,SlidersHorizontal,Type,Upload} from 'lucide-react';
import type {EditorStore} from '../state/editorState';
import {readClipVisualTransform} from '../state/editorState';
import {cropToAspectRatio} from '../state/cropPresets';
import {resolveVtE1FxValue,resetVtE1FxPatch} from '../../../../shared/vtE1FxCatalog';
import {renderPanelBody} from './PanelBodies';
import {EditorFeatureManifest} from './EditorFeatureManifest';
import {EditorViewSwitcher} from './EditorViewSwitcher';
import {ClipSettingsPanel} from './ClipSettingsPanel';
import {ProjectSettingsPanel} from './ProjectSettingsPanel';
import {EffectsLibrariesPanel} from './EffectsLibrariesPanel';
import {UnifiedDesignLibraryPanel} from './UnifiedDesignLibraryPanel';
import {ExportRenderPanel} from './ExportRenderPanel';
import {capabilitiesForCategory,type EditorCapabilityStatus} from '../../editorCapabilities';
import {AcceleratingStepper,LinkToggle} from './MobileEditorPrimitives';

export type EditorNavPage='project'|'select'|'media'|'text'|'audio'|'graphics'|'effects'|'transitions'|'templates'|'custom-templates'|'export'|'settings';

export interface EditorSettingsModel{
  frontend:'auto'|'mobile'|'desktop';
  layout?:'auto'|'portrait'|'landscape';
  aspect:'portrait'|'landscape';
  style:string;
  styleOptions:Array<{id:string;label:string;shortLabel?:string}>;
  onFrontend:(v:'auto'|'mobile'|'desktop')=>void;
  onLayout?:(v:'auto'|'portrait'|'landscape')=>void;
  onAspect:(v:'portrait'|'landscape')=>void;
  onStyle:(v:string)=>void;
  layoutDraggingEnabled?:boolean;
  onLayoutDraggingEnabled?:(enabled:boolean)=>void;
  onBackToSite?:()=>void;
}

const CYAN='#36E0F6',INK='#248b99',YELLOW='#FFFF61',PINK='#FA618A';
const card:React.CSSProperties={border:`2px solid ${INK}`,borderRadius:6,background:'#fff',padding:8,boxShadow:'2px 2px 0 rgba(54,224,246,.22)',marginBottom:6};
const title:React.CSSProperties={fontSize:10,fontWeight:900,textTransform:'uppercase',letterSpacing:.7,marginBottom:6};
const button:React.CSSProperties={minHeight:34,border:`2px solid ${INK}`,borderRadius:5,background:'#fff',color:'#000',fontSize:9,fontWeight:900,textTransform:'uppercase',padding:'5px 8px'};
const field:React.CSSProperties={width:'100%',height:34,border:`2px solid ${INK}`,borderRadius:5,background:'#fff',fontSize:10,fontWeight:800,padding:'0 7px',boxSizing:'border-box'};
const Section:React.FC<React.PropsWithChildren<{name:string}>>=({name,children})=><section style={card}><div style={title}>{name}</div>{children}</section>;
const Grid:React.FC<React.PropsWithChildren<{cols?:number}>>=({cols=2,children})=><div style={{display:'grid',gridTemplateColumns:`repeat(${cols},minmax(0,1fr))`,gap:5}}>{children}</div>;
const statusLabel:Record<EditorCapabilityStatus,string>={active:'ACTIVE',available:'AVAILABLE',planned:'PLANNED'};
const CapabilityGrid=({category}:{category:'edit'|'media'|'settings'})=><Grid>{capabilitiesForCategory(category).map(c=><div key={c.id} style={{...button,opacity:c.status==='planned'?.5:1}}>{c.label}<div style={{fontSize:6}}>{statusLabel[c.status]}</div></div>)}</Grid>;
const StepperField=({label,value,min=-5000,max=5000,step=.01,defaultValue=0,onChange,rightSlot}:{label:string;value:number;min?:number;max?:number;step?:number;defaultValue?:number;onChange:(n:number)=>void;rightSlot?:React.ReactNode})=>
  <AcceleratingStepper label={label} value={value} min={min} max={max} step={step} defaultValue={defaultValue} precision={step<1?2:0} onChange={onChange} rightSlot={rightSlot}/>;

function Inspector({store}:{store:EditorStore}){
  const[linkedScale,setLinkedScale]=React.useState(true);
  const clip=store.selectedClips[0];
  const track=store.state.selection.trackId?store.trackById(store.state.selection.trackId):undefined;
  const transition=store.state.selection.transitionId?(store.state.project.transitions??[]).find((t,i)=>String((t as{id?:unknown}).id??`${t.leftClipId}-${t.rightClipId}-${i}`)===store.state.selection.transitionId):undefined;
  if(track)return <Section name="Track"><b>{track.name}</b><div>{track.kind.toUpperCase()} · {store.clipsOnTrack(track.id).length} clips</div><div style={{fontSize:8,fontWeight:800,opacity:.6,marginTop:5}}>Track mute, lock, hide and removal live in the timeline row controls.</div></Section>;
  if(transition)return <><Section name="Transition"><b>{transition.leftClipId} → {transition.rightClipId}</b></Section><Section name="Transition Controls"><Grid><button style={button} onClick={()=>store.dispatch({type:'openPanel',id:'transitions'})}>Edit</button><button style={{...button,background:PINK}} onClick={()=>store.dispatch({type:'removeTransition',id:store.state.selection.transitionId!})}>Remove</button></Grid></Section></>;
  if(!clip)return <Section name="Clip Inspector"><div style={{fontSize:10,fontWeight:800,opacity:.6,marginBottom:6}}>Select a clip, track, or transition from the timeline or Clips page.</div><CapabilityGrid category="edit"/></Section>;
  const v=readClipVisualTransform(clip),set=(patch:any)=>store.dispatch({type:'updateClipTransform',id:clip.id,patch});
  const mediaLayer=clip.layerId?store.layerById(String(clip.layerId)):undefined;
  const mediaPayload=(mediaLayer?.payload??{}) as Record<string,unknown>;
  const mediaKind=mediaPayload.mediaKind;
  const sourceWidth=Number(mediaPayload.width??0),sourceHeight=Number(mediaPayload.height??0);
  const hasMediaDimensions=(mediaKind==='image'||mediaKind==='video')&&sourceWidth>0&&sourceHeight>0;
  const applyAspect=(ratio:number)=>{const crop=hasMediaDimensions?cropToAspectRatio(sourceWidth,sourceHeight,ratio):null;if(crop)set(crop);};
  const patchFx=(patch:Record<string,unknown>)=>{if(mediaLayer)store.dispatch({type:'updateLayerPayload',id:mediaLayer.id,patch});};
  const project=store.state.project as Record<string,unknown>;
  const projectAspectRatio=project.aspect==='landscape'||project.aspectRatio==='16:9'?16/9:9/16;
  const projectRatioCrop=hasMediaDimensions?cropToAspectRatio(sourceWidth,sourceHeight,projectAspectRatio):null;
  const squareCrop=hasMediaDimensions?cropToAspectRatio(sourceWidth,sourceHeight,1):null;
  return <>
    <Section name="Clip"><b>{String(clip.id)}</b><div>{clip.start.toFixed(2)}s → {clip.end.toFixed(2)}s · {store.trackById(clip.trackId)?.kind??'clip'}</div></Section>
    <Section name="Transform">
      <Grid cols={3}>
        <button style={button} aria-label="Rotate clockwise 90 degrees" onClick={()=>set({rotation:v.rotation+90})}>Rotate +90°</button>
        <button style={button} aria-label="Rotate counterclockwise 90 degrees" onClick={()=>set({rotation:v.rotation-90})}>Rotate −90°</button>
        <button style={button} aria-label="Reset rotation only" onClick={()=>set({rotation:0})}>Reset Rotation</button>
      </Grid>
      <Grid>
        <StepperField label="X" value={v.x} step={1} defaultValue={0} onChange={x=>set({x})}/>
        <StepperField label="Y" value={v.y} step={1} defaultValue={0} onChange={y=>set({y})}/>
        <StepperField label="SCALE X" value={v.scaleX} min={.05} max={10} step={.01} defaultValue={1} rightSlot={<LinkToggle linked={linkedScale} onChange={setLinkedScale} label="scale"/>} onChange={scaleX=>set(linkedScale?{scaleX,scaleY:scaleX}:{scaleX})}/>
        <StepperField label="SCALE Y" value={v.scaleY} min={.05} max={10} step={.01} defaultValue={1} onChange={scaleY=>set(linkedScale?{scaleY,scaleX:scaleY}:{scaleY})}/>
        <StepperField label="ROTATION" value={v.rotation} min={-3600} max={3600} step={1} defaultValue={0} onChange={rotation=>set({rotation})}/>
        <StepperField label="OPACITY" value={v.opacity} min={0} max={1} step={.01} defaultValue={1} onChange={opacity=>set({opacity})}/>
      </Grid>
      <button style={{...button,width:'100%',marginTop:5}} onClick={()=>store.dispatch({type:'resetClipTransform',id:clip.id})}>Reset Transform</button>
    </Section>
    <Section name="Crop">
      <Grid cols={3}>
        <button style={button} disabled={!cropToAspectRatio(sourceWidth,sourceHeight,16/9)} aria-label="Crop to landscape 16 by 9" onClick={()=>applyAspect(16/9)}>16:9</button>
        <button style={button} disabled={!cropToAspectRatio(sourceWidth,sourceHeight,1)} aria-label="Crop to square 1 by 1" onClick={()=>applyAspect(1)}>1:1</button>
        <button style={button} disabled={!cropToAspectRatio(sourceWidth,sourceHeight,9/16)} aria-label="Crop to portrait 9 by 16" onClick={()=>applyAspect(9/16)}>9:16</button>
      </Grid>
      <div style={{fontSize:8,fontWeight:800,opacity:.65,marginBottom:5}}>Aspect presets use source dimensions when available and apply a centered, non-destructive crop.</div>
      <Grid cols={3}>
        <button style={button} aria-label="Apply centered 10 percent crop" onClick={()=>set({cropLeft:.1,cropRight:.1,cropTop:.1,cropBottom:.1})}>Center 10%</button>
        <button style={button} aria-label="Apply centered 20 percent crop" onClick={()=>set({cropLeft:.2,cropRight:.2,cropTop:.2,cropBottom:.2})}>Center 20%</button>
        <button style={{...button,opacity:projectRatioCrop?1:.4}} aria-label="Crop to project aspect ratio" disabled={!projectRatioCrop} onClick={()=>projectRatioCrop&&set(projectRatioCrop)}>Project Ratio</button>
        <button style={{...button,opacity:squareCrop?1:.4}} aria-label="Crop to square aspect ratio" disabled={!squareCrop} onClick={()=>squareCrop&&set(squareCrop)}>Square</button>
        <button style={button} aria-label="Reset crop only" onClick={()=>set({cropLeft:0,cropRight:0,cropTop:0,cropBottom:0})}>Reset Crop</button>
      </Grid>
      <Grid>
        <StepperField label="LEFT" value={v.cropLeft} min={0} max={.95} step={.01} defaultValue={0} onChange={cropLeft=>set({cropLeft})}/>
        <StepperField label="RIGHT" value={v.cropRight} min={0} max={.95} step={.01} defaultValue={0} onChange={cropRight=>set({cropRight})}/>
        <StepperField label="TOP" value={v.cropTop} min={0} max={.95} step={.01} defaultValue={0} onChange={cropTop=>set({cropTop})}/>
        <StepperField label="BOTTOM" value={v.cropBottom} min={0} max={.95} step={.01} defaultValue={0} onChange={cropBottom=>set({cropBottom})}/>
      </Grid>
      <div style={{fontSize:8,fontWeight:800,opacity:.65,marginTop:5}}>Non-destructive crop · use edge controls for fine framing. Quick crops preserve the source asset.</div>
    </Section>
    {(mediaKind==='image'||mediaKind==='video')&&mediaLayer&&<Section name="Quick Image Adjustments">
      <Grid>
        <StepperField label="BRIGHTNESS" value={resolveVtE1FxValue(mediaPayload,'brightness')} min={0} max={3} step={.05} defaultValue={1} onChange={brightness=>patchFx({brightness,fxBypass:false})}/>
        <StepperField label="CONTRAST" value={resolveVtE1FxValue(mediaPayload,'contrast')} min={0} max={3} step={.05} defaultValue={1} onChange={contrast=>patchFx({contrast,fxBypass:false})}/>
        <StepperField label="SATURATION" value={resolveVtE1FxValue(mediaPayload,'saturation')} min={0} max={3} step={.05} defaultValue={1} onChange={saturation=>patchFx({saturation,fxBypass:false})}/>
      </Grid>
      <Grid>
        <button style={button} onClick={()=>patchFx({brightness:1,contrast:1,saturation:1,fxBypass:false})}>Reset Tone</button>
        <button style={button} onClick={()=>patchFx(resetVtE1FxPatch())}>Reset All FX</button>
        <button style={button} onClick={()=>store.dispatch({type:'openPanel',id:'effects'})}>Full FX Panel</button>
      </Grid>
      <div style={{fontSize:8,fontWeight:800,opacity:.65,marginTop:5}}>Uses the shared VT_E1 filter contract; edits stay on the selected media layer and remain part of the editor project.</div>
    </Section>}
  </>;
}

function Clips({store,onNavigate}:{store:EditorStore;onNavigate?:(page:EditorNavPage)=>void}){
  return <ClipSettingsPanel store={store} onNavigate={onNavigate}/>;
}

function Settings({model}:{model?:EditorSettingsModel}){
  if(!model)return <><Section name="Editor Settings">Host-controlled settings.</Section><Section name="Feature System"><EditorFeatureManifest compact category="settings"/></Section></>;
  return <>
    <Section name="Site"><button style={{...button,width:'100%',background:CYAN,display:'inline-flex',alignItems:'center',justifyContent:'center',gap:6}} onClick={()=>model.onBackToSite?.()}><Upload size={14} style={{transform:'rotate(-90deg)'}}/>Back to Site</button></Section>
    <Section name="Interface & Phone Layout"><EditorViewSwitcher frontend={model.frontend} layout={model.layout??'auto'} onFrontend={model.onFrontend} onLayout={model.onLayout??(()=>{})}/></Section>
    <Section name="Module Layout">
      <div style={{fontSize:8,fontWeight:850,lineHeight:1.35,marginBottom:6,opacity:.68}}>Module drag handles stay hidden by default so they cannot cover the Preview or timeline. Turn dragging on only when you want to resize the workspace.</div>
      <Grid>
        <button style={{...button,background:!model.layoutDraggingEnabled?CYAN:'#fff'}} onClick={()=>model.onLayoutDraggingEnabled?.(false)}>Locked</button>
        <button style={{...button,background:model.layoutDraggingEnabled?YELLOW:'#fff'}} onClick={()=>model.onLayoutDraggingEnabled?.(true)}>Dragging On</button>
      </Grid>
    </Section>
    <Section name="Video"><Grid>{(['portrait','landscape']as const).map(v=><button key={v} style={{...button,background:model.aspect===v?CYAN:'#fff'}} onClick={()=>model.onAspect(v)}>{v==='portrait'?'9:16':'16:9'}</button>)}</Grid></Section>
    <Section name="Editor Style"><Grid>{model.styleOptions.map(o=><button key={o.id} style={{...button,background:model.style===o.id?YELLOW:'#fff'}} onClick={()=>model.onStyle(o.id)}>{o.shortLabel||o.label}</button>)}</Grid></Section>
    <Section name="Feature System"><EditorFeatureManifest compact category="settings"/></Section>
  </>;
}

export const EditorNavigationPage:React.FC<{page:EditorNavPage;store:EditorStore;settings?:EditorSettingsModel;onNavigate?:(page:EditorNavPage)=>void}>=({page,store,settings,onNavigate})=>{
  if(page==='project')return <ProjectSettingsPanel store={store}/>;
  if(page==='select')return <Inspector store={store}/>;
  if(page==='media')return <Clips store={store} onNavigate={onNavigate}/>;
  if(page==='graphics')return <UnifiedDesignLibraryPanel store={store}/>;
  if(page==='effects')return <EffectsLibrariesPanel store={store}/>;
  if(page==='templates')return <UnifiedDesignLibraryPanel store={store}/>;
  if(page==='custom-templates')return <UnifiedDesignLibraryPanel store={store}/>;
  if(page==='export')return <ExportRenderPanel store={store}/>;
  if(page==='settings')return <Settings model={settings}/>;
  return <div>{renderPanelBody(page,store)}</div>;
};

export const EDITOR_NAV_ITEMS:Array<{id:EditorNavPage;label:string;icon:React.ReactNode}>=[
  {id:'project',label:'Project',icon:<FolderKanban size={13}/>},
  {id:'media',label:'Clips',icon:<Film size={13}/>},
  {id:'select',label:'Inspect',icon:<ScanSearch size={13}/>},
  {id:'text',label:'Text',icon:<Type size={13}/>},
  {id:'audio',label:'Audio',icon:<AudioLines size={13}/>},
  {id:'effects',label:'Effects',icon:<SlidersHorizontal size={13}/>},
  {id:'transitions',label:'Transitions',icon:<Shuffle size={13}/>},
  {id:'templates',label:'Designs',icon:<LayoutTemplate size={13}/>},
  {id:'export',label:'Export',icon:<Upload size={13}/>},
  {id:'settings',label:'Settings',icon:<SettingsIcon size={13}/>},
];
