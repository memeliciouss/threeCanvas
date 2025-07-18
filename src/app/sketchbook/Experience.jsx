"use client";
import { Environment, OrbitControls } from "@react-three/drei";
import { Book } from "./Book";
export const Experience = () => {
  return (
    <>
      <color attach="background" args={['#00ffff']}/>
      <Book />
      <OrbitControls />
      <directionalLight
        position={[2, 5, 2]}
        intensity={2.5}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-bias={-0.0001}
      />
      <ambientLight intensity={0.3} />
      <pointLight position={[0, 1, 3]} intensity={0.5} color="#ffffff" />
      <mesh rotation-x={-Math.PI / 2} position={[0, -1.5, 0]} receiveShadow>
        <planeGeometry args={[100, 100]} />
        <shadowMaterial transparent opacity={0.25} />
      </mesh>
    </>
  );
};
