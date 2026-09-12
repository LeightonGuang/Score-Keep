import { twMerge } from "tailwind-merge";

import { isSplitRack } from "../games";
import type { Frame as GameFrame, Turn } from "../types";

interface FrameProps {
  i: number;
  frame: GameFrame;
  turn: Turn;
  score: number | null;
  playerIndex: number;
}

export const Frame = ({ i, frame, turn, score, playerIndex }: FrameProps) => {
  const [firstRoll, secondRoll] = frame.rolls;

  const isSpare =
    firstRoll !== undefined &&
    firstRoll < 10 &&
    secondRoll !== undefined &&
    firstRoll + secondRoll === 10;

  /*
   * A split occurs when:
   *
   * - The first ball knocks down the head pin.
   * - There are at least 2 pins left standing.
   *
   * pinStates[0] contains the pins standing after
   * the first roll.
   */
  const firstRackAfterRoll = frame.pinStates[0] ?? [];

  const isSplit = isSplitRack(firstRackAfterRoll);

  const isCurrentPlayer = turn.player === playerIndex;
  const isCurrentFrame = turn.frame === i;

  const isFirstBallActive =
    isCurrentPlayer && isCurrentFrame && turn.ball === 1;

  const isSecondBallActive =
    isCurrentPlayer && isCurrentFrame && turn.ball === 2;

  return (
    <div className="border-border bg-surface size-16 overflow-hidden border">
      {/* Rolls */}
      <div className="flex h-8">
        <div
          className={twMerge(
            "border-border relative flex w-1/2 items-center justify-center border-r text-sm",
            isFirstBallActive && "bg-accent text-white",
          )}
        >
          {isSplit ? (
            <span className="flex size-6 items-center justify-center rounded-full border-2 border-red-500">
              {firstRoll === 10 ? "X" : (firstRoll ?? "")}
            </span>
          ) : firstRoll === 10 ? (
            "X"
          ) : (
            (firstRoll ?? "")
          )}
        </div>

        <div
          className={twMerge(
            "flex w-1/2 items-center justify-center text-sm",
            isSecondBallActive && "bg-accent text-white",
          )}
        >
          {isSpare ? "/" : secondRoll === 10 ? "X" : (secondRoll ?? "")}
        </div>
      </div>

      {/* Score */}
      <div className="border-border text-foreground flex h-8 items-center justify-center border-t text-sm font-semibold">
        {score ?? ""}
      </div>
    </div>
  );
};
