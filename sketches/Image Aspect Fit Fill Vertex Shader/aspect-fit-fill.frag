precision mediump float;

// texcoords for drawing textures
varying vec2 vTexCoord;

// Image
uniform sampler2D texture;

void main() {
  // Flip the y-axis to place the image texture (will be flipped on y when loading from p5.js)
  vec2 flipY = vec2( vTexCoord.x, 1.0 - vTexCoord.y);
  vec4 color = texture2D(texture, flipY);

  // For aspect fit
  // This condition will not be met for aspect fill
  vec4 yellow = vec4(1.0, 1.0, 0.0, 1.0);
  if (vTexCoord.x < 0.0 || vTexCoord.x > 1.0 ||
    vTexCoord.y < 0.0 || vTexCoord.y > 1.0) {
    color = yellow;
  }

  gl_FragColor = color;
}