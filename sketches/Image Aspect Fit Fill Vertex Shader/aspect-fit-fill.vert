// Following methodology for aspect fit and aspect fill as described in
// "Aspect Fit and Aspect Fill content mode with OpenGL ES 2.0" from Stack Overflow
// https://stackoverflow.com/questions/62821286/aspect-fit-and-aspect-fill-content-mode-with-opengl-es-2-0

precision mediump float;

// vertex data
attribute vec3 aPosition;
attribute vec2 aTexCoord;
attribute mat4 uProjectionMatrix;

// texcoord data
varying vec2 vTexCoord;

// canvas and texture dimensions needed for scaling
uniform vec2 canvasResolution;
uniform vec2 textureResolution;

void main() {
  vec2 textureScale;
  float scaleX = 1.0, scaleY = 1.0;

  float textureAspectRatio = textureResolution.x / textureResolution.y;
  float viewportAspectRatio = canvasResolution.x / canvasResolution.y;
  float aspectsRatio = viewportAspectRatio / textureAspectRatio;

  vec2 viewportRes = canvasResolution.xy;
  vec2 textureRes = textureResolution.xy;
  vec2 resRatio = viewportRes / textureRes;

  int modeId = 1; // 0 for aspect fit, 1 for aspect fill
  
  // switch statements not supported in this version of glsl
  if (modeId == 0) {
      // ASPECT FIT
      if (resRatio.x > resRatio.y) { // ratio of widths is greater than ratio of heights

            scaleX = aspectsRatio;

      } else { // ratio of heights is greater than ratio of widths

            scaleY = 1.0 / aspectsRatio;

      }
  } else if (modeId == 1) {
      // ASPECT FILL
      if (resRatio.x > resRatio.y) { // ratio of widths is greater than ratio of heights

            scaleY = 1.0 / aspectsRatio;

      } else { // ratio of heights is greater than ratio of widths

            scaleX = aspectsRatio;

      }   
  }

  textureScale = vec2(scaleX, scaleY);

  // copy texcoords
  vTexCoord = aTexCoord;

  // copy position data into a vec4, using 1.0 as the w component
  vec4 positionVec4 = vec4(aPosition, 1.0);
  positionVec4.xy = positionVec4.xy * 2.0 - 1.0; // full canvas size 
  //positionVec4.xy = positionVec4.xy * 1.0 - 0.5; // quarter canvas size and centered

  vTexCoord = textureScale * (aTexCoord - 0.5) + 0.5;
    
  // send the vertex information on to the fragment shader
  gl_Position = positionVec4;
}