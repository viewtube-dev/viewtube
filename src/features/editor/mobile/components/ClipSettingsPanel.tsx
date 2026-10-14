import React,{useMemo,useRef,useState} from 'react';
import {AudioLines,Circle,FileText,ImageIcon,LayoutTemplate,RectangleHorizontal,Save,Type,Video} from 'lucide-react';
import type {EditorLayer,EditorStore} from '../state/editorState';
import {readClipVisualTransform} from '../state/editorState';
import type {EditorNavPage} from './EditorNavigationPages';
import type {VtE1Clip} from '../../../../shared/vtE1TimelineContract';
import {AcceleratingStepper as HoldStepper,LinkToggle,RotationDial,XYJoystick} from './MobileEditorPrimitives';
import {ClipEffects} from './EffectsLibrariesPanel';
import {canSlipSourceWindow,SOURCE_SLIP_STEPS} from '../state/sourceSlipControls';
import {captureVideoFrameAsFile,sourceFrameTime} from '../state/videoFrameCapture';
import {exportCroppedImageAsFile} from '../state/imageCropExport';
import {uploadImageDerivative} from '../state/imageDerivativeStorage';
import {createVersionedAsset} from '../../../../services/assetEngine';
import {getContentBuild} from '../../../../services/asset-engine/ContentBuildRepository';
import {parseSrtCaptions} from '../state/srtCaptionImport';
import {buildSrtCaptions} from '../state/srtCaptionExport';
import {resolveCaptionShiftDelta} from '../state/captionTiming';
import {AudioWaveformInspector} from './AudioWaveformInspector';

const BLACK='#111111';
const MAGENTA='#ff00ff';
const ORANGE='#ffb570';
const YELLOW='#ffff61';
const GREEN='#00ff00';
const BLUE='#579aff';
const PURPLE='#cc00ff';
const INK='#248b99';
const CYAN='#36E0F6';
const CLIP_TYPE_COLORS:Record<string,string>={
  text:MAGENTA,shape:ORANGE,image:YELLOW,media:GREEN,video:GREEN,audio:BLUE,
  'design-template':PURPLE,'remotion-asset':CYAN,compound:CYAN,
};
const CLIP_COLOR_CHOICES=[CYAN,MAGENTA,YELLOW,GREEN,BLUE,PURPLE,ORANGE];
const RECENT_COLORS_KEY='viewtube.editor.recent-colors.v1';
const CONTROL_PRESETS_KEY='viewtube.editor.control-presets.v1';

type Payload=Record<string,unknown>;

const addButtonBase:React.CSSProperties={
  boxSizing:'border-box',border:`2px solid ${BLACK}`,margin:0,padding:'4px 8px',
  fontWeight:900,fontSize:9,letterSpacing:'.01em',color:'#111',borderRadius:7,
  touchAction:'manipulation',textTransform:'uppercase',justifyContent:'center',
  alignItems:'center',gap:6,minHeight:38,display:'inline-flex',position:'relative',
  overflow:'hidden',boxShadow:'2px 2px 0 rgba(0,0,0,.18)',width:60,cursor:'pointer',
};

const miniButton:React.CSSProperties={
  minHeight:28,border:`2px solid ${BLACK}`,borderRadius:6,background:'#fff',
  color:'#111',fontSize:8,fontWeight:900,textTransform:'uppercase',padding:'3px 6px',
};

const sectionLabel:React.CSSProperties={
  fontSize:10,fontWeight:900,textTransform:'uppercase',opacity:.7,margin:'4px 0 6px',
};

const valueInput:React.CSSProperties={
  boxSizing:'border-box',border:`2px solid ${INK}`,margin:0,padding:'2px 6px',
  fontWeight:800,fontSize:9,color:'inherit',background:'#fff',borderRadius:6,textAlign:'center',
  minWidth:36,width:'100%',height:24,caretColor:INK,outline:'none',
};

const clamp=(value:number,min:number,max:number)=>Math.max(min,Math.min(max,value));
const number=(value:unknown,fallback:number)=>Number.isFinite(Number(value))?Number(value):fallback;
const uid=(prefix:string)=>`${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2,7)}`;

function targetTrack(store:EditorStore,kind:'video'|'overlay'|'audio'){
  return store.state.project.tracks.find(track=>track.kind===kind)
    ??store.state.project.tracks.find(track=>kind==='audio'?track.kind==='audio':track.kind!=='audio')
    ??store.state.project.tracks[0];
}

function defaultPayload(type:'text'|'shape'|'media'|'audio',index:number):Payload{
  return{
    layerName:`${type.toUpperCase()}_${index+1}`,
    x:0,y:0,scale:1,rotation:0,opacity:1,
    blur:0,saturation:1,brightness:1,hue:0,
    fillColor:index%2? '#36E0F6':MAGENTA,
    strokeColor:BLACK,strokeWidth:type==='audio'?0:2,
    width:type==='text'?960:type==='media'?960:260,
    height:type==='text'?120:type==='media'?540:140,
    cornerRadius:type==='shape'?10:0,
    polygonSides:5,polygonInnerRadius:0,
    text:type==='text'?`TEXT_${index+1}`:'',
    fontSize:type==='text'?44:24,fontFamily:'Outfit',textAlign:'center',
    shape:type==='shape'?'rect':'rect',
    mediaUrl:'',mediaName:'',mediaKind:type==='audio'?'audio':'',
    fit:'cover',volume:type==='audio' ? 0.6 : 1,muted:false,audioSrcType:type==='audio'?'file':'',
    effects:[],
  };
}

function createLayerClip(store:EditorStore,type:'text'|'shape',payloadPatch:Payload={}){
  const track=targetTrack(store,'overlay');
  if(!track)return;
  const layerId=uid('layer');
  const clipId=uid('clip');
  const payload={...defaultPayload(type,store.state.project.layers.length),...payloadPatch};
  const layer:EditorLayer={id:layerId,trackId:track.id,type,visible:true,payload};
  const start=store.state.playheadSec;
  const end=Math.min(Math.max(store.state.project.durationSec,start+4),start+4);
  const clip:VtE1Clip={id:clipId,trackId:track.id,layerId,start,end,keyframes:[]};
  store.dispatch({type:'addLayerClip',layer,clip});
}

function fitMediaSize(width:number,height:number){
  const w=Math.max(1,width),h=Math.max(1,height);
  const scale=Math.min(960/w,540/h,1);
  return{width:Math.max(1,Math.round(w*scale)),height:Math.max(1,Math.round(h*scale))};
}

