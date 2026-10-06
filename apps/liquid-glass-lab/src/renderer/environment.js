export function drawEnvironment(ctx,w,h,time){
 ctx.clearRect(0,0,w,h);
 const g=ctx.createLinearGradient(0,0,w,h);g.addColorStop(0,"#090a12");g.addColorStop(.45,"#f7d447");g.addColorStop(1,"#d43b68");
 ctx.fillStyle=g;ctx.fillRect(0,0,w,h);
 for(let i=0;i<18;i++){const x=((i*137+time*.04)%(w+240))-120,y=(i*83+Math.sin(time*.001+i)*80+h*.12)%h,s=42+(i%5)*26;
  ctx.fillStyle="hsl("+((i*47+time*.01)%360)+" 88% 58%)";ctx.beginPath();ctx.arc(x,y,s,0,Math.PI*2);ctx.fill();}
 ctx.fillStyle="#111";ctx.font="900 "+Math.max(18,w*.018)+"px system-ui";ctx.fillText("VIEWTUBE / OPTICAL ENVIRONMENT",w*.06,h*.14);
 ctx.fillRect(w*.06,h*.19,w*.62,Math.max(3,h*.008));
 ctx.font="900 "+Math.max(12,w*.012)+"px system-ui";
 ["REFRACTION","DEPTH","DISPERSION","FRESNEL","GLARE","BLUR","TINT"].forEach((x,i)=>ctx.fillText(x,w*.07+i*w*.12,h*.86));
}
