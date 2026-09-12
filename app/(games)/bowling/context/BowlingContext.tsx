"use client";

import { createContext, useContext, useReducer, type ReactNode } from "react";

export interface Frame {
  rolls: number[];
}

export interface BowlingPlayer {
  id: string;
  name: string;
  frames: Frame[];
}

export interface Turn {
  frame: number;
  player: number;
  ball: number;
}

interface BowlingState {
  players: BowlingPlayer[];
  turn: Turn;
}

type BowlingAction =
  | { type: "ADD_PLAYER"; name: string }
  | { type: "REMOVE_PLAYER"; id: string }
  | { type: "CLEAR_PLAYERS" }
  | { type: "SET_PLAYERS"; players: BowlingPlayer[] }
  | { type: "RECORD_ROLL"; pins: number };

interface BowlingContextValue extends BowlingState {
  addPlayer: (name: string) => void;
  removePlayer: (id: string) => void;
  setPlayers: (players: BowlingPlayer[]) => void;
  clearPlayers: () => void;
  recordRoll: (pins: number) => void;
}

interface BowlingProviderProps {
  children: ReactNode;
}

const BowlingContext = createContext<BowlingContextValue | undefined>(
  undefined,
);

const createFrames = (): Frame[] =>
  Array.from({ length: 10 }, () => ({
    rolls: [],
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

function reducer(state: BowlingState, action: BowlingAction): BowlingState {
  switch (action.type) {
    case "ADD_PLAYER": {
      const name = action.name.trim();

      if (!name || state.players.length >= 6) {
        return state;
      }

      const players = [...state.players, createPlayer(name)];

      return {
        ...state,
        players,
        turn:
          state.players.length === 0
            ? {
                frame: 1,
                player: 0,
                ball: 1,
              }
            : state.turn,
      };
    }

    case "REMOVE_PLAYER": {
      const removedIndex = state.players.findIndex(
        (player) => player.id === action.id,
      );

      if (removedIndex === -1) {
        return state;
      }

      const players = state.players.filter((player) => player.id !== action.id);

      if (players.length === 0) {
        return initialState;
      }

      let player = state.turn.player;

      // If a player before the current turn was removed,
      // shift the turn back by one.
      if (removedIndex < player) {
        player -= 1;
      }

      // Clamp to the last available player.
      player = Math.min(player, players.length - 1);
      player = Math.max(player, 0);

      return {
        ...state,
        players,
        turn: {
          ...state.turn,
          player,
        },
      };
    }

    case "SET_PLAYERS": {
      const players = action.players
        .slice(0, 6)
        .filter((player) => player.name.trim());

      if (players.length === 0) {
        return initialState;
      }

      return {
        ...state,
        players,
        turn: {
          frame: Math.min(state.turn.frame, 10),
          player: Math.min(state.turn.player, players.length - 1),
          ball: Math.min(Math.max(state.turn.ball, 1), 3),
        },
      };
    }

    case "CLEAR_PLAYERS":
      return initialState;

    case "RECORD_ROLL":
      return recordRoll(state, action.pins);

    default:
      return state;
  }
}

function recordRoll(state: BowlingState, pins: number): BowlingState {
  if (!Number.isInteger(pins) || pins < 0 || pins > 10) {
    return state;
  }

  const { players, turn } = state;
  const player = players[turn.player];

  if (!player) {
    return state;
  }

  const frameIndex = turn.frame - 1;
  const frame = player.frames[frameIndex];

  if (!frame) {
    return state;
  }

  const rolls = frame.rolls;

  // ------------------------------------------
  // FRAMES 1-9
  // ------------------------------------------

  if (turn.frame < 10) {
    // Second ball cannot make the frame exceed 10 pins.
    if (rolls.length === 1 && rolls[0] + pins > 10) {
      return state;
    }

    const updatedPlayers = updateFrame(players, turn, pins);

    // Strike: frame immediately ends.
    if (rolls.length === 0 && pins === 10) {
      return {
        players: updatedPlayers,
        turn: getNextPlayerOrFrame(turn, players.length),
      };
    }

    // First ball: move to ball 2.
    if (rolls.length === 0) {
      return {
        players: updatedPlayers,
        turn: {
          ...turn,
          ball: 2,
        },
      };
    }

    // Second ball: move to next player/frame.
    return {
      players: updatedPlayers,
      turn: getNextPlayerOrFrame(turn, players.length),
    };
  }

  // ------------------------------------------
  // FRAME 10
  // ------------------------------------------

  // Ball 1
  if (rolls.length === 0) {
    return {
      players: updateFrame(players, turn, pins),
      turn: {
        ...turn,
        ball: 2,
      },
    };
  }

  const first = rolls[0];

  // Ball 2
  if (rolls.length === 1) {
    // If ball 1 was NOT a strike, the two balls
    // cannot total more than 10.
    if (first < 10 && first + pins > 10) {
      return state;
    }

    const updatedPlayers = updateFrame(players, turn, pins);

    // Strike or spare gives a third ball.
    const bonus = first === 10 || first + pins === 10;

    if (bonus) {
      return {
        players: updatedPlayers,
        turn: {
          ...turn,
          ball: 3,
        },
      };
    }

    // Open 10th frame: player is finished.
    return {
      players: updatedPlayers,
      turn: getNextPlayerOrFrame(turn, players.length),
    };
  }

  // Ball 3
  if (rolls.length === 2) {
    const second = rolls[1];

    const hasBonus = first === 10 || first + second === 10;

    // A third ball is only allowed after
    // a strike or spare.
    if (!hasBonus) {
      return state;
    }

    // If the first ball was a strike, the second
    // and third balls are treated as a new pair.
    //
    // If the second ball wasn't a strike, they
    // cannot total more than 10.
    if (first === 10 && second < 10 && second + pins > 10) {
      return state;
    }

    const updatedPlayers = updateFrame(players, turn, pins);

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
): BowlingPlayer[] {
  return players.map((player, playerIndex) => {
    if (playerIndex !== turn.player) {
      return player;
    }

    return {
      ...player,
      frames: player.frames.map((frame, frameIndex) => {
        if (frameIndex !== turn.frame - 1) {
          return frame;
        }

        return {
          ...frame,
          rolls: [...frame.rolls, pins],
        };
      }),
    };
  });
}

function getNextPlayerOrFrame(turn: Turn, playerCount: number): Turn {
  // More players remaining in this frame.
  if (turn.player < playerCount - 1) {
    return {
      frame: turn.frame,
      player: turn.player + 1,
      ball: 1,
    };
  }

  // All players have completed this frame.
  if (turn.frame < 10) {
    return {
      frame: turn.frame + 1,
      player: 0,
      ball: 1,
    };
  }

  // Game finished.
  return turn;
}

export function BowlingProvider({ children }: BowlingProviderProps) {
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

    recordRoll: (pins) =>
      dispatch({
        type: "RECORD_ROLL",
        pins,
      }),
  };

  return (
    <BowlingContext.Provider value={value}>{children}</BowlingContext.Provider>
  );
}

export function useBowling(): BowlingContextValue {
  const context = useContext(BowlingContext);

  if (!context) {
    throw new Error("useBowling must be used within a BowlingProvider");
  }

  return context;
}
