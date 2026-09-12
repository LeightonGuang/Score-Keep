"use client";

import {
  useState,
  useEffect,
  useContext,
  useReducer,
  createContext,
  type ReactNode,
} from "react";
import { recordRoll } from "../games";

import type {
  Frame,
  BowlingGame,
  BowlingState,
  BowlingAction,
  BowlingPlayer,
} from "../types";

export const ALL_PINS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

export const MAX_PLAYERS = 6;
export const FRAME_COUNT = 10;

const STORAGE_KEY = "bowling-score-state";

interface BowlingContextValue extends BowlingState {
  addPlayer: (name: string) => void;
  removePlayer: (id: string) => void;
  setPlayers: (players: BowlingPlayer[]) => void;
  clearPlayers: () => void;
  newGame: () => void;
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

/*
 * Validate the stored structure properly.
 *
 * This is especially important because you previously
 * had players.frames and now have players.games.
 */
function isValidFrame(value: unknown): value is Frame {
  if (!value || typeof value !== "object") {
    return false;
  }

  const frame = value as Frame;

  return (
    Array.isArray(frame.rolls) &&
    Array.isArray(frame.pinStates) &&
    frame.rolls.every(
      (roll) => typeof roll === "number" && Number.isInteger(roll),
    ) &&
    frame.pinStates.every(
      (pins) =>
        Array.isArray(pins) &&
        pins.every((pin) => typeof pin === "number" && Number.isInteger(pin)),
    )
  );
}

function isValidGame(value: unknown): value is BowlingGame {
  if (!value || typeof value !== "object") {
    return false;
  }

  const game = value as BowlingGame;

  return (
    typeof game.id === "string" &&
    Array.isArray(game.frames) &&
    game.frames.length === FRAME_COUNT &&
    game.frames.every(isValidFrame)
  );
}

function isValidPlayer(value: unknown): value is BowlingPlayer {
  if (!value || typeof value !== "object") {
    return false;
  }

  const player = value as BowlingPlayer;

  return (
    typeof player.id === "string" &&
    typeof player.name === "string" &&
    Array.isArray(player.games) &&
    player.games.length > 0 &&
    player.games.every(isValidGame)
  );
}

function isValidState(value: unknown): value is BowlingState {
  if (!value || typeof value !== "object") {
    return false;
  }

  const state = value as BowlingState;

  if (!Array.isArray(state.players)) {
    return false;
  }

  if (state.players.length > MAX_PLAYERS) {
    return false;
  }

  if (!state.players.every(isValidPlayer)) {
    return false;
  }

  if (!Number.isInteger(state.currentGame) || state.currentGame < 0) {
    return false;
  }

  if (
    state.players.length > 0 &&
    !state.players.every(
      (player) => player.games[state.currentGame] !== undefined,
    )
  ) {
    return false;
  }

  if (!state.turn || typeof state.turn !== "object") {
    return false;
  }

  if (
    !Number.isInteger(state.turn.frame) ||
    state.turn.frame < 1 ||
    state.turn.frame > FRAME_COUNT
  ) {
    return false;
  }

  if (
    !Number.isInteger(state.turn.player) ||
    state.turn.player < 0 ||
    (state.players.length > 0 && state.turn.player >= state.players.length)
  ) {
    return false;
  }

  if (![1, 2, 3].includes(state.turn.ball)) {
    return false;
  }

  return true;
}

function loadState(): BowlingState {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);

    if (!stored) {
      return initialState;
    }

    const parsed: unknown = JSON.parse(stored);

    if (!isValidState(parsed)) {
      console.warn("Invalid or outdated bowling state. Starting a new game.");

      window.localStorage.removeItem(STORAGE_KEY);

      return initialState;
    }

    return parsed;
  } catch (error) {
    console.error("Failed to load bowling state:", error);

    return initialState;
  }
}

function saveState(state: BowlingState) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error("Failed to save bowling state:", error);
  }
}

function reducer(state: BowlingState, action: BowlingAction): BowlingState {
  switch (action.type) {
    /*
     * IMPORTANT:
     * Restore the ENTIRE state.
     */
    case "HYDRATE":
      return action.state;

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

      const exists = state.players.every(
        (player) => player.games[action.gameIndex] !== undefined,
      );

      if (!exists) {
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

  /*
   * This prevents the initial empty state from being
   * written over the saved game.
   */
  const [hydrated, setHydrated] = useState(false);

  /*
   * LOAD
   */
  useEffect(() => {
    const savedState = loadState();

    dispatch({
      type: "HYDRATE",
      state: savedState,
    });

    setHydrated(true);
  }, []);

  /*
   * SAVE
   *
   * Do NOT save until hydration has completed.
   */
  useEffect(() => {
    if (!hydrated) {
      return;
    }

    saveState(state);
  }, [state, hydrated]);

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
