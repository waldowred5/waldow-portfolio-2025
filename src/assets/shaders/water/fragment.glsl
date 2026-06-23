uniform vec3 uDepthColor;
uniform vec3 uSurfaceColor;
uniform float uColorOffset;
uniform float uColorMultiplier;

uniform float uDissolveProgress;
uniform float uEdge;
uniform vec3 uEdgeColor;

varying float vElevation;
varying float vDissolveNoise;

void main() {
    if (vDissolveNoise < uDissolveProgress) discard;

    float mixStrength = (vElevation + uColorOffset) * uColorMultiplier;
    vec3 color = mix(uDepthColor, uSurfaceColor, mixStrength);

    float edgeFactor = smoothstep(uDissolveProgress + uEdge, uDissolveProgress, vDissolveNoise);
    color = mix(color, uEdgeColor, edgeFactor);

    gl_FragColor = vec4(color, 1.0);
}
