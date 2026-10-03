import * as THREE from "three";

/** Shared pose so the camera and the controls probe read the same body. */
export const playerPos = new THREE.Vector3(-8, 0, 1);
export const playerYaw = { current: 0 };
export const playerSpeed = { current: 0 };
export const timeLeft = { current: 55 };

export function resetPose() {
  playerPos.set(-8, 0, 1);
  playerYaw.current = 0;
  playerSpeed.current = 0;
}

/** Shortest-arc turn. +yaw faces the body toward world −X (screen-left from the chase cam). */
export function dampYaw(current: number, target: number, dt: number) {
  const delta = Math.atan2(Math.sin(target - current), Math.cos(target - current));
  const max = 14 * dt;
  return current + Math.max(-max, Math.min(max, delta));
}
