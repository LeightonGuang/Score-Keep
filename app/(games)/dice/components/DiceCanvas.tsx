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

  useEffect(() => {
    diceRefs.current = diceRefs.current.slice(0, diceCount);
  }, [diceCount]);

  const rerollDice = () => {
    diceRefs.current.forEach((dice) => dice?.reroll());
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
      default:
        return D6Dice;
    }
  };

  const CurrentDice = getDiceComponent(diceSides);

  /* ================= TRAY GEOMETRY ================= */

  const INNER_SIZE = 8;
  const WALL_THICKNESS = 0.4;
  const TRAY_HEIGHT = 1.5;
  const LID_Y = 3.5;

  const HALF_INNER = INNER_SIZE / 2;
  const HALF_THICKNESS = WALL_THICKNESS / 2;

  const GROUND_COLOUR = "green";
  const WALL_COLOUR = "#b67544";

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
          {/* Dice */}
          {Array.from({ length: diceCount }).map((_, i) => (
            <CurrentDice
              key={`${diceSides}-${i}`}
              ref={(el) => {
                diceRefs.current[i] = el;
              }}
              position={[
                (Math.random() - 0.5) * 3,
                3 + i * 1.5,
                (Math.random() - 0.5) * 3,
              ]}
              DICE_COLOR="#FFFFFF"
            />
          ))}

          {/* Ground */}
          <RigidBody
            type="fixed"
            colliders="cuboid"
            restitution={0.1}
            friction={0.9}
          >
            <mesh receiveShadow position={[0, -0.05, 0]}>
              <boxGeometry args={[INNER_SIZE, 0.1, INNER_SIZE]} />
              <meshStandardMaterial
                color={GROUND_COLOUR}
                roughness={0.8}
                metalness={0.05}
              />
            </mesh>
          </RigidBody>

          {/* FRONT */}
          <RigidBody type="fixed" colliders="cuboid">
            <mesh position={[0, TRAY_HEIGHT / 2, HALF_INNER + HALF_THICKNESS]}>
              <boxGeometry
                args={[
                  INNER_SIZE + WALL_THICKNESS * 2,
                  TRAY_HEIGHT,
                  WALL_THICKNESS,
                ]}
              />
              <meshStandardMaterial color={WALL_COLOUR} />
            </mesh>
          </RigidBody>

          {/* BACK */}
          <RigidBody type="fixed" colliders="cuboid">
            <mesh position={[0, TRAY_HEIGHT / 2, -HALF_INNER - HALF_THICKNESS]}>
              <boxGeometry
                args={[
                  INNER_SIZE + WALL_THICKNESS * 2,
                  TRAY_HEIGHT,
                  WALL_THICKNESS,
                ]}
              />
              <meshStandardMaterial color={WALL_COLOUR} />
            </mesh>
          </RigidBody>

          {/* RIGHT */}
          <RigidBody type="fixed" colliders="cuboid">
            <mesh position={[HALF_INNER + HALF_THICKNESS, TRAY_HEIGHT / 2, 0]}>
              <boxGeometry args={[WALL_THICKNESS, TRAY_HEIGHT, INNER_SIZE]} />
              <meshStandardMaterial color={WALL_COLOUR} />
            </mesh>
          </RigidBody>

          {/* LEFT */}
          <RigidBody type="fixed" colliders="cuboid">
            <mesh position={[-HALF_INNER - HALF_THICKNESS, TRAY_HEIGHT / 2, 0]}>
              <boxGeometry args={[WALL_THICKNESS, TRAY_HEIGHT, INNER_SIZE]} />
              <meshStandardMaterial color={WALL_COLOUR} />
            </mesh>
          </RigidBody>

          {/* INVISIBLE TOP BOUNDS */}
          {[
            [0, LID_Y, HALF_INNER + HALF_THICKNESS],
            [0, LID_Y, -HALF_INNER - HALF_THICKNESS],
            [HALF_INNER + HALF_THICKNESS, LID_Y, 0],
            [-HALF_INNER - HALF_THICKNESS, LID_Y, 0],
          ].map((pos, i) => (
            <RigidBody key={i} type="fixed" colliders="cuboid">
              <mesh position={pos as [number, number, number]}>
                <boxGeometry
                  args={[
                    i < 2 ? INNER_SIZE + WALL_THICKNESS * 2 : WALL_THICKNESS,
                    0.5,
                    i < 2 ? WALL_THICKNESS : INNER_SIZE,
                  ]}
                />
                <meshStandardMaterial transparent opacity={0} />
              </mesh>
            </RigidBody>
          ))}
        </Physics>

        <OrbitControls />
      </Canvas>

      {/* Controls */}
      <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 rounded-lg bg-black/50 p-3 backdrop-blur-sm sm:flex-row">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-white uppercase">Count</span>
          <select
            value={diceCount}
            onChange={(e) => setDiceCount(Number(e.target.value))}
            className="rounded bg-zinc-900 px-2 py-1 text-white"
          >
            {[...Array(10)].map((_, i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-white uppercase">Type</span>
          <select
            value={diceSides}
            onChange={(e) => setDiceSides(Number(e.target.value) as any)}
            className="rounded bg-zinc-900 px-2 py-1 text-white"
          >
            {[4, 6, 8, 10, 12, 20].map((s) => (
              <option key={s} value={s}>
                D{s}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={rerollDice}
          className="rounded bg-white px-6 py-2 font-bold text-black"
        >
          ROLL
        </button>

        <button
          onClick={() => redirect("/")}
          className="flex h-9 w-9 items-center justify-center rounded bg-zinc-800 text-white"
        >
          ✕
        </button>
      </div>
    </>
  );
};

export default DiceCanvas;
