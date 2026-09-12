"use client";

import { twMerge } from "tailwind-merge";
import { useBowling } from "../context/BowlingContext";
import type { BowlingPlayer, Turn } from "../context/BowlingContext";
import { calculateFrameScores } from "./bowlingScore";
import { Frame } from "./Frame";
import { TenthFrame } from "./TenthFrame";

interface PlayerCardProps {
player: BowlingPlayer;
playerIndex: number;
turn: Turn;
currentGame: number;
}

export const PlayerCard = ({
player,
playerIndex,
turn,
currentGame,
}: PlayerCardProps) => {
const game = player.games[currentGame];

if (!game) {
return null;
}

const frames = game.frames;
const scores = calculateFrameScores(frames);

const isCurrentPlayer = turn.player === playerIndex;

return (
<div
className={twMerge(
"grid grid-cols-[180px_repeat(10,64px)]",
isCurrentPlayer && "bg-surface-muted",
)}
>
{/* Player name */}
<div
className={twMerge(
"border-border bg-surface text-foreground flex h-16 items-center border-b border-l px-4 text-sm font-semibold",
isCurrentPlayer && "bg-accent/5",
)}
>
{player.name}
</div>

  {/* Frames */}
  {frames.map((frame, index) => {
    const frameNumber = index + 1;
    const score = scores[index] ?? null;

    /*
     * Frames 1-9 use the normal two-ball frame.
     *
     * Frame 10 has special bowling rules and can
     * contain three rolls, so it gets its own component.
     */
    if (frameNumber === 10) {
      return (
        <TenthFrame
          key={frameNumber}
          frame={frame}
          turn={turn}
          score={score}
          playerIndex={playerIndex}
        />
      );
    }

    return (
      <Frame
        key={frameNumber}
        i={frameNumber}
        frame={frame}
        turn={turn}
        score={score}
        playerIndex={playerIndex}
      />
    );
  })}
</div>


);
};