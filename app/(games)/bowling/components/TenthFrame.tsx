import { isSplitRack } from "../games";
import { twMerge } from "tailwind-merge";

import type { Frame, Turn } from "../types";

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

  /*
   * A split occurs when:
   *
   * - The first ball isn't a strike.
   * - The head pin (1) is down.
   * - At least 2 pins remain standing.
   */
  const firstRackAfterRoll = frame.pinStates[0] ?? [];

  const isSplit = isSplitRack(firstRackAfterRoll);

  const getRollDisplay = (
    roll: number | undefined,
    ball: 1 | 2 | 3,
  ): string | number => {
    if (roll === undefined) {
      return "";
    }

    /*
     * Ball 1
     */
    if (ball === 1) {
      return roll === 10 ? "X" : roll;
    }

    /*
     * Ball 2
     */
    if (ball === 2) {
      if (first !== undefined && first < 10 && first + roll === 10) {
        return "/";
      }

      return roll === 10 ? "X" : roll;
    }

    /*
     * Ball 3
     */
    if (second !== undefined && second < 10 && second + roll === 10) {
      return "/";
    }

    return roll === 10 ? "X" : roll;
  };

  return (
    <div className="border-border bg-surface size-16 overflow-hidden border">
      {/* Rolls */}
      <div className="flex h-8">
        {([first, second, third] as const).map((roll, index) => {
          const ball = (index + 1) as 1 | 2 | 3;

          const isActive =
            isCurrentPlayer && isCurrentFrame && turn.ball === ball;

          const isSplitFirstRoll = ball === 1 && isSplit;

          return (
            <div
              key={ball}
              className={twMerge(
                "text-foreground relative flex w-1/3 items-center justify-center text-sm font-medium",
                ball !== 3 && "border-border border-r",
                isActive && "bg-accent text-white",
              )}
            >
              {isSplitFirstRoll ? (
                <span className="flex size-6 items-center justify-center rounded-full border-2 border-red-500">
                  {getRollDisplay(roll, ball)}
                </span>
              ) : (
                getRollDisplay(roll, ball)
              )}
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
