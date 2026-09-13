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

    if (name.trim() && players.length < 6) {
      addPlayer(name);
      setName("");
    }

    if (players.length > 0 || name.trim()) onSubmit?.();
  };

  const canStartGame = players.length > 0 || name.trim().length > 0;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {players.length > 0 && (
        <div className="space-y-2">
          {players.map((player, index) => (
            <div key={player.id} className="group flex items-center gap-3">
              <div className="bg-surface-muted text-muted flex size-10 shrink-0 items-center justify-center rounded-lg text-sm font-semibold">
                {index + 1}
              </div>

              <div className="border-border bg-surface-muted flex h-10 flex-1 items-center rounded-lg border px-3 text-sm font-medium">
                {player.name}
              </div>

              <button
                type="button"
                onClick={() => removePlayer(player.id)}
                className="text-muted-light flex size-10 items-center justify-center rounded-lg text-lg transition hover:bg-red-50 hover:text-red-500"
                aria-label={`Remove ${player.name}`}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      {players.length < 6 && (
        <div className="flex gap-2">
          <input
            className="border-border bg-surface-muted text-foreground placeholder:text-muted-light focus:border-accent focus:ring-accent/10 h-10 min-w-0 flex-1 rounded-lg border px-3 text-sm transition outline-none focus:ring-2"
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder={`Player ${players.length + 1}`}
            maxLength={30}
          />

          <button
            type="button"
            onClick={handleAddPlayer}
            disabled={!name.trim()}
            className="bg-foreground h-10 rounded-lg px-4 text-sm font-semibold text-white transition hover:bg-[#28334a] disabled:cursor-not-allowed disabled:opacity-40"
          >
            Add
          </button>
        </div>
      )}

      <div className="border-border border-t pt-5">
        <button
          type="submit"
          disabled={!canStartGame}
          className="bg-accent hover:bg-accent-hover h-11 w-full rounded-lg px-4 text-sm font-bold text-white transition disabled:cursor-not-allowed disabled:opacity-40"
        >
          Start Game
        </button>
      </div>
    </form>
  );
};

export default BowlingPlayerForm;
