// Minkowski voronoi
// following
// Voronoi Noise Grid by csbdev on Shadertoy
// https://www.shadertoy.com/view/MdtBz2

precision mediump float;

// we need texcoords and resolution for calculating aspect ratio
varying vec2 vTexCoord;
uniform vec2 canvasResolution;
vec2 vAspect;

// time uniform variable coming from p5
uniform float time;

// Scales the overall voronoi 
#define TILINGSCALE 2.0

float minkowski(vec3 a, vec3 b)
{
    vec3 d = a - b;
    float p = 0.5;
    
    return pow(dot(pow(abs(d), vec3(p)), vec3(1.0)), 1.0 / p);
}

// See the original for the original random fn
// iq
vec3 random3f( vec3 p )
{
    return fract(sin(vec3( dot(p,vec3(65.0,52.0,1.0)), 
                           dot(p,vec3(1.0,13.0,1.0)),
                           dot(p,vec3(100.0,18.0,1.0))))*50.0);//43758.5453
}


float voronoi3(vec3 p)
{
    vec3 fp = floor(p);
    
    float d1 = 1./0.;
    float d2 = 1./0.;
    
    for(int i = -1; i < 2; i++)
    {
        for(int j = -1; j < 2; j++)
        {
            for(int k = -1; k < 2; k++)
            {
                vec3 cur_p = fp + vec3(i, j, k);
                
                vec3 r = random3f(cur_p);
                //vec3 r = vec3(1.0,1.0,1.0);
                
                float cd = 0.0;
                
                cd = minkowski(p, cur_p + r);
                
                d1 = min(d1, cd);
            }
        }
    }
    
    return d1;
}

void main()
{
    // preserve pattern scale when aspect ratio changes
    float scaleFactor = 200.;
    vAspect.x = vTexCoord.x * canvasResolution.x / scaleFactor;
    vAspect.y = vTexCoord.y * canvasResolution.y / scaleFactor;
    
    // get the value at this pixel
    vec2 screen = vAspect;

    // Original version without vAspect scales the height with resolution
    //
    // vec2 screen = ((gl_FragCoord.xy / canvasResolution.xy) * 2.0 - 1.0);
    // screen.x *= canvasResolution.x / canvasResolution.y;

    vec3 pos = vec3(screen * TILINGSCALE, time * 0.009);
    float h = voronoi3(pos);
    
    gl_FragColor = vec4(vec3(1.0 - h), 1);
}
