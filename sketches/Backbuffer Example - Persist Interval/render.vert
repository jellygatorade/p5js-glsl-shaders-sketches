// https://github.com/aferriss/p5jsShaderExamples
// This vertex shader only functions to draw a rectangle to draw the image.

#ifdef GL_ES
precision highp float;
#endif

attribute vec3 aPosition;
attribute vec2 aTexCoord;

// we need our texcoords again
varying vec2 vTexCoord;

// Always include this to get the position of the pixel and map the shader correctly onto the shape

void main() {

  // copy the texcoords
  vTexCoord = aTexCoord;

  // Copy the position data into a vec4, adding 1.0 as the w parameter
  vec4 positionVec4 = vec4(aPosition, 1.0);

  // Scale to make the output fit the canvas
  positionVec4.xy = positionVec4.xy * 2.0 - 1.0; 

  // Send the vertex information on to the fragment shader
  gl_Position = positionVec4;
}