precision mediump float;

// texcoords for drawing textures
varying vec2 originalTexCoord;
varying vec2 vTexCoord;

uniform vec2 canvasResolution;

// Image
uniform sampler2D texture1;
uniform sampler2D texture2;

// Time
uniform float time;

// Voronoi Fns
vec2 hash2(vec2 p ) {
   return fract(sin(vec2(dot(p, vec2(123.4, 748.6)), dot(p, vec2(547.3, 659.3))))*5232.85324);   
}
float hash(vec2 p) {
  return fract(sin(dot(p, vec2(43.232, 75.876)))*4526.3257);   
}

float voronoi(vec2 p) {
    vec2 n = floor(p);
    vec2 f = fract(p);
    float md = 5.0;
    vec2 m = vec2(0.0);
    for (int i = -1;i<=1;i++) {
        for (int j = -1;j<=1;j++) {
            vec2 g = vec2(i, j);
            vec2 o = hash2(n+g);
            o = 0.5+0.5*sin(time*0.03+5.038*o);
            vec2 r = g + o - f;
            float d = dot(r, r);
            if (d<md) {
              md = d;
              m = n+g+o;
            }
        }
    }
    return md;
}

float ov(vec2 p) {
    float v = 0.0;
    float a = 0.4;
    for (int i = 0;i<3;i++) {
        v+= voronoi(p)*a;
        p*=2.0;
        a*=0.5;
    }
    return v;
}

// Main
void main() {

  // Voronoi
  vec2 vAspect = originalTexCoord * canvasResolution;
  vec2 uv = vAspect/160.0;
  vec4 black = vec4(0.0, 0.0, 0.0, 1.0);
  vec4 white = vec4(1.0, 1.0, 1.0, 1.0);

  vec4 voronoiMask = vec4(mix(black, white, smoothstep(0.0, 0.25, ov(uv))));

  // Images
  
  // Flip the y-axis to place the image texture (will be flipped on y when loading from p5.js)
  vec2 flipY = vec2( vTexCoord.x, 1.0 - vTexCoord.y);
  vec4 color1 = texture2D(texture1, flipY);
  vec4 color2 = texture2D(texture2, flipY);

  // For aspect fit
  // This condition will not be met for aspect fill
  vec4 yellow = vec4(1.0, 1.0, 0.0, 1.0);
  if (vTexCoord.x < 0.0 || vTexCoord.x > 1.0 ||
    vTexCoord.y < 0.0 || vTexCoord.y > 1.0) {
    color1 = yellow;
  }

  //gl_FragColor = color1;

  gl_FragColor = mix(color1, color2, voronoiMask.r);
}