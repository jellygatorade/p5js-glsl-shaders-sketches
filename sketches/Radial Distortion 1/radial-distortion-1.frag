precision mediump float;

uniform sampler2D texture;
uniform vec2 canvasResolution;
uniform vec2 mouse;
uniform float time;

varying vec2 vTexCoord;

void main() {
  // Center coordinates at 0, with x and y in range [-1,1]:
  vec2 uv = ( 2. * gl_FragCoord.xy - canvasResolution.xy ) / canvasResolution.y;

  float aspect = canvasResolution.x / canvasResolution.y;
  vec2 m = mouse;
  m.x *= aspect;

  float sinTime = 0.5 * sin(time * 0.01) + 0.5;
  //float scaleDistortion = sinTime + 1.;
  float scaleTexMap = sinTime + 2.;

  float radialDistortion = (pow((uv.x - m.x), 2.) + pow((uv.y - m.y), 2.)) * 1.0 + 2.0; // These values

  vec2 flipY = vec2( uv.x , -1.0 * uv.y );
  flipY = (flipY / radialDistortion) * 1.0 - 0.5;

  gl_FragColor = texture2D(texture, scaleTexMap * flipY);
}