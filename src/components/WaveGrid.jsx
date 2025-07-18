"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function WaveGrid() {
  const meshRef = useRef();

  const randomPhases = useMemo(() => {
    const arr = [];
    for (let i = 0; i < (32 + 1) * (32 + 1); i++) {
      arr.push(Math.random() * Math.PI * 2);
    }
    return arr;
  }, []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const pos = meshRef.current.geometry.attributes.position;

    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const phase = randomPhases[i]; // fixed randomness per vertex
      const wave = Math.sin(x * 1.5 + y * 1.5 + t * 3 + phase) * 0.15;
      pos.setZ(i, wave);
    }

    pos.needsUpdate = true;
  });
  return (
    <mesh
      ref={meshRef}
      position={[0, -1.2, 0]}
      rotation={[Math.PI/2, 0, 0]} // horizontal
    >
      {/* define size of mesh/grid  and number of segments*/}
      <planeGeometry args={[10, 10, 32, 32]} />
      <meshBasicMaterial color="#d0d0d0" wireframe transparent opacity={0.3} />
    </mesh>
  );
}
