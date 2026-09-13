"use client";

import { useState } from "react";
import Link from "next/link";
// Game type definition
interface Game {
  id: string;
  title: string;
  tagline: string;
  description: string;
  href: string;
  status: string;
  theme: string;
  icon: React.ReactNode;
}

const GridIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-4 w-4"
  >
    <rect width="7" height="7" x="3" y="3" rx="1" />
    <rect width="7" height="7" x="14" y="3" rx="1" />
    <rect width="7" height="7" x="14" y="14" rx="1" />
    <rect width="7" height="7" x="3" y="14" rx="1" />
  </svg>
);

const ListIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-4 w-4"
  >
    <line x1="3" x2="21" y1="6" y2="6" />
    <line x1="3" x2="21" y1="12" y2="12" />
    <line x1="3" x2="21" y1="18" y2="18" />
  </svg>
);

export default function GamesList({ games }: { games: any[] }) {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  return (
    <div>
      {/* Toggle Controls */}
      <div className="mb-8 flex justify-end">
        <div className="flex items-center gap-1 rounded-full border border-zinc-500/10 bg-white p-1 dark:bg-zinc-900/40">
          <button
            onClick={() => setViewMode("grid")}
            className={`flex h-8 w-8 items-center justify-center rounded-full transition-all ${
              viewMode === "grid"
                ? "bg-zinc-100/80 text-zinc-900 shadow-sm dark:bg-zinc-800 dark:text-white"
                : "text-zinc-400 hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-300"
            }`}
            aria-label="Grid View"
          >
            <GridIcon />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`flex h-8 w-8 items-center justify-center rounded-full transition-all ${
              viewMode === "list"
                ? "bg-zinc-100/80 text-zinc-900 shadow-sm dark:bg-zinc-800 dark:text-white"
                : "text-zinc-400 hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-300"
            }`}
            aria-label="List View"
          >
            <ListIcon />
          </button>
        </div>
      </div>

      <div
        className={
          viewMode === "grid"
            ? "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
            : "mx-auto flex max-w-4xl flex-col gap-4"
        }
      >
        {games.map((game) => (
          <Link
            key={game.id}
            href={game.href}
            className={`group relative overflow-hidden rounded-3xl border border-zinc-500/10 bg-white p-8 shadow-sm transition-all hover:border-zinc-500/30 dark:bg-zinc-900/40 ${
              game.status === "coming-soon"
                ? "cursor-default opacity-60 grayscale"
                : ""
            } ${
              viewMode === "grid"
                ? "flex flex-col justify-between hover:-translate-y-1 hover:shadow-xl active:scale-95"
                : "flex flex-col hover:scale-[1.01] hover:bg-zinc-50 md:flex-row md:items-center md:gap-8 dark:hover:bg-zinc-900"
            }`}
          >
            {/* Background Glow */}
            <div
              className={`absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-10 ${game.theme}`}
            />

            {/* Icon Section */}
            <div
              className={`relative z-10 flex shrink-0 items-center justify-center rounded-2xl border border-zinc-500/10 bg-zinc-500/5 transition-all group-hover:bg-white/80 dark:group-hover:bg-zinc-800 ${
                viewMode === "grid"
                  ? "mb-8 h-16 w-16"
                  : "mb-4 h-16 w-16 md:mb-0"
              }`}
            >
              <div
                className={`${
                  viewMode === "grid" ? "h-8 w-8" : "h-6 w-6"
                } text-zinc-900 dark:text-white`}
              >
                {game.icon}
              </div>
            </div>

            {/* Content Section */}
            <div
              className={`relative z-10 flex-1 ${viewMode === "list" ? "text-left" : ""}`}
            >
              {/* Badge for Grid (Top Right) - Only in Grid mode we usually put it apart, but in List usually inline or right */}
              {viewMode === "grid" && game.status !== "active" && (
                <div className="absolute top-0 right-0">
                  <span className="rounded-full bg-zinc-500/10 px-3 py-1 text-[10px] font-black tracking-widest text-zinc-500 uppercase">
                    Soon
                  </span>
                </div>
              )}

              <div className="mb-2 flex items-center gap-3">
                <h2 className="text-2xl font-black tracking-tight text-zinc-900 dark:text-white">
                  {game.title}
                </h2>
                {/* Badge for List (Inline title) */}
                {viewMode === "list" && game.status !== "active" && (
                  <span className="rounded-full bg-zinc-500/10 px-3 py-1 text-[10px] font-black tracking-widest text-zinc-500 uppercase">
                    Soon
                  </span>
                )}
              </div>

              <div className="mb-4 text-xs font-bold tracking-widest text-zinc-400 uppercase">
                {game.tagline}
              </div>
              <p
                className={`text-sm leading-relaxed text-zinc-500 dark:text-zinc-400 ${
                  viewMode === "list" ? "max-w-xl" : ""
                }`}
              >
                {game.description}
              </p>
            </div>

            {/* Action Section */}
            <div
              className={`relative z-10 ${
                viewMode === "grid"
                  ? "mt-8 w-full"
                  : "mt-4 w-full md:mt-0 md:w-auto"
              }`}
            >
              <div
                className={`flex items-center justify-center rounded-xl py-3 text-xs font-bold tracking-widest uppercase transition-colors ${
                  viewMode === "list" ? "px-8 whitespace-nowrap" : "w-full"
                } ${
                  game.status === "active"
                    ? "bg-zinc-950 text-white group-hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:group-hover:bg-zinc-200"
                    : "bg-zinc-500/10 text-zinc-500"
                }`}
              >
                {game.status === "active" ? "Launch Tool" : "In Development"}
              </div>
            </div>
          </Link>
        ))}

        {/* Request More Card - Only show in Grid view or create a list version?
            For simplicity, let's keep it in Grid view only, or append nicely in List view.
            Grid has col-span issues if items are odd. List view just stacks.
            Let's make a ListCard version of request form.
         */}
        <div
          className={`flex flex-col items-center justify-center rounded-3xl border border-dashed border-zinc-500/20 bg-zinc-500/5 text-center text-zinc-400 transition-all hover:bg-zinc-500/10 dark:text-zinc-600 ${
            viewMode === "grid"
              ? "aspect-square h-full p-8 sm:aspect-auto"
              : "flex-row gap-6 p-6"
          }`}
        >
          <div
            className={`flex items-center justify-center rounded-full bg-zinc-500/10 ${viewMode === "grid" ? "mb-4 h-16 w-16" : "h-12 w-12"}`}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="h-6 w-6"
            >
              <path d="M12 5v14M5 12h14" />
            </svg>
          </div>
          <div className={viewMode === "list" ? "text-left" : ""}>
            <h3
              className={`font-bold ${viewMode === "list" ? "text-base" : "mb-2 text-lg"}`}
            >
              Request a Game
            </h3>
            <p className="text-xs text-zinc-500">
              Need a tracker for your sport? Let us know.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
