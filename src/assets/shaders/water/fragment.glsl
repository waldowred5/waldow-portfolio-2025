uniform vec3 uDepthColor;
uniform vec3 uSurfaceColor;
uniform vec3 uOldDepthColor;
uniform vec3 uOldSurfaceColor;
uniform float uColorOffset;
uniform float uColorMultiplier;

uniform float uDissolveProgress;
uniform float uThemeDissolveProgress;
uniform float uEdge;
uniform vec3 uEdgeColor;

varying float vElevation;
varying float vDissolveNoise;

void main() {
    if (vDissolveNoise < uDissolveProgress) discard;

    float mixStrength = (vElevation + uColorOffset) * uColorMultiplier;

    vec3 newColor = mix(uDepthColor, uSurfaceColor, mixStrength);
    vec3 oldColor = mix(uOldDepthColor, uOldSurfaceColor, mixStrength);

    vec3 color = vDissolveNoise < uThemeDissolveProgress ? newColor : oldColor;

    if (uDissolveProgress > 0.001) {
        float edgeFactor = smoothstep(uDissolveProgress + uEdge, uDissolveProgress, vDissolveNoise);
        color = mix(color, uEdgeColor, edgeFactor);
    }

    gl_FragColor = vec4(color, 1.0);
}
