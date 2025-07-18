'use client';

import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';

export default function LightPave({ intensity = 1 }) {
  const lightRef = useRef();
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    setMouse({
      x: (e.clientX / window.innerWidth) * 2 - 1,
      y: -(e.clientY / window.innerHeight) * 2 + 1,
    });
  };

  useFrame(() => {
    if (lightRef.current) {
      lightRef.current.position.x = mouse.x * 5;
      lightRef.current.position.y = mouse.y * 5;
      lightRef.current.position.z = 2;
    }
  });

  return (
    <>
      <pointLight ref={lightRef} intensity={intensity} />
      <mesh
        onPointerMove={handleMouseMove}
        position={[0, 0, 0]}
        visible={false}
      >
        <planeGeometry args={[100, 100]} />
      </mesh>
    </>
  );
}
