precision mediump float;

uniform vec2 canvasResolution;
uniform vec2 mouse;

void main() {
  vec2 uv = gl_FragCoord.xy / canvasResolution;

  vec4 fragColor = vec4(uv.x, uv.y, 0.0, 1.0);
  
  vec2 mousePosCanvasRes = mouse * canvasResolution;

  float distToMouse = distance(gl_FragCoord.xy, mousePosCanvasRes);
  fragColor += vec4( smoothstep(8., 4., distToMouse) );

  gl_FragColor = fragColor;
}