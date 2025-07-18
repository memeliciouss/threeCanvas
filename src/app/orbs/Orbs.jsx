import { useRef, useState, useEffect } from "react";
import { OrbitControls, Environment } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";

const RotatingCube = ({ position, axes = ["x", "y"], reflective = false }) => {
  const [orb, chooseOrb] = useState(false);
  const meshRef = useRef();
  const audioRef = useRef(null);

  useFrame(() => {
    if (meshRef.current) {
      if (axes.includes("x")) meshRef.current.rotation.x += 0.02;
      if (axes.includes("y")) meshRef.current.rotation.y += 0.02;
      if (axes.includes("z")) meshRef.current.rotation.z += 0.02;
    }
  });

  useEffect(() => {
    audioRef.current = new Audio("/orbs/respawn_anchor.ogg");
  }, []);

  const chooseEthOrb = () => {
    chooseOrb(!orb);
    if (audioRef.current) {
      const sound = audioRef.current.cloneNode();
      sound.play();
    }
  };

  return (
    <mesh ref={meshRef} position={position} onClick={chooseEthOrb}>
      <boxGeometry args={[2, 2, 2]} />
      {orb ? (
        <meshStandardMaterial
          color="white"
          metalness={1}
          roughness={0}
          envMapIntensity={1}
        />
      ) : (
        <meshStandardMaterial
          color="#923636"
          metalness={0}
          roughness={1}
          envMapIntensity={1}
          emissive={0x923636}
          emissiveIntensity={0.2}
        />
      )}
    </mesh>
  );
};

export default function Orbs() {
  return (
    <Canvas
      camera={{ position: [0, 0, 12] }}
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        cursor: "url(/cursors/chooseth.cur)",
      }}
    >
      <OrbitControls enableZoom={false} enableRotate enablePan={false} />
      <Environment
        gl={{ toneMappingExposure: 0.1 }}
        files="/orbs/star_night.hdr"
        background
      />
      <RotatingCube position={[-4, 0, 0]} axes={["x", "y"]} />
      <RotatingCube position={[0, 0, 0]} axes={["y", "z"]} />
      <RotatingCube position={[4, 0, 0]} axes={["x", "z"]} />
    </Canvas>
  );
}
