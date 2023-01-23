precision mediump float;

// we need our texcoords for drawing textures
varying vec2 vTexCoord;

// images are sent to the shader as a variable type called sampler2D
uniform sampler2D landscapeTex1;
uniform sampler2D landscapeTex2;
uniform sampler2D maskImgTex;

void main() {
  // by default, our texcoords will be upside down
  // lets flip them by inverting the y component
  vec2 uv = vTexCoord;
  uv.y = 1.0 - uv.y;

  // we can access our image by using the GLSL shader function texture2D()
  // texture2D expects a sampler2D, and texture coordinates as it's input
  vec4 landscape1 = texture2D(landscapeTex1, uv);
  vec4 landscape2 = texture2D(landscapeTex2, uv);
  vec4 maskTex = texture2D(maskImgTex, uv);

  // lets invert the colors for fun
  //landscape1.rgb = 1.0 - landscape1.rgb;

  // masking is accomplished my mix()
  // a linear interpolation weighted by the mask value
  vec4 mixImages = mix(landscape2, landscape1, maskTex.r);
  
  gl_FragColor = mixImages;
}