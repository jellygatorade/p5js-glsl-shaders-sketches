precision mediump float;

uniform sampler2D p5tex1;
uniform sampler2D p5tex2;

uniform float time;
uniform vec2 canvasResolution;

void main() {
    float pi = 3.14159265358979323846264;
    float scale = 1.0;
    
    vec2 uv = scale * (2. * gl_FragCoord.xy - canvasResolution.xy) / canvasResolution.y;
    
    uv *= pi;
    
    uv = vec2(uv.x * uv.x - uv.y * uv.y, 2. * uv.x * uv.y); // conformal transformation

    uv.x -= time * 0.05; // translate x

    vec4 tex0 = texture2D(p5tex1, uv / pi);
    vec4 tex1 = texture2D(p5tex2, uv / pi);
    
    vec2 sinuv0 = ceil(0.5 * sin(uv));
    vec2 sinuv1 = 1.0 - sinuv0;
    
    vec3 mask0 = mix(vec3(sinuv0.x), vec3(sinuv0.y), sinuv0.x);
    vec3 mask1 = mix(vec3(sinuv1.x), vec3(sinuv1.y), sinuv1.x);
    vec3 checkerboard = mask0 + mask1;
    
    vec3 color0 = mix(tex0.xyz, vec3(0.0), checkerboard);
    vec3 color1 = mix(tex1.xyz, vec3(0.0), 1.0 - checkerboard);
    
    //gl_FragColor = vec4(checkerboard, 1.0);
    gl_FragColor = vec4(color0 + color1, 1.0);

}