function SrtCaptionImportControl({store}:{store:EditorStore}){
  const inputRef=useRef<HTMLInputElement>(null);
  const[busy,setBusy]=useState(false);
  const[message,setMessage]=useState('');
  const importFile=async(file:File)=>{
    setBusy(true);setMessage('');
    try{
      if(file.size>5*1024*1024)throw new Error('SRT files must be 5 MB or smaller.');
      const cues=parseSrtCaptions(await file.text());
      if(!cues.length)throw new Error('No valid timed captions were found in this SRT file.');
      const existingTrack=store.state.project.tracks.find(track=>track.kind==='caption');
      const track=existingTrack??{id:uid('track_caption'),name:'Captions',kind:'caption' as const};
      const trackId=track.id;
      const meta=(store.state.project.meta??{}) as Record<string,unknown>;
      const landscape=String(meta.aspectRatio??meta.aspect??'9:16')==='16:9'||meta.aspect==='landscape';
      const layers:EditorLayer[]=cues.map((cue,index)=>({
        id:uid('caption_layer'),trackId,type:'text',visible:true,
        payload:{
          ...defaultPayload('text',store.state.project.layers.length+index),
          layerName:`Caption ${index+1}`,text:cue.text,fontSize:40,
          width:960,height:120,y:landscape?350:650,
          fillColor:'#ffffff',strokeColor:'#111111',strokeWidth:2,textAlign:'center',
          captionSource:file.name,captionIndex:index+1,
        },
      }));
      const clips:VtE1Clip[]=cues.map((cue,index)=>({
        id:uid('caption_clip'),trackId,layerId:layers[index].id,
        start:cue.startSec,end:cue.endSec,keyframes:[],
      }));
      store.dispatch({type:'importCaptionBatch',track:existingTrack?null:track,layers,clips});
      setMessage(`Imported ${cues.length} captions from ${file.name}. Undo removes the batch.`);
    }catch(reason){
      setMessage(reason instanceof Error?reason.message:'Caption import failed.');
    }finally{setBusy(false)}
  };
  const captionTrackIds=new Set(store.state.project.tracks.filter(track=>track.kind==='caption').map(track=>track.id));
  const captionClips=store.state.project.clips.filter(clip=>captionTrackIds.has(clip.trackId));
  const captionRanges=captionClips.map(clip=>({startSec:clip.start,endSec:clip.end}));
  const resolvedShift=(deltaSec:number)=>resolveCaptionShiftDelta(captionRanges,deltaSec);
  const shiftCaptions=(requestedDeltaSec:number)=>{
    const deltaSec=resolvedShift(requestedDeltaSec);
    if(!deltaSec){setMessage('Caption timing cannot shift further without moving a cue before zero.');return;}
    store.dispatch({type:'shiftCaptionBatch',deltaSec});
    setMessage('Shifted '+captionClips.length+' caption cues by '+(deltaSec>0?'+':'')+deltaSec.toFixed(3)+'s. Undo restores the previous timing.');
  };
  const exportSrt=()=>{
    setMessage('');
    try{
      const cues=captionClips.map(clip=>{
        const layer=clip.layerId?store.layerById(String(clip.layerId)):undefined;
        return {startSec:clip.start,endSec:clip.end,text:String(layer?.payload?.text??'')};
      });
      const content=buildSrtCaptions(cues);
      if(!content){setMessage('No valid timed caption clips are available to export.');return;}
      const project=store.state.project as typeof store.state.project&{name?:unknown;title?:unknown};
      const fileBase=String(project.name??project.title??'viewtube-captions')
        .replace(/[^\\w.-]+/g,'-').replace(/^-+|-+$/g,'')||'viewtube-captions';
      const url=URL.createObjectURL(new Blob([content],{type:'application/x-subrip;charset=utf-8'}));
      const anchor=document.createElement('a');
      anchor.href=url;anchor.download=fileBase+'.srt';anchor.click();
      window.setTimeout(()=>URL.revokeObjectURL(url),1000);
      setMessage('Exported timed caption track as '+fileBase+'.srt.');
    }catch(reason){
      setMessage(reason instanceof Error?reason.message:'Caption export failed.');
    }
  };
  return <div style={{gridColumn:'1 / -1',minWidth:0}}>
    <div style={{display:'grid',gap:3}}>
      <button type="button" style={{...addButtonBase,background:YELLOW,color:BLACK,width:'100%',minWidth:0,padding:'4px'}} disabled={busy} onClick={()=>inputRef.current?.click()}><FileText size={13}/>{busy?'IMPORTING SRT…':'IMPORT SRT CAPTIONS'}</button>
      <button type="button" style={{...addButtonBase,background:CYAN,color:BLACK,width:'100%',minWidth:0,padding:'4px'}} disabled={busy} onClick={exportSrt}><Save size={13}/>EXPORT SRT CAPTIONS</button>
    </div>
    <div style={{display:'grid',gridTemplateColumns:'repeat(4,minmax(0,1fr))',gap:3,marginTop:3}}>
      {[-0.5,-0.1,0.1,0.5].map(delta=><button key={delta} type="button" style={{...addButtonBase,minWidth:0,padding:'3px 2px',fontSize:8,background:delta<0?PINK:GREEN,color:BLACK}} disabled={busy||!captionClips.length||resolvedShift(delta)===0} onClick={()=>shiftCaptions(delta)}>{delta<0?'−':'+'}{Math.abs(delta).toFixed(1)}s</button>)}
    </div>
    <input ref={inputRef} type="file" accept=".srt,text/plain" hidden onChange={event=>{const file=event.currentTarget.files?.[0];event.currentTarget.value='';if(file)void importFile(file)}}/>
    {message?<div role="status" style={{fontSize:8,fontWeight:800,marginTop:4,overflowWrap:'anywhere'}}>{message}</div>:null}
  </div>;
}

async function addFileClip(store:EditorStore,file:File,kind:'image'|'video'|'audio'){
  const url=URL.createObjectURL(file);
  const index=store.state.project.layers.length;
  const track=targetTrack(store,kind==='audio'?'audio':'video');
  if(!track)return;
  const layerId=uid('layer'),clipId=uid('clip');
  let durationSec=kind==='image'?4:0;
  let size={width:960,height:540};

  if(kind==='image'){
    await new Promise<void>(resolve=>{
      const img=new window.Image();
      img.onload=()=>{size=fitMediaSize(img.naturalWidth||1920,img.naturalHeight||1080);resolve()};
      img.onerror=()=>resolve();
      img.src=url;
    });
  }else{
    await new Promise<void>(resolve=>{
      const media=document.createElement(kind==='audio'?'audio':'video');
      media.preload='metadata';
      media.onloadedmetadata=()=>{
        durationSec=Number.isFinite(media.duration)&&media.duration>0?media.duration:4;
        if(kind==='video')size=fitMediaSize((media as HTMLVideoElement).videoWidth||1920,(media as HTMLVideoElement).videoHeight||1080);
        resolve();
      };
      media.onerror=()=>{durationSec=4;resolve()};
      media.src=url;
    });
  }

  const type=kind==='audio'?'audio':'media';
  const payload={
    ...defaultPayload(type,index),
    layerName:file.name||`${kind.toUpperCase()}_${index+1}`,
    mediaUrl:url,mediaName:file.name||'',mediaMime:file.type||'',
    mediaKind:kind,
    sourceDurationSec:kind==='image'?undefined:durationSec,
    mediaDurationSec:kind==='image'?undefined:durationSec,
    sourceDurationUnknown:kind!=='image'&&!durationSec,
    width:size.width,height:size.height,
    strokeWidth:0,fillColor:'#111111',
    audioSrcType:kind==='audio'?'file':'',
  };
  const layer:EditorLayer={id:layerId,trackId:track.id,type,visible:true,payload};
  const start=store.state.playheadSec;
  const len=clamp(durationSec||4,.25,Math.max(4,store.state.project.durationSec||30));
  const clip:VtE1Clip={
    id:clipId,trackId:track.id,layerId,start,end:start+len,keyframes:[],
    sourceInSec:kind==='image'?undefined:0,
    sourceOutSec:kind==='image'?undefined:len,
    sourceDurationSec:kind==='image'?undefined:durationSec||undefined,
    sourceDurationUnknown:kind==='image'?undefined:!durationSec,
  };
  store.dispatch({type:'addLayerClip',layer,clip});
}

