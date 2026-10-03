import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { TYPES, type JunkItem, type JunkType, BAY, TRUCK } from "./content";
import { getMove } from "./input";
import { dampYaw, playerPos, playerSpeed, playerYaw } from "./pose";
import { useGame } from "./store";

function grassTexture() {
  const c = document.createElement("canvas");
  c.width = c.height = 256;
  const g = c.getContext("2d");
  if (!g) return new THREE.CanvasTexture(c);
  g.fillStyle = "#67a344";
  g.fillRect(0, 0, 256, 256);
  for (let i = 0; i < 700; i++) {
    g.fillStyle = i % 2 ? "#78b84e" : "#4f8a32";
    g.fillRect(Math.random() * 256, Math.random() * 256, 2, 5);
  }
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(8, 8);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

function Ground() {
  const map = useMemo(grassTexture, []);
  useEffect(() => () => map.dispose(), [map]);
  return (
    <group>
      <mesh rotation-x={-Math.PI / 2} receiveShadow>
        <planeGeometry args={[80, 80]} />
        <meshStandardMaterial map={map} roughness={1} />
      </mesh>
      <mesh rotation-x={-Math.PI / 2} position={[-12, 0.02, 1]} receiveShadow>
        <planeGeometry args={[8, 14]} />
        <meshStandardMaterial color="#b7b1a6" roughness={0.9} />
      </mesh>
    </group>
  );
}

function House({ x, z, wall }: { x: number; z: number; wall: string }) {
  return (
    <group position={[x, 0, z]}>
      <mesh position={[0, 1.2, 0]} castShadow receiveShadow>
        <boxGeometry args={[4.2, 2.4, 3.4]} />
        <meshStandardMaterial color={wall} />
      </mesh>
      <mesh position={[0, 2.9, 0]} rotation-y={Math.PI / 4} castShadow>
        <coneGeometry args={[3.3, 1.5, 4]} />
        <meshStandardMaterial color="#8d4e3b" />
      </mesh>
      <mesh position={[0, 0.6, 1.72]}>
        <boxGeometry args={[0.7, 1.2, 0.08]} />
        <meshStandardMaterial color="#5c4636" />
      </mesh>
    </group>
  );
}

function Tree({ x, z }: { x: number; z: number }) {
  return (
    <group position={[x, 0, z]}>
      <mesh position={[0, 0.7, 0]} castShadow>
        <cylinderGeometry args={[0.18, 0.24, 1.4, 6]} />
        <meshStandardMaterial color="#6b4a2b" />
      </mesh>
      <mesh position={[0, 1.9, 0]} castShadow>
        <sphereGeometry args={[1.1, 10, 8]} />
        <meshStandardMaterial color="#2f7a3a" />
      </mesh>
    </group>
  );
}

function Truck() {
  return (
    <group position={[TRUCK.x, 0, TRUCK.z]}>
      <mesh position={[-0.2, 1.15, 0]} castShadow>
        <boxGeometry args={[2.2, 1.5, 2.1]} />
        <meshStandardMaterial color="#e6a31a" roughness={0.45} />
      </mesh>
      <mesh position={[1.7, 0.9, 0]} castShadow>
        <boxGeometry args={[2.6, 0.9, 2.2]} />
        <meshStandardMaterial color="#e6a31a" roughness={0.45} />
      </mesh>
      <mesh position={[-1.25, 1.35, 0]}>
        <boxGeometry args={[0.1, 0.6, 1.4]} />
        <meshStandardMaterial color="#9fd0ea" />
      </mesh>
      {[
        [-0.6, 1.05],
        [-0.6, -1.05],
        [2.1, 1.05],
        [2.1, -1.05],
      ].map(([x, z]) => (
        <mesh key={`${x}-${z}`} position={[x!, 0.38, z!]} rotation-x={Math.PI / 2} castShadow>
          <cylinderGeometry args={[0.38, 0.38, 0.3, 12]} />
          <meshStandardMaterial color="#222222" />
        </mesh>
      ))}
    </group>
  );
}

function Bay() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(() => {
    const mesh = ref.current;
    if (!mesh) return;
    const near = (playerPos.x - BAY.x) ** 2 + (playerPos.z - BAY.z) ** 2 < 2.3 ** 2;
    const mat = mesh.material as THREE.MeshBasicMaterial;
    mat.opacity = near ? 1 : 0.45;
  });
  return (
    <mesh ref={ref} rotation-x={-Math.PI / 2} position={[BAY.x, 0.06, BAY.z]}>
      <ringGeometry args={[1.6, 2.15, 28]} />
      <meshBasicMaterial color="#e6a31a" side={THREE.DoubleSide} transparent opacity={0.55} />
    </mesh>
  );
}

