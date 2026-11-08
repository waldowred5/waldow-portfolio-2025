import {
  BackSide,
  MeshPhysicalMaterial,
  ShaderLib,
  type WebGLProgramParametersWithUniforms,
  type WebGLRenderer,
} from 'three';
import { describe, expect, it, vi } from 'vitest';

import {
  applyToonShader,
  createOutlineMaterial,
  toonUniforms,
} from './toonShader';

const physicalShader = () =>
  ({
    uniforms: {},
    vertexShader: ShaderLib.physical.vertexShader,
    fragmentShader: ShaderLib.physical.fragmentShader,
  }) as unknown as WebGLProgramParametersWithUniforms;

const renderer = {} as WebGLRenderer;

describe('applyToonShader', () => {
  it('bands lighting and fades transmission inside the noise-driven cartoon region', () => {
    const mat = new MeshPhysicalMaterial();
    applyToonShader(mat);
    const shader = physicalShader();
    mat.onBeforeCompile(shader, renderer);

    expect(shader.uniforms.uToonAmount).toBe(toonUniforms.uToonAmount);
    expect(shader.uniforms.uToonNoiseSeed).toBe(toonUniforms.uToonNoiseSeed);
    expect(shader.vertexShader).toContain('vToonWorldPos =');
    expect(shader.fragmentShader).toContain('toonMask');
    expect(shader.fragmentShader).toContain('toonInk');
    expect(shader.fragmentShader).toContain('toonRatio * uCelBands');
    expect(shader.fragmentShader).not.toContain('toonAlbedo');
    expect(shader.fragmentShader).toContain(
      'material.transmission = transmission * (1.0 - toonMask);',
    );
    expect(mat.customProgramCacheKey()).toBe('toon-cel');
  });

  it('flattens albedo and keys the program by style', () => {
    const mat = new MeshPhysicalMaterial();
    applyToonShader(mat, 'flat');
    const shader = physicalShader();
    mat.onBeforeCompile(shader, renderer);

    expect(shader.fragmentShader).toContain('toonAlbedo');
    expect(shader.fragmentShader).toContain('roughnessFactor = mix');
    expect(mat.customProgramCacheKey()).toBe('toon-flat');
    expect(shader.uniforms.uFlatSaturation).toBe(toonUniforms.uFlatSaturation);
  });

  it('chains onto existing patches and only applies once', () => {
    const mat = new MeshPhysicalMaterial();
    const prev = vi.fn();
    mat.onBeforeCompile = prev;
    applyToonShader(mat);
    const patched = mat.onBeforeCompile;
    applyToonShader(mat);
    expect(mat.onBeforeCompile).toBe(patched);

    mat.onBeforeCompile(physicalShader(), renderer);
    expect(prev).toHaveBeenCalledTimes(1);
  });
});

describe('createOutlineMaterial', () => {
  it('draws back faces only in the cartoon region, reusing the source patches and extruding by the outline width', () => {
    const source = new MeshPhysicalMaterial();
    const style = 'flat';
    applyToonShader(source, style);
    const outline = createOutlineMaterial(source, style);
    const shader = {
      uniforms: {},
      vertexShader: ShaderLib.basic.vertexShader,
      fragmentShader: ShaderLib.basic.fragmentShader,
    } as unknown as WebGLProgramParametersWithUniforms;
    outline.onBeforeCompile(shader, renderer);

    expect(outline.side).toBe(BackSide);
    expect(shader.fragmentShader).toContain('toonRatio');
    expect(shader.fragmentShader).toContain('if (toonMask < 0.5) discard;');
    expect(shader.vertexShader).toContain('uOutlineWidth * uFlatOutlineScale');
    expect(outline.customProgramCacheKey()).toBe('toon-flat|outline');
  });
});
