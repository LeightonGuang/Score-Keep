"use client";

import {
  useRef,
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import { RigidBody, RapierRigidBody } from "@react-three/rapier";
import * as THREE from "three";

export interface DiceHandle {
  reroll: () => void;
}

interface DiceProps {
  position?: [number, number, number];
  DICE_COLOR?: string;
}

export const D4Dice = forwardRef<DiceHandle, DiceProps>(
  ({ position = [0, 3, 0], DICE_COLOR = "#FFFFFF" }, ref) => {
    const rigidBodyRef = useRef<RapierRigidBody>(null);

    const generateRandomRotation = (): [number, number, number] => [
      Math.random() * Math.PI * 2,
      Math.random() * Math.PI * 2,
      Math.random() * Math.PI * 2,
    ];

    const generateRandomTorque = () => ({
      x: (Math.random() - 0.5) * 0.5,
      y: (Math.random() - 0.5) * 0.5,
      z: (Math.random() - 0.5) * 0.5,
    });

    const generateRandomImpulse = () => ({
      x: (Math.random() - 0.5) * 3,
      y: Math.random() * 4,
      z: (Math.random() - 0.5) * 3,
    });

    const [initialRotation] = useState<[number, number, number]>(
      generateRandomRotation(),
    );

    useImperativeHandle(ref, () => ({
      reroll: () => {
        if (!rigidBodyRef.current) return;
        rigidBodyRef.current.setTranslation(
          { x: position[0], y: position[1], z: position[2] },
          true,
        );
        rigidBodyRef.current.setLinvel({ x: 0, y: 0, z: 0 }, true);
        rigidBodyRef.current.setAngvel({ x: 0, y: 0, z: 0 }, true);

        const newRotation = generateRandomRotation();
        rigidBodyRef.current.setRotation(
          { x: newRotation[0], y: newRotation[1], z: newRotation[2], w: 1 },
          true,
        );

        rigidBodyRef.current.applyTorqueImpulse(generateRandomTorque(), true);
        rigidBodyRef.current.applyImpulse(generateRandomImpulse(), true);
      },
    }));

    useEffect(() => {
      if (rigidBodyRef.current) {
        rigidBodyRef.current.applyTorqueImpulse(generateRandomTorque(), true);
        rigidBodyRef.current.applyImpulse(generateRandomImpulse(), true);
      }
    }, []);

    // Create texture with numbers
    const createNumberTexture = (numbers: string[]) => {
      const canvas = document.createElement("canvas");
      canvas.width = 512;
      canvas.height = 512;
      const ctx = canvas.getContext("2d")!;

      ctx.fillStyle = DICE_COLOR;
      ctx.fillRect(0, 0, 512, 512);

      ctx.fillStyle = "black";
      ctx.font = "bold 80px Arial";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      // Draw three numbers on the texture
      ctx.fillText(numbers[0], 256, 120);
      ctx.fillText(numbers[1], 150, 400);
      ctx.fillText(numbers[2], 362, 400);

      const texture = new THREE.CanvasTexture(canvas);
      texture.needsUpdate = true;
      return texture;
    };

    const face1Texture = createNumberTexture(["2", "3", "4"]); // 1 on bottom
    const face2Texture = createNumberTexture(["1", "3", "4"]); // 2 on bottom
    const face3Texture = createNumberTexture(["1", "2", "4"]); // 3 on bottom
    const face4Texture = createNumberTexture(["1", "2", "3"]); // 4 on bottom

    return (
      <RigidBody
        ref={rigidBodyRef}
        position={position}
        rotation={initialRotation}
        colliders="hull"
        restitution={0.3}
        friction={0.2}
        mass={1}
        ccd
        linearDamping={0.1}
        angularDamping={0.1}
      >
        <mesh castShadow receiveShadow>
          <tetrahedronGeometry args={[0.8]} />
          <meshStandardMaterial map={face1Texture} roughness={0.2} />
        </mesh>
      </RigidBody>
    );
  },
);

D4Dice.displayName = "D4Dice";
