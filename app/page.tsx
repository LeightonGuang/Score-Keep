import Link from "next/link";
import { GAMES } from "@/data/games";
import type { Metadata } from "next";
// ThemeToggle moved to layout
import HeroCarousel from "./components/HeroCarousel";

export const metadata: Metadata = {
  title: "Score Keep | Professional Match Trackers",
  description:
    "High-precision scoreboards, chess clocks, and sports trackers for competitive play.",
};

const AdPlaceholder = ({ className = "" }: { className?: string }) => (
  <div
    className={`flex w-full items-center justify-center border-2 border-dashed border-zinc-500/10 bg-zinc-500/5 text-zinc-500/30 transition-colors ${className}`}
  >
    <div className="flex flex-col items-center gap-2">
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className="h-6 w-6"
      >
        <path d="M12 2v20M2 12h20" />
      </svg>
      <span className="text-[10px] font-black tracking-[.25em] uppercase">
        Advertisement Slot
      </span>
    </div>
  </div>
);

export default function Home() {
  return (
    <main className="mx-auto max-w-6xl px-6 pt-24 pb-20">
      {/* Carousel Header - Client Island */}
      <HeroCarousel games={GAMES} />

      {/* Ad Placement: Top Leaderboard - Server Side */}
      <AdPlaceholder className="mb-12 h-32 rounded-3xl" />

      {/* Grid Title - Server Side */}
      <div className="mb-8 flex items-end justify-between px-2">
        <h2 className="text-sm font-black tracking-[.25em] text-zinc-500 uppercase">
          Available Toolkits
        </h2>
        <div className="mx-6 h-px flex-1 bg-zinc-500/10" />
      </div>

      {/* Tools Grid - Server Side */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {GAMES.map((game) => (
          <Link
            key={game.id}
            href={game.href}
            className={`group flex flex-col justify-between overflow-hidden rounded-3xl border border-zinc-500/10 bg-white p-6 shadow-sm transition-all hover:border-zinc-500/30 hover:shadow-md active:scale-95 dark:bg-zinc-950 ${
              game.status === "coming-soon"
                ? "cursor-default opacity-60 grayscale"
                : ""
            }`}
          >
            <div>
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl border border-zinc-500/10 bg-zinc-500/5 transition-all group-hover:border-zinc-500/30">
                <div className="h-6 w-6 text-zinc-950 dark:text-white">
                  {game.icon}
                </div>
              </div>
              <h3 className="mb-2 text-xl font-bold tracking-tight">
                {game.title}
              </h3>
              <p className="text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
                {game.description}
              </p>
            </div>

            <div className="mt-8 flex items-center justify-between">
              {game.status === "active" ? (
                <span className="text-[10px] font-black tracking-widest text-zinc-500 uppercase dark:text-zinc-400">
                  Free Access →
                </span>
              ) : (
                <span className="rounded-full bg-zinc-500/10 px-3 py-1 text-[10px] font-black tracking-widest text-zinc-500/50 uppercase">
                  Beta
                </span>
              )}
            </div>
          </Link>
        ))}

        {/* Request Card - Server Side */}
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-zinc-500/20 bg-zinc-500/5 p-6 text-center text-zinc-400 transition-all dark:text-zinc-700">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="mb-3 h-8 w-8 opacity-20"
          >
            <path d="M12 5v14M5 12h14" />
          </svg>
          <span className="text-xs font-bold tracking-widest uppercase">
            Add Request
          </span>
        </div>
      </div>

      {/* Ad Placement: Bottom Banner - Server Side */}
      <AdPlaceholder className="mt-20 h-48 rounded-4xl" />
    </main>
  );
}