function JunkShape({ type }: { type: JunkType }) {
  if (type === "bag") {
    return (
      <mesh castShadow scale={[1, 1.15, 0.9]}>
        <sphereGeometry args={[0.32, 10, 8]} />
        <meshStandardMaterial color={TYPES.bag.color} />
      </mesh>
    );
  }
  if (type === "box") {
    return (
      <mesh castShadow>
        <boxGeometry args={[0.55, 0.4, 0.5]} />
        <meshStandardMaterial color={TYPES.box.color} />
      </mesh>
    );
  }
  if (type === "tire") {
    return (
      <mesh rotation-x={Math.PI / 2} castShadow>
        <torusGeometry args={[0.28, 0.1, 8, 16]} />
        <meshStandardMaterial color={TYPES.tire.color} />
      </mesh>
    );
  }
  if (type === "tv") {
    return (
      <group>
        <mesh castShadow>
          <boxGeometry args={[0.62, 0.46, 0.28]} />
          <meshStandardMaterial color={TYPES.tv.color} />
        </mesh>
        <mesh position={[0, 0, 0.16]}>
          <boxGeometry args={[0.46, 0.3, 0.04]} />
          <meshStandardMaterial color="#9fd0ea" />
        </mesh>
      </group>
    );
  }
  if (type === "fridge") {
    return (
      <mesh position={[0, 0.48, 0]} castShadow>
        <boxGeometry args={[0.55, 0.95, 0.5]} />
        <meshStandardMaterial color={TYPES.fridge.color} />
      </mesh>
    );
  }
  return (
    <group>
      <mesh castShadow>
        <boxGeometry args={[1.1, 0.32, 0.5]} />
        <meshStandardMaterial color={TYPES.couch.color} />
      </mesh>
      <mesh position={[0, 0.28, -0.16]} castShadow>
        <boxGeometry args={[1.1, 0.4, 0.16]} />
        <meshStandardMaterial color={TYPES.couch.color} />
      </mesh>
    </group>
  );
}

function JunkMesh({ item }: { item: JunkItem }) {
  const ref = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    const base = item.type === "fridge" ? 0 : item.type === "couch" ? 0.2 : 0.3;
    ref.current.position.y = base + Math.sin(clock.elapsedTime * 2 + item.x) * 0.04;
  });
  const y = item.type === "fridge" ? 0 : item.type === "couch" ? 0.2 : 0.3;
  return (
    <group ref={ref} position={[item.x, y, item.z]}>
      <JunkShape type={item.type} />
    </group>
  );
}

function FollowCam() {
  const { camera } = useThree();
  const desired = useMemo(() => new THREE.Vector3(), []);
  useFrame((_, raw) => {
    const dt = Math.min(raw, 0.1);
    desired.set(playerPos.x, 11, playerPos.z + 12);
    const k = 1 - Math.exp(-4 * dt);
    camera.position.lerp(desired, k);
    camera.lookAt(playerPos.x, 1, playerPos.z);
  });
  return null;
}

