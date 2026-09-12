"use client";

import { useState } from "react";
import { useBowling } from "../context/BowlingContext";
import { ALL_PINS } from "../constants";

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
    <span className="absolute top-1 h-1.5 w-5 rounded-full bg-red-500" />

    <span className="mt-2 text-sm font-bold">{pin}</span>
  </button>
);

const getCurrentRack = (
  rolls: number[],
  pinStates: number[][],
  frameNumber: number,
) => {
  if (rolls.length === 0) {
    return ALL_PINS;
  }

  const lastRoll = rolls[rolls.length - 1];

  // Strike starts a completely new rack.
  if (lastRoll === 10) {
    return ALL_PINS;
  }

  // Spare in the tenth frame starts a new rack.
  if (frameNumber === 10 && rolls.length >= 2 && rolls[0] + rolls[1] === 10) {
    return ALL_PINS;
  }

  // Otherwise use the pins left standing from the previous roll.
  return pinStates[pinStates.length - 1] ?? ALL_PINS;
};

const AdvancePinControl = () => {
  const { players, turn, recordRoll } = useBowling();

  const player = players[turn.player];
  const frame = player?.frames[turn.frame - 1];

  const rolls = frame?.rolls ?? [];
  const pinStates = frame?.pinStates ?? [];

  const currentRack = getCurrentRack(rolls, pinStates, turn.frame);

  const [mode, setMode] = useState<PinMode>("up");
  const [selectedPins, setSelectedPins] = useState<number[]>([]);

  if (!player || !frame) {
    return null;
  }

  /*
   * Pins Up:
   *
   * Nothing is selected by default.
   * Clicking a pin means:
   * "this pin is still standing".
   *
   * Pins Down:
   *
   * Nothing is selected by default.
   * Clicking a pin means:
   * "this pin has been knocked down".
   */
  const standingPins =
    mode === "up"
      ? selectedPins
      : currentRack.filter((pin) => !selectedPins.includes(pin));

  const pinsDown = currentRack.length - standingPins.length;

  const togglePin = (pin: number) => {
    if (!currentRack.includes(pin)) {
      return;
    }

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
    if (nextMode === mode) {
      return;
    }

    setMode(nextMode);
    setSelectedPins([]);
  };

  const confirmRoll = () => {
    if (mode === "up") {
      recordRoll(pinsDown, standingPins);
      return;
    }

    recordRoll(pinsDown, standingPins);
  };

  const rows = [[7, 8, 9, 10], [4, 5, 6], [2, 3], [1]];

  return (
    <div className="w-full">
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

      <div className="bg-surface-muted mb-4 rounded-lg px-4 py-3 text-center">
        <div className="text-foreground text-sm font-semibold">
          {pinsDown} knocked down
        </div>

        <div className="text-muted mt-0.5 text-xs">
          {standingPins.length} standing
        </div>
      </div>

      <button
        type="button"
        onClick={confirmRoll}
        className="bg-accent hover:bg-accent-hover h-11 w-full rounded-lg px-4 text-sm font-bold text-white transition"
      >
        Confirm Roll
      </button>

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