interface SettingDef{
  prop:string;
  label:string;
  min:number;
  max:number;
  step:number;
  fallback:number;
  toDisplay?:(value:number)=>number;
  fromDisplay?:(value:number)=>number;
}

const SETTINGS:SettingDef[]=[
  {prop:'x',label:'X PLACE',min:-5000,max:5000,step:1,fallback:0},
  {prop:'y',label:'Y PLACE',min:-5000,max:5000,step:1,fallback:0},
  {prop:'scale',label:'SCALE',min:.1,max:10,step:.01,fallback:1},
  {prop:'rotation',label:'ROTATION',min:-3000,max:3000,step:1,fallback:0},
  {prop:'opacity',label:'OPACITY',min:0,max:100,step:1,fallback:1,toDisplay:v=>v*100,fromDisplay:v=>v/100},
  {prop:'fontSize',label:'FONT SIZE',min:10,max:220,step:1,fallback:24},
  {prop:'blur',label:'BLUR',min:0,max:40,step:.1,fallback:0},
  {prop:'saturation',label:'SATURATION',min:0,max:3,step:.01,fallback:1},
  {prop:'hue',label:'HUE',min:-3000,max:3000,step:1,fallback:0},
  {prop:'brightness',label:'BRIGHTNESS',min:0,max:3,step:.01,fallback:1},
  {prop:'width',label:'WIDTH',min:1,max:5000,step:1,fallback:100},
  {prop:'height',label:'HEIGHT',min:1,max:5000,step:1,fallback:100},
  {prop:'strokeWidth',label:'STROKE WIDTH',min:0,max:20,step:.01,fallback:0},
  {prop:'cornerRadius',label:'CORNER RADIUS',min:0,max:80,step:1,fallback:0},
];

function keyframeState(clip:VtE1Clip,prop:string,playheadSec:number){
  const keyframes=Array.isArray(clip.keyframes)?clip.keyframes:[];
  const hasAny=keyframes.some(k=>Object.prototype.hasOwnProperty.call((k.values??{}) as object,prop));
  if(!hasAny)return'none' as const;
  const local=Math.max(0,playheadSec-clip.start);
  const active=keyframes.some(k=>Math.abs(Number(k.offsetSec??0)-local)<=.03&&Object.prototype.hasOwnProperty.call((k.values??{}) as object,prop));
  return active?'active' as const:'attached' as const;
}

const SettingRow:React.FC<{
  def:SettingDef;
  payload:Payload;
  clip:VtE1Clip;
  store:EditorStore;
  onPatch:(patch:Payload)=>void;
}>=({def,payload,clip,store,onPatch})=>{
  const raw=number(payload[def.prop],def.fallback);
  const display=def.toDisplay?def.toDisplay(raw):raw;
  const state=keyframeState(clip,def.prop,store.state.playheadSec);
  const commit=(nextDisplay:number)=>{
    const snapped=Math.round(clamp(nextDisplay,def.min,def.max)/def.step)*def.step;
    const next=def.fromDisplay?def.fromDisplay(snapped):snapped;
    onPatch({[def.prop]:next});
  };
  return <HoldStepper
    label={def.label}
    value={display}
    min={def.min}
    max={def.max}
    step={def.step}
    precision={def.step<1?2:0}
    suffix={def.prop==='opacity'?'%':''}
    onChange={commit}
    defaultValue={def.toDisplay?def.toDisplay(def.fallback):def.fallback}
    keyframeState={state}
    onKeyframe={()=>store.dispatch({type:'addClipKeyframeValue',clipId:clip.id,prop:def.prop,value:raw})}
  />;
};

