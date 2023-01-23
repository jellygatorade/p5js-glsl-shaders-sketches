// Following
// Transition And Warping by Noise
// https://www.shadertoy.com/view/Mslfz4

precision mediump float;

// we need texcoords and resolution for calculating aspect ratio
varying vec2 vTexCoord;
uniform vec2 canvasResolution;
vec2 vAspect;

// time uniform variable coming from p5
uniform float time;

// images are sent to the shader as a variable type called sampler2D
uniform sampler2D imgTex1;
uniform sampler2D imgTex2;

#define TIME_SCALE_FACTOR 0.005
#define ASPECT_SCALE_FACTOR 1000.

// Simplex 2D noise
// from https://gist.github.com/patriciogonzalezvivo/670c22f3966e662d2f83
vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }

float snoise(vec2 v){
  const vec4 C = vec4(0.211324865405187, 0.366025403784439,
           -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy) );
  vec2 x0 = v -   i + dot(i, C.xx);
  vec2 i1;
  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
  + i.x + vec3(0.0, i1.x, 1.0 ));
  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
    dot(x12.zw,x12.zw)), 0.0);
  m = m*m ;
  m = m*m ;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

void main()
{
	  // vec2 uv = gl_FragCoord.xy / canvasResolution.xy;
    // uv.y = 1.0 - uv.y;

    // preserve pattern scale when aspect ratio changes
    vAspect.x = vTexCoord.x * canvasResolution.x / ASPECT_SCALE_FACTOR;
    vAspect.y = vTexCoord.y * canvasResolution.y / ASPECT_SCALE_FACTOR;
    
    vec2 uv = vAspect;
    uv.y = 1.0 - uv.y;

    float t1 = time * TIME_SCALE_FACTOR;

    uv.x += snoise(vec2(uv.x, t1)) / 10.0;
    uv.y += snoise(vec2(uv.y, t1 + 5555.0)) / 10.0;
    
    vec4 c0 = texture2D(imgTex1, uv);
    vec4 c1 = texture2D(imgTex2, uv);
    float t0 = t1;
    float t = snoise(vec2(t0, t0 + 1000.0));
    float m = snoise(uv + t);
    vec4 c = mix(c0, c1, m);
	  gl_FragColor = c;
}


// void main() {
//   // by default, our texcoords will be upside down
//   // lets flip them by inverting the y component
//   vec2 uv = vTexCoord;
//   uv.y = 1.0 - uv.y;

//   // we can access our image by using the GLSL shader function texture2D()
//   // texture2D expects a sampler2D, and texture coordinates as it's input
//   vec4 landscape1 = texture2D(landscapeTex1, uv);
//   vec4 landscape2 = texture2D(landscapeTex2, uv);
//   vec4 maskTex = texture2D(maskImgTex, uv);

//   // lets invert the colors for fun
//   //landscape1.rgb = 1.0 - landscape1.rgb;

//   // masking is accomplished my mix()
//   // a linear interpolation weighted by the mask value
//   vec4 mixImages = mix(landscape2, landscape1, maskTex.r);
  
//   gl_FragColor = mixImages;
// }