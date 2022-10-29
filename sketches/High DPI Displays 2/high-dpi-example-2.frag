precision mediump float;

uniform float devicePixelRatio;
uniform vec2 canvasResolution;
uniform float time;
uniform sampler2D texture;

varying vec2 vTexCoord;

void main() {
  vec2 canvasRes = vec2(0.0, 0.0);

  // cycle every 100 frames
  float cycle_time = mod(time * 0.01, 2.);
  if (cycle_time >= 1. && cycle_time < 2.) {
      // account for devicePixelRatio
      // for displays where (devicePixelRatio == 1.0) res will be the same
      canvasRes = canvasResolution * devicePixelRatio;
  } else {
      // don't account for devicePixelRatio
      canvasRes = canvasResolution;
  }

  vec2 uv = gl_FragCoord.xy / canvasRes.xy;

  vec2 flipY = vec2( uv.x, 1.0 - uv.y);
  gl_FragColor = texture2D(texture, flipY);
}