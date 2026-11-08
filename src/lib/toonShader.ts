import {
  BackSide,
  Color,
  type Material,
  MeshBasicMaterial,
  ShaderChunk,
  Uniform,
  Vector2,
} from 'three';

import { registerShaderPatch } from '@/lib/shaderPatches.ts';

// Tunable cartoon look, shared by every toon-patched material and the Hero wave
export const TOON_DEFAULTS = {
  outlineWidth: 3,
  inkEdge: 0.04,
  celBands: 3,
  flatShadow: 0.22,
  flatLit: 1.0,
  flatHighlight: 0.15,
  flatShadowThreshold: 0.5,
  flatHighlightThreshold: 0.09,
  flatSaturation: 1.4,
  flatColourSteps: 14,
  flatMatte: 0.55,
  flatOutlineScale: 1.35,
  waveBands: 4,
  waveEdgeMin: 0.03,
  waveEdgeMax: 0.07,
};

// uToonAmount is the transition progress: 0 renders the original look, 1 the cartoon look
export const toonUniforms = {
  uToonAmount: new Uniform(0),
  uToonNoiseSeed: new Uniform(0),
  uOutlineResolution: new Uniform(new Vector2(1, 1)),
  uOutlineWidth: new Uniform(TOON_DEFAULTS.outlineWidth),
  uInkEdge: new Uniform(TOON_DEFAULTS.inkEdge),
  uCelBands: new Uniform(TOON_DEFAULTS.celBands),
  uFlatShadow: new Uniform(TOON_DEFAULTS.flatShadow),
  uFlatLit: new Uniform(TOON_DEFAULTS.flatLit),
  uFlatHighlight: new Uniform(TOON_DEFAULTS.flatHighlight),
  uFlatShadowThreshold: new Uniform(TOON_DEFAULTS.flatShadowThreshold),
  uFlatHighlightThreshold: new Uniform(TOON_DEFAULTS.flatHighlightThreshold),
  uFlatSaturation: new Uniform(TOON_DEFAULTS.flatSaturation),
  uFlatColourSteps: new Uniform(TOON_DEFAULTS.flatColourSteps),
  uFlatMatte: new Uniform(TOON_DEFAULTS.flatMatte),
  uFlatOutlineScale: new Uniform(TOON_DEFAULTS.flatOutlineScale),
  uWaveBands: new Uniform(TOON_DEFAULTS.waveBands),
  uWaveEdgeMin: new Uniform(TOON_DEFAULTS.waveEdgeMin),
  uWaveEdgeMax: new Uniform(TOON_DEFAULTS.waveEdgeMax),
};

// 'cel' bands the existing lighting; 'flat' replaces realistic shading with flat, saturated albedo lit in steps
export type ToonStyle = 'cel' | 'flat';

const TOON_VERTEX_COMMON = /* glsl */ `
  varying vec3 vToonWorldPos;
`;

const TOON_VERTEX_ASSIGN = /* glsl */ `
  vToonWorldPos = (modelMatrix * vec4(transformed, 1.0)).xyz;
`;

// Noise-driven cartoon region with a black ink line along its spreading edge
const TOON_FRAGMENT_COMMON = /* glsl */ `
  uniform float uToonAmount;
  uniform float uToonNoiseSeed;
  uniform float uInkEdge;
  uniform float uCelBands;
  uniform float uFlatShadow;
  uniform float uFlatLit;
  uniform float uFlatHighlight;
  uniform float uFlatShadowThreshold;
  uniform float uFlatHighlightThreshold;
  uniform float uFlatSaturation;
  uniform float uFlatColourSteps;
  uniform float uFlatMatte;
  varying vec3 vToonWorldPos;

  float toonHash(vec3 p) {
    p = fract(p * vec3(443.8975, 397.2973, 491.1871));
    p += dot(p.zyx, p + vec3(19.19));
    return fract((p.x + p.y) * p.z);
  }

  float toonNoise(vec3 p) {
    vec3 i = floor(p);
    vec3 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(mix(toonHash(i), toonHash(i + vec3(1,0,0)), f.x),
          mix(toonHash(i + vec3(0,1,0)), toonHash(i + vec3(1,1,0)), f.x), f.y),
      mix(mix(toonHash(i + vec3(0,0,1)), toonHash(i + vec3(1,0,1)), f.x),
          mix(toonHash(i + vec3(0,1,1)), toonHash(i + vec3(1,1,1)), f.x), f.y),
      f.z
    );
  }
`;

const TOON_FRAGMENT_MASK = /* glsl */ `
  float toonN = toonNoise(vToonWorldPos * 3.0 + uToonNoiseSeed);
  float toonMask = toonN < uToonAmount ? 1.0 : 0.0;
  float toonInk = toonMask * step(uToonAmount - uInkEdge, toonN) * (1.0 - step(1.0, uToonAmount));
`;

const TOON_FRAGMENT_FLAT_ALBEDO = /* glsl */ `
  {
    vec3 toonAlbedo = pow(max(diffuseColor.rgb, 0.0), vec3(1.0 / 2.2));
    toonAlbedo = floor(toonAlbedo * uFlatColourSteps + 0.5) / uFlatColourSteps;
    float toonGrey = dot(toonAlbedo, vec3(0.2126, 0.7152, 0.0722));
    toonAlbedo = clamp(mix(vec3(toonGrey), toonAlbedo, uFlatSaturation), 0.0, 1.0);
    diffuseColor.rgb = mix(diffuseColor.rgb, pow(toonAlbedo, vec3(2.2)), toonMask);
  }
`;

