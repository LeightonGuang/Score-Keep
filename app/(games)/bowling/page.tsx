"use client";

import { useEffect, useState } from "react";
import { useBowling } from "./context/BowlingContext";
import BowlingScoreCard from "./components/BowlingScoreCard";
import BowlingPlayerForm from "./components/BowlingPlayerForm";

const BowlingPage = () => {
  const { players } = useBowling();

  const [showForm, setShowForm] = useState(true);

  /*
   * Once localStorage hydrates and players appear,
   * automatically return to the game.
   */
  useEffect(() => {
    if (players.length > 0) setShowForm(false);
  }, [players.length]);

  const handleStartGame = () => {
    setShowForm(false);
  };

  /*
   * Show the setup screen only when there are no players.
   */
  if (showForm && players.length === 0) {
    return (
      <main className="min-h-screen bg-[#f4f1ea] text-[#172033]">
        <div className="mx-auto flex min-h-screen w-full max-w-2xl flex-col px-6 py-12">
          <header className="mb-10">
            <div className="mb-6 h-1 w-12 rounded-full bg-[#e76f32]" />

            <h1 className="text-3xl font-bold tracking-tight">Bowling</h1>

            <p className="mt-2 text-sm text-[#697386]">
              Add your players before starting the game.
            </p>
          </header>

          <div className="rounded-2xl border border-[#ddd8ce] bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-[#e7e3db] px-6 py-5">
              <div>
                <h2 className="font-semibold text-[#172033]">Players</h2>

                <p className="mt-1 text-xs text-[#8a919e]">Up to 6 players</p>
              </div>

              <span className="rounded-md bg-[#f4f1ea] px-2.5 py-1 text-xs font-semibold text-[#697386] tabular-nums">
                {players.length}/6
              </span>
            </div>

            <div className="p-6">
              <BowlingPlayerForm onSubmit={handleStartGame} />
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f4f1ea] text-[#172033]">
      <header className="border-b border-[#ddd8ce] bg-white">
        <div className="mx-auto flex h-16 w-full max-w-[1400px] items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div className="h-8 w-1 rounded-full bg-[#e76f32]" />

            <div>
              <h1 className="text-sm font-bold">Bowling</h1>

              <p className="text-xs text-[#8a919e]">
                {players.length} {players.length === 1 ? "player" : "players"}
              </p>
            </div>
          </div>

          <div className="text-xs font-medium text-[#8a919e]">
            Game in progress
          </div>
        </div>
      </header>

      <div className="mx-auto w-full max-w-[1400px] px-6 py-8">
        <div className="mb-6">
          <h2 className="text-xl font-bold tracking-tight">Scorecard</h2>

          <p className="mt-1 text-sm text-[#697386]">
            Enter each roll as you play.
          </p>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-[#ddd8ce] bg-white p-5 shadow-sm">
          <BowlingScoreCard />
        </div>
      </div>
    </main>
  );
};

export default BowlingPage;
