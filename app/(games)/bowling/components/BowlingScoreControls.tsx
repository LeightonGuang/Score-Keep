"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import AdvancePinControl from "./AdvancePinControl";
import { useBowling } from "../context/BowlingContext";

const ALL_PINS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const BowlingScoreControls = () => {
  const { players, turn, currentGame, recordRoll, newGame, clearPlayers } =
    useBowling();

  const [mode, setMode] = useState<"basic" | "advanced">("basic");

  const currentPlayer = players[turn.player];
  const game = currentPlayer?.games[currentGame];
  const currentFrame = game?.frames[turn.frame - 1];

  const rolls = currentFrame?.rolls ?? [];
  const pinStates = currentFrame?.pinStates ?? [];

  const getCurrentRack = (): number[] => {
    if (rolls.length === 0) return ALL_PINS;

    const lastRoll = rolls[rolls.length - 1];

    if (lastRoll === 10) return ALL_PINS;

    if (turn.frame === 10 && rolls.length >= 2 && rolls[0] + rolls[1] === 10) {
      return ALL_PINS;
    }

    return pinStates[pinStates.length - 1] ?? ALL_PINS;
  };

  const currentRack = getCurrentRack();
  const maxPins = currentRack.length;
  const canRoll = maxPins > 0;

  const handleRoll = (pins: number) => {
    if (!canRoll || pins < 0 || pins > maxPins) return;

    const standingPins = currentRack.slice(0, maxPins - pins);

    recordRoll(pins, standingPins);
  };

  const handleRestart = () => {
    const confirmed = window.confirm(
      "Restart the bowling session? This will delete all players and all recorded games.",
    );

    if (!confirmed) return;

    clearPlayers();
    window.location.reload();
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

        if (maxPins === 10) handleRoll(10);

        return;
      }

      if (event.key === "/") {
        event.preventDefault();

        if (rolls.length === 0) return;

        const lastRoll = rolls[rolls.length - 1];

        if (lastRoll === 10) return;

        handleRoll(maxPins);

        return;
      }

      if (/^[0-9]$/.test(event.key)) {
        event.preventDefault();

        handleRoll(Number(event.key));
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [mode, turn, rolls, pinStates, maxPins]);

  if (players.length === 0) return null;

  return (
    <div className="border-border bg-surface w-full max-w-sm rounded-2xl border p-4 shadow-sm">
      {/* Game controls */}
      <div className="mb-4">
        <div className="mb-3 flex items-start justify-between gap-3">
          <div>
            <p className="text-foreground text-sm font-semibold">
              Game {currentGame + 1}
            </p>

            <p className="text-muted mt-1 text-xs">
              Player {turn.player + 1}
              {" · "}
              Frame {turn.frame}
              {" · "}
              Ball {turn.ball}
            </p>
          </div>

          <button
            type="button"
            onClick={newGame}
            className="bg-accent hover:bg-accent-hover focus-visible:ring-accent shrink-0 rounded-lg px-3 py-2 text-sm font-semibold text-white shadow-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
          >
            Next Game
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Link
            href="/bowling/results"
            className="border-border bg-surface text-foreground hover:border-accent hover:bg-surface-muted flex items-center justify-center rounded-lg border px-3 py-2 text-sm font-semibold transition-colors"
          >
            Game History
          </Link>

          <button
            type="button"
            onClick={handleRestart}
            className="flex items-center justify-center rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-600 transition-colors hover:border-red-300 hover:bg-red-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
          >
            Restart
          </button>
        </div>
      </div>

      {/* Divider */}
      <div className="border-border-muted mb-4 border-t" />

      {/* Header */}
      <div className="mb-4">
        <p className="text-foreground text-sm font-semibold">Record roll</p>

        <p className="text-muted mt-1 text-xs">
          Select the number of pins knocked down.
        </p>
      </div>

      {/* Mode */}
      <div className="border-border bg-surface-muted mb-4 flex rounded-xl border p-1">
        <button
          type="button"
          onClick={() => setMode("basic")}
          className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
            mode === "basic"
              ? "bg-surface text-foreground shadow-sm"
              : "text-muted hover:text-foreground"
          }`}
        >
          Basic
        </button>

        <button
          type="button"
          onClick={() => setMode("advanced")}
          className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
            mode === "advanced"
              ? "bg-surface text-foreground shadow-sm"
              : "text-muted hover:text-foreground"
          }`}
        >
          Advanced
        </button>
      </div>

      {/* Roll controls */}
      {mode === "basic" ? (
        <div className="grid grid-cols-3 gap-2">
          {Array.from({ length: 11 }, (_, pins) => {
            const isStrike = pins === 10;

            const disabled =
              !canRoll || pins > maxPins || (isStrike && maxPins !== 10);

            return (
              <button
                key={pins}
                type="button"
                disabled={disabled}
                onClick={() => handleRoll(pins)}
                className="border-border bg-surface text-foreground hover:border-accent hover:bg-accent active:bg-accent-hover disabled:border-border-muted disabled:bg-surface-muted disabled:text-muted-light flex aspect-square w-full items-center justify-center rounded-xl border text-lg font-semibold shadow-sm transition-all duration-150 hover:text-white hover:shadow-md active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
              >
                {isStrike ? "X" : pins}
              </button>
            );
          })}

          {/* Spare */}
          <button
            type="button"
            disabled={
              !canRoll || rolls.length === 0 || rolls[rolls.length - 1] === 10
            }
            onClick={() => handleRoll(maxPins)}
            className="border-accent bg-accent/5 text-accent hover:bg-accent active:bg-accent-hover disabled:border-border-muted disabled:bg-surface-muted disabled:text-muted-light flex aspect-square w-full items-center justify-center rounded-xl border text-lg font-semibold shadow-sm transition-all duration-150 hover:text-white hover:shadow-md active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
          >
            /
          </button>
        </div>
      ) : (
        <AdvancePinControl />
      )}

      {/* Keyboard hint */}
      {mode === "basic" && (
        <div className="text-muted mt-3 text-center text-xs">
          <span className="font-medium">0–9</span> pins
          <span className="mx-1.5">·</span>
          <span className="font-medium">X</span> strike
          <span className="mx-1.5">·</span>
          <span className="font-medium">/</span> spare
        </div>
      )}

      {/* Turn information */}
      <div className="border-border-muted bg-surface-muted mt-4 flex items-center justify-between rounded-xl border px-4 py-3">
        <div>
          <p className="text-muted text-xs">Current turn</p>

          <p className="text-foreground mt-0.5 text-sm font-semibold">
            Player {turn.player + 1}
          </p>
        </div>

        <div className="text-right">
          <p className="text-muted text-xs">Frame {turn.frame}</p>

          <p className="text-foreground mt-0.5 text-sm font-semibold">
            Ball {turn.ball}
          </p>
        </div>
      </div>
    </div>
  );
};

export default BowlingScoreControls;
