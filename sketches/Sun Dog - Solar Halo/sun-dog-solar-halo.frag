precision mediump float;

/**************
 * Refactored *
 **************/

uniform vec2 canvasResolution;
uniform float time;

#define pi 3.1415926535

mat2 rotationMatrix(float angle) {
  angle *= pi / 180.0;
  float s = sin(angle), c = cos(angle);
  return mat2( c, -s, s, c );
}

void main() {
    float t = time * 0.015;

    vec3 c;
    float l, z = t;
   
    for (int i = 0; i < 3; i++) {
        vec2 uv0, uv1, p = gl_FragCoord.xy/canvasResolution.xy;
        uv0 = p;
        p -= 0.5; // center position
        p.x *= canvasResolution.x/canvasResolution.y; // expand with height, fit aspect with width. for the opposite: p.y *= r.y/r.x;
        
        {
            z += .07; // offset per c[i]
            l = length( 0.4 * p );

            uv0 = 0.24 * p / l * (sin(0.75*z) * sin(0.75*z) * sin(0.75*z)); //modify period of sine wave here
            uv0 *= rotationMatrix( 45.0 ); // Rotate the UVs

            c[i] = 0.1 / length(mod(uv0, 1.) - 0.5); // comment out to see other shader alone
        }
        
        {
            uv1 = gl_FragCoord.xy/canvasResolution.xy;
            l = length(5. * p);

            uv1 += 1. * p / l * abs(1. * sin( l * 3. - 2. * z + 1. ));
            
            c[i] += .03 / length(mod(uv1, 1.) - 0.5); // comment out to see other shader alone
        }

        {
            l = length(30. * p);
            p.x = 0.75 * sin(2. * z);

            c[i] += p.x + 1.0; // comment out to see other shader alone
        }
    }

    gl_FragColor = vec4(c / l, t ); // setting the alpha component to time creates a fade in from first frame
}

/**************************************************
 * Before refactoring with notes and extras below *
 **************************************************/

// precision mediump float;

// uniform vec2 canvasResolution;
// uniform float time;

// #define t time * 0.015
// #define r canvasResolution.xy
// #define ZOOM 1.0

// #define PI 3.1415926535

// mat2 rotationMatrix(float angle) {
// 	angle *= PI / 180.0;
//   float s=sin(angle), c=cos(angle);
  
//   return mat2( c, -s, s, c );
// }

// void main() {
//     vec3 c;
//     float l, z = t;
   
//     for (int i = 0; i < 3; i++) {
//         vec2 uv, uv2, p = gl_FragCoord.xy/r;
//         uv = p;
//         p -= 0.5; // position
//         p.x *= r.x/r.y; // expand with height, fit aspect with width. for the opposite: p.y *= r.y/r.x;
        
//         {
//             z += .07; // offset per c[i]
//             l = length( 0.4 * p );

//             //uv += 0.4 * p / l * ( sin(z) * sin(z) * sin(z) );//*abs(sin(z));

//             //uv=0.25*p/l*(sin(0.75*z)*sin(0.75*z)*sin(0.75*z)); //modify period of sine wave here
//             // or
//             uv=0.24*p/l*(sin(0.75*z)*sin(0.75*z)*sin(0.75*z)); //modify period of sine wave here

//             // Rotate the UVs and zoom in or out
//             uv *= rotationMatrix( 45.0 ) * ZOOM;

//             c[i] = 0.1 / length( mod(uv, 1.) - 0.5); // comment out to see other shader alone
//         }
        
//         {
//             uv2 = gl_FragCoord.xy/r;
//             //z-=.25;
            
//             l = length( 5. * p );
            
//             //uv2+=1.*p/l*abs(1.*sin(0.5*(l*3.-2.*z+3.)));
//             // or
//             uv2 += 1. * p / l * abs( 1. * sin( l * 3. - 2. * z + 1. ));
            
//             c[i] += .03 / length( mod( uv2, 1. ) - .5);
//         }

//         {
//             //z += .23;
//             l = length( 30. * p);
//             p.x = 0.75 * sin( 2. * z );
//             c[i] += p.x + 1.0; // comment out to see other shader alone
//         }
//     }

//     gl_FragColor = vec4( c / l , t ); // why doesn't the fourth component matter here? why is it set to time?
// }