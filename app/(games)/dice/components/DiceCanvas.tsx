"use client";

import { Canvas } from "@react-three/fiber";
import { Physics, RigidBody } from "@react-three/rapier";
import { OrbitControls } from "@react-three/drei";
import { useRef, useState, useEffect } from "react";
import { D4Dice } from "./D4Dice";
import { D6Dice, DiceHandle } from "./D6Dice";
import { D8Dice } from "./D8Dice";
import { D10Dice } from "./D10Dice";
import { D12Dice } from "./D12Dice";
import { D20Dice } from "./D20Dice";
import { redirect } from "next/navigation";

const DiceCanvas = () => {
  const [diceCount, setDiceCount] = useState(2);
  const [diceSides, setDiceSides] = useState<4 | 6 | 8 | 10 | 12 | 20>(6);
  const diceRefs = useRef<(DiceHandle | null)[]>([]);

  // Reset refs when count changes
  useEffect(() => {
    diceRefs.current = diceRefs.current.slice(0, diceCount);
  }, [diceCount]);

  const rerollDice = () => {
    diceRefs.current.forEach((dice) => {
      if (dice) dice.reroll();
    });
  };

  const getDiceComponent = (sides: number) => {
    switch (sides) {
      case 4:
        return D4Dice;
      case 8:
        return D8Dice;
      case 10:
        return D10Dice;
      case 12:
        return D12Dice;
      case 20:
        return D20Dice;
      case 6:
      default:
        return D6Dice;
    }
  };

  const CurrentDice = getDiceComponent(diceSides);

  const WALL_HEIGHT = 1.5;
  const WALL_THICKNESS = 0.4;
  const SIZE = 10;
  const GROUND_COLOUR = "green";
  const WALL_COLOUR = "#b67544";
  const WALL_OPACITY = 1;

  return (
    <>
      <Canvas shadows camera={{ position: [5, 15, 5], fov: 50 }}>
        <color attach="background" args={["#050505"]} />
        <ambientLight intensity={0.15} />

        <spotLight
          position={[0, 4, 0]}
          angle={Math.PI}
          penumbra={0.6}
          intensity={50}
          distance={20}
          castShadow
          shadow-mapSize={[2048, 2048]}
          shadow-bias={-0.0005}
        />

        <directionalLight
          position={[6, 8, -6]}
          intensity={0.6}
          color="#4f7cff"
          castShadow
        />

        <Physics gravity={[0, -30, 0]}>
          {Array.from({ length: diceCount }).map((_, i) => (
            <CurrentDice
              key={`${diceSides}-${i}`} // Force re-mount on type change
              ref={(el) => {
                diceRefs.current[i] = el;
              }}
              position={[
                (Math.random() - 0.5) * 3, // Increased spread
                3 + i * 1.5, // Increased vertical spacing to prevent clipping
                (Math.random() - 0.5) * 3,
              ]}
              DICE_COLOR="#FFFFFF"
            />
          ))}

          <RigidBody type="fixed" colliders="cuboid" restitution={0.3}>
            <mesh receiveShadow position={[0, -0.5, 0]}>
              <boxGeometry args={[SIZE, 0.1, SIZE]} />
              <meshStandardMaterial
                color={GROUND_COLOUR}
                roughness={0.75}
                metalness={0.1}
              />
            </mesh>
          </RigidBody>

          <RigidBody type="fixed" colliders="cuboid">
            <mesh position={[0, -WALL_HEIGHT / 8, SIZE / 2]}>
              <boxGeometry args={[SIZE, WALL_HEIGHT, WALL_THICKNESS]} />
              <meshStandardMaterial
                color={WALL_COLOUR}
                transparent
                opacity={WALL_OPACITY}
              />
            </mesh>
            <mesh position={[0, -WALL_HEIGHT / 8, -SIZE / 2]}>
              <boxGeometry args={[SIZE, WALL_HEIGHT, WALL_THICKNESS]} />
              <meshStandardMaterial
                color={WALL_COLOUR}
                transparent
                opacity={WALL_OPACITY}
              />
            </mesh>
            <mesh position={[SIZE / 2, -WALL_HEIGHT / 8, 0]}>
              <boxGeometry args={[WALL_THICKNESS, WALL_HEIGHT, SIZE]} />
              <meshStandardMaterial
                color={WALL_COLOUR}
                transparent
                opacity={WALL_OPACITY}
              />
            </mesh>
            <mesh position={[-SIZE / 2, -WALL_HEIGHT / 8, 0]}>
              <boxGeometry args={[WALL_THICKNESS, WALL_HEIGHT, SIZE]} />
              <meshStandardMaterial
                color={WALL_COLOUR}
                transparent
                opacity={WALL_OPACITY}
              />
            </mesh>
          </RigidBody>
        </Physics>

        <OrbitControls />
      </Canvas>

      {/* Controls Overlay */}
      <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 rounded-lg bg-black/50 p-3 backdrop-blur-sm sm:flex-row">
        {/* Dice Count Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-white uppercase">Count</span>
          <select
            value={diceCount}
            onChange={(e) => setDiceCount(Number(e.target.value))}
            className="cursor-pointer rounded border border-zinc-700 bg-zinc-900 px-2 py-1 text-sm text-white focus:outline-none"
          >
            {[...Array(10)].map((_, i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1}
              </option>
            ))}
          </select>
        </div>

        {/* Dice Type Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-white uppercase">Type</span>
          <select
            value={diceSides}
            onChange={(e) => setDiceSides(Number(e.target.value) as any)}
            className="cursor-pointer rounded border border-zinc-700 bg-zinc-900 px-2 py-1 text-sm text-white focus:outline-none"
          >
            {[4, 6, 8, 10, 12, 20].map((sides) => (
              <option key={sides} value={sides}>
                D{sides}
              </option>
            ))}
          </select>
        </div>

        <div className="mx-2 hidden h-6 w-px bg-zinc-700 sm:block"></div>

        <button
          onClick={rerollDice}
          className="w-full rounded-md bg-white px-6 py-2 font-bold text-black transition-transform hover:cursor-pointer active:scale-95 sm:w-auto"
        >
          ROLL
        </button>

        <button
          onClick={() => redirect("/")}
          className="flex h-9 w-9 items-center justify-center rounded-md bg-zinc-800 text-white transition-colors hover:bg-zinc-700 active:scale-95"
          title="Exit"
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
            <circle cx="12" cy="12" r="10" />
            <path d="m15 9-6 6" />
            <path d="m9 9 6 6" />
          </svg>
        </button>
      </div>
    </>
  );
};

export default DiceCanvas;
