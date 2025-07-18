"use client";
import { Canvas, useLoader, useFrame } from "@react-three/fiber";
import { Environment, OrbitControls, useGLTF } from "@react-three/drei";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

import { useMemo } from "react";

export function MirrorOrbs({ count = 60 }) {
  // Create random positions once
  const positions = useMemo(() => {
    return Array.from({ length: count }, () => [
      THREE.MathUtils.randFloat(-15, 15),
      THREE.MathUtils.randFloat(-4, 10),
      THREE.MathUtils.randFloat(-1, -7),
    ]);
  }, [count]);

  return (
    <>
      {positions.map((pos, i) => (
        <mesh key={i} position={pos}>
          <sphereGeometry args={[0.3, 32, 32]} />
          <meshPhysicalMaterial
            metalness={1}
            roughness={0}
            envMapIntensity={1}
          />
        </mesh>
      ))}
    </>
  );
}

const Angel = () => {
  const { scene } = useGLTF("/angel/weeping_angel.glb");
  const normalMap = useLoader(THREE.TextureLoader, "/angel/normal.jpg");
  const [useCustomMaterial, setUseCustomMaterial] = useState(true);
  const originalMaterials = useRef([]);
  const cooldownRef = useRef(false);
  const soundAwaken = useRef(null);
  const soundCrystal = useRef(null);

  useEffect(() => {
    const originals = [];
    scene.traverse((child) => {
      if (child.isMesh) {
        originals.push({ mesh: child, material: child.material });

        const mat = new THREE.MeshPhysicalMaterial({
          normalMap: normalMap,
          color: 0xccfffd,
          transmission: 1,
          roughness: 0.2,
          thickness: 9,
          ior: 1.3,
        });

        child.material = mat;
      }
    });
    originalMaterials.current = originals;
  }, [scene, normalMap]);

  useEffect(() => {
    soundAwaken.current = new Audio("/angel/barge.wav");
    soundCrystal.current = new Audio("/angel/chime.wav");
  }, []);

  const AwakenWeeper = () => {
    // console.log("Awaken weeper called")
    if (cooldownRef.current) return;
    cooldownRef.current = true;
    setTimeout(() => {
      cooldownRef.current = false;
    }, 1000); // 1 second cooldown
    const next = !useCustomMaterial;
    // console.log("next var: ", next);

    if (next) {
      soundCrystal.current?.cloneNode().play();
      // console.log("Play crystal")
    } else {
      soundAwaken.current?.cloneNode().play();
      // console.log("Play awaken")
    }

    originalMaterials.current.forEach(({ mesh, material }) => {
      if (next) {
        // console.log("a part of mesh changed")
        mesh.material = new THREE.MeshPhysicalMaterial({
          normalMap,
          color: 0xccfffd,
          transmission: 1,
          roughness: 0.2,
          thickness: 9,
          ior: 1.3,
        });
      } else {
        // console.log("mesh set back to ogirinal")
        mesh.material = material;
      }
    });

    setUseCustomMaterial(next);
    // console.log("flipped use custom material prop")
  };

  return (
    <primitive
      object={scene}
      scale={0.1}
      position={[0, -5.5, 1]}
      rotation={[0, Math.PI / 2, 0]}
      onClick={AwakenWeeper}
    />
  );
};

export function ParallaxCamera() {
  const cameraRef = useRef(null);
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouse.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.current.y = -(e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useFrame(({ camera }) => {
    if (!cameraRef.current) cameraRef.current = camera;
    const parallaxStrength = 5;
    const smoothingFactor = 0.2;

    camera.position.x +=
      (mouse.current.x * parallaxStrength - camera.position.x) *
      smoothingFactor;
    camera.position.y +=
      (mouse.current.y * parallaxStrength - camera.position.y) *
      smoothingFactor;
    camera.lookAt(0, 0, 0);
  });
  return null;
}

export default function WeepingAngel() {
  return (
    <Canvas
      camera={{ position: [0, 0, 7], fov: 50 }}
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        cursor: "var(--cursor-chooseth)",
      }}
    >
      <ambientLight intensity={0.5} />
      <ParallaxCamera />

      <Environment
        files={[
          "/angel/px.jpg",
          "/angel/nx.jpg",
          "/angel/py.jpg",
          "/angel/ny.jpg",
          "/angel/pz.jpg",
          "/angel/nz.jpg",
        ]}
        background
      />
      <Angel />
      <MirrorOrbs />
    </Canvas>
  );
}
