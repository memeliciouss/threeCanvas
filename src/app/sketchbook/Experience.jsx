"use client";
import {
  Environment,
  Float,
  OrbitControls,
  useGLTF,
  useTexture,
} from "@react-three/drei";
import { Book } from "./Book";
import { useEffect, useState } from "react";
import { useThree } from "@react-three/fiber";
import { SRGBColorSpace } from "three";

export const Experience = () => {
  const { camera } = useThree();
  useEffect(() => {
    const enableLayers = () => {
      camera.layers.enable(0);
      camera.layers.enable(1);
    };

    enableLayers(); // run on mount

    window.addEventListener("resize", enableLayers);
    return () => window.removeEventListener("resize", enableLayers);
  }, [camera]);

  return (
    <>
      <Float
        rotation-x={-Math.PI / 4}
        floatIntensity={1}
        speed={2}
        rotationIntensity={2}
      >
        <Book />
      </Float>

      <Office />
      <Turtle />

      <Environment background files={"sketchbook/starmap.exr"} />

      <OrbitControls
        enablePan
        screenSpacePanning={false}
        minDistance={1}
        maxDistance={50}
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

      <ambientLight intensity={1} layers={[1]} />

      <mesh rotation-x={-Math.PI / 2} position={[0, -1.5, 0]} receiveShadow>
        <planeGeometry args={[10, 10]} />
        <shadowMaterial transparent opacity={0.25} />
      </mesh>
    </>
  );
};

export function Office() {
  const { scene } = useGLTF("/sketchbook/compress_office.glb");
  useEffect(() => {
    scene.traverse((child) => {
      if (child.isMesh) {
        child.layers.set(1);
        if (child.material?.color) {
          child.material.color.multiplyScalar(0.5);
        }
      }
    });
  }, [scene]);
  return (
    <primitive
      object={scene}
      scale={6}
      position={[0, -8, 0]}
      rotation={[0, -1.3, 0]}
    />
  );
}

export function Turtle() {
  const { scene } = useGLTF("/sketchbook/turtle.glb");
  return <primitive object={scene} scale={0.5} position={[-9, -8, 8]} />;
}

export function BackgroundImage() {
  const night = useTexture("/sketchbook/night.png");
  const { scene } = useThree();
  night.colorSpace = SRGBColorSpace;
  useEffect(() => {
    scene.background = night;
  }, [night, scene]);
  return null;
}
