import type { CameraControls } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { type RefObject, useCallback, useRef } from 'react';
import { type Camera, Vector3 } from 'three';

const DONE_THRESHOLD = 0.999;

// Rolls the camera (its up vector) from its current up to a target up in step with the controls' position transition,
// re-aiming at the controls' current target each frame. CameraControls only reads camera.up while it updates.
// drei rebinds CameraControls to whichever camera is default, so the roll stops once the controls move to another camera.
export const useCameraRoll = (
  controlsRef: RefObject<CameraControls | null>,
) => {
  const isRollingRef = useRef(false);
  const rollingCameraRef = useRef<Camera | null>(null);
  const startUpRef = useRef(new Vector3());
  const targetUpRef = useRef(new Vector3());
  const startPositionRef = useRef(new Vector3());
  const scratch = useRef({
    position: new Vector3(),
    endPosition: new Vector3(),
    target: new Vector3(),
  });

  useFrame(() => {
    const controls = controlsRef.current;
    if (!isRollingRef.current || !controls) {
      return;
    }
    if (controls.camera !== rollingCameraRef.current) {
      isRollingRef.current = false;

      return;
    }
    const { position, endPosition, target } = scratch.current;
    controls.getPosition(position, false);
    controls.getPosition(endPosition, true);
    const totalDistance = startPositionRef.current.distanceTo(endPosition);
    const progress =
      totalDistance > 0
        ? Math.min(
            Math.max(1 - position.distanceTo(endPosition) / totalDistance, 0),
            1,
          )
        : 1;

    const { camera } = controls;
    camera.up
      .copy(startUpRef.current)
      .lerp(targetUpRef.current, progress)
      .normalize();
    if (progress >= DONE_THRESHOLD) {
      camera.up.copy(targetUpRef.current);
      isRollingRef.current = false;
    }
    camera.lookAt(controls.getTarget(target, false));
  });

  // Call alongside a transitioned setLookAt; the roll completes when the camera reaches its end position
  return useCallback(
    (up: Vector3) => {
      const controls = controlsRef.current;
      if (!controls) {
        return;
      }
      rollingCameraRef.current = controls.camera;
      startUpRef.current.copy(controls.camera.up);
      targetUpRef.current.copy(up);
      controls.getPosition(startPositionRef.current, false);
      isRollingRef.current = true;
    },
    [controlsRef],
  );
};
