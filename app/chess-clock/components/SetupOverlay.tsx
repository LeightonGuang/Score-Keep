"use client";
import React from "react";

type ClockStyle = "modern" | "classic";

interface SetupOverlayProps {
  p1Name: string;
  setP1Name: (name: string) => void;
  p2Name: string;
  setP2Name: (name: string) => void;
  baseMinutesInput: string;
  setBaseMinutesInput: (min: string) => void;
  incrementSecondsInput: string;
  setIncrementSecondsInput: (inc: string) => void;
  clockStyle: ClockStyle;
  setClockStyle: (style: ClockStyle) => void;
  errors: { base?: string; inc?: string };
  setErrors: (errors: { base?: string; inc?: string }) => void;
  onStart: () => void;
}

export const SetupOverlay: React.FC<SetupOverlayProps> = ({
  p1Name,
  setP1Name,
  p2Name,
  setP2Name,
  baseMinutesInput,
  setBaseMinutesInput,
  incrementSecondsInput,
  setIncrementSecondsInput,
  clockStyle,
  setClockStyle,
  errors,
  setErrors,
  onStart,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/95 p-6 backdrop-blur-sm">
      <div className="animate-in fade-in zoom-in flex w-full max-w-sm flex-col gap-6 duration-300">
        <h1 className="text-center text-3xl font-black tracking-tight">
          CHESS CLOCK
        </h1>

        {/* Style Selector */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setClockStyle("modern")}
            className={`flex flex-col items-center gap-2 rounded-2xl border-2 p-4 transition-all ${clockStyle === "modern" ? "border-white bg-white/5" : "border-zinc-800 bg-zinc-900/50 opacity-40 hover:opacity-100"} `}
          >
            <div className="flex h-12 w-full flex-col gap-1">
              <div className="flex-1 rounded-sm bg-white/20" />
              <div className="flex-1 rounded-sm bg-white/20" />
            </div>
            <span className="text-[10px] font-bold tracking-widest uppercase">
              Modern
            </span>
          </button>
          <button
            onClick={() => setClockStyle("classic")}
            className={`flex flex-col items-center gap-2 rounded-2xl border-2 p-4 transition-all ${clockStyle === "classic" ? "border-white bg-white/5" : "border-zinc-800 bg-zinc-900/50 opacity-40 hover:opacity-100"} `}
          >
            <div className="flex h-12 w-full items-end gap-1">
              <div className="h-[80%] flex-1 rounded-t-sm bg-white/20" />
              <div className="h-[40%] flex-1 rounded-t-sm bg-white/20" />
            </div>
            <span className="text-[10px] font-bold tracking-widest uppercase">
              Classic
            </span>
          </button>
        </div>

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Player 1"
            value={p1Name}
            onChange={(e) => setP1Name(e.target.value)}
            className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 transition-colors focus:border-white focus:outline-none"
          />
          <input
            type="text"
            placeholder="Player 2"
            value={p2Name}
            onChange={(e) => setP2Name(e.target.value)}
            className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 transition-colors focus:border-white focus:outline-none"
          />

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="ml-1 text-[9px] font-bold tracking-[0.2em] text-zinc-500 uppercase">
                Minutes
              </label>
              <input
                type="number"
                value={baseMinutesInput}
                onChange={(e) => {
                  setBaseMinutesInput(e.target.value);
                  if (errors.base) setErrors({ ...errors, base: undefined });
                }}
                className={`w-full rounded-xl border bg-zinc-900 px-4 py-3 transition-colors focus:outline-none ${errors.base ? "border-red-500" : "border-zinc-800 focus:border-white"}`}
              />
              {errors.base && (
                <span className="ml-1 text-[10px] font-medium text-red-500">
                  {errors.base}
                </span>
              )}
            </div>
            <div className="flex flex-col gap-1">
              <label className="ml-1 text-[9px] font-bold tracking-[0.2em] text-zinc-500 uppercase">
                Incr (s)
              </label>
              <input
                type="number"
                value={incrementSecondsInput}
                onChange={(e) => {
                  setIncrementSecondsInput(e.target.value);
                  if (errors.inc) setErrors({ ...errors, inc: undefined });
                }}
                className={`w-full rounded-xl border bg-zinc-900 px-4 py-3 transition-colors focus:outline-none ${errors.inc ? "border-red-500" : "border-zinc-800 focus:border-white"}`}
              />
              {errors.inc && (
                <span className="ml-1 text-[10px] font-medium text-red-500">
                  {errors.inc}
                </span>
              )}
            </div>
          </div>
        </div>

        <button
          onClick={onStart}
          className="mt-2 w-full rounded-2xl bg-white py-4 font-black tracking-widest text-zinc-950 uppercase transition-all active:scale-[0.98]"
        >
          Start Game
        </button>
      </div>
    </div>
  );
};
