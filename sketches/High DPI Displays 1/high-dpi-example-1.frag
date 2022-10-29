precision mediump float;

uniform float devicePixelRatio;
uniform vec2 canvasResolution;
uniform float time;

float calc(float param) {
  float const0 = 50.;
  float const1 = const0 / 2.;

  float value = ((floor(pow(param, 2.0) * const0)/const0) - (floor(pow(param, 2.0) * const1)/const1)) * const0;

  return value;
}

void main() {
  vec2 res = vec2(0.0, 0.0);

  // cycle every 100 frames
  float cycle_time = mod(time * 0.01, 2.);

  if (cycle_time >= 1. && cycle_time < 2.) {

    // account for devicePixelRatio
    // for displays where (devicePixelRatio == 1.0) res will be the same
    res = canvasResolution.xy * devicePixelRatio;

  } else {

    // don't account for devicePixelRatio
    res = canvasResolution.xy;

  }

  vec2 uv = gl_FragCoord.xy / res.xy;

  gl_FragColor = vec4(calc(uv.x), calc(uv.y), 0.0, 1.0);
}