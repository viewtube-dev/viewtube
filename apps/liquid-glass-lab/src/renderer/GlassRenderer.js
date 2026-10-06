import {FULLSCREEN_VERTEX_SHADER,BLUR_FRAGMENT_SHADER,GLASS_FRAGMENT_SHADER} from "./shaders.js";
function shader(gl,type,source){const s=gl.createShader(type);gl.shaderSource(s,source);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw Error(gl.getShaderInfoLog(s));return s;}
function program(gl,fragment){const p=gl.createProgram();gl.attachShader(p,shader(gl,gl.VERTEX_SHADER,FULLSCREEN_VERTEX_SHADER));gl.attachShader(p,shader(gl,gl.FRAGMENT_SHADER,fragment));gl.linkProgram(p);if(!gl.getProgramParameter(p,gl.LINK_STATUS))throw Error(gl.getProgramInfoLog(p));return p;}
function texture(gl,w,h){const t=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,t);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,w,h,0,gl.RGBA,gl.UNSIGNED_BYTE,null);return t;}
function target(gl,w,h){const t=texture(gl,w,h),f=gl.createFramebuffer();gl.bindFramebuffer(gl.FRAMEBUFFER,f);gl.framebufferTexture2D(gl.FRAMEBUFFER,gl.COLOR_ATTACHMENT0,gl.TEXTURE_2D,t,0);return{t,f};}
function hex(s){const n=parseInt(s.slice(1),16);return[(n>>16&255)/255,(n>>8&255)/255,(n&255)/255];}
export class GlassRenderer{
 constructor(canvas){
  this.canvas=canvas;this.gl=canvas.getContext("webgl2",{antialias:true,alpha:false});if(!this.gl)throw Error("WebGL2 is required.");
  const gl=this.gl;this.blur=program(gl,BLUR_FRAGMENT_SHADER);this.glass=program(gl,GLASS_FRAGMENT_SHADER);
  this.vao=gl.createVertexArray();gl.bindVertexArray(this.vao);const b=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,b);
  gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),gl.STATIC_DRAW);
  const l=gl.getAttribLocation(this.glass,"aPosition");gl.enableVertexAttribArray(l);gl.vertexAttribPointer(l,2,gl.FLOAT,false,0,0);
  this.blurAttr=gl.getAttribLocation(this.blur,"aPosition");this.size=[1,1];
 }
 resize(w,h){const gl=this.gl,d=Math.min(devicePixelRatio||1,2);w=Math.max(1,Math.floor(w*d));h=Math.max(1,Math.floor(h*d));if(this.size[0]===w&&this.size[1]===h)return;this.size=[w,h];this.canvas.width=w;this.canvas.height=h;this.environment=texture(gl,w,h);this.blurV=target(gl,w,h);this.blurH=target(gl,w,h);}
 uploadEnvironment(source){const gl=this.gl;gl.bindTexture(gl.TEXTURE_2D,this.environment);gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,true);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,source);}
 blurPass(src,dst,dir){const gl=this.gl;gl.useProgram(this.blur);gl.bindVertexArray(this.vao);const l=this.blurAttr;gl.enableVertexAttribArray(l);gl.vertexAttribPointer(l,2,gl.FLOAT,false,0,0);gl.bindFramebuffer(gl.FRAMEBUFFER,dst.f);gl.viewport(0,0,...this.size);gl.activeTexture(gl.TEXTURE0);gl.bindTexture(gl.TEXTURE_2D,src);gl.uniform1i(gl.getUniformLocation(this.blur,"uTexture"),0);gl.uniform2f(gl.getUniformLocation(this.blur,"uTexel"),1/this.size[0],1/this.size[1]);gl.uniform2f(gl.getUniformLocation(this.blur,"uDirection"),...dir);gl.drawArrays(gl.TRIANGLE_STRIP,0,4);}
 render(rects){
  const gl=this.gl;this.blurPass(this.environment,this.blurV,[0,1]);this.blurPass(this.blurV,this.blurH,[1,0]);gl.bindFramebuffer(gl.FRAMEBUFFER,null);gl.viewport(0,0,...this.size);gl.clearColor(.94,.95,.97,1);gl.clear(gl.COLOR_BUFFER_BIT);gl.useProgram(this.glass);gl.bindVertexArray(this.vao);
  for(const r of rects){const bind=(n,v)=>{const l=gl.getUniformLocation(this.glass,n);if(typeof v==="number")gl.uniform1f(l,v);else if(v.length===2)gl.uniform2fv(l,v);else gl.uniform4fv(l,v);};
   gl.activeTexture(gl.TEXTURE0);gl.bindTexture(gl.TEXTURE_2D,this.environment);gl.uniform1i(gl.getUniformLocation(this.glass,"uEnvironment"),0);
   gl.activeTexture(gl.TEXTURE1);gl.bindTexture(gl.TEXTURE_2D,this.blurH);gl.uniform1i(gl.getUniformLocation(this.glass,"uBlurredEnvironment"),1);
   bind("uResolution",this.size);bind("uRect",[r.x*this.size[0],(1-r.y-r.h)*this.size[1],r.w*this.size[0],r.h*this.size[1]]);
   for(const k of ["radius","refThickness","refDistance","refFactor","refDispersion","refFresnelRange","refFresnelHardness","refFresnelFactor","glareRange","glareHardness","glareFactor","glareConvergence","glareOppositeFactor","glareAngle"])bind("u"+k[0].toUpperCase()+k.slice(1),r[k]);
   const c=hex(r.tint);bind("uTint",[c[0],c[1],c[2],r.tintAlpha]);gl.drawArrays(gl.TRIANGLE_STRIP,0,4);
  }
 }
}