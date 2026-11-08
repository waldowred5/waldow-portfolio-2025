uniform vec3 uDepthColor;
uniform vec3 uSurfaceColor;
uniform vec3 uOldDepthColor;
uniform vec3 uOldSurfaceColor;
uniform float uColorOffset;
uniform float uColorMultiplier;

uniform float uWireframeProgress;
uniform float uThemeDissolveProgress;
uniform float uToonAmount;
uniform float uInkEdge;
uniform float uWaveBands;
uniform float uWaveEdgeMin;
uniform float uWaveEdgeMax;
uniform float uEdge;
uniform vec3 uEdgeColor;

varying float vElevation;
varying float vDissolveNoise;
varying float vToonNoise;
varying vec3 vBarycentric;

void main() {
    float edgeMin = min(vBarycentric.x, min(vBarycentric.y, vBarycentric.z));
    float lineWidth = fwidth(edgeMin) * 1.5;
    bool inWireframeZone = vDissolveNoise < uWireframeProgress;

    if (inWireframeZone && edgeMin >= lineWidth) discard;

    float mixStrength = (vElevation + uColorOffset) * uColorMultiplier;

    vec3 newColor = mix(uDepthColor, uSurfaceColor, mixStrength);
    vec3 oldColor = mix(uOldDepthColor, uOldSurfaceColor, mixStrength);

    vec3 color = vDissolveNoise < uThemeDissolveProgress ? newColor : oldColor;

    // Cartoon region: colour posterised into flat bands, inked where brightness changes sharply, with an ink line along its spreading edge
    float toonMask = vToonNoise < uToonAmount ? 1.0 : 0.0;
    vec3 toonColor = pow(floor(pow(max(color, 0.0), vec3(1.0 / 2.2)) * uWaveBands + 0.5) / uWaveBands, vec3(2.2));
    float toonEdge = smoothstep(uWaveEdgeMin, uWaveEdgeMax, fwidth(dot(color, vec3(0.2126, 0.7152, 0.0722))));
    toonColor = mix(toonColor, vec3(0.0), toonEdge);
    float toonInk = step(uToonAmount - uInkEdge, vToonNoise) * (1.0 - step(1.0, uToonAmount));
    color = mix(color, mix(toonColor, vec3(0.0), toonInk), toonMask);

    gl_FragColor = vec4(color, 1.0);
}
