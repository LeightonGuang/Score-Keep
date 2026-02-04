"use client";

import {
  useRef,
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import { RigidBody, RapierRigidBody } from "@react-three/rapier";

export interface DiceHandle {
  reroll: () => void;
}

interface DiceProps {
  position?: [number, number, number];
  DICE_COLOR?: string;
}

export const D10Dice = forwardRef<DiceHandle, DiceProps>(
  ({ position = [0, 3, 0], DICE_COLOR = "#FFFFFF" }, ref) => {
    const rigidBodyRef = useRef<RapierRigidBody>(null);

    const generateRandomRotation = (): [number, number, number] => [
      Math.random() * Math.PI * 2,
      Math.random() * Math.PI * 2,
      Math.random() * Math.PI * 2,
    ];

    const generateRandomTorque = () => ({
      x: (Math.random() - 0.5) * 8,
      y: (Math.random() - 0.5) * 8,
      z: (Math.random() - 0.5) * 8,
    });

    const generateRandomImpulse = () => ({
      x: (Math.random() - 0.5) * 4,
      y: Math.random() * 5,
      z: (Math.random() - 0.5) * 4,
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

    // Constructing a Pentagonal Trapezohedron approximate using two cones (pentagonal pyramids)
    // Actually, a trapezohedron is twisty, so just two pyramids base-to-base is a Bipyramid (Dp5), which is often used as a D10.
    // D10 is technically a pentagonal trapezohedron, but a pentagonal bipyramid is close enough for a 'game' simulation unless perfectly mathematically required.
    // However, D10 faces are kites, whereas bipyramid faces are triangles.
    // For simplicity, let's use the Pentagonal Bipyramid (2 Cones) as it rolls similarly.

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
        <group dispose={null}>
          {/* Top Pyramid */}
          <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
            <coneGeometry args={[0.7, 1, 5]} />
            <meshStandardMaterial color={DICE_COLOR} roughness={0.2} />
          </mesh>
          {/* Bottom Pyramid (inverted) */}
          <mesh
            position={[0, -0.5, 0]}
            rotation={[Math.PI, 0, 0]}
            castShadow
            receiveShadow
          >
            <coneGeometry args={[0.7, 1, 5]} />
            <meshStandardMaterial color={DICE_COLOR} roughness={0.2} />
          </mesh>
        </group>
      </RigidBody>
    );
  },
);

D10Dice.displayName = "D10Dice";
