"use client";

import { Frame } from "../components/Frame";
import { useRouter } from "next/navigation";
import { TenthFrame } from "../components/TenthFrame";
import { useBowling } from "../context/BowlingContext";
import { calculateFrameScores } from "../components/bowlingScore";

const BowlingResultsPage = () => {
  const router = useRouter();

  const { players, currentGame, turn } = useBowling();

  const gameCount = players.reduce(
    (max, player) => Math.max(max, player.games.length),
    0,
  );

  return (
    <main className="min-h-screen bg-[#f4f1ea] text-[#172033]">
      <header className="border-b border-[#ddd8ce] bg-white">
        <div className="mx-auto flex h-16 w-full max-w-[1400px] items-center justify-between px-6">
          <div>
            <h1 className="text-sm font-bold">Bowling</h1>

            <p className="text-xs text-[#8a919e]">Game history</p>
          </div>

          <button
            type="button"
            onClick={() => router.push("/bowling")}
            className="rounded-lg border border-[#ddd8ce] bg-white px-4 py-2 text-sm font-semibold text-[#697386] transition-colors hover:border-[#e76f32] hover:text-[#172033]"
          >
            Back to Game
          </button>
        </div>
      </header>

      <div className="mx-auto w-full max-w-[1400px] px-6 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold tracking-tight">Game History</h2>

          <p className="mt-1 text-sm text-[#697386]">
            All games played in this bowling session.
          </p>
        </div>

        {gameCount === 0 || players.length === 0 ? (
          <div className="rounded-2xl border border-[#ddd8ce] bg-white p-8 text-center shadow-sm">
            <p className="font-semibold">No games yet</p>

            <p className="mt-1 text-sm text-[#697386]">
              Start a bowling game to see it here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-[#ddd8ce] bg-white shadow-sm">
            <div className="min-w-max">
              {/* Column header */}
              <div className="grid grid-cols-[180px_1fr]">
                <div className="flex h-12 items-center border-r border-b border-[#ddd8ce] bg-[#f4f1ea] px-5 text-sm font-semibold">
                  Player
                </div>

                <div className="border-b border-[#ddd8ce] bg-[#f4f1ea] px-5">
                  <div className="flex h-12 items-center gap-2">
                    {Array.from({ length: 10 }, (_, index) => (
                      <div
                        key={index}
                        className="flex w-16 items-center justify-center text-xs font-semibold text-[#697386]"
                      >
                        {index + 1}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Players */}
              {players.map((player, playerIndex) => (
                <div
                  key={player.id}
                  className="grid grid-cols-[180px_1fr] border-b border-[#ddd8ce] last:border-b-0"
                >
                  {/* Player name */}
                  <div className="border-r border-[#ddd8ce] bg-white px-5 py-5">
                    <div className="sticky left-0">
                      <p className="text-sm font-bold">{player.name}</p>

                      <p className="mt-1 text-xs text-[#8a919e]">
                        {player.games.length}{" "}
                        {player.games.length === 1 ? "game" : "games"}
                      </p>
                    </div>
                  </div>

                  {/* All games stacked */}
                  <div className="bg-white">
                    {player.games.map((game, gameIndex) => {
                      const frameScores = calculateFrameScores(game.frames);

                      const total =
                        frameScores.length > 0
                          ? frameScores[frameScores.length - 1]
                          : 0;

                      const isCurrentGame = gameIndex === currentGame;

                      return (
                        <div
                          key={game.id}
                          className={`border-b border-[#e7e3db] last:border-b-0 ${
                            isCurrentGame ? "bg-[#fffaf7]" : "bg-white"
                          }`}
                        >
                          {/* Game label */}
                          <div className="flex h-8 items-center gap-3 px-5">
                            <span
                              className={`text-xs font-bold ${
                                isCurrentGame
                                  ? "text-[#e76f32]"
                                  : "text-[#697386]"
                              }`}
                            >
                              Game {gameIndex + 1}
                            </span>

                            {isCurrentGame && (
                              <span className="rounded-md bg-[#e76f32]/10 px-2 py-0.5 text-[10px] font-semibold text-[#e76f32]">
                                Current
                              </span>
                            )}

                            <span className="ml-auto text-xs font-bold text-[#172033]">
                              {total! > 0 ? total : ""}
                            </span>
                          </div>

                          {/* Frames */}
                          <div className="flex gap-2 px-5 pb-4">
                            {game.frames.map((frame, frameIndex) => {
                              const frameNumber = frameIndex + 1;

                              const score = frameScores[frameIndex] ?? null;

                              const isCurrentPlayer =
                                playerIndex === turn.player;

                              const gameIsCurrent = gameIndex === currentGame;

                              /*
                               * Only allow the current turn highlighting
                               * on the currently active game.
                               */
                              const frameTurn =
                                gameIsCurrent && isCurrentPlayer
                                  ? turn
                                  : {
                                      frame: 0,
                                      player: -1,
                                      ball: 1 as const,
                                    };

                              if (frameNumber === 10) {
                                return (
                                  <TenthFrame
                                    key={frameNumber}
                                    frame={frame}
                                    turn={frameTurn}
                                    score={score}
                                    playerIndex={playerIndex}
                                  />
                                );
                              }

                              return (
                                <Frame
                                  key={frameNumber}
                                  i={frameNumber}
                                  frame={frame}
                                  turn={frameTurn}
                                  score={score}
                                  playerIndex={playerIndex}
                                />
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default BowlingResultsPage;