function Fred() {
  const ref = useRef<THREE.Group>(null);
  const legL = useRef<THREE.Mesh>(null);
  const legR = useRef<THREE.Mesh>(null);
  const bob = useRef(0);
  const heavyCd = useRef(0);
  const hatId = useGame((s) => s.hatId);
  const carried = useGame((s) => s.carried);
  const hat = "#e6a31a";
  const hatColor = hatId === "green" ? "#3d8f62" : hatId === "orange" ? "#e07a2f" : hatId === "blue" ? "#2c4c8a" : hat;

  useFrame((_, raw) => {
    const dt = Math.min(raw, 0.1);
    const game = useGame.getState();
    heavyCd.current = Math.max(0, heavyCd.current - dt);
    if (game.phase === "play") {
      const move = getMove();
      const speed = 5.2 - game.carry * 0.55;
      const vx = move.x * speed;
      const vz = move.y * speed;
      playerSpeed.current = Math.hypot(vx, vz);
      if (playerSpeed.current > 0.15) {
        const target = Math.atan2(-vx, -vz);
        playerYaw.current = dampYaw(playerYaw.current, target, dt);
        bob.current += dt * 10;
      }
      playerPos.x = Math.max(-16, Math.min(18, playerPos.x + vx * dt));
      playerPos.z = Math.max(-12, Math.min(12, playerPos.z + vz * dt));
      game.tick(dt);

      const now = useGame.getState();
      if (now.phase === "play") {
        for (const item of now.junk) {
          const dx = playerPos.x - item.x;
          const dz = playerPos.z - item.z;
          if (dx * dx + dz * dz < 1.2) {
            const result = useGame.getState().collect(item.id);
            if (result === "heavy" && heavyCd.current <= 0) {
              heavyCd.current = 1.2;
              useGame.setState({ toast: "Too heavy — dump at the yellow ring" });
            }
            break;
          }
        }
        const bx = playerPos.x - BAY.x;
        const bz = playerPos.z - BAY.z;
        if (bx * bx + bz * bz < 2.3 * 2.3) useGame.getState().dump();
      }
    } else {
      playerSpeed.current = 0;
    }

    const body = ref.current;
    if (body) {
      body.position.copy(playerPos);
      body.rotation.y = playerYaw.current + Math.PI;
    }
    const swing = playerSpeed.current > 0.15 ? Math.sin(bob.current) * 0.7 : 0;
    if (legL.current) legL.current.rotation.x = swing;
    if (legR.current) legR.current.rotation.x = -swing;
  });

  return (
    <group ref={ref} position={[-8, 0, 1]}>
      <mesh position={[0, 1.05, 0]} castShadow>
        <boxGeometry args={[0.7, 0.75, 0.42]} />
        <meshStandardMaterial color="#2f6b4f" />
      </mesh>
      <mesh position={[0, 1.68, 0]} castShadow>
        <sphereGeometry args={[0.28, 14, 12]} />
        <meshStandardMaterial color="#e2b48a" />
      </mesh>
      <mesh position={[0, 1.58, 0.24]}>
        <boxGeometry args={[0.26, 0.06, 0.08]} />
        <meshStandardMaterial color="#6b4a2b" />
      </mesh>
      <mesh position={[0, 1.92, 0]} castShadow>
        <cylinderGeometry args={[0.3, 0.3, 0.12, 14]} />
        <meshStandardMaterial color={hatColor} />
      </mesh>
      <mesh position={[0, 1.88, 0.22]}>
        <boxGeometry args={[0.34, 0.04, 0.22]} />
        <meshStandardMaterial color={hatColor} />
      </mesh>
      <mesh ref={legL} position={[-0.16, 0.5, 0]} castShadow>
        <boxGeometry args={[0.2, 0.48, 0.22]} />
        <meshStandardMaterial color="#3d4f8a" />
      </mesh>
      <mesh ref={legR} position={[0.16, 0.5, 0]} castShadow>
        <boxGeometry args={[0.2, 0.48, 0.22]} />
        <meshStandardMaterial color="#3d4f8a" />
      </mesh>
      <mesh position={[-0.46, 1.05, 0]}>
        <boxGeometry args={[0.16, 0.46, 0.16]} />
        <meshStandardMaterial color="#e2b48a" />
      </mesh>
      <mesh position={[0.46, 1.05, 0]}>
        <boxGeometry args={[0.16, 0.46, 0.16]} />
        <meshStandardMaterial color="#e2b48a" />
      </mesh>
      {carried.map((type, i) => (
        <mesh key={`${type}-${i}`} position={[0.12, 1.25 + i * 0.18, -0.38]} castShadow>
          <boxGeometry args={[0.28, 0.16, 0.28]} />
          <meshStandardMaterial color={TYPES[type].color} />
        </mesh>
      ))}
    </group>
  );
}

function JunkField() {
  const junk = useGame((s) => s.junk);
  return (
    <group>
      {junk.map((item) => (
        <JunkMesh key={item.id} item={item} />
      ))}
    </group>
  );
}

export function Scene() {
  return (
    <>
      <color attach="background" args={["#8ec5ef"]} />
      <fog attach="fog" args={["#8ec5ef", 28, 62]} />
      <hemisphereLight args={["#fff4d2", "#3d6b34", 0.85]} />
      <directionalLight
        position={[-12, 22, 8]}
        intensity={1.15}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-left={-24}
        shadow-camera-right={24}
        shadow-camera-top={24}
        shadow-camera-bottom={-24}
      />
      <Ground />
      <House x={-4} z={-16} wall="#efe6d4" />
      <House x={2} z={-16} wall="#e7d3b0" />
      <House x={8} z={-16} wall="#f3efe4" />
      <House x={14} z={-16} wall="#e4c9a4" />
      <Tree x={-18} z={-8} />
      <Tree x={-18} z={6} />
      <Tree x={18} z={-6} />
      <Tree x={20} z={8} />
      <Tree x={6} z={14} />
      <Tree x={-6} z={13} />
      <Truck />
      <Bay />
      <JunkField />
      <Fred />
      <FollowCam />
    </>
  );
}