const ColorControl:React.FC<{
  label:string;
  prop:'fillColor'|'strokeColor';
  payload:Payload;
  clip:VtE1Clip;
  store:EditorStore;
  onPatch:(patch:Payload)=>void;
}>=({label,prop,payload,clip,store,onPatch})=>{
  const value=String(payload[prop]??'#10152a');
  const state=keyframeState(clip,prop,store.state.playheadSec);
  return <label style={{fontSize:11,fontWeight:900}}>
    {label}
    <div style={{display:'flex',alignItems:'center',gap:8,marginTop:4}}>
      <input type="color" value={/^#[0-9a-f]{6}$/i.test(value)?value:'#10152a'} onChange={e=>onPatch({[prop]:e.target.value})}
        style={{boxSizing:'border-box',border:`2px solid ${BLACK}`,padding:3,width:'100%',height:36,cursor:'pointer',background:'#fff',borderRadius:5}}/>
      <button
        onClick={e=>{e.preventDefault();store.dispatch({type:'addClipKeyframeValue',clipId:clip.id,prop,value})}}
        style={{
          boxSizing:'border-box',border:`2px solid ${BLACK}`,padding:0,fontWeight:900,fontSize:14,lineHeight:1,
          color:BLACK,background:state==='active'?BLUE:state==='attached'?'#a8caff':'#fff',borderRadius:999,
          width:18,height:18,display:'inline-flex',alignItems:'center',justifyContent:'center',flex:'0 0 auto',
        }}
      ><Circle size={10}/></button>
    </div>
  </label>;
};

function SelectedClipSettings({store,onNavigate}:{store:EditorStore;onNavigate?:(page:EditorNavPage)=>void}){
  const[linkedSize,setLinkedSize]=useState(true);
  const[capturingFrame,setCapturingFrame]=useState(false);
  const[frameCaptureError,setFrameCaptureError]=useState('');
  const[savingFrameDerivative,setSavingFrameDerivative]=useState(false);
  const[frameDerivativeError,setFrameDerivativeError]=useState('');
  const[frameDerivativeMessage,setFrameDerivativeMessage]=useState('');
  const[exportingCrop,setExportingCrop]=useState(false);
  const[cropExportError,setCropExportError]=useState('');
  const[savingDerivative,setSavingDerivative]=useState(false);
  const[derivativeSaveError,setDerivativeSaveError]=useState('');
  const[derivativeSaveMessage,setDerivativeSaveMessage]=useState('');
  const[colorScope,setColorScope]=useState<'selected'|'group'|'track'>('selected');
  const[recentColors,setRecentColors]=useState<string[]>(()=>{
    if(typeof window==='undefined')return[];
    try{const raw=JSON.parse(localStorage.getItem(RECENT_COLORS_KEY)||'[]');return Array.isArray(raw)?raw.slice(0,7):[]}catch{return[]}
  });
  const[controlPresets,setControlPresets]=useState<Array<{name:string;payload:Payload}>>(()=>{
    if(typeof window==='undefined')return[];
    try{const raw=JSON.parse(localStorage.getItem(CONTROL_PRESETS_KEY)||'[]');return Array.isArray(raw)?raw.slice(0,12):[]}catch{return[]}
  });
  const clip=store.selectedClips[0];
  const layer=store.selectedLayer;
  if(!clip)return <div style={{width:'100%',minWidth:0,border:`2px solid ${BLACK}`,borderRadius:7,padding:8,background:'#fff',fontSize:9,fontWeight:900,textTransform:'uppercase'}}>Select a clip in the timeline or Project Clips list to edit every clip setting.</div>;

  if(!layer){
    const isTemplate=(clip as VtE1Clip&{clipType?:string}).clipType==='design-template';
    return <div style={{width:'100%',minWidth:0,border:`2px solid ${BLACK}`,borderRadius:7,padding:8,background:'#fff',fontSize:9,fontWeight:900}}>
      <div style={{textTransform:'uppercase',marginBottom:6}}>{String(clip.id)}</div>
      <div style={{opacity:.65,marginBottom:8}}>{isTemplate?'This design-template clip is edited in Templates.':'This legacy clip has no linked VT_E1 layer payload yet.'}</div>
      {isTemplate?<button style={{...miniButton,width:'100%',background:PURPLE,color:'#fff'}} onClick={()=>onNavigate?.('templates')}>Open Templates</button>:null}
    </div>;
  }

  const payload=layer.payload??{};
  const patch=(next:Payload)=>store.dispatch({type:'updateLayerPayload',id:layer.id,patch:next});
  const type=String(layer.type||'clip');
  const isText=type==='text';
  const isShape=type==='shape';
  const isMedia=type==='media';
  const isAudio=type==='audio';
  const sourceDurationSec=number(clip.sourceDurationSec??payload.sourceDurationSec??payload.mediaDurationSec,0);
  const sourceInSec=number(clip.sourceInSec,0);
  const sourceOutSec=number(clip.sourceOutSec,sourceInSec+Math.max(.1,clip.end-clip.start));
  const canSlipSource=(isAudio||(isMedia&&payload.mediaKind==='video'))&&sourceDurationSec>0;
  const canSlip=(deltaSec:number)=>canSlipSource&&canSlipSourceWindow(sourceInSec,sourceOutSec,sourceDurationSec,deltaSec);
  const slipSource=(deltaSec:number)=>store.dispatch({type:'slipClip',id:clip.id,deltaSec,sourceDurationSec});
  const isImageMedia=isMedia&&String(payload.mediaKind??'')==='image'&&typeof payload.mediaUrl==='string'&&Boolean(payload.mediaUrl);
  const exportCroppedImage=async(targetWidth?:number)=>{
    if(!isImageMedia)return;
    setExportingCrop(true);setCropExportError('');
    try{
      const sourceName=String(payload.mediaName??payload.layerName??'image').replace(/\.[^.]+$/,'').replace(/[^\w.-]+/g,'-')||'image';
      const suffix=targetWidth?`-${targetWidth}px`:'';
      const file=await exportCroppedImageAsFile(String(payload.mediaUrl),readClipVisualTransform(clip),`${sourceName}-crop${suffix}.png`,targetWidth);
      if(!file)throw new Error('The image could not be exported. The source may be unavailable or blocked by browser media permissions.');
      const url=URL.createObjectURL(file);
      const anchor=document.createElement('a');
      anchor.href=url;anchor.download=file.name;anchor.click();
      window.setTimeout(()=>URL.revokeObjectURL(url),1000);
    }catch(reason){
      setCropExportError(reason instanceof Error?reason.message:'Image export failed.');
    }finally{setExportingCrop(false)}
  };

  const saveCroppedImageDerivative=async(targetWidth?:number)=>{
    if(!isImageMedia||savingDerivative||exportingCrop)return;
    setSavingDerivative(true);setDerivativeSaveError('');setDerivativeSaveMessage('');
    let storedAssetUrl='';
    try{
      const sourceName=String(payload.mediaName??payload.layerName??'image').replace(/\.[^.]+$/,'').replace(/[^\w.-]+/g,'-')||'image';
      const suffix=targetWidth?'-'+targetWidth+'px':'';
      const file=await exportCroppedImageAsFile(String(payload.mediaUrl),readClipVisualTransform(clip),sourceName+'-crop'+suffix+'.png',targetWidth);
      if(!file)throw new Error('The image could not be cropped. The source may be unavailable or blocked by browser media permissions.');
      const stored=await uploadImageDerivative(file);
      storedAssetUrl=stored.assetUrl;
      const projectScope=store.state.project as typeof store.state.project&{contentBuildId?:string;id?:unknown;name?:unknown;title?:unknown};
      const meta=(store.state.project.meta??{}) as Record<string,unknown>;
      const candidateContentBuildId=typeof projectScope.contentBuildId==='string'
        ?projectScope.contentBuildId
        :typeof meta.contentBuildId==='string'?meta.contentBuildId:undefined;
      const contentBuildId=candidateContentBuildId&&getContentBuild(candidateContentBuildId)?candidateContentBuildId:undefined;
      const projectId=typeof projectScope.id==='string'?projectScope.id:undefined;
      const projectName=typeof projectScope.name==='string'?projectScope.name
        :typeof projectScope.title==='string'?projectScope.title
        :typeof meta.projectName==='string'?meta.projectName:undefined;
      const rawParentId=payload.sourceAssetId;
      const parentAssetId=typeof rawParentId==='string'&&rawParentId.trim()?rawParentId.trim():undefined;
      const transform=readClipVisualTransform(clip);
      const created=createVersionedAsset({
        sourceToolId:'vt-e1-editor',
        sourceKind:'studio-tool',
        payloadKind:'image',
        name:stored.fileName,
        summary:'Cropped PNG derivative from editor clip '+clip.id+'.',
        kind:'image',
        url:stored.assetUrl,
        mimeType:stored.mimeType,
        tags:['editor','image-derivative','crop','asset-engine'],
        slot:'image-derivative',
        label:stored.fileName,
        parentAssetId:parentAssetId||null,
        context:{
          contentBuildId,
          projectId,
          projectName,
          stage:'production',
          parentAssetIds:parentAssetId?[parentAssetId]:[],
          provenance:['VT_E1 crop export from clip '+clip.id,'Source media: '+String(payload.mediaName??payload.layerName??'unknown')],
        },
        metadata:{
          operation:'crop-export',
          parentClipId:clip.id,
          sourceMediaName:String(payload.mediaName??payload.layerName??'unknown'),
          sourceAssetId:parentAssetId||null,
          editorMediaWidth:number(payload.width,0),
          editorMediaHeight:number(payload.height,0),
          crop:transform,
          outputBytes:stored.bytes,
          storage:'vt-e1-render-worker',
        },
      });
      setDerivativeSaveMessage('Saved '+created.asset.name+' to the Vault asset library.'+(created.version?' Version and lineage recorded.':contentBuildId?'':' No active ContentBuild was linked.'));
    }catch(reason){
      const message=reason instanceof Error?reason.message:'Derivative save failed.';
      setDerivativeSaveError(storedAssetUrl
        ?'Image file was stored, but Vault registration failed. Stored path: '+storedAssetUrl+'. '+message
        :message);
    }finally{setSavingDerivative(false)}
  };

  const isVideoMedia=isMedia&&String(payload.mediaKind??'')==='video'&&typeof payload.mediaUrl==='string'&&Boolean(payload.mediaUrl);
  const playheadWithinClip=store.state.playheadSec>=clip.start&&store.state.playheadSec<clip.end;
  const captureFrame=async()=>{
    if(!isVideoMedia||!playheadWithinClip)return;
    setCapturingFrame(true);setFrameCaptureError('');
    try{
      const sourceTime=sourceFrameTime(store.state.playheadSec,clip.start,sourceInSec,sourceDurationSec);
      if(sourceTime===null)throw new Error('Source duration metadata is unavailable for this video.');
      const file=await captureVideoFrameAsFile(String(payload.mediaUrl),sourceTime,`frame-${sourceTime.toFixed(2).replace('.','-')}s.jpg`);
      if(!file)throw new Error('This frame could not be captured. The source may be unavailable or blocked by browser media permissions.');
      await addFileClip(store,file,'image');
    }catch(reason){
      setFrameCaptureError(reason instanceof Error?reason.message:'Frame capture failed.');
    }finally{setCapturingFrame(false)}
  };

  const saveVideoFrameDerivative=async()=>{
    if(!isVideoMedia||!playheadWithinClip||savingFrameDerivative)return;
    setSavingFrameDerivative(true);setFrameDerivativeError('');setFrameDerivativeMessage('');
    let storedAssetUrl='';
    try{
      const sourceTime=sourceFrameTime(store.state.playheadSec,clip.start,sourceInSec,sourceDurationSec);
      if(sourceTime===null)throw new Error('Source duration metadata is unavailable for this video.');
      const frameName='frame-'+sourceTime.toFixed(2).replace('.','-')+'s.jpg';
      const file=await captureVideoFrameAsFile(String(payload.mediaUrl),sourceTime,frameName);
      if(!file)throw new Error('This frame could not be captured. The source may be unavailable or blocked by browser media permissions.');
      const stored=await uploadImageDerivative(file);
      storedAssetUrl=stored.assetUrl;
      const projectScope=store.state.project as typeof store.state.project&{contentBuildId?:string;id?:unknown;name?:unknown;title?:unknown};
      const meta=(store.state.project.meta??{}) as Record<string,unknown>;
      const candidateContentBuildId=typeof projectScope.contentBuildId==='string'
        ?projectScope.contentBuildId
        :typeof meta.contentBuildId==='string'?meta.contentBuildId:undefined;
      const contentBuildId=candidateContentBuildId&&getContentBuild(candidateContentBuildId)?candidateContentBuildId:undefined;
      const projectId=typeof projectScope.id==='string'?projectScope.id:undefined;
      const projectName=typeof projectScope.name==='string'?projectScope.name
        :typeof projectScope.title==='string'?projectScope.title
        :typeof meta.projectName==='string'?meta.projectName:undefined;
      const rawParentId=payload.sourceAssetId;
      const parentAssetId=typeof rawParentId==='string'&&rawParentId.trim()?rawParentId.trim():undefined;
      const created=createVersionedAsset({
        sourceToolId:'vt-e1-editor',
        sourceKind:'studio-tool',
        payloadKind:'image',
        name:stored.fileName,
        summary:'Still frame extracted from video clip '+clip.id+' at source time '+sourceTime.toFixed(2)+'s.',
        kind:'image',
        url:stored.assetUrl,
        mimeType:stored.mimeType,
        tags:['editor','video-frame','image-derivative','asset-engine'],
        slot:'video-frame-still',
        label:stored.fileName,
        parentAssetId:parentAssetId||null,
        context:{
          contentBuildId,
          projectId,
          projectName,
          stage:'production',
          parentAssetIds:parentAssetId?[parentAssetId]:[],
          provenance:['VT_E1 frame capture from clip '+clip.id,'Source time: '+sourceTime.toFixed(3)+'s','Timeline time: '+store.state.playheadSec.toFixed(3)+'s'],
        },
        metadata:{
          operation:'video-frame-capture',
          parentClipId:clip.id,
          sourceMediaName:String(payload.mediaName??payload.layerName??'unknown'),
          sourceAssetId:parentAssetId||null,
          sourceTimeSec:sourceTime,
          timelineTimeSec:store.state.playheadSec,
          editorMediaWidth:number(payload.width,0),
          editorMediaHeight:number(payload.height,0),
          outputBytes:stored.bytes,
          storage:'vt-e1-render-worker',
        },
      });
      setFrameDerivativeMessage('Saved '+created.asset.name+' to the Vault asset library.'+(created.version?' Version and lineage recorded.':contentBuildId?'':' No active ContentBuild was linked.'));
    }catch(reason){
      const message=reason instanceof Error?reason.message:'Frame derivative save failed.';
      setFrameDerivativeError(storedAssetUrl
        ?'Frame file was stored, but Vault registration failed. Stored path: '+storedAssetUrl+'. '+message
        :message);
    }finally{setSavingFrameDerivative(false)}
  };

  const audioVolume=number(payload.volume,.6);
  const audioRate=number(payload.playbackRate,1);
  const widthValue=number(payload.width,100),heightValue=number(payload.height,100);
  const xValue=number(payload.x,0),yValue=number(payload.y,0),rotationValue=number(payload.rotation,0);
  const ratio=widthValue>0?heightValue/widthValue:1;
  const clipKind=String((clip as VtE1Clip&{clipType?:unknown}).clipType??payload.mediaKind??layer.type??'clip');
  const automaticClipColor=CLIP_TYPE_COLORS[clipKind]??CLIP_TYPE_COLORS[type]??CYAN;
  const rememberColor=(color:string)=>{
    const next=[color,...recentColors.filter(item=>item.toLowerCase()!==color.toLowerCase())].slice(0,7);
    setRecentColors(next);
    if(typeof window!=='undefined')localStorage.setItem(RECENT_COLORS_KEY,JSON.stringify(next));
  };
  const applyTimelineColor=(color:string)=>{
    const groupId=String((clip as VtE1Clip&{groupId?:unknown}).groupId??'');
    const ids=colorScope==='track'
      ?store.state.project.clips.filter(item=>item.trackId===clip.trackId).map(item=>item.id)
      :colorScope==='group'&&groupId
        ?store.state.project.clips.filter(item=>String((item as VtE1Clip&{groupId?:unknown}).groupId??'')===groupId).map(item=>item.id)
        :store.state.selection.clipIds.length?store.state.selection.clipIds:[clip.id];
    ids.forEach(id=>store.dispatch({type:'updateClip',id,patch:{uiColor:color} as Partial<VtE1Clip>}));
    rememberColor(color);
  };
  const saveControlPreset=()=>{
    const entry={name:String(payload.layerName??type)+' Preset',payload:{...payload}};
    const next=[entry,...controlPresets].slice(0,12);
    setControlPresets(next);
    if(typeof window!=='undefined')localStorage.setItem(CONTROL_PRESETS_KEY,JSON.stringify(next));
  };

  return <div style={{width:'100%',minWidth:0,maxWidth:'100%'}}>
    <div style={{display:'grid',gridTemplateColumns:'1fr auto',gap:4,alignItems:'center',marginBottom:8}}>
      <div style={{minWidth:0}}>
        <div style={{fontSize:9,fontWeight:900,textTransform:'uppercase',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{String(payload.layerName||clip.id)}</div>
        <div style={{fontSize:7,fontWeight:900,opacity:.55,textTransform:'uppercase'}}>{type} · {clip.start.toFixed(2)}–{clip.end.toFixed(2)}s</div>
      </div>
      <button style={{...miniButton,minWidth:34,background:layer.visible===false?'#fff':GREEN}} onClick={()=>store.dispatch({type:'setLayerVisible',id:layer.id,visible:layer.visible===false})}>{layer.visible===false?'SHOW':'ON'}</button>
    </div>

    <div style={sectionLabel}>TIMING</div>
    <HoldStepper
      label="START"
      value={clip.start}
      min={0}
      max={Math.max(0,clip.end-.1)}
      step={.05}
      precision={2}
      suffix="s"
      defaultValue={0}
      onChange={sec=>store.dispatch({type:'trimClip',id:clip.id,side:'left',sec})}
    />
    <HoldStepper
      label="END"
      value={clip.end}
      min={Math.min(store.state.project.durationSec,clip.start+.1)}
      max={store.state.project.durationSec}
      step={.05}
      precision={2}
      suffix="s"
      defaultValue={Math.min(store.state.project.durationSec,clip.start+4)}
      onChange={sec=>store.dispatch({type:'trimClip',id:clip.id,side:'right',sec})}
    />
    <HoldStepper
      label="DURATION"
      value={Math.max(.1,clip.end-clip.start)}
      min={.1}
      max={Math.max(.1,store.state.project.durationSec-clip.start)}
      step={.05}
      precision={2}
      suffix="s"
      defaultValue={4}
      onChange={duration=>store.dispatch({type:'trimClip',id:clip.id,side:'right',sec:clip.start+duration})}
    />

    {canSlipSource&&<div style={{margin:'8px 0 10px',padding:7,border:`2px solid ${BLACK}`,borderRadius:7,background:'#fff'}}>
      <div style={{fontSize:8,fontWeight:1000,textTransform:'uppercase',marginBottom:3}}>Source Window</div>
      <div style={{fontSize:8,fontWeight:800,opacity:.7,marginBottom:6}}>{sourceInSec.toFixed(2)}s → {sourceOutSec.toFixed(2)}s / {sourceDurationSec.toFixed(2)}s source</div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,minmax(0,1fr))',gap:4}}>
        {SOURCE_SLIP_STEPS.map(step=><button key={step.deltaSec} aria-label={step.ariaLabel} style={{...miniButton,width:'100%',opacity:canSlip(step.deltaSec)?1:.4}} disabled={!canSlip(step.deltaSec)} onClick={()=>slipSource(step.deltaSec)}>{step.label}</button>)}
      </div>
      <div style={{fontSize:7,fontWeight:800,opacity:.6,marginTop:5}}>Slip shifts source footage inside the fixed timeline span; clip position and duration stay unchanged.</div>
    </div>}

    <div style={sectionLabel}>TRANSFORM + TIMING</div>
    <div style={{display:'grid',gridTemplateColumns:'92px 76px',gap:8,alignItems:'start',marginBottom:8}}>
      <div>
        <div style={{fontSize:8,fontWeight:1000,textTransform:'uppercase',marginBottom:3}}>Position Pad</div>
        <XYJoystick x={xValue} y={yValue} range={500} onChange={value=>patch(value)} onReset={()=>patch({x:0,y:0})}/>
      </div>
      <div>
        <div style={{fontSize:8,fontWeight:1000,textTransform:'uppercase',marginBottom:3}}>Rotation</div>
        <RotationDial value={rotationValue} onChange={rotation=>patch({rotation})} onReset={()=>patch({rotation:0})}/>
      </div>
    </div>
    <div style={{display:'grid',gridTemplateColumns:'minmax(0,1fr)',gap:2,alignItems:'start'}}>
      {SETTINGS.filter(def=>!['x','y','rotation','width','height'].includes(def.prop)).map(def=><SettingRow key={def.prop} def={def} payload={payload} clip={clip} store={store} onPatch={patch}/>)}
      <HoldStepper label="WIDTH" value={widthValue} min={1} max={5000} step={1} defaultValue={100} precision={0}
        rightSlot={<LinkToggle linked={linkedSize} onChange={setLinkedSize} label="dimensions"/>}
        keyframeState={keyframeState(clip,'width',store.state.playheadSec)}
        onKeyframe={()=>store.dispatch({type:'addClipKeyframeValue',clipId:clip.id,prop:'width',value:widthValue})}
        onChange={width=>patch(linkedSize?{width,height:Math.max(1,width*ratio)}:{width})}/>
      <HoldStepper label="HEIGHT" value={heightValue} min={1} max={5000} step={1} defaultValue={100} precision={0}
        keyframeState={keyframeState(clip,'height',store.state.playheadSec)}
        onKeyframe={()=>store.dispatch({type:'addClipKeyframeValue',clipId:clip.id,prop:'height',value:heightValue})}
        onChange={height=>patch(linkedSize?{height,width:Math.max(1,height/Math.max(.001,ratio))}:{height})}/>
    </div>

    <div style={sectionLabel}>TIMELINE COLOR</div>
    <div style={{display:'grid',gridTemplateColumns:'repeat(3,minmax(0,1fr))',gap:3,marginBottom:5}}>
      {(['selected','group','track'] as const).map(scope=><button key={scope} style={{...miniButton,minHeight:24,padding:'2px 3px',background:colorScope===scope?CYAN:'#fff'}} onClick={()=>setColorScope(scope)}>{scope}</button>)}
    </div>
    <div style={{display:'grid',gridTemplateColumns:'repeat(8,minmax(0,1fr))',gap:3,marginBottom:5}}>
      <button title="Automatic color for clip type" aria-label="Automatic clip type color" onClick={()=>applyTimelineColor(automaticClipColor)} style={{aspectRatio:'1',border:`2px solid ${INK}`,borderRadius:4,background:automaticClipColor,padding:0,boxShadow:'inset 0 0 0 2px #fff'}}/>
      {CLIP_COLOR_CHOICES.map(color=><button key={color} title={color} aria-label={`Clip color ${color}`} onClick={()=>applyTimelineColor(color)} style={{aspectRatio:'1',border:`2px solid ${INK}`,borderRadius:4,background:color,padding:0}}/>)}
    </div>
    {recentColors.length?<div style={{display:'grid',gridTemplateColumns:'repeat(8,minmax(0,1fr))',gap:3,marginBottom:5}}>
      {recentColors.map(color=><button key={color} title={`Recent ${color}`} onClick={()=>applyTimelineColor(color)} style={{aspectRatio:'1',border:`2px solid ${INK}`,borderRadius:4,background:color,padding:0}}/>)}
      <label title="Custom clip color" style={{aspectRatio:'1',border:`2px solid ${INK}`,borderRadius:4,overflow:'hidden',position:'relative'}}>
        <input type="color" defaultValue={String((clip as VtE1Clip&{uiColor?:string}).uiColor??automaticClipColor)} onChange={e=>applyTimelineColor(e.target.value)} style={{position:'absolute',inset:-8,width:'calc(100% + 16px)',height:'calc(100% + 16px)',border:0,padding:0}}/>
      </label>
    </div>:<label style={{display:'block',width:26,height:26,border:`2px solid ${INK}`,borderRadius:4,overflow:'hidden',position:'relative',marginBottom:5}}>
      <input type="color" defaultValue={automaticClipColor} onChange={e=>applyTimelineColor(e.target.value)} style={{position:'absolute',inset:-8,width:42,height:42,border:0,padding:0}}/>
    </label>}

    <div style={sectionLabel}>CONTROL PRESETS</div>
    <button style={{...miniButton,width:'100%',display:'inline-flex',alignItems:'center',justifyContent:'center',gap:4,background:CYAN,marginBottom:4}} onClick={saveControlPreset}><Save size={11}/>Save Current Controls</button>
    {controlPresets.length?<div style={{display:'grid',gridTemplateColumns:'repeat(2,minmax(0,1fr))',gap:3,marginBottom:7}}>
      {controlPresets.slice(0,6).map((preset,index)=><button key={preset.name+index} style={{...miniButton,minWidth:0,overflow:'hidden',textOverflow:'ellipsis'}} onClick={()=>patch(preset.payload)}>{preset.name}</button>)}
    </div>:null}

    <div style={{display:'grid',gridTemplateColumns:'minmax(0,1fr)',gap:6,width:'100%',minWidth:0,marginTop:3}}>
      <div style={{...sectionLabel,marginBottom:0}}>APPEARANCE</div>
      <ColorControl label="Fill" prop="fillColor" payload={payload} clip={clip} store={store} onPatch={patch}/>
      <ColorControl label="Stroke" prop="strokeColor" payload={payload} clip={clip} store={store} onPatch={patch}/>
    </div>

    {isText?<div style={{marginTop:10}}>
      <div style={sectionLabel}>TEXT</div>
      <textarea value={String(payload.text??'')} onChange={e=>patch({text:e.target.value})} style={{...valueInput,height:54,textAlign:'left',resize:'vertical'}}/>
      <select value={String(payload.fontFamily??'Outfit')} onChange={e=>patch({fontFamily:e.target.value})} style={{...valueInput,height:30,marginTop:4}}>
        {['Outfit','Inter','Arial','Arial Black','Helvetica','Georgia','Times New Roman','Courier New','Impact'].map(font=><option key={font}>{font}</option>)}
      </select>
      <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:4,marginTop:4}}>
        {(['left','center','right'] as const).map(align=><button key={align} style={{...miniButton,background:String(payload.textAlign??'center')===align?BLUE:'#fff'}} onClick={()=>patch({textAlign:align})}>{align}</button>)}
      </div>
    </div>:null}

    {isShape?<div style={{marginTop:10}}>
      <div style={sectionLabel}>SHAPE</div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:4}}>
        {['rect','circle','polygon'].map(shape=><button key={shape} style={{...miniButton,background:String(payload.shape??'rect')===shape?ORANGE:'#fff'}} onClick={()=>patch({shape})}>{shape}</button>)}
      </div>
    </div>:null}

    {isMedia?<div style={{marginTop:10}}>
      <div style={sectionLabel}>MEDIA</div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:4}}>
        {['cover','contain'].map(fit=><button key={fit} style={{...miniButton,background:String(payload.fit??'cover')===fit?YELLOW:'#fff'}} onClick={()=>patch({fit})}>{fit}</button>)}
      </div>
      {String(payload.mediaKind??'')==='video'?<button style={{...miniButton,width:'100%',marginTop:4,background:Boolean(payload.muted)?'#fff':GREEN}} onClick={()=>patch({muted:!Boolean(payload.muted)})}>{Boolean(payload.muted)?'UNMUTE VIDEO':'MUTE VIDEO'}</button>:null}
      {String(payload.mediaKind??'')==='image'?<button style={{...miniButton,width:'100%',marginTop:4,background:savingDerivative?YELLOW:GREEN,opacity:savingDerivative||exportingCrop||!isImageMedia?0.45:1}} disabled={savingDerivative||exportingCrop||!isImageMedia} onClick={()=>void saveCroppedImageDerivative()}><Save size={12}/>{savingDerivative?'SAVING DERIVATIVE…':'SAVE DERIVATIVE TO VAULT'}</button>:null}
      {String(payload.mediaKind??'')==='image'?<button style={{...miniButton,width:'100%',marginTop:4,background:exportingCrop?YELLOW:CYAN,opacity:exportingCrop||savingDerivative||!isImageMedia?0.45:1}} disabled={exportingCrop||savingDerivative||!isImageMedia} onClick={()=>void exportCroppedImage()}><Save size={12}/>{exportingCrop?'EXPORTING PNG…':'DOWNLOAD CROPPED IMAGE (PNG)'}</button>:null}
      {String(payload.mediaKind??'')==='image'?<div style={{display:'grid',gridTemplateColumns:'repeat(3,minmax(0,1fr))',gap:4,marginTop:4}}>
        {[720,1080,1920].map(width=><button key={width} style={{...miniButton,minWidth:0,padding:'3px 2px',background:exportingCrop?YELLOW:'#fff',opacity:exportingCrop||savingDerivative||!isImageMedia?0.45:1}} disabled={exportingCrop||savingDerivative||!isImageMedia} onClick={()=>void exportCroppedImage(width)}>{width}W PNG</button>)}
      </div>:null}
      {derivativeSaveMessage?<div role='status' style={{fontSize:8,fontWeight:900,border:'1px solid '+INK,padding:5,marginTop:4,overflowWrap:'anywhere',background:GREEN}}>{derivativeSaveMessage}</div>:null}
      {derivativeSaveError?<div role='alert' style={{fontSize:8,fontWeight:900,border:'1px solid '+MAGENTA,padding:5,marginTop:4,overflowWrap:'anywhere'}}>{derivativeSaveError}</div>:null}
      {cropExportError?<div role='alert' style={{fontSize:8,fontWeight:900,border:'1px solid '+MAGENTA,padding:5,marginTop:4,overflowWrap:'anywhere'}}>{cropExportError}</div>:null}
      {String(payload.mediaKind??'')==='video'?<button style={{...miniButton,width:'100%',marginTop:4,background:savingFrameDerivative?YELLOW:GREEN,opacity:savingFrameDerivative||capturingFrame||!playheadWithinClip?0.45:1}} disabled={savingFrameDerivative||capturingFrame||!playheadWithinClip} onClick={()=>void saveVideoFrameDerivative()}><Save size={12}/>{savingFrameDerivative?'SAVING FRAME…':'SAVE FRAME TO VAULT'}</button>:null}
      {frameDerivativeMessage?<div role='status' style={{fontSize:8,fontWeight:900,border:'1px solid '+INK,padding:5,marginTop:4,overflowWrap:'anywhere',background:GREEN}}>{frameDerivativeMessage}</div>:null}
      {frameDerivativeError?<div role='alert' style={{fontSize:8,fontWeight:900,border:'1px solid '+MAGENTA,padding:5,marginTop:4,overflowWrap:'anywhere'}}>{frameDerivativeError}</div>:null}
      {String(payload.mediaKind??'')==='video'?<button style={{...miniButton,width:'100%',marginTop:4,background:capturingFrame?YELLOW:CYAN,opacity:capturingFrame||savingFrameDerivative||!playheadWithinClip?0.45:1}} disabled={capturingFrame||savingFrameDerivative||!playheadWithinClip} onClick={()=>void captureFrame()}><ImageIcon size={12}/>{capturingFrame?'CAPTURING FRAME…':'CAPTURE FRAME AS STILL'}</button>:null}
      {frameCaptureError?<div role='alert' style={{fontSize:8,fontWeight:900,border:'1px solid '+MAGENTA,padding:5,marginTop:4,overflowWrap:'anywhere'}}>{frameCaptureError}</div>:null}
    </div>:null}

    {isAudio?<div style={{marginTop:10}}>
      <div style={sectionLabel}>AUDIO</div>
      <HoldStepper label="VOLUME" value={audioVolume} min={0} max={1} step={.01} precision={2} onChange={volume=>patch({volume})}/>
      <HoldStepper label="PLAYBACK RATE" value={audioRate} min={.1} max={4} step={.1} precision={1} suffix="×" onChange={playbackRate=>patch({playbackRate})}/>
      <button style={{...miniButton,width:'100%',marginTop:4,background:Boolean(payload.muted)?'#fff':BLUE}} onClick={()=>patch({muted:!Boolean(payload.muted)})}>{Boolean(payload.muted)?'UNMUTE':'MUTE'}</button>
      {typeof payload.mediaUrl==='string'&&payload.mediaUrl?<AudioWaveformInspector src={payload.mediaUrl}/>:null}
    </div>:null}

  </div>;
}

