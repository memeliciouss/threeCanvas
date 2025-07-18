import { useMemo, useRef, useState } from "react";
import { pageAtom } from "./UI";
import { pages } from "./UI";
import {
  Bone,
  BoxGeometry,
  Float32BufferAttribute,
  MeshStandardMaterial,
  Skeleton,
  SkeletonHelper,
  SkinnedMesh,
  SRGBColorSpace,
  Uint16BufferAttribute,
  Vector3,
} from "three";
import { useCursor, useHelper, useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { degToRad, MathUtils } from "three/src/math/MathUtils";
import { useAtom } from "jotai";
import { easing } from "maath";

// the improper width and height was giving matrixWorld error
const page_width = 1.28;
const page_height = 1.71;
const page_depth = 0.003;
const page_segments = 30;
const segment_width = page_width / page_segments;

// const lerpFactor = 0.05;
// we changed lerp factor with easing factor
const easingFactor = 0.5; // controls speed of easing
const easingFactorFold = 0.5;
const insideCurveStrength = 0.18; // controls strength of curve
const outsideCurveStrength = 0.05; // controls strength of curve
const turningCurveStrength = 0.09; // controls strength of curve
// controls speed of easing

const pageGeometry = new BoxGeometry(
  page_width,
  page_height,
  page_depth,
  page_segments,
  2 // height segment
);

// so our geometry is not centered, but at left
pageGeometry.translate(page_width / 2, 0, 0);

// get all positions from our geometry
const position = pageGeometry.attributes.position;
// declare vertex
const vertex = new Vector3();

// array with indexes of our bones
const skinIndexes = [];
// associated weights of those indexes
const skinWeights = [];

// loop through all positions, so for each vertec
for (let i = 0; i < position.count; i++) {
  vertex.fromBufferAttribute(position, i); // get the vertex
  const x = vertex.x; // get x position of vertex

  // to know which bone will be affected
  // if we are near zero we use first bone, if further away, we use last bone
  const skinIndex = Math.max(0, Math.floor(x / segment_width));

  // calculate skin weight, so its intensity of this bone is impacting our vertices
  // between 0 & 1, 1 being impacting completely and 0 it doesnt impact
  let skinWeight = (x % segment_width) / segment_width;

  // we push 4 values
  // first one is first bone that has impact on our vertex
  // second one is the second bone that has an impact
  // and we can put upto 4 bones on a vertex but we only use 2 bones per vertec
  skinIndexes.push(skinIndex, skinIndex + 1, 0, 0);
  // impact of those bones
  skinWeights.push(1 - skinWeight, skinWeight, 0, 0);
}

// attach those attributes to our geometry
pageGeometry.setAttribute(
  "skinIndex",
  new Uint16BufferAttribute(skinIndexes, 4)
);
pageGeometry.setAttribute(
  "skinWeight",
  new Float32BufferAttribute(skinWeights, 4) // as value is between 0 & 1
);

// our pageMaterials is an array of 6 materials
// as our boxGeometry has 6 faces, one material per face
// last ones are front and back face
const pageMaterials = [
  new MeshStandardMaterial({
    color: "#fff",
  }),
  new MeshStandardMaterial({
    color: "#111",
  }),
  new MeshStandardMaterial({
    color: "#fff",
  }),
  new MeshStandardMaterial({
    color: "#fff",
  }),
  // we dont need these last ones, we create one for each one
  // new MeshStandardMaterial({
  //   color: "pink",
  // }),
  // new MeshStandardMaterial({
  //   color: "blue",
  // }),
];

pages.forEach((page) => {
  useTexture.preload(`/sketchbook/${page.front}.png`);
  useTexture.preload(`/sketchbook/${page.back}.png`);
  useTexture.preload(`/sketchbook/roughness.png`);
});

const Page = ({ number, front, back, page, opened, bookClosed, ...props }) => {
  const [picture1, picture2, pictureRoughness] = useTexture([
    `/sketchbook/${front}.png`,
    `/sketchbook/${back}.png`,
    ...(number === 0 || number === pages.length - 1
      ? ["sketchbook/roughness.png"]
      : []),
  ]);

  // picture1 and picture2 being the img in front and behind of the current img
  picture1.colorSpace = picture2.colorSpace = SRGBColorSpace;

  const group = useRef();

  const turnedAt = useRef(0);
  const lastOpened = useRef(opened);

  const skinnedMeshRef = useRef();

  const manualSkinnedMesh = useMemo(() => {
    const bones = [];
    // as many bones as we have segments in our page
    for (let i = 0; i <= page_segments; i++) {
      let bone = new Bone();
      // store it in bones array
      bones.push(bone);

      if (i == 0) {
        bone.position.x = 0;
      } else {
        bone.position.x = segment_width;
      }
      if (i > 0) {
        // if its not the first bone, we attach new bone
        // to the prev bone, so its a child of it
        bones[i - 1].add(bone);
      }
    }
    // create skeleton thats contains array of bone we just created
    const skeleton = new Skeleton(bones);

    // material for skinnedMesh
    const materials = [
      ...pageMaterials,
      new MeshStandardMaterial({
        color: "#fff",
        map: picture1, // img at front
        ...(number === 0
          ? {
              roughnessMap: pictureRoughness, // custom roughness map
            }
          : {
              roughness: 0.9, // for glossy effect
            }),
      }),
      new MeshStandardMaterial({
        color: "#fff",
        map: picture2, // img at back
        ...(number === pages.length - 1
          ? {
              roughnessMap: pictureRoughness,
            }
          : {
              roughness: 0.9,
            }),
      }),
    ];

    // create skinned mesh with the page geometry and materials
    const mesh = new SkinnedMesh(pageGeometry, materials);

    // on our mesh
    mesh.castShadow = true;
    mesh.receiveShadow = true;

    // so if we are close to it becuz we bend it, we will still be able to see the book
    mesh.frustumCulled = false;

    mesh.add(skeleton.bones[0]); // add root bone to mesh
    mesh.bind(skeleton); // bind skeleton to our skinned mesh

    return mesh; //return skin mesh so we able to use it
  }, []);

  // to see how bones come ip
  // useHelper(skinnedMeshRef, SkeletonHelper, "red");

  // testing effect by manually turning bones
  // useFrame(()=>{
  //   if(!skinnedMeshRef.current){
  //     return;
  //   }
  //   const bones = skinnedMeshRef.current.skeleton.bones;
  //   bones[2].rotation.y = degToRad(40);
  // })

  useFrame((_, delta) => {
    if (!skinnedMeshRef.current) {
      return;
    }

    if (lastOpened.current !== opened) {
      turnedAt.current = +new Date();
      lastOpened.current = opened;
    }
    let turningTime = Math.min(400, new Date() - turnedAt.current) / 400;
    turningTime = Math.sin(turningTime * Math.PI);

    let targetRotation = opened ? -Math.PI / 2.1 : Math.PI / 2.1;
    // reduced angle rage so pages dont flip the wrong way
    // easing effect sometimes made pages flip from opposite sides

    // to close book completely on close and not have pages shown
    if (!bookClosed) {
      targetRotation += degToRad(number * 0.8);
    }

    const bones = skinnedMeshRef.current.skeleton.bones;

    for (let i = 0; i < bones.length; i++) {
      const target = i === 0 ? group.current : bones[i];

      // curve of page
      const insideCurveIntensity = i < 8 ? Math.sin(i * 0.2 + 0.25) : 0;
      const outsideCurveIntensity = i > 8 ? Math.cos(i * 0.3 + 0.09) : 0;
      const turningIntensity =
        Math.sin(i * Math.PI * (1 / bones.length)) * turningTime;

      let rotationAngle =
        insideCurveStrength * insideCurveIntensity * targetRotation -
        outsideCurveStrength * outsideCurveIntensity * targetRotation +
        turningCurveStrength * turningIntensity * targetRotation;

      // to bend the page when turning, we rotate its x axis
      // as sin will return -1 if targetRotation is below 0 and 1 if its above 0
      let foldRotationAngle = degToRad(Math.sign(targetRotation) * 2);

      // so it goes to normal on close
      if (bookClosed) {
        if (i == 0) {
          rotationAngle = targetRotation;
          foldRotationAngle = 0;
        } else {
          rotationAngle = 0;
          foldRotationAngle = 0;
        }
      }
      easing.dampAngle(
        target.rotation,
        "y",
        rotationAngle,
        easingFactor,
        delta
      );

      const foldIntensity =
        i > 8
          ? Math.sin(i * Math.PI * (1 / bones.length) - 0.5) * turningTime
          : 0;

      easing.dampAngle(
        target.rotation,
        "x",
        foldRotationAngle * foldIntensity,
        easingFactorFold,
        delta
      );
    }
    // bones[0].rotation.y = targetRotation;
    // we were assigning values manually, but we can lerp the values
  });
  const [_, setPage] = useAtom(pageAtom);
  const [highlighted, setHighlighted] = useState(false);
  useCursor(highlighted);
  return (
    <group
      {...props}
      ref={group}
      onPointerEnter={(e) => {
        e.stopPropagation();
        setHighlighted(true);
      }}
      onPointerLeave={(e) => {
        e.stopPropagation();
        setHighlighted(false);
      }}
      onClick={(e) => {
        e.stopPropagation();
        setPage(opened ? number : number + 1);
        setHighlighted(false);
      }}
    >
      {/* skinnedMesh instead of Mesh
        skinnedMesh has a skeleton with bones which can be used to animate geometry*/}
      {/* <axesHelper args={[0.2]} /> */}
      <primitive
        object={manualSkinnedMesh}
        ref={skinnedMeshRef}
        position-z={-number * page_depth + page * page_depth}
      />
    </group>
  );
};

export const Book = ({ ...props }) => {
  const [page] = useAtom(pageAtom);
  return (
    <group {...props} rotation-y={-Math.PI / 2}>
      {[...pages].map((pageData, index) => (
        <Page
          key={index}
          number={index}
          page={page}
          opened={page > index}
          bookClosed={page === 0 || page === pages.length}
          {...pageData}
        />
      ))}
    </group>
  );
};
