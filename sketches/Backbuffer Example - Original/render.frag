#ifdef GL_ES
precision highp float;
#endif

uniform float pixel_density;
uniform vec2 res;
uniform sampler2D buffer;
uniform float time;
uniform vec2 mouse;

void main() {
  // gl_FragCoord.xy can be thought of as the position of the pixel
  vec2 st = gl_FragCoord.xy;
  
  vec3 col = vec3(0);
  
  // the pixel position is changing to a value between 0 and 1
  vec2 tc = st / (res * pixel_density);
  
  // the pixel position is changing to a value between 0 and 1
  vec2 buffer_tc = st / (res * pixel_density);
  // corrected because the back buffer y direction is reversed
  buffer_tc.y = 1. + buffer_tc.y * -1.; 
  
  // get pixel values from the back buffer image with a function called texture2D.
  // texture2D(texture, texture coordinates (between 0 and 1))
  vec3 buffer_samp = texture2D(buffer, buffer_tc).xyz;
  
  // radius of circle
  float r = 0.1;

  // depending on the condition, pixels that meet the criteria of the circle become white.
  float ell = smoothstep(r,r-0.01,length((tc-mouse) * res / res.y));
  
  // adds a darker pixel value from the previous screen to the current screen
  col = vec3(ell) + buffer_samp.xyz * 0.98;
  
  // the number of pixels actually drawn on the screen
  gl_FragColor = vec4(col,1.0);
}