// Matte surface so environment reflections don't break up the flat colour
const TOON_FRAGMENT_MATTE = /* glsl */ `
  roughnessFactor = mix(roughnessFactor, 1.0, toonMask * uFlatMatte);
  metalnessFactor = mix(metalnessFactor, 0.0, toonMask);
`;

// Steps lighting into flat bands by quantising its brightness relative to the surface albedo, keeping hue
const toonBandsFragment = (style: ToonStyle) => /* glsl */ `
  {
    const vec3 toonLuma = vec3(0.2126, 0.7152, 0.0722);
    float toonRatio = dot(outgoingLight, toonLuma) / max(dot(diffuseColor.rgb, toonLuma), 0.0001);
    ${
      style === 'flat'
        ? `float toonStep = mix(uFlatShadow, uFlatLit, step(uFlatShadowThreshold, toonRatio)) + step(uFlatHighlightThreshold, toonRatio) * uFlatHighlight;
    vec3 toonLight = diffuseColor.rgb * toonStep;
    #ifdef STANDARD
      toonLight += totalEmissiveRadiance;
    #endif`
        : `float toonStep = (floor(toonRatio * uCelBands) + 0.5) / uCelBands;
    vec3 toonLight = outgoingLight * (toonStep / max(toonRatio, 0.0001));`
    }
    outgoingLight = mix(outgoingLight, toonLight, toonMask);
    outgoingLight = mix(outgoingLight, vec3(0.0), toonInk);
  }
`;

// Fades glass out to an opaque surface inside the cartoon region
const TOON_TRANSMISSION_FRAGMENT = ShaderChunk.transmission_fragment.replace(
  'material.transmission = transmission;',
  'material.transmission = transmission * (1.0 - toonMask);',
);

export const applyToonShader = (mat: Material, style: ToonStyle = 'cel') => {
  if (mat.userData.toonApplied) {
    return;
  }
  mat.userData.toonApplied = true;

  const prev = mat.onBeforeCompile;
  mat.onBeforeCompile = (shader, renderer) => {
    prev?.(shader, renderer);
    Object.assign(shader.uniforms, toonUniforms);
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', `#include <common>\n${TOON_VERTEX_COMMON}`)
      .replace(
        '#include <project_vertex>',
        `#include <project_vertex>\n${TOON_VERTEX_ASSIGN}`,
      );
    shader.fragmentShader = shader.fragmentShader
      .replace(
        '#include <common>',
        `#include <common>\n${TOON_FRAGMENT_COMMON}`,
      )
      .replace(
        '#include <clipping_planes_fragment>',
        `#include <clipping_planes_fragment>\n${TOON_FRAGMENT_MASK}`,
      )
      .replace(
        '#include <color_fragment>',
        `#include <color_fragment>\n${style === 'flat' ? TOON_FRAGMENT_FLAT_ALBEDO : ''}`,
      )
      .replace(
        '#include <metalnessmap_fragment>',
        `#include <metalnessmap_fragment>\n${style === 'flat' ? TOON_FRAGMENT_MATTE : ''}`,
      )
      .replace('#include <transmission_fragment>', TOON_TRANSMISSION_FRAGMENT)
      .replace(
        '#include <opaque_fragment>',
        `${toonBandsFragment(style)}\n#include <opaque_fragment>`,
      );
  };
  registerShaderPatch(mat, `toon-${style}`);
  mat.needsUpdate = true;
};

const OUTLINE_VERTEX_COMMON = /* glsl */ `
  uniform float uOutlineWidth;
  uniform float uFlatOutlineScale;
  uniform vec2 uOutlineResolution;
`;

// Pushes the back-face hull out along its screen-space normal by a constant pixel width
const outlineVertexOffset = (style: ToonStyle) => /* glsl */ `
  {
    vec3 outlineViewNormal = normalize(normalMatrix * normal);
    vec2 outlineDir = (projectionMatrix * vec4(outlineViewNormal, 0.0)).xy;
    outlineDir = length(outlineDir) > 0.0001 ? normalize(outlineDir) : vec2(0.0);
    gl_Position.xy += outlineDir * uOutlineWidth${style === 'flat' ? ' * uFlatOutlineScale' : ''} / uOutlineResolution * gl_Position.w * 2.0;
  }
`;

// Ink hull for a mesh, drawn only inside the cartoon region. Reuses the source material's patches so dissolve and wireframe effects apply to the outline too.
export const createOutlineMaterial = (
  source: Material,
  style: ToonStyle = 'cel',
) => {
  const outline = new MeshBasicMaterial({
    color: new Color('black'),
    side: BackSide,
  });
  outline.onBeforeCompile = (shader, renderer) => {
    source.onBeforeCompile(shader, renderer);
    Object.assign(shader.uniforms, toonUniforms);
    shader.vertexShader = shader.vertexShader
      .replace(
        '#include <common>',
        `#include <common>\n${OUTLINE_VERTEX_COMMON}`,
      )
      .replace(
        '#include <project_vertex>',
        `#include <project_vertex>\n${outlineVertexOffset(style)}`,
      );
    shader.fragmentShader = shader.fragmentShader.replace(
      '#include <opaque_fragment>',
      'if (toonMask < 0.5) discard;\n#include <opaque_fragment>',
    );
  };
  outline.customProgramCacheKey = () =>
    `${source.customProgramCacheKey()}|outline`;

  return outline;
};
