"use client";
import { Environment, Float, OrbitControls } from "@react-three/drei";
import { Book } from "./Book";
export const Experience = () => {
  return (
    <>
      <color attach="background" args={["#00ffff"]} />
      <Float
        rotation-x={-Math.PI / 4}
        floatIntensity={1}
        speed={2}
        rotationIntensity={2}
      >
        {/* Float to make the whole book have a slight hovering effect */}
        <Book />
      </Float>
      <OrbitControls
        enablePan={true}
        screenSpacePanning={false}
        maxPolarAngle={Math.PI / 2}
        minDistance={2}
        maxDistance={8}
        // to limit panning, by restricting how far the targer can move
        onChange={(e) => {
          const t = e.target.target;
          t.x = Math.max(-2, Math.min(2, t.x));
          t.y = Math.max(-0.5, Math.min(2, t.y));
          t.z = Math.max(-2, Math.min(2, t.z));
        }}
      />

      <directionalLight
        position={[2, 5, 2]}
        intensity={1.8}
        color={0xfff9e6}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-bias={-0.0001}
      />

      <directionalLight
        position={[-2, 5, -2]}
        intensity={0.9}
        color={0xfff9e6}
      />

      <ambientLight intensity={0.5} />
      <mesh rotation-x={-Math.PI / 2} position={[0, -1.5, 0]} receiveShadow>
        <planeGeometry args={[10, 10]} />
        <shadowMaterial transparent opacity={0.25} />
      </mesh>
    </>
  );
};
