import { useEffect,useState } from "react"
export type VisualViewportState={height:number|null;keyboardOpen:boolean;offsetTop:number}
export function useVisualViewportHeight(enabled=true):VisualViewportState{
 const [state,setState]=useState<VisualViewportState>({height:null,keyboardOpen:false,offsetTop:0})
 useEffect(()=>{if(!enabled||typeof window==="undefined")return
 const sync=()=>{const vv=window.visualViewport;const layoutHeight=window.innerHeight;if(!vv){setState({height:layoutHeight,keyboardOpen:false,offsetTop:0});return}const height=Math.round(Math.min(vv.height,layoutHeight));setState({height,keyboardOpen:layoutHeight-vv.height>80,offsetTop:Math.round(vv.offsetTop||0)})}
 sync();const vv=window.visualViewport;vv?.addEventListener("resize",sync);vv?.addEventListener("scroll",sync);window.addEventListener("resize",sync);window.addEventListener("orientationchange",sync)
 return()=>{vv?.removeEventListener("resize",sync);vv?.removeEventListener("scroll",sync);window.removeEventListener("resize",sync);window.removeEventListener("orientationchange",sync)}
 },[enabled]);return state
}
export default useVisualViewportHeight
