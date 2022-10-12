// Following aspect fit and aspect fill as described here
// https://stackoverflow.com/questions/62821286/aspect-fit-and-aspect-fill-content-mode-with-opengl-es-2-0

precision mediump float;

// vertex data
attribute vec3 aPosition;
attribute vec2 aTexCoord;

// texcoord data
varying vec2 orig_vTexCoord;
varying vec2 fit_fill_vTexCoord;

// Canvas and texture dimensions needed for scaling
uniform vec2 canvasResolution;
uniform vec2 textureResolution; // currently only supporting aspect fit or fill for one texture at a time

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
      // Aspect Fit
      if (resRatio.x > resRatio.y) { // ratio of widths is greater than ratio of heights

            scaleX = aspectsRatio;

      } else { // ratio of heights is greater than ratio of widths

            scaleY = 1.0 / aspectsRatio;

      }
  } else if (modeId == 1) {
      // Aspect Fill
      if (resRatio.x > resRatio.y) { // ratio of widths is greater than ratio of heights

            scaleY = 1.0 / aspectsRatio;

      } else { // ratio of heights is greater than ratio of widths

            scaleX = aspectsRatio;

      }   
  }

  textureScale = vec2(scaleX, scaleY);

  // copy original texcoords to the varying
  orig_vTexCoord = aTexCoord;

  // copy position data into a vec4, using 1.0 as the w component
  vec4 positionVec4 = vec4(aPosition, 1.0);
  positionVec4.xy = positionVec4.xy * 2.0 - 1.0; //full canvas size 

  // send modified texcoords to another varying
  fit_fill_vTexCoord = textureScale * (orig_vTexCoord - 0.5) + 0.5;
    
  // send the vertex information on to the fragment shader
  gl_Position = positionVec4;
}