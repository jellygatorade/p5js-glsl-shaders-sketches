precision mediump float;

uniform vec2 res;
uniform sampler2D buffer;
uniform float time;
uniform vec2 mouse;
uniform bool mouseDown;

// texcoords for drawing textures
varying vec2 vTexCoord;

void main() {
  vec2 uv = gl_FragCoord.xy / res.xy;

  // Flip the y-axis to place the image texture (will be flipped on y when loading from p5.js)
  vec2 flipY = vec2( vTexCoord.x, 1.0 - vTexCoord.y );
  vec4 buffer_samp = texture2D(buffer, flipY); // or, vec4 buffer_samp = texture2D(buffer, vec2(uv.x, 1.0 - uv.y));

  vec4 gradient = vec4(uv.x, uv.y, 0.0, 1.0);
  vec4 black = vec4(0.0, 0.0, 0.0, 1.0);
  vec4 fragColor = black;

  // Mouse drag location. Small white circle.
  float distToMouse = distance(gl_FragCoord.xy, mouse * res);
  fragColor += vec4( smoothstep(8., 4., distToMouse) );

  vec4 finalOut = mouseDown == true ? fragColor + vec4(buffer_samp.xyz * 0.85, 1.0) : fragColor;
  
  gl_FragColor = finalOut;
}