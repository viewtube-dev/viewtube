export const FULLSCREEN_VERTEX_SHADER = `
#version 300 es
in vec2 aPosition;
out vec2 vUv;
void main(){ vUv=aPosition*.5+.5; gl_Position=vec4(aPosition,0.,1.); }
`;

export const BLUR_FRAGMENT_SHADER = `
#version 300 es
precision highp float;
uniform sampler2D uTexture;
uniform vec2 uTexel;
uniform vec2 uDirection;
in vec2 vUv;
out vec4 outColor;
void main(){
 vec3 c=texture(uTexture,vUv).rgb*.227027;
 c+=texture(uTexture,vUv+uDirection*uTexel*1.384615).rgb*.316216;
 c+=texture(uTexture,vUv-uDirection*uTexel*1.384615).rgb*.316216;
 c+=texture(uTexture,vUv+uDirection*uTexel*3.230769).rgb*.070270;
 c+=texture(uTexture,vUv-uDirection*uTexel*3.230769).rgb*.070270;
 outColor=vec4(c,1.);
}
`;

export const GLASS_FRAGMENT_SHADER = `
#version 300 es
precision highp float;
uniform sampler2D uEnvironment,uBlurredEnvironment;
uniform vec2 uResolution;
uniform vec4 uRect;
uniform float uRadius,uThickness,uDistance,uRefFactor,uDispersion;
uniform float uFresnelRange,uFresnelHardness,uFresnelFactor;
uniform float uGlareRange,uGlareHardness,uGlareFactor,uGlareConvergence,uGlareOppositeFactor,uGlareAngle;
uniform vec4 uTint;
in vec2 vUv;
out vec4 outColor;
float sdRoundRect(vec2 p,vec2 b,float r){
 vec2 q=abs(p)-b+r;
 return min(max(q.x,q.y),0.)+length(max(q,0.))-r;
}
vec3 sampleDispersion(vec2 uv,vec2 o){
 float d=uDispersion/50.;
 float s=max(uRefFactor-1.,.05);
 vec2 r=uv+o*s*.98*(1.+d*.75);
 vec2 g=uv+o*s;
 vec2 b=uv+o*s*1.02*(1.+d*.75);
 return vec3(texture(uEnvironment,r).r,texture(uEnvironment,g).g,texture(uEnvironment,b).b);
}
void main(){
 vec2 px=vUv*uResolution;
 vec2 center=uRect.xy+uRect.zw*.5;
 vec2 local=px-center;
 vec2 halfSize=uRect.zw*.5;
 float radius=min(uRadius,min(halfSize.x,halfSize.y));
 float d=sdRoundRect(local,halfSize,radius);
 float alpha=1.-smoothstep(0.,1.5,d);
 if(alpha<=0.) discard;
 vec2 uv=px/uResolution;
 vec2 n=normalize(vec2(dFdx(d),dFdy(d))+vec2(1e-5));
 float edge=1.-smoothstep(0.,uThickness*.45+1.,abs(d));
 vec2 ro=n*(uDistance*.018)*uRefFactor;
 vec3 base=texture(uBlurredEnvironment,uv).rgb;
 vec3 refr=sampleDispersion(uv,ro);
 float fres=pow(clamp(edge,0.,1.),max(.15,uFresnelHardness/20.))*uFresnelFactor/100.;
 vec2 gdv=vec2(cos(radians(uGlareAngle)),sin(radians(uGlareAngle)));
 float gd=dot(n,gdv);
 float glare=pow(max(gd,0.),max(.2,uGlareConvergence/18.))*uGlareFactor/120.;
 glare+=pow(max(-gd,0.),3.)*uGlareOppositeFactor/100.*.18;
 glare*=smoothstep(0.,uGlareRange/12.+1.,abs(d));
 vec3 color=mix(base,refr,clamp(uRefFactor/4.,0.,1.));
 color=mix(color,uTint.rgb,uTint.a*.34);
 color+=vec3(1.)*fres*.55;
 color+=vec3(1.,.94,.86)*glare;
 color+=uTint.rgb*(edge*.72+fres*.55)*.16;
 outColor=vec4(color,alpha*.97);
}
`;
