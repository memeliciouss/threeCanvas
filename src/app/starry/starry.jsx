import { Loader } from "@/components/Loader";
import { OrbitControls, useGLTF } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense, useMemo } from "react";
import * as THREE from "three";

// --- Shader Definitions ---
// The Vertex Shader determines the position and size of each star.
const vertexShader = `
  attribute float size; // Custom attribute for individual star size
  attribute vec3 customColor; // Custom attribute for individual star color
  varying vec3 vColor; // Varying to pass color to the fragment shader

  void main() {
    vColor = customColor; // Pass the custom color to the fragment shader
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0); // Calculate model-view position
    // gl_PointSize controls the rendered size of the point.
    // It's scaled directly by the 'size' attribute. Since there's no division by mvPosition.z,
    // this effectively keeps sizeAttenuation: false, meaning points retain their pixel size regardless of distance.
    gl_PointSize = size;
    gl_Position = projectionMatrix * mvPosition; // Project to screen space
  }
`;

// The Fragment Shader determines the color and subtle glow of each star.
const fragmentShader = `
  varying vec3 vColor; // Receive color from vertex shader

  void main() {
    // Calculate distance from the center of the point within its square ([0,1] range).
    float r = length(gl_PointCoord - 0.5);
    // Use smoothstep to create a soft falloff from the center to the edge, simulating a subtle glow.
    // The inner value (0.5) is where the strength starts to fall, and the outer value (0.4) is where it becomes zero.
    float strength = smoothstep(0.5, 0.4, r);

    // Set the final fragment color.
    // vColor is the base color, and strength controls the alpha (opacity),
    // allowing the glow to fade out towards the edges.
    gl_FragColor = vec4(vColor, strength);

    // Three.js specific includes for correct color management (e.g., tonemaping and sRGB conversion).
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;

// --- Helper Function for Creating Star Geometries and Materials ---
// This function generates the necessary attributes (positions, sizes, colors)
// and creates a ShaderMaterial for rendering the stars.
function createStarGeometryAndMaterial(positions) {
  const sizes = [];
  const colors = [];
  const color = new THREE.Color();

  // Iterate through each star position to assign individual properties
  for (let i = 0; i < positions.length / 3; i++) {
    // Assign varying sizes for stars (e.g., between 0.5 and 2.5 pixels)
    // This provides the "slight variation in sizes" you requested.
    sizes.push(Math.random() * 2 + 0.5); // Range for slight variation in pixel size

    // Assign varying colors:
    // Using HSL (Hue, Saturation, Lightness) to easily generate a range of
    // warm (yellowish) to cool (bluish) star colors with varying brightness.
    // Increased the hue range (0.0 to 0.6) to include more colors like blues and purples.
    // Adjusted lightness range (0.5 to 1.0) to allow for more visible color variations.
    const hue = Math.random() * 0.6; // Hue from red/orange (0.0) through green (0.33) to blue/purple (0.6)
    const saturation = Math.random() * 0.3 + 0.7; // Moderate to high saturation (0.7 to 1.0) for vibrant stars.
    const lightness = Math.random() * 0.5 + 0.5; // Lightness from 0.5 to 1.0 for visible color depth

    color.setHSL(hue, saturation, lightness);
    colors.push(color.r, color.g, color.b);
  }

  // Create a BufferGeometry to hold the star data
  const geometry = new THREE.BufferGeometry();
  // Set position attribute (x, y, z for each star)
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  // Set size attribute for individual star sizes
  geometry.setAttribute("size", new THREE.Float32BufferAttribute(sizes, 1));
  // Set customColor attribute for individual star colors
  geometry.setAttribute("customColor", new THREE.Float32BufferAttribute(colors, 3));

  // Create a ShaderMaterial with our custom vertex and fragment shaders
  const material = new THREE.ShaderMaterial({
    uniforms: {}, // No custom uniforms are needed for this basic setup
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    transparent: true, // Enable transparency for the glow effect
    blending: THREE.AdditiveBlending, // Makes overlapping stars appear brighter, enhancing the glow effect
    depthWrite: false, // Prevents points from writing to the depth buffer,
                      // which helps with correct rendering of transparent objects
  });

  return [geometry, material];
}

// --- Main Starry Scene Component ---
export default function Starry() {
  return (
    // Canvas component from react-three-fiber, setting up the WebGL context
    <Canvas>
      {/* Suspense is used to show a fallback (Loader) while the GLB model is loading */}
      <Suspense fallback={<Loader />}>
        {/* The GLB object (e.g., 'endurance.glb') with stars scattered on its surface */}
        <Object />
        {/* The background star field, appearing as a plane of stars */}
        <StarBG />
      </Suspense>
      {/* OrbitControls allow rotating the camera around the scene.
          Panning and zooming are disabled to maintain the illusion of the
          object disappearing when the camera is still. */}
      <OrbitControls enablePan={false} enableZoom={false} />
    </Canvas>
  );
}

// --- Object Component (Loads GLB Model and Scatters Stars on It) ---
function Object() {
  // Load the GLTF model ('starry/endurance.glb') using useGLTF hook from @react-three/drei
  const { scene: gltfScene } = useGLTF("starry/endurance.glb");

  // If the model is not loaded yet, return null (Suspense fallback will be active)
  if (!gltfScene) {
    return null;
  }

  // useMemo hook to optimize performance: the star geometry and material are created
  // only once after the GLTF model is loaded, or if the gltfScene object itself changes.
  const [geometry, material] = useMemo(() => {
    const positions = [];
    const numRaysToCast = 10000; // Number of raycasting attempts to find points
    const maxPoints = 5000; // Desired maximum number of stars to place on the object

    const raycaster = new THREE.Raycaster(); // Raycaster for intersecting with the 3D model
    const tempOrigin = new THREE.Vector3(); // Reusable vector for ray origin
    const tempDirection = new THREE.Vector3(); // Reusable vector for ray direction

    // Calculate the bounding box of the GLTF scene to define the volume for raycasting
    const bbox = new THREE.Box3().setFromObject(gltfScene);
    const min = bbox.min;
    const max = bbox.max;

    // Collect all mesh objects from the GLTF scene for raycasting
    const meshes = [];
    gltfScene.traverse((child) => {
      if (child.isMesh) {
        meshes.push(child);
      }
    });

    // Raycasting loop to scatter points on the object's surface
    for (let i = 0; i < numRaysToCast && positions.length < maxPoints; i++) {
      // Generate a random origin point within the object's bounding box
      tempOrigin.x = THREE.MathUtils.randFloat(min.x, max.x);
      tempOrigin.y = THREE.MathUtils.randFloat(min.y, max.y);
      tempOrigin.z = THREE.MathUtils.randFloat(min.z, max.z);

      // Generate a random direction for the ray and normalize it
      tempDirection
        .set(
          THREE.MathUtils.randFloat(-1, 1),
          THREE.MathUtils.randFloat(-1, 1),
          THREE.MathUtils.randFloat(-1, 1)
        )
        .normalize();

      raycaster.set(tempOrigin, tempDirection);

      // Perform raycast and find intersecting points with the object's meshes
      const intersects = raycaster.intersectObjects(meshes, true);

      if (intersects.length > 0) {
        // If an intersection is found, use the closest point of intersection
        const intersectionPoint = intersects[0].point;
        positions.push(
          intersectionPoint.x,
          intersectionPoint.y,
          intersectionPoint.z
        );
      }
    }
    // Create the star geometry and material for the object using the shared helper function.
    // This ensures the stars on the object have the same appearance as the background stars.
    return createStarGeometryAndMaterial(positions);
  }, [gltfScene]); // Dependency array: re-run this memoization if gltfScene object changes

  return (
    // A Three.js group to apply scale and rotation transformations to the GLB model and its stars.
    // The model is scaled for initial viewing.
    <group scale={0.1} rotation={[0, Math.PI / 2, 0]}>
      {/* Render the points (stars) on the object's surface */}
      <points geometry={geometry} material={material} />
    </group>
  );
}

// --- StarBG Component (Creates the Background Star Field) ---
function StarBG() {
  // useMemo hook to optimize performance: the background star geometry and material
  // are created only once when the component mounts.
  const [geometry, material] = useMemo(() => {
    const starCount = 30000;
    const planeSize = 500; // Define the size of the square plane (e.g., 500 units wide and tall)
    const planeZ = -100; // Define the Z-coordinate of the plane, positioning it behind the object

    const positions = [];

    // Generate points on a square plane in the XY plane at a fixed Z coordinate.
    for (let i = 0; i < starCount; i++) {
      // Generate random X and Y coordinates within the square plane's bounds
      const x = THREE.MathUtils.randFloat(-planeSize / 2, planeSize / 2);
      const y = THREE.MathUtils.randFloat(-planeSize / 2, planeSize / 2);
      const z = planeZ; // All background stars are at the same Z depth

      positions.push(x, y, z);
    }
    // Create the star geometry and material using the same helper function.
    // This is crucial for the blending effect, as it ensures identical star appearance.
    return createStarGeometryAndMaterial(positions);
  }, []); // Empty dependency array: runs only once on component mount

  return <points geometry={geometry} material={material} />;
}
