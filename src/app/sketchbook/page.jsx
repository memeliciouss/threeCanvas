"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { Experience } from "./Experience";
import { Interface } from "./interface";
import Navbar from "@/components/Navbar";
import { Loader } from "@/components/Loader";

function App() {
  return (
    <div className="sketchbook">
      <Interface />
      <Canvas
        shadows
        camera={{ position: [-0.5, 1, 4], fov: 45 }}
        style={{ cursor: "auto" }}
      >
        <group position-y={0}>
          <Suspense fallback={<Loader />}>
            <Experience />
          </Suspense>
        </group>
      </Canvas>
      <Navbar />
    </div>
  );
}

export default App;
