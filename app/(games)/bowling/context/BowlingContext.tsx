"use client";

import { createContext, useContext, useReducer, type ReactNode } from "react";

export const ALL_PINS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

export interface Frame {
  rolls: number[];

  // Pins remaining after each ball.
  //
  // Example:
  // ball 1: [2, 3, 4, 5, 6, 7, 8]
  // ball 2: [5, 6, 7, 8]
  //
  // This lets Advanced mode remember exactly
  // which pins were standing.
  pinStates: number[][];
}

export interface BowlingPlayer {
  id: string;
  name: string;
  frames: Frame[];
}

export interface Turn {
  frame: number;
  player: number;
  ball: 1 | 2 | 3;
}

interface BowlingState {
  players: BowlingPlayer[];
  turn: Turn;
}

type BowlingAction =
  | {
      type: "ADD_PLAYER";
      name: string;
    }
  | {
      type: "REMOVE_PLAYER";
      id: string;
    }
  | {
      type: "CLEAR_PLAYERS";
    }
  | {
      type: "SET_PLAYERS";
      players: BowlingPlayer[];
    }
  | {
      type: "RECORD_ROLL";
      pins: number;
      standingPins: number[];
    };

interface BowlingContextValue extends BowlingState {
  addPlayer: (name: string) => void;
  removePlayer: (id: string) => void;
  setPlayers: (players: BowlingPlayer[]) => void;
  clearPlayers: () => void;
  recordRoll: (pins: number, standingPins: number[]) => void;
}

interface BowlingProviderProps {
  children: ReactNode;
}

const createFrames = (): Frame[] =>
  Array.from({ length: 10 }, () => ({
    rolls: [],
    pinStates: [],
  }));

const initialState: BowlingState = {
  players: [],
  turn: {
    frame: 1,
    player: 0,
    ball: 1,
  },
};

function createPlayer(name: string): BowlingPlayer {
  return {
    id: crypto.randomUUID(),
    name: name.trim(),
    frames: createFrames(),
  };
}

function isValidPinList(pins: number[]) {
  return (
    new Set(pins).size === pins.length &&
    pins.every((pin) => ALL_PINS.includes(pin))
  );
}

/**
 * Gets the rack that exists at the START of the
 * current ball.
 */
function getCurrentRack(frame: Frame, frameNumber: number): number[] {
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

function reducer(state: BowlingState, action: BowlingAction): BowlingState {
  switch (action.type) {
    case "ADD_PLAYER": {
      const name = action.name.trim();

      if (!name || state.players.length >= 6) return state;

      return {
        ...state,
        players: [...state.players, createPlayer(name)],
      };
    }

    case "REMOVE_PLAYER": {
      const players = state.players.filter((player) => player.id !== action.id);

      let turn = state.turn;

      if (turn.player >= players.length) {
        turn = {
          ...turn,
          player: Math.max(players.length - 1, 0),
        };
      }

      return {
        ...state,
        players,
        turn,
      };
    }

    case "SET_PLAYERS":
      return {
        ...state,
        players: action.players,
      };

    case "CLEAR_PLAYERS":
      return initialState;

    case "RECORD_ROLL":
      return recordRoll(state, action.pins, action.standingPins);

    default:
      return state;
  }
}

function recordRoll(
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

function updateFrame(
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

function getNextPlayerOrFrame(turn: Turn, playerCount: number): Turn {
  if (turn.player < playerCount - 1)
    return { frame: turn.frame, player: turn.player + 1, ball: 1 };

  if (turn.frame < 10) return { frame: turn.frame + 1, player: 0, ball: 1 };

  return turn;
}

const BowlingContext = createContext<BowlingContextValue | null>(null);

export const BowlingProvider = ({ children }: BowlingProviderProps) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const value: BowlingContextValue = {
    players: state.players,
    turn: state.turn,

    addPlayer: (name) =>
      dispatch({
        type: "ADD_PLAYER",
        name,
      }),

    removePlayer: (id) =>
      dispatch({
        type: "REMOVE_PLAYER",
        id,
      }),

    setPlayers: (players) =>
      dispatch({
        type: "SET_PLAYERS",
        players,
      }),

    clearPlayers: () =>
      dispatch({
        type: "CLEAR_PLAYERS",
      }),

    recordRoll: (pins, standingPins) =>
      dispatch({
        type: "RECORD_ROLL",
        pins,
        standingPins,
      }),
  };

  return (
    <BowlingContext.Provider value={value}>{children}</BowlingContext.Provider>
  );
};

export const useBowling = () => {
  const context = useContext(BowlingContext);

  if (!context)
    throw new Error("useBowling must be used within a BowlingProvider");

  return context;
};
