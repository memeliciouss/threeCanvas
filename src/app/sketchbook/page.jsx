'use client';
import { Loader } from "@react-three/drei";

import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { Experience } from "./Experience";
import { UI } from "./UI";

function App() {
  return (
    <div className="sketchbook">
      <UI />
      <Loader />
      <Canvas shadows camera={{ position: [-0.5, 1, 4], fov: 45 }}
      style={{cursor:'auto'}}>
        <group position-y={0}>
          <Suspense fallback={null}>
            <Experience />
          </Suspense>
        </group>
      </Canvas>
    </div>
  );
}

export default App;