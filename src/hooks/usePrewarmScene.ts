import { useFrame, useThree } from '@react-three/fiber';
import { type RefObject, useRef } from 'react';
import {
  type Material,
  type Mesh,
  type Object3D,
  type Texture,
  type ToneMapping,
  WebGLRenderTarget,
} from 'three';

type Stage = 'idle' | 'compiling' | 'uploading' | 'done';

interface Options {
  enabled: boolean;
  targetRef: RefObject<Object3D | null>;
  hiddenRef: RefObject<Object3D | null>;
  toneMapping: ToneMapping;
  onComplete: () => void;
}

const collectTextures = (root: Object3D) => {
  const textures = new Set<Texture>();
  root.traverse((object) => {
    const material = (object as Mesh).material as
      | Material
      | Material[]
      | undefined;
    [material ?? []].flat().forEach((m) =>
      Object.values(m).forEach((value) => {
        if ((value as Texture | null)?.isTexture) {
          textures.add(value as Texture);
        }
      }),
    );
  });

  return [...textures];
};

// Compiles shaders for `targetRef` while it is hidden, using the render state it will be drawn with
// (target visible, `hiddenRef` hidden, `toneMapping` applied), then uploads its textures to the GPU one per frame.
export const usePrewarmScene = ({
  enabled,
  targetRef,
  hiddenRef,
  toneMapping,
  onComplete,
}: Options) => {
  const { gl, scene, camera } = useThree();
  const stageRef = useRef<Stage>('idle');
  const texturesRef = useRef<Texture[]>([]);

  useFrame(() => {
    const target = targetRef.current;
    const hidden = hiddenRef.current;
    if (!enabled || !target || !hidden) {
      return;
    }

    if (stageRef.current === 'idle') {
      stageRef.current = 'compiling';
      const [targetWasVisible, hiddenWasVisible] = [
        target.visible,
        hidden.visible,
      ];
      const previousToneMapping = gl.toneMapping;
      target.visible = true;
      hidden.visible = false;
      gl.toneMapping = toneMapping;
      // Programs are created synchronously here and linked in parallel off the main thread.
      // The second pass covers the linear, non-tone-mapped variants used by offscreen passes (e.g. transmission).
      const previousRenderTarget = gl.getRenderTarget();
      const offscreenTarget = new WebGLRenderTarget(1, 1);
      const onscreen = gl.compileAsync(scene, camera);
      gl.setRenderTarget(offscreenTarget);
      const offscreen = gl.compileAsync(scene, camera);
      gl.setRenderTarget(previousRenderTarget);
      offscreenTarget.dispose();
      const compiled = Promise.all([onscreen, offscreen]);
      gl.toneMapping = previousToneMapping;
      target.visible = targetWasVisible;
      hidden.visible = hiddenWasVisible;
      texturesRef.current = collectTextures(target);
      compiled.then(() => {
        stageRef.current = 'uploading';
      });

      return;
    }

    if (stageRef.current !== 'uploading') {
      return;
    }

    const texture = texturesRef.current.shift();
    if (texture) {
      gl.initTexture(texture);

      return;
    }

    stageRef.current = 'done';
    onComplete();
  });
};
