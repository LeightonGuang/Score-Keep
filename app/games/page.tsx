import { GAMES } from "@/data/games";
import GamesList from "./GamesList";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "All Games | Score Keep",
  description:
    "Browse our complete collection of professional scoreboards, timers, and game tracking tools.",
};

export default function GamesPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 pt-32 pb-20">
      <div className="mb-20 text-center">
        <div className="mb-6 flex justify-center">
          <span className="rounded-full border border-zinc-500/20 bg-zinc-500/5 px-4 py-1.5 text-[10px] font-black tracking-[0.2em] text-zinc-500 uppercase backdrop-blur-md">
            Full Collection
          </span>
        </div>
        <h1 className="mb-6 text-4xl font-black tracking-tighter md:text-6xl lg:text-7xl">
          GAME LIBRARY
        </h1>
        <p className="mx-auto max-w-2xl text-lg font-medium text-zinc-500 dark:text-zinc-400">
          Explore our complete suite of professional scoring tools. From chess
          clocks to digital scoreboards, everything you need to manage the game.
        </p>
      </div>

      <GamesList games={GAMES} />
    </main>
  );
}
