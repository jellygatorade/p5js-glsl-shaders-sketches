precision mediump float;

uniform vec2 canvasResolution;
uniform float time;

uniform sampler2D tex0;
uniform sampler2D tex1;
uniform sampler2D tex2;

void main() {
  vec2 uv = gl_FragCoord.xy / canvasResolution.xy;

  uv *= 2.;

  // Flip the y-axis to place the image texture (will be flipped on y when loading from p5.js)
  vec2 flipY = vec2( uv.x, 1.0 - uv.y);

  vec4 color0 = texture2D(tex0, flipY);
  vec4 color1 = texture2D(tex1, flipY);
  vec4 color2 = texture2D(tex2, flipY);

  // cycle through textures every 100 frames
  float cycle_time = mod(time * 0.01, 3.);
  if (cycle_time >= 1. && cycle_time < 2.) {
    gl_FragColor = color0;
  } else if (cycle_time >= 2.) {
    gl_FragColor = color1;
  } else {
    gl_FragColor = color2;
  }
}