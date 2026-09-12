"use client";

import { twMerge } from "tailwind-merge";
import { PlayerCard } from "./PlayerCard";
import { useBowling } from "../context/BowlingContext";
import BowlingScoreControls from "./BowlingScoreControls";

const BowlingScoreCard = () => {
  const { players, turn } = useBowling();

  return (
    <section>
      <div className="grid w-max grid-cols-11">
        {/* Header */}
        {Array.from({ length: 11 }, (_, index) => {
          const frameNumber = index;

          return (
            <div
              key={frameNumber}
              className={twMerge(
                "w-16 border px-2 text-center",
                turn.frame === frameNumber && "bg-red-500",
              )}
            >
              {frameNumber === 0 ? "" : frameNumber}
            </div>
          );
        })}

        {/* Players */}
        {players.map((player, index) => (
          <PlayerCard
            key={player.id}
            player={player}
            playerIndex={index}
            turn={turn}
          />
        ))}
      </div>

      <BowlingScoreControls />
    </section>
  );
};

export default BowlingScoreCard;
