precision mediump float;

uniform vec2 canvasResolution;
uniform float time;

void main() {
  vec2 uv = gl_FragCoord.xy / canvasResolution.xy;

  vec3 col = 0.5 + 0.5 * cos(time * 0.05 + uv.xyx + vec3(0,2,4));

  gl_FragColor = vec4(col, 1.0);
}