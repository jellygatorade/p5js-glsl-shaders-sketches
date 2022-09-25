// #ifdef GL_ES
// precision highp float;
// #endif

precision mediump float;

uniform vec2 res;
uniform sampler2D buffer;
uniform bool discardBackBuffer;
uniform float time;
uniform vec2 mouse;

// texcoords for drawing textures
varying vec2 vTexCoord;

void main() {
  vec2 uv = gl_FragCoord.xy / res.xy;
  float t = time * 0.1;

  // Flip the y-axis to place the image texture (will be flipped on y when loading from p5.js)
  vec2 flipY = vec2( vTexCoord.x, 1.0 - vTexCoord.y);
  vec4 buffer_samp = texture2D(buffer, flipY);

  vec4 shaderToyDefault = vec4(0.5 + 0.5 * cos(t + uv.xyx + vec3(0,2,4)), 1.0);
  vec4 gradient = vec4(uv.x, uv.y, 0.0, 1.0);
  vec4 black = vec4(0.0, 0.0, 0.0, 1.0);
  vec4 fragColor = gradient;

  // Mouse drag location. Small white circle.
  float distToMouse = distance(gl_FragCoord.xy, mouse * res);
  fragColor += vec4( smoothstep(8., 4., distToMouse) );

  float mixval;
  if (discardBackBuffer) {
    mixval = 0.0;
  } else {
    mixval = 0.5;
  }
  vec4 finalOut = mix(fragColor, buffer_samp, mixval);
  
  gl_FragColor = finalOut;
}