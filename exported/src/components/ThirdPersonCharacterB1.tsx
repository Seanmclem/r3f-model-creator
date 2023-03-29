import { useEffect, useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { PerspectiveCamera } from "@react-three/drei";

export const ThirdPersonCharacter = ({ position, rotation }: any) => {
  // MOVEMENT START
  const pressedKeys = useRef(new Set());

  const handleKeyDown = (event: KeyboardEvent) => {
    pressedKeys.current.add(event.key);
  };

  const handleKeyUp = (event: KeyboardEvent) => {
    pressedKeys.current.delete(event.key);
  };

  // Add keydown and keyup event listeners
  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  const get_character_move_offset = () => {
    // Calculate character offset based on pressed keys
    let offset = new THREE.Vector3(0, 0, 0);
    if (pressedKeys.current.has("w")) {
      offset.z += 0.1;
    }
    if (pressedKeys.current.has("s")) {
      offset.z -= 0.1;
    }
    if (pressedKeys.current.has("a")) {
      offset.x += 0.1;
    }
    if (pressedKeys.current.has("d")) {
      offset.x -= 0.1;
    }

    // if (pressedKeys.current.has("ArrowLeft")) {
    //   angleRef.current += 0.02;
    // }
    // if (pressedKeys.current.has("ArrowRight")) {
    //   angleRef.current -= 0.02;
    // }

    // if (pressedKeys.current.has("ArrowUp")) {
    //   setDistance(Math.max(distance - 0.1, 2));
    // }
    // if (pressedKeys.current.has("ArrowDown")) {
    //   setDistance(Math.min(distance + 0.1, 10));
    // }

    return offset;
  };
  // MOVEMENT END

  // CAMERA START
  //   const { camera } = useThree();
  const [distance, setDistance] = useState(2.5);
  const angleRef = useRef(0);

  useFrame(() => {
    if (
      !character_ref.current ||
      (!angleRef.current && angleRef.current !== 0) ||
      !horizontal_box_ref.current ||
      !camera_ref.current
    ) {
      return;
    }

    const character_offset = get_character_move_offset();
    character_ref.current.position.add(character_offset);

    const character_target = new THREE.Vector3().setFromMatrixPosition(
      horizontal_box_ref.current.matrixWorld
    );

    // const camera_offset = new THREE.Vector3(0, 3.5, -distance).applyAxisAngle(
    //   new THREE.Vector3(0, 1, 0),
    //   angleRef.current
    // );
    // const camera_position = character_target.clone().add(camera_offset);

    // camera_ref.current.position.copy(camera_position);
    camera_ref.current.lookAt(character_target);

    // horizontal_box_ref.current.rotateY(0.01);
  });

  // CAMERA END

  const character_ref = useRef<THREE.Group>(null);

  const camera_ref = useRef<THREE.PerspectiveCamera>(null);
  const horizontal_box_ref =
    useRef<THREE.Mesh<THREE.BufferGeometry, THREE.Material | THREE.Material[]>>(
      null
    );

  return (
    <group
      ref={character_ref}
      position={position}
      rotation={rotation}
      scale={3}
    >
      <PerspectiveCamera
        ref={camera_ref}
        makeDefault={true}
        position={[0, 1.5, -distance]}
        fov={75}
      />
      {/* add first mesh here */}
      {/* add second mesh here */}
      {/* thanks chat gpt, for a little help */}
      {/*  */}
      <mesh ref={horizontal_box_ref}>
        <boxGeometry attach="geometry" args={[1, 1, 1]} />
        <meshBasicMaterial attach="material" color="red" wireframe={true} />
      </mesh>
      {/* // */}
      <mesh>
        <boxGeometry attach="geometry" args={[0.5, 0.5, 0.5]} />
        <meshBasicMaterial attach="material" color="orange" />
        <arrowHelper args={[new THREE.Vector3(0, 0, 1)]} />
      </mesh>
    </group>
  );
};
