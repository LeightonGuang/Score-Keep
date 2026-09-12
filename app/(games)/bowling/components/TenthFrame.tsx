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
  const isCurrentFrame = turn.frame === 10;

  const displayRoll = (
    roll: number | undefined,
    ball: 1 | 2 | 3,
  ): string | number => {
    if (roll === undefined) {
      return "";
    }

    // First ball
    if (ball === 1) {
      return roll === 10 ? "X" : roll;
    }

    // Second ball
    if (ball === 2) {
      const isSpare = first !== undefined && first < 10 && first + roll === 10;

      if (isSpare) {
        return "/";
      }

      return roll === 10 ? "X" : roll;
    }

    // Third ball
    const isSpare = second !== undefined && second < 10 && second + roll === 10;

    if (roll === 10) {
      return "X";
    }

    if (isSpare) {
      return "/";
    }

    return roll;
  };

  return (
    <div className="border-border bg-surface size-16 overflow-hidden border">
      {/* Rolls */}
      <div className="flex h-8">
        {[first, second, third].map((roll, index) => {
          const ball = (index + 1) as 1 | 2 | 3;

          const isActive =
            isCurrentPlayer && isCurrentFrame && turn.ball === ball;

          return (
            <div
              key={ball}
              className={twMerge(
                "flex w-1/3 items-center justify-center text-sm",
                ball !== 3 && "border-border border-r",
                isActive && "bg-accent text-white",
              )}
            >
              {displayRoll(roll, ball)}
            </div>
          );
        })}
      </div>

      {/* Score */}
      <div className="border-border text-foreground flex h-8 items-center justify-center border-t text-sm font-semibold">
        {score ?? ""}
      </div>
    </div>
  );
};
