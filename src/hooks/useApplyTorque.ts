import { Mesh, Vector3 } from 'three';
import { RapierRigidBody } from '@react-three/rapier';

interface IUseApplyTorque {
  keys: {
    upward?: boolean,
    downward?: boolean,
    leftward?: boolean,
    rightward?: boolean,
  },
  selectedVertexPosition: Vector3 | null,
  selectedVertex: Mesh | null,
  body: RapierRigidBody | null,
  delta: number,
}

export const useApplyTorque = ({ keys, selectedVertex, selectedVertexPosition, body, delta }: IUseApplyTorque) => {
  const { upward, downward, leftward, rightward } = keys;

  const torque = {
    x: 0,
    y: 0,
    z: 0
  };
  const torqueStrength = 1000 * delta;

  if (selectedVertex && selectedVertexPosition) {
    const torqueStrengthModifier = 0.02;
    const distanceStrengthModifier = 2.2;
    const directionStrengthModifier = 2.2;
    const locus = selectedVertexPosition.distanceTo(new Vector3(0, 0, 1.3)) * distanceStrengthModifier;
    const yStrengthModifier = Math.abs(selectedVertexPosition.y) * directionStrengthModifier;
    const xStrengthModifier = Math.abs(selectedVertexPosition.x) * directionStrengthModifier;

    if (selectedVertexPosition.y > 0) {
      torque.x += torqueStrength * torqueStrengthModifier * locus * yStrengthModifier;
    }

    if (selectedVertexPosition.y < 0) {
      torque.x -= torqueStrength * torqueStrengthModifier * locus * yStrengthModifier;
    }

    if (selectedVertexPosition.x < 0) {
      torque.y += torqueStrength * torqueStrengthModifier * locus * xStrengthModifier;
    }

    if (selectedVertexPosition.x > 0) {
      torque.y -= torqueStrength * torqueStrengthModifier * locus * xStrengthModifier;
    }
  }

  if (upward) {
    torque.x += torqueStrength * 0.4;
  }

  if (downward) {
    torque.x -= torqueStrength * 0.4;
  }

  if (leftward) {
    torque.y += torqueStrength * 0.4;
  }

  if (rightward) {
    torque.y -= torqueStrength * 0.4;
  }

  body?.applyTorqueImpulse(torque, true);
};
