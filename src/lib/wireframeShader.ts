import type { BufferGeometry } from 'three';
import { BufferAttribute, type Material } from 'three';

import { registerShaderPatch } from '@/lib/shaderPatches.ts';

export const addBarycentricCoords = (geo: BufferGeometry): BufferGeometry => {
  const nonIndexed = geo.toNonIndexed();
  const count = nonIndexed.attributes.position.count;
  const barycentric = new Float32Array(count * 3);
  for (let i = 0; i < count; i += 3) {
    barycentric[i * 3] = 1;
    barycentric[(i + 1) * 3 + 1] = 1;
    barycentric[(i + 2) * 3 + 2] = 1;
  }
  nonIndexed.setAttribute('aBarycentric', new BufferAttribute(barycentric, 3));

  return nonIndexed;
};

const VERTEX_COMMON = /* glsl */ `
  attribute vec3 aBarycentric;
  varying vec3 vBarycentric;
  varying vec3 vWfWorldPos;
`;

const VERTEX_ASSIGN = /* glsl */ `
  vBarycentric = aBarycentric;
  vWfWorldPos = (modelMatrix * vec4(transformed, 1.0)).xyz;
`;

const FRAGMENT_COMMON = /* glsl */ `
  uniform float uWireframeProgress;
  uniform float uWireframeNoiseSeed;
  varying vec3 vBarycentric;
  varying vec3 vWfWorldPos;

  float wfHash(vec3 p) {
    p = fract(p * vec3(443.8975, 397.2973, 491.1871));
    p += dot(p.zyx, p + vec3(19.19));
    return fract((p.x + p.y) * p.z);
  }

  float wfNoise(vec3 p) {
    vec3 i = floor(p);
    vec3 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(mix(wfHash(i), wfHash(i + vec3(1,0,0)), f.x),
          mix(wfHash(i + vec3(0,1,0)), wfHash(i + vec3(1,1,0)), f.x), f.y),
      mix(mix(wfHash(i + vec3(0,0,1)), wfHash(i + vec3(1,0,1)), f.x),
          mix(wfHash(i + vec3(0,1,1)), wfHash(i + vec3(1,1,1)), f.x), f.y),
      f.z
    );
  }
`;

const FRAGMENT_DISCARD = /* glsl */ `
  {
    if (uWireframeProgress > 0.0) {
      float wfN = wfNoise(vWfWorldPos * 3.0 + uWireframeNoiseSeed);
      if (wfN < uWireframeProgress) {
        float edgeMin = min(vBarycentric.x, min(vBarycentric.y, vBarycentric.z));
        float lineWidth = fwidth(edgeMin) * 1.5;
        if (edgeMin >= lineWidth) discard;
      }
    }
  }
`;

export type WireframeUniforms = {
  uWireframeProgress: { value: number };
  uWireframeNoiseSeed: { value: number };
};

export const createWireframeUniforms = (): WireframeUniforms => ({
  uWireframeProgress: { value: 0.0 },
  uWireframeNoiseSeed: { value: 0.0 },
});

export const applyWireframeShader = (
  mat: Material,
  uniforms: WireframeUniforms,
) => {
  if ((mat as Material & { __wireframeApplied?: boolean }).__wireframeApplied) {
    return;
  }
  (mat as Material & { __wireframeApplied?: boolean }).__wireframeApplied =
    true;

  const prev = mat.onBeforeCompile;
  mat.onBeforeCompile = (shader, renderer) => {
    if (prev) {
      prev(shader, renderer);
    }
    Object.assign(shader.uniforms, uniforms);
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', `#include <common>\n${VERTEX_COMMON}`)
      .replace(
        '#include <project_vertex>',
        `#include <project_vertex>\n${VERTEX_ASSIGN}`,
      );
    shader.fragmentShader = shader.fragmentShader
      .replace('#include <common>', `#include <common>\n${FRAGMENT_COMMON}`)
      .replace(
        '#include <clipping_planes_fragment>',
        `#include <clipping_planes_fragment>\n${FRAGMENT_DISCARD}`,
      );
  };
  registerShaderPatch(mat, 'wireframe');
  mat.needsUpdate = true;
};
