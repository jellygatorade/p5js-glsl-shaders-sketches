precision mediump float;

// Following
// FabriceNeyret2 - spiraling video
// https://www.shadertoy.com/view/MddSRB

uniform float time;
uniform vec2 canvasResolution;
uniform sampler2D tex0;

#define spiralThickness 1.
#define numHelices 1.
#define texRepeats 6. // per revolution if single helix
#define PI 3.14159265358979323846264

void main()
{    
    vec2 uv = gl_FragCoord.xy;
    vec2 res = canvasResolution.xy;

    float sTime = 0.025 * time;
    
    float scaleThick = 0.5*sin(sTime) + 1.25;
    //scaleThick = 1.;
    
    float aspect = res.x / res.y;
    
    uv = ( 2.*uv - res ) / res.y; // center uv coords

    uv = vec2( atan(uv.y, uv.x) * 0.5 * numHelices * texRepeats / PI, scaleThick*1./spiralThickness*log(length(uv)) ); // conformal polar
    
    uv.y += uv.x / (texRepeats); // comment for concentric circles instead of spiral
    
    // using fractional part here gives the line edge of texture
    // if filter is set to mipmap
    gl_FragColor = texture2D(tex0, fract(-uv+0.25*sTime));
}