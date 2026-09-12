"use client";

import { useEffect, useState } from "react";
import { useBowling } from "../context/BowlingContext";
import AdvancePinControl from "./AdvancePinControl";

const BowlingScoreControls = () => {
  const { players, turn, recordRoll } = useBowling();

  const [mode, setMode] = useState<"basic" | "advanced">("basic");

  if (players.length === 0) return null;

  const currentPlayer = players[turn.player];
  const currentFrame = currentPlayer?.frames[turn.frame - 1];
  const rolls = currentFrame?.rolls ?? [];

  const getMaxPins = (): number => {
    if (turn.frame < 10) {
      if (rolls.length === 0) return 10;
      if (rolls.length === 1) return 10 - rolls[0];

      return 0;
    }

    if (rolls.length === 0) return 10;

    if (rolls.length === 1) {
      if (rolls[0] === 10) return 10;

      return 10 - rolls[0];
    }

    if (rolls.length === 2) {
      const [first, second] = rolls;

      if (first === 10 && second === 10) return 10;

      if (first === 10) return 10 - second;

      if (first + second === 10) return 10;

      return -1;
    }

    return -1;
  };

  const maxPins = getMaxPins();
  const canRoll = maxPins >= 0;

  const handleRoll = (pins: number) => {
    if (!canRoll || pins > maxPins) return;

    const standingPins = Array.from(
      { length: 10 - pins },
      (_, index) => index + 1,
    );

    recordRoll(pins, standingPins);
  };

  useEffect(() => {
    if (mode !== "basic") return;

    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;

      if (
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA" ||
        target?.isContentEditable
      ) {
        return;
      }

      if (event.key.toLowerCase() === "x") {
        event.preventDefault();
        handleRoll(10);
        return;
      }

      if (event.key === "/") {
        event.preventDefault();

        if (rolls.length === 0) return;

        const lastRoll = rolls[rolls.length - 1];

        if (lastRoll === 10) return;

        handleRoll(10 - lastRoll);
        return;
      }

      if (/^[0-9]$/.test(event.key)) {
        event.preventDefault();
        handleRoll(Number(event.key));
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mode, turn, rolls, maxPins]);

  return (
    <div className="w-max rounded-xl bg-zinc-600/50 p-4">
      <div className="mb-4 flex gap-2">
        <button
          type="button"
          onClick={() => setMode("basic")}
          className={
            mode === "basic"
              ? "rounded bg-white px-4 py-2 text-black"
              : "rounded border px-4 py-2 text-white"
          }
        >
          Basic
        </button>

        <button
          type="button"
          onClick={() => setMode("advanced")}
          className={
            mode === "advanced"
              ? "rounded bg-white px-4 py-2 text-black"
              : "rounded border px-4 py-2 text-white"
          }
        >
          Advanced
        </button>
      </div>

      {mode === "basic" ? (
        <div className="grid grid-cols-3 grid-rows-4">
          {Array.from({ length: 11 }, (_, pins) => {
            const isStrike = pins === 10;
            const disabled = !canRoll || pins > maxPins;

            return (
              <button
                key={pins}
                type="button"
                disabled={disabled}
                onClick={() => handleRoll(pins)}
                className="size-16 border transition-all hover:bg-black hover:text-white active:bg-white active:text-black disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-inherit"
              >
                {isStrike ? "X" : pins}
              </button>
            );
          })}
        </div>
      ) : (
        <AdvancePinControl />
      )}

      <div className="mt-4 text-center text-white">
        Frame {turn.frame} · Player {turn.player + 1} · Ball {turn.ball}
      </div>
    </div>
  );
};

export default BowlingScoreControls;
