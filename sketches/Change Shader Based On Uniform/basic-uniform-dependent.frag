precision mediump float;

uniform bool boolean;

void main() {
  vec4 red = vec4(1.0, 0.0, 0.0, 1.0);
  vec4 blue = vec4(0.0, 0.0, 1.0, 1.0);

  if (boolean) {
    gl_FragColor = red;
  } else {
    gl_FragColor = blue;
  }
}