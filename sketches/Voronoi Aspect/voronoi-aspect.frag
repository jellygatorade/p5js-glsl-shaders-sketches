// webgl requires that the first line of the fragment shader specify the precision
// precision is dependent on device, but higher precision variables have more zeros
// sometimes you'll see bugs if you use lowp so stick to mediump or highp
precision mediump float;

// we need our texcoords for drawing textures
varying vec2 vTexCoord;

vec2 vAspect;


// resolution
uniform vec2 canvasResolution;

// our time uniform variable coming from p5
uniform float time;

// Randomizes (?), or, adds noise to (?) the distribution of points (voronoi cells)
// @param p contains the noramlized uv
vec2 hash2(vec2 p ) {
   return fract(sin(vec2(dot(p, vec2(123.4, 748.6)), dot(p, vec2(547.3, 659.3))))*5232.85324);  
   //return fract(sin(vec2(dot(p, vec2(0.0, 0.0)), dot(p, vec2(0.5, 1.0))))*1.0);   
   //return fract(sin(vec2(dot(p, vec2(0.0, 0.0)), dot(p, vec2(0.0, 0.0))))*0.0);    
}

// float hash(vec2 p) {
//   return fract(sin(dot(p, vec2(43.232, 75.876)))*4526.3257);   
// }

//Based off of Inigo Quilez's described here: https://iquilezles.org/articles/voronoilines
float voronoi(vec2 p) {
    vec2 n = floor(p); //
    vec2 f = fract(p);
    float md = 1.0; // related to the edge color? I'm not sure why this is anything above 1.0? Or...it has a relationship with the second value passed into smoothstep()
    vec2 m = vec2(0.0);
    for (int i = -1;i<=1;i++) {
        for (int j = -1;j<=1;j++) {
            vec2 g = vec2(i, j); // g ranges from (-1, -1) to (1, 1) over loop iterations
            vec2 o = hash2(n+g); //distribute the cells
            o = 0.5+0.5*sin(time*0.03+5.038*o); // movement of the cells
            vec2 r = g + o - f;
            float d = dot(r, r);
            if (d<md) {
              md = d;
              m = n+g+o; //not sure about this line either since it doesn't seem to be used
            }
        }
    }
    return md;
}

float ov(vec2 p) {
    float v = 0.0;
    float a = 0.4; // initial brightness of voronoi cells
    //const int loopMax = 1; // loopMax iterations of voronoi cells
    const int loopMax = 3; // loopMax iterations of voronoi cells
    for (int i = 0; i < loopMax; i++) {
        v+= voronoi(p)*a;
        p*=2.0; // scale voronoi by this factor each loop
        a*=0.5; // scale brightness of voronoi cells by this factor each loop
    }
    return v;
}

void main() {
  float scaleFactor = 200.0;

  vAspect.x = vTexCoord.x * canvasResolution.x / scaleFactor;
  vAspect.y = vTexCoord.y * canvasResolution.y / scaleFactor;

  vec2 uv = vAspect;
  //vec2 uv = vTexCoord * 5.0;
  vec4 a = vec4(0.0, 0.0, 0.0, 1.0); // color at point (cell center)
  vec4 b = vec4(1.0, 1.0, 1.0, 1.0); // color at edge
	gl_FragColor = vec4(mix(a, b, smoothstep(0.0, 0.25, ov(uv))));
  //gl_FragColor =  vec4(hash2(uv), 0.0, 0.0, 1.0);

  //resolution
}