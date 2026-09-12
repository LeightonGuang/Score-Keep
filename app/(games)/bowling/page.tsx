"use client";

import { useState } from "react";
import { useBowling } from "./context/BowlingContext";
import BowlingScoreCard from "./components/BowlingScoreCard";
import BowlingPlayerForm from "./components/BowlingPlayerForm";

const BowlingPage = () => {
  const { players } = useBowling();

  const handleStartGame = () => {
    console.log("Players:", players);
    setShowForm(false);
    // Navigate to the scorecard here later
  };

  const [showForm, setShowForm] = useState(true);

  return (
    <section className="mx-auto w-full px-6 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-black tracking-tight">Bowling</h1>

        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
          Add up to 6 players to start the game.
        </p>
      </div>

      {showForm ? (
        <BowlingPlayerForm onSubmit={handleStartGame} />
      ) : (
        <BowlingScoreCard />
      )}
    </section>
  );
};

export default BowlingPage;
