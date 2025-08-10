import { Loader } from "@/components/Loader";
import { OrbitControls, useGLTF } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense, useMemo } from "react";
import * as THREE from "three";

export default function Starry() {
  return (
    <Canvas>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} />
      <Suspense fallback={<Loader />}>
        <Object />
        <StarBG />
      </Suspense>
      <OrbitControls enablePan={false} enableZoom={false} />
    </Canvas>
  );
}

function Object() {
  const { scene: gltfScene } = useGLTF("starry/endurance.glb");

  // wait for model to load
  if (!gltfScene) {
    return null;
  }

  // Use useMemo to prepare the point data once after GLTF loads
  const [geometry, material] = useMemo(() => {
    const positions = [];
    const colors = [];
    const color = new THREE.Color();

    // for scattering points using Raycasting
    const numRaysToCast = 10000; // attempts
    const maxPoints = 4000; // number of stars to place

    const raycaster = new THREE.Raycaster();
    const tempOrigin = new THREE.Vector3(); // Reusable Vector3 for ray origin
    const tempDirection = new THREE.Vector3(); // Reusable Vector3 for ray direction

    // Calculate the bounding box of the entire GLTF scene
    const bbox = new THREE.Box3().setFromObject(gltfScene);
    const min = bbox.min;
    const max = bbox.max;

    // Store all meshes from the GLTF scene in an array for raycasting
    const meshes = [];
    gltfScene.traverse((child) => {
      if (child.isMesh) {
        meshes.push(child);
      }
    });

    // Raycasting loop
    for (let i = 0; i < numRaysToCast && positions.length < maxPoints; i++) {
      // random origin point withing bounding box
      tempOrigin.x = THREE.MathUtils.randFloat(min.x, max.x);
      tempOrigin.y = THREE.MathUtils.randFloat(min.y, max.y);
      tempOrigin.z = THREE.MathUtils.randFloat(min.z, max.z);

      // random direction for ray
      tempDirection
        .set(
          THREE.MathUtils.randFloat(-1, 1),
          THREE.MathUtils.randFloat(-1, 1),
          THREE.MathUtils.randFloat(-1, 1)
        )
        .normalize();

      raycaster.set(tempOrigin, tempDirection);

      // perform raycast and get intersecting points
      const intersects = raycaster.intersectObjects(meshes, true);

      if (intersects.length > 0) {
        // use the closest point of intersection
        const intersectionPoint = intersects[0].point;
        positions.push(
          intersectionPoint.x,
          intersectionPoint.y,
          intersectionPoint.z
        );

        const intensity = Math.random() * 0.5 + 0.5;
        color.setRGB(intensity, intensity, intensity + Math.random() * 0.2);
        colors.push(color.r, color.g, color.b);
      }
    }

    const objectGeometry = new THREE.BufferGeometry();
    objectGeometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(positions, 3)
    );
    objectGeometry.setAttribute(
      "color",
      new THREE.Float32BufferAttribute(colors, 3)
    );

    const objectMaterial = new THREE.PointsMaterial({
      size: 1.0,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      sizeAttenuation: false, // visual size changes based on distance, set to false
    });

    return [objectGeometry, objectMaterial];
  }, []);

  return (
    <group scale={0.1} rotation={[0, Math.PI / 2, 0]}>
      <points geometry={geometry} material={material} />
    </group>
  );
}

function StarBG() {
  const [geometry, material] = useMemo(() => {
    const starCount = 30000;
    const starSphereRadius = 900;
    const positions = [];
    const colors = [];
    const color = new THREE.Color();

    for (let i = 0; i < starCount; i++) {
      const u = Math.random();
      const v = Math.random();
      const theta = 2 * Math.PI * u;
      const phi = Math.acos(2 * v - 1);

      const x = starSphereRadius * Math.sin(phi) * Math.cos(theta);
      const y = starSphereRadius * Math.sin(phi) * Math.sin(theta);
      const z = starSphereRadius * Math.cos(phi);

      positions.push(x, y, z);

      const intensity = Math.random() * 0.5 + 0.5;
      color.setRGB(intensity, intensity, intensity + Math.random() * 0.2);
      colors.push(color.r, color.g, color.b);
    }
    const starGeometry = new THREE.BufferGeometry();
    starGeometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(positions, 3)
    );
    starGeometry.setAttribute(
      "color",
      new THREE.Float32BufferAttribute(colors, 3)
    );

    const starMaterial = new THREE.PointsMaterial({
      size: 1.0,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      sizeAttenuation: false,
    });

    return [starGeometry, starMaterial];
  }, []);

  return <points geometry={geometry} material={material} />;
}
