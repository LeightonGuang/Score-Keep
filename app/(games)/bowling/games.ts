import { ALL_PINS, FRAME_COUNT } from "./constants";

import type {
  BowlingGame,
  BowlingPlayer,
  BowlingState,
  Frame,
  Turn,
} from "./types";

export function createFrames(): Frame[] {
  return Array.from({ length: FRAME_COUNT }, () => ({
    rolls: [],
    pinStates: [],
  }));
}

export function createGame(): BowlingGame {
  return {
    id: crypto.randomUUID(),
    frames: createFrames(),
  };
}

export function createPlayer(name: string): BowlingPlayer {
  return {
    id: crypto.randomUUID(),
    name: name.trim(),
    games: [createGame()],
  };
}

export function isValidPinList(pins: number[]): boolean {
  return (
    new Set(pins).size === pins.length &&
    pins.every((pin) => ALL_PINS.includes(pin))
  );
}

/**
 * Gets the pins standing at the START of the current ball.
 */
export function getCurrentRack(frame: Frame, frameNumber: number): number[] {
  if (frame.rolls.length === 0) {
    return ALL_PINS;
  }

  const lastRoll = frame.rolls[frame.rolls.length - 1];

  /*
   * Strike starts a fresh rack.
   */
  if (lastRoll === 10) {
    return ALL_PINS;
  }

  /*
   * Spare in frame 10 starts a fresh rack
   * for ball 3.
   */
  if (
    frameNumber === 10 &&
    frame.rolls.length >= 2 &&
    frame.rolls[0] + frame.rolls[1] === 10
  ) {
    return ALL_PINS;
  }

  return frame.pinStates[frame.pinStates.length - 1] ?? ALL_PINS;
}

export function recordRoll(
  state: BowlingState,
  pins: number,
  standingPins: number[],
): BowlingState {
  /*
   * Basic validation.
   */
  if (pins < 0 || pins > 10 || !Number.isInteger(pins)) {
    return state;
  }

  if (!isValidPinList(standingPins)) {
    return state;
  }

  const { players, turn, currentGame } = state;

  /*
   * Get current player.
   */
  const player = players[turn.player];

  if (!player) {
    return state;
  }

  /*
   * Get current game.
   */
  const game = player.games[currentGame];

  if (!game) {
    return state;
  }

  /*
   * Get current frame.
   */
  const frameIndex = turn.frame - 1;
  const frame = game.frames[frameIndex];

  if (!frame) {
    return state;
  }

  const rolls = frame.rolls;

  /*
   * Determine which pins were standing
   * at the beginning of this ball.
   */
  const currentRack = getCurrentRack(frame, turn.frame);

  /*
   * A pin that has already fallen cannot
   * magically come back.
   */
  const invalidPin = standingPins.some((pin) => !currentRack.includes(pin));

  if (invalidPin) {
    return state;
  }

  /*
   * Calculate how many pins were knocked down.
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
     * First ball.
     */
    if (rolls.length === 0) {
      const updatedPlayers = updateFrame(
        players,
        turn,
        currentGame,
        pins,
        standingPins,
      );

      /*
       * Strike.
       */
      if (pins === 10) {
        return {
          ...state,
          players: updatedPlayers,
          turn: getNextPlayerOrFrame(turn, players.length),
        };
      }

      /*
       * Normal first ball.
       */
      return {
        ...state,
        players: updatedPlayers,
        turn: {
          ...turn,
          ball: 2,
        },
      };
    }

    /*
     * Second ball.
     */
    const updatedPlayers = updateFrame(
      players,
      turn,
      currentGame,
      pins,
      standingPins,
    );

    return {
      ...state,
      players: updatedPlayers,
      turn: getNextPlayerOrFrame(turn, players.length),
    };
  }

  // ==========================================
  // FRAME 10
  // ==========================================

  /*
   * Ball 1.
   */
  if (rolls.length === 0) {
    const updatedPlayers = updateFrame(
      players,
      turn,
      currentGame,
      pins,
      standingPins,
    );

    return {
      ...state,
      players: updatedPlayers,
      turn: {
        ...turn,
        ball: 2,
      },
    };
  }

  /*
   * Ball 2.
   */
  if (rolls.length === 1) {
    const first = rolls[0];

    const updatedPlayers = updateFrame(
      players,
      turn,
      currentGame,
      pins,
      standingPins,
    );

    /*
     * Third ball is awarded after:
     *
     * X
     *
     * or
     *
     * spare
     */
    const hasBonus = first === 10 || first + pins === 10;

    if (hasBonus) {
      return {
        ...state,
        players: updatedPlayers,
        turn: {
          ...turn,
          ball: 3,
        },
      };
    }

    /*
     * Open tenth frame.
     */
    return {
      ...state,
      players: updatedPlayers,
      turn: getNextPlayerOrFrame(turn, players.length),
    };
  }

  /*
   * Ball 3.
   */
  if (rolls.length === 2) {
    const [first, second] = rolls;

    const hasBonus = first === 10 || first + second === 10;

    /*
     * There should not be a third ball
     * unless there was a strike or spare.
     */
    if (!hasBonus) {
      return state;
    }

    const updatedPlayers = updateFrame(
      players,
      turn,
      currentGame,
      pins,
      standingPins,
    );

    return {
      ...state,
      players: updatedPlayers,
      turn: getNextPlayerOrFrame(turn, players.length),
    };
  }

  return state;
}

