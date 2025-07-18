"use client";

import { Canvas } from "@react-three/fiber";
import { Text3D, OrbitControls, Environment } from "@react-three/drei";
import LightPave from "./LightPave";
import WavePlane from "./WaveGrid";

// convert ttf font to json for TextGeometry to work
// https://gero3.github.io/facetype.js/

export default function WordArt() {
  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
      <Environment files={"starmap.jpg"} background />
      <ambientLight intensity={10} />
      {/* <axesHelper/> */}
      <directionalLight position={[1, 1, 2]} intensity={1} />
      <Text3D
        position={[-1.8, -0.25, 0]}
        //  rotation={[0,0,0]}
        font="/fonts/lavish.json"
        size={0.7}
        height={0.1}
        bevelEnabled={true}
        bevelThickness={0.03}
        bevelSize={0.015}
        curveSegments={12}
      >
        threeCanvas
        <meshPhysicalMaterial
          color="#923636"
          metalness={0.9}
          roughness={0.4}
          shininess={10}
          specular="#ffffff"
        />
      </Text3D>
      <WavePlane />
      <LightPave intensity={10} />
      <OrbitControls />
    </Canvas>
  );
}
