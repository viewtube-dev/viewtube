import React,{useState} from 'react';
import {buildWaveformPeaks} from '../state/audioWaveform';

const INK='#248b99',CYAN='#36E0F6',YELLOW='#FFFF61',BLUE='#579aff';
const button:React.CSSProperties={width:'100%',minHeight:28,border:`1px solid ${INK}`,borderRadius:5,background:CYAN,fontSize:8,fontWeight:900,textTransform:'uppercase'};

export const AudioWaveformInspector:React.FC<{src:string}>=({src})=>{
  const[peaks,setPeaks]=useState<number[]>([]);
  const[loading,setLoading]=useState(false);
  const[error,setError]=useState('');
  const load=async()=>{
    setLoading(true);setError('');
    let context:AudioContext|undefined;
    try{
      const response=await fetch(src);
      if(!response.ok)throw new Error('The audio source could not be loaded.');
      const blob=await response.blob();
      if(blob.size>40*1024*1024)throw new Error('This audio file is too large for an in-panel waveform preview.');
      if(typeof window.AudioContext!=='function')throw new Error('Audio waveform decoding is not supported in this browser.');
      context=new AudioContext();
      const decoded=await context.decodeAudioData(await blob.arrayBuffer());
      const channels=Array.from({length:decoded.numberOfChannels},(_,index)=>decoded.getChannelData(index));
      const next=buildWaveformPeaks(channels,72);
      if(!next.length)throw new Error('No waveform samples were available.');
      setPeaks(next);
    }catch(reason){
      setError(reason instanceof Error?reason.message:'Could not analyze this audio source.');
    }finally{
      if(context)try{await context.close()}catch{}
      setLoading(false);
    }
  };
  return <div style={{marginTop:7,padding:6,border:`1px solid ${INK}`,borderRadius:5,background:'#fff'}}>
    <button type="button" style={{...button,background:loading?YELLOW:CYAN}} disabled={loading} onClick={()=>void load()}>{loading?'ANALYZING WAVEFORM…':peaks.length?'REFRESH WAVEFORM':'ANALYZE WAVEFORM'}</button>
    {peaks.length?<div role="img" aria-label="Audio waveform preview" style={{height:42,display:'flex',alignItems:'center',gap:2,marginTop:6,overflow:'hidden'}}>
      {peaks.map((peak,index)=><div key={index} style={{flex:1,minWidth:1,height:`${Math.max(4,peak*100)}%`,background:BLUE,borderRadius:2}}/>)}
    </div>:null}
    {error?<div role="alert" style={{fontSize:8,fontWeight:900,marginTop:5,overflowWrap:'anywhere'}}>{error}</div>:null}
    <div style={{fontSize:7,fontWeight:800,opacity:.6,marginTop:4}}>On-demand preview only; this does not modify the source audio.</div>
  </div>;
};
