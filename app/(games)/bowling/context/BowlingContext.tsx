"use client";

import { recordRoll } from "../games";
import { createContext, useContext, useReducer, type ReactNode } from "react";

export const ALL_PINS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

export const MAX_PLAYERS = 6;
export const FRAME_COUNT = 10;

export interface Frame {
  rolls: number[];

  // Pins remaining after each ball.
  //
  // Example:
  // ball 1: [2, 3, 4, 5, 6, 7, 8]
  // ball 2: [5, 6, 7, 8]
  pinStates: number[][];
}

export interface BowlingGame {
  id: string;
  frames: Frame[];
}

export interface BowlingPlayer {
  id: string;
  name: string;
  games: BowlingGame[];
}

export interface Turn {
  frame: number;
  player: number;
  ball: 1 | 2 | 3;
}

interface BowlingState {
  players: BowlingPlayer[];

  /**
   * Zero-based index of the currently active game.
   *
   * 0 = Game 1
   * 1 = Game 2
   * 2 = Game 3
   */
  currentGame: number;

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
      type: "NEW_GAME";
    }
  | {
      type: "SET_GAME";
      gameIndex: number;
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

  /**
   * Creates a new game for all players.
   */
  newGame: () => void;

  /**
   * Switches to an existing game.
   */
  setGame: (gameIndex: number) => void;

  recordRoll: (pins: number, standingPins: number[]) => void;
}

interface BowlingProviderProps {
  children: ReactNode;
}

const createFrames = (): Frame[] =>
  Array.from({ length: FRAME_COUNT }, () => ({
    rolls: [],
    pinStates: [],
  }));

const createGame = (): BowlingGame => ({
  id: crypto.randomUUID(),
  frames: createFrames(),
});

const createPlayer = (name: string): BowlingPlayer => ({
  id: crypto.randomUUID(),
  name: name.trim(),
  games: [createGame()],
});

const initialState: BowlingState = {
  players: [],
  currentGame: 0,
  turn: {
    frame: 1,
    player: 0,
    ball: 1,
  },
};

function reducer(state: BowlingState, action: BowlingAction): BowlingState {
  switch (action.type) {
    case "ADD_PLAYER": {
      const name = action.name.trim();

      if (!name || state.players.length >= MAX_PLAYERS) {
        return state;
      }

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

    case "NEW_GAME": {
      if (state.players.length === 0) {
        return state;
      }

      const players = state.players.map((player) => ({
        ...player,
        games: [...player.games, createGame()],
      }));

      return {
        ...state,
        players,
        currentGame: state.currentGame + 1,
        turn: {
          frame: 1,
          player: 0,
          ball: 1,
        },
      };
    }

    case "SET_GAME": {
      if (action.gameIndex < 0) {
        return state;
      }

      /*
       * Every player must have this game.
       */
      const gameExistsForEveryPlayer = state.players.every(
        (player) => player.games[action.gameIndex] !== undefined,
      );

      if (!gameExistsForEveryPlayer) {
        return state;
      }

      return {
        ...state,
        currentGame: action.gameIndex,
        turn: {
          frame: 1,
          player: 0,
          ball: 1,
        },
      };
    }

    case "RECORD_ROLL":
      return recordRoll(state, action.pins, action.standingPins);

    default:
      return state;
  }
}

const BowlingContext = createContext<BowlingContextValue | null>(null);

export const BowlingProvider = ({ children }: BowlingProviderProps) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const value: BowlingContextValue = {
    players: state.players,
    currentGame: state.currentGame,
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

    newGame: () =>
      dispatch({
        type: "NEW_GAME",
      }),

    setGame: (gameIndex) =>
      dispatch({
        type: "SET_GAME",
        gameIndex,
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

  if (!context) {
    throw new Error("useBowling must be used within a BowlingProvider");
  }

  return context;
};
