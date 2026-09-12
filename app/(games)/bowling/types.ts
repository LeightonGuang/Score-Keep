export interface Frame {
  rolls: number[];

  /**
   * Pins remaining after each ball.
   *
   * Example:
   *
   * Ball 1:
   * [2, 3, 4, 5, 6, 7, 8]
   *
   * Ball 2:
   * [5, 6, 7, 8]
   */
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

export interface BowlingState {
  players: BowlingPlayer[];

  /**
   * Zero-based game index.
   *
   * 0 = Game 1
   * 1 = Game 2
   */
  currentGame: number;

  turn: Turn;
}

export type BowlingAction =
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
