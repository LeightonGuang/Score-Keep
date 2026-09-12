"use client";

import { useEffect, useState } from "react";
import { useBowling } from "../context/BowlingContext";

const ALL_PINS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

interface PinProps {
  pin: number;
  standing: boolean;
  onClick: () => void;
}

const Pin = ({ pin, standing, onClick }: PinProps) => (
  <button
    type="button"
    onClick={onClick}
    className={`relative flex size-12 items-center justify-center rounded-full border-2 transition-all ${
      standing
        ? "border-white bg-white text-black hover:bg-zinc-300"
        : "border-zinc-500 bg-zinc-800 text-zinc-500"
    }`}
  >
    <span className="absolute top-1 h-1.5 w-5 rounded-full bg-red-500" />
    <span className="mt-2 text-sm font-bold">{pin}</span>
  </button>
);

const getCurrentStandingPins = (rolls: number[], pinStates: number[][]) => {
  if (rolls.length === 0) return ALL_PINS;

  const lastRoll = rolls[rolls.length - 1];

  // Strike starts a new rack.
  if (lastRoll === 10) return ALL_PINS;

  // Spare in the 10th starts a new rack.
  if (rolls.length >= 2 && rolls[0] + rolls[1] === 10) {
    return ALL_PINS;
  }

  return pinStates[pinStates.length - 1] ?? ALL_PINS;
};

const AdvancePinControl = () => {
  const { players, turn, recordRoll } = useBowling();

  const player = players[turn.player];
  const frame = player?.frames[turn.frame - 1];

  const rolls = frame?.rolls ?? [];
  const pinStates = frame?.pinStates ?? [];

  const initialStandingPins = getCurrentStandingPins(rolls, pinStates);

  const [standingPins, setStandingPins] = useState(initialStandingPins);

  useEffect(() => {
    setStandingPins(initialStandingPins);
  }, [turn.frame, turn.player, turn.ball, rolls.length, pinStates.length]);

  if (!player || !frame) return null;

  const pinsKnockedDown = initialStandingPins.length - standingPins.length;

  const canConfirm =
    standingPins.every((pin) => initialStandingPins.includes(pin)) &&
    pinsKnockedDown >= 0 &&
    pinsKnockedDown <= initialStandingPins.length;

  const togglePin = (pin: number) => {
    if (!initialStandingPins.includes(pin)) return;

    setStandingPins((current) =>
      current.includes(pin)
        ? current.filter((value) => value !== pin)
        : [...current, pin],
    );
  };

  const resetPins = () => {
    setStandingPins(initialStandingPins);
  };

  const confirmRoll = () => {
    if (!canConfirm) return;

    recordRoll(pinsKnockedDown, standingPins);
  };

  return (
    <div>
      <div className="mb-4 flex flex-col items-center gap-2">
        {/* Back row */}
        <div className="flex gap-2">
          {[7, 8, 9, 10].map((pin) => (
            <Pin
              key={pin}
              pin={pin}
              standing={standingPins.includes(pin)}
              onClick={() => togglePin(pin)}
            />
          ))}
        </div>

        {/* Row 2 */}
        <div className="flex gap-2">
          {[4, 5, 6].map((pin) => (
            <Pin
              key={pin}
              pin={pin}
              standing={standingPins.includes(pin)}
              onClick={() => togglePin(pin)}
            />
          ))}
        </div>

        {/* Row 3 */}
        <div className="flex gap-2">
          {[2, 3].map((pin) => (
            <Pin
              key={pin}
              pin={pin}
              standing={standingPins.includes(pin)}
              onClick={() => togglePin(pin)}
            />
          ))}
        </div>

        {/* Head pin */}
        <Pin
          pin={1}
          standing={standingPins.includes(1)}
          onClick={() => togglePin(1)}
        />
      </div>

      <div className="mb-3 text-center text-white">
        {pinsKnockedDown} pins knocked down
      </div>

      <button
        type="button"
        disabled={!canConfirm}
        onClick={confirmRoll}
        className="w-full rounded bg-white px-4 py-2 font-semibold text-black disabled:cursor-not-allowed disabled:opacity-30"
      >
        Confirm
      </button>

      <button
        type="button"
        onClick={resetPins}
        className="mt-2 w-full rounded border px-4 py-2 text-white"
      >
        Reset
      </button>
    </div>
  );
};

export default AdvancePinControl;
