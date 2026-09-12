"use client";

import { FormEvent, useState } from "react";
import { useBowling } from "../context/BowlingContext";

interface BowlingPlayerFormProps {
  onSubmit?: () => void;
}

const BowlingPlayerForm = ({ onSubmit }: BowlingPlayerFormProps) => {
  const { players, addPlayer, removePlayer } = useBowling();

  const [name, setName] = useState("");

  const handleAddPlayer = () => {
    if (!name.trim() || players.length >= 6) return;

    addPlayer(name);
    setName("");
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // If there is a name currently in the input,
    // add it before starting the game.
    if (name.trim() && players.length < 6) {
      addPlayer(name);
      setName("");
    }

    // Start if there is already a player,
    // or if the current input contains a name.
    if (players.length > 0 || name.trim()) {
      onSubmit?.();
    }
  };

  const canStartGame = players.length > 0 || name.trim().length > 0;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Players */}
      {players.length > 0 && (
        <div className="space-y-3">
          {players.map((player, index) => (
            <div key={player.id} className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-zinc-100 text-sm font-bold text-zinc-500 dark:bg-zinc-900 dark:text-zinc-400">
                {index + 1}
              </div>

              <div className="flex h-10 flex-1 items-center rounded-lg border border-zinc-200 bg-white px-3 text-sm dark:border-zinc-800 dark:bg-zinc-900">
                {player.name}
              </div>

              <button
                type="button"
                onClick={() => removePlayer(player.id)}
                className="h-10 w-10 rounded-lg text-xl text-zinc-400 transition hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950/30"
                aria-label={`Remove ${player.name}`}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Add player */}
      {players.length < 6 && (
        <div className="flex gap-3">
          <input
            className="h-10 flex-1 rounded-lg border border-zinc-200 bg-white px-3 text-sm transition outline-none focus:border-zinc-500 focus:ring-2 focus:ring-zinc-500/10 dark:border-zinc-800 dark:bg-zinc-900"
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder={`Player ${players.length + 1}`}
            maxLength={30}
          />

          <button
            className="rounded-lg bg-zinc-900 px-4 text-sm font-bold text-white transition hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200"
            type="button"
            onClick={handleAddPlayer}
            disabled={!name.trim()}
          >
            Add
          </button>
        </div>
      )}

      {/* Start */}
      <button
        className="w-full rounded-lg bg-zinc-950 py-3 text-sm font-bold text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200"
        type="submit"
        disabled={!canStartGame}
      >
        Start Game
      </button>
    </form>
  );
};

export default BowlingPlayerForm;
