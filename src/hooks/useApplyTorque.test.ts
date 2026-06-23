import { Vector3 } from 'three';
import { describe, expect, it, vi } from 'vitest';

import { useApplyTorque } from './useApplyTorque';

const mockBody = () => ({ applyTorqueImpulse: vi.fn() });

const noKeys = {
  upward: false,
  downward: false,
  leftward: false,
  rightward: false,
};

describe('useApplyTorque', () => {
  it('does not throw when body is null', () => {
    expect(() =>
      useApplyTorque({
        keys: noKeys,
        selectedVertex: null,
        selectedVertexPosition: null,
        body: null,
        delta: 0.016,
      }),
    ).not.toThrow();
  });

  it('applies no torque when no keys pressed and no vertex selected', () => {
    const body = mockBody();
    useApplyTorque({
      keys: noKeys,
      selectedVertex: null,
      selectedVertexPosition: null,
      body,
      delta: 0.016,
    });
    expect(body.applyTorqueImpulse).toHaveBeenCalledWith(
      { x: 0, y: 0, z: 0 },
      true,
    );
  });

  it('applies positive x torque when upward key is pressed', () => {
    const body = mockBody();
    useApplyTorque({
      keys: { ...noKeys, upward: true },
      selectedVertex: null,
      selectedVertexPosition: null,
      body,
      delta: 0.016,
    });
    const [torque] = body.applyTorqueImpulse.mock.calls[0];
    expect(torque.x).toBeGreaterThan(0);
  });

  it('applies negative x torque when downward key is pressed', () => {
    const body = mockBody();
    useApplyTorque({
      keys: { ...noKeys, downward: true },
      selectedVertex: null,
      selectedVertexPosition: null,
      body,
      delta: 0.016,
    });
    const [torque] = body.applyTorqueImpulse.mock.calls[0];
    expect(torque.x).toBeLessThan(0);
  });

  it('applies positive y torque when leftward key is pressed', () => {
    const body = mockBody();
    useApplyTorque({
      keys: { ...noKeys, leftward: true },
      selectedVertex: null,
      selectedVertexPosition: null,
      body,
      delta: 0.016,
    });
    const [torque] = body.applyTorqueImpulse.mock.calls[0];
    expect(torque.y).toBeGreaterThan(0);
  });

  it('applies negative y torque when rightward key is pressed', () => {
    const body = mockBody();
    useApplyTorque({
      keys: { ...noKeys, rightward: true },
      selectedVertex: null,
      selectedVertexPosition: null,
      body,
      delta: 0.016,
    });
    const [torque] = body.applyTorqueImpulse.mock.calls[0];
    expect(torque.y).toBeLessThan(0);
  });

  it('adds x torque contribution from vertex above centre (positive y)', () => {
    const body = mockBody();
    const mesh = {} as never;
    const pos = new Vector3(0, 1, 0);
    useApplyTorque({
      keys: noKeys,
      selectedVertex: mesh,
      selectedVertexPosition: pos,
      body,
      delta: 0.016,
    });
    const [torque] = body.applyTorqueImpulse.mock.calls[0];
    expect(torque.x).toBeGreaterThan(0);
  });

  it('subtracts x torque contribution from vertex below centre (negative y)', () => {
    const body = mockBody();
    const mesh = {} as never;
    const pos = new Vector3(0, -1, 0);
    useApplyTorque({
      keys: noKeys,
      selectedVertex: mesh,
      selectedVertexPosition: pos,
      body,
      delta: 0.016,
    });
    const [torque] = body.applyTorqueImpulse.mock.calls[0];
    expect(torque.x).toBeLessThan(0);
  });

  it('adds positive y torque from vertex left of centre (negative x)', () => {
    const body = mockBody();
    const mesh = {} as never;
    const pos = new Vector3(-1, 0, 0);
    useApplyTorque({
      keys: noKeys,
      selectedVertex: mesh,
      selectedVertexPosition: pos,
      body,
      delta: 0.016,
    });
    const [torque] = body.applyTorqueImpulse.mock.calls[0];
    expect(torque.y).toBeGreaterThan(0);
  });

  it('subtracts y torque from vertex right of centre (positive x)', () => {
    const body = mockBody();
    const mesh = {} as never;
    const pos = new Vector3(1, 0, 0);
    useApplyTorque({
      keys: noKeys,
      selectedVertex: mesh,
      selectedVertexPosition: pos,
      body,
      delta: 0.016,
    });
    const [torque] = body.applyTorqueImpulse.mock.calls[0];
    expect(torque.y).toBeLessThan(0);
  });
});
