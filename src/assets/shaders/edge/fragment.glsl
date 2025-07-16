varying vec3 vPosition;

uniform vec3 uCylinderColorBase;
uniform vec3 uCylinderColorFromVertex;
uniform vec3 uCylinderColorToVertex;
uniform float uCylinderDistance;
uniform float uFromVertexOwnershipPercentage;
uniform float uToVertexOwnershipPercentage;
uniform float uOpacity;

void main() {
    float fromVertexOwnershipModifier = uFromVertexOwnershipPercentage;
    float toVertexOwnershipModifier = (1.0 - uToVertexOwnershipPercentage);
    float fromVertexValue = clamp((vPosition.z + fromVertexOwnershipModifier * uCylinderDistance) / uCylinderDistance, 0.0, 1.0);
    float toVertexValue = clamp((vPosition.z + toVertexOwnershipModifier * uCylinderDistance) / uCylinderDistance, 0.0, 1.0);
    float thresholdOne = mod(fromVertexValue, 1.0);
    float thresholdTwo = mod(toVertexValue, 1.0);
    thresholdOne = step(fromVertexValue, thresholdOne);
    thresholdTwo = step(toVertexValue, thresholdTwo);

    // TODO: Replace if statements with clamps (performance improvement)
    vec3 color;
    if (thresholdOne <= 0.5) {
        color = uCylinderColorFromVertex;
    } else if (thresholdTwo >= 0.5) {
        color = uCylinderColorToVertex;
    } else {
        color = uCylinderColorBase;
    }

    // Output the final color
    gl_FragColor = vec4(color, clamp((uOpacity * 6.0) - 5.0, 0.0, 1.0));
}