export const ClipSettingsPanel:React.FC<{store:EditorStore;onNavigate?:(page:EditorNavPage)=>void}>=({store,onNavigate})=>{
  const imageRef=useRef<HTMLInputElement>(null);
  const videoRef=useRef<HTMLInputElement>(null);
  const audioRef=useRef<HTMLInputElement>(null);

  return <div style={{minWidth:0,width:'100%',maxWidth:'100%',display:'grid',alignContent:'start',justifyItems:'stretch',overflowX:'hidden'}}>
    <div style={{
      boxSizing:'border-box',border:`2px solid ${BLACK}`,padding:12,position:'relative',
      background:'#fff',borderRadius:8,width:'100%',minWidth:0,maxWidth:220,overflow:'hidden',
    }}>
      <div style={{display:'grid',gridTemplateColumns:'repeat(3,minmax(0,1fr))',gap:5,width:'100%',minWidth:0,marginBottom:10}}>
        <button style={{...addButtonBase,background:MAGENTA,width:'100%',minWidth:0,padding:'4px'}} onClick={()=>createLayerClip(store,'text')}><Type size={13}/>TEXT</button>
        <button style={{...addButtonBase,background:ORANGE,width:'100%',minWidth:0,padding:'4px'}} onClick={()=>createLayerClip(store,'shape')}><RectangleHorizontal size={13}/>SHAPE</button>
        <button style={{...addButtonBase,background:YELLOW,width:'100%',minWidth:0,padding:'4px'}} onClick={()=>imageRef.current?.click()}><ImageIcon size={13}/>IMAGE</button>
        <button style={{...addButtonBase,background:GREEN,width:'100%',minWidth:0,padding:'4px'}} onClick={()=>videoRef.current?.click()}><Video size={13}/>VIDEO</button>
        <button style={{...addButtonBase,background:BLUE,width:'100%',minWidth:0,padding:'4px'}} onClick={()=>audioRef.current?.click()}><AudioLines size={13}/>AUDIO</button>
        <button style={{...addButtonBase,background:PURPLE,color:'#fff',width:'100%',minWidth:0,padding:'4px'}} onClick={()=>onNavigate?.('templates')}><LayoutTemplate size={13}/>TEMPLATE</button>
        <SrtCaptionImportControl store={store}/>
      </div>

      <input ref={imageRef} type="file" accept="image/*" hidden onChange={e=>{const file=e.target.files?.[0];e.target.value='';if(file)void addFileClip(store,file,'image')}}/>
      <input ref={videoRef} type="file" accept="video/*,.mp4,.mov,.webm,.m4v" hidden onChange={e=>{const file=e.target.files?.[0];e.target.value='';if(file)void addFileClip(store,file,'video')}}/>
      <input ref={audioRef} type="file" accept="audio/*,.mp3,.wav,.m4a,.aac,.ogg" hidden onChange={e=>{const file=e.target.files?.[0];e.target.value='';if(file)void addFileClip(store,file,'audio')}}/>

      <SelectedClipSettings store={store} onNavigate={onNavigate}/>
      <div style={{marginTop:8}}><ClipEffects store={store}/></div>
    </div>

    <div style={{boxSizing:'border-box',border:`2px solid ${BLACK}`,padding:8,background:'#fff',borderRadius:8,width:'100%',minWidth:0,maxWidth:220,marginTop:8,overflow:'hidden'}}>
      <div style={{fontSize:10,fontWeight:900,textTransform:'uppercase',marginBottom:6}}>PROJECT CLIPS</div>
      <div style={{display:'grid',gap:4,maxHeight:140,overflow:'auto'}}>
        {store.state.project.clips.map(clip=>{
          const layer=clip.layerId?store.layerById(String(clip.layerId)):undefined;
          const selected=store.state.selection.clipIds.includes(clip.id);
          return <button key={clip.id} style={{...miniButton,textAlign:'left',background:selected?BLUE:'#fff',overflow:'hidden'}} onClick={()=>store.dispatch({type:'selectClip',id:clip.id})}>
            <span style={{display:'block',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{String(layer?.payload?.layerName??clip.id)}</span>
            <span style={{display:'block',fontSize:7,opacity:.65}}>{String(layer?.type??store.trackById(clip.trackId)?.kind??'clip').toUpperCase()} · {clip.start.toFixed(1)}–{clip.end.toFixed(1)}s</span>
          </button>;
        })}
        {!store.state.project.clips.length?<div style={{fontSize:9,fontWeight:900,opacity:.55}}>NO CLIPS YET</div>:null}
      </div>
    </div>
  </div>;
};
