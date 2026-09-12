import { Frame } from "./Frame";
import { TenthFrame } from "./TenthFrame";
import { calculateFrameScores } from "./bowlingScore";

import type { BowlingPlayer, Turn } from "../context/BowlingContext";

interface PlayerCardProps {
  player: BowlingPlayer;
  playerIndex: number;
  turn: Turn;
}

export const PlayerCard = ({ player, playerIndex, turn }: PlayerCardProps) => {
  const scores = calculateFrameScores(player.frames);

  return (
    <>
      <div className="flex size-16 truncate border p-1">{player.name}</div>

      {player.frames.map((frame, index) => {
        const frameNumber = index + 1;

        if (frameNumber === 10) {
          return (
            <TenthFrame
              key={frameNumber}
              frame={frame}
              turn={turn}
              score={scores[index]}
              playerIndex={playerIndex}
            />
          );
        }

        return (
          <Frame
            key={frameNumber}
            i={frameNumber}
            frame={frame}
            turn={turn}
            score={scores[index]}
            playerIndex={playerIndex}
          />
        );
      })}
    </>
  );
};
