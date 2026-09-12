"use client";

import { twMerge } from "tailwind-merge";
import { PlayerCard } from "./PlayerCard";
import { useBowling } from "../context/BowlingContext";
import BowlingScoreControls from "./BowlingScoreControls";

const BowlingScoreCard = () => {
  const { players, turn, currentGame } = useBowling();

  return (
    <section className="space-y-6">
      <div className="overflow-x-auto">
        <div className="w-max min-w-full">
          {/* Header */}
          <div className="grid grid-cols-[180px_repeat(10,64px)]">
            <div className="border-border bg-surface-muted text-muted flex h-10 items-center border px-4 text-sm font-semibold">
              Player
            </div>

            {Array.from({ length: 10 }, (_, index) => {
              const frameNumber = index + 1;

              return (
                <div
                  key={frameNumber}
                  className={twMerge(
                    "border-border bg-surface-muted text-muted flex h-10 items-center justify-center border-b border-l text-sm font-semibold",
                    turn.frame === frameNumber && "bg-accent text-white",
                  )}
                >
                  {frameNumber}
                </div>
              );
            })}
          </div>

          {/* Players */}
          {players.map((player, index) => (
            <PlayerCard
              key={player.id}
              player={player}
              playerIndex={index}
              turn={turn}
              currentGame={currentGame}
            />
          ))}
        </div>
      </div>

      <BowlingScoreControls />
    </section>
  );
};

export default BowlingScoreCard;
