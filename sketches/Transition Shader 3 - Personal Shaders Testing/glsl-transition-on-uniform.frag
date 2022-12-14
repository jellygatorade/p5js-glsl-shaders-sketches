precision mediump float;

uniform sampler2D backbuffer;
uniform sampler2D radDistortTex;
uniform sampler2D voronoiMaskTex1;
uniform sampler2D voronoiMaskTex2;

uniform vec2 canvasResolution;

uniform float time;

uniform vec2 mouse;

uniform int shaderRequested;
uniform float transitionTime;

varying vec2 orig_vTexCoord;
varying vec2 fit_fill_vTexCoord;

/**************************
 * Colors - for Debugging *
 **************************/

vec4 red = vec4(1.0, 0.0, 0.0, 1.0);
vec4 green = vec4(0.0, 1.0, 0.0, 1.0);
vec4 blue = vec4(0.0, 0.0, 1.0, 1.0);

/***********
 * Easings *
 ***********/

// From https://github.com/glslify/glsl-easings
float cubicInOut(float t) {
  return t < 0.5
    ? 4.0 * t * t * t
    : 0.5 * pow(2.0 * t - 2.0, 3.0) + 1.0;
}

/***************
 * Transitions *
 ***************/

// Crossfade Transition
vec4 crossfade( vec4 color1, vec4 color2 ) {
  return mix(color1, color2, cubicInOut(transitionTime * 0.01));
}

// Noise transition following
// https://www.shadertoy.com/view/4lB3WG
float rand(vec2 known){
  return fract(sin(dot(known.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

vec4 noisefade( vec4 color1, vec4 color2 )
{ 
  vec2 uv = gl_FragCoord.xy / canvasResolution.xy;
  float random = rand(uv);

  float blend = cubicInOut(transitionTime * 0.01);
  
  blend = clamp(blend, 0.0, 1.0);

  if (random > blend) {
    blend = floor(blend);
  }

  if (random < blend) {
    blend = ceil(blend);
  }

  return mix(color1, color2, blend);
}

/***********
 * Shaders *
 ***********/

// Shadertoy Default
vec4 shadertoyDefault() {
  vec2 uv = gl_FragCoord.xy / canvasResolution.xy;
  vec3 col = 0.5 + 0.5 * cos(time * 0.05 + uv.xyx + vec3(0,2,4));
  return vec4(col, 1.0);
}

// Radial Distortion
vec4 pincushionViewer() {
  vec2 uv = ( 2. * gl_FragCoord.xy - canvasResolution.xy ) / canvasResolution.y;

  float aspect = canvasResolution.x / canvasResolution.y;
  vec2 m = mouse;
  m.x *= aspect;
  
  float sinTime = 0.5 * sin(time * 0.01) + 0.5;
  float scaleTexMap = sinTime + 2.;

  float radialDistortion = (pow((uv.x - m.x), 2.) + pow((uv.y - m.y), 2.)) * 1.0 + 2.0;

  vec2 flipY = vec2( uv.x , -1.0 * uv.y );
  flipY = (flipY / radialDistortion) * 1.0 - 0.5;

  return texture2D(radDistortTex, scaleTexMap * flipY);
}

// Voronoi Mask
vec2 hash(vec2 p ) {
   return fract(sin(vec2(dot(p, vec2(123.4, 748.6)), dot(p, vec2(547.3, 659.3))))*5232.85324);   
}

float voronoi(vec2 p) {
    vec2 n = floor(p);
    vec2 f = fract(p);
    float md = 5.0;
    vec2 m = vec2(0.0);
    for (int i = -1;i<=1;i++) {
        for (int j = -1;j<=1;j++) {
            vec2 g = vec2(i, j);
            vec2 o = hash(n+g);
            o = 0.5+0.5*sin(time*0.03+5.038*o);
            vec2 r = g + o - f;
            float d = dot(r, r);
            if (d<md) {
              md = d;
              m = n+g+o;
            }
        }
    }
    return md;
}

float ov(vec2 p) {
    float v = 0.0;
    float a = 0.4;
    for (int i = 0;i<3;i++) {
        v+= voronoi(p)*a;
        p*=2.0;
        a*=0.5;
    }
    return v;
}

vec4 voronoiMask() {

  // Voronoi
  vec2 vAspect = orig_vTexCoord * canvasResolution;
  vec2 uv = vAspect/160.0;
  vec4 black = vec4(0.0, 0.0, 0.0, 1.0);
  vec4 white = vec4(1.0, 1.0, 1.0, 1.0);

  vec4 voronoiMask = vec4(mix(black, white, smoothstep(0.0, 0.25, ov(uv))));

  // Images
  
  // Flip the y-axis to place the image texture (will be flipped on y when loading from p5.js)
  vec2 flipY = vec2( fit_fill_vTexCoord.x, 1.0 - fit_fill_vTexCoord.y);
  vec4 color1 = texture2D(voronoiMaskTex1, flipY);
  vec4 color2 = texture2D(voronoiMaskTex2, flipY);

  return mix(color1, color2, voronoiMask.r);
}

/********
 * Main *
 ********/

void main() {
  // Testing if else stacking
  if (shaderRequested == 1) {

    if (transitionTime > 100.) {
      gl_FragColor = pincushionViewer();
    } else {
      //vec2 uv = gl_FragCoord.xy / canvasResolution.xy;
      vec2 flipY = vec2( orig_vTexCoord.x, 1.0 - orig_vTexCoord.y);
      vec4 backbuffer_samp = texture2D(backbuffer, flipY); // or vec4 backbuffer_samp = texture2D(backbuffer, vec2(uv.x, 1.0 - uv.y));

      gl_FragColor = noisefade(backbuffer_samp, pincushionViewer());
    }
    
  } else if (shaderRequested == 2) {

    if (transitionTime > 100.) {
      gl_FragColor = shadertoyDefault();
    } else {
      //vec2 uv = gl_FragCoord.xy / canvasResolution.xy;
      vec2 flipY = vec2( orig_vTexCoord.x, 1.0 - orig_vTexCoord.y);
      vec4 backbuffer_samp = texture2D(backbuffer, flipY); // or vec4 backbuffer_samp = texture2D(backbuffer, vec2(uv.x, 1.0 - uv.y));

      gl_FragColor = noisefade(backbuffer_samp, shadertoyDefault());
    }

  } else if (shaderRequested == 3) {

    if (transitionTime > 100.) {
      gl_FragColor = voronoiMask();
    } else {
      //vec2 uv = gl_FragCoord.xy / canvasResolution.xy;
      vec2 flipY = vec2( orig_vTexCoord.x, 1.0 - orig_vTexCoord.y);
      vec4 backbuffer_samp = texture2D(backbuffer, flipY); // or vec4 backbuffer_samp = texture2D(backbuffer, vec2(uv.x, 1.0 - uv.y));

      gl_FragColor = noisefade(backbuffer_samp, voronoiMask());
    }

  }
}