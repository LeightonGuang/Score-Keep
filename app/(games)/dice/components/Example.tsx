"use client";

import { Canvas } from "@react-three/fiber";
import { Physics, RigidBody } from "@react-three/rapier";
import { OrbitControls } from "@react-three/drei";
import { useMemo } from "react";

const Example = () => {
  const initialRotation = useMemo<[number, number, number]>(
    () => [
      Math.random() * Math.PI * 2,
      Math.random() * Math.PI * 2,
      Math.random() * Math.PI * 2,
    ],
    [],
  );

  const WALL_HEIGHT = 1;
  const WALL_THICKNESS = 0.2;
  const SIZE = 10;

  return (
    <Canvas camera={{ position: [5, 5, 5], fov: 50 }}>
      <color attach="background" args={["#ffffff"]} />
      <ambientLight intensity={1} />
      <directionalLight position={[10, 10, 5]} intensity={1} />

      <Physics gravity={[0, -9.81, 0]}>
        {/* The Dice Cube */}
        <RigidBody
          position={[0, 5, 0]}
          rotation={initialRotation}
          colliders="cuboid"
          restitution={0.3} // Bounciness
          friction={0.2} // Friction
        >
          <mesh castShadow>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="white" />
          </mesh>
        </RigidBody>

        {/* Ground */}
        <RigidBody type="fixed" colliders="cuboid" restitution={0.3}>
          <mesh receiveShadow position={[0, -0.5, 0]}>
            <boxGeometry args={[SIZE, 0.1, SIZE]} />
            <meshStandardMaterial color="green" />
          </mesh>
        </RigidBody>
        {/* North wall */}
        <RigidBody type="fixed" colliders="cuboid">
          <mesh position={[0, -WALL_HEIGHT / 4, SIZE / 2]}>
            <boxGeometry args={[SIZE, WALL_HEIGHT, WALL_THICKNESS]} />
            <meshStandardMaterial color="green" />
          </mesh>
        </RigidBody>
        {/* South wall */}
        <RigidBody type="fixed" colliders="cuboid">
          <mesh position={[0, -WALL_HEIGHT / 4, -SIZE / 2]}>
            <boxGeometry args={[SIZE, WALL_HEIGHT, WALL_THICKNESS]} />
            <meshStandardMaterial color="green" />
          </mesh>
        </RigidBody>
        {/* East wall */}
        <RigidBody type="fixed" colliders="cuboid">
          <mesh position={[SIZE / 2, -WALL_HEIGHT / 4, 0]}>
            <boxGeometry args={[WALL_THICKNESS, WALL_HEIGHT, SIZE]} />
            <meshStandardMaterial color="green" />
          </mesh>
        </RigidBody>
        {/* West wall */}
        <RigidBody type="fixed" colliders="cuboid">
          <mesh position={[-SIZE / 2, -WALL_HEIGHT / 4, 0]}>
            <boxGeometry args={[WALL_THICKNESS, WALL_HEIGHT, SIZE]} />
            <meshStandardMaterial color="green" />
          </mesh>
        </RigidBody>
      </Physics>

      <OrbitControls />
    </Canvas>
  );
};

export default Example;
