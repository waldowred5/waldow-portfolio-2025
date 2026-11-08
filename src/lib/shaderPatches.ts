import type { Material } from 'three';

// three keys programs by onBeforeCompile.toString(), which is identical for different stacks of the same patch helper.
// Keys a patched material by the set of patches applied to it instead.
export const registerShaderPatch = (mat: Material, name: string) => {
  const patches = new Set<string>(mat.userData.shaderPatches ?? []);
  patches.add(name);
  mat.userData.shaderPatches = [...patches].sort();
  mat.customProgramCacheKey = () =>
    (mat.userData.shaderPatches as string[]).join('|');
};
