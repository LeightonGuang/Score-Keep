"use client";

import { recordRoll } from "../games";
import { createContext, useContext, useReducer, type ReactNode } from "react";


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

/**
 * Gets the rack that exists at the START of the
 * current ball.
 */

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
