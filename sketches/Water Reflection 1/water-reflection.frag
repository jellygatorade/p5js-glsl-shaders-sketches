// See this? https://discourse.processing.org/t/tiling-repeating-shader-image-texture/21591
// For CLAMP vs REPEAT texture
// also https://editor.p5js.org/aferriss/sketches/cwm7kEBcH
//
// attempting something like this
// https://www.reddit.com/r/glsl/comments/ndh8jf/made_a_realtime_texture_input_for_glslviewer_with/?utm_source=share&utm_medium=ios_app&utm_name=iossmf
// https://www.instagram.com/p/CJ02tQWHGSY/?hl=en
//
// Shader follows
// https://www.shadertoy.com/view/ldyfD1

precision mediump float;

varying vec2 vTexCoord;

// Time
uniform float time;

// Canvas and texture dimensions needed for scaling
uniform vec2 canvasResolution;
uniform vec2 textureResolution;

// Image
uniform sampler2D texture1;

// Mouse position
uniform vec2 mouse;

vec3 mod289(vec3 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec2 mod289(vec2 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec3 permute(vec3 x) {
  return mod289(((x*34.0)+1.0)*x);
}
float snoise(vec2 v)
  {
  const vec4 C = vec4(0.211324865405187,  // (3.0-sqrt(3.0))/6.0
                      0.366025403784439,  // 0.5*(sqrt(3.0)-1.0)
                     -0.577350269189626,  // -1.0 + 2.0 * C.x
                      0.024390243902439); // 1.0 / 41.0
// First corner
  vec2 i  = floor(v + dot(v, C.yy) );
  vec2 x0 = v -   i + dot(i, C.xx);

// Other corners
  vec2 i1;
  //i1.x = step( x0.y, x0.x ); // x0.x > x0.y ? 1.0 : 0.0
  //i1.y = 1.0 - i1.x;
  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  // x0 = x0 - 0.0 + 0.0 * C.xx ;
  // x1 = x0 - i1 + 1.0 * C.xx ;
  // x2 = x0 - 1.0 + 2.0 * C.xx ;
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;

// Permutations
  i = mod289(i); // Avoid truncation effects in permutation
  vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
		+ i.x + vec3(0.0, i1.x, 1.0 ));

  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
  m = m*m ;
  m = m*m ;

// Gradients: 41 points uniformly over a line, mapped onto a diamond.
// The ring size 17*17 = 289 is close to a multiple of 41 (41*7 = 287)

  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;

// Normalise gradients implicitly by scaling m
// Approximation of: m *= inversesqrt( a0*a0 + h*h );
  m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );

// Compute final noise value at P
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  //return 130.0 * dot(m, g);
  //return 100.0 * dot(m, g); // Scale the amount of wavyness here
  return 100.0*mouse.x * dot(m, g);
}
void main()
{
  float timeScaled = time / 50.0;

    // Normalized pixel coordinates (from 0 to 1)
    //vec2 uv = gl_FragCoord.xy/canvasResolution.xy;
    vec2 uv = vTexCoord*2.0;
	  float aspect = canvasResolution.x/canvasResolution.y;
    uv.x*=aspect;
    vec2 mouse = mouse.xy*50.0;
    mouse.x*=aspect;
    uv-=mouse*0.01;
    //vec2 stretch = vec2(sin(timeScaled*5.+uv.x*50.)*0.01, cos(timeScaled*5.+uv.y*50.)*0.01);
    vec2 waterEffect = vec2(
        snoise(uv*0.5+timeScaled*0.1),
        snoise(uv*0.5-timeScaled*0.1+3.)
    );
  
  vec2 st = uv+waterEffect;
  st = vec2(st.x, 1.0-st.y);
  vec4 color1 = texture2D(texture1, st*1.2); // Scale amount of tiles within distortion here
  //vec4 color1 = texture2D(texture1, uv);
	//vec4 color1 = texture2D(texture1, waterEffect);
  //vec4 getPixel = texture(texture1, vec2(0.5, 0.5));
  // Output to screen
  gl_FragColor = vec4(color1);
}