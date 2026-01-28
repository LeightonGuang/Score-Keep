"use client";
import React from "react";

interface ModernClockProps {
  time1: number;
  time2: number;
  p1Name: string;
  p2Name: string;
  activePlayer: 0 | 1 | 2;
  isGameOver: boolean;
  handleTouchStart: (e: React.TouchEvent, playerNum: 1 | 2) => void;
  handleMouseDown: (e: React.MouseEvent, playerNum: 1 | 2) => void;
  formatTime: (seconds: number) => string;
  onReset: () => void;
  onPause: () => void;
}

export const ModernClock: React.FC<ModernClockProps> = ({
  time1,
  time2,
  p1Name,
  p2Name,
  activePlayer,
  isGameOver,
  handleTouchStart,
  handleMouseDown,
  formatTime,
  onReset,
  onPause,
}) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center overflow-hidden bg-zinc-950">
      {/* Forced Portrait Container */}
      <div className="flex h-[100dvh] w-[100dvw] flex-col transition-all duration-500 landscape:h-[100dvw] landscape:w-[101dvh] landscape:-rotate-90">
        <button
          onTouchStart={(e) => handleTouchStart(e, 1)}
          onMouseDown={(e) => handleMouseDown(e, 1)}
          disabled={isGameOver}
          className={`flex w-full flex-1 rotate-180 flex-col items-center justify-center transition-colors duration-300 ${activePlayer === 1 ? "bg-white text-zinc-900" : "bg-zinc-900 text-zinc-500"} ${isGameOver && time1 === 0 ? "bg-red-600 text-white" : ""} ${!isGameOver && activePlayer === 1 ? "shadow-[inset_0_0_100px_rgba(0,0,0,0.1)]" : ""} `}
        >
          <span className="text-[25vw] leading-none font-black tracking-tighter tabular-nums landscape:text-[20vh]">
            {formatTime(time1)}
          </span>
          <span className="mt-4 text-sm font-medium tracking-[0.2em] uppercase opacity-50">
            {p1Name || "Player 1"}
          </span>
        </button>

        <div className="flex h-24 items-center justify-around border-y border-zinc-800 bg-zinc-900 px-8">
          <button
            onClick={onReset}
            className="rounded-full bg-zinc-800 px-6 py-2 text-xs font-bold tracking-widest text-zinc-400"
          >
            Settings
          </button>
          <button
            onClick={onPause}
            className="rounded-full border border-white bg-white px-8 py-2 text-xs font-bold tracking-widest text-zinc-950"
          >
            {activePlayer === 0 && !isGameOver ? "Resume" : "Pause"}
          </button>
        </div>

        <button
          onTouchStart={(e) => handleTouchStart(e, 2)}
          onMouseDown={(e) => handleMouseDown(e, 2)}
          disabled={isGameOver}
          className={`flex w-full flex-1 flex-col items-center justify-center transition-colors duration-300 ${activePlayer === 2 ? "bg-white text-zinc-900" : "bg-zinc-900 text-zinc-500"} ${isGameOver && time2 === 0 ? "bg-red-600 text-white" : ""} ${!isGameOver && activePlayer === 2 ? "shadow-[inset_0_0_100px_rgba(0,0,0,0.1)]" : ""} `}
        >
          <span className="text-[25vw] leading-none font-black tracking-tighter tabular-nums landscape:text-[20vh]">
            {formatTime(time2)}
          </span>
          <span className="mt-4 text-sm font-medium tracking-[0.2em] uppercase opacity-50">
            {p2Name || "Player 2"}
          </span>
        </button>
      </div>
    </div>
  );
};
