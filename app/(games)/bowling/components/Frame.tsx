import { twMerge } from "tailwind-merge";

import type { Frame as GameFrame, Turn } from "../context/BowlingContext";

interface FrameProps {
  i: number;
  frame: GameFrame;
  turn: Turn;
  score: number | null;
  playerIndex: number;
}

export const Frame = ({ i, frame, turn, score, playerIndex }: FrameProps) => {
  const firstRoll = frame.rolls[0];
  const secondRoll = frame.rolls[1];

  const isSpare =
    firstRoll !== undefined &&
    firstRoll < 10 &&
    secondRoll !== undefined &&
    firstRoll + secondRoll === 10;

  const isCurrentPlayer = turn.player === playerIndex;

  return (
    <div className="size-16 border">
      <div className="flex h-8 w-full">
        <div
          className={twMerge(
            "w-1/2 border text-center",
            isCurrentPlayer &&
              turn.frame === i &&
              turn.ball === 1 &&
              "bg-red-500",
          )}
        >
          {firstRoll === 10 ? "X" : (firstRoll ?? "")}
        </div>

        <div
          className={twMerge(
            "w-1/2 border text-center",
            isCurrentPlayer &&
              turn.frame === i &&
              turn.ball === 2 &&
              "bg-red-500",
          )}
        >
          {isSpare ? "/" : secondRoll === 10 ? "X" : (secondRoll ?? "")}
        </div>
      </div>

      <div className="flex h-8 items-center justify-center font-semibold">
        {score ?? ""}
      </div>
    </div>
  );
};
