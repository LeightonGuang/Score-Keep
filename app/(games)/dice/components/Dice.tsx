"use client";

import {
  useRef,
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import { RigidBody, RapierRigidBody } from "@react-three/rapier";
import { RoundedBox } from "@react-three/drei";

export interface DiceHandle {
  reroll: () => void;
}

interface DiceProps {
  position?: [number, number, number];
}

export const Dice = forwardRef<DiceHandle, DiceProps>(
  ({ position = [0, 3, 0] }, ref) => {
    const DICE_RADIUS = 0.1;

    const rigidBodyRef = useRef<RapierRigidBody>(null);

    const generateRandomRotation = (): [number, number, number] => [
      Math.random() * Math.PI * 2,
      Math.random() * Math.PI * 2,
      Math.random() * Math.PI * 2,
    ];

    const generateRandomTorque = () => ({
      x: (Math.random() - 0.5) * 10,
      y: (Math.random() - 0.5) * 10,
      z: (Math.random() - 0.5) * 10,
    });

    const generateRandomImpulse = () => ({
      x: (Math.random() - 0.5) * 5,
      y: Math.random() * 5,
      z: (Math.random() - 0.5) * 5,
    });

    // We rely on physics for state after mount, so this is just for initial placement
    const [initialRotation] = useState<[number, number, number]>(
      generateRandomRotation(),
    );

    useImperativeHandle(ref, () => ({
      reroll: () => {
        if (!rigidBodyRef.current) return;

        // Reset position and dynamics
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

        // Apply forces
        rigidBodyRef.current.applyTorqueImpulse(generateRandomTorque(), true);
        rigidBodyRef.current.applyImpulse(generateRandomImpulse(), true);
      },
    }));

    useEffect(() => {
      // Initial toss on mount
      if (rigidBodyRef.current) {
        rigidBodyRef.current.applyTorqueImpulse(generateRandomTorque(), true);
        rigidBodyRef.current.applyImpulse(generateRandomImpulse(), true);
      }
    }, []);

    const FACE_OFFSET = 0.505; // Slightly more than 0.5 to sit on surface
    const PIP_SIZE = 0.1;

    const Pip = ({ position }: { position: [number, number, number] }) => (
      <mesh position={position} castShadow receiveShadow>
        <circleGeometry args={[0.08, 32]} />
        <meshStandardMaterial color="black" roughness={0.5} />
      </mesh>
    );

    const Face = ({
      value,
      position,
      rotation,
    }: {
      value: number;
      position: [number, number, number];
      rotation: [number, number, number];
    }) => {
      // Pip positions relative to face center (2D plane)
      const pips = [];
      const offset = 0.25;

      // Center pip (odd numbers)
      if (value % 2 === 1) {
        pips.push([0, 0]);
      }

      // Corners for 2, 3, 4, 5, 6
      if (value > 1) {
        pips.push([-offset, -offset]); // Bottom Left
        pips.push([offset, offset]); // Top Right
      }

      // Corners for 4, 5, 6
      if (value > 3) {
        pips.push([-offset, offset]); // Top Left
        pips.push([offset, -offset]); // Bottom Right
      }

      // Vertical middle for 6
      if (value === 6) {
        pips.push([-offset, 0]); // Middle Left
        pips.push([offset, 0]); // Middle Right
      }

      return (
        <group position={position} rotation={rotation}>
          {pips.map((pos, i) => (
            <Pip key={i} position={[pos[0], pos[1], 0]} />
          ))}
        </group>
      );
    };

    return (
      <RigidBody
        ref={rigidBodyRef}
        position={position}
        rotation={initialRotation}
        colliders="cuboid"
        restitution={0.3}
        friction={0.2}
        mass={1}
        ccd
        linearDamping={0.1}
        angularDamping={0.1}
      >
        <RoundedBox
          args={[1, 1, 1]}
          radius={DICE_RADIUS}
          smoothness={4}
          castShadow
        >
          <meshStandardMaterial color="white" roughness={0.2} />
        </RoundedBox>

        {/* Face 1 (Front +Z) */}
        <Face value={1} position={[0, 0, FACE_OFFSET]} rotation={[0, 0, 0]} />

        {/* Face 6 (Back -Z) */}
        <Face
          value={6}
          position={[0, 0, -FACE_OFFSET]}
          rotation={[0, Math.PI, 0]}
        />

        {/* Face 2 (Top +Y) */}
        <Face
          value={2}
          position={[0, FACE_OFFSET, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
        />

        {/* Face 5 (Bottom -Y) */}
        <Face
          value={5}
          position={[0, -FACE_OFFSET, 0]}
          rotation={[Math.PI / 2, 0, 0]}
        />

        {/* Face 3 (Right +X) */}
        <Face
          value={3}
          position={[FACE_OFFSET, 0, 0]}
          rotation={[0, Math.PI / 2, 0]}
        />

        {/* Face 4 (Left -X) */}
        <Face
          value={4}
          position={[-FACE_OFFSET, 0, 0]}
          rotation={[0, -Math.PI / 2, 0]}
        />
      </RigidBody>
    );
  },
);

Dice.displayName = "Dice";
