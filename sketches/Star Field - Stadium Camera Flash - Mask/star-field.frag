// Star field
// following
// Star field 5 by FabriceNeyret2 on Shadertoy
// https://www.shadertoy.com/view/4scXWB

precision mediump float;

// we need texcoords and resolution for calculating aspect ratio
varying vec2 vTexCoord;
varying vec2 originalTexCoord;
uniform vec2 canvasResolution;
vec2 uvAspect;

// images are sent to the shader as a variable type called sampler2D
uniform sampler2D tex1;
uniform sampler2D tex2;

// time uniform variable coming from p5
uniform float time;
#define t time*0.05

#define speed 1. // try increasing up to 6.

#define r(x)     fract(1e4*sin((x)*541.17)) // rand, signed rand   in 1, 2, 3D.
#define sr2(x)   ( r(vec2(x,x+.1)) * 2. - 1. )
#define sr3(x)   ( r(vec4(x,x+.1,x+.2,0)) * 2. - 1. )

float flare( vec2 U ) // rotating flare 
{	
    vec2 A = sin(vec2(0, 1.57) + t); // adjust pulse intensity and rotational behavior
    //U = abs( U * mat2(A, -A.y, A.x) ) * mat2(2,0,1,1.7); // six-point star
    U = abs( U * mat2(A, -A.y, A.x) ) * mat2(2,2,0,2); // four-point star
    return .3/max(U.x,U.y); // glowing-spiky approx of step(max,.2), adjust flare intensity
    //return .2*pow(max(U.x,U.y), -2.);
}

vec4 original()
{
    // Maintain aspect ratio
    vec2 res = canvasResolution;
    vec2 uvAspect = originalTexCoord * res;
    uvAspect = (2.*uvAspect - res) / res.y;

    vec4 color = vec4(0.0, 0.0, 0.0, 1.0);
    color -= color+0.25;

    // Running this loop for each fragment is too intensive
    // Each iteration generates a new flare
    // Original has 99 iterations
    for (float i=0.; i<49.; i++)
        //gl_FragColor += flare (uvAspect - sr2(i)*res/res.y ) // rotating flare at random location
        color += flare (uvAspect - sr2(i)*res/res.y )
              * r(i+2.)                          // random scale
              * (1.+sin(speed*t+r(i+.3)*6.))*.1  // time pulse
            //* (1.+.1*sr3(i+.4));               // random color - uncorrelated
              * (1.+.1*sr3(i));                  // random color - correlated

    return color;
}

void main() 
{   
    vec4 color = original();

    // Images
    // Flip the y-axis to place the image texture (will be flipped on y when loading from p5.js)
    vec2 flipY = vec2( vTexCoord.x, 1.0 - vTexCoord.y);
    vec4 img1 = texture2D(tex1, flipY);
    vec4 img2 = texture2D(tex2, flipY);

    // gl_FragColor = color;
    gl_FragColor = vec4(mix(img1, img2, color));
}
