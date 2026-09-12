import { twMerge } from "tailwind-merge";

import type { Frame, Turn } from "../context/BowlingContext";

interface TenthFrameProps {
  frame: Frame;
  turn: Turn;
  score: number | null;
  playerIndex: number;
}

export const TenthFrame = ({
  frame,
  turn,
  score,
  playerIndex,
}: TenthFrameProps) => {
  const [first, second, third] = frame.rolls;

  const isCurrentPlayer = turn.player === playerIndex;

  const displayRoll = (roll: number | undefined, ball: number) => {
    if (roll === undefined) {
      return "";
    }

    if (ball === 1) {
      return roll === 10 ? "X" : roll;
    }

    if (ball === 2) {
      if (first !== undefined && first < 10 && first + roll === 10) {
        return "/";
      }

      return roll === 10 ? "X" : roll;
    }

    if (roll === 10) {
      return "X";
    }

    if (second !== undefined && second < 10 && second + roll === 10) {
      return "/";
    }

    return roll;
  };

  return (
    <div className="size-16 border">
      <div className="flex h-8 w-full">
        {[first, second, third].map((roll, index) => {
          const ball = index + 1;

          return (
            <div
              key={ball}
              className={twMerge(
                "w-1/3 border text-center",
                isCurrentPlayer &&
                  turn.frame === 10 &&
                  turn.ball === ball &&
                  "bg-red-500",
              )}
            >
              {displayRoll(roll, ball)}
            </div>
          );
        })}
      </div>

      <div className="flex h-8 items-center justify-center font-semibold">
        {score ?? ""}
      </div>
    </div>
  );
};
