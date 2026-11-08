import { MeshStandardMaterial } from 'three';
import { describe, expect, it } from 'vitest';

import { registerShaderPatch } from './shaderPatches';

describe('registerShaderPatch', () => {
  it('keys materials by their sorted, de-duplicated patch set', () => {
    const a = new MeshStandardMaterial();
    registerShaderPatch(a, 'wireframe');
    registerShaderPatch(a, 'dissolve');
    registerShaderPatch(a, 'wireframe');
    expect(a.customProgramCacheKey()).toBe('dissolve|wireframe');
  });

  it('gives different patch stacks different keys', () => {
    const a = new MeshStandardMaterial();
    const b = new MeshStandardMaterial();
    registerShaderPatch(a, 'wireframe');
    registerShaderPatch(b, 'wireframe');
    registerShaderPatch(b, 'toon');
    expect(a.customProgramCacheKey()).not.toBe(b.customProgramCacheKey());
  });
});