export function updateFrame(
  players: BowlingPlayer[],
  turn: Turn,
  currentGame: number,
  pins: number,
  standingPins: number[],
): BowlingPlayer[] {
  return players.map((player, playerIndex) => {
    if (playerIndex !== turn.player) {
      return player;
    }

    return {
      ...player,

      games: player.games.map((game, gameIndex) => {
        if (gameIndex !== currentGame) {
          return game;
        }

        return {
          ...game,

          frames: game.frames.map((frame, frameIndex) => {
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
      }),
    };
  });
}

export function getNextPlayerOrFrame(turn: Turn, playerCount: number): Turn {
  /*
   * Next player.
   */
  if (turn.player < playerCount - 1) {
    return {
      frame: turn.frame,
      player: turn.player + 1,
      ball: 1,
    };
  }

  /*
   * Next frame.
   */
  if (turn.frame < FRAME_COUNT) {
    return {
      frame: turn.frame + 1,
      player: 0,
      ball: 1,
    };
  }

  /*
   * Game is complete.
   */
  return turn;
}

export const isSplitRack = (standingPins: number[]): boolean => {
  if (standingPins.length < 2) {
    return false;
  }

  // Head pin must be down.
  if (standingPins.includes(1)) {
    return false;
  }

  const pins = new Set(standingPins);

  /*
   * Classic 7-10 split.
   */
  if (pins.has(7) && pins.has(10)) {
    return true;
  }

  /*
   * Physical rows from left to right.
   *
   * We use these to determine whether there is
   * a gap between standing pins.
   */
  const rows = [
    [7, 8, 9, 10],
    [4, 5, 6],
    [2, 3],
  ];

  /*
   * Check each row for a gap.
   *
   * Example:
   *
   * 7, 9
   *
   * has 8 missing between them -> split.
   *
   * 7, 8
   *
   * has no gap -> not a split by itself.
   */
  for (const row of rows) {
    const indexes = row
      .map((pin, index) => (pins.has(pin) ? index : -1))
      .filter((index) => index !== -1);

    if (indexes.length >= 2) {
      for (let i = 1; i < indexes.length; i++) {
        if (indexes[i] - indexes[i - 1] > 1) {
          return true;
        }
      }
    }
  }

  /*
   * Check separation between different rows.
   *
   * These are common split combinations:
   *
   * 4-6
   * 5-7
   * 6-8
   * 2-4
   * 3-5
   * etc.
   *
   * We model the actual horizontal positions of the pins.
   */
  const positions: Record<number, number> = {
    7: 0,
    8: 1,
    9: 2,
    10: 3,

    4: 0.5,
    5: 1.5,
    6: 2.5,

    2: 1,
    3: 2,

    1: 1.5,
  };

  const remaining = standingPins
    .filter((pin) => pin !== 1)
    .sort((a, b) => positions[a] - positions[b]);

  /*
   * A gap of more than one pin position between
   * standing pins indicates separation.
   */
  for (let i = 1; i < remaining.length; i++) {
    const previous = positions[remaining[i - 1]];
    const current = positions[remaining[i]];

    if (current - previous >= 1.5) {
      return true;
    }
  }

  return false;
};
