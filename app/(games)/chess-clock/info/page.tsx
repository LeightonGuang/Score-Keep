"use client";

import Link from "next/link";

interface TimeControlStage {
  moveNumber: number;
  minutesToAdd: number;
}

const PRESETS: {
  label: string;
  h: number;
  m: number;
  s: number;
  inc: number;
  mode?: "increment" | "delay";
  stages?: TimeControlStage[];
  description?: string;
}[] = [
  {
    label: "3 mins",
    h: 0,
    m: 3,
    s: 0,
    inc: 0,
    description:
      "A super fast Blitz game. 3 minutes total for each player with no increment.",
  },
  {
    label: "5 mins",
    h: 0,
    m: 5,
    s: 0,
    inc: 0,
    description:
      "Standard Blitz. 5 minutes total for each player with no increment.",
  },
  {
    label: "10 mins",
    h: 0,
    m: 10,
    s: 0,
    inc: 0,
    description: "Rapid game. 10 minutes total for each player.",
  },
  {
    label: "25 mins",
    h: 0,
    m: 25,
    s: 0,
    inc: 0,
    description: "Rapid game. 25 minutes total for each player.",
  },
  {
    label: "30 mins",
    h: 0,
    m: 30,
    s: 0,
    inc: 0,
    description: "Classical/Rapid boundary. 30 minutes total for each player.",
  },
  {
    label: "60 mins",
    h: 1,
    m: 0,
    s: 0,
    inc: 0,
    description: "Standard game. 1 hour total for each player.",
  },
  {
    label: "1 min + 1 sec/move",
    h: 0,
    m: 1,
    s: 0,
    inc: 1,
    mode: "increment",
    description:
      "Bullet chess. 1 minute start time with 1 second added after every move.",
  },
  {
    label: "3 mins + 2 sec/move",
    h: 0,
    m: 3,
    s: 0,
    inc: 2,
    mode: "increment",
    description:
      "Popular Blitz format. 3 minutes start time with 2 seconds added per move.",
  },
  {
    label: "5 mins + 3 sec/move",
    h: 0,
    m: 5,
    s: 0,
    inc: 3,
    mode: "increment",
    description:
      "Blitz with increment. 5 minutes start time with 3 seconds added per move.",
  },
  {
    label: "10 mins + 5 sec/move",
    h: 0,
    m: 10,
    s: 0,
    inc: 5,
    mode: "increment",
    description:
      "Rapid with increment. 10 minutes start time with 5 seconds added per move.",
  },
  {
    label: "15 mins + 10 sec/move",
    h: 0,
    m: 15,
    s: 0,
    inc: 10,
    mode: "increment",
    description: "Rapid. 15 minutes start time with 10 seconds added per move.",
  },
  {
    label: "25 mins + 10 sec/move",
    h: 0,
    m: 25,
    s: 0,
    inc: 10,
    mode: "increment",
    description: "Rapid. 25 minutes start time with 10 seconds added per move.",
  },
  {
    label: "60 mins + 5 sec/move",
    h: 1,
    m: 0,
    s: 0,
    inc: 5,
    mode: "increment",
    description:
      "Standard with small increment. 60 minutes start time with 5 seconds added per move.",
  },
  {
    label: "90 mins + 30 sec/move",
    h: 1,
    m: 30,
    s: 0,
    inc: 30,
    mode: "increment",
    description:
      "Classical. 90 minutes start time with 30 seconds added per move.",
  },
  {
    label: "5 mins, 2s delay",
    h: 0,
    m: 5,
    s: 0,
    inc: 2,
    mode: "delay",
    description:
      "Blitz with delay. 5 minutes start time. The clock waits 2 seconds before counting down on each move (US Delay style).",
  },
  {
    label: "10 mins, 5s delay",
    h: 0,
    m: 10,
    s: 0,
    inc: 5,
    mode: "delay",
    description:
      "Rapid with delay. 10 minutes start time. 5 seconds delay per move.",
  },
  {
    label: "25 mins, 5s delay",
    h: 0,
    m: 25,
    s: 0,
    inc: 5,
    mode: "delay",
    description:
      "Rapid with delay. 25 minutes start time. 5 seconds delay per move.",
  },
  {
    label: "60 mins, 10s delay",
    h: 1,
    m: 0,
    s: 0,
    inc: 10,
    mode: "delay",
    description:
      "Standard with delay. 60 minutes start time. 10 seconds delay per move.",
  },
  {
    label: "90+30 mins after 40 moves + 30s/move",
    h: 1,
    m: 30,
    s: 0,
    inc: 30,
    mode: "increment",
    stages: [{ moveNumber: 40, minutesToAdd: 30 }],
    description:
      "FIDE Standard (approx). 90 minutes for the first 40 moves, then 30 minutes added to the clock. Plus 30 seconds added per move from move 1.",
  },
  {
    label: "100+50 mins after 40 moves + 30s/move",
    h: 1,
    m: 40,
    s: 0,
    inc: 30,
    mode: "increment",
    stages: [{ moveNumber: 40, minutesToAdd: 50 }],
    description:
      "Classical Championship style. 100 minutes for the first 40 moves, then 50 minutes added. 30 seconds increment per move.",
  },
];

export default function InfoPage() {
  return (
    <div className="min-h-screen bg-zinc-950 p-6 text-white md:p-12">
      <div className="mx-auto max-w-2xl space-y-8">
        <header className="flex items-center gap-4">
          <Link
            href="/chess-clock" // Assumes the chess clock is at this route or modify to fit the route structure.
            // Since the setup overlay is a component, likely the user wants to go back to the page that renders SetupOverlay.
            // Based on file path app/chess-clock/page.tsx, the route is /chess-clock
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-zinc-800 bg-zinc-900 text-zinc-500 transition-all hover:bg-zinc-800 hover:text-white active:scale-90"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
          </Link>
          <h1 className="text-3xl font-black tracking-tight">Time Controls</h1>
        </header>

        <p className="text-zinc-400">
          Different time controls favor different styles of play. Here is a
          guide to the presets available in this chess clock.
        </p>

        <div className="space-y-4">
          {PRESETS.map((preset, i) => (
            <div
              key={i}
              className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5 transition-all hover:border-zinc-700 hover:bg-zinc-900"
            >
              <h3 className="mb-1 text-lg font-bold text-white">
                {preset.label}
              </h3>
              <p className="text-sm leading-relaxed text-zinc-400">
                {preset.description}
              </p>
              <div className="mt-3 flex gap-2">
                <span className="inline-flex items-center rounded-md bg-zinc-800 px-2 py-1 text-xs font-medium text-zinc-300 ring-1 ring-zinc-700/10 ring-inset">
                  {preset.mode === "delay"
                    ? "Delay"
                    : preset.inc > 0
                      ? "Increment"
                      : "No Increment"}
                </span>
                {preset.stages && preset.stages.length > 0 && (
                  <span className="inline-flex items-center rounded-md bg-indigo-900/30 px-2 py-1 text-xs font-medium text-indigo-400 ring-1 ring-indigo-500/20 ring-inset">
                    Multi-Stage
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
