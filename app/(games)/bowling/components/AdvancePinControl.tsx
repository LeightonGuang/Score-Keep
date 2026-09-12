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
    <span className="bg-accent absolute top-1 h-1.5 w-5 rounded-full" />

    <span className="mt-2 text-sm font-bold">{pin}</span>
  </button>
);

const getCurrentRack = (
  rolls: number[],
  pinStates: number[][],
  frameNumber: number,
) => {
  /*
   * First ball starts with all pins.
   */
  if (rolls.length === 0) {
    return ALL_PINS;
  }

  const lastRoll = rolls[rolls.length - 1];

  /*
   * Strike starts a new rack.
   */
  if (lastRoll === 10) {
    return ALL_PINS;
  }

  /*
   * A spare in frame 10 starts a new rack
   * for ball 3.
   */
  if (frameNumber === 10 && rolls.length >= 2 && rolls[0] + rolls[1] === 10) {
    return ALL_PINS;
  }

  /*
   * Otherwise use the pins left standing after
   * the previous ball.
   */
  return pinStates[pinStates.length - 1] ?? ALL_PINS;
};

const AdvancePinControl = () => {
  const { players, turn, currentGame, recordRoll } = useBowling();

  const player = players[turn.player];

  /*
   * Player
   *   -> current game
   *      -> current frame
   */
  const game = player?.games[currentGame];

  const frame = game?.frames[turn.frame - 1];

  const rolls = frame?.rolls ?? [];
  const pinStates = frame?.pinStates ?? [];

  const currentRack = getCurrentRack(rolls, pinStates, turn.frame);

  /*
   * Pins Up:
   *
   * selectedPins = pins that are standing.
   *
   * Pins Down:
   *
   * selectedPins = pins that have been knocked down.
   */
  const [mode, setMode] = useState<PinMode>("up");

  const [selectedPins, setSelectedPins] = useState<number[]>(ALL_PINS);

  if (!player || !game || !frame) {
    return null;
  }

  /*
   * Only pins in the current rack can be
   * selected.
   *
   * Pins Up:
   *   selected = standing
   *
   * Pins Down:
   *   selected = knocked down
   */
  const standingPins =
    mode === "up"
      ? selectedPins.filter((pin) => currentRack.includes(pin))
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
    /*
     * In Pins Up mode, reset means:
     * all available pins are standing.
     */
    if (mode === "up") {
      setSelectedPins([...currentRack]);
      return;
    }

    /*
     * In Pins Down mode, reset means:
     * no pins are knocked down.
     */
    setSelectedPins([]);
  };

  const switchMode = (nextMode: PinMode) => {
    if (nextMode === mode) {
      return;
    }

    setMode(nextMode);

    /*
     * Make the initial state intuitive for
     * whichever mode we're entering.
     */
    if (nextMode === "up") {
      setSelectedPins([...currentRack]);
    } else {
      setSelectedPins([]);
    }
  };

  const confirmRoll = () => {
    recordRoll(pinsDown, standingPins);

    /*
     * Don't manually reset here.
     *
     * The current frame/game will change after
     * recordRoll(), and the component will render
     * from the new state.
     */
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
