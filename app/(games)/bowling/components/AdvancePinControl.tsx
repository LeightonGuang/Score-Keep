"use client";

import { ALL_PINS } from "../constants";
import { useEffect, useState } from "react";
import { useBowling } from "../context/BowlingContext";

type PinMode = "up" | "down";

interface PinProps {
  pin: number;
  standing: boolean;
  available: boolean;
  onClick: () => void;
}

const Pin = ({ pin, standing, available, onClick }: PinProps) => (
  <button
    type="button"
    disabled={!available}
    onClick={onClick}
    className={`relative flex size-12 items-center justify-center rounded-full border-2 transition ${
      !available
        ? "border-border bg-surface-muted text-muted-light cursor-not-allowed opacity-40"
        : standing
          ? "border-accent text-foreground bg-white shadow-sm hover:bg-[#fff8f3]"
          : "border-border bg-surface-muted text-muted-light hover:border-accent hover:text-foreground"
    }`}
  >
    <span className="bg-accent absolute top-1 h-1.5 w-5 rounded-full" />

    <span className="mt-2 text-sm font-bold">{pin}</span>
  </button>
);

const getCurrentRack = (
  rolls: number[],
  pinStates: number[][],
  frameNumber: number,
) => {
  if (rolls.length === 0) return ALL_PINS;

  const lastRoll = rolls[rolls.length - 1];

  /*
   * Strike starts a completely new rack.
   */
  if (lastRoll === 10) return ALL_PINS;

  /*
   * A spare in the 10th frame gives
   * the player a new rack for ball 3.
   */
  if (frameNumber === 10 && rolls.length >= 2 && rolls[0] + rolls[1] === 10) {
    return ALL_PINS;
  }

  return pinStates[pinStates.length - 1] ?? ALL_PINS;
};

const AdvancePinControl = () => {
  const { players, turn, currentGame, recordRoll } = useBowling();

  const player = players[turn.player];
  const game = player?.games[currentGame];
  const frame = game?.frames[turn.frame - 1];
  const rolls = frame?.rolls ?? [];
  const pinStates = frame?.pinStates ?? [];
  const currentRack = getCurrentRack(rolls, pinStates, turn.frame);
  const [mode, setMode] = useState<PinMode>("up");

  /*
   * Pins Up:
   *
   * selectedPins = pins that are standing.
   *
   * Pins Down:
   *
   * selectedPins = pins that are knocked down.
   */
  const [selectedPins, setSelectedPins] = useState<number[]>([]);

  /*
   * Reset selected pins whenever the bowling turn changes.
   *
   * This is important because React preserves local state
   * when the component stays mounted.
   *
   * For example:
   *
   * Frame 1 -> Frame 2
   *
   * Without this effect, pins selected in Frame 1 would
   * still be selected in Frame 2.
   */
  useEffect(() => {
    setSelectedPins([]);
  }, [turn.player, turn.frame, turn.ball, currentGame]);

  /*
   * Also reset when the actual rack changes.
   *
   * This handles:
   *
   * - Strike -> new rack
   * - 10th-frame spare -> new rack
   * - Different pins remaining after a roll
   */
  useEffect(() => {
    setSelectedPins([]);
  }, [currentRack.join(",")]);

  if (!player || !game || !frame) {
    return null;
  }

  /*
   * Pins Up:
   *
   * selectedPins are the pins standing.
   *
   * Pins Down:
   *
   * selectedPins are the pins knocked down.
   */
  const standingPins =
    mode === "up"
      ? selectedPins.filter((pin) => currentRack.includes(pin))
      : currentRack.filter((pin) => !selectedPins.includes(pin));

  const pinsDown = currentRack.length - standingPins.length;

  const togglePin = (pin: number) => {
    if (!currentRack.includes(pin)) return;

    setSelectedPins((current) =>
      current.includes(pin)
        ? current.filter((value) => value !== pin)
        : [...current, pin],
    );
  };

  const resetPins = () => {
    setSelectedPins([]);
  };

  const switchMode = (nextMode: PinMode) => {
    if (nextMode === mode) return;

    setMode(nextMode);

    /*
     * Switching modes starts with a clean selection.
     */
    setSelectedPins([]);
  };

  const confirmRoll = () => {
    recordRoll(pinsDown, standingPins);
  };

  const rows = [[7, 8, 9, 10], [4, 5, 6], [2, 3], [1]];

  return (
    <div className="w-full">
      {/* Mode switcher */}
      <div className="border-border bg-surface-muted mb-4 flex overflow-hidden rounded-lg border p-1">
        <button
          type="button"
          onClick={() => switchMode("up")}
          className={`flex-1 rounded-md px-4 py-2 text-sm font-semibold transition ${
            mode === "up"
              ? "text-foreground bg-white shadow-sm"
              : "text-muted hover:text-foreground"
          }`}
        >
          Pins Up
        </button>

        <button
          type="button"
          onClick={() => switchMode("down")}
          className={`flex-1 rounded-md px-4 py-2 text-sm font-semibold transition ${
            mode === "down"
              ? "text-foreground bg-white shadow-sm"
              : "text-muted hover:text-foreground"
          }`}
        >
          Pins Down
        </button>
      </div>

      {/* Pins */}
      <div className="mb-5 flex flex-col items-center gap-2">
        {rows.map((row) => (
          <div key={row.join("-")} className="flex gap-2">
            {row.map((pin) => (
              <Pin
                key={pin}
                pin={pin}
                available={currentRack.includes(pin)}
                standing={standingPins.includes(pin)}
                onClick={() => togglePin(pin)}
              />
            ))}
          </div>
        ))}
      </div>

      {/* Roll summary */}
      <div className="bg-surface-muted mb-4 rounded-lg px-4 py-3 text-center">
        <div className="text-foreground text-sm font-semibold">
          {pinsDown} knocked down
        </div>

        <div className="text-muted mt-0.5 text-xs">
          {standingPins.length} standing
        </div>
      </div>

      {/* Confirm */}
      <button
        type="button"
        onClick={confirmRoll}
        className="bg-accent hover:bg-accent-hover h-11 w-full rounded-lg px-4 text-sm font-bold text-white transition"
      >
        Confirm Roll
      </button>

      {/* Reset */}
      <button
        type="button"
        onClick={resetPins}
        className="border-border text-muted hover:border-foreground hover:text-foreground mt-2 h-10 w-full rounded-lg border bg-white px-4 text-sm font-semibold transition"
      >
        Reset
      </button>
    </div>
  );
};

export default AdvancePinControl;
