import { useBowling } from "../context/BowlingContext";

const BowlingScoreControls = () => {
  const { players, turn, recordRoll } = useBowling();

  if (players.length === 0) {
    return null;
  }

  const currentPlayer = players[turn.player];
  const currentFrame = currentPlayer?.frames[turn.frame - 1];
  const rolls = currentFrame?.rolls ?? [];

  /**
   * Returns the maximum number of pins that can
   * legally be knocked down on the current ball.
   */
  const getMaxPins = (): number => {
    // ------------------------------------------
    // Frames 1-9
    // ------------------------------------------

    if (turn.frame < 10) {
      // First ball
      if (rolls.length === 0) {
        return 10;
      }

      // Second ball
      if (rolls.length === 1) {
        return 10 - rolls[0];
      }

      return 0;
    }

    // ------------------------------------------
    // Frame 10
    // ------------------------------------------

    // First ball
    if (rolls.length === 0) {
      return 10;
    }

    // Second ball
    if (rolls.length === 1) {
      // First ball was a strike.
      // A completely new rack is available.
      if (rolls[0] === 10) {
        return 10;
      }

      // Otherwise, the second ball uses
      // the pins remaining from the first ball.
      return 10 - rolls[0];
    }

    // Third ball
    if (rolls.length === 2) {
      const [first, second] = rolls;

      // Strike + strike:
      // a completely new rack.
      if (first === 10 && second === 10) {
        return 10;
      }

      // Strike + something:
      // third ball uses the remaining pins.
      if (first === 10) {
        return 10 - second;
      }

      // Spare:
      // a completely new rack.
      if (first + second === 10) {
        return 10;
      }

      // No third ball after an open frame.
      return -1;
    }

    return -1;
  };

  const maxPins = getMaxPins();

  const canRoll = maxPins >= 0;

  return (
    <div className="w-max rounded-xl bg-zinc-600/50 p-4">
      <div className="grid grid-cols-3 grid-rows-4">
        {Array.from({ length: 11 }, (_, pins) => {
          const isStrike = pins === 10;

          const disabled = !canRoll || pins > maxPins;

          return (
            <button
              key={pins}
              type="button"
              disabled={disabled}
              onClick={() => recordRoll(pins)}
              className="size-16 border transition-all hover:bg-black hover:text-white active:bg-white active:text-black disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-inherit"
            >
              {isStrike ? "X" : pins}
            </button>
          );
        })}
      </div>

      <div className="mt-4 text-center text-white">
        Frame {turn.frame} · Player {turn.player + 1} · Ball {turn.ball}
      </div>
    </div>
  );
};

export default BowlingScoreControls;
