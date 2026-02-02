"use client";

import { Canvas } from "@react-three/fiber";
import { Physics, RigidBody } from "@react-three/rapier";
import { OrbitControls } from "@react-three/drei";
import { useRef } from "react";
import { Dice, DiceHandle } from "./Dice";

const DiceCanvas = () => {
  const dice1Ref = useRef<DiceHandle>(null);
  const dice2Ref = useRef<DiceHandle>(null);

  const rerollDice = () => {
    if (dice1Ref.current) {
      dice1Ref.current.reroll();
    }
    if (dice2Ref.current) {
      dice2Ref.current.reroll();
    }
  };

  const WALL_HEIGHT = 4;
  const WALL_THICKNESS = 0.2;
  const SIZE = 10;
  const WALL_COLOR = "green";
  const WALL_OPACITY = 0;

  return (
    <>
      <Canvas camera={{ position: [5, 5, 5], fov: 50 }}>
        <color attach="background" args={["#111111"]} />
        <ambientLight intensity={1} />
        <directionalLight position={[10, 10, 5]} intensity={1} />

        <Physics gravity={[0, -30, 0]}>
          {/* Dice */}
          <Dice ref={dice1Ref} position={[0, 3, 0]} />
          <Dice ref={dice2Ref} position={[2, 3, 0]} />

          {/* Ground */}
          <RigidBody type="fixed" colliders="cuboid" restitution={0.3}>
            <mesh receiveShadow position={[0, -0.5, 0]}>
              <boxGeometry args={[SIZE, 0.1, SIZE]} />
              <meshStandardMaterial color="green" />
            </mesh>
          </RigidBody>

          {/* Walls */}
          <RigidBody type="fixed" colliders="cuboid">
            <mesh position={[0, WALL_HEIGHT / 3, SIZE / 2]}>
              <boxGeometry args={[SIZE, WALL_HEIGHT, WALL_THICKNESS]} />
              <meshStandardMaterial
                color={WALL_COLOR}
                transparent
                opacity={WALL_OPACITY}
              />
            </mesh>
            <mesh position={[0, WALL_HEIGHT / 3, -SIZE / 2]}>
              <boxGeometry args={[SIZE, WALL_HEIGHT, WALL_THICKNESS]} />
              <meshStandardMaterial
                color={WALL_COLOR}
                transparent
                opacity={WALL_OPACITY}
              />
            </mesh>
            <mesh position={[SIZE / 2, WALL_HEIGHT / 3, 0]}>
              <boxGeometry args={[WALL_THICKNESS, WALL_HEIGHT, SIZE]} />
              <meshStandardMaterial
                color={WALL_COLOR}
                transparent
                opacity={WALL_OPACITY}
              />
            </mesh>
            <mesh position={[-SIZE / 2, WALL_HEIGHT / 3, 0]}>
              <boxGeometry args={[WALL_THICKNESS, WALL_HEIGHT, SIZE]} />
              <meshStandardMaterial
                color={WALL_COLOR}
                transparent
                opacity={WALL_OPACITY}
              />
            </mesh>
          </RigidBody>
        </Physics>

        <OrbitControls />
      </Canvas>

      {/* Reroll button */}
      <button
        onClick={rerollDice}
        className="absolute top-2 left-2 rounded-md bg-black px-4 py-2 hover:cursor-pointer"
      >
        Reroll Dice
      </button>
    </>
  );
};

export default DiceCanvas;
