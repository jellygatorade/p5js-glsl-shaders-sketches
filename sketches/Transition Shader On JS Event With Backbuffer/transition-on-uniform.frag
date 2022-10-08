precision mediump float;

uniform sampler2D buffer;
uniform sampler2D texture;
uniform int shaderRequested;
uniform float time;
uniform float transitionTime;
uniform vec2 canvasResolution;

uniform vec2 mouse;

varying vec2 vTexCoord;

vec4 red = vec4(1.0, 0.0, 0.0, 1.0);
vec4 green = vec4(0.0, 1.0, 0.0, 1.0);
vec4 blue = vec4(0.0, 0.0, 1.0, 1.0);

// Pseudocode below should be updated to reflect current process - 2022-10-08

// Btn click event triggers shaderRequested uniform change in JS
// main() contains if / else tree for doing something with uniform value
// each time uniform changes
// gl_FragColor = transition function with known duration that accepts previous shader and next shader
// once known time passes, or transition function completely showing next shader, change a variable that indicates it is over
// then gl_FragColor = next shader

// To be added
//
// JavaScript timer for determining if shader should be within the transition state
// --> Can be determined by how many frames have been counted, when does cubicInOut reach 1?
// --> It reaches 1 when the input is 1 ->
// -----> https://www.desmos.com/calculator
// -----> 4\cdot x^{3}, 0.5*\left(2*x-2\right)^{3}+1
// --> So, if I am scaling transitionTime uniform by 0.01, it takes 100 frames

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

  return texture2D(texture, scaleTexMap * flipY);
}

/********
 * Main *
 ********/

void main() {
  vec2 uv = gl_FragCoord.xy / canvasResolution.xy;
  vec2 flipY = vec2( vTexCoord.x, 1.0 - vTexCoord.y);
  vec4 buffer_samp = texture2D(buffer, flipY); // or vec4 buffer_samp = texture2D(buffer, vec2(uv.x, 1.0 - uv.y));

  if (shaderRequested == 1) {
    //gl_FragColor = noisefade(buffer_samp, red);
        // Testing if else stacking
    if (transitionTime > 100.) {
      gl_FragColor = pincushionViewer();
    } else {
      gl_FragColor = noisefade(buffer_samp, pincushionViewer());
    }
  } else if (shaderRequested == 2) {
    // Testing if else stacking
    if (transitionTime > 100.) {
      gl_FragColor = shadertoyDefault();
    } else {
      gl_FragColor = noisefade(buffer_samp, shadertoyDefault());
    }
    //gl_FragColor = noisefade(buffer_samp, shadertoydefault());
  } else if (shaderRequested == 3) {
    gl_FragColor = noisefade(buffer_samp, blue);
  }
}