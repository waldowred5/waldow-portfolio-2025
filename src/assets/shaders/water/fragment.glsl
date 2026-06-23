uniform vec3 uDepthColor;
uniform vec3 uSurfaceColor;
uniform vec3 uOldDepthColor;
uniform vec3 uOldSurfaceColor;
uniform float uColorOffset;
uniform float uColorMultiplier;

uniform float uWireframeProgress;
uniform float uThemeDissolveProgress;
uniform float uEdge;
uniform vec3 uEdgeColor;

varying float vElevation;
varying float vDissolveNoise;
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

    gl_FragColor = vec4(color, 1.0);
}
