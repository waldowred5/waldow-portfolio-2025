import { useFrame, useThree } from '@react-three/fiber';
import { type RefObject, useEffect, useRef } from 'react';
import {
  type Material,
  Mesh,
  type MeshStandardMaterial,
  type Object3D,
  SkinnedMesh,
} from 'three';

import {
  applyToonShader,
  createOutlineMaterial,
  type ToonStyle as ToonStyleName,
  toonUniforms,
} from '@/lib/toonShader.ts';

interface Props {
  targetRef: RefObject<Object3D | null>;
}

const isLitMaterial = (material: Material) =>
  (material as MeshStandardMaterial).isMeshStandardMaterial === true;

const createOutline = (mesh: Mesh, material: Material) => {
  const outline =
    mesh instanceof SkinnedMesh
      ? new SkinnedMesh(mesh.geometry, material)
      : new Mesh(mesh.geometry, material);
  if (outline instanceof SkinnedMesh && mesh instanceof SkinnedMesh) {
    outline.bind(mesh.skeleton, mesh.bindMatrix);
  }
  outline.raycast = () => {};
  outline.visible = false;
  // Hidden until cartoon mode, but still compiled by the scene prewarm
  outline.userData.prewarm = true;

  return outline;
};

// Mounted inside the scene's Suspense so every model below targetRef has loaded and applied its own shader patches.
// Adds cel shading and ink outlines to lit materials, styled by material.userData.toonStyle and revealed by the shared toon amount.
export const ToonStyle = ({ targetRef }: Props) => {
  const size = useThree((s) => s.size);
  const outlinesRef = useRef<Mesh[]>([]);

  useEffect(() => {
    const target = targetRef.current;
    if (!target) {
      return;
    }
    const outlineMaterials = new Map<Material, Material>();
    const meshes: Mesh[] = [];
    target.traverse((object) => {
      if (
        object instanceof Mesh &&
        !Array.isArray(object.material) &&
        isLitMaterial(object.material)
      ) {
        meshes.push(object);
      }
    });

    outlinesRef.current = meshes.map((mesh) => {
      const material = mesh.material as Material;
      const style: ToonStyleName = material.userData.toonStyle ?? 'cel';
      applyToonShader(material, style);
      if (!outlineMaterials.has(material)) {
        outlineMaterials.set(material, createOutlineMaterial(material, style));
      }
      const outline = createOutline(mesh, outlineMaterials.get(material)!);
      mesh.add(outline);

      return outline;
    });

    return () => {
      outlinesRef.current.forEach((outline) => outline.removeFromParent());
      outlineMaterials.forEach((material) => material.dispose());
      outlinesRef.current = [];
    };
  }, [targetRef]);

  useEffect(() => {
    toonUniforms.uOutlineResolution.value.set(size.width, size.height);
  }, [size]);

  useFrame(() => {
    const showOutlines = toonUniforms.uToonAmount.value > 0;
    outlinesRef.current.forEach((outline) => {
      outline.visible = showOutlines;
    });
  });

  return null;
};
