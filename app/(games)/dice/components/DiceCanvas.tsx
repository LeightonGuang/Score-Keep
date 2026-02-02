"use client";

import { Canvas } from "@react-three/fiber";
import { Physics, RigidBody, RapierRigidBody } from "@react-three/rapier";
import { OrbitControls, RoundedBox } from "@react-three/drei";
import { useMemo, useRef, useEffect, useState } from "react";

const DiceCanvas = () => {
  const diceRef = useRef<RapierRigidBody>(null);

  const generateRandomRotation = (): [number, number, number] => [
    Math.random() * Math.PI * 2,
    Math.random() * Math.PI * 2,
    Math.random() * Math.PI * 2,
  ];

  const generateRandomTorque = () => ({
    x: Math.random() * 0.1,
    y: Math.random() * 0.1,
    z: Math.random() * 0.1,
  });

  const [diceRotation, setDiceRotation] = useState<[number, number, number]>(
    generateRandomRotation(),
  );

  // Initial roll
  useEffect(() => {
    if (diceRef.current) {
      diceRef.current.applyTorqueImpulse(generateRandomTorque(), true);
    }
  }, []);

  const rerollDice = () => {
    if (!diceRef.current) return;

    // Reset position and rotation
    diceRef.current.setTranslation({ x: 0, y: 5, z: 0 }, true);
    const newRotation = generateRandomRotation();
    diceRef.current.setRotation(
      { x: newRotation[0], y: newRotation[1], z: newRotation[2], w: 1 },
      true,
    );

    // Apply new torque
    diceRef.current.applyTorqueImpulse(generateRandomTorque(), true);

    // Update state (optional, useful if you want to trigger re-render)
    setDiceRotation(newRotation);
  };

  const WALL_HEIGHT = 1;
  const WALL_THICKNESS = 0.2;
  const SIZE = 10;

  return (
    <>
      <Canvas camera={{ position: [5, 5, 5], fov: 50 }}>
        <color attach="background" args={["#ffffff"]} />
        <ambientLight intensity={1} />
        <directionalLight position={[10, 10, 5]} intensity={1} />

        <Physics gravity={[0, -9.81, 0]}>
          {/* Dice */}
          <RigidBody
            ref={diceRef}
            position={[0, 5, 0]}
            rotation={diceRotation}
            colliders="cuboid"
            restitution={0.5}
            friction={0.2}
            mass={1}
          >
            <RoundedBox
              args={[1, 1, 1]}
              radius={0.05}
              smoothness={4}
              castShadow
            >
              <meshStandardMaterial color="white" />
            </RoundedBox>
          </RigidBody>

          {/* Ground */}
          <RigidBody type="fixed" colliders="cuboid" restitution={0.3}>
            <mesh receiveShadow position={[0, -0.5, 0]}>
              <boxGeometry args={[SIZE, 0.1, SIZE]} />
              <meshStandardMaterial color="green" />
            </mesh>
          </RigidBody>

          {/* Walls */}
          <RigidBody type="fixed" colliders="cuboid">
            <mesh position={[0, -WALL_HEIGHT / 4, SIZE / 2]}>
              <boxGeometry args={[SIZE, WALL_HEIGHT, WALL_THICKNESS]} />
              <meshStandardMaterial color="green" />
            </mesh>
            <mesh position={[0, -WALL_HEIGHT / 4, -SIZE / 2]}>
              <boxGeometry args={[SIZE, WALL_HEIGHT, WALL_THICKNESS]} />
              <meshStandardMaterial color="green" />
            </mesh>
            <mesh position={[SIZE / 2, -WALL_HEIGHT / 4, 0]}>
              <boxGeometry args={[WALL_THICKNESS, WALL_HEIGHT, SIZE]} />
              <meshStandardMaterial color="green" />
            </mesh>
            <mesh position={[-SIZE / 2, -WALL_HEIGHT / 4, 0]}>
              <boxGeometry args={[WALL_THICKNESS, WALL_HEIGHT, SIZE]} />
              <meshStandardMaterial color="green" />
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
