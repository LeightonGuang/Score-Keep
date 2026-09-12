import { ALL_PINS } from "./constants";

import type { BowlingPlayer, BowlingState, Frame, Turn } from "./types";

export function getCurrentRack(frame: Frame, frameNumber: number): number[] {
  if (frame.rolls.length === 0) return ALL_PINS;

  const lastRoll = frame.rolls[frame.rolls.length - 1];

  // Strike starts a completely new rack.
  if (lastRoll === 10) return ALL_PINS;

  // In frame 10, a spare gives a new rack.
  if (
    frameNumber === 10 &&
    frame.rolls.length >= 2 &&
    frame.rolls[0] + frame.rolls[1] === 10
  ) {
    return ALL_PINS;
  }

  return frame.pinStates[frame.pinStates.length - 1] ?? ALL_PINS;
}

export function isValidPinList(pins: number[]) {
  return (
    new Set(pins).size === pins.length &&
    pins.every((pin) => ALL_PINS.includes(pin))
  );
}

export function recordRoll(
  state: BowlingState,
  pins: number,
  standingPins: number[],
): BowlingState {
  if (pins < 0 || pins > 10 || !Number.isInteger(pins)) return state;

  if (!isValidPinList(standingPins)) return state;

  const { players, turn } = state;

  const player = players[turn.player];

  if (!player) return state;

  const frameIndex = turn.frame - 1;

  const frame = player.frames[frameIndex];

  if (!frame) return state;

  const rolls = frame.rolls;

  /*
   * Determine which pins existed at the beginning
   * of this ball.
   */
  const currentRack = getCurrentRack(frame, turn.frame);

  /*
   * You cannot magically bring back a pin that was
   * already knocked down on this rack.
   */
  const invalidPin = standingPins.some((pin) => !currentRack.includes(pin));

  if (invalidPin) return state;

  /*
   * Number of pins knocked down is based on the
   * current rack, NOT always 10.
   *
   * Example:
   *
   * Ball 1:
   * 10 pins -> knock down 3
   *
   * Ball 2:
   * 7 pins remain -> knock down 2
   *
   * 7 - 5 = 2
   */
  const knockedDown = currentRack.length - standingPins.length;

  if (knockedDown !== pins) {
    return state;
  }

  // ==========================================
  // FRAMES 1-9
  // ==========================================

  if (turn.frame < 10) {
    /*
     * First ball
     */
    if (rolls.length === 0) {
      const updatedPlayers = updateFrame(players, turn, pins, standingPins);

      /*
       * Strike.
       */
      if (pins === 10) {
        return {
          players: updatedPlayers,
          turn: getNextPlayerOrFrame(turn, players.length),
        };
      }

      /*
       * Normal first ball.
       */
      return {
        players: updatedPlayers,
        turn: {
          ...turn,
          ball: 2,
        },
      };
    }

    /*
     * Second ball.
     *
     * The current rack already guarantees that
     * the second ball cannot knock down more pins
     * than remain.
     */
    const updatedPlayers = updateFrame(players, turn, pins, standingPins);

    return {
      players: updatedPlayers,
      turn: getNextPlayerOrFrame(turn, players.length),
    };
  }

  // ==========================================
  // FRAME 10
  // ==========================================

  /*
   * Ball 1
   */
  if (rolls.length === 0) {
    const updatedPlayers = updateFrame(players, turn, pins, standingPins);

    return {
      players: updatedPlayers,
      turn: {
        ...turn,
        ball: 2,
      },
    };
  }

  /*
   * Ball 2
   */
  if (rolls.length === 1) {
    const first = rolls[0];

    /*
     * If first ball wasn't a strike, this is the
     * same rack, so the rack validation above already
     * prevents knocking down too many pins.
     */
    const updatedPlayers = updateFrame(players, turn, pins, standingPins);

    /*
     * Bonus ball if:
     *
     * X
     * or
     * spare
     */
    const hasBonus = first === 10 || first + pins === 10;

    if (hasBonus) {
      return {
        players: updatedPlayers,
        turn: {
          ...turn,
          ball: 3,
        },
      };
    }

    /*
     * Open frame. Move on.
     */
    return {
      players: updatedPlayers,
      turn: getNextPlayerOrFrame(turn, players.length),
    };
  }

  /*
   * Ball 3
   */
  if (rolls.length === 2) {
    const [first, second] = rolls;

    const hasBonus = first === 10 || first + second === 10;

    /*
     * There should not be a third ball unless
     * there was a strike or spare.
     */
    if (!hasBonus) {
      return state;
    }

    /*
     * For X + X the third ball gets a fresh rack.
     *
     * For X + something, the third ball uses the
     * remaining pins from ball 2.
     *
     * The currentRack calculation handles this.
     */
    const updatedPlayers = updateFrame(players, turn, pins, standingPins);

    return {
      players: updatedPlayers,
      turn: getNextPlayerOrFrame(turn, players.length),
    };
  }

  return state;
}

export function updateFrame(
  players: BowlingPlayer[],
  turn: Turn,
  pins: number,
  standingPins: number[],
): BowlingPlayer[] {
  return players.map((player, playerIndex) => {
    if (playerIndex !== turn.player) return player;

    return {
      ...player,
      frames: player.frames.map((frame, frameIndex) => {
        if (frameIndex !== turn.frame - 1) {
          return frame;
        }

        return {
          ...frame,
          rolls: [...frame.rolls, pins],
          pinStates: [...frame.pinStates, standingPins],
        };
      }),
    };
  });
}

export function getNextPlayerOrFrame(turn: Turn, playerCount: number): Turn {
  if (turn.player < playerCount - 1)
    return { frame: turn.frame, player: turn.player + 1, ball: 1 };

  if (turn.frame < 10) return { frame: turn.frame + 1, player: 0, ball: 1 };

  return turn;
}
