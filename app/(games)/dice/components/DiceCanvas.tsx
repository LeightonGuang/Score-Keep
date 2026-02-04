"use client";

import { Canvas } from "@react-three/fiber";
import { Physics, RigidBody } from "@react-three/rapier";
import { OrbitControls } from "@react-three/drei";
import { useRef } from "react";
import { Dice, DiceHandle } from "./Dice";
import { redirect } from "next/navigation";

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
      <Canvas shadows camera={{ position: [5, 15, 5], fov: 50 }}>
        <color attach="background" args={["#050505"]} />
        <ambientLight intensity={0.15} />

        {/* Ground spotlight (main light) */}
        <spotLight
          position={[0, 4, 0]} // near the ground
          angle={Math.PI}
          penumbra={0.6}
          intensity={50}
          distance={20}
          castShadow
          shadow-mapSize={[2048, 2048]}
          shadow-bias={-0.0005}
        />

        {/* Soft rim / fill light */}
        <directionalLight
          position={[6, 8, -6]}
          intensity={0.6}
          color="#4f7cff"
          castShadow
        />

        <Physics gravity={[0, -30, 0]}>
          {/* Dice */}
          <Dice ref={dice1Ref} position={[0, 3, 0]} DICE_COLOR="#FFFFFF" />
          <Dice ref={dice2Ref} position={[2, 3, 0]} DICE_COLOR="#FFFFFF" />

          {/* Ground */}
          <RigidBody type="fixed" colliders="cuboid" restitution={0.3}>
            <mesh receiveShadow position={[0, -0.5, 0]}>
              <boxGeometry args={[SIZE, 0.1, SIZE]} />
              <meshStandardMaterial
                color={WALL_COLOR}
                roughness={0.75}
                metalness={0.1}
              />
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
      <div className="absolute bottom-2 mx-4 flex w-max gap-4 rounded-lg bg-black/50 p-2">
        <button
          onClick={rerollDice}
          className="rounded-md bg-zinc-900 px-6 py-2 select-none hover:cursor-pointer active:scale-95"
        >
          Roll
        </button>

        <button
          onClick={() => {
            redirect("/");
          }}
          className="rounded-md bg-zinc-900 px-4 py-2 hover:cursor-pointer active:scale-95"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
          >
            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
        </button>
      </div>
    </>
  );
};

export default DiceCanvas;
