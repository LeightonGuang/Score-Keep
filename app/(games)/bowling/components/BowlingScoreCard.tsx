"use client";

import { twMerge } from "tailwind-merge";
import { PlayerCard } from "./PlayerCard";
import { useBowling } from "../context/BowlingContext";
import BowlingScoreControls from "./BowlingScoreControls";

const BowlingScoreCard = () => {
  const { players, turn } = useBowling();

  return (
    <section className="flex flex-col gap-6">
      {/* Scorecard */}
      <div className="border-border bg-surface w-max overflow-hidden rounded-2xl border shadow-sm">
        <div className="grid grid-cols-11">
          {/* Corner cell */}
          <div className="border-border bg-surface-muted flex h-10 w-16 items-center justify-center border-r border-b">
            <span className="text-muted text-xs font-semibold tracking-wider uppercase">
              #
            </span>
          </div>

          {/* Frame headers */}
          {Array.from({ length: 10 }, (_, index) => {
            const frameNumber = index + 1;
            const isActive = turn.frame === frameNumber;

            return (
              <div
                key={frameNumber}
                className={twMerge(
                  "border-border bg-surface-muted text-foreground relative flex h-10 w-16 items-center justify-center border-r border-b text-sm font-semibold last:border-r-0",
                  isActive && "bg-accent text-white",
                )}
              >
                {frameNumber}

                {isActive && (
                  <span className="absolute bottom-0 left-1/2 h-0.5 w-6 -translate-x-1/2 rounded-full bg-white" />
                )}
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
      </div>

      {/* Controls */}
      <div className="flex justify-center">
        <BowlingScoreControls />
      </div>
    </section>
  );
};

export default BowlingScoreCard;
