export interface Frame {
  rolls: number[];
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

export interface BowlingState {
  players: BowlingPlayer[];
  turn: Turn;
}
